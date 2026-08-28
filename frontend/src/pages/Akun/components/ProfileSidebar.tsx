import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LogOut,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import type { AuthUser } from "../../../types/auth";
import { handleRouteClick } from "../../../utils/hashNavigation";
import { getInitials } from "../../../utils/formatName";
import "./ProfileSidebar.css";

export type ClientAccountMenu =
  | "personal"
  | "projects"
  | "overview"
  | "invoice"
  | "schedule"
  | "security"
  | "documents";

type ProfileSidebarProps = Readonly<{
  user: AuthUser;
  avatarSrc?: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
  activeItem?: ClientAccountMenu;
}>;

const menuItems = [
  { key: "personal", label: "Personal Info", icon: UserRound, href: "/akun/edit" },
  { key: "projects", label: "Projects", icon: BriefcaseBusiness, href: "/akun/projects" },
  { key: "overview", label: "Overview", icon: LayoutDashboard, href: "/akun/overview" },
  { key: "invoice", label: "Invoice", icon: ReceiptText, href: "/akun/invoice" },
  { key: "schedule", label: "Jadwal", icon: CalendarDays, href: "/akun/jadwal" },
  { key: "security", label: "Security", icon: ShieldCheck, href: "/akun/security" },
  { key: "documents", label: "Dokumen", icon: FileText, href: "/akun/dokumen" },
] as const;

const getDisplayName = (user: AuthUser) => {
  const nickname = typeof user.nickname === "string" ? user.nickname.trim() : "";
  const fullName = typeof user.fullName === "string" ? user.fullName.trim() : "";
  return nickname || fullName || "Pengguna Mahreen";
};

const ProfileSidebar = ({
  user,
  avatarSrc,
  collapsed,
  mobileOpen,
  onToggle,
  onCloseMobile,
  onLogout,
  activeItem = "personal",
}: ProfileSidebarProps) => {
  const displayName = getDisplayName(user);
  const accountId = typeof user.id === "string" && user.id.trim()
    ? user.id.trim()
    : "MHR-USER";

  return (
    <>
    <aside
      className={`profile-editor-sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
      id="profile-editor-sidebar"
      data-profile-reveal="sidebar"
      aria-label="Menu profil"
    >
      <div className="profile-editor-sidebar__panel">
        <div className="profile-editor-sidebar__brand">
          <div className="profile-editor-sidebar__brand-copy">
            <strong>Profile Center</strong>
            <span>Account Management</span>
          </div>

          <button
            className="profile-editor-sidebar__toggle"
            type="button"
            onClick={mobileOpen ? onCloseMobile : onToggle}
            aria-label={mobileOpen ? "Tutup menu profil" : collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            title={mobileOpen ? "Tutup menu profil" : collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          >
            <span className="profile-editor-sidebar__toggle-desktop" aria-hidden="true">
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </span>
            <X className="profile-editor-sidebar__toggle-mobile" aria-hidden="true" />
          </button>
        </div>

        <nav className="profile-editor-sidebar__nav">
          {menuItems.map(({ key, label, icon: Icon, href }) => {
            const active = key === activeItem;
            return (
            <a
              className={`profile-editor-sidebar__link${active ? " is-active" : ""}`}
              href={href}
              key={key}
              aria-current={active ? "page" : undefined}
              title={collapsed ? label : undefined}
              onClick={(event) => {
                onCloseMobile();
                handleRouteClick(event, href);
              }}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </a>
            );
          })}
        </nav>

        <div className="profile-editor-sidebar__bottom">
          <button className="profile-editor-sidebar__logout" type="button" onClick={onLogout} title={collapsed ? "Sign Out" : undefined}>
            <LogOut aria-hidden="true" />
            <span>Sign Out</span>
          </button>

          <div className="profile-editor-sidebar__account" title={collapsed ? displayName : undefined}>
            <span className="profile-editor-sidebar__account-avatar" aria-hidden="true">
              {avatarSrc ? (
                <img decoding="async" src={avatarSrc} alt="" />
              ) : (
                getInitials(displayName)
              )}
            </span>
            <span className="profile-editor-sidebar__account-copy">
              <strong>{displayName}</strong>
              <small>{accountId}</small>
            </span>
          </div>
        </div>
      </div>
    </aside>

    <button
      className={`profile-editor-sidebar__backdrop${mobileOpen ? " is-open" : ""}`}
      type="button"
      onClick={onCloseMobile}
      aria-label="Tutup menu profil"
      tabIndex={mobileOpen ? 0 : -1}
    />
    </>
  );
};

export default ProfileSidebar;
