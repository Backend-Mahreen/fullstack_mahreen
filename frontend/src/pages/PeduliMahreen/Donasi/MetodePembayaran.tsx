import { useEffect, useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import PaymentBrandLogo from "../../../components/Payment/PaymentBrandLogo";
import type { PaymentBrandId } from "../../../data/paymentBrands";
import { env } from "../../../config/env";
import DonationLayout from "./DonationLayout";
import DonationStepper from "./DonationStepper";
import type { DonationPaymentMethodId } from "./donationTypes";
import {
  getDonationDraft,
  saveDonationPaymentMethod,
} from "./donationStorage";
import { formatRupiah } from "./donationUtils";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import { donationService } from "../../../services/donation/donationService";

const walletMethods = [
  {
    id: "qris" as const,
    label: "QRIS",
    description: "GoPay, OVO, Dana, LinkAja",
    brand: "qris" as const,
  },
  {
    id: "shopeepay" as const,
    label: "ShopeePay",
    description: "Bayar langsung melalui aplikasi ShopeePay",
    brand: "shopeepay" as const,
  },
];

const bankMethods = [
  {
    id: "bca-va" as const,
    label: "BCA Virtual Account",
    description: "Konfirmasi otomatis",
    brand: "bca" as const,
  },
  {
    id: "mandiri-va" as const,
    label: "Mandiri Virtual Account",
    description: "Konfirmasi otomatis",
    brand: "mandiri" as const,
  },
];

const MetodePembayaran = () => {
  const [draft, setDraft] = useState(() => getDonationDraft());
  const [selectedMethod, setSelectedMethod] = useState<DonationPaymentMethodId>(
    draft.paymentMethod ?? "qris",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!draft.donor.email) {
      navigateToHashRoute("/peduli-mahreen/donasi/data-diri");
    }
  }, [draft.donor.email]);

  const handleSelect = (method: DonationPaymentMethodId) => {
    setSelectedMethod(method);
    setDraft(saveDonationPaymentMethod(method));
  };

  const handlePay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPaymentError("");
    const nextDraft = saveDonationPaymentMethod(selectedMethod);

    try {
      const result = await donationService.processPayment(nextDraft);

      if (result.checkoutUrl) {
        const checkoutUrl = new URL(result.checkoutUrl, window.location.origin);
        const isSameOrigin = checkoutUrl.origin === window.location.origin;
        const isAllowedProvider = env.paymentCheckoutHosts.includes(
          checkoutUrl.hostname.toLowerCase(),
        );
        const hasAllowedProtocol = checkoutUrl.protocol === "https:" ||
          (env.isDevelopment && checkoutUrl.protocol === "http:");
        if (
          !hasAllowedProtocol ||
          (!isSameOrigin && !isAllowedProvider)
        ) {
          throw new Error("Alamat checkout dari server tidak valid.");
        }
        window.location.assign(checkoutUrl.href);
        return;
      }

      if (result.draft.status !== "paid") {
        throw new Error("Pembayaran masih menunggu konfirmasi dari penyedia pembayaran.");
      }

      navigateToHashRoute("/peduli-mahreen/donasi/berhasil");
    } catch (caughtError) {
      setPaymentError(
        caughtError instanceof Error
          ? caughtError.message
          : "Pembayaran tidak dapat diproses. Silakan coba kembali.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMethod = (
    method: (typeof walletMethods)[number] | (typeof bankMethods)[number],
  ) => {
    const active = selectedMethod === method.id;

    return (
      <button
        key={method.id}
        type="button"
        className={`donation-method${active ? " is-active" : ""}`}
        onClick={() => handleSelect(method.id)}
        role="radio"
        aria-checked={active}
      >
        <span className="donation-method__icon">
          <PaymentBrandLogo brand={method.brand as PaymentBrandId} />
        </span>
        <span className="donation-method__copy">
          <strong>{method.label}</strong>
          <span className="donation-method__description">{method.description}</span>
        </span>
        <span className="donation-method__radio" aria-hidden="true" />
      </button>
    );
  };

  const donorLabel = draft.donor.anonymous ? "Donatur Anonim" : draft.donor.fullName || "Guest User";

  return (
    <DonationLayout>
      <section className="donation-shell" aria-labelledby="donation-payment-title">
        <DonationStepper activeStep={3} />

        <div className="donation-payment-layout">
          <div
            className="donation-payment-options"
            data-donation-reveal
            role="radiogroup"
            aria-labelledby="donation-payment-title"
          >
            {env.dataSourceMode === "local" ? (
              <span className="donation-demo-badge">Mode demo · tanpa transaksi nyata</span>
            ) : null}
            <h1 className="donation-payment-title" id="donation-payment-title">
              Pilih Metode
              <br />
              Pembayaran
            </h1>
            <p className="donation-payment-copy">
              Silakan pilih metode pembayaran yang paling memudahkan Anda.
            </p>

            <section className="donation-payment-group" aria-labelledby="wallet-payment-title">
              <h2 className="donation-payment-group__title" id="wallet-payment-title">
                E-WALLET & QRIS
              </h2>
              <div className="donation-method-list">
                {walletMethods.map(renderMethod)}
              </div>
            </section>

            <section className="donation-payment-group" aria-labelledby="bank-payment-title">
              <h2 className="donation-payment-group__title" id="bank-payment-title">
                TRANSFER BANK (VIRTUAL ACCOUNT)
              </h2>
              <div className="donation-method-list">
                {bankMethods.map(renderMethod)}
              </div>
            </section>
          </div>

          <aside className="donation-summary-card" data-donation-reveal style={{ animationDelay: "110ms" }}>
            <h2>Ringkasan Kontribusi</h2>
            <div className="donation-summary-row">
              <span>Program</span>
              <strong>Kelas Inspirasi</strong>
            </div>
            <div className="donation-summary-row">
              <span>Donatur</span>
              <strong>{donorLabel}</strong>
            </div>

            <strong className="donation-summary-card__amount">{formatRupiah(draft.amount)}</strong>
            <p className="donation-summary-card__caption">Sudah termasuk biaya admin Rp0</p>

            {paymentError && <p className="donation-error" role="alert">{paymentError}</p>}
            <button type="button" className="donation-primary-button" onClick={handlePay} disabled={isProcessing}>
              {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              {!isProcessing && <ArrowRight size={16} aria-hidden="true" />}
            </button>

            <div className="donation-trust-list">
              <span>
                <ShieldCheck size={14} aria-hidden="true" /> Pembayaran aman
              </span>
              <span>
                <LockKeyhole size={14} aria-hidden="true" /> Data terenkripsi
              </span>
              <span>
                <ShieldCheck size={14} aria-hidden="true" /> Proteksi antifraud
              </span>
            </div>
          </aside>
        </div>
      </section>
    </DonationLayout>
  );
};

export default MetodePembayaran;
