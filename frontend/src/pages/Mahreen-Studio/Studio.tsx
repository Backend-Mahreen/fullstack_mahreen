import StudioNavbar from "../../components/Navbar/StudioNavbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import studioHeroBackground from "../../assets/Mahreen-Studio/Home/bground-hero.webp";
import Collection from "./sections/Collection";
import Produk from "./sections/Produk";
import Specialization from "./sections/Specialization";

const studioStyles = `

  .studio-page {
    width: 100%;
    min-height: 100vh;
    background: #050505;
    color: #ffffff;
  }

  .studio-page,
  .studio-page *,
  .studio-page *::before,
  .studio-page *::after {
    box-sizing: border-box;
  }

  .studio-hero {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 112px 24px 88px;
    background: #050505;
  }

  .studio-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background-image:
      linear-gradient(90deg, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.08) 48%, rgba(0, 0, 0, 0.36) 100%),
      url("${studioHeroBackground}");
    background-size: cover;
    background-position: center 56px;
    background-repeat: no-repeat;
    filter: saturate(0.78) brightness(0.82) contrast(1.04);
    animation: studioImageReveal 900ms ease-out both;
  }

  .studio-hero__shade {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.015) 30%, transparent 58%);
    pointer-events: none;
  }

  .studio-hero__inner {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
    transform: translateY(8px);
    animation: studioContentReveal 680ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
  }

  .studio-hero__title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(52px, 5.45vw, 78px);
    font-weight: 700;
    line-height: 0.92;
    letter-spacing: -0.055em;
    text-shadow:
      0 2px 0 rgba(0, 0, 0, 0.34),
      0 16px 40px rgba(0, 0, 0, 0.42);
  }

  .studio-hero__eyebrow {
    width: fit-content;
    margin: -8px auto 16px;
    color: rgba(255, 255, 255, 0.7);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .studio-hero__description {
    max-width: 680px;
    margin: 18px auto 0;
    color: rgba(255, 255, 255, 0.82);
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(14px, 1.1vw, 15px);
    font-weight: 500;
    line-height: 1.55;
    letter-spacing: 7px;
    text-transform: uppercase;
    text-shadow: 0 10px 26px rgba(0, 0, 0, 0.52);
  }

  .studio-hero__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 42px;
  }

  .studio-hero__button {
    position: relative;
    min-width: 170px;
    min-height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 34px;
    border-radius: 999px;
    text-decoration: none;
    overflow: hidden;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.7px;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease,
      color 180ms ease,
      box-shadow 180ms ease;
  }

  .studio-hero__button::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.26) 42%, transparent 62%);
    transform: translateX(-120%);
    transition: transform 420ms ease;
    pointer-events: none;
  }

  .studio-hero__button:hover,
  .studio-hero__button:focus-visible {
    transform: translateY(-2px);
  }

  .studio-hero__button:hover::before,
  .studio-hero__button:focus-visible::before {
    transform: translateX(120%);
  }

  .studio-hero__button:focus-visible {
    outline: 1px solid rgba(214, 180, 112, 0.76);
    outline-offset: 4px;
  }

  .studio-hero__button--primary {
    border: 1px solid #d9b86f;
    background: #d6b36b;
    color: #0a0a0a;
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.35),
      0 0 18px rgba(214, 180, 112, 0.14);
  }

  .studio-hero__button--primary:hover,
  .studio-hero__button--primary:focus-visible {
    background: #e0c07a;
    border-color: #e0c07a;
    box-shadow:
      0 18px 42px rgba(0, 0, 0, 0.44),
      0 0 22px rgba(214, 180, 112, 0.26);
  }

  .studio-hero__button--secondary {
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(0, 0, 0, 0.12);
    color: #ffffff;
    backdrop-filter: blur(6px);
  }

  .studio-hero__button--secondary:hover,
  .studio-hero__button--secondary:focus-visible {
    border-color: rgba(214, 180, 112, 0.66);
    background: rgba(214, 180, 112, 0.08);
    color: #f2d391;
    box-shadow: 0 0 18px rgba(214, 180, 112, 0.18);
  }

  @keyframes studioImageReveal {
    from {
      opacity: 0;
      transform: scale(1.025);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes studioContentReveal {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .studio-hero::before,
    .studio-hero__inner {
      animation: none;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    .studio-hero {
      padding: 104px 20px 78px;
      align-items: center;
    }

    .studio-hero::before {
      background-position: center 42px;
      filter: saturate(0.72) brightness(0.74) contrast(1.04);
    }

    .studio-hero__inner {
      transform: translateY(0);
    }

    .studio-hero__title {
      font-size: clamp(46px, 13vw, 68px);
      line-height: 0.96;
    }

    .studio-hero__eyebrow {
      margin-bottom: 13px;
      font-size: 14px;
      letter-spacing: 1.3px;
    }

    .studio-hero__description {
      max-width: 520px;
      margin-top: 18px;
      font-size: 14px;
      line-height: 1.7;
      letter-spacing: 4px;
    }

    .studio-hero__actions {
      gap: 12px;
      margin-top: 34px;
    }

    .studio-hero__button {
      min-width: 148px;
      min-height: 44px;
      padding: 0 26px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .studio-hero {
      padding: 100px 16px 74px;
    }

    .studio-hero::before {
      background-position: center 34px;
    }

    .studio-hero__title {
      font-size: clamp(40px, 14vw, 56px);
    }

    .studio-hero__description {
      max-width: 330px;
      font-size: 14px;
      letter-spacing: 3px;
    }

    .studio-hero__actions {
      flex-direction: column;
      gap: 12px;
    }

    .studio-hero__button {
      width: 168px;
    }
  }
`;

const Studio = () => {
  return (
    <>
      
      <style data-component="studio-page">{studioStyles}</style>
      <StudioNavbar />

      <main className="studio-page">
        <section className="studio-hero" aria-labelledby="studio-title">
          <span className="studio-hero__shade" aria-hidden="true" />

          <div className="studio-hero__inner">
            <p className="studio-hero__eyebrow">Mahreen Studio</p>

            <h1 className="studio-hero__title" id="studio-title">
              Mahreen Studio
            </h1>

            <p className="studio-hero__description">
              Modern Lifestyle Brand by Mahreen Indonesia
            </p>

            <div className="studio-hero__actions" aria-label="Aksi Mahreen Studio">
              <a
                className="studio-hero__button studio-hero__button--primary"
                href="/mahreen-studio/latest-collection"
              >
                Shop Now
              </a>

              <a
                className="studio-hero__button studio-hero__button--secondary"
                href="/mahreen-studio?section=specializations"
              >
                Explore Atelier
              </a>
            </div>
          </div>
        </section>

        <Collection />

        <Produk />
        <Specialization />

        <ClosingSection />
        <Footer />
      </main>
    </>
  );
};

export default Studio;
