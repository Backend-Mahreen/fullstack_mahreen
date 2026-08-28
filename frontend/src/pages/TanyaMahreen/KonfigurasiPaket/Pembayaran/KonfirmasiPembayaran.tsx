import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { useState, type CSSProperties } from "react";
import TanyaMahreenNavbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import {
  DraftMissing,
  MethodSpecificBlock,
  ProgressDots,
} from "./PaymentFlowUI";
import { formatCurrency, getDraftMethodLabel } from "./paymentFlowUtils";
import { PAYMENT_FLOW_STYLES } from "./paymentFlowStyles";
import { getPaymentDraft } from "./paymentStorage";
import { serviceOrderService } from "../../../../services/payment/serviceOrderService";
import type { ServicePaymentDraft } from "./paymentTypes";
import { navigateToRoute } from "../../../../utils/hashNavigation";
import { env } from "../../../../config/env";

const KonfirmasiPembayaran = () => {
  const [draft] = useState<ServicePaymentDraft | null>(() => getPaymentDraft());
  const [checking, setChecking] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handleConfirm = async () => {
    if (!draft || checking) return;
    setChecking(true);
    setPaymentError("");

    try {
      await serviceOrderService.confirmPayment(draft);
      navigateToRoute("/tanya-mahreen/pembayaran/berhasil");
    } catch (caughtError) {
      setPaymentError(
        caughtError instanceof Error
          ? caughtError.message
          : "Status pembayaran tidak dapat dikonfirmasi.",
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <style>{PAYMENT_FLOW_STYLES}</style>
      <TanyaMahreenNavbar />

      <main className="spf-page">
        <div className="spf-shell">
          <header className="spf-header spf-reveal" style={{ "--spf-delay": "40ms" } as CSSProperties}>
            <span className="spf-header__icon"><span className="spf-header__spinner" /></span>
            <ProgressDots step={1} />
            <h1>Konfirmasi Pembayaran</h1>
            <p>Sistem akan memverifikasi dana Anda secara <strong>real-time</strong>. Proses verifikasi biasanya memakan waktu 1–2 menit.</p>
          </header>

          {!draft ? (
            <DraftMissing />
          ) : (
            <>
              <section className="spf-card spf-reveal" style={{ "--spf-delay": "150ms" } as CSSProperties}>
                <div className="spf-card__status">Menunggu Pembayaran</div>

                <div className="spf-stats">
                  <div className="spf-stat"><span>Status</span><strong className="is-gold">Diproses</strong></div>
                  <div className="spf-stat"><span>Total Pembayaran</span><strong>{formatCurrency(draft.total)}</strong></div>
                  <div className="spf-stat"><span>Metode</span><strong>{getDraftMethodLabel(draft)}</strong></div>
                  <div className="spf-stat"><span>ID Transaksi</span><strong>{draft.transactionId}</strong></div>
                </div>

                <MethodSpecificBlock draft={draft} />

                <div className="spf-note">
                  <Info aria-hidden="true" />
                  <span>
                    Halaman ini akan memperbarui status secara otomatis setelah pembayaran terkonfirmasi. Jangan tutup halaman ini.
                    {draft.selectedMethod === "bank-transfer" && " Setelah transfer, tekan tombol konfirmasi di bawah."}
                  </span>
                </div>
              </section>

              {paymentError && <p className="spf-note" role="alert">{paymentError}</p>}
              <div className="spf-actions spf-reveal" style={{ "--spf-delay": "250ms" } as CSSProperties}>
                <button type="button" className="spf-primary" onClick={handleConfirm} disabled={checking}>
                  {checking
                    ? "Memeriksa Pembayaran..."
                    : draft.selectedMethod === "bank-transfer"
                      ? "Saya Sudah Transfer"
                      : "Cek Status Pembayaran"}
                  {checking ? <CheckCircle2 aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                </button>
                <a className="spf-secondary" href="/tanya-mahreen">Kembali ke Beranda</a>
                {env.allowLocalSimulation && env.dataSourceMode === "local" && (
                  <button type="button" className="spf-dev-action" onClick={handleConfirm}>
                    Simulasi pembayaran sukses (development)
                  </button>
                )}
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

export default KonfirmasiPembayaran;
