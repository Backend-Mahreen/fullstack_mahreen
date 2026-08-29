import type { WebinarData } from "../data/webinars";
import type { StoredWebinarRegistration } from "./webinarRegistrationStorage";
import { apiClient } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export const WEBINAR_PAYMENT_METHOD_KEY = "mahreen-webinar-payment-method";
export const WEBINAR_PAYMENT_KEY = "mahreen-webinar-payment";
export const WEBINAR_BANK_KEY = "mahreen-webinar-bank";

export type WebinarPaymentMethod =
  | "qris"
  | "bank-transfer"
  | "e-wallet"
  | "free-registration";

export type WebinarBank = "bca" | "mandiri" | "bni" | "bri";

export type WebinarPaymentBreakdown = {
  registrationFee: number;
  platformFee: number;
  discount: number;
  total: number;
};

export type StoredWebinarPayment = {
  id: string;
  registrationId: string | null;
  webinarSlug: string;
  webinarTitle: string;
  participantName: string | null;
  participantEmail: string | null;
  method: WebinarPaymentMethod;
  bank: WebinarBank | null;
  breakdown: WebinarPaymentBreakdown;
  status: "simulated-paid";
  paidAt: string;
};

const isBrowser = () => typeof window !== "undefined";

const getMethodKey = (webinarSlug: string) =>
  `${WEBINAR_PAYMENT_METHOD_KEY}:${webinarSlug}`;

const getPaymentKey = (webinarSlug: string) =>
  `${WEBINAR_PAYMENT_KEY}:${webinarSlug}`;

const getBankKey = (webinarSlug: string) =>
  `${WEBINAR_BANK_KEY}:${webinarSlug}`;

export const calculateWebinarPayment = (
  webinar: WebinarData,
): WebinarPaymentBreakdown => {
  if (webinar.isFree) {
    return {
      registrationFee: 0,
      platformFee: 0,
      discount: 0,
      total: 0,
    };
  }

  return {
    registrationFee: webinar.price,
    platformFee: 0,
    discount: 0,
    total: webinar.price,
  };
};

export const readWebinarPaymentMethod = (
  webinarSlug: string,
): WebinarPaymentMethod => {
  if (!isBrowser()) return "qris";

  const storedMethod = window.sessionStorage.getItem(getMethodKey(webinarSlug));

  if (storedMethod === "qris" || storedMethod === "bank-transfer") {
    return storedMethod;
  }

  return "qris";
};

export const readWebinarBank = (webinarSlug: string): WebinarBank => {
  if (!isBrowser()) return "bca";

  const storedBank = window.sessionStorage.getItem(getBankKey(webinarSlug));

  if (
    storedBank === "bca" ||
    storedBank === "mandiri" ||
    storedBank === "bni" ||
    storedBank === "bri"
  ) {
    return storedBank;
  }

  return "bca";
};

export const saveWebinarBank = (
  webinarSlug: string,
  bank: WebinarBank,
) => {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(getBankKey(webinarSlug), bank);
  } catch {
    // The interface remains usable when sessionStorage is unavailable.
  }
};

export const saveWebinarPaymentMethod = (
  webinarSlug: string,
  method: WebinarPaymentMethod,
) => {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(getMethodKey(webinarSlug), method);
  } catch {
    // The interface remains usable when sessionStorage is unavailable.
  }
};

export const storeWebinarPayment = async (
  payment: StoredWebinarPayment,
): Promise<StoredWebinarPayment> => {
  if (isBrowser()) {
    try {
      const serializedPayment = JSON.stringify(payment);
      window.sessionStorage.setItem(
        getPaymentKey(payment.webinarSlug),
        serializedPayment,
      );
      window.sessionStorage.setItem(WEBINAR_PAYMENT_KEY, serializedPayment);
    } catch {
      // The flow remains usable when browser storage is unavailable.
    }
  }

  return payment;
};

export const saveWebinarPayment = async (
  webinar: WebinarData,
  method: WebinarPaymentMethod,
  registration: StoredWebinarRegistration | null,
  bank: WebinarBank | null = null,
): Promise<StoredWebinarPayment> => {
  const apiResult = await apiClient<{
    id: string;
    registrationId: string | null;
    webinarSlug: string;
    webinarTitle: string;
    participantName: string | null;
    participantEmail: string | null;
    method: string;
    bank: string | null;
    breakdown: WebinarPaymentBreakdown;
    status: string;
    paidAt: string;
  }>(API_ENDPOINTS.webinars.payment(webinar.slug), {
    method: "POST",
    body: {
      registrationId: registration?.id ?? null,
      method,
      bank: method === "bank-transfer" ? bank : null,
    },
  });

  const payment: StoredWebinarPayment = {
    id: apiResult.id,
    registrationId: apiResult.registrationId,
    webinarSlug: apiResult.webinarSlug,
    webinarTitle: apiResult.webinarTitle,
    participantName: apiResult.participantName,
    participantEmail: apiResult.participantEmail,
    method: apiResult.method as WebinarPaymentMethod,
    bank: apiResult.bank as WebinarBank | null,
    breakdown: apiResult.breakdown,
    status: "simulated-paid",
    paidAt: apiResult.paidAt,
  };

  return storeWebinarPayment(payment);
};

const parseStoredPayment = (
  value: string | null,
): StoredWebinarPayment | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<StoredWebinarPayment>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.webinarSlug !== "string" ||
      typeof parsed.webinarTitle !== "string" ||
      typeof parsed.method !== "string" ||
      typeof parsed.paidAt !== "string" ||
      !parsed.breakdown
    ) {
      return null;
    }

    return parsed as StoredWebinarPayment;
  } catch {
    return null;
  }
};

export const readWebinarPayment = (webinarSlug: string) => {
  if (!isBrowser()) return null;

  return parseStoredPayment(
    window.sessionStorage.getItem(getPaymentKey(webinarSlug)),
  );
};

export const getWebinarBankLabel = (bank: WebinarBank | null) => {
  if (bank === "mandiri") return "Bank Mandiri";
  if (bank === "bni") return "BNI";
  if (bank === "bri") return "BRI";
  return "BCA";
};

export const getWebinarPaymentMethodLabel = (
  method: WebinarPaymentMethod,
) => {
  if (method === "bank-transfer") return "Bank Transfer";
  if (method === "e-wallet") return "E-Wallet Direct";
  if (method === "free-registration") return "Free Registration";
  return "QRIS";
};
