import type { AuthSession, AuthUser } from "../../types/auth";
import {
  emitPlatformDataChange,
  subscribeToPlatformData,
} from "../storage/browserStorage";

export const CLIENT_SECURITY_STORAGE_PREFIX = "mahreen:client-security:v1";
const CLIENT_SECURITY_EVENT = "mahreen:client-security-change";

export type ClientDeviceSession = {
  id: string;
  device: string;
  location: string;
  browser: string;
  app: string;
  lastActiveAt: string;
  current: boolean;
  type: "desktop" | "mobile";
};

export type ClientLoginRecord = {
  id: string;
  occurredAt: string;
  status: "Berhasil" | "Gagal";
  ip: string;
  location: string;
};

export type ClientSecurityPreferences = {
  profileVisible: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: "SMS (Mobile)";
};

export type ClientSecuritySnapshot = {
  sessions: ClientDeviceSession[];
  loginActivity: ClientLoginRecord[];
  preferences: ClientSecurityPreferences;
  updatedAt: string;
};

export interface ClientSecurityRepository {
  getSnapshot(accountId: string): ClientSecuritySnapshot;
  recordSuccessfulLogin(
    user: AuthUser,
    session: AuthSession,
  ): ClientSecuritySnapshot;
  removeSession(accountId: string, sessionId: string): ClientSecuritySnapshot;
  removeOtherSessions(accountId: string): ClientSecuritySnapshot;
  updatePreferences(
    accountId: string,
    patch: Partial<ClientSecurityPreferences>,
  ): ClientSecuritySnapshot;
  subscribe(listener: () => void): () => void;
}

const createEmptySnapshot = (): ClientSecuritySnapshot => ({
  sessions: [],
  loginActivity: [],
  preferences: {
    profileVisible: true,
    twoFactorEnabled: true,
    twoFactorMethod: "SMS (Mobile)",
  },
  updatedAt: new Date(0).toISOString(),
});

const normalizeAccountId = (accountId: string) =>
  accountId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_") || "anonymous";

const getStorageKey = (accountId: string) =>
  `${CLIENT_SECURITY_STORAGE_PREFIX}:${normalizeAccountId(accountId)}`;

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isDeviceSession = (value: unknown): value is ClientDeviceSession => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ClientDeviceSession>;
  return (
    isString(entry.id) &&
    isString(entry.device) &&
    isString(entry.location) &&
    typeof entry.browser === "string" &&
    typeof entry.app === "string" &&
    isString(entry.lastActiveAt) &&
    typeof entry.current === "boolean" &&
    (entry.type === "desktop" || entry.type === "mobile")
  );
};

const isLoginRecord = (value: unknown): value is ClientLoginRecord => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ClientLoginRecord>;
  return (
    isString(entry.id) &&
    isString(entry.occurredAt) &&
    (entry.status === "Berhasil" || entry.status === "Gagal") &&
    isString(entry.ip) &&
    isString(entry.location)
  );
};

const readSnapshot = (accountId: string): ClientSecuritySnapshot => {
  if (typeof window === "undefined") return createEmptySnapshot();

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(getStorageKey(accountId)) ?? "null",
    ) as Partial<ClientSecuritySnapshot> | null;
    if (!parsed || typeof parsed !== "object") return createEmptySnapshot();

    const preferences = parsed.preferences ?? createEmptySnapshot().preferences;
    return {
      sessions: Array.isArray(parsed.sessions)
        ? parsed.sessions.filter(isDeviceSession)
        : [],
      loginActivity: Array.isArray(parsed.loginActivity)
        ? parsed.loginActivity.filter(isLoginRecord)
        : [],
      preferences: {
        profileVisible: preferences.profileVisible !== false,
        twoFactorEnabled: preferences.twoFactorEnabled === true,
        twoFactorMethod: "SMS (Mobile)",
      },
      updatedAt: isString(parsed.updatedAt)
        ? parsed.updatedAt
        : new Date(0).toISOString(),
    };
  } catch {
    return createEmptySnapshot();
  }
};

const writeSnapshot = (
  accountId: string,
  snapshot: ClientSecuritySnapshot,
): ClientSecuritySnapshot => {
  if (typeof window === "undefined") return snapshot;

  try {
    const key = getStorageKey(accountId);
    const serialized = JSON.stringify(snapshot);
    if (window.localStorage.getItem(key) === serialized) return snapshot;
    window.localStorage.setItem(key, serialized);
    window.dispatchEvent(new CustomEvent(CLIENT_SECURITY_EVENT));
    emitPlatformDataChange();
  } catch {
    // Snapshot in memory remains usable when browser storage is blocked.
  }
  return snapshot;
};

const detectBrowser = (userAgent: string) => {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Safari\//i.test(userAgent)) return "Safari";
  return "Browser";
};

const createCurrentDeviceSession = (
  user: AuthUser,
  session: AuthSession,
): ClientDeviceSession => {
  const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|Mobile/i.test(userAgent);
  const platform =
    typeof navigator === "undefined" || !navigator.platform
      ? isMobile
        ? "Mobile Device"
        : "Desktop Device"
      : navigator.platform;
  const location = [user.city, user.province].filter(Boolean).join(", ");

  return {
    id: `session:${session.loggedInAt}`,
    device: platform,
    location: location || "Lokasi akun tidak diatur",
    browser: detectBrowser(userAgent),
    app: "",
    lastActiveAt: session.loggedInAt,
    current: true,
    type: isMobile ? "mobile" : "desktop",
  };
};

const recordSuccessfulLogin = (
  user: AuthUser,
  session: AuthSession,
): ClientSecuritySnapshot => {
  const current = readSnapshot(user.id);
  const currentDevice = createCurrentDeviceSession(user, session);
  const sessions = [
    currentDevice,
    ...current.sessions
      .filter((entry) => entry.id !== currentDevice.id)
      .map((entry) => ({ ...entry, current: false })),
  ].slice(0, 8);
  const activityId = `login:${session.loggedInAt}`;
  const loginActivity = current.loginActivity.some(
    (entry) => entry.id === activityId,
  )
    ? current.loginActivity
    : [
        {
          id: activityId,
          occurredAt: session.loggedInAt,
          status: "Berhasil" as const,
          ip: "Penyimpanan lokal",
          location: currentDevice.location,
        },
        ...current.loginActivity,
      ].slice(0, 12);

  return writeSnapshot(user.id, {
    ...current,
    sessions,
    loginActivity,
    updatedAt: new Date().toISOString(),
  });
};

export const localClientSecurityRepository: ClientSecurityRepository = {
  getSnapshot: readSnapshot,
  recordSuccessfulLogin,
  removeSession(accountId, sessionId) {
    const current = readSnapshot(accountId);
    const target = current.sessions.find((session) => session.id === sessionId);
    if (!target || target.current) return current;
    return writeSnapshot(accountId, {
      ...current,
      sessions: current.sessions.filter((session) => session.id !== sessionId),
      updatedAt: new Date().toISOString(),
    });
  },
  removeOtherSessions(accountId) {
    const current = readSnapshot(accountId);
    return writeSnapshot(accountId, {
      ...current,
      sessions: current.sessions.filter((session) => session.current),
      updatedAt: new Date().toISOString(),
    });
  },
  updatePreferences(accountId, patch) {
    const current = readSnapshot(accountId);
    return writeSnapshot(accountId, {
      ...current,
      preferences: {
        ...current.preferences,
        ...patch,
        twoFactorMethod: "SMS (Mobile)",
      },
      updatedAt: new Date().toISOString(),
    });
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(CLIENT_SECURITY_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(CLIENT_SECURITY_EVENT, listener);
    };
  },
};

import { apiClientSecurityRepository } from "./apiClientSecurityRepository";

export const clientSecurityRepository: ClientSecurityRepository =
  apiClientSecurityRepository;

export const createClientSecurityExport = (
  user: AuthUser,
  snapshot: ClientSecuritySnapshot,
) => ({
  exportedAt: new Date().toISOString(),
  account: {
    id: user.id,
    fullName: user.fullName,
    nickname: user.nickname,
    email: user.email,
    whatsapp: user.whatsapp,
    role: user.role,
    createdAt: user.createdAt,
  },
  security: snapshot,
});
