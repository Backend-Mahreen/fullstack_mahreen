import { useEffect, useState, type ReactNode } from "react";
import DashboardSidebar from "../../../components/DashboardSidebar/DashboardSidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useAuth } from "../../../hooks/useAuth";
import {
  APP_BEFORE_NAVIGATION_EVENT,
  handleRouteClick,
  navigateToRoute,
} from "../../../utils/hashNavigation";
import { getClientSidebarAccount } from "./clientSidebarAccount";
import { clientSidebarItems, type ClientAccountMenu } from "./clientSidebarItems";
import "./ClientAccountLayout.css";
import "./ClientDashboardSidebar.css";

const SIDEBAR_STORAGE_KEY = "mahreen-profile-sidebar-collapsed";

type ClientAccountLayoutProps = Readonly<{
  activeItem: ClientAccountMenu;
  className: string;
  children: ReactNode;
}>;

const ClientAccountLayout = ({
  activeItem,
  className,
  children,
}: ClientAccountLayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("client-account-body");
    return () => {
      document.documentElement.classList.remove("client-account-mobile-open");
      document.body.classList.remove(
        "client-account-body",
        "client-account-sidebar-collapsed",
        "client-account-mobile-open",
      );
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle(
      "client-account-sidebar-collapsed",
      sidebarCollapsed,
    );
    window.localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      String(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  useEffect(() => {
    const shouldLockPage =
      mobileSidebarOpen && window.matchMedia("(max-width: 900px)").matches;
    document.documentElement.classList.toggle(
      "client-account-mobile-open",
      shouldLockPage,
    );
    document.body.classList.toggle("client-account-mobile-open", shouldLockPage);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileSidebarOpen(false);
    };
    const closeBeforeNavigation = () => setMobileSidebarOpen(false);

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    window.addEventListener(APP_BEFORE_NAVIGATION_EVENT, closeBeforeNavigation);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(APP_BEFORE_NAVIGATION_EVENT, closeBeforeNavigation);
      document.documentElement.classList.remove("client-account-mobile-open");
      document.body.classList.remove("client-account-mobile-open");
    };
  }, [mobileSidebarOpen]);

  if (!user) return null;

  const handleSidebarToggle = () => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setMobileSidebarOpen(false);
      return;
    }
    setSidebarCollapsed((current) => !current);
  };

  const handleLogout = async () => {
    await logout();
    navigateToRoute("/login");
  };

  return (
    <>
      <Navbar
        homeHref="/"
        homeLabel="Home"
        profileSidebarOpen={mobileSidebarOpen}
        onProfileSidebarToggle={() =>
          setMobileSidebarOpen((current) => !current)
        }
      />
      <DashboardSidebar
        variant="client"
        account={getClientSidebarAccount(user)}
        activeItem={activeItem}
        brandTitle="Client Center"
        brandSubtitle="Account Management"
        collapsed={sidebarCollapsed}
        items={clientSidebarItems}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={handleSidebarToggle}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={(event, item) => {
          if (item.href) handleRouteClick(event, item.href);
        }}
      />
      <main className={`client-account-page ${className}`}>{children}</main>
    </>
  );
};

export default ClientAccountLayout;
