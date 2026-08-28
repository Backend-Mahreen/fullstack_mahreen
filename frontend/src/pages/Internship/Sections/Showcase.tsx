import { useEffect, useRef, type CSSProperties } from "react";
import impactTeamImage from "../../../assets/Internship/impact-team.webp";
import creativeObjectImage from "../../../assets/Internship/creative-object.jpg";
import localImpactMobileImage from "../../../assets/Internship/local-impact-mobile.jpg";

type ShowcaseStyle = CSSProperties & {
  "--showcase-delay": string;
};

const showcaseStyles = `
  .showcase-section {
    width: 100%;
    overflow: hidden;
    padding: 72px 48px 94px;
    background: #050505;
    color: #ffffff;
  }

  .showcase-section,
  .showcase-section *,
  .showcase-section *::before,
  .showcase-section *::after {
    box-sizing: border-box;
  }

  .showcase-section__inner {
    width: min(100%, 1440px);
    margin: 0 auto;
  }

  .showcase-section__header {
    position: relative;
    min-height: 106px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 36px;
    margin-bottom: 42px;
  }

  .showcase-section__title {
    margin: 0;
    color: #f4efe8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(48px, 4.4vw, 66px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
    opacity: 0;
    transform: translate3d(0, 24px, 0);
  }

  .showcase-section.is-visible .showcase-section__title {
    animation: showcaseTitleEnter 720ms cubic-bezier(0.22, 1, 0.36, 1)
      70ms both;
  }

  .showcase-section__view-all {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-top: 17px;
    color: #d9b65f;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 2.2px;
    text-decoration: none;
    text-transform: uppercase;
    opacity: 0;
    transform: translate3d(18px, 0, 0);
    transition:
      color 180ms ease,
      text-shadow 180ms ease;
  }

  .showcase-section.is-visible .showcase-section__view-all {
    animation: showcaseLinkEnter 620ms cubic-bezier(0.22, 1, 0.36, 1)
      150ms both;
  }

  .showcase-section__view-all-arrow {
    display: inline-block;
    transition: transform 180ms ease;
  }

  .showcase-section__view-all:hover,
  .showcase-section__view-all:focus-visible {
    color: #efd184;
    text-shadow: 0 0 12px rgba(217, 182, 95, 0.22);
    outline: none;
  }

  .showcase-section__view-all:hover .showcase-section__view-all-arrow,
  .showcase-section__view-all:focus-visible .showcase-section__view-all-arrow {
    transform: translateX(4px);
  }

  .showcase-section__grid {
    display: grid;
    grid-template-columns: minmax(0, 2.05fr) minmax(360px, 1fr);
    gap: 28px;
    align-items: stretch;
  }

  .showcase-section__main,
  .showcase-section__side-item {
    position: relative;
    overflow: hidden;
    background: #0d0d0d;
    opacity: 0;
    transform: translate3d(0, 28px, 0) scale(0.975);
    will-change: opacity, transform;
  }

  .showcase-section.is-visible .showcase-section__main,
  .showcase-section.is-visible .showcase-section__side-item {
    animation: showcaseMediaEnter 760ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--showcase-delay) both;
  }

  .showcase-section__main {
    min-height: 720px;
  }

  .showcase-section__side {
    display: grid;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }

  .showcase-section__side-item {
    min-height: 346px;
  }

  .showcase-section__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition:
      transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 260ms ease;
  }

  .showcase-section__main .showcase-section__image {
    object-position: center;
    filter: saturate(0.92) brightness(0.93) contrast(1.03);
  }

  .showcase-section__side-item .showcase-section__image {
    object-position: center;
    filter: saturate(0.88) brightness(0.88) contrast(1.05);
  }

  .showcase-section__main::after,
  .showcase-section__side-item::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.01) 0%,
        rgba(0, 0, 0, 0.03) 55%,
        rgba(0, 0, 0, 0.12) 100%
      );
    pointer-events: none;
  }

  .showcase-section__main:hover .showcase-section__image,
  .showcase-section__main:focus-within .showcase-section__image,
  .showcase-section__side-item:hover .showcase-section__image,
  .showcase-section__side-item:focus-within .showcase-section__image {
    transform: scale(1.025);
    filter: saturate(0.96) brightness(0.98) contrast(1.02);
  }

  @keyframes showcaseTitleEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 24px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes showcaseLinkEnter {
    from {
      opacity: 0;
      transform: translate3d(18px, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes showcaseMediaEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 28px, 0) scale(0.975);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (max-width: 1050px) {
    .showcase-section {
      padding: 60px 28px 76px;
    }

    .showcase-section__grid {
      grid-template-columns: 1fr;
    }

    .showcase-section__main {
      min-height: 650px;
    }

    .showcase-section__side {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: none;
    }

    .showcase-section__side-item {
      min-height: 390px;
    }
  }

  @media (max-width: 680px) {
    .showcase-section {
      padding: 46px 16px 58px;
    }

    .showcase-section__header {
      min-height: auto;
      display: block;
      margin-bottom: 30px;
    }

    .showcase-section__title {
      font-size: 43px;
    }

    .showcase-section__view-all {
      margin-top: 18px;
    }

    .showcase-section__grid,
    .showcase-section__side {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .showcase-section__main {
      min-height: 500px;
    }

    .showcase-section__side-item {
      min-height: 360px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .showcase-section__title,
    .showcase-section__view-all,
    .showcase-section__main,
    .showcase-section__side-item,
    .showcase-section.is-visible .showcase-section__title,
    .showcase-section.is-visible .showcase-section__view-all,
    .showcase-section.is-visible .showcase-section__main,
    .showcase-section.is-visible .showcase-section__side-item {
      opacity: 1;
      transform: none;
      animation: none;
      will-change: auto;
    }

    .showcase-section__image,
    .showcase-section__view-all-arrow {
      transition: none;
    }
  }
`;

const Showcase = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        section.classList.add("is-visible");
        observer.disconnect();
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="impact-showcase"
      ref={sectionRef}
      className="showcase-section"
      aria-labelledby="impact-showcase-title"
    >
      <style data-component="showcase-section">{showcaseStyles}</style>

      <div className="showcase-section__inner">
        <header className="showcase-section__header">
          <h2
            className="showcase-section__title"
            id="impact-showcase-title"
          >
            Impact Showcase
          </h2>

          <a className="showcase-section__view-all" href="/portofolio">
            View All Projects
            <span
              className="showcase-section__view-all-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </header>

        <div className="showcase-section__grid">
          <article
            className="showcase-section__main"
            style={
              {
                "--showcase-delay": "150ms",
              } as ShowcaseStyle
            }
          >
            <img width="1100" height="1190"
              className="showcase-section__image"
              src={impactTeamImage}
              alt="Tim kreatif Mahreen sedang berkolaborasi dalam sebuah proyek"
              loading="lazy"
              decoding="async"
            />
          </article>

          <div className="showcase-section__side">
            <article
              className="showcase-section__side-item"
              style={
                {
                  "--showcase-delay": "235ms",
                } as ShowcaseStyle
              }
            >
              <img width="760" height="875"
                className="showcase-section__image"
                src={creativeObjectImage}
                alt="Karya visual eksperimental berbentuk objek tiga dimensi"
                loading="lazy"
                decoding="async"
              />
            </article>

            <article
              className="showcase-section__side-item"
              style={
                {
                  "--showcase-delay": "320ms",
                } as ShowcaseStyle
              }
            >
              <img width="760" height="825"
                className="showcase-section__image"
                src={localImpactMobileImage}
                alt="Tampilan proyek Local Impact pada perangkat seluler"
                loading="lazy"
                decoding="async"
              />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
