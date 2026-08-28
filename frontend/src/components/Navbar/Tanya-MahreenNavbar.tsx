import { lazy, Suspense, useEffect, useRef, useState } from "react";
import iconStudio from "../../assets/Navbar/icon-tanyamahreen.png";

const NavbarAccountControl = lazy(() => import("./NavbarAccountControl"));

type NavigationItem = {
  label: string;
  href: string;
};

const ecosystemItems: readonly NavigationItem[] = [
  { label: "Mahreen Studio", href: "/mahreen-studio" },
  { label: "Tanya Mahreen", href: "/tanya-mahreen" },
  { label: "Peduli Mahreen", href: "/peduli-mahreen" },
  { label: "Mahreen CSR", href: "/mahreen-csr" },
  { label: "Internship", href: "/internship" },
];

const getCurrentRoute = () => {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
};

const normalizePath = (path: string) => {
  if (!path) return "/";

  const pathWithoutHashPrefix = path.startsWith("#") ? path.slice(1) : path;
  const cleanPath = pathWithoutHashPrefix.split("?")[0].split("#")[0] || "/";

  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    return cleanPath.slice(0, -1);
  }

  return cleanPath;
};

const isActiveRoute = (currentPath: string, href: string) => {
  const normalizedCurrentPath = normalizePath(currentPath);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/") {
    return normalizedCurrentPath === "/";
  }

  return (
    normalizedCurrentPath === normalizedHref ||
    normalizedCurrentPath.startsWith(`${normalizedHref}/`)
  );
};

const navbarStyles = `

  :root {
    --navbar-height: 78px;
    --navbar-text: rgba(255, 255, 255, 0.94);
    --navbar-gold: #d7b982;
    --navbar-border: rgba(255, 255, 255, 0.08);
    --navbar-font-size: 12px;
    --navbar-letter-spacing: 1.85px;
  }

  html,
  body,
  #root {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    background: #000000 !important;
  }

  body {
    display: block !important;
    place-items: initial !important;
    color: #ffffff !important;
  }

  html.mobile-nav-open,
  body.mobile-nav-open {
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  #root {
    display: block !important;
    min-height: 100svh !important;
    text-align: initial !important;
  }

  .site-header {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 1000;
    width: 100%;
    height: var(--navbar-height);
    background: rgba(0, 0, 0, 0.96);
    border-bottom: 1px solid var(--navbar-border);
    transition:
      background-color 200ms ease,
      border-color 200ms ease,
      box-shadow 200ms ease,
      backdrop-filter 200ms ease;
  }

  .site-header.is-scrolled {
    background: rgba(0, 0, 0, 0.88);
    border-bottom-color: rgba(215, 185, 130, 0.22);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow:
      0 12px 34px rgba(0, 0, 0, 0.42),
      0 0 18px rgba(215, 185, 130, 0.08);
  }

  .navbar {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    width: 100%;
    height: var(--navbar-height);
    margin: 0;
    padding: 0 28px 0 20px;
    box-sizing: border-box;
    color: var(--navbar-text);
  }

  .navbar *,
  .navbar *::before,
  .navbar *::after {
    box-sizing: border-box;
  }

  .navbar a,
  .navbar button {
    color: inherit;
    font: inherit;
    text-decoration: none;
  }

  .navbar__brand {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    width: fit-content;
    min-width: 0;
    line-height: 0;
    color: #ffffff;
  }

  .navbar__brand:focus-visible {
    outline: 1px solid rgba(215, 185, 130, 0.68);
    outline-offset: 7px;
  }

  .navbar__brand-logo {
    display: block;
    width: 290px;
    height: 74px;
    object-fit: contain;
    object-position: left center;
    flex: 0 0 auto;
    filter:
      drop-shadow(0 0 8px rgba(255, 255, 255, 0.08))
      drop-shadow(0 0 14px rgba(215, 185, 130, 0.08));
  }

  .navbar__center {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 0;
    gap: clamp(24px, 3vw, 46px);
    padding-left: clamp(28px, 3.4vw, 46px);
  }

  .navbar__right {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 11px;
    min-width: 0;
  }

  .navbar__link,
  .navbar__auth-link,
  .navbar__ecosystem-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid transparent;
    outline: 0;
    background: transparent;
    border-radius: 999px;
    white-space: nowrap;
    cursor: pointer;
    color: var(--navbar-text);
    font-family: "Inter", Arial, Helvetica, sans-serif;
    font-size: var(--navbar-font-size) !important;
    font-weight: 500;
    line-height: 1;
    letter-spacing: var(--navbar-letter-spacing) !important;
    text-transform: uppercase;
    transition:
      color 220ms ease,
      background-color 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease,
      transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .navbar__auth-link {
    font-size: 12px !important;
    letter-spacing: 1.65px !important;
  }

  .navbar__separator {
    display: inline-block;
    color: rgba(255, 255, 255, 0.62);
    font-family: "Inter", Arial, Helvetica, sans-serif;
    font-size: 12px;
    line-height: 1;
    transform: translateY(-1px);
  }

  .navbar__link.is-active,
  .navbar__auth-link.is-active {
    color: var(--navbar-gold);
  }

  /* Efek Hover Desktop: Hanya Glow Teks Emas (Tanpa Garis Oval) */
  .navbar__link:hover,
  .navbar__auth-link:hover,
  .navbar__ecosystem-button:hover {
    color: var(--navbar-gold);
    background: transparent;
    border-color: transparent; /* Kunci: Membuat garis tepi hilang */
    transform: translateY(-1px);
    text-shadow:
      0 0 8px rgba(215, 185, 130, 0.9),
      0 0 18px rgba(215, 185, 130, 0.5); /* Efek glow pada teks emas */
    box-shadow: none; /* Kunci: Menghilangkan bayangan kotak berbentuk oval */
  }

  .navbar__link:focus-visible,
  .navbar__auth-link:focus-visible,
  .navbar__ecosystem-button:focus-visible {
    outline: 1px solid rgba(215, 185, 130, 0.72);
    outline-offset: 5px;
  }

  .navbar__ecosystem {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .navbar__ecosystem-button {
    gap: 12px;
  }

  .navbar__chevron {
    width: 13px;
    height: 8px;
    flex: 0 0 auto;
    color: currentColor;
    transform: translateY(1px);
    transition: transform 220ms ease;
  }

  .navbar__chevron.is-open {
    transform: translateY(1px) rotate(180deg);
  }

  .navbar__dropdown {
    position: absolute;
    top: calc(100% + 9px);
    left: 50%;
    width: 205px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid rgba(215, 185, 130, 0.22);
    border-radius: 14px;
    background: rgba(5, 5, 5, 0.96);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow:
      0 20px 44px rgba(0, 0, 0, 0.46),
      0 0 20px rgba(215, 185, 130, 0.1);
    visibility: hidden;
    opacity: 0;
    transform: translate(-50%, -8px);
    pointer-events: none;
    transition:
      opacity 220ms ease,
      transform 220ms ease,
      visibility 220ms ease;
  }

  .navbar__dropdown.is-open {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, 0);
    pointer-events: auto;
  }

  .navbar__dropdown-link {
    display: block;
    border-radius: 10px;
    padding: 11px 12px;
    color: rgba(255, 255, 255, 0.76);
    font-family: "Inter", Arial, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 1.35px;
    text-transform: uppercase;
    transition:
      color 220ms ease,
      background-color 220ms ease,
      box-shadow 220ms ease,
      transform 220ms ease;
  }

  /* Mengatasi efek glow saat hover di dropdown desktop */
  .navbar__dropdown-link:hover,
  .navbar__dropdown-link:focus-visible {
    color: var(--navbar-gold) !important;
    background: transparent !important;
    transform: translateX(2px);
    text-shadow:
      0 0 8px rgba(215, 185, 130, 0.8),
      0 0 16px rgba(215, 185, 130, 0.4);
    box-shadow: none !important;
  }

  /* Mengatasi background yg masih nempel saat halamannya aktif */
  .navbar__dropdown-link.is-active {
    color: var(--navbar-gold) !important;
    background: transparent !important;
    text-shadow:
      0 0 8px rgba(215, 185, 130, 0.8),
      0 0 16px rgba(215, 185, 130, 0.4);
    box-shadow: none !important;
  }

  .navbar__menu-button,
  .navbar__mobile-menu {
    display: none;
  }

  @media (max-width: 1120px) {
    .navbar {
      padding-right: 22px;
    }

    .navbar__center {
      gap: 22px;
      padding-left: 26px;
    }

    .navbar__brand-logo {
      width: 250px;
      height: 64px;
    }
  }

  @media (max-width: 1024px) {
    :root {
      --navbar-height: 74px;
    }

    .site-header {
      height: var(--navbar-height);
      background: rgba(0, 0, 0, 0.98);
      border-bottom: 1px solid rgba(255, 255, 255, 0.055);
    }

    .navbar {
      position: relative;
      z-index: 1002;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      width: 100%;
      height: var(--navbar-height);
      padding: 0 18px;
    }

    .navbar__center,
    .navbar__right {
      display: none;
    }

    .navbar__brand {
      position: relative;
      z-index: 1003;
      justify-self: start;
    }

    .navbar__brand-logo {
      width: 270px;
      height: 66px;
      object-fit: contain;
      object-position: left center;
    }

    .navbar__menu-button {
      position: relative;
      z-index: 1005;
      grid-column: 2;
      justify-self: end;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
      border-radius: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .navbar__menu-button:focus,
    .navbar__menu-button:active,
    .navbar__menu-button:focus-visible {
      background: transparent;
      border: 0;
      outline: none;
      box-shadow: none;
    }

    .navbar__menu-button span {
      display: block;
      height: 3px;
      margin: 3px 0;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
      transform-origin: center;
      transition:
        width 320ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity 220ms ease,
        background-color 220ms ease;
    }

    .navbar__menu-button span:nth-child(1) {
      width: 27px;
    }

    .navbar__menu-button span:nth-child(2) {
      width: 27px;
    }

    .navbar__menu-button span:nth-child(3) {
      width: 14px;
    }

    .navbar__menu-button.is-open span:nth-child(1) {
      width: 25px;
      transform: translateY(9px) rotate(45deg);
    }

    .navbar__menu-button.is-open span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .navbar__menu-button.is-open span:nth-child(3) {
      width: 25px;
      transform: translateY(-9px) rotate(-45deg);
    }

    .navbar__mobile-menu {
      position: fixed;
      top: var(--navbar-height);
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: calc(100dvh - var(--navbar-height));
      padding:
        clamp(40px, 6vh, 64px)
        20px
        max(30px, env(safe-area-inset-bottom));
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      border: 0;
      border-radius: 0;
      background:
        radial-gradient(
          circle at 68% 30%,
          rgba(153, 118, 76, 0.08),
          transparent 30%
        ),
        radial-gradient(
          circle at 20% 12%,
          rgba(255, 255, 255, 0.025),
          transparent 28%
        ),
        linear-gradient(
          145deg,
          rgba(27, 29, 28, 0.998),
          rgba(12, 11, 10, 1) 55%,
          rgba(6, 6, 6, 1)
        );
      visibility: hidden;
      opacity: 0;
      transform: translateY(-14px);
      pointer-events: none;
      transition:
        opacity 380ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 380ms cubic-bezier(0.16, 1, 0.3, 1),
        visibility 380ms ease;
    }

    .navbar__mobile-menu.is-open {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .navbar__mobile-navigation {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 420px;
      margin: auto 0;
    }

    .navbar__mobile-link,
    .navbar__mobile-ecosystem-button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: min(100%, 330px);
      min-height: 52px;
      margin: 3px 0;
      padding: 10px 24px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: rgba(255, 255, 255, 0.95);
      font-family: "Playfair Display", Georgia, serif;
      font-size: clamp(23px, 6.4vw, 29px);
      font-weight: 400;
      line-height: 1.25;
      letter-spacing: -0.5px;
      text-transform: none;
      text-decoration: none;
      cursor: pointer;
      transition:
        color 260ms ease,
        background-color 260ms ease,
        box-shadow 260ms ease,
        transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .navbar__mobile-link.is-active {
      color: #d7b982;
    }

    /* Hover Navigasi Mobile: Hapus Background */
    .navbar__mobile-link:hover,
    .navbar__mobile-link:focus-visible,
    .navbar__mobile-ecosystem-button:hover,
    .navbar__mobile-ecosystem-button:focus-visible {
      color: var(--navbar-gold);
      background: transparent;
      transform: translateY(-1px);
      text-shadow:
        0 0 8px rgba(215, 185, 130, 0.9),
        0 0 18px rgba(215, 185, 130, 0.5);
      box-shadow: none;
    }

    .navbar__mobile-ecosystem {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .navbar__mobile-ecosystem-button {
      gap: 12px;
    }

    .navbar__mobile-ecosystem-chevron {
      width: 15px;
      height: 9px;
      flex: 0 0 auto;
      color: rgba(255, 255, 255, 0.92);
      transform: translateY(2px);
      transition:
        transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
        color 260ms ease;
    }

    .navbar__mobile-ecosystem-chevron.is-open {
      color: #d7b982;
      transform: translateY(2px) rotate(180deg);
    }

    .navbar__mobile-ecosystem-list {
      display: grid;
      grid-template-rows: 0fr;
      width: 100%;
      opacity: 0;
      transition:
        grid-template-rows 420ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity 280ms ease;
    }

    .navbar__mobile-ecosystem-list.is-open {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .navbar__mobile-ecosystem-inner {
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .navbar__mobile-ecosystem-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 5px 0 14px;
    }

    .navbar__mobile-ecosystem-link {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: min(100%, 290px);
      min-height: 42px;
      margin: 2px 0;
      padding: 10px 18px;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.7);
      font-family: "Inter", Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      letter-spacing: 1.3px;
      text-transform: uppercase;
      text-align: center;
      text-decoration: none;
      transition:
        color 240ms ease,
        background-color 240ms ease,
        box-shadow 240ms ease,
        transform 240ms ease;
    }

    /* Mengatasi efek glow saat hover di dropdown mobile */
    .navbar__mobile-ecosystem-link:hover,
    .navbar__mobile-ecosystem-link:focus-visible {
      color: var(--navbar-gold) !important;
      background: transparent !important;
      transform: translateY(-1px);
      text-shadow:
        0 0 8px rgba(215, 185, 130, 0.8),
        0 0 16px rgba(215, 185, 130, 0.4);
      box-shadow: none !important;
    }

    /* Mengatasi background yg nempel pada menu aktif di dropdown mobile */
    .navbar__mobile-ecosystem-link.is-active {
      color: var(--navbar-gold) !important;
      background: transparent !important;
      text-shadow:
        0 0 8px rgba(215, 185, 130, 0.8),
        0 0 16px rgba(215, 185, 130, 0.4);
      box-shadow: none !important;
    }

    .navbar__mobile-actions {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 274px;
      gap: 15px;
      margin-top: 30px;
    }

    .navbar__mobile-register,
    .navbar__mobile-login {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 49px;
      padding: 0 24px;
      border-radius: 999px;
      font-family: "Inter", Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0;
      text-transform: uppercase;
      text-decoration: none;
      transition:
        transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
        border-color 280ms ease,
        background 280ms ease,
        color 280ms ease,
        box-shadow 280ms ease;
    }

    .navbar__mobile-register {
      border: 1px solid rgba(255, 255, 255, 0.88);
      background: transparent;
      color: #ffffff;
    }

    .navbar__mobile-login {
      border: 1px solid #d7b982;
      background: #d7b982;
      color: #111111;
    }

    /* Hover Tombol Daftar Mobile: Hapus Background */
    .navbar__mobile-register:hover,
    .navbar__mobile-register:focus-visible {
      color: var(--navbar-gold);
      border-color: rgba(215, 185, 130, 0.82);
      background: transparent;
      transform: translateY(-1px);
      text-shadow:
        0 0 8px rgba(215, 185, 130, 0.9),
        0 0 18px rgba(215, 185, 130, 0.45);
      box-shadow:
        0 0 12px rgba(215, 185, 130, 0.22),
        0 0 26px rgba(215, 185, 130, 0.12);
    }

    .navbar__mobile-login:hover,
    .navbar__mobile-login:focus-visible {
      transform: translateY(-1px);
      box-shadow:
        0 0 14px rgba(215, 185, 130, 0.52),
        0 0 30px rgba(215, 185, 130, 0.24);
    }
  }

  @media (max-width: 520px) {
    :root {
      --navbar-height: 72px;
    }

    .navbar {
      padding: 0 15px;
    }

    .navbar__brand-logo {
      width: min(250px, 70vw);
      height: 64px;
    }

    .navbar__menu-button {
      width: 34px;
      height: 34px;
    }

    .navbar__menu-button span:nth-child(1),
    .navbar__menu-button span:nth-child(2) {
      width: 25px;
    }

    .navbar__menu-button span:nth-child(3) {
      width: 13px;
    }

    .navbar__menu-button.is-open span:nth-child(1) {
      width: 24px;
    }

    .navbar__menu-button.is-open span:nth-child(3) {
      width: 24px;
    }

    .navbar__mobile-menu {
      padding:
        clamp(34px, 5.5vh, 50px)
        18px
        max(28px, env(safe-area-inset-bottom));
    }

    .navbar__mobile-link,
    .navbar__mobile-ecosystem-button {
      width: min(100%, 310px);
      min-height: 50px;
      padding: 9px 20px;
      font-size: clamp(22px, 6.5vw, 27px);
    }

    .navbar__mobile-actions {
      margin-top: 25px;
    }
  }

  @media (max-width: 360px) {
    .navbar__brand-logo {
      width: min(220px, 68vw);
      height: 58px;
    }

    .navbar__mobile-link,
    .navbar__mobile-ecosystem-button {
      font-size: 21px;
    }

    .navbar__mobile-menu {
      padding-top: 28px;
    }

    .navbar__mobile-actions {
      margin-top: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-header,
    .navbar__link,
    .navbar__auth-link,
    .navbar__ecosystem-button,
    .navbar__dropdown,
    .navbar__dropdown-link,
    .navbar__menu-button span,
    .navbar__mobile-menu,
    .navbar__mobile-ecosystem-list,
    .navbar__mobile-ecosystem-chevron,
    .navbar__mobile-link,
    .navbar__mobile-ecosystem-button,
    .navbar__mobile-ecosystem-link,
    .navbar__mobile-register,
    .navbar__mobile-login {
      transition: none;
    }
  }
`;

const Navbar = () => {
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileEcosystemOpen, setMobileEcosystemOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => getCurrentRoute());
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches,
  );

  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ecosystemRef.current &&
        !ecosystemRef.current.contains(event.target as Node)
      ) {
        setEcosystemOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateCurrentPath = () => {
      setCurrentPath(getCurrentRoute());
      setMobileOpen(false);
      setMobileEcosystemOpen(false);
      setEcosystemOpen(false);
    };

    updateCurrentPath();
    window.addEventListener("popstate", updateCurrentPath);
    window.addEventListener("mahreen:navigation", updateCurrentPath);

    return () => {
      window.removeEventListener("popstate", updateCurrentPath);
      window.removeEventListener("mahreen:navigation", updateCurrentPath);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 1024;
      setIsMobileViewport(isMobile);

      if (!isMobile) {
        setMobileOpen(false);
        setMobileEcosystemOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.toggle("mobile-nav-open", mobileOpen);
    body.classList.toggle("mobile-nav-open", mobileOpen);

    return () => {
      html.classList.remove("mobile-nav-open");
      body.classList.remove("mobile-nav-open");
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMobileEcosystemOpen(false);
        setEcosystemOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileEcosystemOpen(false);
    setEcosystemOpen(false);
  };

  const isEcosystemActive = ecosystemItems.some((item) =>
    isActiveRoute(currentPath, item.href)
  );

  return (
    <>
      <style data-component="navbar">{navbarStyles}</style>

      <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
        <nav className="navbar" aria-label="Navigasi utama Tanya Mahreen">
          <a
            className="navbar__brand"
            href="/tanya-mahreen"
            aria-label="Tanya Mahreen Beranda"
            onClick={closeMobileMenu}
          >
            <img
              className="navbar__brand-logo"
              src={iconStudio}
              alt="Tanya Mahreen"
              width="290"
              height="74"
              decoding="async"
            />
          </a>

          <div className="navbar__center">
            <a
              className={`navbar__link${
                isActiveRoute(currentPath, "/newsroom") ? " is-active" : ""
              }`}
              href="/newsroom"
              aria-current={
                isActiveRoute(currentPath, "/newsroom") ? "page" : undefined
              }
            >
              Newsroom
            </a>

            <div className="navbar__ecosystem" ref={ecosystemRef}>
              <button
                className={`navbar__ecosystem-button${
                  isEcosystemActive ? " is-active" : ""
                }`}
                type="button"
                aria-expanded={ecosystemOpen}
                aria-controls="ecosystem-menu"
                onClick={() => {
                  setEcosystemOpen((currentValue) => !currentValue);
                }}
              >
                <span>Our Ecosystem</span>

                <svg
                  className={`navbar__chevron${ecosystemOpen ? " is-open" : ""}`}
                  viewBox="0 0 14 9"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1.5 1.5L7 7L12.5 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id="ecosystem-menu"
                className={`navbar__dropdown${ecosystemOpen ? " is-open" : ""}`}
              >
                {ecosystemItems.map((item) => (
                  <a
                    key={item.label}
                    className={`navbar__dropdown-link${
                      isActiveRoute(currentPath, item.href) ? " is-active" : ""
                    }`}
                    href={item.href}
                    aria-current={
                      isActiveRoute(currentPath, item.href) ? "page" : undefined
                    }
                    onClick={() => {
                      setEcosystemOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              className={`navbar__link${
                isActiveRoute(currentPath, "/tentang") ? " is-active" : ""
              }`}
              href="/tentang"
              aria-current={
                isActiveRoute(currentPath, "/tentang") ? "page" : undefined
              }
            >
              Tentang
            </a>

          </div>
          <div className="navbar__right" aria-label="Aksi akun">
            {!isMobileViewport ? (
              <Suspense fallback={null}>
                <NavbarAccountControl />
              </Suspense>
            ) : null}
          </div>

          <button
            className={`navbar__menu-button${mobileOpen ? " is-open" : ""}`}
            type="button"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setMobileOpen((currentValue) => {
                const nextValue = !currentValue;

                if (!nextValue) {
                  setMobileEcosystemOpen(false);
                }

                return nextValue;
              });
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <div
            id="mobile-menu"
            className={`navbar__mobile-menu${mobileOpen ? " is-open" : ""}`}
          >
            <div className="navbar__mobile-navigation">
              <a
                className={`navbar__mobile-link${
                  isActiveRoute(currentPath, "/tanya-mahreen")
                    ? " is-active"
                    : ""
                }`}
                href="/tanya-mahreen"
                aria-current={
                  isActiveRoute(currentPath, "/tanya-mahreen")
                    ? "page"
                    : undefined
                }
                onClick={closeMobileMenu}
              >
                Home
              </a>

              <a
                className={`navbar__mobile-link${
                  isActiveRoute(currentPath, "/tentang") ? " is-active" : ""
                }`}
                href="/tentang"
                aria-current={
                  isActiveRoute(currentPath, "/tentang") ? "page" : undefined
                }
                onClick={closeMobileMenu}
              >
                Tentang
              </a>

              <div className="navbar__mobile-ecosystem">
                <button
                  className={`navbar__mobile-ecosystem-button${
                    isEcosystemActive ? " is-active" : ""
                  }`}
                  type="button"
                  aria-expanded={mobileEcosystemOpen}
                  aria-controls="mobile-ecosystem-menu"
                  onClick={() => {
                    setMobileEcosystemOpen(
                      (currentValue) => !currentValue
                    );
                  }}
                >
                  <span>Our Ecosystem</span>

                  <svg
                    className={`navbar__mobile-ecosystem-chevron${
                      mobileEcosystemOpen ? " is-open" : ""
                    }`}
                    viewBox="0 0 14 9"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 1.5L7 7L12.5 1.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  id="mobile-ecosystem-menu"
                  className={`navbar__mobile-ecosystem-list${
                    mobileEcosystemOpen ? " is-open" : ""
                  }`}
                >
                  <div className="navbar__mobile-ecosystem-inner">
                    <div className="navbar__mobile-ecosystem-content">
                      {ecosystemItems.map((item) => (
                        <a
                          key={item.label}
                          className={`navbar__mobile-ecosystem-link${
                            isActiveRoute(currentPath, item.href)
                              ? " is-active"
                              : ""
                          }`}
                          href={item.href}
                          aria-current={
                            isActiveRoute(currentPath, item.href)
                              ? "page"
                              : undefined
                          }
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <a
                className={`navbar__mobile-link${
                  isActiveRoute(currentPath, "/portofolio")
                    ? " is-active"
                    : ""
                }`}
                href="/portofolio"
                aria-current={
                  isActiveRoute(currentPath, "/portofolio")
                    ? "page"
                    : undefined
                }
                onClick={closeMobileMenu}
              >
                Portofolio
              </a>

              <a
                className={`navbar__mobile-link${
                  isActiveRoute(currentPath, "/newsroom")
                    ? " is-active"
                    : ""
                }`}
                href="/newsroom"
                aria-current={
                  isActiveRoute(currentPath, "/newsroom")
                    ? "page"
                    : undefined
                }
                onClick={closeMobileMenu}
              >
                Newsroom
              </a>
              {mobileOpen ? (
                <Suspense fallback={null}>
                  <NavbarAccountControl variant="mobile" onNavigate={closeMobileMenu} />
                </Suspense>
              ) : null}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
