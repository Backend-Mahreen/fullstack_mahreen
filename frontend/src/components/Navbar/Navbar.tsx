import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  APP_BEFORE_NAVIGATION_EVENT,
  APP_NAVIGATION_EVENT,
} from "../../utils/hashNavigation";
import "./Navbar.css";

const NavbarAccountControl = lazy(() => import("./NavbarAccountControl"));

type NavigationItem = {
  label: string;
  href: string;
};

type NavbarProps = Readonly<{
  homeHref?: string;
  homeLabel?: string;
  profileSidebarOpen?: boolean;
  onProfileSidebarToggle?: () => void;
}>;

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

const Navbar = ({
  homeHref = "/",
  homeLabel = "Home",
  profileSidebarOpen = false,
  onProfileSidebarToggle,
}: NavbarProps) => {
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileEcosystemOpen, setMobileEcosystemOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => getCurrentRoute());
  const [isMobileViewport, setIsMobileViewport] = useState(false);

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
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const nextIsScrolled = window.scrollY > 12;
        setIsScrolled((current) =>
          current === nextIsScrolled ? current : nextIsScrolled,
        );
        frame = 0;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateCurrentPath = () => {
      setCurrentPath(getCurrentRoute());
      setMobileOpen(false);
      setMobileEcosystemOpen(false);
    };

    updateCurrentPath();
    window.addEventListener("popstate", updateCurrentPath);
    const closeOpenMenus = () => {
      setMobileOpen(false);
      setMobileEcosystemOpen(false);
      setEcosystemOpen(false);
    };

    window.addEventListener(APP_NAVIGATION_EVENT, updateCurrentPath);
    window.addEventListener(APP_BEFORE_NAVIGATION_EVENT, closeOpenMenus);

    return () => {
      window.removeEventListener("popstate", updateCurrentPath);
      window.removeEventListener(APP_NAVIGATION_EVENT, updateCurrentPath);
      window.removeEventListener(APP_BEFORE_NAVIGATION_EVENT, closeOpenMenus);
    };
  }, []);

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

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
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
      <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
        <nav
          className={`navbar${onProfileSidebarToggle ? " has-profile-sidebar-control" : ""}`}
          aria-label="Navigasi utama Mahreen Indonesia"
        >
          {onProfileSidebarToggle ? (
            <button
              className="navbar__profile-sidebar-button"
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setMobileEcosystemOpen(false);
                onProfileSidebarToggle();
              }}
              aria-label={profileSidebarOpen ? "Tutup menu profil" : "Buka menu profil"}
              aria-expanded={profileSidebarOpen}
              aria-controls="profile-editor-sidebar"
              title={profileSidebarOpen ? "Tutup menu profil" : "Buka menu profil"}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M9 3v18M14 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}

          <div className="navbar__left">
            {isAuthenticated && (
              <a
                className={`navbar__link${
                  isActiveRoute(currentPath, homeHref) ? " is-active" : ""
                }`}
                href={homeHref}
                aria-current={
                  isActiveRoute(currentPath, homeHref) ? "page" : undefined
                }
              >
                {homeLabel}
              </a>
            )}

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
                    className={`navbar__dropdown-link${
                      isActiveRoute(currentPath, item.href) ? " is-active" : ""
                    }`}
                    key={item.label}
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
          </div>

          <a
            className="navbar__logo-link"
            href={homeHref}
            aria-label={`Kembali ke ${homeLabel}`}
            onClick={closeMobileMenu}
          >
            <img
              className="navbar__logo"
              src="/mahreen-logo-192.webp"
              srcSet="/mahreen-logo-192.webp 192w, /mahreen-logo-384.webp 384w"
              sizes="(max-width: 520px) 70vw, (max-width: 900px) 235px, 186px"
              alt="Mahreen Indonesia"
              width="330"
              height="110"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </a>

          <div className="navbar__right">
            <a
              className={`navbar__link${
                isActiveRoute(currentPath, "/portofolio") ? " is-active" : ""
              }`}
              href="/portofolio"
              aria-current={
                isActiveRoute(currentPath, "/portofolio") ? "page" : undefined
              }
            >
              Portofolio
            </a>

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

            {!isMobileViewport && (isAuthenticated ? (
              <Suspense fallback={null}>
                <NavbarAccountControl />
              </Suspense>
            ) : (
              <div className="navbar__auth">
                <a className="navbar__auth-link" href="/daftar">Daftar</a>
                <span className="navbar__separator" aria-hidden="true">|</span>
                <a className="navbar__auth-link" href="/login">Login</a>
              </div>
            ))}
          </div>

          <button
            className={`navbar__menu-button${mobileOpen ? " is-open" : ""}`}
            type="button"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              if (profileSidebarOpen) {
                onProfileSidebarToggle?.();
              }

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
              {isAuthenticated && (
                <a
                  className={`navbar__mobile-link${
                    isActiveRoute(currentPath, homeHref) ? " is-active" : ""
                  }`}
                  href={homeHref}
                  aria-current={
                    isActiveRoute(currentPath, homeHref) ? "page" : undefined
                  }
                  onClick={closeMobileMenu}
                >
                  {homeLabel}
                </a>
              )}

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

              {mobileOpen && (isAuthenticated ? (
                <Suspense fallback={null}>
                  <NavbarAccountControl variant="mobile" onNavigate={closeMobileMenu} />
                </Suspense>
              ) : (
                <div className="navbar__mobile-actions">
                  <a className="navbar__mobile-register" href="/daftar" onClick={closeMobileMenu}>
                    Daftar
                  </a>
                  <a className="navbar__mobile-login" href="/login" onClick={closeMobileMenu}>
                    Login
                  </a>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
