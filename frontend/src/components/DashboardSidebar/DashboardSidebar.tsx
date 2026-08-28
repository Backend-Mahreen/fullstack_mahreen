import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";

export type DashboardSidebarItem<Key extends string> = Readonly<{
  key: Key;
  label: string;
  icon: LucideIcon;
  href?: string;
  featured?: boolean;
}>;

type DashboardSidebarBaseProps<Key extends string> = Readonly<{
  activeItem: Key;
  collapsed: boolean;
  items: readonly DashboardSidebarItem<Key>[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onToggleCollapse: () => void;
}>;

type ClientDashboardSidebarProps<Key extends string> =
  DashboardSidebarBaseProps<Key> & Readonly<{
    variant: "client";
    account: Readonly<{
      avatarSrc?: string;
      displayName: string;
      id: string;
      initials: string;
    }>;
    brandSubtitle: string;
    brandTitle: string;
    onNavigate: (
      event: MouseEvent<HTMLAnchorElement>,
      item: DashboardSidebarItem<Key>,
    ) => void;
  }>;

type AdminDashboardSidebarProps<Key extends string> =
  DashboardSidebarBaseProps<Key> & Readonly<{
    variant: "admin";
    brandBadge: string;
    brandLogoSrc: string;
    brandMarkSrc: string;
    onSelect: (item: Key) => void;
  }>;

export type DashboardSidebarProps<Key extends string> =
  | ClientDashboardSidebarProps<Key>
  | AdminDashboardSidebarProps<Key>;

const ClientDashboardSidebar = <Key extends string,>({
  account,
  activeItem,
  brandSubtitle,
  brandTitle,
  collapsed,
  items,
  mobileOpen,
  onCloseMobile,
  onLogout,
  onNavigate,
  onToggleCollapse,
}: ClientDashboardSidebarProps<Key>) => {
  const featuredItems = items.filter((item) => item.featured);
  const accountItems = items.filter((item) => !item.featured);

  const renderItem = (item: DashboardSidebarItem<Key>) => {
    const Icon = item.icon;
    const active = item.key === activeItem;
    const href = item.href ?? "/akun";

    return (
      <a
        className={`profile-editor-sidebar__link${active ? " is-active" : ""}${item.featured ? " is-featured-menu" : ""}`}
        href={href}
        key={item.key}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
        onClick={(event) => {
          onCloseMobile();
          onNavigate(event, item);
        }}
      >
        <Icon aria-hidden="true" />
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <>
      <aside
        className={`profile-editor-sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
        id="profile-editor-sidebar"
        data-profile-reveal="sidebar"
        aria-label="Menu akun client"
      >
        <div className="profile-editor-sidebar__panel">
          <div className="profile-editor-sidebar__brand">
            <div className="profile-editor-sidebar__brand-copy">
              <strong>{brandTitle}</strong>
              <span>{brandSubtitle}</span>
            </div>

            <button
              className="profile-editor-sidebar__toggle"
              type="button"
              onClick={mobileOpen ? onCloseMobile : onToggleCollapse}
              aria-label={mobileOpen ? "Tutup menu akun" : collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
              title={mobileOpen ? "Tutup menu akun" : collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            >
              <span className="profile-editor-sidebar__toggle-desktop" aria-hidden="true">
                {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              </span>
              <X className="profile-editor-sidebar__toggle-mobile" aria-hidden="true" />
            </button>
          </div>

          <nav className="profile-editor-sidebar__nav" aria-label="Menu utama client">
            {featuredItems.length > 0 ? (
              <div className="profile-editor-sidebar__featured" aria-label="Akses dashboard">
                {featuredItems.map(renderItem)}
              </div>
            ) : null}
            <div className="profile-editor-sidebar__menu" aria-label="Pengaturan akun">
              {accountItems.map(renderItem)}
            </div>
          </nav>

          <div className="profile-editor-sidebar__bottom">
            <button
              className="profile-editor-sidebar__logout"
              type="button"
              onClick={onLogout}
              title={collapsed ? "Sign Out" : undefined}
            >
              <LogOut aria-hidden="true" />
              <span>Sign Out</span>
            </button>

            <div
              className="profile-editor-sidebar__account"
              title={collapsed ? account.displayName : undefined}
            >
              <span className="profile-editor-sidebar__account-avatar" aria-hidden="true">
                {account.avatarSrc ? (
                  <img width="96" height="96" decoding="async" src={account.avatarSrc} alt="" />
                ) : (
                  account.initials
                )}
              </span>
              <span className="profile-editor-sidebar__account-copy">
                <strong>{account.displayName}</strong>
                <small>{account.id}</small>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <button
        className={`profile-editor-sidebar__backdrop${mobileOpen ? " is-open" : ""}`}
        type="button"
        onClick={onCloseMobile}
        aria-label="Tutup menu akun"
        tabIndex={mobileOpen ? 0 : -1}
      />
    </>
  );
};

const AdminDashboardSidebar = <Key extends string,>({
  activeItem,
  brandBadge,
  brandLogoSrc,
  brandMarkSrc,
  collapsed,
  items,
  mobileOpen,
  onCloseMobile,
  onLogout,
  onSelect,
  onToggleCollapse,
}: AdminDashboardSidebarProps<Key>) => (
  <>
    <button
      className={`admin-sidebar-backdrop${mobileOpen ? " is-visible" : ""}`}
      type="button"
      aria-label="Tutup menu admin"
      tabIndex={mobileOpen ? 0 : -1}
      onClick={onCloseMobile}
    />

    <aside
      className={`admin-sidebar${mobileOpen ? " is-open" : ""}${collapsed ? " is-collapsed" : ""}`}
      aria-label="Navigasi admin"
    >
      <div className="admin-sidebar__brand">
        <img
          className="admin-sidebar__brand-logo"
          src={brandLogoSrc}
          width="128"
          height="43"
          alt="Mahreen Indonesia"
          decoding="async"
        />
        <img
          className="admin-sidebar__brand-mark"
          src={brandMarkSrc}
          width="40"
          height="40"
          alt=""
          aria-hidden="true"
        />
        <span>{brandBadge}</span>
        <button
          className="admin-sidebar__close"
          type="button"
          aria-label="Tutup menu"
          onClick={onCloseMobile}
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>

      <button
        className="admin-sidebar__collapse"
        type="button"
        aria-label={collapsed ? "Perluas sidebar admin" : "Ciutkan sidebar admin"}
        title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        onClick={onToggleCollapse}
      >
        {collapsed ? (
          <PanelLeftOpen size={18} aria-hidden="true" />
        ) : (
          <PanelLeftClose size={18} aria-hidden="true" />
        )}
      </button>

      <nav className="admin-sidebar__nav" aria-label="Menu utama admin">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = item.key === activeItem;

          return (
            <button
              key={item.key}
              type="button"
              className={`admin-sidebar__item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              style={{ "--admin-nav-index": index } as CSSProperties}
              onClick={() => onSelect(item.key)}
            >
              <Icon size={20} strokeWidth={1.55} aria-hidden="true" />
              <span>{item.label}</span>
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

const DashboardSidebar = <Key extends string,>(
  props: DashboardSidebarProps<Key>,
) => {
  if (props.variant === "client") {
    return <ClientDashboardSidebar {...props} />;
  }

  return <AdminDashboardSidebar {...props} />;
};

export default DashboardSidebar;
