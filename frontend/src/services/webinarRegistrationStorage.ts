import type { WebinarData } from "../data/webinars";
import { apiClient } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

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
    window.sessionStorage.getItem(getDraftKey(webinarSlug)),
  );
};

export const saveWebinarRegistrationDraft = (
  webinarSlug: string,
  data: WebinarRegistrationFormData,
) => {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(getDraftKey(webinarSlug), JSON.stringify(data));
  } catch {
    // The form remains usable when sessionStorage is unavailable.
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
    window.sessionStorage.getItem(getRegistrationKey(webinarSlug)),
  );
};

export const readAllWebinarRegistrations = (): StoredWebinarRegistration[] => {
  if (!isBrowser()) return [];

  const registrations = new Map<string, StoredWebinarRegistration>();
  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (
        key !== WEBINAR_REGISTRATION_KEY &&
        !key?.startsWith(`${WEBINAR_REGISTRATION_KEY}:`)
      ) {
        continue;
      }

      const registration = parseStoredRegistration(
        window.sessionStorage.getItem(key),
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

export const storeWebinarRegistration = async (
  registration: StoredWebinarRegistration,
): Promise<StoredWebinarRegistration> => {
  if (isBrowser()) {
    try {
      const serialized = JSON.stringify(registration);
      window.sessionStorage.setItem(
        getRegistrationKey(registration.webinarSlug),
        serialized,
      );
      window.sessionStorage.setItem(WEBINAR_REGISTRATION_KEY, serialized);
      window.sessionStorage.removeItem(getDraftKey(registration.webinarSlug));
    } catch {
      // The flow remains usable when browser storage is unavailable.
    }
  }

  return registration;
};

export const saveWebinarRegistration = async (
  webinar: WebinarData,
  data: WebinarRegistrationFormData,
): Promise<StoredWebinarRegistration> => {
  const apiResult = await apiClient<{
    id: string;
    webinarSlug: string;
    webinarTitle: string;
    webinarCategory: string;
    webinarPrice: number;
    fullName: string;
    email: string;
    whatsapp: string;
    institution: string;
    profession: string;
    city: string;
    status: string;
    createdAt: string;
  }>(API_ENDPOINTS.webinars.register(webinar.slug), {
    method: "POST",
    body: {
      ...data,
      webinarSlug: webinar.slug,
    },
  });

  const registration: StoredWebinarRegistration = {
    id: apiResult.id,
    webinarSlug: apiResult.webinarSlug,
    webinarTitle: apiResult.webinarTitle,
    webinarCategory: apiResult.webinarCategory,
    webinarPrice: apiResult.webinarPrice,
    fullName: apiResult.fullName,
    email: apiResult.email,
    whatsapp: apiResult.whatsapp,
    institution: apiResult.institution,
    profession: apiResult.profession,
    city: apiResult.city,
    status: apiResult.status as "pending-payment" | "confirmed",
    createdAt: apiResult.createdAt,
  };

  return storeWebinarRegistration(registration);
};
