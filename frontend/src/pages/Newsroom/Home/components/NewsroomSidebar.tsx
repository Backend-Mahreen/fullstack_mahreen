import {
  BadgeCheck,
  CalendarDays,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";

const styles = `
  .newsroom-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 1120;
    flex: 0 0 var(--newsroom-sidebar-width);
    width: var(--newsroom-sidebar-width);
    max-width: var(--newsroom-sidebar-width);
    min-width: var(--newsroom-sidebar-width);
    height: 100dvh;
    min-height: 100dvh;
    overflow: hidden;
    overscroll-behavior: none;
    color: #ddd5cb;
    background: var(--newsroom-brown);
    border-right: 1px solid rgba(255, 255, 255, 0.04);
    scrollbar-width: none;
  }

  .newsroom-sidebar__panel {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 0;
    flex-direction: column;
    overflow: hidden;
    touch-action: auto;
  }

  .newsroom-sidebar__panel::-webkit-scrollbar {
    width: 5px;
  }

  .newsroom-sidebar__panel::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(229, 196, 119, 0.28);
  }

  .newsroom-sidebar__brand {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 0 0 auto;
    min-height: 82px;
    padding: 20px 18px 16px;
    align-items: flex-start;
    justify-content: space-between;
    background: var(--newsroom-brown);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
  }

  .newsroom-sidebar__brand div {
    display: grid;
    min-width: 0;
    gap: 4px;
  }

  .newsroom-sidebar__brand strong {
    color: var(--newsroom-gold);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.1;
  }

  .newsroom-sidebar__brand span {
    color: #a9a097;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11px;
    line-height: 1;
  }

  .newsroom-sidebar__close {
    display: none;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: transparent;
    cursor: pointer;
  }

  .newsroom-sidebar__navigation {
    display: grid;
    flex: 1 1 auto;
    min-height: 0;
    padding-top: 4px;
    align-content: start;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    scrollbar-color: rgba(229, 196, 119, 0.28) transparent;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }

  .newsroom-sidebar__item {
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 48px;
    padding: 0 17px;
    gap: 11px;
    align-items: center;
    border: 0;
    border-left: 2px solid transparent;
    color: #c9c1b8;
    background: transparent;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition:
      color 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease;
  }

  .newsroom-sidebar__item:hover,
  .newsroom-sidebar__item:focus-visible,
  .newsroom-sidebar__item.is-active {
    color: var(--newsroom-gold);
    background: rgba(255, 255, 255, 0.035);
    border-left-color: var(--newsroom-gold);
  }

  .newsroom-sidebar__bottom {
    display: grid;
    flex: 0 0 auto;
    margin-top: 0;
    padding: 18px 17px max(18px, env(safe-area-inset-bottom));
    gap: 12px;
    background: var(--newsroom-brown);
    border-top: 1px solid rgba(255, 255, 255, 0.045);
  }

  .newsroom-sidebar__partner {
    display: flex;
    min-width: 0;
    min-height: 54px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--newsroom-gold);
    color: var(--newsroom-gold);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 0.5px;
    text-align: center;
    transition: color 180ms ease, background-color 180ms ease;
  }

  .newsroom-sidebar__partner:hover,
  .newsroom-sidebar__partner:focus-visible {
    color: #16130f;
    background: var(--newsroom-gold);
  }

  .newsroom-sidebar__utility {
    display: flex;
    min-width: 0;
    gap: 10px;
    align-items: center;
    color: #ddd5cb;
    font-size: 12.5px;
    transition: color 180ms ease;
  }

  .newsroom-sidebar__utility:hover,
  .newsroom-sidebar__utility:focus-visible {
    color: var(--newsroom-gold);
  }

  .newsroom-sidebar__backdrop {
    display: none;
  }

  @media (max-width: 1024px) {
    .newsroom-sidebar {
      position: fixed;
      top: var(--newsroom-navbar-height, 64px);
      right: auto;
      bottom: 0;
      left: 0;
      z-index: 1420;
      display: block;
      width: min(300px, 86vw);
      max-width: min(300px, 86vw);
      min-width: 0;
      height: auto;
      min-height: 0;
      max-height: calc(100svh - var(--newsroom-navbar-height, 64px));
      overflow: hidden;
      overscroll-behavior: none;
      visibility: hidden;
      transform: translate3d(-101%, 0, 0);
      pointer-events: none;
      transition:
        transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
        visibility 240ms ease;
    }

    .newsroom-sidebar__panel {
      height: 100%;
      min-height: 0;
      padding-bottom: 0;
      overflow: hidden;
    }

    .newsroom-sidebar__brand {
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
    }

    .newsroom-sidebar__bottom {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: 18px 17px max(18px, env(safe-area-inset-bottom));
      background: var(--newsroom-brown);
    }

    .newsroom-sidebar__partner {
      width: 100%;
      min-height: 56px;
      background: rgba(36, 33, 30, 0.98);
    }

    .newsroom-sidebar.is-open {
      visibility: visible;
      transform: translate3d(0, 0, 0);
      pointer-events: auto;
    }

    .newsroom-sidebar__close {
      display: inline-flex;
    }

    .newsroom-sidebar__backdrop {
      position: fixed;
      inset: var(--newsroom-navbar-height, 64px) 0 0;
      z-index: 1400;
      display: block;
      border: 0;
      opacity: 0;
      visibility: hidden;
      background: rgba(0, 0, 0, 0.46);
      cursor: pointer;
      pointer-events: none;
      touch-action: manipulation;
      transition: opacity 180ms ease, visibility 180ms ease;
    }

    .newsroom-sidebar__backdrop.is-open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
  }
`;

type NewsroomSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuIcons = {
  trending: TrendingUp,
  tag: Tag,
  calendar: CalendarDays,
  verification: BadgeCheck,
} as const;

const getCurrentNewsroomPath = () => {
  return window.location.pathname || "/newsroom";
};

const NewsroomSidebar = ({ isOpen, onClose }: NewsroomSidebarProps) => {
  const { navigation: menus } = useNewsroomDatabase();

  return (
    <>
      <style>{styles}</style>

      <aside
        className={`newsroom-sidebar${isOpen ? " is-open" : ""}`}
        aria-label="Navigasi Newsroom"
      >
        <div className="newsroom-sidebar__panel">
          <div className="newsroom-sidebar__brand">
            <div>
              <strong>Newsroom Lab</strong>
              <span>Editorial Insights</span>
            </div>

            <button
              className="newsroom-sidebar__close"
              type="button"
              onClick={onClose}
              aria-label="Tutup menu Newsroom"
            >
              <X size={19} />
            </button>
          </div>

          <nav className="newsroom-sidebar__navigation">
            {menus.map((menu) => {
              const Icon = menuIcons[menu.iconKey];
              const currentPath = getCurrentNewsroomPath();
              const menuPath = menu.href.split("?")[0].replace(/^#/, "");
              const isActive = currentPath === menuPath;

              return (
                <a
                  className={`newsroom-sidebar__item${isActive ? " is-active" : ""}`}
                  href={menu.href}
                  onClick={onClose}
                  key={menu.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{menu.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="newsroom-sidebar__bottom">
            <a
              className="newsroom-sidebar__partner"
              href="/?section=partnership"
              onClick={onClose}
            >
              Partner With Us
            </a>
          </div>
        </div>
      </aside>

      <button
        className={`newsroom-sidebar__backdrop${isOpen ? " is-open" : ""}`}
        type="button"
        onClick={onClose}
        aria-label="Tutup menu"
      />
    </>
  );
};

export default NewsroomSidebar;
