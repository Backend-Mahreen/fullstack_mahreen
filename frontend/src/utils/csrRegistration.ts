import { navigateToRoute } from "./hashNavigation";
import { routeByStep } from "../data/csrRegistration";
import type { CSRRegistrationData, RegistrationStep } from "../types/csrRegistration";

export const navigateToStep = (step: RegistrationStep) => {
  navigateToRoute(routeByStep[step]);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const countWords = (value: string) => {
  const cleanValue = value.trim();
  return cleanValue ? cleanValue.split(/\s+/).length : 0;
};

export const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop();
  return extension?.toLowerCase() ?? "";
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const generateApplicationId = () => {
  const dateCode = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomCode = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CSR-${dateCode}-${randomCode}`;
};

export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const hasCompleteRegistrationDetails = (data: CSRRegistrationData) =>
  Boolean(
    data.fullName.trim() &&
      data.focusArea &&
      isEmailValid(data.email.trim()) &&
      data.whatsapp.replace(/\D/g, "").length >= 9 &&
      data.province.trim() &&
      data.city.trim(),
  );
