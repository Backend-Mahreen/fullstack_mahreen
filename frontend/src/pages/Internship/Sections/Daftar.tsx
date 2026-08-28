import { useEffect, useRef } from "react";

const daftarStyles = `
  .daftar-section {
    width: 100%;
    overflow: hidden;
    padding: 58px 28px 72px;
    background: #050505;
    color: #ffffff;
  }

  .daftar-section,
  .daftar-section *,
  .daftar-section *::before,
  .daftar-section *::after {
    box-sizing: border-box;
  }

  .daftar-section__inner {
    width: min(100%, 1280px);
    margin: 0 auto;
  }

  .daftar-section__panel {
    position: relative;
    min-height: 430px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px 48px;
    border: 1px solid rgba(255, 255, 255, 0.085);
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.015) 0%,
        rgba(255, 255, 255, 0.004) 100%
      ),
      #0d0d0d;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.018);
    opacity: 0;
    transform: translate3d(0, 26px, 0) scale(0.985);
    will-change: opacity, transform;
  }

  .daftar-section.is-visible .daftar-section__panel {
    animation: daftarPanelEnter 760ms cubic-bezier(0.22, 1, 0.36, 1)
      80ms both;
  }

  .daftar-section__content {
    width: min(100%, 880px);
    margin: 0 auto;
    text-align: center;
  }

  .daftar-section__title,
  .daftar-section__description,
  .daftar-section__actions {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  .daftar-section.is-visible .daftar-section__title {
    animation: daftarContentEnter 620ms cubic-bezier(0.22, 1, 0.36, 1)
      210ms both;
  }

  .daftar-section.is-visible .daftar-section__description {
    animation: daftarContentEnter 620ms cubic-bezier(0.22, 1, 0.36, 1)
      320ms both;
  }

  .daftar-section.is-visible .daftar-section__actions {
    animation: daftarContentEnter 620ms cubic-bezier(0.22, 1, 0.36, 1)
      430ms both;
  }

  .daftar-section__title {
    max-width: 820px;
    margin: 0 auto;
    color: #f5f0e8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: -0.042em;
    text-wrap: balance;
  }

  .daftar-section__description {
    max-width: 760px;
    margin: 26px auto 0;
    color: rgba(255, 255, 255, 0.72);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: clamp(15px, 1.4vw, 18px);
    font-weight: 400;
    line-height: 1.58;
  }

  .daftar-section__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    margin-top: 48px;
  }

  .daftar-section__button {
    min-width: 220px;
    min-height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border: 1px solid rgba(230, 197, 126, 0.62);
    background: transparent;
    color: #e5c57c;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 2.3px;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      transform 180ms ease,
      color 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .daftar-section__button:hover,
  .daftar-section__button:focus-visible {
    transform: translateY(-3px);
    outline: none;
  }

  .daftar-section__button--primary {
    border-color: #e6c57e;
    background: #e6c57e;
    color: #17120a;
    box-shadow: 0 0 0 rgba(230, 197, 126, 0);
  }

  .daftar-section__button--primary:hover,
  .daftar-section__button--primary:focus-visible {
    border-color: #efd38e;
    background: #efd38e;
    color: #100d08;
    box-shadow: 0 0 26px rgba(230, 197, 126, 0.17);
  }

  .daftar-section__button--secondary:hover,
  .daftar-section__button--secondary:focus-visible {
    border-color: #e6c57e;
    background: rgba(230, 197, 126, 0.055);
    color: #f0d58d;
    box-shadow: 0 0 22px rgba(230, 197, 126, 0.08);
  }

  @keyframes daftarPanelEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 26px, 0) scale(0.985);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes daftarContentEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 760px) {
    .daftar-section {
      padding: 46px 18px 58px;
    }

    .daftar-section__panel {
      min-height: 400px;
      padding: 52px 28px;
    }

    .daftar-section__title {
      font-size: 44px;
    }

    .daftar-section__description {
      font-size: 15px;
    }

    .daftar-section__actions {
      gap: 14px;
      margin-top: 40px;
    }

    .daftar-section__button {
      min-width: 190px;
      min-height: 50px;
    }
  }

  @media (max-width: 520px) {
    .daftar-section {
      padding: 40px 14px 50px;
    }

    .daftar-section__panel {
      min-height: 410px;
      padding: 46px 20px;
    }

    .daftar-section__title {
      font-size: 36px;
    }

    .daftar-section__description {
      margin-top: 20px;
      font-size: 14px;
    }

    .daftar-section__actions {
      flex-direction: column;
      gap: 12px;
      margin-top: 34px;
    }

    .daftar-section__button {
      width: min(100%, 240px);
      min-width: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .daftar-section__panel,
    .daftar-section__title,
    .daftar-section__description,
    .daftar-section__actions,
    .daftar-section.is-visible .daftar-section__panel,
    .daftar-section.is-visible .daftar-section__title,
    .daftar-section.is-visible .daftar-section__description,
    .daftar-section.is-visible .daftar-section__actions {
      opacity: 1;
      transform: none;
      animation: none;
      will-change: auto;
    }

    .daftar-section__button {
      transition: none;
    }
  }
`;

const Daftar = () => {
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
        threshold: 0.18,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="daftar-internship"
      ref={sectionRef}
      className="daftar-section"
      aria-labelledby="daftar-title"
    >
      <style data-component="daftar-section">{daftarStyles}</style>

      <div className="daftar-section__inner">
        <div className="daftar-section__panel">
          <div className="daftar-section__content">
            <h2 className="daftar-section__title" id="daftar-title">
              Siap Mengembangkan Karier Bersama Mahreen?
            </h2>

            <p className="daftar-section__description">
              The world of luxury and digital excellence awaits. Join our
              community of visionaries and start building your future today.
            </p>

            <div
              className="daftar-section__actions"
              aria-label="Aksi pendaftaran internship"
            >
              <a
                className="daftar-section__button daftar-section__button--primary"
                href="/internship/form"
              >
                Daftar Sekarang
              </a>

              <a
                className="daftar-section__button daftar-section__button--secondary"
                href="/contact?pillar=internship"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Daftar;
