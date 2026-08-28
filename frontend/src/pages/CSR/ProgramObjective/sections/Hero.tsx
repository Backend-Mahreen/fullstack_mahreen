// Menggunakan gambar background yang sudah diupload
import heroBg from '../../../../assets/CSR/ProgramObjective/hero-bg.webp';

const heroStyles = `

  .po-hero {
    position: relative;
    width: 100%;
    min-height: 804px;
    display: flex;
    align-items: center;
    background: url("${heroBg}") center/cover no-repeat;
    
    /* Mengimbangi posisi absolute dari Navbar jika ada */
    margin-top: -97px; 
    padding-top: 97px;
  }

  .po-hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(5, 5, 5, 0.2) 0%, #050505 100%);
    pointer-events: none;
  }

  .po-hero__container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transform: translateY(30px); /* Penyesuaian posisi agar mirip dengan desain */
  }

  .po-hero__badge-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .po-hero__badge {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 4px 12px;
    background: rgba(229, 196, 131, 0.2);
    border: 1px solid rgba(229, 196, 131, 0.4);
    
    font-family: 'Manrope', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    display: flex;
    align-items: center;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    color: #E5C483;
  }

  .po-hero__badge-text {
    font-family: 'Manrope', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    display: flex;
    align-items: center;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    color: #D0C5B5;
  }

  .po-hero__title {
    font-family: 'Playfair Display', serif;
    font-style: normal;
    font-weight: 700;
    font-size: clamp(40px, 5vw, 64px);
    line-height: 1.12; /* 72px / 64px */
    letter-spacing: -1.28px;
    color: #E5E2E1;
    max-width: 768px;
    margin: 0;
  }

  .po-hero__actions {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 12px 0px 0px;
    gap: 16px;
  }

  .po-hero__btn {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 40px;
    height: 50px;
    
    font-family: 'Manrope', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .po-hero__btn--primary {
    background: #E5C483;
    color: #402D00;
  }

  .po-hero__btn--primary:hover {
    background: #D4B16A;
  }

  .po-hero__btn--outline {
    border: 1px solid #E5C483;
    color: #E5C483;
    background: transparent;
  }

  .po-hero__btn--outline:hover {
    background: rgba(229, 196, 131, 0.1);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .po-hero {
      min-height: 100vh;
      padding-top: 120px;
    }
    .po-hero__container {
      padding: 0 24px;
    }
    .po-hero__actions {
      flex-direction: column;
      align-items: stretch;
      width: 100%;
    }
    .po-hero__btn {
      width: 100%;
    }
  }
`;

const Hero = () => {
  return (
    <section className="po-hero">
      <style>{heroStyles}</style>
      <div className="po-hero__overlay"></div>
      
      <div className="po-hero__container">
        <div className="po-hero__badge-row">
          <div className="po-hero__badge">ACTIVE</div>
          <div className="po-hero__badge-text">COMMUNITY DEVELOPMENT</div>
        </div>
        
        <h1 className="po-hero__title">
          Community Empowerment Collective
        </h1>
        
        <div className="po-hero__actions">
          <a href="/mahreen-csr/pendaftaran" className="po-hero__btn po-hero__btn--primary">
            GABUNG PROGRAM
          </a>
          <a href="/contact?pillar=csr" className="po-hero__btn po-hero__btn--outline">
            AJUKAN KOLABORASI
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
