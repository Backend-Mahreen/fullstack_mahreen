import Navbar from "../../components/Navbar/Navbar";
import Karya from "./sections/Karya";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import CTA from "../../components/CTA/CTA";

const stats = [
  { value: "50+", label: "PROYEK SELESAI" },
  { value: "5", label: "PILAR EKOSISTEM" },
  { value: "15+", label: "KOLABORASI CSR" },
  { value: "100%", label: "DAMPAK POSITIF" },
] as const;

const portofolioStyles = `

  .portofolio-page {
    width: 100%;
    min-height: 100vh;
    background: #111111;
    color: #ffffff;
  }

  .portofolio-page,
  .portofolio-page *,
  .portofolio-page *::before,
  .portofolio-page *::after {
    box-sizing: border-box;
  }

  @keyframes portofolioHeroEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .portofolio-hero {
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 118px 24px 96px;
    background:
      radial-gradient(circle at 50% 18%, rgba(197, 168, 128, 0.045) 0, transparent 34%),
      linear-gradient(180deg, #101010 0%, #111111 100%);
  }

  .portofolio-hero__inner {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
    animation: portofolioHeroEnter 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .portofolio-hero__eyebrow {
    margin: 0 0 22px;
    color: #c5a880;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 2.1px;
    text-transform: uppercase;
  }

  .portofolio-hero__title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(52px, 5.45vw, 86px);
    font-weight: 700;
    line-height: 0.98;
    letter-spacing: -0.045em;
  }

  .portofolio-hero__title-line {
    display: block;
  }

  .portofolio-hero__title-line--gold {
    color: #c5a880;
    font-style: italic;
    font-weight: 400;
  }

  .portofolio-hero__description {
    max-width: 665px;
    margin: 28px auto 0;
    color: rgba(255, 255, 255, 0.63);
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(14px, 1.32vw, 17px);
    font-weight: 300;
    line-height: 1.72;
  }

  .portofolio-hero__stats-wrap {
    width: 100%;
    max-width: 720px;
    margin: 64px auto 0;
    border-top: 1px solid rgba(255, 255, 255, 0.22);
    border-bottom: 1px solid rgba(255, 255, 255, 0.22);
    padding: 34px 0 28px;
  }

  .portofolio-hero__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin: 0;
  }

  .portofolio-hero__stat {
    margin: 0;
    text-align: center;
  }

  .portofolio-hero__stat-value {
    display: block;
    margin: 0;
    color: #c5a880;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(24px, 2.1vw, 34px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.025em;
  }

  .portofolio-hero__stat-label {
    display: block;
    margin: 0 0 8px;
    color: rgba(255, 255, 255, 0.45);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.7px;
    line-height: 1.3;
    text-transform: uppercase;
  }

  @media (prefers-reduced-motion: reduce) {
    .portofolio-hero__inner {
      animation: none;
    }
  }

  @media (max-width: 768px) {
    .portofolio-hero {
      min-height: 100vh;
      min-height: 100svh;
      padding: 104px 20px 84px;
    }

    .portofolio-hero__eyebrow {
      margin-bottom: 18px;
    }

    .portofolio-hero__title {
      font-size: clamp(44px, 12vw, 64px);
    }

    .portofolio-hero__description {
      margin-top: 24px;
      font-size: 14px;
      line-height: 1.68;
    }

    .portofolio-hero__stats-wrap {
      margin-top: 44px;
      padding: 24px 0 22px;
    }

    .portofolio-hero__stats {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .portofolio-hero__stat-label {
      margin-bottom: 7px;
      font-size: 14px;
      letter-spacing: 1.1px;
      line-height: 1.35;
    }

    .portofolio-hero__stat-value {
      font-size: clamp(20px, 5.6vw, 26px);
    }
  }

  @media (max-width: 420px) {
    .portofolio-hero {
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 76px;
    }

    .portofolio-hero__title {
      font-size: clamp(38px, 15vw, 52px);
    }

    .portofolio-hero__stats-wrap {
      margin-top: 38px;
      padding: 22px 0 20px;
    }

    .portofolio-hero__stats {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 4px;
    }

    .portofolio-hero__stat-label {
      margin-bottom: 6px;
      font-size: 14px;
      letter-spacing: 0.75px;
    }

    .portofolio-hero__stat-value {
      font-size: clamp(17px, 5.2vw, 22px);
    }
  }
`;

const Portofolio = () => {
  return (
    <>
      
      <style data-component="portofolio-page">{portofolioStyles}</style>
      <Navbar />

      <main className="portofolio-page">
        <section className="portofolio-hero" aria-labelledby="portofolio-title">
          <div className="portofolio-hero__inner">
            <p className="portofolio-hero__eyebrow">Galeri Portofolio</p>

            <h1 className="portofolio-hero__title" id="portofolio-title">
              <span className="portofolio-hero__title-line">Karya Nyata &</span>
              <span className="portofolio-hero__title-line portofolio-hero__title-line--gold">
                Inovasi Kolaboratif
              </span>
            </h1>

            <p className="portofolio-hero__description">
              Menjelajahi rekam jejak solusi kreatif, transformasi teknologi,
              pemberdayaan sosial, dan pengembangan talenta unggulan dari seluruh
              ekosistem Mahreen Indonesia.
            </p>

            <div className="portofolio-hero__stats-wrap">
              <dl className="portofolio-hero__stats" aria-label="Statistik portofolio Mahreen Indonesia">
                {stats.map((stat) => (
                  <div className="portofolio-hero__stat" key={stat.label}>
                    <dt className="portofolio-hero__stat-label">{stat.label}</dt>
                    <dd className="portofolio-hero__stat-value">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Karya />
        <CTA />
        <ClosingSection />
        <Footer />
      </main>
    </>
  );
};

export default Portofolio;
