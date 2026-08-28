import { useState } from "react";

const faqStyles = `
  .po-faq {
    width: 100%;
    background: #0e0e0e;
    padding: 80px 48px;
    display: flex;
    justify-content: center;
  }

  .po-faq,
  .po-faq *,
  .po-faq *::before,
  .po-faq *::after {
    box-sizing: border-box;
  }

  .po-faq__container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    gap: 64px;
  }

  .po-faq__left {
    flex: 0 0 380px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .po-faq__title {
    margin: 0;
    color: #e5e2e1;
    font-family: "Playfair Display", serif;
    font-size: clamp(32px, 4vw, 40px);
    font-weight: 600;
    letter-spacing: -0.4px;
    line-height: 1.2;
  }

  .po-faq__desc {
    margin: 0;
    color: #d0c5b5;
    font-family: "Manrope", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.65;
  }

  .po-faq__right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .po-faq__item {
    overflow: hidden;
    border: 1px solid rgba(229, 196, 131, 0.12);
    border-radius: 14px;
    background: #201f1f;
    transition:
      border-color 220ms ease,
      background-color 220ms ease,
      box-shadow 220ms ease,
      transform 220ms ease;
  }

  .po-faq__item:hover,
  .po-faq__item:focus-within {
    border-color: rgba(229, 196, 131, 0.34);
    background: #252321;
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.22);
  }

  .po-faq__item--open {
    border-color: rgba(229, 196, 131, 0.42);
    background: linear-gradient(145deg, #25221d, #1d1c1b);
  }

  .po-faq__question-button {
    width: 100%;
    min-height: 78px;
    padding: 22px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    border: 0;
    border-radius: 0;
    background: transparent !important;
    color: #e5e2e1 !important;
    box-shadow: none !important;
    cursor: pointer;
    text-align: left;
  }

  .po-faq__question-button:hover,
  .po-faq__question-button:focus-visible {
    background: transparent !important;
    color: #ffffff !important;
    border-color: transparent !important;
    box-shadow: none !important;
    outline: none;
  }

  .po-faq__question-button:focus-visible {
    outline: 1px solid rgba(229, 196, 131, 0.72);
    outline-offset: -5px;
  }

  .po-faq__question-text {
    color: inherit;
    font-family: "Manrope", sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.5;
  }

  .po-faq__icon {
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border: 1px solid rgba(229, 196, 131, 0.24);
    border-radius: 50%;
    color: #e5c483;
    background: rgba(229, 196, 131, 0.05);
    transition: transform 260ms ease, border-color 260ms ease, background-color 260ms ease;
  }

  .po-faq__item--open .po-faq__icon {
    transform: rotate(180deg);
    border-color: rgba(229, 196, 131, 0.56);
    background: rgba(229, 196, 131, 0.12);
  }

  .po-faq__answer {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 300ms ease, opacity 220ms ease;
  }

  .po-faq__item--open .po-faq__answer {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .po-faq__answer-inner {
    min-height: 0;
    overflow: hidden;
  }

  .po-faq__answer-text {
    margin: 0;
    padding: 0 68px 24px 24px;
    color: #d0c5b5;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.75;
  }

  @media (max-width: 992px) {
    .po-faq__container {
      flex-direction: column;
      gap: 40px;
    }

    .po-faq__left {
      flex: none;
      width: 100%;
      max-width: 660px;
    }
  }

  @media (max-width: 768px) {
    .po-faq {
      padding: 60px 24px;
    }

    .po-faq__question-button {
      min-height: 70px;
      padding: 19px 18px;
    }

    .po-faq__question-text {
      font-size: 15px;
    }

    .po-faq__answer-text {
      padding: 0 18px 20px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .po-faq {
      padding-right: 16px;
      padding-left: 16px;
    }

    .po-faq__icon {
      width: 28px;
      height: 28px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .po-faq__item,
    .po-faq__icon,
    .po-faq__answer {
      transition: none;
    }
  }
`;

const faqData = [
  {
    q: "Bagaimana cara mendaftarkan komunitas saya?",
    a: "Daftarkan komunitas melalui formulir pada halaman pendaftaran Mahreen CSR. Isi profil komunitas, fokus kegiatan, wilayah dampak, dan kebutuhan program. Tim Mahreen akan meninjau data lalu menghubungi perwakilan komunitas untuk tahap verifikasi dan diskusi berikutnya.",
  },
  {
    q: "Apakah ada biaya untuk mengikuti program pelatihan?",
    a: "Tidak. Program pelatihan dalam inisiatif Mahreen CSR tidak memungut biaya bagi peserta yang lolos kriteria program. Informasi jadwal, kuota, fasilitas, dan persyaratan akan dicantumkan pada detail program sebelum pendaftaran dibuka.",
  },
  {
    q: "Dapatkah individu bergabung sebagai relawan ahli?",
    a: "Bisa. Profesional, praktisi, dan akademisi dapat berkontribusi sebagai mentor, fasilitator, atau relawan ahli. Pilih peran yang sesuai pada formulir pendaftaran, lalu sertakan bidang keahlian dan ketersediaan waktu agar tim dapat mencocokkannya dengan program aktif.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  return (
    <section className="po-faq" aria-labelledby="program-objective-faq-title">
      <style>{faqStyles}</style>
      <div className="po-faq__container">
        <div className="po-faq__left">
          <h2 className="po-faq__title" id="program-objective-faq-title">
            Pertanyaan Umum
          </h2>
          <p className="po-faq__desc">
            Segala hal yang perlu Anda ketahui tentang cara bergabung dan berkontribusi.
          </p>
        </div>

        <div className="po-faq__right">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `program-objective-faq-answer-${index}`;

            return (
              <article
                className={`po-faq__item${isOpen ? " po-faq__item--open" : ""}`}
                key={item.q}
              >
                <button
                  className="po-faq__question-button"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggle(index)}
                >
                  <span className="po-faq__question-text">{item.q}</span>
                  <span className="po-faq__icon" aria-hidden="true">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                <div className="po-faq__answer" id={answerId} aria-hidden={!isOpen}>
                  <div className="po-faq__answer-inner">
                    <p className="po-faq__answer-text">{item.a}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
