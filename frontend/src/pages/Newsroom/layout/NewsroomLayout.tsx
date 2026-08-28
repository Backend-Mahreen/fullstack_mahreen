import { useLayoutEffect, type ReactNode } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import ClosingSection from "../../../components/Closing-section/Closing-section";
import Footer from "../../../components/Footer/Footer";

type NewsroomLayoutProps = Readonly<{
  children: ReactNode;
  showClosingSection?: boolean;
  contentClassName?: string;
}>;

const layoutStyles = `
  @keyframes newsroom-global-section-in {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  html.newsroom-subpage-document,
  body.newsroom-subpage-body {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: hidden !important;
    background: #000000 !important;
  }

  .newsroom-global-layout {
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100svh;
    overflow-x: hidden;
    background: #000000;
    isolation: isolate;
  }

  .newsroom-global-layout__content {
    width: 100%;
    min-width: 0;
  }

  .newsroom-global-layout__closing,
  .newsroom-global-layout__footer {
    width: 100%;
    min-width: 0;
    background: #000000;
    animation: newsroom-global-section-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-global-layout__footer {
    animation-delay: 90ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-global-layout__closing,
    .newsroom-global-layout__footer {
      animation: none;
    }
  }
`;

const NewsroomLayout = ({
  children,
  showClosingSection = true,
  contentClassName = "",
}: NewsroomLayoutProps) => {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("newsroom-subpage-document");
    body.classList.add("newsroom-subpage-body");

    // A route can be opened after the Newsroom drawer/mobile menu. Clear
    // stale lock classes before the first painted frame of the new page.
    body.classList.remove("newsroom-sidebar-open");

    return () => {
      html.classList.remove("newsroom-subpage-document");
      body.classList.remove("newsroom-subpage-body");
    };
  }, []);

  const contentClasses = ["newsroom-global-layout__content", contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="newsroom-global-layout">
      <style>{layoutStyles}</style>
      <Navbar homeHref="/" homeLabel="Home" />

      <div className={contentClasses}>{children}</div>

      {showClosingSection && (
        <div className="newsroom-global-layout__closing">
          <ClosingSection />
        </div>
      )}

      <div className="newsroom-global-layout__footer">
        <Footer />
      </div>
    </div>
  );
};

export default NewsroomLayout;
