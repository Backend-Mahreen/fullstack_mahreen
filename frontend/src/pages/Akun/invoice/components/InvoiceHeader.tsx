import { CreditCard } from "lucide-react";

type InvoiceHeaderProps = Readonly<{
  payableCount: number;
  onPayNext: () => void;
}>;

const InvoiceHeader = ({ payableCount, onPayNext }: InvoiceHeaderProps) => (
  <header className="client-invoices__header">
    <div>
      <span>CLIENT BILLING</span>
      <h1>Daftar Invoice</h1>
      <p>Riwayat tagihan layanan dan pembayaran akun Anda.</p>
    </div>
    <button type="button" onClick={onPayNext} disabled={payableCount === 0}>
      <CreditCard aria-hidden="true" />
      {payableCount ? `Bayar Invoice (${payableCount})` : "Semua Lunas"}
    </button>
  </header>
);

export default InvoiceHeader;
