import heroBackground from "../../../assets/CSR/hero-background.webp";

const stats = [
  { value: "15+", label: "Program\nCSR" },
  { value: "50+", label: "Mitra\nKolaborasi" },
  { value: "1K+", label: "Penerima\nManfaat" },
  { value: "20+", label: "Kota/Kabupaten\nTerjangkau" },
  { value: "3+", label: "Tahun\nBerkontribusi" },
  { value: "100%", label: "Komitmen\nDampak" },
];

const heroStyles = `

  /* ── Hero Section ── */
  .csr-hero {
    position: relative;
    width: 100%;
    min-height: 700px;
    background-image:
      linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.35) 0%,
        rgba(5, 5, 5, 0.80) 60%,
        #050505 100%
      ),
      url("${heroBackground}");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .csr-hero__container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 320px 48px 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .csr-hero__content {
    display: flex;
    flex-direction: column;
    max-width: 768px;
  }

  .csr-hero__subtitle {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 3.2px;
    color: #E5C483;
  }

  .csr-hero__title {
    margin: 16px 0 0;
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    font-weight: 700;
    line-height: 72px;
    letter-spacing: -1.28px;
    color: #E5E2E1;
  }

  .csr-hero__description {
    margin: 23.25px 0 0;
    font-family: 'Manrope', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 29px;
    color: #D0C5B5;
  }

  .csr-hero__actions {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
    margin-top: 40px;
  }

  .csr-hero__button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 58px;
    border-radius: 4px;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }

  .csr-hero__button:active {
    transform: translateY(0) scale(0.98) !important;
    box-shadow: none !important;
  }

  .csr-hero__button--primary {
    padding: 17px 40px;
    background: #E5C483;
    color: #402D00;
    border: none;
  }

  .csr-hero__button--primary:hover {
    background: #d4b376;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(229, 196, 131, 0.25);
  }

  .csr-hero__button--outline {
    padding: 16px 40px;
    background: transparent;
    color: #E5C483;
    border: 1px solid #E5C483;
  }

  .csr-hero__button--outline:hover {
    background: rgba(229, 196, 131, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(229, 196, 131, 0.12);
  }

  /* ── Stats Section ── */
  .csr-stats {
    background: #050505;
    padding: 48px 0;
  }

  .csr-stats__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
  }

  .csr-stats__grid {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }

  .csr-stats__card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    background: #111111;
    border: 1px solid #1A1A1A;
    box-sizing: border-box;
  }

  .csr-stats__value {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 700;
    line-height: 56px;
    color: #E5C483;
    text-align: center;
  }

  .csr-stats__label {
    margin-top: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #D0C5B5;
    text-align: center;
    white-space: pre-line;
  }

  /* ── Responsive: Tablet ── */
  @media (max-width: 1024px) {
    .csr-hero__container {
      padding-top: 200px;
      padding-bottom: 80px;
    }

    .csr-hero__title {
      font-size: 48px;
      line-height: 56px;
      letter-spacing: -0.96px;
    }

    .csr-stats__container {
      padding: 0 40px;
    }
  }

  /* ── Responsive: Mobile ── */
  @media (max-width: 768px) {
    .csr-hero {
      min-height: auto;
    }

    .csr-hero__container {
      padding: 140px 18px 60px;
    }

    .csr-hero__content {
      max-width: 100%;
    }

    .csr-hero__subtitle {
      font-size: 14px;
      letter-spacing: 2.6px;
    }

    .csr-hero__title {
      font-size: 36px;
      line-height: 42px;
      letter-spacing: -0.72px;
    }

    .csr-hero__description {
      font-size: 15px;
      line-height: 24px;
    }

    .csr-hero__actions {
      flex-direction: column;
      gap: 12px;
    }

    .csr-hero__button {
      width: 100%;
    }

    .csr-stats {
      padding: 32px 0;
    }

    .csr-stats__container {
      padding: 0 18px;
    }

    .csr-stats__grid {
      flex-wrap: wrap;
      gap: 16px;
    }

    .csr-stats__card {
      flex: 0 0 calc((100% - 16px) / 2);
    }

    .csr-stats__value {
      font-size: 36px;
      line-height: 42px;
    }

    .csr-stats__label {
      font-size: 14px;
    }
  }

  /* ── Responsive: Small Mobile ── */
  @media (max-width: 420px) {
    .csr-hero__title {
      font-size: 28px;
      line-height: 34px;
      letter-spacing: -0.56px;
    }

    .csr-hero__description {
      font-size: 14px;
      line-height: 22px;
    }

    .csr-stats__card {
      flex: 0 0 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .csr-hero__button {
      transition: none;
    }
  }
`;

const HeroSection = () => {
  return (
    <>
      <style data-component="csr-hero-section">{heroStyles}</style>

      <section className="csr-hero" aria-labelledby="csr-hero-title">
        <div className="csr-hero__container">
          <div className="csr-hero__content">
            <p className="csr-hero__subtitle">ELEVATING SOCIAL IMPACT</p>

            <h1 className="csr-hero__title" id="csr-hero-title">
              Mahreen CSR
            </h1>

            <p className="csr-hero__description">
              Mahreen CSR merupakan komitmen Mahreen Indonesia dalam menciptakan
              dampak sosial yang berkelanjutan melalui kolaborasi, pemberdayaan
              masyarakat, pendidikan, lingkungan, serta kemitraan strategis
              dengan berbagai pihak.
            </p>

            <nav className="csr-hero__actions" aria-label="Aksi Hero CSR">
              <a
                className="csr-hero__button csr-hero__button--primary"
                href="/mahreen-csr?section=program-unggulan"
              >
                Pelajari Program
              </a>
              <a
                className="csr-hero__button csr-hero__button--outline"
                href="/contact?pillar=csr"
              >
                Hubungi Kami
              </a>
            </nav>
          </div>
        </div>
      </section>

      <section className="csr-stats" aria-label="Statistik CSR">
        <div className="csr-stats__container">
          <div className="csr-stats__grid">
            {stats.map((stat) => (
              <div className="csr-stats__card" key={stat.label}>
                <span className="csr-stats__value">{stat.value}</span>
                <span className="csr-stats__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
