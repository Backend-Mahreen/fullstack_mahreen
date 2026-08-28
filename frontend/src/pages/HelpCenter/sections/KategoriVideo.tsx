import iconRocket from "../../../assets/HelpCenter/KategoriVideo/GettingStarted.png";
import iconPayment from "../../../assets/HelpCenter/KategoriVideo/Payment.png";
import iconTech from "../../../assets/HelpCenter/KategoriVideo/TechnicalSupport.png";

type HelpCategory = {
  key: string;
  title: string;
  description: string;
  count: number;
  icon: string;
};

const categories: readonly HelpCategory[] = [
  {
    key: "getting-started",
    title: "Getting Started",
    description: "Langkah awal memulai kerja sama atau bergabung dengan ekosistem Mahreen.",
    count: 0,
    icon: iconRocket,
  },
  {
    key: "payments",
    title: "Payments",
    description: "Informasi metode pembayaran, invoicing, dan konfirmasi transaksi.",
    count: 0,
    icon: iconPayment,
  },
  {
    key: "technical-support",
    title: "Technical Support",
    description: "Solusi kendala teknis pada platform dan integrasi sistem Mahreen.",
    count: 0,
    icon: iconTech,
  },
];

const KategoriVideo = () => {
  return (
    <div className="hc-section-wrapper">
      <section aria-labelledby="help-categories-title">
        <h2 className="hc-section-title" id="help-categories-title" style={{ textAlign: "center", marginBottom: "32px" }}>Telusuri Kategori</h2>
        <div className="hc-grid-3">
          {categories.map((category) => (
            <article className="hc-cat-card hc-cat-card--empty border-card" key={category.key}>
              <img width="32" height="32" decoding="async" loading="lazy"
                src={category.icon}
                alt=""
                className="hc-service-icon"
                style={{ width: "32px", height: "32px", objectFit: "contain", marginBottom: "12px" }}
              />
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <span className="hc-cat-link hc-cat-link--disabled" aria-disabled="true">
                Lihat {category.count} Artikel
              </span>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="help-video-title">
        <h2 className="hc-section-title" id="help-video-title">Video Panduan</h2>
        <div className="hc-empty-state" role="status">
          <p>Video panduan belum tersedia.</p>
          <span>Materi video resmi akan ditampilkan di sini setelah dipublikasikan.</span>
        </div>
      </section>
    </div>
  );
};

export default KategoriVideo;
