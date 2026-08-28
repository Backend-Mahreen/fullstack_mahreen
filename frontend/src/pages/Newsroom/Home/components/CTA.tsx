import futureBuildImage from "../../../../assets/CTA/Future-Build.webp";

const styles = `
  .newsroom-final-cta {
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    isolation: isolate;
    overflow-x: clip;
    overflow-y: hidden;
    background: #050505;
  }

  .newsroom-final-cta,
  .newsroom-final-cta *,
  .newsroom-final-cta *::before,
  .newsroom-final-cta *::after {
    box-sizing: border-box;
  }

  .newsroom-final-cta__background {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .newsroom-final-cta__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: scale(1.01);
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .newsroom-final-cta:hover .newsroom-final-cta__image {
    transform: scale(1.045);
  }

  .newsroom-final-cta__overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.68)),
      linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 48%, rgba(0, 0, 0, 0.18));
  }

  .newsroom-final-cta__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 44px;
    width: 100%;
    max-width: 1120px;
    min-width: 0;
    min-height: 560px;
    margin-inline: auto;
    padding: 110px clamp(24px, 5vw, 72px);
    text-align: center;
  }

  .newsroom-final-cta__eyebrow {
    margin: 0 0 -22px;
    color: #e5c477;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 3.2px;
    text-transform: uppercase;
  }

  .newsroom-final-cta__heading {
    width: 100%;
    max-width: 820px;
    min-width: 0;
    margin: 0;
    color: #fff;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(40px, 5.2vw, 76px);
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.035em;
    overflow-wrap: break-word;
    text-wrap: balance;
  }

  .newsroom-final-cta__description {
    max-width: 680px;
    margin: -18px 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 15px;
    line-height: 1.85;
  }

  .newsroom-final-cta__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .newsroom-final-cta__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 210px;
    min-height: 58px;
    padding: 16px 32px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 1.45px;
    text-transform: uppercase;
    transition:
      transform 220ms ease,
      color 220ms ease,
      background 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .newsroom-final-cta__button:hover,
  .newsroom-final-cta__button:focus-visible {
    transform: translateY(-3px);
  }

  .newsroom-final-cta__button:focus-visible {
    outline: 2px solid #f0d58f;
    outline-offset: 4px;
  }

  .newsroom-final-cta__button--primary {
    color: #090806;
    background: #e5c477;
    box-shadow: 0 14px 34px rgba(229, 196, 119, 0.18);
  }

  .newsroom-final-cta__button--primary:hover,
  .newsroom-final-cta__button--primary:focus-visible {
    background: #f0d58f;
    box-shadow: 0 18px 42px rgba(229, 196, 119, 0.28);
  }

  .newsroom-final-cta__button--secondary {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.32);
    background: rgba(10, 10, 10, 0.28);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .newsroom-final-cta__button--secondary:hover,
  .newsroom-final-cta__button--secondary:focus-visible {
    border-color: #e5c477;
    color: #e5c477;
    background: rgba(10, 10, 10, 0.52);
  }

  @media (max-width: 900px) {
    .newsroom-final-cta__inner {
      min-height: 500px;
      padding-block: 90px;
    }
  }

  @media (max-width: 640px) {
    .newsroom-final-cta__inner {
      min-height: 470px;
      gap: 34px;
      padding: 76px 20px;
    }

    .newsroom-final-cta__eyebrow {
      margin-bottom: -16px;
      font-size: 9px;
      letter-spacing: 2.4px;
    }

    .newsroom-final-cta__heading {
      font-size: clamp(34px, 11vw, 48px);
    }

    .newsroom-final-cta__description {
      margin-top: -12px;
      font-size: 14px;
      line-height: 1.7;
    }

    .newsroom-final-cta__actions {
      width: 100%;
      flex-direction: column;
    }

    .newsroom-final-cta__button {
      width: min(100%, 340px);
      min-width: 0;
      max-width: 100%;
    }

    .newsroom-final-cta__button--secondary {
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      background: rgba(10, 10, 10, 0.72);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-final-cta__image,
    .newsroom-final-cta__button {
      transition: none;
    }

    .newsroom-final-cta:hover .newsroom-final-cta__image,
    .newsroom-final-cta__button:hover,
    .newsroom-final-cta__button:focus-visible {
      transform: none;
    }
  }
`;

const CTA = () => {
  return (
    <>
      <style>{styles}</style>

      <section
        className="newsroom-final-cta"
        aria-labelledby="newsroom-final-cta-title"
      >
        <div className="newsroom-final-cta__background" aria-hidden="true">
          <img
            className="newsroom-final-cta__image"
            src={futureBuildImage}
            alt=""
            loading="lazy"
            decoding="async"
            width="1440"
            height="705"
          />
          <div className="newsroom-final-cta__overlay" />
        </div>

        <div className="newsroom-final-cta__inner">
          <p className="newsroom-final-cta__eyebrow">Mahreen Indonesia</p>

          <h2
            className="newsroom-final-cta__heading"
            id="newsroom-final-cta-title"
          >
            Mari Bangun Sesuatu Bermakna Bersama
          </h2>

          <p className="newsroom-final-cta__description">
            Ubah gagasan menjadi kolaborasi yang kreatif, profesional, dan
            memberikan dampak nyata bersama ekosistem Mahreen Indonesia.
          </p>

          <div className="newsroom-final-cta__actions">
            <a
              className="newsroom-final-cta__button newsroom-final-cta__button--primary"
              href="/tanya-mahreen"
            >
              Mulai Kolaborasi
            </a>

            <a
              className="newsroom-final-cta__button newsroom-final-cta__button--secondary"
              href="/contact"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
