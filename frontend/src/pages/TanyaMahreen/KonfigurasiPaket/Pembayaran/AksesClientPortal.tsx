import { ArrowRight, Check, Mail } from "lucide-react";
import { useState, type CSSProperties } from "react";
import TanyaMahreenNavbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import { DraftMissing, ProgressDots } from "./PaymentFlowUI";
import { PAYMENT_FLOW_STYLES } from "./paymentFlowStyles";
import { getClientEmail, getPaymentDraft } from "./paymentStorage";
import type { ServicePaymentDraft } from "./paymentTypes";

const benefits = [
  "Akses ke dashboard proyek eksklusif",
  "Timeline dan milestone proyek secara real-time",
  "Galeri preview desain dan revisi",
  "Komunikasi langsung dengan tim kreatif",
];

const AksesClientPortal = () => {
  const [draft] = useState<ServicePaymentDraft | null>(() => getPaymentDraft());
  const email = draft ? getClientEmail(draft.billingInformation.fullName) : "";

  return (
    <>
      <style>{PAYMENT_FLOW_STYLES}</style>
      <TanyaMahreenNavbar />

      <main className="spf-page">
        <div className="spf-shell">
          <header className="spf-header spf-reveal" style={{ "--spf-delay": "40ms" } as CSSProperties}>
            <span className="spf-header__icon"><Mail aria-hidden="true" /></span>
            <ProgressDots step={2} />
            <h1>Akses Client Portal</h1>
            <p>Anda akan menerima email aktivasi <strong>dashboard proyek pribadi</strong> di alamat yang telah didaftarkan.</p>
          </header>

          {!draft ? (
            <DraftMissing />
          ) : (
            <>
              <section className="spf-card spf-reveal" style={{ "--spf-delay": "150ms" } as CSSProperties}>
                <div className="spf-card__status">Email Terkirim</div>

                <div className="spf-email-card">
                  <Mail aria-hidden="true" />
                  <div><strong>{email}</strong><span>Email aktivasi telah dikirim</span></div>
                </div>

                <div className="spf-benefits">
                  <h2>Apa yang akan Anda dapatkan:</h2>
                  <ul>
                    {benefits.map((benefit) => (
                      <li key={benefit}><Check aria-hidden="true" /><span>{benefit}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="spf-note">
                  <Mail aria-hidden="true" />
                  <span>Tidak menerima email? Periksa folder spam atau hubungi info@mahreenindonesia.com untuk bantuan.</span>
                </div>
              </section>

              <div className="spf-actions spf-reveal" style={{ "--spf-delay": "250ms" } as CSSProperties}>
                <a className="spf-primary" href="/tanya-mahreen/pembayaran/kick-off">
                  Jadwalkan Kick-off Meeting <ArrowRight aria-hidden="true" />
                </a>
                <a className="spf-secondary" href="/tanya-mahreen/pembayaran/berhasil">Kembali ke Konfirmasi Pembayaran</a>
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

export default AksesClientPortal;
