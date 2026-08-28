import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { useState, type CSSProperties } from "react";
import TanyaMahreenNavbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import {
  DraftMissing,
  ProgressDots,
} from "./PaymentFlowUI";
import { formatCurrency, getDraftMethodLabel } from "./paymentFlowUtils";
import { PAYMENT_FLOW_STYLES } from "./paymentFlowStyles";
import { getPaymentDraft } from "./paymentStorage";
import type { ServicePaymentDraft } from "./paymentTypes";

const PembayaranBerhasil = () => {
  const [draft] = useState<ServicePaymentDraft | null>(() => getPaymentDraft());

  return (
    <>
      <style>{PAYMENT_FLOW_STYLES}</style>
      <TanyaMahreenNavbar />

      <main className="spf-page">
        <div className="spf-shell">
          <header className="spf-header spf-reveal" style={{ "--spf-delay": "40ms" } as CSSProperties}>
            <span className="spf-header__icon is-success"><Check aria-hidden="true" /></span>
            <ProgressDots step={1} />
            <h1 className="is-success">Pembayaran Berhasil!</h1>
            <p>Dana Anda telah sukses diverifikasi secara otomatis oleh sistem. Akses Client Portal Anda telah disiapkan.</p>
          </header>

          {!draft ? (
            <DraftMissing />
          ) : (
            <>
              <section className="spf-card spf-reveal" style={{ "--spf-delay": "150ms" } as CSSProperties}>
                <div className="spf-card__status is-success">Terverifikasi Otomatis</div>

                <div className="spf-stats">
                  <div className="spf-stat"><span>Status</span><strong className="is-success">Sukses / Lunas</strong></div>
                  <div className="spf-stat"><span>Total Pembayaran</span><strong>{formatCurrency(draft.total)}</strong></div>
                  <div className="spf-stat"><span>Metode</span><strong>{getDraftMethodLabel(draft)}</strong></div>
                  <div className="spf-stat"><span>ID Transaksi</span><strong>{draft.transactionId}</strong></div>
                </div>

                <div className="spf-note is-success">
                  <CheckCircle2 aria-hidden="true" />
                  <span>
                    <strong>Transaksi selesai.</strong><br />
                    Pembayaran telah diverifikasi. Akun Client Portal Anda disiapkan dan dapat diakses melalui tombol di bawah.
                  </span>
                </div>
              </section>

              <div className="spf-actions spf-reveal" style={{ "--spf-delay": "250ms" } as CSSProperties}>
                <a className="spf-primary" href="/tanya-mahreen/pembayaran/client-portal">
                  Lanjut ke Client Portal <ArrowRight aria-hidden="true" />
                </a>
                <a className="spf-secondary" href="/tanya-mahreen">Kembali ke Beranda</a>
              </div>
            </>
          )}
        </div>
      </main>

      <ClosingSection />
      <Footer />
    </>
  );
};

export default PembayaranBerhasil;
