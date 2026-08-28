import doc1 from '../../../../assets/CSR/ProgramObjective/dokumentasi-proyek1.png';
import doc2 from '../../../../assets/CSR/ProgramObjective/dokumentasi-proyek2.png';
import doc3 from '../../../../assets/CSR/ProgramObjective/dokumentasi-proyek3.png';
import doc4 from '../../../../assets/CSR/ProgramObjective/dokumentasi-proyek4.webp';
import doc5 from '../../../../assets/CSR/ProgramObjective/dokumentasi-proyek5.webp';

const docsStyles = `
  .po-docs {
    width: 100%;
    background: #0E0E0E; /* Sesuai dengan background hitam di screenshot */
    padding: 80px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .po-docs__container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .po-docs__header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .po-docs__title {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: clamp(32px, 4vw, 40px);
    line-height: 1.2;
    letter-spacing: -0.4px;
    color: #E5E2E1;
    margin: 0;
  }

  .po-docs__subtitle {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color: #D0C5B5;
    margin: 0;
  }

  .po-docs__grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr; /* Proporsi 284 : 584 : 284 (hampir 1:2:1) */
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    width: 100%;
  }

  .po-docs__img-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: #1A1A1A; /* Placeholder color before image loads */
  }

  .po-docs__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .po-docs__img-wrap:hover .po-docs__img {
    transform: scale(1.05);
  }

  /* Mengatur penempatan grid */
  /* Asumsi: doc4 adalah gambar besar di tengah karena ukuran filenya paling besar */
  .po-docs__img-1 { grid-column: 1 / 2; grid-row: 1 / 2; aspect-ratio: 1 / 1; }
  .po-docs__img-2 { grid-column: 1 / 2; grid-row: 2 / 3; aspect-ratio: 1 / 1; }
  
  .po-docs__img-middle { 
    grid-column: 2 / 3; 
    grid-row: 1 / 3; 
    /* Karena grid-row 2 baris, tingginya akan mengikuti kombinasi dua gambar kecil + gap */
  }
  
  .po-docs__img-3 { grid-column: 3 / 4; grid-row: 1 / 2; aspect-ratio: 1 / 1; }
  .po-docs__img-5 { grid-column: 3 / 4; grid-row: 2 / 3; aspect-ratio: 1 / 1; }

  @media (max-width: 992px) {
    .po-docs__grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
    }
    .po-docs__img-middle {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
      aspect-ratio: 16 / 9;
    }
    .po-docs__img-1 { grid-column: 1 / 2; grid-row: 2 / 3; }
    .po-docs__img-2 { grid-column: 2 / 3; grid-row: 2 / 3; }
    .po-docs__img-3 { grid-column: 1 / 2; grid-row: 3 / 4; }
    .po-docs__img-5 { grid-column: 2 / 3; grid-row: 3 / 4; }
  }

  @media (max-width: 768px) {
    .po-docs {
      padding: 60px 24px;
    }
    .po-docs__grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .po-docs__img-middle {
      grid-column: 1 / -1;
      grid-row: auto;
    }
    .po-docs__img-1, .po-docs__img-2, .po-docs__img-3, .po-docs__img-5 {
      grid-column: 1 / -1;
      grid-row: auto;
    }
  }
`;

const Documentation = () => {
  return (
    <section className="po-docs">
      <style>{docsStyles}</style>
      <div className="po-docs__container">
        
        <div className="po-docs__header">
          <h2 className="po-docs__title">Dokumentasi Proyek</h2>
          <p className="po-docs__subtitle">
            Visualisasi nyata dari setiap tahapan pemberdayaan di lapangan.
          </p>
          {/* Tombol Lihat Semua dihilangkan sesuai permintaan */}
        </div>

        <div className="po-docs__grid">
          <div className="po-docs__img-wrap po-docs__img-1">
            <img width="284" height="284" decoding="async" loading="lazy" src={doc1} alt="Dokumentasi 1" className="po-docs__img" />
          </div>
          <div className="po-docs__img-wrap po-docs__img-2">
            <img width="284" height="284" decoding="async" loading="lazy" src={doc2} alt="Dokumentasi 2" className="po-docs__img" />
          </div>
          
          <div className="po-docs__img-wrap po-docs__img-middle">
            <img width="584" height="584" decoding="async" loading="lazy" src={doc4} alt="Dokumentasi Utama" className="po-docs__img" />
          </div>

          <div className="po-docs__img-wrap po-docs__img-3">
            <img width="284" height="284" decoding="async" loading="lazy" src={doc3} alt="Dokumentasi 3" className="po-docs__img" />
          </div>
          <div className="po-docs__img-wrap po-docs__img-5">
            <img width="284" height="284" decoding="async" loading="lazy" src={doc5} alt="Dokumentasi 5" className="po-docs__img" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Documentation;
