import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Check,
  Download,
  Share2,
} from "lucide-react";
import DonationLayout from "./DonationLayout";
import { getDonationDraft } from "./donationStorage";
import {
  downloadDonationCertificatePdf,
  formatDonationDate,
} from "./donationUtils";
import { navigateToHashRoute } from "../../../utils/hashNavigation";

const DonasiBerhasil = () => {
  const [draft] = useState(() => getDonationDraft());
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (draft.status !== "paid") {
      navigateToHashRoute("/peduli-mahreen/donasi/pembayaran");
    }
  }, [draft.status]);

  const donorName = useMemo(
    () => (draft.donor.anonymous ? "Hamba Allah" : draft.donor.fullName || "Sahabat Mahreen"),
    [draft.donor.anonymous, draft.donor.fullName],
  );

  const handleShare = async () => {
    const text = `Saya baru saja ikut mendukung Kelas Inspirasi: Menyemai Mimpi bersama Peduli Mahreen. ID kontribusi ${draft.transactionId}.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Bukti Kebaikan Peduli Mahreen",
          text,
        });
        setShareMessage("Berhasil dibagikan.");
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareMessage("Teks berhasil disalin.");
    } catch {
      setShareMessage("Berbagi dibatalkan.");
    }
  };

  return (
    <DonationLayout>
      <section className="donation-shell donation-shell--success" aria-labelledby="donation-success-title">
        <header className="donation-success-header" data-donation-reveal>
          <span className="donation-success-icon">
            <Check size={32} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h1 className="donation-success-title" id="donation-success-title">
            Terima Kasih, Orang Baik!
          </h1>
          <p className="donation-success-copy">
            Donasi Anda telah berhasil kami terima dan akan disalurkan sesuai program yang Anda pilih. Setiap kontribusi Anda adalah napas baru bagi mimpi mereka.
          </p>
        </header>

        <article className="donation-certificate" data-donation-reveal style={{ animationDelay: "120ms" }}>
          <div className="donation-certificate__header">
            <div>
              <p className="donation-certificate__eyebrow">E-CERTIFICATE</p>
              <p className="donation-certificate__subtitle">Bukti Kebaikan</p>
            </div>
            <span className="donation-certificate__badge">
              <Award size={17} aria-hidden="true" />
            </span>
          </div>

          <div className="donation-certificate__grid">
            <div className="donation-certificate__field">
              <span>Nama Donatur</span>
              <strong>{donorName}</strong>
            </div>
            <div className="donation-certificate__field">
              <span>Tanggal</span>
              <strong>{formatDonationDate(draft.updatedAt)}</strong>
            </div>
            <div className="donation-certificate__field">
              <span>ID Transaksi</span>
              <strong>{draft.transactionId}</strong>
            </div>
            <div className="donation-certificate__field">
              <span>Status</span>
              <strong className="is-gold">● Berhasil</strong>
            </div>
          </div>

          <blockquote>
            “Membantu orang lain adalah cara terbaik untuk membantu diri kita sendiri menemukan makna dalam hidup.”
          </blockquote>

          <div className="donation-certificate__actions">
            <button type="button" className="donation-secondary-button" onClick={handleShare}>
              <Share2 size={14} aria-hidden="true" />
              Bagikan ke Media Sosial
            </button>
            <button
              type="button"
              className="donation-outline-button"
              onClick={() => downloadDonationCertificatePdf(draft)}
            >
              <Download size={14} aria-hidden="true" />
              Simpan PDF
            </button>
          </div>
          {shareMessage && <p className="donation-card__footnote">{shareMessage}</p>}
        </article>

        <div className="donation-success-actions" data-donation-reveal style={{ animationDelay: "210ms" }}>
          <a className="donation-primary-button" href="/peduli-mahreen">
            Kembali ke Beranda
          </a>
          <a className="donation-outline-button" href="/peduli-mahreen?section=peduli-story-title">
            Lihat Laporan Dampak
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </section>
    </DonationLayout>
  );
};

export default DonasiBerhasil;
