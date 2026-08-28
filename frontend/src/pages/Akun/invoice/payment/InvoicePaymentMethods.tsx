import { CheckCircle2 } from "lucide-react";
import PaymentBrandLogo from "../../../../components/Payment/PaymentBrandLogo";
import type { PaymentBrandId } from "../../../../data/paymentBrands";

const invoicePaymentMethods = [
  { id: "bca" as PaymentBrandId, label: "BCA Virtual Account", detail: "Verifikasi pembayaran otomatis" },
  { id: "mandiri" as PaymentBrandId, label: "Mandiri Virtual Account", detail: "Transfer langsung melalui Bank Mandiri" },
  { id: "bri" as PaymentBrandId, label: "BRI Virtual Account", detail: "Verifikasi BRIVA otomatis" },
] as const;

const InvoicePaymentMethods = ({
  selected,
  onSelect,
}: Readonly<{
  selected: string;
  onSelect: (method: string) => void;
}>) => (
  <section className="invoice-payment-methods">
    <header>
      <span>METODE PEMBAYARAN</span>
      <h2>Pilih metode pembayaran</h2>
      <p>Pembayaran akan diterapkan hanya untuk invoice yang sedang Anda buka.</p>
    </header>
    <div>
      {invoicePaymentMethods.map((method, index) => {
        const active = selected === method.id;
        return (
          <button
            className={"invoice-payment-method" + (active ? " is-selected" : "")}
            style={{ "--invoice-pay-delay": String(120 + index * 70) + "ms" } as React.CSSProperties}
            type="button"
            onClick={() => onSelect(method.id)}
            key={method.id}
          >
            <span className="invoice-payment-method__icon">
              <PaymentBrandLogo brand={method.id} />
            </span>
            <span className="invoice-payment-method__copy">
              <strong>{method.label}</strong>
              <small>{method.detail}</small>
            </span>
            {active ? <CheckCircle2 aria-hidden="true" /> : <i />}
          </button>
        );
      })}
    </div>
  </section>
);

export default InvoicePaymentMethods;
