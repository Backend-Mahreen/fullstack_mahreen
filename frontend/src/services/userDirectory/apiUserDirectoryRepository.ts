import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { canManageRoles, getCurrentAdminPermissions } from "../admin/modulePermissions";
import type {
  DirectoryAuditEntry,
  DirectoryDivision,
  DirectoryUser,
  DirectoryUserRole,
  DirectoryUserStatus,
} from "../../pages/DashboardAdmin/components/user-directory/types";
import type {
  DirectoryActionResult,
  DirectoryRoleSummary,
  UserDirectoryMetrics,
  UserDirectoryRepository,
  UserDirectorySnapshot,
} from "./userDirectoryRepository";

const emptySnapshot: UserDirectorySnapshot = {
  users: [], auditEntries: [],
  metrics: { totalUsers: 0, activeNow: 0, registrations: 0, security: 0 },
  roles: [],
  roleBreakdown: [],
  monthlyGrowth: [],
};

const CHANGE_EVENT = "mahreen:user-directory-change";
let cachedSnapshot: UserDirectorySnapshot = emptySnapshot;
let fetchPromise: Promise<void> | null = null;

const STATUS_MAP: Record<string, DirectoryUserStatus> = {
  active: "Active",
  inactive: "Pending",
  suspended: "Suspended",
  pending: "Pending",
  blocked: "Suspended",
};

const mapStatus = (raw: unknown): DirectoryUserStatus =>
  STATUS_MAP[String(raw ?? "").toLowerCase()] ?? "Pending";

const mapDivision = (u: Record<string, unknown>): DirectoryDivision => {
  const role = String(u.role ?? "").toLowerCase();
  if (role === "intern") return "Internship";
  const accountType = String(u.account_type ?? "").toLowerCase();
  if (accountType === "company") return "CSR";
  if (role === "admin" || role === "superadmin") return "Consultancy";
  return "Consultancy";
};

const mapUser = (u: Record<string, unknown>): DirectoryUser => ({
  id: String(u.id ?? ""),
  name: String(u.full_name ?? u.fullName ?? u.name ?? ""),
  email: String(u.email ?? ""),
  division: mapDivision(u),
  role: String(u.role ?? "Client") as DirectoryUserRole,
  status: mapStatus(u.status),
  avatar: u.profile_photo != null ? String(u.profile_photo) : undefined,
  createdAt: String(u.created_at ?? u.createdAt ?? new Date().toISOString()),
});

const fetchRoles = async (): Promise<DirectoryRoleSummary[]> => {
  const { role, permissions } = getCurrentAdminPermissions();
  if (!canManageRoles(permissions, role)) return [];
  try {
    const rows = await apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.roles);
    const items = Array.isArray(rows)
      ? rows
      : Array.isArray((rows as Record<string, unknown> | null)?.items)
        ? (rows as Record<string, unknown>).items as Record<string, unknown>[]
        : [];
    return items.map((r) => ({
      id: String(r.id ?? ""),
      name: String(r.name ?? ""),
      slug: String(r.slug ?? ""),
      description: String(r.description ?? ""),
      isSystem: Boolean(r.is_system),
      permissionCount: Number(r.permissionCount ?? 0),
    }));
  } catch {
    return [];
  }
};

const fetchAuditEntries = async (): Promise<DirectoryAuditEntry[]> => {
  try {
    const rows = await apiClient<Record<string, unknown>[]>(
      `${API_ENDPOINTS.admin.auditLogs}?limit=40`,
    );
    return Array.isArray(rows)
      ? rows
          .filter((entry) => String(entry.resource ?? "") === "users")
          .map((entry) => ({
            id: String(entry.id ?? `audit-${Date.now()}`),
            action: String(entry.action ?? ""),
            detail: String(entry.summary ?? ""),
            timestamp: String(entry.created_at ?? new Date().toISOString()),
          }))
      : [];
  } catch {
    return [];
  }
};

const fetchSnapshot = async () => {
  const [usersData, statsData] = await Promise.allSettled([
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.users),
    apiClient<Record<string, unknown>>(`${API_ENDPOINTS.admin.users}/stats`),
  ]);

  const extractUsers = (value: unknown): Record<string, unknown>[] => {
    if (!value) return [];
    const v = value as Record<string, unknown>;
    if (Array.isArray(v)) return v as Record<string, unknown>[];
    if (Array.isArray(v.items)) return v.items as Record<string, unknown>[];
    if (Array.isArray(v.users)) return v.users as Record<string, unknown>[];
    return [];
  };

  const users = usersData.status === "fulfilled"
    ? extractUsers(usersData.value).map(mapUser)
    : [];

  const stats = statsData.status === "fulfilled" ? (statsData.value ?? {}) as Record<string, unknown> : {};
  const rawBreakdown = Array.isArray(stats.roleBreakdown) ? stats.roleBreakdown : [];
  const rawGrowth = Array.isArray(stats.monthlyGrowth) ? stats.monthlyGrowth : [];

  const metrics: UserDirectoryMetrics = {
    totalUsers: Number(stats.total ?? users.length),
    activeNow: Number(stats.active ?? 0),
    registrations: Number(stats.registrations ?? 0),
    security: Number(stats.security ?? 0),
  };

  const [roles, auditEntries] = await Promise.all([fetchRoles(), fetchAuditEntries()]);

  cachedSnapshot = {
    users,
    auditEntries,
    metrics,
    roles,
    roleBreakdown: rawBreakdown.map((r) => ({
      role: String((r as Record<string, unknown>).role ?? ""),
      count: Number((r as Record<string, unknown>).count ?? 0),
    })),
    monthlyGrowth: rawGrowth.map((r) => ({
      month: String((r as Record<string, unknown>).month ?? ""),
      count: Number((r as Record<string, unknown>).count ?? 0),
    })),
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
};

const ensureFetched = () => {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchSnapshot().finally(() => { fetchPromise = null; });
  return fetchPromise;
};

const refresh = async () => {
  fetchPromise = null;
  return ensureFetched();
};

if (typeof window !== "undefined") {
  ensureFetched();
}

export const apiUserDirectoryRepository: UserDirectoryRepository = {
  getSnapshot() { return cachedSnapshot; },
  async addUser(draft) {
    try {
      const payload: Record<string, unknown> = {
        fullName: draft.name,
        email: draft.email,
        password: draft.password,
        accountType: draft.division === "Internship" ? "individual" : "individual",
        role: draft.role,
        status: draft.status.toLowerCase(),
      };
      const created = await apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.users, {
        method: "POST",
        body: payload,
      });
      await refresh();
      const user = mapUser(created);
      return { ok: true, user };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Gagal membuat pengguna." };
    }
  },
  async updateUser(id, fields): Promise<DirectoryActionResult> {
    try {
      const payload: Record<string, unknown> = {};
      if (fields.fullName) payload.fullName = fields.fullName.trim();
      if (fields.email) payload.email = fields.email.trim().toLowerCase();
      if (fields.role) payload.role = fields.role;
      if (fields.status) payload.status = fields.status.toLowerCase();
      await apiClient<{ id: string }>(API_ENDPOINTS.admin.user(id), {
        method: "PUT",
        body: payload,
      });
      await refresh();
      const updated = cachedSnapshot.users.find((user) => user.id === id);
      if (!updated) {
        const fallback: DirectoryUser = {
          id, email: fields.email ?? "", name: fields.fullName ?? "",
          division: "Consultancy", role: (fields.role ?? "Client") as DirectoryUserRole,
          status: (fields.status ?? "active") as DirectoryUserStatus,
          createdAt: new Date().toISOString(),
        };
        return { ok: true, user: fallback };
      }
      const merged: DirectoryUser = {
        ...updated,
        ...(fields.fullName ? { name: fields.fullName.trim() } : {}),
        ...(fields.email ? { email: fields.email.trim().toLowerCase() } : {}),
        ...(fields.role ? { role: fields.role as DirectoryUserRole } : {}),
        ...(fields.status ? { status: fields.status as DirectoryUserStatus } : {}),
      };
      return { ok: true, user: merged };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Gagal memperbarui pengguna." };
    }
  },
  async updateUserStatus(id, status): Promise<DirectoryActionResult> {
    try {
      await apiClient<{ id: string; status: string }>(
        API_ENDPOINTS.admin.userStatus(id),
        { method: "PATCH", body: { status: status.toLowerCase() } },
      );
      await refresh();
      const updated = cachedSnapshot.users.find((user) => user.id === id);
      if (!updated) return { ok: true, user: { id, email: "", name: "", division: "Consultancy", role: "Client" as DirectoryUserRole, status, createdAt: new Date().toISOString() } };
      return { ok: true, user: { ...updated, status } };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Gagal mengubah status." };
    }
  },
  async updateUserRole(id, role): Promise<DirectoryActionResult> {
    try {
      await apiClient<{ id: string; role: string }>(
        API_ENDPOINTS.admin.userRole(id),
        { method: "PATCH", body: { role } },
      );
      await refresh();
      const updated = cachedSnapshot.users.find((user) => user.id === id);
      if (!updated) return { ok: true, user: { id, email: "", name: "", division: "Consultancy", role: role as DirectoryUserRole, status: "Pending", createdAt: new Date().toISOString() } };
      return { ok: true, user: { ...updated, role: role as DirectoryUserRole } };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Gagal mengubah peran." };
    }
  },
  async deleteUser(id, force = false) {
    try {
      await apiClient<{ id: string }>(
        `${API_ENDPOINTS.admin.user(id)}${force ? "?force=true" : ""}`,
        { method: "DELETE" },
      );
      await refresh();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Gagal menghapus pengguna." };
    }
  },
  recordAudit() {},
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => { window.removeEventListener(CHANGE_EVENT, handler); };
  },
};
