import { useEffect } from "react";


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
    padding: 88px 24px 96px;
    color: #f5f1e8;
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
    text-align: center;
  }

  .jejak-langkah__title {
    margin: 0;
    color: #f3efe7;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(42px, 6vw, 74px);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -0.03em;
  }

  .jejak-langkah__subtitle {
    margin: 34px auto 0;
    max-width: 680px;
    color: rgba(243, 239, 231, 0.78);
    font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    font-size: 20px;
    line-height: 1.8;
    font-weight: 400;
  }

  .jejak-langkah__actions {
    margin-top: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .jejak-langkah__button {
    min-width: 230px;
    height: 58px;
    padding: 0 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.25s ease;
    border: 1px solid transparent;
  }

  .jejak-langkah__button--primary {
    background: #c8a96b;
    color: #111111;
    border-color: #c8a96b;
  }

  .jejak-langkah__button--primary:hover {
    background: #d4b67b;
    border-color: #d4b67b;
  }

  .jejak-langkah__button--secondary {
    background: transparent;
    color: #f3efe7;
    border-color: rgba(243, 239, 231, 0.22);
  }

  .jejak-langkah__button--secondary:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(243, 239, 231, 0.4);
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

  @media (max-width: 768px) {
    .jejak-langkah-section {
      padding: 72px 20px 80px;
    }

    .jejak-langkah__title {
      font-size: clamp(34px, 9vw, 56px);
      line-height: 1.02;
    }

    .jejak-langkah__subtitle {
      margin-top: 26px;
      font-size: 16px;
      line-height: 1.75;
      max-width: 620px;
    }

    .jejak-langkah__actions {
      margin-top: 34px;
      gap: 14px;
    }

    .jejak-langkah__button {
      width: 100%;
      max-width: 320px;
      min-width: unset;
      height: 56px;
    }
  }
`;

const JejakLangkah = () => {
  useLiteReveal(".jejak-langkah-section [data-lite-reveal]");

  return (
    <section className="jejak-langkah-section" aria-labelledby="peduli-contribution-title">
      <style data-component="jejak-langkah-section">{jejakLangkahStyles}</style>

      <div className="jejak-langkah__inner">
        <h2 className="jejak-langkah__title" id="peduli-contribution-title" data-lite-reveal>
          Jadilah Bagian dari
          <br />
          Perubahan
        </h2>

        <p className="jejak-langkah__subtitle" data-lite-reveal style={{ transitionDelay: "90ms" }}>
          Kontribusi Anda, sekecil apa pun, akan menjadi lentera bagi masa depan mereka.
          Mari berkolaborasi menciptakan ekosistem pendidikan yang lebih bermartabat.
        </p>

        <div className="jejak-langkah__actions" data-lite-reveal style={{ transitionDelay: "180ms" }}>
          <a href="/peduli-mahreen/donasi" className="jejak-langkah__button jejak-langkah__button--primary">
            Ikut Berkontribusi
          </a>

          <a href="/contact?pillar=peduli" className="jejak-langkah__button jejak-langkah__button--secondary">
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
};

export default JejakLangkah;
