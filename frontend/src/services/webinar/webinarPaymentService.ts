import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { StoredWebinarPayment } from "../webinarPaymentStorage";
import { storeWebinarPayment } from "../webinarPaymentStorage";
import type { StoredWebinarRegistration } from "../webinarRegistrationStorage";
import { runWithDataSource } from "../serviceMode";

const confirmThroughApi = async (
  payment: StoredWebinarPayment,
  registration: StoredWebinarRegistration,
) => {
  const result = await apiClient<StoredWebinarPayment>(
    API_ENDPOINTS.webinars.payment(payment.webinarSlug),
    {
      method: "POST",
      body: {
        paymentId: payment.id,
        registrationId: registration.id,
        method: payment.method,
        bank: payment.bank,
        amount: payment.breakdown.total,
      },
    },
  );
  return storeWebinarPayment(result);
};

export const webinarPaymentService = {
  confirm(
    payment: StoredWebinarPayment,
    registration: StoredWebinarRegistration,
  ) {
    return runWithDataSource(
      () => confirmThroughApi(payment, registration),
    );
  },
};
