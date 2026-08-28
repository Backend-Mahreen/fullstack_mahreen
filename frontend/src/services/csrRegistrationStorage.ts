import { initialRegistrationData, STORAGE_KEY } from "../data/csrRegistration";
import type { CSRRegistrationData } from "../types/csrRegistration";

export const readCSRRegistrationData = (): CSRRegistrationData => {
  if (typeof window === "undefined") return initialRegistrationData;

  try {
    const savedData = window.sessionStorage.getItem(STORAGE_KEY);
    if (!savedData) return initialRegistrationData;

    const parsedData = JSON.parse(savedData) as Partial<CSRRegistrationData>;
    return { ...initialRegistrationData, ...parsedData };
  } catch {
    return initialRegistrationData;
  }
};

export const saveCSRRegistrationData = (data: CSRRegistrationData) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
