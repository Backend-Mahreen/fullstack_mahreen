import { useEffect } from "react";
import NewsroomLayout from "../layout/NewsroomLayout";
import HeroSection from "./sections/HeroSection";
import LearningSection from "./sections/LearningSection";
import SearchFilterSection from "./sections/SearchFilterSection";
import TimelineSection from "./sections/TimelineSection";
import type { WebinarData } from "../../../data/webinars";

const styles = `
  .webinar-detail-page {
    --webinar-gold: #d9b868;

    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    color: #f4eee6;
    background: #000;
    font-family: Arial, Helvetica, sans-serif;
  }

  .webinar-detail-page,
  .webinar-detail-page *,
  .webinar-detail-page *::before,
  .webinar-detail-page *::after {
    box-sizing: border-box;
  }

  .webinar-detail-page a {
    color: inherit;
    text-decoration: none;
  }

  .webinar-detail-page button,
  .webinar-detail-page input,
  .webinar-detail-page select {
    font: inherit;
  }

  .webinar-detail-page__main {
    width: 100%;
    min-width: 0;
    overflow-x: clip;
    padding-top: var(--navbar-height, 74px);
    background: #000;
  }

  .webinar-detail-page [data-webinar-reveal] {
    opacity: 0;
    transform: translate3d(0, 32px, 0) scale(0.985);
    transition:
      opacity 680ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .webinar-detail-page [data-webinar-reveal].is-visible {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .webinar-detail-page *,
    .webinar-detail-page *::before,
    .webinar-detail-page *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .webinar-detail-page [data-webinar-reveal] {
      opacity: 1;
      transform: none;
    }
  }
`;

type WebinarDetailProps = {
  webinar: WebinarData;
};

const WebinarDetail = ({ webinar }: WebinarDetailProps) => {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".webinar-detail-page [data-webinar-reveal]:not(.is-visible)",
      ),
    );

    if (elements.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [webinar.slug]);

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="webinar-detail-page">
          <main className="webinar-detail-page__main">
          <HeroSection webinar={webinar} />
          <SearchFilterSection />
          <LearningSection webinar={webinar} />
          <TimelineSection webinar={webinar} />
          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default WebinarDetail;
