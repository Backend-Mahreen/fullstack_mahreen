const closingSectionStyles = `
  .closing-section {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
  }

  .closing-section *,
  .closing-section *::before,
  .closing-section *::after {
    box-sizing: border-box;
  }

  .closing-section__inner {
    width: min(100%, 1320px);
    min-width: 0;
    margin-inline: auto;
    padding: clamp(68px, 6vw, 100px) clamp(28px, 4.4vw, 74px)
      clamp(76px, 7vw, 112px);
  }

  .closing-section__content {
    width: min(100%, 1240px);
    min-width: 0;
    margin-inline: auto;
    text-align: center;
  }

  .closing-section__title {
    width: 100%;
    margin: 0 auto;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(40px, 3.15vw, 54px);
    font-style: italic;
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.035em;
    text-align: center;
  }

  .closing-section__description {
    width: min(100%, 900px);
    margin: 32px auto 0;
    color: #a1a1aa;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: clamp(14px, 1vw, 16px);
    font-weight: 300;
    line-height: 1.75;
    text-align: center;
    text-wrap: balance;
  }

  .closing-section__description p {
    margin: 0;
  }

  .closing-section__tagline {
    width: min(100%, 820px);
    margin: clamp(48px, 5vw, 68px) auto 0;
    color: #c5a880;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: clamp(10px, 0.8vw, 12px);
    font-weight: 800;
    line-height: 1.55;
    letter-spacing: 1.35px;
    text-align: center;
    text-transform: uppercase;
    text-wrap: balance;
  }


  @media (min-width: 1360px) {
    .closing-section__title {
      font-size: clamp(34px, 2.65vw, 52px);
      white-space: nowrap;
    }
  }

  @media (max-width: 1200px) {
    .closing-section__title {
      max-width: 900px;
      font-size: clamp(38px, 4.8vw, 56px);
      text-wrap: balance;
    }
  }

  @media (max-width: 1024px) {
    .closing-section__inner {
      padding-inline: 28px;
    }
  }

  @media (max-width: 640px) {
    .closing-section__inner {
      padding: 56px 20px 68px;
    }

    .closing-section__title {
      font-size: clamp(31px, 10vw, 44px);
      line-height: 1.08;
    }

    .closing-section__description {
      margin-top: 24px;
      font-size: 14px;
      line-height: 1.68;
    }

    .closing-section__tagline {
      margin-top: 42px;
      font-size: 10px;
      letter-spacing: 1px;
    }
  }
`;

const ClosingSection = () => {
  return (
    <>
      <style data-component="closing-section">{closingSectionStyles}</style>

      <section
        className="closing-section"
        aria-labelledby="closing-section-title"
      >
        <div className="closing-section__inner">
          <div className="closing-section__content">
            <h2 className="closing-section__title" id="closing-section-title">
              Let&apos;s Build Something Meaningful Together
            </h2>

            <div className="closing-section__description">
              <p>
                Bersama Mahreen Indonesia, wujudkan ide, karya, dan bisnis
                menjadi lebih kreatif, profesional, dan berdampak. Kami siap
                menjadi partner kolaborasi untuk pengembangan digital,
                branding, serta kontribusi sosial di era modern.
              </p>
            </div>

            <p className="closing-section__tagline">
              Mari Bertumbuh dan Memberikan Manfaat Bersama Mahreen Indonesia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClosingSection;
