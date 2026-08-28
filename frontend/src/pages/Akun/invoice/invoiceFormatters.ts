import type { ClientInvoiceStatus } from "./types";

export const formatInvoiceCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatInvoiceDate = (value: string) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    : "Tanggal tidak tersedia";
};

export const invoiceStatusLabel: Record<ClientInvoiceStatus, string> = {
  paid: "LUNAS",
  pending: "MENUNGGU",
  overdue: "JATUH TEMPO",
};
