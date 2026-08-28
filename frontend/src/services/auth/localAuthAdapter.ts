import type {
  AccountRole,
  AuthResult,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegistrationDraft,
  StoredAccount,
} from "../../types/auth";
import { readJson, removeStoredValue, writeJson } from "../storage/browserStorage";
import {
  AUTH_STATE_EVENT,
  AUTH_STORAGE_KEYS,
  LOCAL_ADMIN_CREDENTIALS,
  LOCAL_DEMO_CREDENTIALS,
  LOCAL_INTERN_CREDENTIALS,
  emptyRegistrationDraft,
} from "./authConstants";
import { registrationDraftService } from "./registrationDraftService";

const LOCAL_PASSWORD_RESET_KEY = "mahreen:local-password-reset";
const LOCAL_PASSWORD_RESET_TTL_MS = 15 * 60 * 1000;

type LocalPasswordReset = {
  token: string;
  email: string;
  expiresAt: number;
};

const dispatchAuthStateChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT));
  }
};

const toAuthUser = ({ password, ...user }: StoredAccount): AuthUser => {
  void password;
  return user;
};

const getAccounts = (): StoredAccount[] =>
  readJson<Array<StoredAccount & { role?: AccountRole }>>("local", AUTH_STORAGE_KEYS.accounts, [])
    .filter(
      (account) =>
        account.email.trim().toLowerCase() !== LOCAL_ADMIN_CREDENTIALS.email,
    )
    .map((account): StoredAccount => ({
      ...account,
      role: account.id === "MHR-INTERN-DEMO" ? "intern" : "client",
    }));

const localProfiles: Record<AccountRole, Pick<StoredAccount, "id" | "role" | "fullName" | "nickname" | "email" | "password" | "jobTitle">> = {
  client: { id: "MHR-DEMO", role: "client", fullName: "Mahreen Demo User", nickname: "Mahreen", email: LOCAL_DEMO_CREDENTIALS.email, password: LOCAL_DEMO_CREDENTIALS.password, jobTitle: "Creative Professional" },
  intern: { id: "MHR-INTERN-DEMO", role: "intern", fullName: "Mahreen Intern Demo", nickname: "Intern", email: LOCAL_INTERN_CREDENTIALS.email, password: LOCAL_INTERN_CREDENTIALS.password, jobTitle: "UI/UX Intern" },
  admin: { id: "MHR-ADMIN", role: "admin", fullName: "Admin Mahreen", nickname: "Admin", email: LOCAL_ADMIN_CREDENTIALS.email, password: LOCAL_ADMIN_CREDENTIALS.password, jobTitle: "Super Administrator" },
  superadmin: { id: "MHR-SUPERADMIN", role: "superadmin", fullName: "Super Admin Mahreen", nickname: "SuperAdmin", email: LOCAL_ADMIN_CREDENTIALS.email, password: LOCAL_ADMIN_CREDENTIALS.password, jobTitle: "Super Administrator" },
};

const createLocalAccount = (role: AccountRole = "client"): StoredAccount => ({
  ...emptyRegistrationDraft,
  ...localProfiles[role],
  accountType: "individual",
  whatsapp: "+62 812 0000 2026",
  institution: "Mahreen Tech Corp",
  country: "Indonesia",
  province: "DKI Jakarta",
  city: "South Jakarta",
  address: "Sudirman Central Business District, Treasury Tower Lt. 18, Senayan, Kebayoran Baru",
  birthDate: "1992-05-14",
  linkedin: "linkedin.com/in/alexmahreen",
  interests: ["Tanya Mahreen", "Mahreen Studio", "Exclusive Events"],
  createdAt: new Date().toISOString(),
});

const findAccount = (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === LOCAL_ADMIN_CREDENTIALS.email) {
    return password === LOCAL_ADMIN_CREDENTIALS.password
      ? createLocalAccount("admin")
      : null;
  }

  const accounts = getAccounts();
  const savedAccount = accounts.find(
    (item) => item.email.trim().toLowerCase() === normalizedEmail,
  );

  if (savedAccount) return savedAccount.password === password ? savedAccount : null;
  const demoRole = (Object.keys(localProfiles) as AccountRole[]).find((role) => {
    const demo = localProfiles[role];
    return demo.email === normalizedEmail && demo.password === password;
  });
  return demoRole ? createLocalAccount(demoRole) : null;
};

const findAccountByEmail = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === LOCAL_ADMIN_CREDENTIALS.email) {
    return createLocalAccount("admin");
  }

  const savedAccount = getAccounts().find(
    (item) => item.email.trim().toLowerCase() === normalizedEmail,
  );
  if (savedAccount) return savedAccount;

  const demoRole = (Object.keys(localProfiles) as AccountRole[]).find(
    (role) => localProfiles[role].email === normalizedEmail,
  );
  return demoRole ? createLocalAccount(demoRole) : null;
};

const buildSession = (account: StoredAccount): AuthSession => ({
  accountId: account.id,
  email: account.email,
  fullName: account.fullName,
  accountType: account.accountType,
  role: account.role,
  loggedInAt: new Date().toISOString(),
});


const replaceAccount = (account: StoredAccount) => {
  const accounts = getAccounts();
  const nextAccounts = accounts.some((item) => item.id === account.id)
    ? accounts.map((item) => item.id === account.id ? account : item)
    : [...accounts, account];
  writeJson("local", AUTH_STORAGE_KEYS.accounts, nextAccounts);
};

const refreshCachedAccount = (account: StoredAccount) => {
  const user = toAuthUser(account);
  (["local", "session"] as const).forEach((storage) => {
    const session = readJson<AuthSession | null>(storage, AUTH_STORAGE_KEYS.session, null);
    if (!session || session.accountId !== account.id) return;
    writeJson(storage, AUTH_STORAGE_KEYS.user, user);
    writeJson(storage, AUTH_STORAGE_KEYS.session, {
      ...session,
      email: account.email,
      fullName: account.fullName,
      accountType: account.accountType,
      role: account.role,
    });
  });
  dispatchAuthStateChange();
};

const storeAuthResult = (result: AuthResult, remember: boolean) => {
  const target = remember ? "local" : "session";
  const other = remember ? "session" : "local";

  removeStoredValue(other, AUTH_STORAGE_KEYS.session);
  removeStoredValue(other, AUTH_STORAGE_KEYS.user);
  writeJson(target, AUTH_STORAGE_KEYS.session, result.session);
  writeJson(target, AUTH_STORAGE_KEYS.user, result.user);
  dispatchAuthStateChange();
};

export const localAuthAdapter = {
  async register(draft: RegistrationDraft): Promise<AuthUser> {
    const accounts = getAccounts();
    const normalizedEmail = draft.email.trim().toLowerCase();

    if (!draft.accountType) throw new Error("Tipe akun belum dipilih.");
    if (normalizedEmail === LOCAL_ADMIN_CREDENTIALS.email) {
      throw new Error("Email tersebut merupakan akun sistem dan tidak dapat didaftarkan.");
    }
    if (
      accounts.some(
        (account) => account.email.trim().toLowerCase() === normalizedEmail,
      )
    ) {
      throw new Error("Email tersebut sudah terdaftar. Silakan masuk ke akun Anda.");
    }

    const account: StoredAccount = {
      ...draft,
      accountType: draft.accountType,
      role: "client",
      email: normalizedEmail,
      id: `MHR-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    writeJson("local", AUTH_STORAGE_KEYS.accounts, [...accounts, account]);
    registrationDraftService.clear();
    return toAuthUser(account);
  },

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const account = findAccount(credentials.email, credentials.password);
    if (!account) {
      throw new Error("Email atau kata sandi tidak sesuai. Gunakan akun yang telah didaftarkan.");
    }

    const result = {
      user: toAuthUser(account),
      session: buildSession(account),
    };
    storeAuthResult(result, credentials.remember);
    return result;
  },

  async logout() {
    removeStoredValue("local", AUTH_STORAGE_KEYS.session);
    removeStoredValue("session", AUTH_STORAGE_KEYS.session);
    removeStoredValue("local", AUTH_STORAGE_KEYS.user);
    removeStoredValue("session", AUTH_STORAGE_KEYS.user);
    dispatchAuthStateChange();
  },

  async requestPasswordReset(
    email: string,
  ): Promise<{ demoToken?: string }> {
    if (email.trim().toLowerCase() === LOCAL_ADMIN_CREDENTIALS.email) {
      return {};
    }

    const account = findAccountByEmail(email);

    // Respons tetap generik agar email yang terdaftar tidak dapat ditebak.
    if (!account) return {};

    const token =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

    writeJson<LocalPasswordReset>("session", LOCAL_PASSWORD_RESET_KEY, {
      token,
      email: account.email.trim().toLowerCase(),
      expiresAt: Date.now() + LOCAL_PASSWORD_RESET_TTL_MS,
    });

    return { demoToken: token };
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const recovery = readJson<LocalPasswordReset | null>(
      "session",
      LOCAL_PASSWORD_RESET_KEY,
      null,
    );

    if (
      !recovery ||
      recovery.token !== token ||
      recovery.expiresAt < Date.now()
    ) {
      removeStoredValue("session", LOCAL_PASSWORD_RESET_KEY);
      throw new Error("Token pemulihan tidak valid atau sudah kedaluwarsa.");
    }

    const existing = findAccountByEmail(recovery.email);
    if (!existing) {
      removeStoredValue("session", LOCAL_PASSWORD_RESET_KEY);
      throw new Error("Akun tidak ditemukan.");
    }

    if (existing.email.trim().toLowerCase() === LOCAL_ADMIN_CREDENTIALS.email) {
      removeStoredValue("session", LOCAL_PASSWORD_RESET_KEY);
      throw new Error("Kata sandi akun sistem tidak dapat diubah melalui pemulihan lokal.");
    }

    const account = { ...existing, password: newPassword };
    replaceAccount(account);
    refreshCachedAccount(account);
    removeStoredValue("session", LOCAL_PASSWORD_RESET_KEY);
  },

  async changePassword(
    accountId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const accounts = getAccounts();
    const savedAccount = accounts.find((item) => item.id === accountId);
    const demoRole = (Object.keys(localProfiles) as AccountRole[]).find(
      (role) => localProfiles[role].id === accountId,
    );
    const existing = savedAccount ?? (demoRole ? createLocalAccount(demoRole) : null);

    if (!existing) throw new Error("Akun tidak ditemukan.");
    if (existing.role === "admin") {
      throw new Error("Kata sandi akun sistem tidak dapat diubah dari Client Portal.");
    }
    if (existing.password !== currentPassword) {
      throw new Error("Kata sandi saat ini tidak sesuai.");
    }
    if (existing.password === newPassword) {
      throw new Error("Kata sandi baru harus berbeda dari kata sandi saat ini.");
    }

    const account = { ...existing, password: newPassword };
    replaceAccount(account);
    refreshCachedAccount(account);
  },

  async updateProfile(accountId: string, updates: Partial<AuthUser>): Promise<AuthUser> {
    const accounts = getAccounts();
    const existing = accounts.find((item) => item.id === accountId) ??
      ((Object.keys(localProfiles) as AccountRole[]).find((role) => localProfiles[role].id === accountId)
        ? createLocalAccount((Object.keys(localProfiles) as AccountRole[]).find((role) => localProfiles[role].id === accountId)!)
        : null);
    if (!existing) throw new Error("Akun tidak ditemukan.");

    const account: StoredAccount = {
      ...existing,
      ...updates,
      id: existing.id,
      email: existing.role === "admin"
        ? LOCAL_ADMIN_CREDENTIALS.email
        : (updates.email ?? existing.email).trim().toLowerCase(),
      password: existing.password,
      accountType: existing.accountType,
      role: existing.role,
      createdAt: existing.createdAt,
    };

    const duplicateEmail = accounts.some(
      (item) => item.id !== account.id && item.email.trim().toLowerCase() === account.email,
    );
    if (duplicateEmail) throw new Error("Email tersebut sudah digunakan akun lain.");

    if (account.role !== "admin") replaceAccount(account);
    refreshCachedAccount(account);
    return toAuthUser(account);
  },

  async getCurrent(): Promise<AuthResult | null> {
    const cached = this.getCached();
    if (!cached) return null;

    if (Object.values(localProfiles).some((profile) => profile.id === cached.user.id)) {
      const savedDemo = getAccounts().find((item) => item.id === cached.user.id);
      return savedDemo ? { session: buildSession(savedDemo), user: toAuthUser(savedDemo) } : cached;
    }
    const account = getAccounts().find(
      (item) => item.id === cached.session.accountId,
    );
    if (!account) {
      await this.logout();
      return null;
    }

    return { session: cached.session, user: toAuthUser(account) };
  },

  getCached(): AuthResult | null {
    const session =
      readJson<AuthSession | null>("session", AUTH_STORAGE_KEYS.session, null) ??
      readJson<AuthSession | null>("local", AUTH_STORAGE_KEYS.session, null);
    const user =
      readJson<AuthUser | null>("session", AUTH_STORAGE_KEYS.user, null) ??
      readJson<AuthUser | null>("local", AUTH_STORAGE_KEYS.user, null);

    return session && user ? { session, user } : null;
  },
};
