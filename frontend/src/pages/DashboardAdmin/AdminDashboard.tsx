import { lazy, Suspense, useEffect, useState } from "react";
import { adminModules } from "./adminDashboardData";
import type { AdminModuleKey } from "./types";
import { useAuth } from "../../hooks/useAuth";
import { navigateToRoute } from "../../utils/hashNavigation";
import { canAccessModule } from "../../services/admin/modulePermissions";
import AdminDashboardStyles from "./components/AdminDashboardStyles";
import AdminHeader from "./components/AdminHeader";
import AdminOverview from "./components/AdminOverview";
import AdminSidebar from "./components/AdminSidebar";
import NewsroomAdmin from "./components/newsroom/NewsroomAdmin";
import ServiceManagementAdmin from "./components/service-management/ServiceManagementAdmin";
import AdminPageSkeleton from "./components/shared/AdminPageSkeleton";
import UserDirectory from "./components/user-directory/UserDirectory";
import RolePermissionAdmin from "./components/settings/RolePermissionAdmin";

const PeduliCampaignsAdmin = lazy(
  () => import("./components/peduli-campaigns/PeduliCampaignsAdmin"),
);
const CsrCommandCenter = lazy(
  () => import("./components/csr-command/CsrCommandCenter"),
);
const StudioInventoryAdmin = lazy(
  () => import("./components/studio-inventory/StudioInventoryAdmin"),
);
const InternshipAnalyticsAdmin = lazy(
  () => import("./components/internship-analytics/InternshipAnalyticsAdmin"),
);
const MahreenCommandCenter = lazy(
  () => import("./components/operations-command/MahreenCommandCenter"),
);
const AdminAnalyticsPage = lazy(
  () => import("./components/analytics/AdminAnalyticsPage"),
);
const EnterpriseVerification = lazy(
  () => import("./components/enterprise-verification/EnterpriseVerification"),
);
const AddPortfolioWorkspace = lazy(
  () => import("./components/portfolio/AddPortfolioWorkspace"),
);
const ReportsAdmin = lazy(
  () => import("./components/reports/ReportsAdmin"),
);
const ClientsAdmin = lazy(
  () => import("./components/clients/ClientsAdmin"),
);
const EngagementInboxAdmin = lazy(
  () => import("./components/engagement/EngagementInboxAdmin"),
);

const isAdminModule = (value: string | null): value is AdminModuleKey =>
  Boolean(value && adminModules.some((module) => module.key === value));

const getInitialModule = (): AdminModuleKey => {
  const requestedModule = new URLSearchParams(window.location.search).get("module");
  return isAdminModule(requestedModule) ? requestedModule : "dashboard";
};

const getInitialModuleForUser = (
  requested: AdminModuleKey,
  permissions: string[] | undefined,
  role: string | undefined,
): AdminModuleKey =>
  canAccessModule(requested, permissions, role) ? requested : "dashboard";

const USER_MANAGE_PERMISSIONS = ["users.update", "users.manage_role", "users.manage_status", "users.create", "users.delete"];

const canManageUsers = (
  permissions: string[] | undefined,
  role: string | undefined,
): boolean => {
  if (role === "superadmin") return true;
  return (permissions ?? []).some((permission) => USER_MANAGE_PERMISSIONS.includes(permission));
};

type AdminTheme = "dark" | "light";
const ADMIN_SIDEBAR_COLLAPSED_KEY = "mahreen:admin-sidebar-collapsed";
const ADMIN_THEME_KEY = "mahreen:admin-theme";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const adminRole = user?.role;
  const adminPermissions = user?.permissions;
  const [activeModule, setActiveModule] = useState<AdminModuleKey>(() =>
    getInitialModuleForUser(getInitialModule(), adminPermissions, adminRole),
  );
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    window.localStorage.getItem(ADMIN_SIDEBAR_COLLAPSED_KEY) === "true",
  );
  const [theme, setTheme] = useState<AdminTheme>(() =>
    window.localStorage.getItem(ADMIN_THEME_KEY) === "light" ? "light" : "dark",
  );
  const [contentLoading, setContentLoading] = useState(true);
  const [toast, setToast] = useState("");
  const currentModule = adminModules.find((module) => module.key === activeModule) ?? adminModules[0];
  const adminName = user?.fullName || "Admin Mahreen";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${currentModule.label} | Mahreen Admin`;
    return () => { document.title = previousTitle; };
  }, [currentModule.label]);

  useEffect(() => {
    const timer = window.setTimeout(() => setContentLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, [activeModule]);

  useEffect(() => {
    if (!sidebarOpen || !window.matchMedia("(max-width: 1023px)").matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (module: AdminModuleKey) => {
    setContentLoading(true);
    setActiveModule(module);
    setSidebarOpen(false);
    setQuery("");

    const nextUrl = new URL(window.location.href);
    if (module === "dashboard") nextUrl.searchParams.delete("module");
    else nextUrl.searchParams.set("module", module);
    window.history.replaceState(window.history.state, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  };

  const handleLogout = async () => {
    await logout();
    navigateToRoute("/admin/login", { replace: true });
  };

  return (
    <>
      <AdminDashboardStyles />
      <a className="admin-skip-link" href="#admin-main-content">Lewati ke konten admin</a>
      <div className={`admin-dashboard-shell${sidebarCollapsed ? " is-sidebar-collapsed" : ""}${theme === "light" ? " admin-theme-light" : ""}`}>
        <AdminSidebar
          activeModule={activeModule}
          isCollapsed={sidebarCollapsed}
          isOpen={sidebarOpen}
          permissions={adminPermissions}
          role={adminRole}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          onSelect={handleSelect}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        />

        <div className="admin-workspace">
          <AdminHeader
            name={adminName}
            onMenuOpen={() => setSidebarOpen(true)}
            onQueryChange={setQuery}
            onThemeToggle={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            query={query}
            theme={theme}
          />
          <main id="admin-main-content" className="admin-main-content" tabIndex={-1}>
            {contentLoading ? (
              <AdminPageSkeleton />
            ) : activeModule === "dashboard" ? (
              <AdminOverview query={query} onSelect={handleSelect} />
            ) : activeModule === "newsroom" ? (
              <NewsroomAdmin query={query} onLocalAction={setToast} />
            ) : activeModule === "tanya-mahreen" ? (
              <ServiceManagementAdmin query={query} onLocalAction={setToast} />
            ) : activeModule === "users" ? (
              <UserDirectory
                canManage={canManageUsers(adminPermissions, adminRole)}
                initialQuery={query}
                onToast={setToast}
              />
            ) : activeModule === "peduli-mahreen" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <PeduliCampaignsAdmin query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "mahreen-csr" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <CsrCommandCenter query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "mahreen-studio" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <StudioInventoryAdmin query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "internship" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <InternshipAnalyticsAdmin query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "analytics" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <AdminAnalyticsPage query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "transactions" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <MahreenCommandCenter query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "verification" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <EnterpriseVerification query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "portfolio" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <AddPortfolioWorkspace
                  onBack={() => handleSelect("dashboard")}
                  onLocalAction={setToast}
                />
              </Suspense>
            ) : activeModule === "settings" ? (
              <RolePermissionAdmin onToast={setToast} />
            ) : activeModule === "reports" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <ReportsAdmin query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "clients" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <ClientsAdmin query={query} onLocalAction={setToast} />
              </Suspense>
            ) : activeModule === "engagement" ? (
              <Suspense fallback={<AdminPageSkeleton compact />}>
                <EngagementInboxAdmin query={query} onLocalAction={setToast} />
              </Suspense>
            ) : (
              <AdminPageSkeleton compact />
            )}
          </main>
        </div>
      </div>
      {toast ? <div className="admin-toast admin-animate" role="status">{toast}</div> : null}
    </>
  );
};

export default AdminDashboard;
