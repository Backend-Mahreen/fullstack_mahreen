import type { CSRRegistrationData, RegistrationStep } from "../types/csrRegistration";

export const STORAGE_KEY = "mahreen-csr-registration-v1";
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const ALLOWED_FILE_EXTENSIONS: readonly string[] = ["pdf", "doc", "docx", "zip"];

export const initialRegistrationData: CSRRegistrationData = {
  role: "",
  fullName: "",
  focusArea: "",
  email: "",
  whatsapp: "",
  province: "",
  city: "",
  vision: "",
  motivation: "",
  document: null,
  acceptedTerms: false,
  applicationId: "",
  submittedAt: "",
};

export const stepMeta = [
  { number: 1, label: "Role" },
  { number: 2, label: "Details" },
  { number: 3, label: "Motivation" },
  { number: 4, label: "Success" },
] as const;

export const routeByStep: Record<RegistrationStep, string> = {
  1: "/mahreen-csr/pendaftaran",
  2: "/mahreen-csr/pendaftaran/detail",
  3: "/mahreen-csr/pendaftaran/motivasi",
  4: "/mahreen-csr/pendaftaran/sukses",
};
