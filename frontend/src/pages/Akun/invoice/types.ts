export type ClientInvoiceStatus = "paid" | "pending" | "overdue";

export type ClientInvoice = {
  id: string;
  code: string;
  project: string;
  issuedAt: string;
  dueAt: string;
  amount: number;
  status: ClientInvoiceStatus;
  paymentMethod?: string;
  updatedAt: string;
};
