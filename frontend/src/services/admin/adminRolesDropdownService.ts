import { apiClient } from "../../api/apiClient";

export const adminRolesDropdownService = {
  async getRoles(): Promise<{ id: string; slug: string; name: string; permissionCount: number }[]> {
    try {
      const result = await apiClient<Record<string, unknown>>("/admin/roles");
      const items = Array.isArray(result?.items) ? result.items as Record<string, unknown>[] : [];
      return items.map((r) => ({
        id: String(r.id ?? ""),
        slug: String(r.slug ?? ""),
        name: String(r.name ?? ""),
        permissionCount: Number(r.permissionCount ?? 0),
      }));
    } catch {
      return [];
    }
  },
};
