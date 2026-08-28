export type DataSourceMode = "local" | "api" | "auto";
export type DeploymentMode = "demo" | "production";

const readString = (value: string | undefined, fallback: string) => {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
};

const readBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

const readPositiveNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const readCsv = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const allowLocalSimulation =
  import.meta.env.DEV ||
  readBoolean(import.meta.env.VITE_ALLOW_LOCAL_SIMULATION, false);
const forceApiInDevelopment = readBoolean(
  import.meta.env.VITE_FORCE_API_IN_DEV,
  true,
);

const readDataSourceMode = (value: string | undefined): DataSourceMode => {
  if (import.meta.env.DEV && !forceApiInDevelopment) return "local";
  if (value === "api") return "api";
  if (allowLocalSimulation && (value === "local" || value === "auto")) {
    return value;
  }

  return import.meta.env.DEV ? "local" : "api";
};

const apiBaseUrl = readString(import.meta.env.VITE_API_BASE_URL, "/api").replace(/\/$/, "");
const dataSourceMode = readDataSourceMode(import.meta.env.VITE_DATA_SOURCE);
const deploymentMode: DeploymentMode =
  import.meta.env.VITE_DEPLOYMENT_MODE === "demo" && dataSourceMode === "local"
    ? "demo"
    : "production";
const requestedNewsroomMode = import.meta.env.VITE_NEWSROOM_DATA_SOURCE;
const newsroomDataSourceMode: DataSourceMode =
  requestedNewsroomMode === "api" ||
  requestedNewsroomMode === "auto" ||
  (requestedNewsroomMode === "local" && allowLocalSimulation)
    ? requestedNewsroomMode
    : dataSourceMode;

export const env = Object.freeze({
  isDevelopment: import.meta.env.DEV,
  deploymentMode,
  apiBaseUrl,
  dataSourceMode,
  newsroomDataSourceMode,
  allowLocalSimulation,
  forceApiInDevelopment,
  apiTimeoutMs: readPositiveNumber(import.meta.env.VITE_API_TIMEOUT_MS, 15_000),
  useCredentials: readBoolean(import.meta.env.VITE_API_USE_CREDENTIALS, true),
  paymentCheckoutHosts: readCsv(import.meta.env.VITE_PAYMENT_CHECKOUT_HOSTS),
  enableLocalFallback:
    allowLocalSimulation &&
    dataSourceMode === "auto" &&
    readBoolean(import.meta.env.VITE_ENABLE_LOCAL_FALLBACK, false),
  enableTransactionUi: readBoolean(
    import.meta.env.VITE_ENABLE_TRANSACTION_UI,
    dataSourceMode === "local",
  ),
  enableDocumentVerification: readBoolean(
    import.meta.env.VITE_ENABLE_DOCUMENT_VERIFICATION,
    dataSourceMode === "local",
  ),
  enableDynamicContentIndexing: readBoolean(
    import.meta.env.VITE_ENABLE_DYNAMIC_CONTENT_INDEXING,
    false,
  ),
  enableAdminUi: readBoolean(
    import.meta.env.VITE_ENABLE_ADMIN_UI,
    true,
  ),
  enableClientSecurityCenter: readBoolean(
    import.meta.env.VITE_ENABLE_CLIENT_SECURITY_CENTER,
    true,
  ),
  enableClientDocuments: readBoolean(
    import.meta.env.VITE_ENABLE_CLIENT_DOCUMENTS,
    true,
  ),
  enableInternDashboard: readBoolean(
    import.meta.env.VITE_ENABLE_INTERN_DASHBOARD,
    true,
  ),
});

export const isLocalDataSource = () => env.dataSourceMode === "local";
export const isApiDataSource = () => env.dataSourceMode === "api";
export const isAutoDataSource = () => env.dataSourceMode === "auto";
