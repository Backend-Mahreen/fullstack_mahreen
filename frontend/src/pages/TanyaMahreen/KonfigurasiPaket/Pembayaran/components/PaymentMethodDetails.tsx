import {
  CircleDollarSign,
  Copy,
  ShieldCheck,
} from "lucide-react";
import PaymentBrandLogo from "../../../../../components/Payment/PaymentBrandLogo";
import {
  BANK_OPTIONS,
  WALLET_OPTIONS,
  getBankOption,
} from "../paymentData";
import type {
  BankId,
  PaymentDetailsValue,
  PaymentMethodId,
  WalletId,
} from "../paymentTypes";

type Props = Readonly<{
  selectedMethod: PaymentMethodId;
  value: PaymentDetailsValue;
  onChange: (value: PaymentDetailsValue) => void;
}>;

const BankLogoPicker = ({
  selected,
  onSelect,
}: Readonly<{
  selected: BankId;
  onSelect: (bankId: BankId) => void;
}>) => (
  <div className="tp-bank-picker" role="radiogroup" aria-label="Pilih bank">
    {BANK_OPTIONS.map((bank) => (
      <button
        key={bank.id}
        type="button"
        className={`tp-bank-logo-button tp-glow-button${selected === bank.id ? " is-selected" : ""}`}
        aria-pressed={selected === bank.id}
        onClick={() => onSelect(bank.id)}
      >
        <img width="240" height="96" decoding="async" loading="lazy" src={bank.logo} alt={bank.name} />
      </button>
    ))}
  </div>
);

const PaymentMethodDetails = ({ selectedMethod, value, onChange }: Props) => {
  const manualBank = getBankOption(value.bankTransferBank);

  if (selectedMethod === "bank-transfer") {
    return (
      <div className="tp-method-detail tp-method-detail--bank">
        <div className="tp-method-detail__heading">
          <span className="tp-method-detail__icon tp-method-detail__icon--brand">
            <PaymentBrandLogo brand="bank-transfer" />
          </span>
          <div>
            <strong>Transfer Bank (Manual)</strong>
            <p>Konfirmasi manual melalui WhatsApp setelah transfer.</p>
          </div>
        </div>

        <div className="tp-method-detail__divider" />
        <p className="tp-method-detail__label">Pilih rekening tujuan:</p>

        <BankLogoPicker
          selected={value.bankTransferBank}
          onSelect={(bankId) => onChange({ ...value, bankTransferBank: bankId })}
        />

        <div className="tp-bank-account-card">
          <div className="tp-bank-account-card__logo">
            <img width="240" height="96" decoding="async" loading="lazy" src={manualBank.logo} alt={manualBank.name} />
          </div>
          <dl>
            <div><dt>Bank</dt><dd>{manualBank.longName} ({manualBank.name})</dd></div>
            <div><dt>No. Rekening</dt><dd className="is-gold">{manualBank.accountNumber}</dd></div>
            <div><dt>Atas Nama</dt><dd>PT Mahreen Indonesia Kreatif</dd></div>
          </dl>
          <button
            type="button"
            className="tp-copy-button tp-glow-button"
            onClick={() => void navigator.clipboard?.writeText(manualBank.accountNumber.replace(/\s/g, ""))}
          >
            <Copy aria-hidden="true" /> Salin
          </button>
        </div>

        <div className="tp-method-detail__note">
          <CircleDollarSign aria-hidden="true" />
          <span>
            Kirim bukti transfer melalui <strong>WhatsApp Mahreen Indonesia</strong> untuk verifikasi maksimal 1×24 jam.
          </span>
        </div>
      </div>
    );
  }

  if (selectedMethod === "virtual-account") {
    return (
      <div className="tp-method-detail">
        <div className="tp-method-detail__heading">
          <span className="tp-method-detail__icon tp-method-detail__icon--brand">
            <PaymentBrandLogo brand="virtual-account" />
          </span>
          <div>
            <strong>Virtual Account (Otomatis)</strong>
            <p>Nomor VA dibuat otomatis dan akses aktif setelah pembayaran terverifikasi.</p>
          </div>
        </div>

        <div className="tp-method-detail__divider" />
        <p className="tp-method-detail__label">Pilih bank Virtual Account:</p>

        <BankLogoPicker
          selected={value.virtualAccountBank}
          onSelect={(bankId) => onChange({ ...value, virtualAccountBank: bankId })}
        />

        <div className="tp-method-detail__note">
          <ShieldCheck aria-hidden="true" />
          <span>Nomor Virtual Account akan tampil pada halaman konfirmasi dan diverifikasi otomatis oleh sistem.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-method-detail">
      <div className="tp-method-detail__heading">
        <span className="tp-method-detail__icon tp-method-detail__icon--brand">
          <PaymentBrandLogo brand="qris" />
        </span>
        <div>
          <strong>E-Wallet / QRIS</strong>
          <p>Pindai QR atau lanjutkan pembayaran melalui aplikasi pilihan.</p>
        </div>
      </div>

      <div className="tp-method-detail__divider" />
      <p className="tp-method-detail__label">Pilih aplikasi e-wallet:</p>

      <div className="tp-wallet-picker" role="radiogroup" aria-label="Pilih e-wallet">
        {WALLET_OPTIONS.map((wallet) => (
          <button
            key={wallet.id}
            type="button"
            className={`tp-wallet-button tp-glow-button${value.wallet === wallet.id ? " is-selected" : ""}`}
            aria-pressed={value.wallet === wallet.id}
            onClick={() => onChange({ ...value, wallet: wallet.id as WalletId })}
          >
            <PaymentBrandLogo brand={wallet.brand} />
            <span>{wallet.name}</span>
          </button>
        ))}
      </div>

      <div className="tp-qr-preview">
        <PaymentBrandLogo
          brand="qris"
          className="tp-qr-preview__brand"
          decorative={false}
        />
        <p>{value.wallet === "qris" ? "QRIS ditampilkan pada langkah berikutnya." : `Lanjutkan melalui aplikasi ${WALLET_OPTIONS.find((item) => item.id === value.wallet)?.name}.`}</p>
      </div>
    </div>
  );
};

export default PaymentMethodDetails;
