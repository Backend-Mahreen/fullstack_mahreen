import type {
  DirectoryAuditEntry,
  DirectoryUser,
  DirectoryUserStatus,
  NewDirectoryUser,
} from "../../pages/DashboardAdmin/components/user-directory/types";
import type { StoredAccount } from "../../types/auth";
import { AUTH_STORAGE_KEYS } from "../auth/authConstants";
import {
  emitPlatformDataChange,
  readJson,
  subscribeToPlatformData,
  writeJson,
} from "../storage/browserStorage";

export const USER_DIRECTORY_STORAGE_KEY = "mahreen:admin-directory-users:v2";
export const USER_DIRECTORY_AUDIT_KEY = "mahreen:admin-directory-audit:v2";
export const USER_DIRECTORY_CHANGE_EVENT = "mahreen:user-directory-change";

const LEGACY_USER_DIRECTORY_STORAGE_KEY = "mahreen:admin-directory-users:v1";
const LEGACY_USER_DIRECTORY_AUDIT_KEY = "mahreen:admin-directory-audit:v1";

export type UserDirectoryMetrics = {
  totalUsers: number;
  activeNow: number;
  registrations: number;
  security: number;
};

export type UserDirectorySnapshot = {
  users: DirectoryUser[];
  auditEntries: DirectoryAuditEntry[];
  metrics: UserDirectoryMetrics;
  roles?: DirectoryRoleSummary[];
  roleBreakdown?: { role: string; count: number }[];
  monthlyGrowth?: { month: string; count: number }[];
};

export type DirectoryRoleSummary = Readonly<{
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  permissionCount: number;
}>;

export type AddDirectoryUserResult =
  | { ok: true; user: DirectoryUser }
  | { ok: false; message: string };

export type DirectoryActionResult =
  | { ok: true; user: DirectoryUser }
  | { ok: false; message: string };

export interface UserDirectoryRepository {
  getSnapshot(): UserDirectorySnapshot;
  addUser(draft: NewDirectoryUser): Promise<AddDirectoryUserResult>;
  updateUser(id: string, fields: { fullName?: string; email?: string; role?: string; status?: string }): Promise<DirectoryActionResult>;
  updateUserStatus(id: string, status: DirectoryUserStatus): Promise<DirectoryActionResult>;
  updateUserRole(id: string, role: string): Promise<DirectoryActionResult>;
  deleteUser(id: string, force?: boolean): Promise<{ ok: true } | { ok: false; message: string }>;
  recordAudit(action: string, detail: string): void;
  subscribe(listener: () => void): () => void;
}

const readCollection = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null") as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const writeCollection = (key: string, value: unknown[]) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(USER_DIRECTORY_CHANGE_EVENT));
    emitPlatformDataChange();
    return true;
  } catch {
    return false;
  }
};

const readLocalUsers = () =>
  readCollection<DirectoryUser>(
    USER_DIRECTORY_STORAGE_KEY,
    readCollection<DirectoryUser>(LEGACY_USER_DIRECTORY_STORAGE_KEY, []),
  );

const readAuthAccounts = () =>
  readJson<StoredAccount[]>("local", AUTH_STORAGE_KEYS.accounts, []).filter(
    (account) =>
      account &&
      typeof account.id === "string" &&
      typeof account.email === "string" &&
      typeof account.fullName === "string",
  );

const mapAccountToDirectoryUser = (
  account: StoredAccount,
  metadata?: DirectoryUser,
): DirectoryUser => ({
  id: account.id,
  name: account.fullName,
  email: account.email,
  division: metadata?.division ?? (account.role === "intern" ? "Internship" : "Consultancy"),
  role: metadata?.role ?? (account.role === "admin" || account.role === "superadmin" ? "Super Admin" : "Client"),
  status: metadata?.status ?? "Active",
  avatar: account.profilePhoto || metadata?.avatar,
  createdAt: account.createdAt,
});

const readAuditEntries = () =>
  readCollection<DirectoryAuditEntry>(
    USER_DIRECTORY_AUDIT_KEY,
    readCollection<DirectoryAuditEntry>(LEGACY_USER_DIRECTORY_AUDIT_KEY, []),
  );

const createAuditEntry = (action: string, detail: string): DirectoryAuditEntry => ({
  id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  action,
  detail,
  timestamp: new Date().toISOString(),
});

const recordAuditEntry = (action: string, detail: string) => {
  const entries = readAuditEntries();
  writeCollection(
    USER_DIRECTORY_AUDIT_KEY,
    [createAuditEntry(action, detail), ...entries].slice(0, 40),
  );
};

const getSnapshot = (): UserDirectorySnapshot => {
  const localUsers = readLocalUsers();
  const metadataByEmail = new Map(
    localUsers.map((user) => [user.email.trim().toLowerCase(), user]),
  );
  const authUsers = readAuthAccounts().map((account) =>
    mapAccountToDirectoryUser(
      account,
      metadataByEmail.get(account.email.trim().toLowerCase()),
    ),
  );
  const authEmails = new Set(authUsers.map((user) => user.email.trim().toLowerCase()));
  const legacyDirectoryUsers = localUsers.filter(
    (user) => !authEmails.has(user.email.trim().toLowerCase()),
  );
  const users = [...authUsers, ...legacyDirectoryUsers]
    .filter(
      (user, index, collection) =>
        collection.findIndex(
          (item) => item.email.trim().toLowerCase() === user.email.trim().toLowerCase(),
        ) === index,
    )
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  const recentThreshold = Date.now() - 30 * 86_400_000;

  return {
    users,
    auditEntries: readAuditEntries(),
    metrics: {
      totalUsers: users.length,
      activeNow: users.filter((user) => user.status === "Active").length,
      registrations: users.filter((user) => Date.parse(user.createdAt) >= recentThreshold).length,
      security: users.length
        ? Math.round(
            (users.filter((user) => user.status !== "Suspended").length / users.length) * 100,
          )
        : 100,
    },
  };
};

export const localUserDirectoryRepository: UserDirectoryRepository = {
  getSnapshot,
  async addUser(draft) {    const snapshot = getSnapshot();
    const normalizedEmail = draft.email.trim().toLowerCase();
    if (snapshot.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: "Email tersebut sudah terdaftar." };
    }
    if (draft.password.length < 8) {
      return { ok: false, message: "Kata sandi awal minimal 8 karakter." };
    }

    const id = `MHR-${Date.now().toString(36).toUpperCase()}`;
    const { password, ...directoryDraft } = draft;
    const newUser: DirectoryUser = {
      ...directoryDraft,
      id,
      name: draft.name.trim(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };
    const localUsers = readLocalUsers();
    if (!writeCollection(USER_DIRECTORY_STORAGE_KEY, [newUser, ...localUsers])) {
      return { ok: false, message: "Penyimpanan lokal tidak tersedia." };
    }
    const accounts = readAuthAccounts();
    const account: StoredAccount = {
      id,
      role: draft.division === "Internship" ? "intern" : "client",
      accountType: "individual",
      profilePhoto: "",
      fullName: draft.name.trim(),
      nickname: draft.name.trim().split(/\s+/)[0] ?? draft.name.trim(),
      email: normalizedEmail,
      whatsapp: "",
      password,
      birthDate: "",
      gender: "",
      jobTitle: draft.role,
      institution: "",
      linkedin: "",
      portfolio: "",
      instagram: "",
      interests: [draft.division],
      newsletter: false,
      createdAt: newUser.createdAt,
    };
    if (!writeJson("local", AUTH_STORAGE_KEYS.accounts, [account, ...accounts])) {
      writeCollection(USER_DIRECTORY_STORAGE_KEY, localUsers);
      return { ok: false, message: "Akun login lokal tidak dapat disimpan." };
    }
    recordAuditEntry(
      "Account created",
      `${newUser.name} added as ${newUser.role} and connected to local login.`,
    );
    return { ok: true, user: newUser };
  },
  async updateUser(id, fields) {
    const localUsers = readLocalUsers();
    const target = localUsers.find((user) => user.id === id);
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };
    const updated: DirectoryUser = {
      ...target,
      ...(fields.fullName ? { name: fields.fullName.trim() } : {}),
      ...(fields.email ? { email: fields.email.trim().toLowerCase() } : {}),
      ...(fields.role ? { role: fields.role as DirectoryUser["role"] } : {}),
      ...(fields.status ? { status: fields.status as DirectoryUserStatus } : {}),
    };
    if (!writeCollection(
      USER_DIRECTORY_STORAGE_KEY,
      localUsers.map((user) => (user.id === id ? updated : user)),
    )) {
      return { ok: false, message: "Penyimpanan lokal tidak tersedia." };
    }
    recordAuditEntry("User updated", `${updated.name} profile was updated.`);
    return { ok: true, user: updated };
  },
  async updateUserStatus(id, status) {
    const localUsers = readLocalUsers();
    const target = localUsers.find((user) => user.id === id);
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };
    const updated = { ...target, status };
    if (!writeCollection(
      USER_DIRECTORY_STORAGE_KEY,
      localUsers.map((user) => (user.id === id ? updated : user)),
    )) {
      return { ok: false, message: "Penyimpanan lokal tidak tersedia." };
    }
    recordAuditEntry("Status updated", `${updated.name} status changed to ${status}.`);
    return { ok: true, user: updated };
  },
  async updateUserRole(id, role) {
    const localUsers = readLocalUsers();
    const target = localUsers.find((user) => user.id === id);
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };
    const updated = { ...target, role: role as DirectoryUser["role"] };
    if (!writeCollection(
      USER_DIRECTORY_STORAGE_KEY,
      localUsers.map((user) => (user.id === id ? updated : user)),
    )) {
      return { ok: false, message: "Penyimpanan lokal tidak tersedia." };
    }
    recordAuditEntry("Role updated", `${updated.name} role changed to ${role}.`);
    return { ok: true, user: updated };
  },
  async deleteUser(id) {
    const localUsers = readLocalUsers();
    if (!localUsers.some((user) => user.id === id)) {
      return { ok: false, message: "Pengguna tidak ditemukan." };
    }
    if (!writeCollection(
      USER_DIRECTORY_STORAGE_KEY,
      localUsers.filter((user) => user.id !== id),
    )) {
      return { ok: false, message: "Penyimpanan lokal tidak tersedia." };
    }
    recordAuditEntry("Account deleted", `Directory entry ${id} was removed.`);
    return { ok: true };
  },
  recordAudit(action, detail) {
    recordAuditEntry(action, detail);
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(USER_DIRECTORY_CHANGE_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(USER_DIRECTORY_CHANGE_EVENT, listener);
    };
  },
};

import { apiUserDirectoryRepository } from "./apiUserDirectoryRepository";

export const userDirectoryRepository: UserDirectoryRepository =
  apiUserDirectoryRepository;
