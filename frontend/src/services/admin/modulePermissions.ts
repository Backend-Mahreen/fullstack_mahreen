import type { AdminModuleKey } from "../../pages/DashboardAdmin/types";
import { authService } from "../auth/authService";

export const MODULE_REQUIRED_PERMISSIONS: Readonly<Record<AdminModuleKey, string[]>> = {
  dashboard: ["view_overview", "view_audit_logs"],
  transactions: ["transactions.manage"],
  users: ["users.read", "users.create", "users.update", "users.delete", "users.manage_status", "users.manage_role"],
  "tanya-mahreen": ["consultations.manage", "orders.manage", "transactions.manage", "packages.manage"],
  "peduli-mahreen": ["campaigns.read", "donations.manage"],
  "mahreen-csr": ["csr_programs.manage", "csr_pillars.manage", "csr_applications.manage"],
  "mahreen-studio": ["products.manage", "portfolios.manage", "collections.manage", "specializations.manage"],
  newsroom: ["articles.read", "topics.manage", "webinars.manage", "events.manage"],
  internship: ["batches.manage", "intern_applications.manage"],
  verification: ["certificates.manage", "certificates.issue", "verification_logs.read"],
  analytics: ["view_analytics"],
  portfolio: ["portfolios.manage"],
  settings: ["users.manage_role"],
  reports: ["system_reports.read"],
  clients: ["users.read"],
  engagement: ["contact_inquiries.manage", "support_tickets.manage"],
};

export const hasAnyPermission = (permissions: string[] | undefined, required: string[]): boolean => {
  if (!required.length) return true;
  if (!permissions || !permissions.length) return false;
  return required.some((permission) => permissions.includes(permission));
};

export const canAccessModule = (
  moduleKey: AdminModuleKey,
  permissions: string[] | undefined,
  role: string | undefined,
): boolean => {
  if (role === "superadmin") return true;
  return hasAnyPermission(permissions, MODULE_REQUIRED_PERMISSIONS[moduleKey] ?? []);
};

export const getCurrentAdminPermissions = (): { role?: string; permissions?: string[] } => {
  if (typeof window === "undefined") return {};
  try {
    const cached = authService.getCached();
    return {
      role: cached?.user?.role,
      permissions: cached?.user?.permissions,
    };
  } catch {
    return {};
  }
};

export const canManageRoles = (permissions?: string[], role?: string): boolean => {
  if (role === "superadmin") return true;
  return hasAnyPermission(permissions, ["users.manage_role"]);
};

