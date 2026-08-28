import { ReceiptText } from "lucide-react";

const InvoiceEmptyState = () => (
  <div className="client-invoices__empty">
    <ReceiptText aria-hidden="true" />
    <strong>Belum ada invoice</strong>
    <p>Invoice dari transaksi layanan akan muncul otomatis di halaman ini.</p>
  </div>
);

export default InvoiceEmptyState;
