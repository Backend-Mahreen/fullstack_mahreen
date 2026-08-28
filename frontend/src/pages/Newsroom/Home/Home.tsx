import { useEffect, useState } from "react";
import NewsroomNavbar from "./components/NewsroomNavbar";
import NewsroomSidebar from "./components/NewsroomSidebar";
import NewsroomCardStyles from "../components/NewsroomCardStyles";
import DeferredNewsroomSections from "./DeferredNewsroomSections";
import FeaturedSection, {
  type NewsroomCategory,
} from "./sections/FeaturedSection";
import HeroSection from "./sections/HeroSection";
import { APP_BEFORE_NAVIGATION_EVENT } from "../../../utils/hashNavigation";
import useEventStream from "../../../hooks/useEventStream";

const styles = `
  html.newsroom-document,
  body.newsroom-document-body {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: clip !important;
    scroll-behavior: auto !important;
  }

  html.newsroom-sidebar-open,
  body.newsroom-sidebar-open {
    height: 100%;
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  .newsroom-page {
    --newsroom-sidebar-width: 220px;
    --newsroom-navbar-height: 64px;
    --newsroom-gold: #e5c477;
    --newsroom-gold-light: #f0d58f;
    --newsroom-black: #050505;
    --newsroom-panel: #0d0c0b;
    --newsroom-brown: #24211e;
    --newsroom-brown-soft: #302c27;
    --newsroom-border: rgba(229, 196, 119, 0.24);
    --newsroom-muted: #aaa39a;

    position: relative;
    display: flex;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100dvh;
    padding-top: 0;
    align-items: flex-start;
    overflow-x: clip;
    color: #f4efe8;
    background: var(--newsroom-black);
    font-family: Arial, Helvetica, sans-serif;
    overscroll-behavior-x: none;
  }

  .app-route > .newsroom-page {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
    overflow-x: clip !important;
  }

  .newsroom-page,
  .newsroom-page *,
  .newsroom-page *::before,
  .newsroom-page *::after {
    box-sizing: border-box;
  }

  .newsroom-page a {
    color: inherit;
    text-decoration: none;
  }

  .newsroom-page button,
  .newsroom-page input {
    font: inherit;
  }

  .newsroom-main-column {
    position: relative;
    flex: 1 1 0;
    width: calc(100% - var(--newsroom-sidebar-width));
    max-width: calc(100% - var(--newsroom-sidebar-width));
    margin-left: var(--newsroom-sidebar-width);
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    background: #000;
  }

  .newsroom-main {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    background: #000;
  }

  .newsroom-main > *,
  .newsroom-main > * > * {
    min-width: 0;
  }

  .newsroom-content-section {
    width: min(100%, 1220px);
    max-width: 100%;
    margin-inline: auto;
    padding-inline: clamp(28px, 4.5vw, 70px);
  }

  .newsroom-kicker {
    display: inline-flex;
    color: var(--newsroom-gold);
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .newsroom-inline-link {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    color: var(--newsroom-gold);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    transition: color 180ms ease, gap 180ms ease;
  }

  .newsroom-inline-link:hover,
  .newsroom-inline-link:focus-visible {
    gap: 12px;
    color: var(--newsroom-gold-light);
  }

  .newsroom-page [data-newsroom-reveal] {
    opacity: 1;
    transform: none;
    animation: newsroom-reveal-in 260ms ease-out both;
  }

  @keyframes newsroom-reveal-in {
    from {
      opacity: 0.72;
      transform: translate3d(0, 8px, 0);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 1024px) {
    .newsroom-page {
      display: block;
      padding-top: var(--newsroom-navbar-height);
      scroll-padding-top: calc(var(--newsroom-navbar-height) + 12px);
    }

    .newsroom-main-column {
      width: 100%;
      max-width: 100%;
      margin-left: 0;
    }
  }

  @media (max-width: 640px) {
    .newsroom-content-section {
      padding-inline: 20px;
    }

    .newsroom-page [data-newsroom-reveal] {
      animation-duration: 180ms;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-page *,
    .newsroom-page *::before,
    .newsroom-page *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .newsroom-page [data-newsroom-reveal] {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;

const NewsroomHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<NewsroomCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEventStream();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("newsroom-document");
    body.classList.add("newsroom-document-body");

    return () => {
      html.classList.remove(
        "newsroom-document",
        "newsroom-sidebar-open",
        "newsroom-mobile-nav-open",
      );
      body.classList.remove(
        "newsroom-document-body",
        "newsroom-sidebar-open",
        "newsroom-mobile-nav-open",
      );
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const shouldLockPage = isSidebarOpen && window.matchMedia("(max-width: 1024px)").matches;

    html.classList.toggle("newsroom-sidebar-open", shouldLockPage);
    body.classList.toggle("newsroom-sidebar-open", shouldLockPage);

    return () => {
      html.classList.remove("newsroom-sidebar-open");
      body.classList.remove("newsroom-sidebar-open");
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const closeSidebarOnDesktop = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(false);
      }
    };
    const closeSidebarBeforeNavigation = () => setIsSidebarOpen(false);
    const closeSidebarOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    closeSidebarOnDesktop();
    window.addEventListener("resize", closeSidebarOnDesktop);
    window.addEventListener(APP_BEFORE_NAVIGATION_EVENT, closeSidebarBeforeNavigation);
    document.addEventListener("keydown", closeSidebarOnEscape);

    return () => {
      window.removeEventListener("resize", closeSidebarOnDesktop);
      window.removeEventListener(APP_BEFORE_NAVIGATION_EVENT, closeSidebarBeforeNavigation);
      document.removeEventListener("keydown", closeSidebarOnEscape);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <NewsroomCardStyles />

      <NewsroomNavbar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="newsroom-page">
        <NewsroomSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="newsroom-main-column">
          <main className="newsroom-main">
            <HeroSection />
            <FeaturedSection
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onCategoryChange={setActiveCategory}
              onSearchChange={setSearchQuery}
            />
            <DeferredNewsroomSections
              activeCategory={activeCategory}
              searchQuery={searchQuery}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default NewsroomHome;
