import { createContext } from "react";
import type { DataSourceMode } from "../config/env";
import type {
  AuthResult,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegistrationDraft,
} from "../types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  dataSourceMode: DataSourceMode;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  loginAdmin: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (draft: RegistrationDraft) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
