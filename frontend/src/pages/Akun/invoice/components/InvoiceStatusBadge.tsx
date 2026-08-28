import { invoiceStatusLabel } from "../invoiceFormatters";
import type { ClientInvoiceStatus } from "../types";

const InvoiceStatusBadge = ({ status }: Readonly<{ status: ClientInvoiceStatus }>) => (
  <span className={`invoice-status invoice-status--${status}`}>
    {invoiceStatusLabel[status]}
  </span>
);

export default InvoiceStatusBadge;
