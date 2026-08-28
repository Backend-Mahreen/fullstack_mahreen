const legalStatusStyles = `
  .legal-section {
    width: min(100%, 1272px);
    margin: 0 auto;
    padding: 96px 48px;
    border-bottom: 1px solid var(--tentang-border);
  }

  .legal-section__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    width: 100%;
    align-items: start;
  }

  /* Left column */
  .legal-section__left {
    width: 100%;
    max-width: 556px;
    padding-top: 163px;
  }

  .legal-section__eyebrow {
    color: #8c8c8c;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .legal-section__heading {
    padding-top: 16px;
    color: var(--tentang-white);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 48px;
    font-weight: 400;
    line-height: 60px;
  }

  .legal-section__description {
    width: min(100%, 512px);
    padding-top: 24px;
    color: #8c8c8c;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 29px;
  }

  .legal-section__badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding-top: 40px;
  }

  .legal-section__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 24px;
    border: 1px solid var(--tentang-border);
    border-radius: 9999px;
  }

  .legal-section__badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: var(--tentang-gold);
  }

  .legal-section__badge-text {
    color: var(--tentang-white);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* Right column - card */
  .legal-section__card {
    padding: 48px;
    background: var(--tentang-panel);
    border: 1px solid var(--tentang-border);
    border-radius: 24px;
  }

  .legal-section__card-group {
    display: flex;
    flex-direction: column;
  }

  .legal-section__card-group + .legal-section__card-group {
    padding-top: 32px;
    margin-top: 32px;
    border-top: 1px solid var(--tentang-border);
  }

  .legal-section__card-label {
    color: #8c8c8c;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .legal-section__card-value--large {
    padding-top: 8px;
    color: var(--tentang-white);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 30px;
    font-weight: 400;
    line-height: 36px;
  }

  .legal-section__card-value--medium {
    padding-top: 4px;
    color: var(--tentang-white);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }

  .legal-section__haki-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding-top: 20px;
  }

  .legal-section__haki-col-label {
    color: rgba(140, 140, 140, 0.6);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.45px;
    text-transform: uppercase;
  }

  .legal-section__haki-col-value {
    padding-top: 4px;
    color: var(--tentang-white);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }

  .legal-section__card-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 32px;
  }

  .legal-section__card-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px 24px;
    border: 1px solid var(--tentang-border);
    border-radius: 12px;
    background: transparent;
    color: var(--tentang-white);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .legal-section__card-btn:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 1280px) {
    .legal-section {
      width: 100%;
      padding-right: clamp(20px, 3.75vw, 48px);
      padding-left: clamp(20px, 3.75vw, 48px);
    }
  }

  @media (max-width: 1024px) {
    .legal-section__heading {
      font-size: clamp(36px, 5vw, 48px);
      line-height: 1.15;
    }
  }

  @media (max-width: 768px) {
    .legal-section {
      padding: 64px 20px;
    }

    .legal-section__container {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .legal-section__left {
      padding-top: 0;
      max-width: none;
    }

    .legal-section__heading {
      font-size: 36px;
      line-height: 46px;
    }

    .legal-section__description {
      font-size: 16px;
      line-height: 26px;
    }

    .legal-section__card {
      padding: 36px 28px;
      border-radius: 20px;
    }

    .legal-section__haki-grid {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }

  @media (max-width: 480px) {
    .legal-section {
      padding: 56px 16px;
    }

    .legal-section__heading {
      font-size: 30px;
      line-height: 38px;
    }

    .legal-section__badges {
      gap: 10px;
    }

    .legal-section__card {
      padding: 28px 20px;
    }

    .legal-section__card-value--large {
      font-size: 26px;
      line-height: 32px;
    }

    .legal-section__haki-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
`;

const LegalStatus = () => {
  return (
    <>
      <style data-component="tentang-legal-section">{legalStatusStyles}</style>

      <section id="legalitas" className="legal-section" aria-labelledby="legal-title">
        <div className="legal-section__container">
          <div className="legal-section__left">
            <p className="legal-section__eyebrow">Legal Status</p>

            <h2 className="legal-section__heading" id="legal-title">
              Trusted &amp; Verified
            </h2>

            <p className="legal-section__description">
              Kami berkomitmen untuk memberikan layanan yang legal, transparan,
              dan terpercaya. Mahreen Indonesia adalah brand resmi yang terdaftar
              secara hukum.
            </p>

            <div className="legal-section__badges">
              <span className="legal-section__badge">
                <span className="legal-section__badge-dot" aria-hidden="true" />
                <span className="legal-section__badge-text">Registered</span>
              </span>

              <span className="legal-section__badge">
                <span className="legal-section__badge-dot" aria-hidden="true" />
                <span className="legal-section__badge-text">Verified</span>
              </span>
            </div>
          </div>

          <div className="legal-section__card">
            <div className="legal-section__card-group">
              <p className="legal-section__card-label">
                NIB (Nomor Induk Berusaha)
              </p>
              <p className="legal-section__card-value--large">1203260152054</p>
            </div>

            <div className="legal-section__card-group">
              <p className="legal-section__card-label">
                HAKI (Hak Kekayaan Intelektual)
              </p>

              <div className="legal-section__haki-grid">
                <div>
                  <p className="legal-section__haki-col-label">
                    Nomor Pencatatan
                  </p>
                  <p className="legal-section__haki-col-value">001180040</p>
                </div>

                <div>
                  <p className="legal-section__haki-col-label">
                    Nomor Permohonan
                  </p>
                  <p className="legal-section__haki-col-value">
                    EC002026042583
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section__card-group">
              <p className="legal-section__card-label">
                Keputusan Menteri Hukum RI
              </p>
              <p className="legal-section__card-value--medium">
                AHU-A089408.AH.01.30.Tahun 2026
              </p>
            </div>

            <div className="legal-section__card-group">
              <p className="legal-section__card-label">Founder</p>
              <p className="legal-section__card-value--medium">
                Mohamad Dzikri Arfiansyah, S.T.
              </p>
            </div>

            <div className="legal-section__card-buttons">
              <a
                className="legal-section__card-btn"
                href="/syarat-ketentuan?section=kekayaan-intelektual"
                aria-label="Lihat Dokumen HAKI"
              >
                Lihat Dokumen HAKI &rarr;
              </a>

              <a
                className="legal-section__card-btn"
                href="/tentang?section=legalitas"
                aria-label="Lihat Keputusan Menteri Hukum"
              >
                Lihat Keputusan Menteri Hukum &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalStatus;
