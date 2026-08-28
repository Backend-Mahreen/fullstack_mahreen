import daftarSekarangBackground from "../../../assets/CSR/background-daftar-sekarang.webp";

const daftarSekarangStyles = `

  .csr-daftar-sekarang {
    width: 100%;
    background: #000000;
    color: #e5e2e1;
  }

  .csr-daftar-sekarang__outer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 56px 40px 64px;
    box-sizing: border-box;
  }

  .csr-daftar-sekarang__panel {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 480px;
    padding: 64px 48px;
    overflow: hidden;
    background: #111111;
  }

  .csr-daftar-sekarang__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    z-index: 0;
  }

  .csr-daftar-sekarang__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  .csr-daftar-sekarang__content {
    position: relative;
    z-index: 2;
    width: min(672px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
  }

  .csr-daftar-sekarang__title {
    margin: 0;
    color: #e5e2e1;
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 48px;
    letter-spacing: -0.4px;
  }

  .csr-daftar-sekarang__description {
    margin: 0;
    max-width: 606px;
    color: #d0c5b5;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }

  .csr-daftar-sekarang__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 214px;
    min-height: 64px;
    padding: 20px 48px;
    border: 0;
    border-radius: 4px;
    background: #e5c483;
    color: #402d00;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-decoration: none;
    transition: transform 0.2s ease, filter 0.2s ease;
  }

  .csr-daftar-sekarang__button:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }

  @media (max-width: 1024px) {
    .csr-daftar-sekarang__outer {
      padding: 48px 24px 56px;
    }

    .csr-daftar-sekarang__panel {
      min-height: 440px;
      padding: 56px 32px;
    }

    .csr-daftar-sekarang__title {
      font-size: 34px;
      line-height: 42px;
    }
  }

  @media (max-width: 640px) {
    .csr-daftar-sekarang__outer {
      padding: 40px 18px 48px;
    }

    .csr-daftar-sekarang__panel {
      min-height: 380px;
      padding: 40px 20px;
    }

    .csr-daftar-sekarang__content {
      gap: 18px;
    }

    .csr-daftar-sekarang__title {
      font-size: 28px;
      line-height: 34px;
    }

    .csr-daftar-sekarang__description {
      font-size: 14px;
      line-height: 22px;
    }

    .csr-daftar-sekarang__button {
      min-width: 184px;
      min-height: 56px;
      padding: 16px 28px;
      font-size: 15px;
      line-height: 22px;
    }
  }

  @media (max-width: 420px) {
    .csr-daftar-sekarang__panel {
      min-height: 340px;
      padding: 32px 16px;
    }

    .csr-daftar-sekarang__title {
      font-size: 24px;
      line-height: 30px;
    }
  }
`;

const DaftarSekarangSection = () => {
  return (
    <section
      id="daftar-sekarang"
      className="csr-daftar-sekarang"
      aria-labelledby="csr-daftar-sekarang-title"
    >
      <style data-component="csr-daftar-sekarang">{daftarSekarangStyles}</style>

      <div className="csr-daftar-sekarang__outer">
        <div className="csr-daftar-sekarang__panel">
          <img
            className="csr-daftar-sekarang__image"
            src={daftarSekarangBackground}
            alt="Relawan Mahreen menanam bibit pohon"
            loading="lazy"
            decoding="async"
            width="1280"
            height="480"
          />
          <div className="csr-daftar-sekarang__overlay" aria-hidden="true" />

          <div className="csr-daftar-sekarang__content">
            <h2
              className="csr-daftar-sekarang__title"
              id="csr-daftar-sekarang-title"
            >
              Menjadi Relawan Mahreen
            </h2>

            <p className="csr-daftar-sekarang__description">
              Ambil peran nyata dalam perubahan. Jadilah bagian dari jaringan
              relawan kami yang berdedikasi untuk menciptakan dampak sosial di
              seluruh penjuru negeri.
            </p>

            <a className="csr-daftar-sekarang__button" href="/mahreen-csr/pendaftaran">
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DaftarSekarangSection;
