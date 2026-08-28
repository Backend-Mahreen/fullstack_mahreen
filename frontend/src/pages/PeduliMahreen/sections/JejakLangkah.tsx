import { useEffect } from "react";
import jejakImageOne from "../../../assets/PeduliMahreen/jejaklangkah1.webp";
import jejakImageTwo from "../../../assets/PeduliMahreen/jejaklangkah2.webp";
import jejakImageThree from "../../../assets/PeduliMahreen/jejaklangkah3.webp";
import jejakImageFour from "../../../assets/PeduliMahreen/jejaklangkah4.png";


const useLiteReveal = (selector: string) => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector]);
};

const jejakLangkahStyles = `
  .jejak-langkah-section {
    width: 100%;
    background: #000000;
    padding: 36px 18px 78px;
    color: #f6f1e8;
  }

  .jejak-langkah-section,
  .jejak-langkah-section *,
  .jejak-langkah-section *::before,
  .jejak-langkah-section *::after {
    box-sizing: border-box;
  }

  .jejak-langkah__inner {
    width: min(100%, 980px);
    margin: 0 auto;
  }

  .jejak-langkah__title {
    margin: 0 0 48px;
    color: #f6f1e8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(30px, 3.1vw, 43px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.045em;
    text-align: center;
  }

  .jejak-langkah__gallery {
    width: 100%;
    display: grid;
    grid-template-columns: 2.08fr 1fr 1fr;
    grid-template-rows: 218px 218px;
    gap: 14px;
  }

  .jejak-langkah__item {
    position: relative;
    overflow: hidden;
    min-width: 0;
    min-height: 0;
    margin: 0;
    background: #111111;
  }

  .jejak-langkah__item::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.12)),
      radial-gradient(circle at 50% 38%, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.14) 100%);
  }

  .jejak-langkah__item img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.08) brightness(0.78);
    transform: scale(1.01);
  }

  .jejak-langkah__item--large {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .jejak-langkah__item--large img {
    object-position: center center;
  }

  .jejak-langkah__item--top {
    grid-column: 2;
    grid-row: 1;
  }

  .jejak-langkah__item--top img {
    object-position: center center;
  }

  .jejak-langkah__item--bottom {
    grid-column: 2;
    grid-row: 2;
  }

  .jejak-langkah__item--bottom img {
    object-position: center center;
  }

  .jejak-langkah__item--right {
    grid-column: 3;
    grid-row: 1 / span 2;
  }

  .jejak-langkah__item--right img {
    object-position: center center;
  }



  [data-lite-reveal] {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
    transition:
      opacity 560ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }

  [data-lite-reveal="left"] {
    transform: translate3d(-22px, 0, 0);
  }

  [data-lite-reveal="right"] {
    transform: translate3d(22px, 0, 0);
  }

  [data-lite-reveal="fade"] {
    transform: none;
  }

  [data-lite-reveal].is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    will-change: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-lite-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
      will-change: auto;
    }
  }

  @media (max-width: 920px) {
    .jejak-langkah-section {
      padding: 52px 22px 76px;
    }

    .jejak-langkah__inner {
      width: min(100%, 720px);
    }

    .jejak-langkah__title {
      margin-bottom: 34px;
    }

    .jejak-langkah__gallery {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 300px 210px 300px;
    }

    .jejak-langkah__item--large {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    .jejak-langkah__item--top {
      grid-column: 1;
      grid-row: 2;
    }

    .jejak-langkah__item--bottom {
      grid-column: 2;
      grid-row: 2;
    }

    .jejak-langkah__item--right {
      grid-column: 1 / -1;
      grid-row: 3;
    }
  }

  @media (max-width: 560px) {
    .jejak-langkah-section {
      padding: 44px 18px 64px;
    }

    .jejak-langkah__title {
      margin-bottom: 28px;
      font-size: 32px;
    }

    .jejak-langkah__gallery {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .jejak-langkah__item {
      height: 220px;
    }

    .jejak-langkah__item--large,
    .jejak-langkah__item--right {
      height: 280px;
    }
  }
`;

const JejakLangkah = () => {
  useLiteReveal(".jejak-langkah-section [data-lite-reveal]");

  return (
    <section className="jejak-langkah-section" aria-labelledby="jejak-langkah-title">
      <style data-component="jejak-langkah-section">{jejakLangkahStyles}</style>

      <div className="jejak-langkah__inner">
        <h2 className="jejak-langkah__title" id="jejak-langkah-title" data-lite-reveal>
          Jejak Langkah
        </h2>

        <div className="jejak-langkah__gallery" aria-label="Galeri kegiatan Peduli Mahreen">
          <figure className="jejak-langkah__item jejak-langkah__item--large" data-lite-reveal style={{ transitionDelay: "80ms" }}>
            <img width="667" height="617"
              src={jejakImageOne}
              alt="Kegiatan kelas inspirasi Peduli Mahreen"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <figure className="jejak-langkah__item jejak-langkah__item--top" data-lite-reveal style={{ transitionDelay: "150ms" }}>
            <img width="668" height="627"
              src={jejakImageTwo}
              alt="Dokumentasi proses belajar kreatif"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <figure className="jejak-langkah__item jejak-langkah__item--bottom" data-lite-reveal style={{ transitionDelay: "210ms" }}>
            <img width="747" height="690"
              src={jejakImageThree}
              alt="Dokumentasi tim Peduli Mahreen"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <figure className="jejak-langkah__item jejak-langkah__item--right" data-lite-reveal style={{ transitionDelay: "280ms" }}>
            <img width="333" height="642"
              src={jejakImageFour}
              alt="Ruang belajar Peduli Mahreen"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default JejakLangkah;
