import { useEffect, useInsertionEffect, useState } from "react";
import {
  Bell,
  LogOut,
  PencilLine,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useStudioCart } from "../../hooks/useStudioCart";
import { clientNotificationService } from "../../services/notifications/clientNotificationService";
import { navigateToHashRoute } from "../../utils/hashNavigation";

type NavbarAccountControlProps = Readonly<{
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}>;

const styles = `
  .mh-account-control,
  .mh-account-control * { box-sizing: border-box; }

  .mh-account-control {
    position: relative;
    display: inline-flex;
    min-width: 0;
    align-items: center;
    color: #fff;
    font-family: Inter, Arial, sans-serif;
  }

  .mh-account-guest { display: inline-flex; align-items: center; gap: 14px; }
  .mh-account-guest a {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 180ms ease, text-shadow 180ms ease;
  }
  .mh-account-guest a:hover,
  .mh-account-guest a:focus-visible { color: #d8b86a; text-shadow: 0 0 14px rgba(216,184,106,.38); }
  .mh-account-separator { color: rgba(255,255,255,.42); font-size: 12px; }

  .mh-account-authenticated {
    position: relative;
    display: inline-flex;
    min-width: 0;
    height: 54px;
    align-items: center;
  }

  .mh-account-utility {
    display: inline-flex;
    height: 100%;
    margin-right: 18px;
    align-items: center;
    gap: 12px;
    transform: translateX(-6px);
  }

  .mh-account-icon-button {
    position: relative;
    display: inline-grid;
    width: 38px;
    height: 42px;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: rgba(235,228,213,.82);
    cursor: pointer;
    transition: color 180ms ease, background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }
  .mh-account-icon-button:hover,
  .mh-account-icon-button:focus-visible {
    color: #d8b86a;
    background: rgba(216,184,106,.075);
    box-shadow: 0 0 18px rgba(216,184,106,.14);
    transform: translateY(-1px);
  }
  .mh-account-icon-button svg { width: 17px; height: 17px; stroke-width: 1.6; }

  .mh-account-count {
    position: absolute;
    top: 3px;
    right: 1px;
    display: grid;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    place-items: center;
    border: 1px solid #050505;
    border-radius: 999px;
    background: #d8b86a;
    color: #0b0a08;
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
  }

  .mh-account-profile-button {
    display: inline-flex;
    min-width: 0;
    max-width: 248px;
    min-height: 48px;
    padding: 3px 0;
    align-items: center;
    gap: 11px;
    border: 0;
    background: transparent;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 180ms ease, transform 180ms ease;
  }
  .mh-account-profile-button:hover,
  .mh-account-profile-button:focus-visible { opacity: .92; transform: translateY(-1px); }

  .mh-account-copy {
    display: flex;
    min-width: 0;
    max-width: 178px;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    text-align: left;
  }
  .mh-account-copy strong,
  .mh-account-copy span { display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mh-account-copy strong { color: rgba(255,255,255,.96); font-size: 14px; font-weight: 700; line-height: 1.12; }
  .mh-account-copy span { color: rgba(255,255,255,.82); font: 12px/1.2 "DM Mono", Consolas, monospace; letter-spacing: .025em; text-transform: uppercase; }

  .mh-account-avatar {
    display: grid;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    overflow: hidden;
    place-items: center;
    border: 1px solid rgba(216,184,106,.48);
    border-radius: 50%;
    background: #191611;
    color: #d8b86a;
    box-shadow: 0 0 14px rgba(216,184,106,.1);
    font-size: 13px;
    font-weight: 700;
  }
  .mh-account-avatar img { display: block; width: 100%; height: 100%; object-fit: cover; }

  .mh-account-control.is-mobile {
    display: flex;
    width: min(100%, 360px);
    margin-top: 24px;
    padding: 17px;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    border: 1px solid rgba(216,184,106,.25);
    border-radius: 20px;
    background: rgba(255,255,255,.033);
  }
  .mh-account-mobile-utility { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mh-account-mobile-utility > button {
    position: relative;
    display: inline-flex;
    min-height: 42px;
    padding: 0 13px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 12px;
    background: rgba(255,255,255,.025);
    color: rgba(255,255,255,.78);
    font-size: 14px;
    cursor: pointer;
  }
  .mh-account-mobile-utility .mh-account-count { top: -5px; right: -5px; }
  .mh-account-mobile-main { display: flex; min-width: 0; align-items: center; gap: 13px; color: inherit; text-decoration: none; }
  .mh-account-control.is-mobile .mh-account-avatar { width: 52px; height: 52px; font-size: 15px; }
  .mh-account-mobile-main .mh-account-copy { max-width: none; }
  .mh-account-mobile-main .mh-account-copy strong { font-size: 17px; }
  .mh-account-mobile-main .mh-account-copy span { color: rgba(255,255,255,.82); font-size: 14px; }
  .mh-account-mobile-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mh-account-mobile-actions a,
  .mh-account-mobile-actions button {
    display: inline-flex;
    min-height: 44px;
    padding: 0 13px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
  .mh-account-mobile-account { border: 1px solid #d7b982; background: #d7b982; color: #111; }
  .mh-account-mobile-logout { grid-column: 1 / -1; border: 1px solid rgba(255,255,255,.18); background: transparent; color: rgba(255,255,255,.82); }
  .mh-account-mobile-guest { display: flex; width: min(100%,274px); margin-top: 26px; flex-direction: column; gap: 14px; }
  .mh-account-mobile-guest a { display: flex; min-height: 48px; align-items: center; justify-content: center; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none; text-transform: uppercase; }
  .mh-account-mobile-register { border: 1px solid rgba(255,255,255,.84); color: #fff; }
  .mh-account-mobile-login { border: 1px solid #d7b982; background: #d7b982; color: #111; }

  @media (max-width: 1160px) and (min-width: 1025px) {
    .mh-account-utility { margin-right: 10px; gap: 8px; transform: none; }
    .mh-account-copy { max-width: 132px; }
    .mh-account-profile-button { gap: 8px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .mh-account-icon-button,
    .mh-account-profile-button { transition: none; }
  }
`;

const ACCOUNT_STYLE_ID = "mahreen-navbar-account-styles";

const NavbarAccountControl = ({
  variant = "desktop",
  onNavigate,
}: NavbarAccountControlProps) => {
  const { user: account, logout: endSession } = useAuth();
  const { summary: cartSummary } = useStudioCart();
  const [unreadCount, setUnreadCount] = useState(0);

  useInsertionEffect(() => {
    if (document.getElementById(ACCOUNT_STYLE_ID)) return;
    const styleElement = document.createElement("style");
    styleElement.id = ACCOUNT_STYLE_ID;
    styleElement.dataset.component = "navbar-account-control";
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }, []);

  useEffect(() => {
    const refresh = () => {
      const notifications = account
        ? clientNotificationService.listForUser(account)
        : [];
      setUnreadCount(
        notifications.filter((notification) => !notification.readAt).length,
      );
    };
    refresh();
    if (account) {
      void clientNotificationService
        .loadForUser(account)
        .then((notifications) => {
          setUnreadCount(
            notifications.filter((notification) => !notification.readAt).length,
          );
        })
        .catch(() => undefined);
    }
    return clientNotificationService.subscribe(refresh);
  }, [account]);

  const close = () => {
    onNavigate?.();
  };

  const logout = async () => {
    await endSession();
    close();
    navigateToHashRoute("/");
  };

  if (!account) {
    return variant === "mobile" ? (
      <div className="mh-account-mobile-guest">
        <a className="mh-account-mobile-register" href="/daftar" onClick={close}>Daftar</a>
        <a className="mh-account-mobile-login" href="/login" onClick={close}>Login</a>
      </div>
    ) : (
      <div className="mh-account-guest">
        <a href="/daftar">Daftar</a>
        <span className="mh-account-separator">|</span>
        <a href="/login">Login</a>
      </div>
    );
  }

  const fullName = account.fullName?.trim() || "Pengguna Mahreen";
  const name = account.nickname?.trim() || fullName;
  const accountId = account.id?.trim() || "MHR-USER";
  const initials = fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  const avatar = (
    <span className="mh-account-avatar" aria-hidden="true">
      {account.profilePhoto ? (
        <img
          decoding="async"
          src={account.profilePhoto}
          alt=""
          width="40"
          height="40"
        />
      ) : (
        initials || <UserRound size={18} />
      )}
    </span>
  );

  const openNotifications = () => {
    close();
    navigateToHashRoute("/akun/notifikasi");
  };

  if (variant === "mobile") {
    return (
      <div className="mh-account-control is-mobile">
        <div className="mh-account-mobile-utility">
          <button
            type="button"
            aria-label={unreadCount ? `Buka ${unreadCount} notifikasi baru` : "Buka notifikasi"}
            onClick={openNotifications}
          >
            <Bell size={15} /> Notifikasi
            {unreadCount > 0 && <span className="mh-account-count">{Math.min(unreadCount, 99)}</span>}
          </button>
          <button type="button" onClick={() => { close(); navigateToHashRoute("/keranjang"); }}>
            <ShoppingCart size={15} /> Keranjang ({cartSummary.itemCount})
          </button>
        </div>

        <a className="mh-account-mobile-main" href="/akun" onClick={close} aria-label="Buka profil akun">
          {avatar}
          <span className="mh-account-copy"><strong>{name}</strong><span>ID:{accountId}</span></span>
        </a>

        <div className="mh-account-mobile-actions">
          <a className="mh-account-mobile-account" href="/akun" onClick={close}><UserRound size={15} /> Profil</a>
          <a className="mh-account-mobile-account" href="/akun/edit" onClick={close}><PencilLine size={15} /> Edit Profil</a>
          <button className="mh-account-mobile-logout" type="button" onClick={logout}><LogOut size={15} /> Keluar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mh-account-control">
      <div className="mh-account-authenticated">
        <div className="mh-account-utility" aria-label="Utilitas akun">
          <button
            className="mh-account-icon-button"
            type="button"
            aria-label={unreadCount ? `Buka ${unreadCount} notifikasi baru` : "Buka notifikasi"}
            onClick={openNotifications}
          >
            <Bell aria-hidden="true" />
            {unreadCount > 0 && <span className="mh-account-count">{Math.min(unreadCount, 99)}</span>}
          </button>
          <button className="mh-account-icon-button" type="button" aria-label="Buka detail keranjang" onClick={() => { close(); navigateToHashRoute("/keranjang"); }}>
            <ShoppingCart aria-hidden="true" />
            {cartSummary.itemCount > 0 && <span className="mh-account-count">{Math.min(cartSummary.itemCount, 99)}</span>}
          </button>
        </div>

        <a className="mh-account-profile-button" href="/akun" aria-label="Buka profil akun" onClick={close}>
          <span className="mh-account-copy"><strong>{name}</strong><span>ID:{accountId}</span></span>
          {avatar}
        </a>
      </div>
    </div>
  );
};

export default NavbarAccountControl;
