import { LockKeyhole, ReceiptText } from "lucide-react";
import type { ClientInvoice } from "../types";
import { formatInvoiceCurrency, formatInvoiceDate } from "../invoiceFormatters";

const InvoicePaymentSummary = ({
  invoice,
  isSubmitting,
  onConfirm,
}: Readonly<{
  invoice: ClientInvoice;
  isSubmitting: boolean;
  onConfirm: () => void;
}>) => (
  <aside className="invoice-payment-summary">
    <div className="invoice-payment-summary__heading">
      <ReceiptText aria-hidden="true" />
      <div><span>RINGKASAN INVOICE</span><strong>{invoice.code}</strong></div>
    </div>
    <div className="invoice-payment-summary__product">
      <span>Produk / Layanan</span>
      <strong>{invoice.project}</strong>
      <small>Diterbitkan {formatInvoiceDate(invoice.issuedAt)}</small>
    </div>
    <dl>
      <div><dt>Nilai invoice</dt><dd>{formatInvoiceCurrency(invoice.amount)}</dd></div>
      <div><dt>Biaya admin</dt><dd>Rp0</dd></div>
      <div className="invoice-payment-summary__total"><dt>Total pembayaran</dt><dd>{formatInvoiceCurrency(invoice.amount)}</dd></div>
    </dl>
    <button type="button" onClick={onConfirm} disabled={isSubmitting}>
      {isSubmitting ? "Memproses Pembayaran..." : "Bayar Invoice Ini"}
    </button>
    <p><LockKeyhole aria-hidden="true" />Transaksi sementara diproses lewat simulasi local dan siap dipindahkan ke endpoint backend.</p>
  </aside>
);

export default InvoicePaymentSummary;

