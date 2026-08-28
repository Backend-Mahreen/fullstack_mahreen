import { isApiUnavailableError } from "../../api/apiError";
import { env } from "../../config/env";
import type {
  AuthResult,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegistrationDraft,
} from "../../types/auth";
import { readJson } from "../storage/browserStorage";
import { AUTH_STORAGE_KEYS } from "./authConstants";

type ApiAuthAdapter = typeof import("./apiAuthAdapter")["apiAuthAdapter"];
type LocalAuthAdapter = typeof import("./localAuthAdapter")["localAuthAdapter"];

const loadApiAuthAdapter = async (): Promise<ApiAuthAdapter> =>
  (await import("./apiAuthAdapter")).apiAuthAdapter;

const loadLocalAuthAdapter = async (): Promise<LocalAuthAdapter> =>
  (await import("./localAuthAdapter")).localAuthAdapter;

const withConfiguredAdapter = async <T,>(
  apiOperation: (adapter: ApiAuthAdapter) => Promise<T>,
  localOperation: (adapter: LocalAuthAdapter) => Promise<T>,
): Promise<T> => {
  if (env.dataSourceMode === "local") {
    return localOperation(await loadLocalAuthAdapter());
  }

  if (env.dataSourceMode === "api") {
    return apiOperation(await loadApiAuthAdapter());
  }

  try {
    return await apiOperation(await loadApiAuthAdapter());
  } catch (error) {
    if (!env.enableLocalFallback || !isApiUnavailableError(error)) throw error;
    return localOperation(await loadLocalAuthAdapter());
  }
};

export const authService = {
  register(draft: RegistrationDraft) {
    return withConfiguredAdapter(
      (adapter) => adapter.register(draft),
      (adapter) => adapter.register(draft),
    );
  },

  login(credentials: LoginCredentials) {
    return withConfiguredAdapter(
      (adapter) => adapter.login(credentials),
      (adapter) => adapter.login(credentials),
    );
  },

  loginAdmin(credentials: LoginCredentials) {
    return withConfiguredAdapter(
      (adapter) => adapter.loginAdmin(credentials),
      (adapter) => adapter.login(credentials),
    );
  },

  logout() {
    return withConfiguredAdapter(
      (adapter) => adapter.logout(),
      (adapter) => adapter.logout(),
    );
  },

  requestPasswordReset(email: string) {
    return withConfiguredAdapter(
      (adapter) => adapter.requestPasswordReset(email),
      (adapter) => adapter.requestPasswordReset(email),
    );
  },

  resetPassword(token: string, newPassword: string) {
    return withConfiguredAdapter(
      (adapter) => adapter.resetPassword(token, newPassword),
      (adapter) => adapter.resetPassword(token, newPassword),
    );
  },

  changePassword(accountId: string, currentPassword: string, newPassword: string) {
    return withConfiguredAdapter(
      (adapter) => adapter.changePassword(accountId, currentPassword, newPassword),
      (adapter) => adapter.changePassword(accountId, currentPassword, newPassword),
    );
  },

  updateProfile(accountId: string, updates: Partial<AuthUser>) {
    return withConfiguredAdapter(
      (adapter) => adapter.updateProfile(accountId, updates),
      (adapter) => adapter.updateProfile(accountId, updates),
    );
  },

  getCurrent() {
    return withConfiguredAdapter(
      (adapter) => adapter.getCurrent(),
      (adapter) => adapter.getCurrent(),
    );
  },

  getCached() {
    // Coba hapus sisa cache sessionStorage lama agar tidak konflik
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.session);
        window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.user);
      } catch {
        // Abaikan
      }
    }

    const session = readJson<AuthSession | null>(
      "local",
      AUTH_STORAGE_KEYS.session,
      null,
    );
    const user = readJson<AuthUser | null>(
      "local",
      AUTH_STORAGE_KEYS.user,
      null,
    );

    return session && user ? ({ session, user } satisfies AuthResult) : null;
  },
};
