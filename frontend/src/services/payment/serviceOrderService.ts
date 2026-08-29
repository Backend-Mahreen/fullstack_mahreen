import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { ServicePaymentDraft } from "../../pages/TanyaMahreen/KonfigurasiPaket/Pembayaran/paymentTypes";
import {
  savePaymentDraft,
  storeServicePaymentRecord,
} from "../../pages/TanyaMahreen/KonfigurasiPaket/Pembayaran/paymentStorage";
import { runWithDataSource } from "../serviceMode";

type ServiceOrderApiResult = Partial<ServicePaymentDraft> & {
  transactionId: string;
  status: "pending" | "paid";
};

const confirmThroughApi = async (draft: ServicePaymentDraft) => {
  const result = await apiClient<ServiceOrderApiResult>(API_ENDPOINTS.serviceOrders.create, {
    method: "POST",
    body: draft,
  });

  const nextDraft: ServicePaymentDraft = {
    ...draft,
    ...result,
    transactionId: result.transactionId,
    status: result.status,
    updatedAt: new Date().toISOString(),
  };
  savePaymentDraft(nextDraft);
  await storeServicePaymentRecord(nextDraft);
  return nextDraft;
};

export const serviceOrderService = {
  confirmPayment(draft: ServicePaymentDraft) {
    return runWithDataSource(
      () => confirmThroughApi(draft),
    );
  },
};
