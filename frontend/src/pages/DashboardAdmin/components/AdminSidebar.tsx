import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  HandHeart,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageCircleMore,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Settings,
  Shirt,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import adminBrandIcon from "../../../assets/icon.webp";
import { adminModules, adminSidebarModuleKeys } from "../adminDashboardData";
import { canAccessModule } from "../../../services/admin/modulePermissions";
import type { AdminModuleKey } from "../types";

const moduleIcons: Readonly<Record<AdminModuleKey, LucideIcon>> = {
  dashboard: LayoutDashboard,
  transactions: ReceiptText,
  users: Users,
  "tanya-mahreen": MessageCircleMore,
  "peduli-mahreen": HandHeart,
  "mahreen-csr": Building2,
  "mahreen-studio": Shirt,
  newsroom: Newspaper,
  internship: GraduationCap,
  verification: BadgeCheck,
  analytics: BarChart3,
  portfolio: BriefcaseBusiness,
  settings: Settings,
  clients: Users,
  reports: FileText,
  engagement: Inbox,
};

type AdminSidebarProps = Readonly<{
  activeModule: AdminModuleKey;
  isCollapsed: boolean;
  isOpen: boolean;
  permissions?: string[];
  role?: string;
  onClose: () => void;
  onLogout: () => void;
  onSelect: (module: AdminModuleKey) => void;
  onToggleCollapse: () => void;
}>;

const AdminSidebar = ({
  activeModule,
  isCollapsed,
  isOpen,
  permissions,
  role,
  onClose,
  onLogout,
  onSelect,
  onToggleCollapse,
}: AdminSidebarProps) => (
  <>
    <button
      className={`admin-sidebar-backdrop${isOpen ? " is-visible" : ""}`}
      type="button"
      aria-label="Tutup menu admin"
      tabIndex={isOpen ? 0 : -1}
      onClick={onClose}
    />

    <aside className={`admin-sidebar${isOpen ? " is-open" : ""}${isCollapsed ? " is-collapsed" : ""}`} aria-label="Navigasi admin">
      <div className="admin-sidebar__brand">
        <img
          className="admin-sidebar__brand-logo"
          src="/mahreen-logo-192.webp"
          width="128"
          height="43"
          alt="Mahreen Indonesia"
          decoding="async"
        />
        <img className="admin-sidebar__brand-mark" src={adminBrandIcon} width="40" height="40" alt="" aria-hidden="true" />
        <span>ADMIN</span>
        <button className="admin-sidebar__close" type="button" aria-label="Tutup menu" onClick={onClose}>
          <X size={19} aria-hidden="true" />
        </button>
      </div>

      <button
        className="admin-sidebar__collapse"
        type="button"
        aria-label={isCollapsed ? "Perluas sidebar admin" : "Ciutkan sidebar admin"}
        title={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        onClick={onToggleCollapse}
      >
        {isCollapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
      </button>

      <nav className="admin-sidebar__nav" aria-label="Menu utama admin">
        {adminSidebarModuleKeys.map((moduleKey, index) => {
          const module = adminModules.find((item) => item.key === moduleKey)!;
          const Icon = moduleIcons[module.key];
          if (!canAccessModule(module.key, permissions, role)) return null;

          return (
            <button
              key={module.key}
              type="button"
              className={`admin-sidebar__item${activeModule === module.key ? " is-active" : ""}`}
              aria-current={activeModule === module.key ? "page" : undefined}
              title={isCollapsed ? module.label : undefined}
              style={{ "--admin-nav-index": index } as React.CSSProperties}
              onClick={() => onSelect(module.key)}
            >
              <Icon size={20} strokeWidth={1.55} aria-hidden="true" />
              <span>{module.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <button className="admin-sidebar__logout" type="button" onClick={onLogout}>
          <LogOut size={16} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  </>
);

export default AdminSidebar;
