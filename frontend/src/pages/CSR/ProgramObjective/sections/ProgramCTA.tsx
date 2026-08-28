const programCTAStyles = `
  .po-program-cta {
    width: 100%;
    background: #000000;
    color: #e5e2e1;
    display: flex;
    justify-content: center;
    padding: 42px 48px 76px;
  }

  .po-program-cta *,
  .po-program-cta *::before,
  .po-program-cta *::after {
    box-sizing: border-box;
  }

  .po-program-cta__container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .po-program-cta__title {
    margin: 0;
    color: #e5e2e1;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(34px, 4.1vw, 50px);
    font-weight: 600;
    line-height: 1.16;
    letter-spacing: -0.5px;
    text-wrap: balance;
  }

  .po-program-cta__actions {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 14px;
    margin-top: 58px;
  }

  .po-program-cta__button {
    min-height: 52px;
    padding: 16px 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 0;
    font-family: 'Manrope', Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 0.7px;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease,
      box-shadow 180ms ease;
  }

  .po-program-cta__button--primary {
    min-width: 264px;
    background: #e5c483;
    border-color: #e5c483;
    color: #3e3217;
  }

  .po-program-cta__button--secondary {
    min-width: 198px;
    background: transparent;
    border-color: #75694f;
    color: #d9d6d1;
  }

  @media (hover: hover) and (pointer: fine) {
    .po-program-cta__button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    }

    .po-program-cta__button--primary:hover {
      background: #f0d292;
      border-color: #f0d292;
    }

    .po-program-cta__button--secondary:hover {
      background: rgba(229, 196, 131, 0.08);
      border-color: #e5c483;
      color: #ffffff;
    }
  }

  .po-program-cta__button:focus-visible {
    outline: 2px solid #e5c483;
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    .po-program-cta {
      padding: 36px 24px 64px;
    }

    .po-program-cta__title {
      font-size: clamp(30px, 8.5vw, 40px);
    }

    .po-program-cta__actions {
      width: min(100%, 430px);
      flex-direction: column;
      gap: 14px;
      margin-top: 40px;
    }

    .po-program-cta__button,
    .po-program-cta__button--primary,
    .po-program-cta__button--secondary {
      width: 100%;
      min-width: 0;
    }
  }

  @media (max-width: 420px) {
    .po-program-cta {
      padding: 30px 18px 54px;
    }

    .po-program-cta__title {
      font-size: 29px;
      line-height: 1.2;
    }

    .po-program-cta__actions {
      margin-top: 34px;
    }

    .po-program-cta__button {
      min-height: 50px;
      padding: 15px 22px;
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .po-program-cta__button {
      transition: none;
    }
  }
`;

const ProgramCTA = () => {
  return (
    <section
      className="po-program-cta"
      aria-labelledby="po-program-cta-title"
    >
      <style data-component="po-program-cta">{programCTAStyles}</style>

      <div className="po-program-cta__container">
        <h2 className="po-program-cta__title" id="po-program-cta-title">
          Siap Menciptakan Dampak Nyata Bersama?
        </h2>

        <div className="po-program-cta__actions">
          <a
            className="po-program-cta__button po-program-cta__button--primary"
            href="/mahreen-csr/pendaftaran"
          >
            Gabung Program Sekarang
          </a>
          <a
            className="po-program-cta__button po-program-cta__button--secondary"
            href="/contact?pillar=csr"
          >
            Hubungi Tim Kami
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProgramCTA;
