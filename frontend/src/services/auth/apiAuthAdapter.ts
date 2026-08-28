import { apiClient } from "../../api/apiClient";
import { ApiError } from "../../api/apiError";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  AccountRole,
  AuthResult,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegistrationDraft,
} from "../../types/auth";
import { readJson, removeStoredValue, writeJson } from "../storage/browserStorage";
import { AUTH_STATE_EVENT, AUTH_STORAGE_KEYS } from "./authConstants";
import { registrationDraftService } from "./registrationDraftService";

type ApiAuthResponse = AuthResult | { user: AuthUser; session?: AuthSession } | AuthUser;

const dispatchAuthStateChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT));
  }
};

const normalizeUserRole = (user: AuthUser): AuthUser => ({
  ...user,
  role: (user.role ?? "client") as AccountRole,
});

const createSessionFromUser = (user: AuthUser): AuthSession => ({
  accountId: user.id,
  email: user.email,
  fullName: user.fullName,
  accountType: user.accountType,
  role: user.role ?? "client",
  loggedInAt: new Date().toISOString(),
});

const normalizeAuthResult = (response: ApiAuthResponse): AuthResult => {
  if ("user" in response) {
    return {
      user: normalizeUserRole(response.user),
      session: response.session
        ? { ...response.session, role: response.session.role ?? response.user.role ?? "client" }
        : createSessionFromUser(normalizeUserRole(response.user)),
    };
  }

  const user = normalizeUserRole(response);
  return { user, session: createSessionFromUser(user) };
};

const storeCache = (result: AuthResult, remember: boolean) => {
  // Persistensi login disimpan di localStorage untuk kelancaran multi-tab.
  // Keamanan tetap terjaga karena access token berumur pendek (15 menit)
  // dan refresh token diurus otomatis oleh backend via cookie httpOnly.
  void remember;
  removeStoredValue("session", AUTH_STORAGE_KEYS.session);
  removeStoredValue("session", AUTH_STORAGE_KEYS.user);
  writeJson("local", AUTH_STORAGE_KEYS.session, result.session);
  writeJson("local", AUTH_STORAGE_KEYS.user, result.user);
  dispatchAuthStateChange();
};

const clearCache = () => {
  removeStoredValue("local", AUTH_STORAGE_KEYS.session);
  removeStoredValue("session", AUTH_STORAGE_KEYS.session);
  removeStoredValue("local", AUTH_STORAGE_KEYS.user);
  removeStoredValue("session", AUTH_STORAGE_KEYS.user);
  dispatchAuthStateChange();
};

export const apiAuthAdapter = {
  async register(draft: RegistrationDraft): Promise<AuthUser> {
    const response = await apiClient<ApiAuthResponse>(API_ENDPOINTS.auth.register, {
      method: "POST",
      body: draft,
    });
    const result = normalizeAuthResult(response);
    registrationDraftService.clear();
    return result.user;
  },

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await apiClient<ApiAuthResponse>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: {
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember,
      },
    });
    const result = normalizeAuthResult(response);
    storeCache(result, credentials.remember);
    return result;
  },

  async loginAdmin(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await apiClient<ApiAuthResponse>(API_ENDPOINTS.auth.adminLogin, {
      method: "POST",
      body: {
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember,
      },
    });
    const result = normalizeAuthResult(response);
    storeCache(result, credentials.remember);
    return result;
  },

  async logout() {
    try {
      await apiClient<unknown>(API_ENDPOINTS.auth.logout, { method: "POST" });
    } finally {
      clearCache();
    }
  },

  async requestPasswordReset(email: string): Promise<{ demoToken?: string }> {
    await apiClient<unknown>(API_ENDPOINTS.auth.forgotPassword, {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
    });
    return {};
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient<unknown>(API_ENDPOINTS.auth.resetPassword, {
      method: "POST",
      body: { token, password: newPassword },
    });
  },

  async changePassword(
    _accountId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient<unknown>(API_ENDPOINTS.auth.changePassword, {
      method: "POST",
      body: { currentPassword, newPassword },
    });
  },

  async updateProfile(
    _accountId: string,
    updates: Partial<AuthUser>,
  ): Promise<AuthUser> {
    const response = await apiClient<ApiAuthResponse>(API_ENDPOINTS.auth.profile, {
      method: "PATCH",
      body: updates,
    });
    const result = normalizeAuthResult(response);
    storeCache(result, false);
    return result.user;
  },

  async getCurrent(): Promise<AuthResult | null> {
    try {
      const response = await apiClient<ApiAuthResponse>(API_ENDPOINTS.auth.me);
      const result = normalizeAuthResult(response);
      storeCache(result, false);
      return result;
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearCache();
      }
      throw error;
    }
  },

  getCached(): AuthResult | null {
    const session = readJson<AuthSession | null>(
      "session",
      AUTH_STORAGE_KEYS.session,
      null,
    );
    const user = readJson<AuthUser | null>(
      "session",
      AUTH_STORAGE_KEYS.user,
      null,
    );

    return session && user ? { session, user } : null;
  },
};
