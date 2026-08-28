import { ShieldCheck } from "lucide-react";
import PaymentBrandLogo from "../../../../../components/Payment/PaymentBrandLogo";
import type { PaymentBrandId } from "../../../../../data/paymentBrands";
import PaymentMethodDetails from "./PaymentMethodDetails";
import type {
  PaymentDetailsValue,
  PaymentMethodId,
} from "../paymentTypes";

type PaymentMethod = {
  id: PaymentMethodId;
  title: string;
  options: string[];
  description: string;
  brands: PaymentBrandId[];
};

type PaymentMethodsProps = {
  selectedMethod: PaymentMethodId;
  details: PaymentDetailsValue;
  onSelect: (method: PaymentMethodId) => void;
  onDetailsChange: (details: PaymentDetailsValue) => void;
};

const paymentMethods: PaymentMethod[] = [
  {
    id: "bank-transfer",
    title: "Transfer Bank (Manual)",
    options: ["BCA", "BNI"],
    description: "Konfirmasi manual melalui WhatsApp diperlukan.",
    brands: ["bca", "bni"],
  },
  {
    id: "virtual-account",
    title: "Virtual Account (Otomatis)",
    options: ["BCA", "BNI", "BRI"],
    description: "Konfirmasi instan dan akses langsung aktif.",
    brands: ["bca", "bni", "bri"],
  },
  {
    id: "e-wallet",
    title: "E-Wallet / QRIS",
    options: ["QRIS", "GOPAY", "OVO"],
    description: "Scan dan bayar instan melalui smartphone.",
    brands: ["qris", "gopay", "ovo"],
  },
];

const PaymentMethods = ({
  selectedMethod,
  details,
  onSelect,
  onDetailsChange,
}: PaymentMethodsProps) => (
  <section className="tp-section tp-section--payment" aria-labelledby="payment-method-title">
    <div className="tp-section__heading">
      <span className="tp-section__number">02</span>
      <h2 id="payment-method-title">Metode Pembayaran</h2>
    </div>

    <div className="tp-method-grid">
      {paymentMethods.map((method) => {
        const selected = method.id === selectedMethod;

        return (
          <button
            key={method.id}
            type="button"
            className={`tp-method-card tp-glow-button ${selected ? "is-selected" : ""}`}
            aria-pressed={selected}
            onClick={() => onSelect(method.id)}
          >
            <span className="tp-method-card__topline">
              <span className="tp-method-card__title">{method.title}</span>
              {selected ? <ShieldCheck aria-hidden="true" /> : null}
            </span>

            <span className="tp-method-card__bank-logos" aria-label={method.options.join(", ")}>
              {method.brands.map((brand) => (
                <PaymentBrandLogo key={brand} brand={brand} />
              ))}
            </span>

            <span className="tp-method-card__description">{method.description}</span>
          </button>
        );
      })}
    </div>

    <PaymentMethodDetails
      selectedMethod={selectedMethod}
      value={details}
      onChange={onDetailsChange}
    />
  </section>
);

export default PaymentMethods;
