import type { RegistrationDraft } from "../../types/auth";

const readDemoCredential = (value: string | undefined) => value?.trim() ?? "";

export const LOCAL_ADMIN_CREDENTIALS = Object.freeze({
  id: readDemoCredential(import.meta.env.VITE_DEMO_ADMIN_ID),
  email: readDemoCredential(import.meta.env.VITE_DEMO_ADMIN_EMAIL).toLowerCase(),
  password: readDemoCredential(import.meta.env.VITE_DEMO_ADMIN_PASSWORD),
});

export const LOCAL_DEMO_CREDENTIALS = Object.freeze({
  email: readDemoCredential(import.meta.env.VITE_DEMO_CLIENT_EMAIL).toLowerCase(),
  password: readDemoCredential(import.meta.env.VITE_DEMO_CLIENT_PASSWORD),
});

export const LOCAL_INTERN_CREDENTIALS = Object.freeze({
  email: readDemoCredential(import.meta.env.VITE_DEMO_INTERN_EMAIL).toLowerCase(),
  password: readDemoCredential(import.meta.env.VITE_DEMO_INTERN_PASSWORD),
});

export const AUTH_STORAGE_KEYS = Object.freeze({
  registrationDraft: "mahreen:auth:registration-draft",
  accounts: "mahreen:auth:accounts",
  session: "mahreen:auth:session",
  user: "mahreen:auth:user",
});

export const AUTH_STATE_EVENT = "mahreen:auth-state-change";

export const emptyRegistrationDraft: RegistrationDraft = {
  accountType: "",
  profilePhoto: "",
  fullName: "",
  nickname: "",
  email: "",
  whatsapp: "",
  password: "",
  birthDate: "",
  gender: "",
  jobTitle: "",
  institution: "",
  linkedin: "",
  portfolio: "",
  instagram: "",
  interests: [],
  newsletter: false,
};
