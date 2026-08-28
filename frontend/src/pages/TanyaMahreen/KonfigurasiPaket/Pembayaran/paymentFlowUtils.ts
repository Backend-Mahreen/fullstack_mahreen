import { getMethodLabel } from "./paymentData";
import type { ServicePaymentDraft } from "./paymentTypes";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const getDraftMethodLabel = (draft: ServicePaymentDraft) =>
  getMethodLabel(draft.selectedMethod, draft.paymentDetails);
