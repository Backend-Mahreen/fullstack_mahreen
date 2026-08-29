import type { AuthSession, AuthUser } from "../../types/auth";
import type {
  ClientDeviceSession,
  ClientSecuritySnapshot,
  ClientSecurityRepository,
} from "./clientSecurityRepository";

const emptySnapshot: ClientSecuritySnapshot = {
  sessions: [],
  loginActivity: [],
  preferences: { profileVisible: true, twoFactorEnabled: false, twoFactorMethod: "SMS (Mobile)" },
  updatedAt: new Date(0).toISOString(),
};

const SESSION_STORAGE_KEY = "mahreen:client-security:v1";

const isBrowser = () => typeof window !== "undefined";

const readSnapshot = (accountId: string): ClientSecuritySnapshot => {
  if (!isBrowser()) return emptySnapshot;

  try {
    const key = `${SESSION_STORAGE_KEY}:${accountId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_") || "anonymous"}`;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return emptySnapshot;

    const parsed = JSON.parse(raw) as Partial<ClientSecuritySnapshot>;
    if (!parsed || typeof parsed !== "object") return emptySnapshot;

    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      loginActivity: Array.isArray(parsed.loginActivity) ? parsed.loginActivity : [],
      preferences: {
        profileVisible: parsed.preferences?.profileVisible !== false,
        twoFactorEnabled: parsed.preferences?.twoFactorEnabled === true,
        twoFactorMethod: "SMS (Mobile)",
      },
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return emptySnapshot;
  }
};

const writeSnapshot = (
  accountId: string,
  snapshot: ClientSecuritySnapshot,
): ClientSecuritySnapshot => {
  if (!isBrowser()) return snapshot;

  try {
    const key = `${SESSION_STORAGE_KEY}:${accountId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_") || "anonymous"}`;
    window.sessionStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // Session remains in memory when sessionStorage is unavailable.
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
      ? isMobile ? "Mobile Device" : "Desktop Device"
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

export const apiClientSecurityRepository: ClientSecurityRepository = {
  getSnapshot(accountId) {
    return readSnapshot(accountId);
  },

  recordSuccessfulLogin(user, session) {
    const current = readSnapshot(user.id);
    const currentDevice = createCurrentDeviceSession(user, session);
    const sessions = [
      currentDevice,
      ...current.sessions
        .filter((entry) => entry.id !== currentDevice.id)
        .map((entry) => ({ ...entry, current: false })),
    ].slice(0, 8);

    const activityId = `login:${session.loggedInAt}`;
    const loginActivity = current.loginActivity.some((entry) => entry.id === activityId)
      ? current.loginActivity
      : [
          {
            id: activityId,
            occurredAt: session.loggedInAt,
            status: "Berhasil" as const,
            ip: "Session storage",
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
  },

  removeSession(accountId, sessionId) {
    const current = readSnapshot(accountId);
    const target = current.sessions.find((s) => s.id === sessionId);
    if (!target || target.current) return current;

    return writeSnapshot(accountId, {
      ...current,
      sessions: current.sessions.filter((s) => s.id !== sessionId),
      updatedAt: new Date().toISOString(),
    });
  },

  removeOtherSessions(accountId) {
    const current = readSnapshot(accountId);
    return writeSnapshot(accountId, {
      ...current,
      sessions: current.sessions.filter((s) => s.current),
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
    const handler = () => listener();
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  },
};
