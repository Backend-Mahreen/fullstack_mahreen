import type { ClientInvoice } from "../types";
import {
  formatInvoiceCurrency,
  formatInvoiceDate,
} from "../invoiceFormatters";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

type InvoiceRowProps = Readonly<{
  invoice: ClientInvoice;
  isPaying: boolean;
  onPay: (invoiceId: string) => void;
}>;

const InvoiceRow = ({ invoice, isPaying, onPay }: InvoiceRowProps) => {
  const canPay = invoice.status !== "paid";

  return (
    <tr>
      <td data-label="Invoice ID"><code>{invoice.code}</code></td>
      <td data-label="Project"><strong>{invoice.project}</strong></td>
      <td data-label="Tanggal">
        <span>{formatInvoiceDate(invoice.issuedAt)}</span>
        <small>Jatuh tempo {formatInvoiceDate(invoice.dueAt)}</small>
      </td>
      <td data-label="Jumlah" className="client-invoices__amount">
        {formatInvoiceCurrency(invoice.amount)}
      </td>
      <td data-label="Status">
        <div className="client-invoices__status-cell">
          <InvoiceStatusBadge status={invoice.status} />
          {canPay && (
            <button
              id={`pay-invoice-${invoice.id}`}
              type="button"
              disabled={isPaying}
              onClick={() => onPay(invoice.id)}
            >
              {isPaying ? "Memproses..." : "Bayar"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default InvoiceRow;
