import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import adminBrandIcon from "../../../assets/icon.webp";

type AdminHeaderProps = Readonly<{
  name: string;
  onMenuOpen: () => void;
  onQueryChange: (value: string) => void;
  onThemeToggle: () => void;
  query: string;
  theme: "dark" | "light";
}>;

const AdminHeader = ({ name, onMenuOpen, onQueryChange, onThemeToggle, query, theme }: AdminHeaderProps) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <header className="admin-topbar">
      <button className="admin-topbar__menu" type="button" aria-label="Buka menu admin" onClick={onMenuOpen}>
        <Menu size={21} aria-hidden="true" />
      </button>

      <label className="admin-topbar__search">
        <Search size={15} aria-hidden="true" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          placeholder="Search everything..."
          aria-label="Cari seluruh data admin"
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="admin-topbar__actions">
        <button className="admin-icon-button admin-topbar__theme" type="button" aria-label={theme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap"} aria-pressed={theme === "light"} onClick={onThemeToggle} title={theme === "dark" ? "Light mode" : "Dark mode"}>
          {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        </button>

        <div className="admin-notification">
          <button
            className="admin-icon-button"
            type="button"
            aria-label="Buka notifikasi"
            aria-expanded={notificationOpen}
            onClick={() => setNotificationOpen((current) => !current)}
          >
            <Bell size={16} aria-hidden="true" />
            <span className="admin-notification__dot" />
          </button>
          {notificationOpen ? (
            <div className="admin-notification__panel admin-animate" role="status">
              <span>Notification center</span>
              <strong>3 pembaruan operasional</strong>
              <p>Proposal CSR, invoice, dan artikel baru menunggu pemeriksaan.</p>
            </div>
          ) : null}
        </div>

        <div className="admin-topbar__divider" />

        <div className="admin-profile">
          <div className="admin-profile__copy">
            <strong>{name}</strong>
            <span>Super Administrator</span>
          </div>
          <span className="admin-profile__avatar">
            <img src={adminBrandIcon} alt="Ikon Admin Mahreen" width="32" height="32" />
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
