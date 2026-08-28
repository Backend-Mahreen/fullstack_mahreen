import aboutBackground from "../../../assets/CSR/02-tentang.svg";
import treeIllustration from "../../../assets/CSR/pohon.svg";
import pemberdayaanKomunalIcon from "../../../assets/CSR/icon-pemberdayaan-komunal.svg";
import sustainabilityIcon from "../../../assets/CSR/icon-sustainability.svg";

const aboutStyles = `

  .csr-about {
    width: 100%;
    background: #050505;
    color: #e5e2e1;
    border-top: 1px solid rgba(229, 196, 131, 0.1);
    border-bottom: 1px solid rgba(229, 196, 131, 0.1);
  }

  .csr-about__outer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 72px 40px 48px;
    box-sizing: border-box;
  }

  .csr-about__container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 64px;
    max-width: 1200px;
    width: 100%;
    min-height: 650px;
    margin: 0 auto;
  }

  .csr-about__visual,
  .csr-about__content {
    flex: 1 1 0;
    min-width: 0;
  }

  .csr-about__visual {
    position: relative;
    width: 100%;
    max-width: 520px;
    height: 650px;
    border-radius: 8px;
    overflow: visible;
    background: rgba(255, 255, 255, 0.002);
    box-shadow: 0 0 30px rgba(200, 169, 106, 0.15);
    isolation: isolate;
  }

  .csr-about__background,
  .csr-about__tree {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .csr-about__background {
    z-index: 0;
  }

  .csr-about__tree {
    z-index: 1;
    object-fit: contain;
    object-position: center center;
    padding: 56px 34px 40px;
    box-sizing: border-box;
    filter: drop-shadow(0 0 18px rgba(232, 196, 123, 0.25));
  }

  .csr-about__card {
    position: absolute;
    right: -32px;
    bottom: -32px;
    z-index: 2;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 320px;
    max-width: 320px;
    min-height: 170px;
    padding: 32px 32px 32px 32px;
    background: rgba(17, 17, 17, 0.7);
    border: 1px solid rgba(200, 169, 106, 0.1);
    backdrop-filter: blur(6px);
    border-radius: 8px;
  }

  .csr-about__card-label {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #E5C483;
  }

  .csr-about__card-text {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #E5E2E1;
  }

  .csr-about__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 23px;
    max-width: 520px;
  }

  .csr-about__title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 48px;
    letter-spacing: -0.4px;
    color: #E5C483;
  }

  .csr-about__description {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 29px;
    color: #D0C5B5;
  }

  .csr-about__points {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    padding-top: 9px;
  }

  .csr-about__point {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
  }

  .csr-about__point-icon {
    flex: 0 0 auto;
    width: 22px;
    height: 22px;
    margin-top: 2px;
    color: #E5C483;
    display: block;
    object-fit: contain;
  }

  .csr-about__point-icon--leaf {
    width: 18px;
    height: 18px;
    margin-top: 3px;
  }

  .csr-about__point-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
    min-width: 0;
  }

  .csr-about__point-title {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #E5E2E1;
  }

  .csr-about__point-text {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #D0C5B5;
  }

  @media (max-width: 1024px) {
    .csr-about__outer {
      padding: 64px 24px 40px;
    }

    .csr-about__container {
      gap: 40px;
      align-items: flex-start;
    }

    .csr-about__title {
      font-size: 34px;
      line-height: 42px;
    }
  }

  @media (max-width: 768px) {
    .csr-about__outer {
      padding: 80px 18px 40px;
    }

    .csr-about__container {
      flex-direction: column;
      gap: 40px;
      min-height: auto;
      align-items: stretch;
    }

    .csr-about__visual {
      width: 100%;
      max-width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 8px;
    }

    .csr-about__tree {
      position: relative;
      inset: auto;
      width: 100%;
      height: min(540px, 120vw);
      padding: 44px 18px 28px;
    }

    .csr-about__card {
      position: relative;
      left: auto;
      right: auto;
      bottom: auto;
      width: auto;
      max-width: none;
      margin: 0 16px 0;
      align-self: stretch;
    }

    .csr-about__content {
      max-width: 100%;
      gap: 18px;
      padding-top: 32px;
    }

    .csr-about__title {
      font-size: 30px;
      line-height: 36px;
    }

    .csr-about__description,
    .csr-about__point-title,
    .csr-about__point-text,
    .csr-about__card-text,
    .csr-about__card-label {
      font-size: 15px;
      line-height: 24px;
    }
  }

  @media (max-width: 420px) {
    .csr-about__visual {
      gap: 16px;
      margin-bottom: 4px;
    }

    .csr-about__tree {
      height: 480px;
    }

    .csr-about__card {
      padding: 24px;
      margin: 0 8px 0;
    }

    .csr-about__points {
      gap: 18px;
    }
  }
`;

const AboutSection = () => {
  return (
    <section className="csr-about" aria-labelledby="csr-about-title">
      <style data-component="csr-about">{aboutStyles}</style>

      <div className="csr-about__outer">
        <div className="csr-about__container">
          <div className="csr-about__visual" aria-hidden="true">
            <img width="520" height="650" decoding="async" loading="lazy"
              className="csr-about__background"
              src={aboutBackground}
              alt=""
            />
            <img width="520" height="650" decoding="async" loading="lazy" className="csr-about__tree" src={treeIllustration} alt="" />

            <div className="csr-about__card">
              <p className="csr-about__card-label">MISI KAMI</p>
              <p className="csr-about__card-text">
                Mentransformasi filantropi menjadi investasi sosial yang terukur
                dan bermartabat.
              </p>
            </div>
          </div>

          <div className="csr-about__content">
            <h2 className="csr-about__title" id="csr-about-title">
              Tentang Mahreen CSR
            </h2>

            <p className="csr-about__description">
              Lebih dari sekadar program bantuan, Mahreen CSR adalah hub
              kolaboratif yang menjembatani visi korporasi dengan kebutuhan riil
              masyarakat. Kami mengintegrasikan profesionalisme bisnis dengan
              kepekaan sosial untuk menciptakan solusi jangka panjang.
            </p>

            <div className="csr-about__points">
              <article className="csr-about__point">
                <img width="22" height="16" decoding="async" loading="lazy"
                  className="csr-about__point-icon"
                  src={pemberdayaanKomunalIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div className="csr-about__point-body">
                  <h3 className="csr-about__point-title">
                    Pemberdayaan Komunal
                  </h3>
                  <p className="csr-about__point-text">
                    Membangun kemandirian masyarakat melalui edukasi dan akses
                    sumber daya.
                  </p>
                </div>
              </article>

              <article className="csr-about__point">
                <img width="17" height="17" decoding="async" loading="lazy"
                  className="csr-about__point-icon csr-about__point-icon--leaf"
                  src={sustainabilityIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div className="csr-about__point-body">
                  <h3 className="csr-about__point-title">
                    Sustainability Framework
                  </h3>
                  <p className="csr-about__point-text">
                    Menjamin setiap program memiliki jejak ekologis yang positif
                    dan regeneratif.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
