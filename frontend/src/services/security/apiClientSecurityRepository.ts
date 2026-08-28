import type {
  ClientSecuritySnapshot,
  ClientSecurityRepository,
} from "./clientSecurityRepository";

const emptySnapshot: ClientSecuritySnapshot = {
  sessions: [], loginActivity: [],
  preferences: { profileVisible: true, twoFactorEnabled: false, twoFactorMethod: "SMS (Mobile)" },
  updatedAt: new Date(0).toISOString(),
};

const cachedSnapshot: ClientSecuritySnapshot = emptySnapshot;

export const apiClientSecurityRepository: ClientSecurityRepository = {
  getSnapshot(_accountId) { return cachedSnapshot; },
  recordSuccessfulLogin(_user, _session) { return cachedSnapshot; },
  removeSession() { return cachedSnapshot; },
  removeOtherSessions() { return cachedSnapshot; },
  updatePreferences(_accountId, _patch) { return cachedSnapshot; },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    // Simpan referensi handler agar bisa dilepas saat unsubscribe.
    // Sebelumnya listener tidak pernah dihapus sehingga menumpuk di setiap
    // mount ulang komponen (termasuk StrictMode double-mount).
    const handler = () => listener();
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  },
};
