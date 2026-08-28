import StudioNavbar from "../../../components/Navbar/StudioNavbar";
import FeaturedPieces from "./sections/FeaturedPieces";
import InnerCircle from "./sections/InnerCircle";
import heroBg from "../../../assets/Mahreen-Studio/LatestCollection/hero_bg.webp";
import Footer from '../../../components/Footer/Footer';
import ClosingSection from '../../../components/Cloasing-section/cloasing-section';

const lastestColectionsStyles = `

  .lastest-hero {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 640px;
    overflow: hidden;
    background: #000000;
  }

  .lastest-hero *,
  .lastest-hero *::before,
  .lastest-hero *::after {
    box-sizing: border-box;
  }

  .lastest-hero__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: brightness(0.55) saturate(0.7);
  }

  .lastest-hero__overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg,
        rgba(0,0,0,0.15) 0%,
        rgba(0,0,0,0.05) 40%,
        rgba(0,0,0,0.55) 75%,
        rgba(0,0,0,0.92) 100%
      );
  }

  .lastest-hero__content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 clamp(16px, 4vw, 32px) clamp(48px, 7vh, 80px);
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Animasi Hero Section (Staggered Fade Up) */
  @keyframes heroFadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .lastest-hero__eyebrow {
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #d6a35c;
    margin: 0 0 14px;
    opacity: 0;
    animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s;
  }

  .lastest-hero__title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 16px;
    line-height: 1.0;
    letter-spacing: -0.03em;
    max-width: 640px;
    opacity: 0;
    animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s;
  }

  .lastest-hero__description {
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(14px, 1.2vw, 15px);
    font-weight: 300;
    color: rgba(255,255,255,0.7);
    margin: 0 0 36px;
    line-height: 1.65;
    max-width: 420px;
    opacity: 0;
    animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s;
  }

  .lastest-hero__actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    opacity: 0;
    animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.5s;
  }

  .lastest-hero__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    padding: 0 28px;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .lastest-hero__btn--primary {
    background: #d6a35c;
    color: #000000;
  }

  .lastest-hero__btn--primary:hover {
    background: #c4923f;
  }

  .lastest-hero__btn--outline {
    background: transparent;
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.35);
  }

  .lastest-hero__btn--outline:hover {
    border-color: #ffffff;
    background: rgba(255,255,255,0.06);
  }

  @media (max-width: 480px) {
    .lastest-hero__actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .lastest-hero__btn {
      width: 100%;
      justify-content: center;
    }
  }
`;

const LastestColections = () => {
  return (
    <>
      <style data-component="lastest-colections">{lastestColectionsStyles}</style>
      <StudioNavbar />

      <main style={{ paddingTop: 0 }}>

        {/* ── HERO ── */}
        <section className="lastest-hero" aria-labelledby="lastest-hero-title">
          <img
            src={heroBg}
            alt="Mahreen Studio Latest Collection"
            className="lastest-hero__bg"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1431"
            height="817"
          />
          <div className="lastest-hero__overlay" aria-hidden="true" />

          <div className="lastest-hero__content">
            <p className="lastest-hero__eyebrow">Edition 01 / Lookbook</p>
            <h1 className="lastest-hero__title" id="lastest-hero-title">
              Latest Collection
            </h1>
            <p className="lastest-hero__description">
              An exploration of form, texture, and silence. Our latest drop
              redefines modern essentials through the lens of architectural
              minimalism and superior craftsmanship.
            </p>
            <div className="lastest-hero__actions">
              <a
                href="#featured-pieces"
                className="lastest-hero__btn lastest-hero__btn--primary"
              >
                Discover the Edit
              </a>
              {/* PERBAIKAN: Tombol diarahkan ke katalog semua produk di Studio Utama */}
              <a
                href="/mahreen-studio?section=produk-unggulan"
                className="lastest-hero__btn lastest-hero__btn--outline"
              >
                View All Products
              </a>
            </div>
          </div>
        </section>

        {/* ── FEATURED PIECES ── */}
        <FeaturedPieces />

        {/* ── INNER CIRCLE ── */}
        <InnerCircle />
        <ClosingSection/>
        <Footer />
      </main>
    </>
  );
};

export default LastestColections;
