import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type RoleRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  permissionCount: number;
  permissions?: string[];
  createdAt: string;
};

export type RoleStats = {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  permissionCount: { slug: string; name: string; permissionCount: number }[];
};

export type RolesSnapshot = {
  roles: RoleRecord[];
  stats: RoleStats | null;
  allPermissions: string[];
};

export const adminRolesRepository = {
  async getSnapshot(): Promise<RolesSnapshot> {
    const [rolesResult, statsResult, permissionsResult] = await Promise.allSettled([
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.roles),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.rolesStats),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.rolesPermissionsAll),
    ]);

    const mapRole = (r: Record<string, unknown>): RoleRecord => ({
      id: String(r.id ?? ""),
      name: String(r.name ?? ""),
      slug: String(r.slug ?? ""),
      description: String(r.description ?? ""),
      isSystem: Boolean(r.is_system),
      permissionCount: Number(r.permissionCount ?? 0),
      createdAt: String(r.created_at ?? ""),
    });

    const roles =
      rolesResult.status === "fulfilled" && Array.isArray(rolesResult.value.items)
        ? (rolesResult.value.items as Record<string, unknown>[]).map(mapRole)
        : [];

    const stats =
      statsResult.status === "fulfilled" && statsResult.value
        ? {
            totalRoles: Number((statsResult.value as Record<string, unknown>).totalRoles ?? 0),
            systemRoles: Number((statsResult.value as Record<string, unknown>).systemRoles ?? 0),
            customRoles: Number((statsResult.value as Record<string, unknown>).customRoles ?? 0),
            permissionCount: Array.isArray((statsResult.value as Record<string, unknown>).permissionCount)
              ? ((statsResult.value as Record<string, unknown>).permissionCount as Record<string, unknown>[]).map((r) => ({
                  slug: String(r.slug ?? ""),
                  name: String(r.name ?? ""),
                  permissionCount: Number(r.permissionCount ?? 0),
                }))
              : [],
          }
        : null;

    const allPermissions =
      permissionsResult.status === "fulfilled" && Array.isArray(permissionsResult.value)
        ? (permissionsResult.value as string[])
        : [];

    return { roles, stats, allPermissions };
  },

  async getRole(id: string): Promise<RoleRecord | null> {
    try {
      const result = await apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.role(id));
      if (!result) return null;
      return {
        id: String(result.id ?? ""),
        name: String(result.name ?? ""),
        slug: String(result.slug ?? ""),
        description: String(result.description ?? ""),
        isSystem: Boolean(result.is_system),
        permissionCount: Array.isArray(result.permissions) ? (result.permissions as string[]).length : 0,
        permissions: Array.isArray(result.permissions) ? (result.permissions as string[]) : [],
        createdAt: String(result.created_at ?? ""),
      };
    } catch {
      return null;
    }
  },

  async createRole(input: { name: string; slug?: string; description?: string; permissions: string[] }): Promise<RoleRecord> {
    const result = await apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.roles, {
      method: "POST",
      body: input,
    });
    return {
      id: String(result.id ?? ""),
      name: String(result.name ?? input.name),
      slug: String(result.slug ?? ""),
      description: String(result.description ?? input.description ?? ""),
      isSystem: Boolean(result.is_system),
      permissionCount: input.permissions.length,
      permissions: input.permissions,
      createdAt: String(result.created_at ?? ""),
    };
  },

  async updateRole(id: string, input: { name?: string; description?: string; permissions?: string[] }): Promise<RoleRecord> {
    const result = await apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.role(id), {
      method: "PUT",
      body: input,
    });
    return {
      id: String(result.id ?? ""),
      name: String(result.name ?? ""),
      slug: String(result.slug ?? ""),
      description: String(result.description ?? ""),
      isSystem: Boolean(result.is_system),
      permissionCount: Array.isArray(result.permissions) ? (result.permissions as string[]).length : 0,
      permissions: Array.isArray(result.permissions) ? (result.permissions as string[]) : [],
      createdAt: String(result.created_at ?? ""),
    };
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient<unknown>(API_ENDPOINTS.admin.role(id), { method: "DELETE" });
  },
};
