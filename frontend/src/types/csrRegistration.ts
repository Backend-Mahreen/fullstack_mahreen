export type RegistrationStep = 1 | 2 | 3 | 4;

export type CSRRole = "volunteer" | "community-partner";

export type UploadedDocument = {
  name: string;
  size: number;
  type: string;
};

export type CSRRegistrationData = {
  role: CSRRole | "";
  fullName: string;
  focusArea: string;
  email: string;
  whatsapp: string;
  province: string;
  city: string;
  vision: string;
  motivation: string;
  document: UploadedDocument | null;
  acceptedTerms: boolean;
  applicationId: string;
  submittedAt: string;
};

export type FieldErrors = Partial<Record<keyof CSRRegistrationData, string>>;

export type RegistrationChangeHandler = (updates: Partial<CSRRegistrationData>) => void;
