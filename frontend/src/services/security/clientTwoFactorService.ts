import type { AuthUser } from "../../types/auth";
import { normalizeE164PhoneNumber } from "../../utils/phoneNumber";
import {
  emitPlatformDataChange,
  subscribeToPlatformData,
} from "../storage/browserStorage";

export type ClientTwoFactorSettings = {
  enabled: boolean;
  method: "SMS / WhatsApp OTP";
  phoneNumber: string;
  recoveryCode: string;
  updatedAt: string;
};

const STORAGE_PREFIX = "mahreen:client-two-factor:v1";
const TWO_FACTOR_EVENT = "mahreen:client-two-factor-change";

const storageKey = (accountId: string) =>
  STORAGE_PREFIX + ":" + (accountId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_") || "anonymous");

const createRecoveryCode = () => {
  const random = () => Math.floor(1000 + Math.random() * 9000);
  return "MHR-" + random() + "-" + random();
};

const defaultSettings = (user: AuthUser): ClientTwoFactorSettings => ({
  enabled: true,
  method: "SMS / WhatsApp OTP",
  phoneNumber: normalizeE164PhoneNumber(user.whatsapp || "+62 812 0000 5678"),
  recoveryCode: createRecoveryCode(),
  updatedAt: new Date().toISOString(),
});

const isSettings = (value: unknown): value is ClientTwoFactorSettings => {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ClientTwoFactorSettings>;
  return Boolean(
    typeof record.enabled === "boolean" &&
      record.method === "SMS / WhatsApp OTP" &&
      record.phoneNumber &&
      record.recoveryCode &&
      record.updatedAt,
  );
};

const readLocal = (user: AuthUser) => {
  if (typeof window === "undefined") return defaultSettings(user);
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(storageKey(user.id)) || "null",
    );
    if (isSettings(parsed)) return parsed;
  } catch {
    // Gunakan state awal saat penyimpanan perangkat tidak dapat dibaca.
  }

  const initial = defaultSettings(user);
  window.localStorage.setItem(storageKey(user.id), JSON.stringify(initial));
  return initial;
};

const writeLocal = (user: AuthUser, settings: ClientTwoFactorSettings) => {
  if (typeof window === "undefined") return settings;
  window.localStorage.setItem(storageKey(user.id), JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(TWO_FACTOR_EVENT));
  emitPlatformDataChange();
  return settings;
};

export const maskSecurityPhone = (value: string) => {
  const normalized = normalizeE164PhoneNumber(value);
  const digits = normalized.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    const local = digits.slice(2);
    const prefix = local.slice(0, 3) || "812";
    const suffix = local.slice(-4) || "5678";
    return "+62 " + prefix + " •••• " + suffix;
  }

  const prefix = digits.slice(0, Math.min(4, Math.max(1, digits.length - 4)));
  const suffix = digits.slice(-4);
  return "+" + prefix + " •••• " + suffix;
};

export const clientTwoFactorService = {
  getInitial(user: AuthUser) {
    return readLocal(user);
  },
  load(user: AuthUser) {
    return Promise.resolve(readLocal(user));
  },
  updatePhone(user: AuthUser, phoneNumber: string) {
    const normalized = normalizeE164PhoneNumber(phoneNumber);
    if (normalized.replace(/\D/g, "").length < 10) {
      throw new Error("Nomor telepon belum lengkap.");
    }
    return writeLocal(user, {
      ...readLocal(user),
      enabled: true,
      phoneNumber: normalized,
      updatedAt: new Date().toISOString(),
    });
  },
  rotateRecoveryCode(user: AuthUser) {
    return writeLocal(user, {
      ...readLocal(user),
      recoveryCode: createRecoveryCode(),
      updatedAt: new Date().toISOString(),
    });
  },
  subscribe(listener: () => void) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(TWO_FACTOR_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(TWO_FACTOR_EVENT, listener);
    };
  },
};
