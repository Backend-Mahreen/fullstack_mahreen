import { useState } from "react";

const rights = [
  {
    title: "Hak untuk Mengakses Informasi",
    description:
      "Anda berhak meminta salinan data pribadi yang kami simpan, mengetahui sumber data, tujuan penggunaan, kategori data, serta pihak yang menerima data tersebut.",
  },
  {
    title: "Hak untuk Koreksi Data",
    description:
      "Anda dapat meminta pembaruan atau perbaikan apabila data pribadi yang tersimpan tidak lengkap, tidak akurat, atau sudah tidak sesuai dengan kondisi terbaru.",
  },
  {
    title: "Hak untuk Penghapusan Data (Right to be Forgotten)",
    description:
      "Anda dapat mengajukan penghapusan data pribadi ketika data tidak lagi diperlukan, persetujuan ditarik, atau tidak terdapat dasar hukum lain untuk mempertahankan pemrosesan.",
  },
  {
    title: "Hak untuk Membatasi Pemrosesan",
    description:
      "Anda dapat meminta pembatasan penggunaan data selama proses verifikasi, penyelesaian keberatan, atau ketika data hanya perlu disimpan untuk kepentingan hukum tertentu.",
  },
] as const;

const PrivacyRightsAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="kp-rights-accordion">
      {rights.map((right, index) => {
        const isOpen = openIndex === index;
        const panelId = `privacy-right-panel-${index}`;
        const triggerId = `privacy-right-trigger-${index}`;

        return (
          <article
            className={`kp-list-item${isOpen ? " is-open" : ""}`}
            key={right.title}
          >
            <button
              id={triggerId}
              className="kp-list-trigger"
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            >
              <span>{right.title}</span>
              <span className="kp-chevron" aria-hidden="true">
                ›
              </span>
            </button>

            <div
              id={panelId}
              className={`kp-list-panel${isOpen ? " is-open" : ""}`}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
            >
              <div className="kp-list-panel-inner">
                <p>{right.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PrivacyRightsAccordion;
