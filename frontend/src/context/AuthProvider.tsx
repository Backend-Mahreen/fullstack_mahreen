import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_STATE_EVENT } from "../services/auth/authConstants";
import { authService } from "../services/auth/authService";
import { clientSecurityRepository } from "../services/security/clientSecurityRepository";
import { env } from "../config/env";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegistrationDraft,
} from "../types/auth";
import { AuthContext, type AuthContextValue } from "./authContextValue";

export const AuthProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [initialCached] = useState(() => authService.getCached());
  const [user, setUser] = useState<AuthUser | null>(initialCached?.user ?? null);
  const [session, setSession] = useState<AuthSession | null>(initialCached?.session ?? null);
  const [isLoading, setIsLoading] = useState(Boolean(initialCached));

  const syncCachedState = useCallback(() => {
    const next = authService.getCached();
    setUser(next?.user ?? null);
    setSession(next?.session ?? null);
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await authService.getCurrent();
      setUser(result?.user ?? null);
      setSession(result?.session ?? null);
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Jangan panggil /api/auth/me bila tidak ada token tersimpan sama sekali.
    // Tanpa guard ini, setiap reload halaman akan menghasilkan 401 di console
    // meskipun pengguna memang belum login.
    if (!initialCached || !initialCached.session?.accountId) return;

    const controller = new AbortController();

    authService
      .getCurrent()
      .then((result) => {
        if (controller.signal.aborted) return;
        setUser(result?.user ?? null);
        setSession(result?.session ?? null);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setUser(null);
        setSession(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [initialCached]);

  useEffect(() => {
    window.addEventListener(AUTH_STATE_EVENT, syncCachedState);
    window.addEventListener("storage", syncCachedState);
    return () => {
      window.removeEventListener(AUTH_STATE_EVENT, syncCachedState);
      window.removeEventListener("storage", syncCachedState);
    };
  }, [syncCachedState]);

  useEffect(() => {
    document.body.classList.toggle(
      "mahreen-authenticated",
      Boolean(user && session),
    );

    return () => {
      document.body.classList.remove("mahreen-authenticated");
    };
  }, [session, user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.user.role === "client") {
      clientSecurityRepository.recordSuccessfulLogin(
        result.user,
        result.session,
      );
    }
    setUser(result.user);
    setSession(result.session);
    return result;
  }, []);

  const loginAdmin = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.loginAdmin(credentials);
    setUser(result.user);
    setSession(result.session);
    return result;
  }, []);

  const register = useCallback(
    (draft: RegistrationDraft) => authService.register(draft),
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user && session),
      isLoading,
      dataSourceMode: env.dataSourceMode,
      login,
      loginAdmin,
      register,
      logout,
      refresh,
    }),
    [isLoading, login, loginAdmin, logout, refresh, register, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
