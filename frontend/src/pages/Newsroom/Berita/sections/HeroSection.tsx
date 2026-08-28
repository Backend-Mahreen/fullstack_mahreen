import heroBackground from "../../../../assets/Newsroom/berita-hero-background.webp";

const styles = `
  .newsroom-list-hero {
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: clamp(560px, 47vw, 760px);
    overflow: hidden;
    isolation: isolate;
    background: #020303;
  }

  .newsroom-list-hero__background {
    position: absolute;
    inset: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    animation: newsroomListHeroImageReveal 1050ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-list-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(0, 6, 8, 0.96) 0%, rgba(0, 6, 8, 0.74) 38%, rgba(0, 6, 8, 0.23) 72%, rgba(0, 6, 8, 0.12) 100%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.08) 60%, rgba(0, 0, 0, 0.66) 100%);
    pointer-events: none;
  }

  .newsroom-list-hero::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    z-index: -1;
    height: 34%;
    background: linear-gradient(180deg, transparent, #000);
    pointer-events: none;
  }

  .newsroom-list-hero__content {
    display: flex;
    min-height: inherit;
    width: min(100%, 1700px);
    margin: 0 auto;
    padding: clamp(74px, 8vw, 130px) clamp(32px, 6vw, 110px) clamp(72px, 7vw, 112px);
    align-items: center;
  }

  .newsroom-list-hero__copy {
    width: min(1160px, 82%);
    animation: newsroomListHeroCopyReveal 900ms 160ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-list-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    margin-bottom: clamp(34px, 4vw, 58px);
    padding: 0 17px;
    border: 1px solid rgba(229, 196, 119, 0.45);
    border-radius: 999px;
    color: #e5c477;
    background: rgba(229, 196, 119, 0.13);
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .newsroom-list-hero__title {
    max-width: 1180px;
    margin: 0;
    color: #f7f2ea;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(52px, 6.1vw, 112px);
    font-weight: 500;
    line-height: 0.96;
    letter-spacing: -0.045em;
    text-wrap: balance;
    text-shadow: 0 5px 30px rgba(0, 0, 0, 0.34);
  }

  .newsroom-list-hero__title-highlight {
    color: #e8c16b;
    font-style: italic;
    font-weight: 500;
  }

  .newsroom-list-hero__button {
    display: inline-flex;
    min-height: 62px;
    margin-top: clamp(40px, 5vw, 68px);
    padding: 0 28px;
    align-items: center;
    justify-content: center;
    gap: 16px;
    border: 1px solid #e7c676;
    border-radius: 7px;
    color: #17130b;
    background: #e7c676;
    font-size: 14px;
    font-weight: 700;
    transition:
      transform 220ms ease,
      background-color 220ms ease,
      box-shadow 220ms ease;
  }

  .newsroom-list-hero__button::after {
    content: "→";
    font-size: 25px;
    font-weight: 400;
    line-height: 1;
  }

  .newsroom-list-hero__button:hover,
  .newsroom-list-hero__button:focus-visible {
    transform: translateY(-3px);
    background: #f0d486;
    box-shadow: 0 16px 38px rgba(229, 196, 119, 0.18);
  }

  @keyframes newsroomListHeroImageReveal {
    from {
      opacity: 0;
      transform: scale(1.055);
      filter: brightness(0.58);
    }

    to {
      opacity: 1;
      transform: scale(1);
      filter: brightness(1);
    }
  }

  @keyframes newsroomListHeroCopyReveal {
    from {
      opacity: 0;
      transform: translate3d(0, 38px, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 1100px) {
    .newsroom-list-hero__copy {
      width: min(940px, 92%);
    }

    .newsroom-list-hero__title {
      font-size: clamp(52px, 7.3vw, 82px);
    }
  }

  @media (max-width: 760px) {
    .newsroom-list-hero {
      min-height: 640px;
    }

    .newsroom-list-hero__background {
      object-position: 62% center;
    }

    .newsroom-list-hero::before {
      background:
        linear-gradient(90deg, rgba(0, 6, 8, 0.94) 0%, rgba(0, 6, 8, 0.7) 58%, rgba(0, 6, 8, 0.36) 100%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.18) 58%, rgba(0, 0, 0, 0.82) 100%);
    }

    .newsroom-list-hero__content {
      padding: 76px 24px 64px;
      align-items: flex-end;
    }

    .newsroom-list-hero__copy {
      width: 100%;
    }

    .newsroom-list-hero__eyebrow {
      margin-bottom: 28px;
    }

    .newsroom-list-hero__title {
      max-width: 680px;
      font-size: clamp(43px, 12vw, 70px);
      line-height: 1;
    }

    .newsroom-list-hero__button {
      min-height: 56px;
      margin-top: 34px;
      padding: 0 22px;
    }
  }

  @media (max-width: 480px) {
    .newsroom-list-hero {
      min-height: 600px;
    }

    .newsroom-list-hero__background {
      object-position: 68% center;
    }

    .newsroom-list-hero__title {
      font-size: clamp(39px, 12vw, 56px);
      letter-spacing: -0.035em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-list-hero__background,
    .newsroom-list-hero__copy {
      animation: none;
    }
  }
`;

const HeroSection = () => {
  return (
    <>
      <style>{styles}</style>

      <section className="newsroom-list-hero" aria-labelledby="newsroom-feature-title">
        <img
          className="newsroom-list-hero__background"
          src={heroBackground}
          alt="Gedung Mahreen pada malam hari"
          loading="eager"
          decoding="async"
        />

        <div className="newsroom-list-hero__content">
          <div className="newsroom-list-hero__copy">
            <span className="newsroom-list-hero__eyebrow">Feature Story</span>

            <h1 className="newsroom-list-hero__title" id="newsroom-feature-title">
              Masa Depan <span className="newsroom-list-hero__title-highlight">Transformasi</span>{" "}
              <span className="newsroom-list-hero__title-highlight">Digital</span>: Visi Mahreen 2025
            </h1>

            <a
              className="newsroom-list-hero__button"
              href="/newsroom/berita/masa-depan-transformasi-digital"
            >
              Read Full Article
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
