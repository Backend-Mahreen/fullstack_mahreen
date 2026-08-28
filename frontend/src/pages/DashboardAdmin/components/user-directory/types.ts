export type DirectoryUserRole = string;

export type DirectoryUserStatus = "Active" | "Pending" | "Suspended";

export type DirectoryDivision =
  | "Consultancy"
  | "Studio"
  | "Volunteer"
  | "CSR"
  | "Internship";

export type DirectoryRoleOption = Readonly<{
  id: string;
  slug: string;
  name: string;
  permissionCount: number;
}>;

export type DirectoryUser = Readonly<{
  id: string;
  name: string;
  email: string;
  division: DirectoryDivision;
  role: DirectoryUserRole;
  status: DirectoryUserStatus;
  avatar?: string;
  createdAt: string;
}>;

export type DirectoryAuditEntry = Readonly<{
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}>;

export type NewDirectoryUser = Readonly<
  Pick<DirectoryUser, "name" | "email" | "division" | "role" | "status">
> & Readonly<{ password: string }>;
