export type AccountType = "individual" | "company" | "community";
export type AccountRole = "client" | "intern" | "admin" | "superadmin";

export type RegistrationDraft = {
  accountType: AccountType | "";
  profilePhoto: string;
  fullName: string;
  nickname: string;
  email: string;
  whatsapp: string;
  password: string;
  birthDate: string;
  gender: string;
  jobTitle: string;
  institution: string;
  linkedin: string;
  portfolio: string;
  instagram: string;
  interests: string[];
  newsletter: boolean;
};

export type StoredAccount = Omit<RegistrationDraft, "accountType"> & {
  accountType: AccountType;
  role: AccountRole;
  id: string;
  createdAt: string;
  country?: string;
  province?: string;
  city?: string;
  address?: string;
};

export type AuthUser = Omit<StoredAccount, "password"> & {
  permissions?: string[];
};

export type AuthSession = {
  accountId: string;
  email: string;
  fullName: string;
  accountType: AccountType;
  role: AccountRole;
  loggedInAt: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
  remember: boolean;
};

export type AuthResult = {
  user: AuthUser;
  session: AuthSession;
};
