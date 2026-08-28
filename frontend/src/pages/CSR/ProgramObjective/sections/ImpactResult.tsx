const impactStyles = `
  .po-impact {
    width: 100%;
    background: #0E0E0E;
    padding: 80px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .po-impact__container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .po-impact__title {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: clamp(32px, 4vw, 40px);
    line-height: 1.2;
    text-align: center;
    letter-spacing: -0.4px;
    color: #E5E2E1;
    margin: 0;
  }

  .po-impact__cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .po-impact__card {
    background: rgba(17, 17, 17, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
  }

  .po-impact__subtitle {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.33;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #D0C5B5;
    margin: 0 0 24px 0;
  }

  .po-impact__progress-track {
    width: 100%;
    height: 8px;
    background: #353534;
    position: relative;
    margin-bottom: 24px;
  }

  .po-impact__progress-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #C8A96A;
    box-shadow: 0px 0px 30px rgba(200, 169, 106, 0.1);
  }

  .po-impact__main-text {
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: 28px;
    line-height: 1.29;
    color: #E5C483;
    margin: 0 0 8px 0;
  }

  .po-impact__desc {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.43;
    color: #D0C5B5;
    margin: 0;
  }

  @media (max-width: 992px) {
    .po-impact__cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .po-impact {
      padding: 60px 24px;
    }
    .po-impact__cards {
      grid-template-columns: 1fr;
    }
  }
`;

const cards = [
  {
    subtitle: "PENDIDIKAN FINANSIAL",
    progress: 92,
    mainText: "92%",
    desc: "Tingkat Literasi Finansial"
  },
  {
    subtitle: "PENYERAPAN TENAGA KERJA",
    progress: 78,
    mainText: "780+",
    desc: "Lapangan Kerja Baru"
  },
  {
    subtitle: "PENCAPAIAN SDG 11",
    progress: 85,
    mainText: "Sustainable",
    desc: "Community Standards"
  }
];

const ImpactResult = () => {
  return (
    <section className="po-impact">
      <style>{impactStyles}</style>
      <div className="po-impact__container">
        <h2 className="po-impact__title">Impact Results</h2>
        
        <div className="po-impact__cards">
          {cards.map((card, index) => (
            <div className="po-impact__card" key={index}>
              <h3 className="po-impact__subtitle">{card.subtitle}</h3>
              
              <div className="po-impact__progress-track">
                <div 
                  className="po-impact__progress-fill" 
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
              
              <h4 className="po-impact__main-text">{card.mainText}</h4>
              <p className="po-impact__desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactResult;
