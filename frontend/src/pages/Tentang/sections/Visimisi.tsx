const visiText =
  "Menjadi perusahaan yang inovatif dalam menghadirkan karya, layanan, dan kontribusi nyata di bidang kreatif, digital, dan sosial bagi masyarakat Indonesia.";

const misiItems = [
  "Mengembangkan bidang fashion, digital, kreatif, dan sosial yang berdampak positif bagi masyarakat.",
  "Menghadirkan layanan, karya, dan solusi yang bermanfaat melalui pendekatan kreatif dan profesional.",
  "Membangun kolaborasi dan pemberdayaan yang mendorong perkembangan ekonomi kreatif di Indonesia.",
  "Menjadikan Mahreen Indonesia sebagai ruang bertumbuh yang menghubungkan ide, bakat, dan peluang.",
] as const;

const visimisiSectionStyles = `
  .visimisi-section {
    width: min(100%, 1272px);
    margin: 0 auto;
    padding: 96px 48px;
    border-bottom: 1px solid var(--tentang-border);
  }

  .visimisi-section__header {
    width: 100%;
  }

  .visimisi-section__eyebrow {
    color: var(--tentang-gold);
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .visimisi-section__heading {
    padding-top: 16px;
    color: var(--tentang-white);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 48px;
    font-weight: 400;
    line-height: 48px;
  }

  .visimisi-section__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    width: 100%;
    padding-top: 48px;
  }

  .visimisi-section__card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px;
    background: var(--tentang-panel);
    border: 1px solid var(--tentang-border);
    border-radius: 16px;
  }

  .visimisi-section__card-icon {
    width: 32px;
    height: 32px;
  }

  .visimisi-section__card-title {
    color: var(--tentang-white);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 40px;
  }

  .visimisi-section__visi-card .visimisi-section__card-icon-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-bottom: 24px;
  }

  .visimisi-section__visi-card .visimisi-section__card-title {
    text-align: center;
  }

  .visimisi-section__visi-text {
    color: var(--tentang-muted);
    font-size: 18px;
    font-weight: 400;
    line-height: 29px;
    text-align: center;
  }

  .visimisi-section__misi-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    padding-top: 32px;
  }

  .visimisi-section__misi-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .visimisi-section__misi-number {
    flex-shrink: 0;
    padding-top: 2px;
    color: var(--tentang-gold);
    font-family: "Consolas", "Courier New", monospace;
    font-size: 14px;
    line-height: 20px;
  }

  .visimisi-section__misi-text {
    color: var(--tentang-muted);
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
  }

  @media (max-width: 1280px) {
    .visimisi-section {
      width: 100%;
      padding-right: clamp(20px, 3.75vw, 48px);
      padding-left: clamp(20px, 3.75vw, 48px);
    }
  }

  @media (max-width: 1024px) {
    .visimisi-section__heading {
      font-size: clamp(36px, 5vw, 48px);
      line-height: 1;
    }
  }

  @media (max-width: 768px) {
    .visimisi-section {
      padding: 64px 20px;
    }

    .visimisi-section__grid {
      grid-template-columns: 1fr;
      padding-top: 36px;
    }

    .visimisi-section__card {
      padding: 36px 28px;
      border-radius: 14px;
    }

    .visimisi-section__card-title {
      font-size: 31px;
      line-height: 36px;
    }

    .visimisi-section__visi-text {
      font-size: 16px;
      line-height: 26px;
    }
  }

  @media (max-width: 480px) {
    .visimisi-section {
      padding: 56px 16px;
    }

    .visimisi-section__heading {
      font-size: 32px;
      line-height: 36px;
    }

    .visimisi-section__card {
      padding: 28px 20px;
    }

    .visimisi-section__misi-text {
      font-size: 15px;
      line-height: 24px;
    }
  }
`;

const VisimisiSection = () => {
  return (
    <>
      <style data-component="tentang-visimisi-section">{visimisiSectionStyles}</style>

      <section id="visi-misi" className="visimisi-section" aria-labelledby="visimisi-title">
        <div className="visimisi-section__header">
          <p className="visimisi-section__eyebrow">Arah &amp; Tujuan</p>

          <h2 className="visimisi-section__heading" id="visimisi-title">
            Visi &amp; Misi
          </h2>
        </div>

        <div className="visimisi-section__grid">
          <div className="visimisi-section__card visimisi-section__visi-card">
            <div className="visimisi-section__card-icon-wrap">
              <svg
                className="visimisi-section__card-icon"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="24"
                  height="24"
                  rx="4"
                  stroke="#C5A880"
                  strokeWidth="2"
                />
                <circle cx="16" cy="16" r="5" stroke="#C5A880" strokeWidth="2" />
              </svg>
            </div>

            <h3 className="visimisi-section__card-title">Visi</h3>

            <p className="visimisi-section__visi-text">{visiText}</p>
          </div>

          <div className="visimisi-section__card">
            <h3 className="visimisi-section__card-title">Misi</h3>

            <div className="visimisi-section__misi-list">
              {misiItems.map((item, index) => (
                <div className="visimisi-section__misi-item" key={item}>
                  <span className="visimisi-section__misi-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="visimisi-section__misi-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VisimisiSection;
