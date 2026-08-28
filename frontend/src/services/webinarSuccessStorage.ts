import type { WebinarData } from "../data/webinars";
import type { StoredWebinarPayment } from "./webinarPaymentStorage";
import type { StoredWebinarRegistration } from "./webinarRegistrationStorage";

export const WEBINAR_SUCCESS_KEY = "mahreen-webinar-success";

export type StoredWebinarSuccess = {
  id: string;
  webinarSlug: string;
  webinarTitle: string;
  webinarCategory: string;
  scheduleDate: string;
  scheduleTime: string;
  participantName: string;
  participantEmail: string;
  participantWhatsapp: string;
  participantInstitution: string;
  registrationId: string;
  registrationNumber: string;
  paymentId: string;
  paymentMethod: StoredWebinarPayment["method"];
  totalPaid: number;
  status: "active";
  confirmedAt: string;
};

const isBrowser = () => typeof window !== "undefined";

const getSuccessKey = (webinarSlug: string) =>
  `${WEBINAR_SUCCESS_KEY}:${webinarSlug}`;

const createRegistrationNumber = (
  registration: StoredWebinarRegistration,
  payment: StoredWebinarPayment,
) => {
  const year = new Date(payment.paidAt).getFullYear().toString().slice(-2);
  const source = `${registration.id}${payment.id}`.replace(/\D/g, "");
  const fallback = Date.now().toString();
  const suffix = (source || fallback).slice(-6).padStart(6, "0");

  return `ML-${year}${suffix}`;
};

const parseStoredSuccess = (
  value: string | null,
): StoredWebinarSuccess | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<StoredWebinarSuccess>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.webinarSlug !== "string" ||
      typeof parsed.registrationNumber !== "string" ||
      typeof parsed.participantName !== "string" ||
      typeof parsed.paymentId !== "string"
    ) {
      return null;
    }

    return parsed as StoredWebinarSuccess;
  } catch {
    return null;
  }
};

export const saveWebinarSuccess = (
  webinar: WebinarData,
  registration: StoredWebinarRegistration,
  payment: StoredWebinarPayment,
): StoredWebinarSuccess => {
  const existing = readWebinarSuccess(webinar.slug);

  if (
    existing &&
    existing.registrationId === registration.id &&
    existing.paymentId === payment.id
  ) {
    return existing;
  }

  const success: StoredWebinarSuccess = {
    id: `SUCCESS-${Date.now()}`,
    webinarSlug: webinar.slug,
    webinarTitle: webinar.title,
    webinarCategory: webinar.category,
    scheduleDate: webinar.scheduleDate,
    scheduleTime: webinar.scheduleTime,
    participantName: registration.fullName,
    participantEmail: registration.email,
    participantWhatsapp: registration.whatsapp,
    participantInstitution: registration.institution,
    registrationId: registration.id,
    registrationNumber: createRegistrationNumber(registration, payment),
    paymentId: payment.id,
    paymentMethod: payment.method,
    totalPaid: webinar.isFree ? 0 : webinar.price,
    status: "active",
    confirmedAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    try {
      const serializedSuccess = JSON.stringify(success);

      window.localStorage.setItem(getSuccessKey(webinar.slug), serializedSuccess);
      window.localStorage.setItem(WEBINAR_SUCCESS_KEY, serializedSuccess);
      window.localStorage.setItem(
        `mahreen-webinar-access:${webinar.slug}`,
        JSON.stringify({
          registrationNumber: success.registrationNumber,
          status: success.status,
          confirmedAt: success.confirmedAt,
        }),
      );
    } catch {
      // The success page remains usable when localStorage is unavailable.
    }
  }

  return success;
};

export const readWebinarSuccess = (webinarSlug: string) => {
  if (!isBrowser()) return null;

  return parseStoredSuccess(
    window.localStorage.getItem(getSuccessKey(webinarSlug)),
  );
};
