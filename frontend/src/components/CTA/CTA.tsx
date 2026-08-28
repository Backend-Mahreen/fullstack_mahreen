import futureBuildImage from "../../assets/CTA/Future-Build.webp";

const ctaStyles = `

  .section-final-cta {
    position: relative;
    width: 100%;
    isolation: isolate;
    overflow: hidden;
  }

  .section-final-cta,
  .section-final-cta *,
  .section-final-cta *::before,
  .section-final-cta *::after {
    box-sizing: border-box;
  }

  .section-final-cta__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .section-final-cta__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .section-final-cta__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.44);
  }

  .section-final-cta__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
    width: 100%;
    max-width: 1060px;
    margin: 0 auto;
    padding: 140px 20px;
    text-align: center;
  }

  .section-final-cta__heading {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-weight: 400;
    font-size: clamp(32px, 5vw, 72px);
    line-height: 1.15;
    max-width: 720px;
  }

  .section-final-cta__actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 24px;
    width: 100%;
  }

  .section-final-cta__button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 48px;
    min-width: 220px;
    border-radius: 9999px;
    font-family: "Poppins", Arial, sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.55;
    cursor: pointer;
    text-decoration: none;
    transition: transform 200ms ease, filter 200ms ease, background-color 200ms ease, border-color 200ms ease;
  }

  .section-final-cta__button:hover,
  .section-final-cta__button:focus-visible {
    transform: translateY(-2px);
  }

  .section-final-cta__button--primary {
    background: #e5c483;
    color: #050505;
    border: none;
  }

  .section-final-cta__button--primary:hover,
  .section-final-cta__button--primary:focus-visible {
    filter: brightness(1.08);
  }

  .section-final-cta__button--secondary {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .section-final-cta__button--secondary:hover,
  .section-final-cta__button--secondary:focus-visible {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .section-final-cta__button:focus-visible {
    outline: 2px solid #e5c483;
    outline-offset: 3px;
  }

  @media (max-width: 1024px) {
    .section-final-cta__inner {
      padding: 110px 24px;
      gap: 40px;
    }
  }

  @media (max-width: 640px) {
    .section-final-cta__inner {
      padding: 80px 20px;
      gap: 32px;
    }

    .section-final-cta__heading {
      font-size: clamp(28px, 8vw, 40px);
    }

    .section-final-cta__actions {
      flex-direction: column;
      gap: 16px;
    }

    .section-final-cta__button {
      width: 100%;
    }
  }
`;

const CTA = () => {
  return (
    <>
      <style data-component="cta">{ctaStyles}</style>

      <section className="section-final-cta" aria-labelledby="final-cta-heading">
        <div className="section-final-cta__bg" aria-hidden="true">
          <img
            className="section-final-cta__image"
            src={futureBuildImage}
            alt=""
            loading="lazy"
            decoding="async"
            width="1440"
            height="705"
          />
          <div className="section-final-cta__overlay" />
        </div>

        <div className="section-final-cta__inner">
          <h2 className="section-final-cta__heading" id="final-cta-heading">
            Mari Bangun Sesuatu
            <br />
            Bermakna Bersama
          </h2>

          <div className="section-final-cta__actions">
            <a
              className="section-final-cta__button section-final-cta__button--primary"
              href="/contact?pillar=business"
              aria-label="Mulai kolaborasi dengan Mahreen Indonesia"
            >
              MULAI KOLABORASI
            </a>
            <a
              className="section-final-cta__button section-final-cta__button--secondary"
              href="/contact"
              aria-label="Lihat informasi kontak Mahreen Indonesia"
            >
              HUBUNGI KAMI
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
