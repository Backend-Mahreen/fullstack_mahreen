import iconPemberdayaan from '../../../../assets/CSR/ProgramObjective/icon-pemberdayaan-collective.svg';
import iconAksesPasar from '../../../../assets/CSR/ProgramObjective/icon-akses-pasar.svg';

const overviewStyles = `
  .po-overview {
    width: 100%;
    background: #0E0E0E;
    padding: 80px 48px;
    display: flex;
    justify-content: center;
  }

  .po-overview__container {
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 24px;
  }

  .po-overview__box {
    background: #161616;
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 48px;
    display: flex;
    flex-direction: column;
  }

  .po-overview__box--left {
    justify-content: space-between;
  }

  .po-overview__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 32px);
    font-weight: 700;
    color: #E5C483;
    margin: 0 0 24px 0;
    letter-spacing: -0.5px;
  }

  .po-overview__desc {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(14px, 1.5vw, 16px);
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 48px 0;
  }

  .po-overview__features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .po-overview__feature-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .po-overview__feature-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .po-overview__feature-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #FFFFFF;
    margin: 0;
  }

  .po-overview__feature-desc {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  .po-overview__right-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .po-overview__box-small {
    padding: 40px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .po-overview__subtitle {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #E5C483;
    margin: 0 0 16px 0;
  }

  .po-overview__stat-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3vw, 28px);
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 16px 0;
    letter-spacing: -0.5px;
  }

  .po-overview__stat-desc {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .po-overview__big-stat {
    font-family: 'Playfair Display', serif;
    font-size: clamp(48px, 6vw, 64px);
    font-weight: 700;
    color: #E5C483;
    margin: 0 0 12px 0;
    display: flex;
    align-items: baseline;
    gap: 8px;
    letter-spacing: -2px;
  }

  .po-overview__big-stat span {
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    font-weight: 400;
  }

  .po-overview__subtitle-gray {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  @media (max-width: 992px) {
    .po-overview__container {
      grid-template-columns: 1fr;
    }
    .po-overview__features {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .po-overview {
      padding: 60px 24px;
    }
    .po-overview__box, .po-overview__box-small {
      padding: 32px;
    }
  }
`;

const Overview = () => {
  return (
    <section className="po-overview">
      <style>{overviewStyles}</style>
      <div className="po-overview__container">
        
        {/* Left Box */}
        <div className="po-overview__box po-overview__box--left">
          <div>
            <h2 className="po-overview__title">Program Objectives</h2>
            <p className="po-overview__desc">
              Inisiatif ini dirancang untuk menciptakan ekosistem kemandirian ekonomi yang 
              berkelanjutan di wilayah pesisir. Melalui kolaborasi antara pakar industri dan komunitas 
              lokal, kami membangun infrastruktur digital dan fisik yang memungkinkan pengrajin 
              tradisional menjangkau pasar global tanpa kehilangan identitas budaya mereka.
            </p>
          </div>
          
          <div className="po-overview__features">
            <div className="po-overview__feature">
              <div className="po-overview__feature-header">
                <img width="28" height="20" decoding="async" loading="lazy" 
                  src={iconPemberdayaan} 
                  alt="Pemberdayaan Kolektif" 
                  className="po-overview__feature-icon" 
                />
                <h3 className="po-overview__feature-title">Pemberdayaan Kolektif</h3>
              </div>
              <p className="po-overview__feature-desc">
                Menyatukan lebih dari 500 pengrajin lokal dalam satu platform manajemen terpadu.
              </p>
            </div>
            
            <div className="po-overview__feature">
              <div className="po-overview__feature-header">
                <img width="25" height="15" decoding="async" loading="lazy" 
                  src={iconAksesPasar} 
                  alt="Akses Pasar" 
                  className="po-overview__feature-icon" 
                />
                <h3 className="po-overview__feature-title">Akses Pasar</h3>
              </div>
              <p className="po-overview__feature-desc">
                Membuka jalur distribusi ke pasar internasional melalui jaringan Mahreen.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Stacked Boxes) */}
        <div className="po-overview__right-col">
          <div className="po-overview__box po-overview__box-small">
            <h4 className="po-overview__subtitle">TARGET RECIPIENTS</h4>
            <h3 className="po-overview__stat-title">1,250+ Keluarga</h3>
            <p className="po-overview__stat-desc">
              Berfokus pada komunitas pesisir Jawa Timur dengan potensi industri kreatif yang belum terjamah.
            </p>
          </div>
          
          <div className="po-overview__box po-overview__box-small">
            <h2 className="po-overview__big-stat">
              85% <span>↗</span>
            </h2>
            <h4 className="po-overview__subtitle-gray">PENINGKATAN PENDAPATAN</h4>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Overview;
