export type AdminModuleKey =
  | "dashboard"
  | "transactions"
  | "users"
  | "tanya-mahreen"
  | "peduli-mahreen"
  | "mahreen-csr"
  | "mahreen-studio"
  | "newsroom"
  | "internship"
  | "verification"
  | "analytics"
  | "portfolio"
  | "settings"
  | "reports"
  | "clients"
  | "engagement";

export type AdminModuleMeta = Readonly<{
  key: AdminModuleKey;
  label: string;
  eyebrow: string;
  description: string;
}>;

export type AdminMetricIcon = "revenue" | "users" | "projects" | "orders";

export type AdminMetric = Readonly<{
  label: string;
  value: string;
  note: string;
  trend: string;
  icon: AdminMetricIcon;
  progress?: number;
}>;

export type AdminTransactionStatus = "Paid" | "Pending" | "Review";

export type AdminTransaction = Readonly<{
  invoice: string;
  client: string;
  service: string;
  amount: string;
  status: AdminTransactionStatus;
  date: string;
}>;

export type AdminActivity = Readonly<{
  actor: string;
  action: string;
  detail: string;
  time: string;
}>;

export type AdminQuickAction = Readonly<{
  label: string;
  module: Exclude<AdminModuleKey, "dashboard">;
  icon: "article" | "user" | "product" | "project" | "portfolio" | "certificate" | "qr";
}>; 
