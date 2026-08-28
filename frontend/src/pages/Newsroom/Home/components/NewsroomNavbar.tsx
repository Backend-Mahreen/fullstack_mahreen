import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, PanelLeft } from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";
import {
  APP_BEFORE_NAVIGATION_EVENT,
  APP_NAVIGATION_EVENT,
} from "../../../../utils/hashNavigation";

const NavbarAccountControl = lazy(
  () => import("../../../../components/Navbar/NavbarAccountControl"),
);

type NavigationItem = {
  label: string;
  href: string;
};

type NewsroomNavbarProps = {
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
  disableScrollEffects?: boolean;
};

const ecosystemItems: readonly NavigationItem[] = [
  { label: "Mahreen Studio", href: "/mahreen-studio" },
  { label: "Tanya Mahreen", href: "/tanya-mahreen" },
  { label: "Peduli Mahreen", href: "/peduli-mahreen" },
  { label: "Mahreen CSR", href: "/mahreen-csr" },
  { label: "Internship", href: "/internship" },
];

const getCurrentRoute = () => typeof window === "undefined" ? "/" : (window.location.pathname || "/");

const normalizePath = (path: string) => {
  if (!path) return "/";

  const pathWithoutHash = path.startsWith("#") ? path.slice(1) : path;
  const cleanPath = pathWithoutHash.split("?")[0].split("#")[0] || "/";

  return cleanPath.length > 1 && cleanPath.endsWith("/")
    ? cleanPath.slice(0, -1)
    : cleanPath;
};

const isActiveRoute = (currentPath: string, href: string) => {
  const normalizedCurrentPath = normalizePath(currentPath);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/") return normalizedCurrentPath === "/";

  return (
    normalizedCurrentPath === normalizedHref ||
    normalizedCurrentPath.startsWith(`${normalizedHref}/`)
  );
};

const styles = `
  html.newsroom-mobile-nav-open,
  body.newsroom-mobile-nav-open {
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  .newsroom-home-navbar {
    --home-navbar-height: 64px;
    --home-sidebar-width: 220px;
    --home-navbar-gold: #d8b86a;
    --home-navbar-text: #ffffff;
    --home-navbar-border: rgba(255, 255, 255, 0.14);

    position: sticky;
    top: 0;
    z-index: 1100;
    width: calc(100% - var(--home-sidebar-width));
    max-width: calc(100% - var(--home-sidebar-width));
    min-width: 0;
    height: var(--home-navbar-height);
    margin-left: var(--home-sidebar-width);
    color: var(--home-navbar-text);
    background: #000000;
    border-bottom: 1px solid var(--home-navbar-border);
    animation: newsroomNavbarEnter 420ms ease both;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .newsroom-home-navbar.is-scrolled {
    background: rgba(0, 0, 0, 0.88);
    border-bottom-color: rgba(216, 184, 106, 0.42);
    box-shadow:
      0 12px 36px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(216, 184, 106, 0.2),
      0 0 22px rgba(216, 184, 106, 0.11);
  }


  @keyframes newsroomNavbarEnter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .newsroom-home-navbar,
  .newsroom-home-navbar *,
  .newsroom-home-navbar *::before,
  .newsroom-home-navbar *::after {
    box-sizing: border-box;
  }

  .newsroom-home-navbar__inner {
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    min-width: 0;
    padding: 0 24px;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 24px;
  }

  .newsroom-home-navbar a,
  .newsroom-home-navbar button {
    color: inherit;
    font: inherit;
    text-decoration: none;
  }

  .newsroom-home-navbar__left,
  .newsroom-home-navbar__right {
    display: flex;
    min-width: 0;
    align-items: center;
  }

  .newsroom-home-navbar__left {
    grid-column: 1;
    width: auto;
    max-width: none;
    height: 100%;
    padding: 0;
    justify-content: flex-start;
    gap: clamp(24px, 3vw, 42px);
    overflow: visible;
    border-right: 0;
  }

  .newsroom-home-navbar__right {
    grid-column: 3;
    padding-right: 0;
    justify-content: flex-end;
    gap: clamp(22px, 2.5vw, 34px);
  }

  .newsroom-home-navbar__link,
  .newsroom-home-navbar__auth-link,
  .newsroom-home-navbar__ecosystem-button {
    position: relative;
    display: inline-flex;
    min-height: 30px;
    padding: 0;
    align-items: center;
    justify-content: center;
    border: 0;
    outline: 0;
    border-radius: 0;
    color: #ffffff;
    background: transparent;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px !important;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.72px;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    transition:
      color 180ms ease,
      transform 180ms ease,
      text-shadow 180ms ease;
  }

  .newsroom-home-navbar__link.is-active,
  .newsroom-home-navbar__auth-link.is-active,
  .newsroom-home-navbar__mobile-link.is-active {
    color: var(--home-navbar-gold);
    text-shadow:
      0 0 7px rgba(216, 184, 106, 1),
      0 0 16px rgba(216, 184, 106, 0.88),
      0 0 30px rgba(216, 184, 106, 0.56);
  }

  .newsroom-home-navbar__link.is-active::after,
  .newsroom-home-navbar__auth-link.is-active::after {
    position: absolute;
    right: 0;
    bottom: -6px;
    left: 0;
    height: 1px;
    content: "";
    background: var(--home-navbar-gold);
    box-shadow:
      0 0 8px rgba(216, 184, 106, 1),
      0 0 20px rgba(216, 184, 106, 0.65);
  }

  .newsroom-home-navbar__link:hover,
  .newsroom-home-navbar__link:focus-visible,
  .newsroom-home-navbar__auth-link:hover,
  .newsroom-home-navbar__auth-link:focus-visible {
    color: #ffffff;
    transform: translateY(-1px);
    text-shadow:
      0 0 6px rgba(255, 255, 255, 1),
      0 0 14px rgba(255, 255, 255, 0.82),
      0 0 24px rgba(216, 184, 106, 0.58),
      0 0 36px rgba(216, 184, 106, 0.3);
  }

  .newsroom-home-navbar__link:focus-visible,
  .newsroom-home-navbar__auth-link:focus-visible,
  .newsroom-home-navbar__ecosystem-button:focus-visible,
  .newsroom-home-navbar__icon-button:focus-visible,
  .newsroom-home-navbar__menu-button:focus-visible {
    outline: 1px solid var(--home-navbar-gold);
    outline-offset: 6px;
  }

  .newsroom-home-navbar__ecosystem {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .newsroom-home-navbar__ecosystem-button {
    gap: 4px;
  }

  .newsroom-home-navbar__ecosystem-button.is-active {
    color: var(--home-navbar-gold);
    text-shadow:
      0 0 7px rgba(216, 184, 106, 1),
      0 0 16px rgba(216, 184, 106, 0.88),
      0 0 30px rgba(216, 184, 106, 0.56);
  }

  .newsroom-home-navbar__ecosystem-button:hover,
  .newsroom-home-navbar__ecosystem-button:focus-visible {
    color: var(--home-navbar-gold);
    transform: translateY(-1px);
    text-shadow:
      0 0 7px rgba(216, 184, 106, 1),
      0 0 16px rgba(216, 184, 106, 0.9),
      0 0 30px rgba(216, 184, 106, 0.6);
  }

  .newsroom-home-navbar__chevron {
    width: 10px;
    height: 10px;
    flex: 0 0 auto;
    transition: transform 180ms ease;
  }

  .newsroom-home-navbar__chevron.is-open {
    transform: rotate(180deg);
  }

  .newsroom-home-navbar__dropdown {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    display: flex;
    width: 220px;
    padding: 10px;
    flex-direction: column;
    gap: 2px;
    border: 1px solid rgba(216, 184, 106, 0.24);
    opacity: 0;
    visibility: hidden;
    background: rgba(0, 0, 0, 0.9);
    box-shadow:
      0 20px 44px rgba(0, 0, 0, 0.44),
      0 0 22px rgba(216, 184, 106, 0.12);
    transform: translateY(-8px);
    pointer-events: none;
    transition:
      opacity 180ms ease,
      transform 180ms ease,
      visibility 180ms ease;
  }

  .newsroom-home-navbar__dropdown.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  .newsroom-home-navbar__dropdown-link {
    display: block;
    padding: 12px 10px;
    color: rgba(255, 255, 255, 0.84);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px !important;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.72px;
    text-transform: uppercase;
    transition:
      color 180ms ease,
      transform 180ms ease,
      text-shadow 180ms ease;
  }

  .newsroom-home-navbar__dropdown-link:hover,
  .newsroom-home-navbar__dropdown-link:focus-visible,
  .newsroom-home-navbar__dropdown-link.is-active {
    color: var(--home-navbar-gold);
    transform: translateX(3px);
    text-shadow:
      0 0 7px rgba(216, 184, 106, 1),
      0 0 18px rgba(216, 184, 106, 0.68);
  }

  .newsroom-home-navbar__logo-link {
    grid-column: 2;
    display: inline-flex;
    justify-self: center;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .newsroom-home-navbar__logo-link:focus-visible {
    outline: 1px solid rgba(216, 184, 106, 0.72);
    outline-offset: 5px;
  }

  .newsroom-home-navbar__logo {
    display: block;
    width: 245px;
    height: 54px;
    object-fit: contain;
  }

  .newsroom-home-navbar__auth {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .newsroom-home-navbar__separator {
    color: rgba(255, 255, 255, 0.72);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px !important;
    line-height: 1;
    transform: translateY(-1px);
  }

  .newsroom-home-navbar__icon-button,
  .newsroom-home-navbar__menu-button,
  .newsroom-home-navbar__mobile-menu {
    display: none;
  }

  body.mahreen-authenticated .newsroom-home-navbar__right {
    gap: 0;
  }

  body.mahreen-authenticated .newsroom-home-navbar__right > .newsroom-home-navbar__link {
    display: none;
  }

  @media (max-width: 1280px) {
    .newsroom-home-navbar__inner {
      padding-inline: 20px;
      gap: 18px;
    }

    .newsroom-home-navbar__left {
      padding-inline: 0;
      gap: 22px;
    }

    .newsroom-home-navbar__right {
      padding-right: 0;
      gap: 20px;
    }

    .newsroom-home-navbar__logo {
      width: 220px;
      height: 50px;
    }

    .newsroom-home-navbar__link,
    .newsroom-home-navbar__auth-link,
    .newsroom-home-navbar__ecosystem-button {
      font-size: 10px !important;
      letter-spacing: 0.8px;
    }

    .newsroom-home-navbar__left .newsroom-home-navbar__link,
    .newsroom-home-navbar__left .newsroom-home-navbar__ecosystem-button {
      font-size: 9px !important;
      letter-spacing: 0.55px;
    }
  }

  @media (max-width: 1024px) {
    .newsroom-home-navbar {
      --home-navbar-height: 64px;
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 1500;
      width: 100%;
      max-width: 100%;
      margin-left: 0;
      background: rgba(0, 0, 0, 0.98);
      transform: translateZ(0);
    }

    .newsroom-home-navbar__inner {
      z-index: 2;
      grid-template-columns: 44px minmax(0, 1fr) 44px;
      padding-inline: 16px;
      gap: 10px;
    }

    .newsroom-home-navbar__left,
    .newsroom-home-navbar__right {
      display: none;
    }

    .newsroom-home-navbar__logo-link {
      grid-column: 2;
      justify-self: center;
    }

    .newsroom-home-navbar__logo {
      width: min(220px, 55vw);
      height: 52px;
    }

    .newsroom-home-navbar__icon-button,
    .newsroom-home-navbar__menu-button {
      display: inline-flex;
      width: 38px;
      height: 38px;
      padding: 0;
      align-items: center;
      justify-content: center;
      border: 0;
      color: #ffffff;
      background: transparent;
      cursor: pointer;
    }

    .newsroom-home-navbar__icon-button {
      grid-column: 1;
      justify-self: start;
    }

    .newsroom-home-navbar__menu-button {
      grid-column: 3;
      justify-self: end;
    }

    .newsroom-home-navbar__mobile-menu {
      position: fixed;
      top: var(--home-navbar-height);
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1490;
      display: flex;
      width: 100%;
      height: calc(100dvh - var(--home-navbar-height));
      padding: clamp(36px, 6vh, 64px) 20px max(30px, env(safe-area-inset-bottom));
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      opacity: 0;
      visibility: hidden;
      background:
        radial-gradient(circle at 68% 30%, rgba(153, 118, 76, 0.08), transparent 30%),
        radial-gradient(circle at 20% 12%, rgba(255, 255, 255, 0.025), transparent 28%),
        linear-gradient(145deg, rgba(27, 29, 28, 0.998), rgba(12, 11, 10, 1) 55%, #060606);
      transform: translateY(-14px);
      pointer-events: none;
      transition:
        opacity 360ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
        visibility 360ms ease;
    }

    .newsroom-home-navbar__mobile-menu.is-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    .newsroom-home-navbar__mobile-navigation {
      display: flex;
      width: 100%;
      max-width: 420px;
      margin: auto 0;
      flex-direction: column;
      align-items: center;
    }

    .newsroom-home-navbar__mobile-link,
    .newsroom-home-navbar__mobile-ecosystem-button,
    .newsroom-home-navbar__mobile-sidebar-button {
      position: relative;
      display: flex;
      width: min(100%, 330px);
      min-height: 46px;
      margin: 3px 0;
      padding: 10px 24px;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border: 0;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.95);
      background: transparent;
      font-family: "Playfair Display", Georgia, serif;
      font-size: clamp(19px, 5.4vw, 24px);
      font-weight: 400;
      line-height: 1.25;
      letter-spacing: -0.5px;
      text-transform: none;
      text-decoration: none;
      cursor: pointer;
      transition:
        color 260ms ease,
        transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
        text-shadow 260ms ease;
    }

    .newsroom-home-navbar__mobile-link:hover,
    .newsroom-home-navbar__mobile-link:focus-visible,
    .newsroom-home-navbar__mobile-ecosystem-button:hover,
    .newsroom-home-navbar__mobile-ecosystem-button:focus-visible,
    .newsroom-home-navbar__mobile-sidebar-button:hover,
    .newsroom-home-navbar__mobile-sidebar-button:focus-visible {
      color: var(--home-navbar-gold);
      transform: translateY(-1px);
      text-shadow:
        0 0 8px rgba(215, 185, 130, 0.95),
        0 0 18px rgba(215, 185, 130, 0.58),
        0 0 30px rgba(215, 185, 130, 0.28);
    }

    .newsroom-home-navbar__mobile-ecosystem {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
    }

    .newsroom-home-navbar__mobile-ecosystem-list {
      display: grid;
      width: 100%;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 380ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity 260ms ease;
    }

    .newsroom-home-navbar__mobile-ecosystem-list.is-open {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .newsroom-home-navbar__mobile-ecosystem-inner {
      display: flex;
      min-height: 0;
      overflow: hidden;
      flex-direction: column;
      align-items: center;
    }

    .newsroom-home-navbar__mobile-ecosystem-link {
      display: flex;
      width: min(100%, 290px);
      min-height: 38px;
      margin: 2px 0;
      padding: 10px 18px;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.72);
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: 1.3px;
      text-align: center;
      text-transform: uppercase;
    }

    .newsroom-home-navbar__mobile-ecosystem-link:hover,
    .newsroom-home-navbar__mobile-ecosystem-link:focus-visible,
    .newsroom-home-navbar__mobile-ecosystem-link.is-active {
      color: var(--home-navbar-gold);
      text-shadow: 0 0 12px rgba(216, 184, 106, 0.65);
    }

    .newsroom-home-navbar__mobile-actions {
      display: flex;
      width: min(100%, 310px);
      margin-top: 28px;
      gap: 9px;
    }

    .newsroom-home-navbar__mobile-actions a {
      display: inline-flex;
      min-height: 44px;
      flex: 1;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(216, 184, 106, 0.58);
      color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .newsroom-home-navbar__mobile-actions a:first-child {
      color: #090806;
      background: var(--home-navbar-gold);
    }
  }

  @media (max-width: 420px) {
    .newsroom-home-navbar__inner {
      padding-inline: 12px;
    }

    .newsroom-home-navbar__logo {
      width: min(190px, 54vw);
      height: 48px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-home-navbar,
    .newsroom-home-navbar *,
    .newsroom-home-navbar *::before,
    .newsroom-home-navbar *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const NewsroomNavbar = ({
  onOpenSidebar,
  onCloseSidebar,
  disableScrollEffects = false,
}: NewsroomNavbarProps) => {
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileEcosystemOpen, setMobileEcosystemOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 12);
  const [currentPath, setCurrentPath] = useState(() => getCurrentRoute());
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches,
  );
  const { isAuthenticated } = useAuth();

  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableScrollEffects) return;

    let animationFrame = 0;
    let lastScrolled = window.scrollY > 12;


    const updateScrollState = () => {
      animationFrame = 0;
      const nextScrolled = window.scrollY > 12;

      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setIsScrolled(nextScrolled);
      }
    };

    const handleScroll = () => {
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    };
  }, [disableScrollEffects]);

  useEffect(() => {
    const updateCurrentPath = () => {
      setCurrentPath(getCurrentRoute());
      setMobileOpen(false);
      setMobileEcosystemOpen(false);
    };
    const closeOpenMenus = () => {
      setMobileOpen(false);
      setMobileEcosystemOpen(false);
      setEcosystemOpen(false);
      onCloseSidebar?.();
    };

    window.addEventListener("hashchange", updateCurrentPath);
    window.addEventListener(APP_NAVIGATION_EVENT, updateCurrentPath);
    window.addEventListener(APP_BEFORE_NAVIGATION_EVENT, closeOpenMenus);
    return () => {
      window.removeEventListener("hashchange", updateCurrentPath);
      window.removeEventListener(APP_NAVIGATION_EVENT, updateCurrentPath);
      window.removeEventListener(APP_BEFORE_NAVIGATION_EVENT, closeOpenMenus);
    };
  }, [onCloseSidebar]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        ecosystemRef.current &&
        !ecosystemRef.current.contains(event.target as Node)
      ) {
        setEcosystemOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.toggle("newsroom-mobile-nav-open", mobileOpen);
    body.classList.toggle("newsroom-mobile-nav-open", mobileOpen);

    return () => {
      html.classList.remove("newsroom-mobile-nav-open");
      body.classList.remove("newsroom-mobile-nav-open");
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleViewportChange = () => {
      setIsMobileViewport(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setMobileOpen(false);
        setMobileEcosystemOpen(false);
      }
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMobileEcosystemOpen(false);
        setEcosystemOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileEcosystemOpen(false);
    setEcosystemOpen(false);
  };

  const openNewsroomSidebar = () => {
    closeMobileMenu();
    onOpenSidebar?.();
  };

  const isEcosystemActive = ecosystemItems.some((item) =>
    isActiveRoute(currentPath, item.href),
  );

  return (
    <>
      <style data-component="newsroom-home-navbar">{styles}</style>

      <header
        className={`newsroom-home-navbar${!disableScrollEffects && isScrolled ? " is-scrolled" : ""}`}
      >
        <nav
          className="newsroom-home-navbar__inner"
          aria-label="Navigasi utama Newsroom"
        >
          {onOpenSidebar ? (
            <button
              className="newsroom-home-navbar__icon-button"
              type="button"
              onClick={openNewsroomSidebar}
              aria-label="Buka menu Newsroom Lab"
            >
              <PanelLeft size={23} aria-hidden="true" />
            </button>
          ) : (
            <span aria-hidden="true" />
          )}

          <div className="newsroom-home-navbar__left">
            <a
              className={`newsroom-home-navbar__link${
                isActiveRoute(currentPath, "/") ? " is-active" : ""
              }`}
              href="/"
              aria-current={
                isActiveRoute(currentPath, "/") ? "page" : undefined
              }
            >
              Home
            </a>

            <div className="newsroom-home-navbar__ecosystem" ref={ecosystemRef}>
              <button
                className={`newsroom-home-navbar__ecosystem-button${
                  isEcosystemActive ? " is-active" : ""
                }`}
                type="button"
                aria-expanded={ecosystemOpen}
                aria-controls="newsroom-home-ecosystem-menu"
                onClick={() => setEcosystemOpen((current) => !current)}
              >
                <span>Our Ecosystem</span>
                <ChevronDown
                  className={`newsroom-home-navbar__chevron${
                    ecosystemOpen ? " is-open" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id="newsroom-home-ecosystem-menu"
                className={`newsroom-home-navbar__dropdown${
                  ecosystemOpen ? " is-open" : ""
                }`}
              >
                {ecosystemItems.map((item) => (
                  <a
                    className={`newsroom-home-navbar__dropdown-link${
                      isActiveRoute(currentPath, item.href) ? " is-active" : ""
                    }`}
                    key={item.href}
                    href={item.href}
                    onClick={() => setEcosystemOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            className="newsroom-home-navbar__logo-link"
            href="/newsroom"
            aria-label="Kembali ke Home Newsroom"
            onClick={closeMobileMenu}
          >
            <img
              className="newsroom-home-navbar__logo"
              src="/mahreen-logo-256.webp"
              srcSet="/mahreen-logo-256.webp 1x, /mahreen-logo-384.webp 2x"
              alt="Mahreen Indonesia"
              width="245"
              height="81"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </a>

          <div className="newsroom-home-navbar__right">
            <a
              className={`newsroom-home-navbar__link${
                isActiveRoute(currentPath, "/portofolio") ? " is-active" : ""
              }`}
              href="/portofolio"
            >
              Portofolio
            </a>

            {!isMobileViewport && (isAuthenticated ? (
              <Suspense fallback={null}>
                <NavbarAccountControl />
              </Suspense>
            ) : (
              <div className="newsroom-home-navbar__auth">
                <a className="newsroom-home-navbar__auth-link" href="/daftar">Daftar</a>
                <span className="newsroom-home-navbar__separator" aria-hidden="true">|</span>
                <a className="newsroom-home-navbar__auth-link" href="/login">Login</a>
              </div>
            ))}
          </div>

          <button
            className="newsroom-home-navbar__menu-button"
            type="button"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="newsroom-home-mobile-menu"
            onClick={() => {
              onCloseSidebar?.();
              setMobileOpen((current) => {
                const next = !current;
                if (!next) setMobileEcosystemOpen(false);
                return next;
              });
            }}
          >
            <Menu size={25} aria-hidden="true" />
          </button>

          <div
            id="newsroom-home-mobile-menu"
            className={`newsroom-home-navbar__mobile-menu${
              mobileOpen ? " is-open" : ""
            }`}
          >
            <div className="newsroom-home-navbar__mobile-navigation">
              <button
                className="newsroom-home-navbar__mobile-sidebar-button"
                type="button"
                onClick={openNewsroomSidebar}
              >
                <PanelLeft size={21} aria-hidden="true" />
                Newsroom Lab
              </button>

              <a
                className={`newsroom-home-navbar__mobile-link${
                  isActiveRoute(currentPath, "/") ? " is-active" : ""
                }`}
                href="/"
                onClick={closeMobileMenu}
              >
                Home
              </a>

              <div className="newsroom-home-navbar__mobile-ecosystem">
                <button
                  className="newsroom-home-navbar__mobile-ecosystem-button"
                  type="button"
                  aria-expanded={mobileEcosystemOpen}
                  aria-controls="newsroom-home-mobile-ecosystem"
                  onClick={() =>
                    setMobileEcosystemOpen((current) => !current)
                  }
                >
                  Our Ecosystem
                  <ChevronDown
                    className={`newsroom-home-navbar__chevron${
                      mobileEcosystemOpen ? " is-open" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id="newsroom-home-mobile-ecosystem"
                  className={`newsroom-home-navbar__mobile-ecosystem-list${
                    mobileEcosystemOpen ? " is-open" : ""
                  }`}
                >
                  <div className="newsroom-home-navbar__mobile-ecosystem-inner">
                    {ecosystemItems.map((item) => (
                      <a
                        className={`newsroom-home-navbar__mobile-ecosystem-link${
                          isActiveRoute(currentPath, item.href)
                            ? " is-active"
                            : ""
                        }`}
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <a
                className={`newsroom-home-navbar__mobile-link${
                  isActiveRoute(currentPath, "/portofolio") ? " is-active" : ""
                }`}
                href="/portofolio"
                onClick={closeMobileMenu}
              >
                Portofolio
              </a>

              {mobileOpen && (isAuthenticated ? (
                <Suspense fallback={null}>
                  <NavbarAccountControl variant="mobile" onNavigate={closeMobileMenu} />
                </Suspense>
              ) : (
                <div className="newsroom-home-navbar__mobile-actions">
                  <a href="/daftar" onClick={closeMobileMenu}>Daftar</a>
                  <a href="/login" onClick={closeMobileMenu}>Login</a>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default NewsroomNavbar;
