import type { WebinarData } from "../data/webinars";
import { emitPlatformDataChange } from "./storage/browserStorage";

export const WEBINAR_REGISTRATION_DRAFT_KEY =
  "mahreen-webinar-registration-draft";
export const WEBINAR_REGISTRATION_KEY = "mahreen-webinar-registration";

export type WebinarRegistrationFormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  institution: string;
  profession: string;
  city: string;
};

export type StoredWebinarRegistration = WebinarRegistrationFormData & {
  id: string;
  webinarSlug: string;
  webinarTitle: string;
  webinarCategory: string;
  webinarPrice: number;
  status: "pending-payment" | "confirmed";
  createdAt: string;
};

export const emptyWebinarRegistrationForm: WebinarRegistrationFormData = {
  fullName: "",
  email: "",
  whatsapp: "",
  institution: "",
  profession: "",
  city: "",
};

const isBrowser = () => typeof window !== "undefined";

const getDraftKey = (webinarSlug: string) =>
  `${WEBINAR_REGISTRATION_DRAFT_KEY}:${webinarSlug}`;

const getRegistrationKey = (webinarSlug: string) =>
  `${WEBINAR_REGISTRATION_KEY}:${webinarSlug}`;

const parseStoredForm = (value: string | null): WebinarRegistrationFormData => {
  if (!value) return { ...emptyWebinarRegistrationForm };

  try {
    const parsed = JSON.parse(value) as Partial<WebinarRegistrationFormData>;

    return {
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      whatsapp: typeof parsed.whatsapp === "string" ? parsed.whatsapp : "",
      institution:
        typeof parsed.institution === "string" ? parsed.institution : "",
      profession:
        typeof parsed.profession === "string" ? parsed.profession : "",
      city: typeof parsed.city === "string" ? parsed.city : "",
    };
  } catch {
    return { ...emptyWebinarRegistrationForm };
  }
};

export const readWebinarRegistrationDraft = (webinarSlug: string) => {
  if (!isBrowser()) return { ...emptyWebinarRegistrationForm };

  return parseStoredForm(
    window.localStorage.getItem(getDraftKey(webinarSlug)),
  );
};

export const saveWebinarRegistrationDraft = (
  webinarSlug: string,
  data: WebinarRegistrationFormData,
) => {
  if (!isBrowser()) return;

    try {
      window.localStorage.setItem(getDraftKey(webinarSlug), JSON.stringify(data));
      emitPlatformDataChange();
  } catch {
    // The form remains usable when localStorage is unavailable.
  }
};


const parseStoredRegistration = (
  value: string | null,
): StoredWebinarRegistration | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<StoredWebinarRegistration>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.webinarSlug !== "string" ||
      typeof parsed.webinarTitle !== "string" ||
      typeof parsed.fullName !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }

    return parsed as StoredWebinarRegistration;
  } catch {
    return null;
  }
};

export const readWebinarRegistration = (webinarSlug: string) => {
  if (!isBrowser()) return null;

  return parseStoredRegistration(
    window.localStorage.getItem(getRegistrationKey(webinarSlug)),
  );
};

export const readAllWebinarRegistrations = () => {
  if (!isBrowser()) return [] as StoredWebinarRegistration[];

  const registrations = new Map<string, StoredWebinarRegistration>();
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (
        key !== WEBINAR_REGISTRATION_KEY &&
        !key?.startsWith(`${WEBINAR_REGISTRATION_KEY}:`)
      ) {
        continue;
      }

      const registration = parseStoredRegistration(
        window.localStorage.getItem(key),
      );
      if (registration) registrations.set(registration.id, registration);
    }
  } catch {
    return [];
  }

  return [...registrations.values()].sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  );
};


export const storeWebinarRegistration = (
  registration: StoredWebinarRegistration,
): StoredWebinarRegistration => {
  if (isBrowser()) {
    try {
      const serializedRegistration = JSON.stringify(registration);
      window.localStorage.setItem(
        getRegistrationKey(registration.webinarSlug),
        serializedRegistration,
      );
      window.localStorage.setItem(
        WEBINAR_REGISTRATION_KEY,
        serializedRegistration,
      );
      window.localStorage.removeItem(getDraftKey(registration.webinarSlug));
      emitPlatformDataChange();
    } catch {
      // The flow remains usable when browser storage is unavailable.
    }
  }

  return registration;
};

export const saveWebinarRegistration = (
  webinar: WebinarData,
  data: WebinarRegistrationFormData,
): StoredWebinarRegistration => {
  const registration: StoredWebinarRegistration = {
    ...data,
    id: `WEB-${Date.now()}`,
    webinarSlug: webinar.slug,
    webinarTitle: webinar.title,
    webinarCategory: webinar.category,
    webinarPrice: webinar.price,
    status: webinar.isFree ? "confirmed" : "pending-payment",
    createdAt: new Date().toISOString(),
  };

  return storeWebinarRegistration(registration);
};
