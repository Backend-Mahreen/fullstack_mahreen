import type { AccountRole } from "../../types/auth";

const isRouteWithin = (targetPath: string, prefix: string) =>
  targetPath === prefix || targetPath.startsWith(`${prefix}/`) || targetPath.startsWith(`${prefix}?`);

export const getLoginRedirectRoute = (targetPath: string) => {
  const loginRoute = isRouteWithin(targetPath, "/admin")
    ? "/admin/login"
    : isRouteWithin(targetPath, "/internship/dashboard")
      ? "/internship/login"
      : "/login";

  return `${loginRoute}?required=1&redirect=${encodeURIComponent(targetPath)}`;
};

export const getPostLoginRoute = (
  role: AccountRole,
  redirectTo?: string | null,
) => {
  if (role === "admin" || role === "superadmin") return "/admin";
  if (role === "intern") return "/internship/dashboard";

  if (
    redirectTo &&
    !isRouteWithin(redirectTo, "/admin") &&
    !isRouteWithin(redirectTo, "/internship/dashboard")
  ) {
    return redirectTo;
  }

  return "/dashboard";
};
