type StorageKind = "local" | "session";

export const PLATFORM_DATA_CHANGE_EVENT = "mahreen:platform-data-change";

export const emitPlatformDataChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PLATFORM_DATA_CHANGE_EVENT));
  }
};

export const subscribeToPlatformData = (listener: () => void) => {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", listener);
  window.addEventListener(PLATFORM_DATA_CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(PLATFORM_DATA_CHANGE_EVENT, listener);
  };
};

const getStorage = (kind: StorageKind): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const readJson = <T,>(kind: StorageKind, key: string, fallback: T): T => {
  const storage = getStorage(kind);
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = <T,>(kind: StorageKind, key: string, value: T) => {
  const storage = getStorage(kind);
  if (!storage) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    emitPlatformDataChange();
    return true;
  } catch {
    return false;
  }
};

export const removeStoredValue = (kind: StorageKind, key: string) => {
  const storage = getStorage(kind);
  if (!storage) return;

  try {
    storage.removeItem(key);
    emitPlatformDataChange();
  } catch {
    // Browser storage may be unavailable in privacy-restricted environments.
  }
};
