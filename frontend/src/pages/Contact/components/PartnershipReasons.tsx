const reasons = [
  {
    number: "01",
    title: "Standar Kualitas Global",
    description:
      "Setiap proyek digarap dengan dedikasi tinggi, riset mendalam, serta eksekusi desain dan teknologi sesuai standar industri global.",
  },
  {
    number: "02",
    title: "Ekosistem Brand Terintegrasi",
    description:
      "Dari pilar gaya hidup kreatif, edukasi akademik, penanganan program sosial (CSR), hingga magang talenta digital, kami menawarkan solusi hulu-ke-hilir.",
  },
  {
    number: "03",
    title: "Dampak Sosial & Nilai Kemanusiaan",
    description:
      "Kolaborasi bersama kami turut mendukung program sosial berkelanjutan untuk kemajuan komunitas dan talenta muda di Indonesia.",
  },
] as const;

const partnershipReasonsStyles = `
  .contact-reasons {
    min-width: 0;
  }

  .contact-reasons__title {
    margin: 0 0 34px;
    color: #f4f1ec;
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(32px, 3vw, 47px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.025em;
  }

  .contact-reasons__list {
    display: grid;
    gap: 29px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .contact-reasons__item {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  .contact-reasons__number {
    padding-top: 2px;
    color: #8b704c;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 21px;
    font-style: italic;
    line-height: 1;
  }

  .contact-reasons__item-title {
    margin: 0;
    color: #eeeeee;
    font-family: Inter, Arial, sans-serif;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.45;
  }

  .contact-reasons__description {
    max-width: 440px;
    margin: 8px 0 0;
    color: #8c8c91;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.75;
  }

  @media (max-width: 980px) {
    .contact-reasons__description {
      max-width: none;
    }
  }

  @media (max-width: 560px) {
    .contact-reasons__title {
      margin-bottom: 28px;
    }

    .contact-reasons__item {
      grid-template-columns: 32px minmax(0, 1fr);
      gap: 9px;
    }
  }
`;

const PartnershipReasons = () => (
  <>
    <style data-component="contact-partnership-reasons">{partnershipReasonsStyles}</style>
    <section className="contact-reasons" aria-labelledby="contact-reasons-title">
      <h2 className="contact-reasons__title" id="contact-reasons-title">
        Mengapa Bermitra dengan Kami?
      </h2>
      <ol className="contact-reasons__list">
        {reasons.map((reason) => (
          <li className="contact-reasons__item" key={reason.number}>
            <span className="contact-reasons__number" aria-hidden="true">
              {reason.number}
            </span>
            <div>
              <h3 className="contact-reasons__item-title">{reason.title}</h3>
              <p className="contact-reasons__description">{reason.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  </>
);

export default PartnershipReasons;
