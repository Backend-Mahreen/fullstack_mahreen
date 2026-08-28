const timelineStyles = `
  .po-timeline {
    width: 100%;
    background: #131313;
    padding: 120px 48px;
    display: flex;
    justify-content: center;
  }

  .po-timeline__container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    gap: 80px;
  }

  .po-timeline__left {
    flex: 0 0 352px;
  }

  .po-timeline__title {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: clamp(32px, 4vw, 40px);
    line-height: 1.2;
    color: #E5E2E1;
    margin: 0 0 12px 0;
    letter-spacing: -0.4px;
  }

  .po-timeline__subtitle {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color: #D0C5B5;
    margin: 0;
  }

  .po-timeline__right {
    flex: 1;
    position: relative;
  }

  .po-timeline__line {
    position: absolute;
    left: 8px; /* Center of the 16px dot */
    top: 12px; 
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, #C8A96A 0%, #1A1A1A 100%);
    transform: translateX(-50%);
    z-index: 1;
  }

  .po-timeline__item {
    position: relative;
    padding-left: 48px;
    padding-bottom: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .po-timeline__item:last-child {
    padding-bottom: 0;
  }

  .po-timeline__dot {
    position: absolute;
    left: 0;
    top: 10px; /* Align vertically with the step number */
    width: 16px;
    height: 16px;
    background: #C8A96A;
    border: 4px solid #131313;
    border-radius: 50%;
    box-shadow: 0px 0px 30px rgba(200, 169, 106, 0.1);
    box-sizing: border-box;
    z-index: 2;
  }

  .po-timeline__step-num {
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: clamp(24px, 3vw, 28px);
    line-height: 1.29;
    color: rgba(200, 169, 106, 0.4);
    margin: 0;
  }

  .po-timeline__step-title {
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: clamp(24px, 3vw, 28px);
    line-height: 1.29;
    color: #E5E2E1;
    margin: 0;
  }

  .po-timeline__step-desc {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color: #D0C5B5;
    margin: 0;
    max-width: 688px;
  }

  @media (max-width: 992px) {
    .po-timeline__container {
      flex-direction: column;
      gap: 48px;
    }
    .po-timeline__left {
      flex: none;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .po-timeline {
      padding: 80px 24px;
    }
    .po-timeline__item {
      padding-left: 32px;
      padding-bottom: 32px;
    }
    .po-timeline__line {
      left: 6px;
    }
    .po-timeline__dot {
      width: 12px;
      height: 12px;
      border-width: 3px;
      top: 12px;
    }
  }
`;

const steps = [
  {
    num: "01",
    title: "Assessment & Pemetaan",
    desc: "Identifikasi potensi lokal dan analisis kebutuhan spesifik komunitas."
  },
  {
    num: "02",
    title: "Workshop Intensif",
    desc: "Pelatihan teknis dan manajemen bisnis oleh mentor ahli internasional."
  },
  {
    num: "03",
    title: "Infrastruktur Digital",
    desc: "Pembangunan pusat komando digital komunitas untuk manajemen stok dan logistik."
  },
  {
    num: "04",
    title: "Peluncuran Pasar Global",
    desc: "Eksposisi karya di galeri internasional Mahreen di Jakarta, London, dan Tokyo."
  },
  {
    num: "05",
    title: "Monitoring & Kemandirian",
    desc: "Transisi pengelolaan penuh kepada pengurus kolektif lokal yang telah terlatih."
  }
];

const Timeline = () => {
  return (
    <section className="po-timeline">
      <style>{timelineStyles}</style>
      <div className="po-timeline__container">
        
        {/* Left Side: Title & Description */}
        <div className="po-timeline__left">
          <h2 className="po-timeline__title">Timeline</h2>
          <p className="po-timeline__subtitle">
            Perjalanan transformatif komunitas dalam 24 bulan ke depan.
          </p>
        </div>

        {/* Right Side: Timeline Steps */}
        <div className="po-timeline__right">
          <div className="po-timeline__line"></div>
          
          {steps.map((step, index) => (
            <div className="po-timeline__item" key={index}>
              <div className="po-timeline__dot"></div>
              <h3 className="po-timeline__step-num">{step.num}</h3>
              <h4 className="po-timeline__step-title">{step.title}</h4>
              <p className="po-timeline__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Timeline;
