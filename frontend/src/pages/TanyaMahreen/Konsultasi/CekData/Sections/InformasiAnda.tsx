import { CalendarDays, CircleUserRound, WalletCards } from "lucide-react";
import type { KonsultasiDraft } from "../../../../../services/konsultasiDraft";

interface InformasiAndaProps {
  draft: KonsultasiDraft;
}

const budgetLabels: Record<string, string> = {
  "< 1M": "< 1 Juta",
  "1M - 3M": "1 - 3 Juta",
  "3M - 5M": "3 - 5 Juta",
  "5M - 10M": "5 - 10 Juta",
  "> 10M": "> 10 Juta",
};

const targetLabels: Record<string, string> = {
  Secepatnya: "Secepatnya",
  "1 Minggu": "1 Minggu",
  "2 Minggu": "2 Minggu",
  "1 Bulan": "1 Bulan",
  Fleksibel: "Fleksibel",
};

const InformasiAnda = ({ draft }: InformasiAndaProps) => {
  const { clientInfo, services, budget, target } = draft;

  return (
    <section className="review-summary-grid review-reveal" aria-label="Informasi utama konsultasi">
      <article className="review-card review-card--identity">
        <h2 className="review-section-title">
          <CircleUserRound aria-hidden="true" />
          <span>Informasi Utama</span>
        </h2>

        <div className="review-identity-grid">
          <div className="review-data-block">
            <span className="review-data-label">Nama Lengkap</span>
            <strong>{clientInfo.nama || "Belum diisi"}</strong>
          </div>
          <div className="review-data-block">
            <span className="review-data-label">Nama Brand / Perusahaan</span>
            <strong>{clientInfo.perusahaan || "Belum diisi"}</strong>
          </div>
          <div className="review-data-block">
            <span className="review-data-label">Alamat Email</span>
            <strong>{clientInfo.email || "Belum diisi"}</strong>
          </div>
          <div className="review-data-block">
            <span className="review-data-label">Nomor WhatsApp</span>
            <strong>{clientInfo.whatsapp || "Belum diisi"}</strong>
          </div>
          <div className="review-data-block">
            <span className="review-data-label">Domisili Kota</span>
            <strong>{clientInfo.kota || "Belum diisi"}</strong>
          </div>
        </div>

        <div className="review-divider" />

        <div>
          <span className="review-data-label">Layanan yang Dipilih</span>
          <div className="review-service-list">
            {services.length > 0 ? (
              services.map((service) => (
                <span className="review-service-chip" key={service}>
                  <span aria-hidden="true">•</span>
                  {service}
                </span>
              ))
            ) : (
              <span className="review-empty-copy">Belum ada layanan dipilih.</span>
            )}
          </div>
        </div>
      </article>

      <aside className="review-side-stack">
        <article className="review-card review-metric-card">
          <span className="review-metric-label">Estimasi Budget</span>
          <div className="review-metric-value">
            <WalletCards aria-hidden="true" />
            <strong>{(budgetLabels[budget] ?? budget) || "Belum dipilih"}</strong>
          </div>
        </article>

        <article className="review-card review-metric-card">
          <span className="review-metric-label">Tenggat Waktu</span>
          <div className="review-metric-value">
            <CalendarDays aria-hidden="true" />
            <strong>{(targetLabels[target] ?? target) || "Belum dipilih"}</strong>
          </div>
        </article>
      </aside>
    </section>
  );
};

export default InformasiAnda;
