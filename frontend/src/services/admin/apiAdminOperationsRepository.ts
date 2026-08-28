import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  CommandCenterSnapshot,
  PortfolioRecord,
  VerificationRequest,
  VerificationSnapshot,
  AdminOperationsRepository,
} from "./adminOperationsRepository";

const emptyCommandCenter: CommandCenterSnapshot = {
  metrics: { totalRevenue: 0, averageDailyRevenue: 0, projectedMonthEnd: 0, profitMargin: 0 },
  actualRevenue: [], forecastRevenue: [], divisionShare: [], transactions: [],
};

const emptyVerification: VerificationSnapshot = {
  metrics: { totalVerifications: 0, auditQueue: 0, identityMatchRate: 0, securityStatus: "Normal" },
  requests: [], breakdown: [], logs: [], networkHealth: 100,
};

const CHANGE_EVENT = "mahreen:admin-operations-change";
let cachedCommand: CommandCenterSnapshot = emptyCommandCenter;
let cachedVerification: VerificationSnapshot = emptyVerification;
let cachedPortfolios: PortfolioRecord[] = [];
let fetchPromise: Promise<void> | null = null;

const mapApiPortfolio = (p: Record<string, unknown>): PortfolioRecord => {
  const services = Array.isArray(p.services) ? (p.services as unknown[]).map(String) : [];
  return {
    id: String(p.id ?? ""),
    projectName: String(p.title ?? ""),
    category: String(p.category ?? ""),
    clientName: String(p.client_name ?? ""),
    projectDate: String(p.year ?? ""),
    description: String(p.description ?? ""),
    technologies: services,
    visibility: p.status === "published" ? "Public" : "Private",
    userImpact: "",
    efficiencyGain: "",
    revenueGrowth: "",
    heroImage: p.cover_image ? String(p.cover_image) : undefined,
    status: p.status === "published" ? "Published" : "Draft",
    createdAt: String(p.created_at ?? new Date().toISOString()),
  };
};

const fetchAll = async () => {
  const [cmd, ver, portfolios] = await Promise.allSettled([
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.commandCenter),
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.verificationOverview),
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.studioPortfolios),
  ]);

  if (cmd.status === "fulfilled") {
    const d = cmd.value;
    const m = (d.metrics ?? {}) as Record<string, unknown>;
    cachedCommand = {
      metrics: { totalRevenue: Number(m.totalRevenue ?? 0), averageDailyRevenue: Number(m.averageDailyRevenue ?? 0), projectedMonthEnd: Number(m.projectedMonthEnd ?? 0), profitMargin: Number(m.profitMargin ?? 0) },
      actualRevenue: Array.isArray(d.actualRevenue) ? d.actualRevenue.map(Number) : [],
      forecastRevenue: Array.isArray(d.forecastRevenue) ? d.forecastRevenue.map(Number) : [],
      divisionShare: Array.isArray(d.divisionShare) ? d.divisionShare.map((x: Record<string, unknown>) => ({ label: String(x.label ?? ""), subtitle: String(x.subtitle ?? ""), value: Number(x.value ?? 0) })) : [],
      transactions: Array.isArray(d.transactions) ? d.transactions.map((t: Record<string, unknown>) => ({ id: String(t.id ?? ""), date: String(t.date ?? ""), division: String(t.division ?? "Consultancy") as CommandCenterSnapshot["transactions"][number]["division"], client: String(t.client ?? ""), amount: Number(t.amount ?? 0), method: String(t.method ?? ""), status: String(t.status ?? "Pending") as "Settled" | "Pending" })) : [],
    };
  }

  if (ver.status === "fulfilled") {
    const d = ver.value;
    const m = (d.metrics ?? {}) as Record<string, unknown>;
    cachedVerification = {
      metrics: { totalVerifications: Number(m.totalVerifications ?? 0), auditQueue: Number(m.auditQueue ?? 0), identityMatchRate: Number(m.identityMatchRate ?? 0), securityStatus: String(m.securityStatus ?? "Normal") },
      requests: Array.isArray(d.requests) ? d.requests.map((r: Record<string, unknown>): VerificationRequest => ({ id: String(r.id ?? ""), name: String(r.name ?? ""), initials: String(r.initials ?? ""), type: (r.type as VerificationRequest["type"]) ?? "Identity", date: String(r.date ?? ""), priority: (r.priority as VerificationRequest["priority"]) ?? "Normal", status: (r.status as VerificationRequest["status"]) ?? "Pending", ownerEmail: r.ownerEmail != null ? String(r.ownerEmail) : undefined })) : [],
      breakdown: Array.isArray(d.breakdown) ? d.breakdown.map((b: Record<string, unknown>) => ({ label: String(b.label ?? ""), value: Number(b.value ?? 0) })) : [],
      logs: Array.isArray(d.logs) ? d.logs.map((l: Record<string, unknown>) => ({ id: String(l.id ?? ""), title: String(l.title ?? ""), detail: String(l.detail ?? ""), time: String(l.time ?? ""), tone: l.tone as "danger" | undefined })) : [],
      networkHealth: Number(d.networkHealth ?? 100),
    };
  }

  if (portfolios.status === "fulfilled") {
    const d = portfolios.value;
    const items = Array.isArray(d.items) ? d.items : Array.isArray(d) ? d : [];
    cachedPortfolios = (items as Record<string, unknown>[]).map(mapApiPortfolio);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
};

const ensureFetched = () => {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchAll().finally(() => { fetchPromise = null; });
  return fetchPromise;
};

if (typeof window !== "undefined") {
  ensureFetched();
}

// Peta status verifikasi UI -> aksi backend sertifikat.
const applyVerificationStatus = (id: string, status: VerificationRequest["status"]) => {
  if (status === "Pending") {
    return apiClient(API_ENDPOINTS.admin.verificationCertificateRevoke(id), { method: "PATCH" });
  }
  const certStatus = status === "Verified" ? "issued" : "draft";
  return apiClient(API_ENDPOINTS.admin.verificationCertificate(id), {
    method: "PUT",
    body: { status: certStatus },
  });
};

export const apiAdminOperationsRepository: AdminOperationsRepository = {
  getCommandCenterSnapshot() { return cachedCommand; },
  getVerificationSnapshot() { return cachedVerification; },
  updateVerificationStatus(id, status) {
    // Perbarui cache secara optimistis dengan snapshot BARU agar React
    // mendeteksi perubahan (mengembalikan referensi lama membuat setState
    // di-skip sehingga UI tidak ter-update). Persistensi ke backend
    // dilakukan best-effort.
    cachedVerification = {
      ...cachedVerification,
      requests: cachedVerification.requests.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    };

    void applyVerificationStatus(id, status)
      .then(() => ensureFetched())
      .catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }

    return cachedVerification;
  },
  getPortfolios() { return cachedPortfolios; },
  savePortfolio(input) {
    const optimistic: PortfolioRecord = {
      ...input,
      id: `portfolio-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    cachedPortfolios = [optimistic, ...cachedPortfolios];

    void apiClient(API_ENDPOINTS.admin.studioPortfolios, {
      method: "POST",
      body: {
        title: input.projectName,
        category: input.category,
        clientName: input.clientName,
        description: input.description,
        coverImage: input.heroImage ?? "",
        services: input.technologies,
        year: input.projectDate ? input.projectDate.slice(0, 4) : String(new Date().getFullYear()),
        status: input.status === "Published" ? "published" : "draft",
      },
    })
      .then(() => ensureFetched())
      .catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }

    return optimistic;
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => { window.removeEventListener(CHANGE_EVENT, handler); };
  },
};
