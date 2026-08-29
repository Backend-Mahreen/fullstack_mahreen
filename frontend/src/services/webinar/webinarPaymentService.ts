import type { StoredWebinarPayment } from "../webinarPaymentStorage";
import { runWithDataSource } from "../serviceMode";

export const webinarPaymentService = {
  confirm(
    payment: StoredWebinarPayment,
    _registration: unknown,
  ) {
    return runWithDataSource(
      () => Promise.resolve(payment),
    );
  },
};
