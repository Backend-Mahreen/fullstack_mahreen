import { ArrowRight, Copy, Info } from "lucide-react";
import PaymentBrandLogo from "../../../../components/Payment/PaymentBrandLogo";
import { getBankOption, getVirtualAccountNumber } from "./paymentData";
import type { ServicePaymentDraft } from "./paymentTypes";

export const ProgressDots = ({ step }: Readonly<{ step: 1 | 2 | 3 }>) => (
  <div className="spf-progress">
    <span>Langkah {step} dari 3</span>
    <span className="spf-progress__dots" aria-hidden="true">
      {[1, 2, 3].map((dot) => <i key={dot} className={dot === step ? "is-active" : ""} />)}
    </span>
  </div>
);

const qrPattern = [
  "11101110111",
  "10101010101",
  "11101110111",
  "00010001000",
  "11100110111",
  "00111010010",
  "10101101101",
  "00010110000",
  "11101010111",
  "10111010101",
  "11100110111",
];

export const DemoQrCode = () => (
  <div className="spf-qr" role="img" aria-label="Kode QRIS demo">
    {qrPattern.flatMap((row, rowIndex) =>
      [...row].map((cell, columnIndex) => (
        <i key={`${rowIndex}-${columnIndex}`} className={cell === "1" ? "is-dark" : ""} />
      )),
    )}
  </div>
);

export const MethodSpecificBlock = ({ draft }: Readonly<{ draft: ServicePaymentDraft }>) => {
  if (draft.selectedMethod === "bank-transfer") {
    const bank = getBankOption(draft.paymentDetails.bankTransferBank);
    return (
      <div className="spf-detail-block">
        <span className="spf-detail-block__label">Rekening Tujuan</span>
        <div className="spf-detail-block__value spf-bank-line">
          <span className="spf-bank-line__logo"><img width="240" height="96" decoding="async" loading="lazy" src={bank.logo} alt={bank.name} /></span>
          <div>
            <p>{bank.longName} ({bank.name})</p>
            <strong>{bank.accountNumber} (a/n PT Mahreen Indonesia Kreatif)</strong>
          </div>
          <button type="button" className="spf-copy" onClick={() => void navigator.clipboard?.writeText(bank.accountNumber.replace(/\s/g, ""))}>
            <Copy aria-hidden="true" /> Salin
          </button>
        </div>
      </div>
    );
  }

  if (draft.selectedMethod === "virtual-account") {
    const bank = getBankOption(draft.paymentDetails.virtualAccountBank);
    const virtualAccount = getVirtualAccountNumber(bank.id, draft.transactionId);
    return (
      <div className="spf-detail-block">
        <span className="spf-detail-block__label">Nomor Virtual Account</span>
        <div className="spf-detail-block__value spf-bank-line">
          <span className="spf-bank-line__logo"><img width="240" height="96" decoding="async" loading="lazy" src={bank.logo} alt={bank.name} /></span>
          <div>
            <p>Virtual Account {bank.name}</p>
            <strong>{virtualAccount}</strong>
          </div>
          <button type="button" className="spf-copy" onClick={() => void navigator.clipboard?.writeText(virtualAccount)}>
            <Copy aria-hidden="true" /> Salin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="spf-detail-block">
      <span className="spf-detail-block__label">QRIS Code</span>
      <div className="spf-qr-wrap">
        <DemoQrCode />
        <p className="spf-qr-caption">
          <PaymentBrandLogo brand="qris" className="spf-qr-caption__brand" />
          <span>Pindai QRIS melalui aplikasi pembayaran pilihan Anda.</span>
        </p>
      </div>
    </div>
  );
};

export const DraftMissing = () => (
  <div className="spf-card spf-reveal">
    <div className="spf-note">
      <Info aria-hidden="true" />
      <span>Data pembayaran belum ditemukan. Pilih paket dan isi informasi pembayaran terlebih dahulu.</span>
    </div>
    <div className="spf-actions">
      <a className="spf-primary" href="/tanya-mahreen/pembayaran">Kembali ke Pembayaran <ArrowRight /></a>
    </div>
  </div>
);
