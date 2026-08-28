import type { ClientInvoice } from "../types";
import InvoiceEmptyState from "./InvoiceEmptyState";
import InvoiceRow from "./InvoiceRow";

type InvoiceTableProps = Readonly<{
  invoices: ClientInvoice[];
  payingInvoiceId: string | null;
  onPay: (invoiceId: string) => void;
}>;

const InvoiceTable = ({ invoices, payingInvoiceId, onPay }: InvoiceTableProps) => {
  if (!invoices.length) return <InvoiceEmptyState />;

  return (
    <div className="client-invoices__table-wrap">
      <table className="client-invoices__table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Project</th>
            <th>Tanggal</th>
            <th>Jumlah</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <InvoiceRow
              invoice={invoice}
              isPaying={payingInvoiceId === invoice.id}
              onPay={onPay}
              key={invoice.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
