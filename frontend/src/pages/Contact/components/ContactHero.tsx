const contactHeroStyles = `
  .contact-hero {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 370px;
    padding: calc(var(--navbar-height, 74px) + 42px) 24px 58px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 15%, rgba(202, 164, 109, 0.07), transparent 38%),
      #070707;
    color: #ffffff;
    text-align: center;
  }

  .contact-hero,
  .contact-hero * {
    box-sizing: border-box;
  }

  .contact-hero__inner {
    width: min(100%, 1180px);
    margin: 0 auto;
  }

  .contact-hero__eyebrow {
    margin: 0 0 22px;
    color: #9f835a;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 1.7px;
    text-transform: uppercase;
  }

  .contact-hero__title {
    margin: 0;
    color: #f7f4ef;
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(58px, 6.2vw, 96px);
    font-weight: 500;
    line-height: 0.84;
    letter-spacing: -0.045em;
  }

  .contact-hero__title-line {
    display: block;
  }

  .contact-hero__title-line--accent {
    margin-top: 18px;
    color: #c9a978;
    font-style: italic;
    font-weight: 400;
  }

  .contact-hero__description {
    max-width: 900px;
    margin: 34px auto 0;
    color: #8f8f94;
    font-family: Inter, Arial, sans-serif;
    font-size: clamp(15px, 1.15vw, 20px);
    font-weight: 400;
    line-height: 1.65;
  }

  @media (max-width: 760px) {
    .contact-hero {
      min-height: 420px;
      padding: calc(var(--navbar-height, 72px) + 46px) 20px 58px;
    }

    .contact-hero__eyebrow {
      margin-bottom: 18px;
      font-size: 14px;
    }

    .contact-hero__title {
      font-size: clamp(46px, 14vw, 68px);
      line-height: 0.9;
    }

    .contact-hero__title-line--accent {
      margin-top: 14px;
    }

    .contact-hero__description {
      margin-top: 28px;
      font-size: 14px;
    }
  }

  @media (max-width: 420px) {
    .contact-hero {
      min-height: 390px;
      padding-inline: 16px;
    }

    .contact-hero__title {
      font-size: clamp(40px, 13vw, 54px);
    }
  }
`;

const ContactHero = () => (
  <>
    <style data-component="contact-hero">{contactHeroStyles}</style>
    <section className="contact-hero" aria-labelledby="contact-page-title">
      <div className="contact-hero__inner">
        <p className="contact-hero__eyebrow">Hubungi Kami</p>
        <h1 className="contact-hero__title" id="contact-page-title">
          <span className="contact-hero__title-line">Mari Berkolaborasi</span>
          <span className="contact-hero__title-line contact-hero__title-line--accent">
            &amp; Berkarya Bersama
          </span>
        </h1>
        <p className="contact-hero__description">
          Punya rencana proyek inovatif, ide pengembangan bisnis, program CSR, atau inisiatif sosial?
          <br />
          Tim profesional kami siap membantu mewujudkan visi Anda.
        </p>
      </div>
    </section>
  </>
);

export default ContactHero;
