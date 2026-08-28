import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  ServiceDefinition,
  ServiceManagementSnapshot,
  ServiceOperation,
  ServiceRequest,
  ServiceManagementRepository,
} from "./serviceManagementRepository";

const emptySnapshot: ServiceManagementSnapshot = {
  services: [], requests: [], operations: [], meetings: [], projectManagers: [],
  latestAssignmentDraft: null,
  metrics: { activeServices: 0, consultations: 0, highPriority: 0, activeProjects: 0, revenueMtd: 0 },
};

const CHANGE_EVENT = "mahreen:service-management-change";
let cachedSnapshot: ServiceManagementSnapshot = emptySnapshot;
let fetchPromise: Promise<void> | null = null;

const STATUS_MAP: Record<string, ServiceRequest["status"]> = {
  pending: "Pending",
  scheduled: "Scheduled",
  completed: "Reviewed",
  cancelled: "Cancelled",
  reviewed: "Reviewed",
  converted: "Converted",
  archived: "Archived",
};

const mapStatus = (raw: unknown): ServiceRequest["status"] =>
  STATUS_MAP[String(raw ?? "").toLowerCase()] ?? "Pending";

const PRIORITY_MAP: Record<string, ServiceRequest["priority"]> = {
  high: "High",
  urgent: "High",
  normal: "Normal",
  standard: "Normal",
};

const fetchSnapshot = async () => {
  try {
    const [statsData, consultationsData, ordersData, packagesData] = await Promise.allSettled([
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.tanyaMahreenStats),
      apiClient<Record<string, unknown>>(`${API_ENDPOINTS.admin.tanyaMahreen}/consultations`),
      apiClient<Record<string, unknown>>(`${API_ENDPOINTS.admin.tanyaMahreen}/orders`),
      apiClient<Record<string, unknown>>(`${API_ENDPOINTS.admin.tanyaMahreen}/packages`),
    ]);

    const stats = statsData.status === "fulfilled" ? statsData.value : {} as Record<string, unknown>;
    const transactionStats = (stats.transactions ?? {}) as Record<string, unknown>;

    const consultations = consultationsData.status === "fulfilled" && Array.isArray(consultationsData.value.items)
      ? consultationsData.value.items.map((r: Record<string, unknown>): ServiceRequest => ({
          id: String(r.id ?? ""),
          clientName: String(r.full_name ?? r.fullName ?? ""),
          email: String(r.email ?? ""),
          company: String(r.institution ?? r.company ?? ""),
          serviceRequested: String(r.service_interest ?? r.serviceInterest ?? "Business Consultation"),
          serviceCategory: String(r.service_category ?? r.service_interest ?? ""),
          date: String(r.created_at ?? r.date ?? ""),
          status: mapStatus(r.status),
          assignedPm: String(r.assigned_pm ?? r.handled_by ?? r.assignedPm ?? ""),
          budgetLabel: String(r.budget_label ?? r.budgetLabel ?? "Belum ditentukan"),
          priority: PRIORITY_MAP[String(r.priority ?? "").toLowerCase()] ?? "Normal",
        }))
      : [];

    const orders = ordersData.status === "fulfilled" && Array.isArray(ordersData.value.items)
      ? ordersData.value.items.map((o: Record<string, unknown>): ServiceOperation => ({
          id: String(o.id ?? ""),
          title: String(o.tier ?? o.service_key ?? o.title ?? "Pesanan Layanan"),
          stakeholder: String(o.client_name ?? o.stakeholder ?? ""),
          category: String(o.service_key ?? o.category ?? "Consulting"),
          lifecycleStatus: String(o.status ?? o.lifecycleStatus ?? ""),
          budget: Number(o.total_price ?? o.budget ?? 0),
          revenue: Number(o.total_price ?? o.revenue ?? 0),
          progress: o.status === "completed" ? 100 : o.status === "in_progress" ? 50 : o.status === "pending" ? 10 : 0,
          href: "#",
          updatedAt: String(o.updated_at ?? o.created_at ?? o.updatedAt ?? new Date().toISOString()),
        }))
      : [];

    const packages = packagesData.status === "fulfilled" && Array.isArray(packagesData.value.items)
      ? packagesData.value.items.map((p: Record<string, unknown>): ServiceDefinition => ({
          id: String(p.id ?? ""),
          name: String(p.name ?? ""),
          category: String(p.service_key ?? p.category ?? "Consulting"),
          price: Number(p.price ?? 0),
          status: (p.status === "archived" ? "Archived" : p.status === "draft" ? "Draft" : "Active") as ServiceDefinition["status"],
          description: p.description != null ? String(p.description) : undefined,
          features: Array.isArray(p.features) ? p.features.map(String) : undefined,
          thumbnail: p.thumbnail != null ? String(p.thumbnail) : undefined,
          gallery: Array.isArray(p.gallery) ? p.gallery.map(String) : undefined,
          seoTitle: p.seo_title != null ? String(p.seo_title) : undefined,
          metaDescription: p.meta_description != null ? String(p.meta_description) : undefined,
          visibility: (p.visibility === "Admin Only" ? "Admin Only" : "Public") as ServiceDefinition["visibility"],
          source: "admin" as ServiceDefinition["source"],
          createdAt: String(p.created_at ?? new Date().toISOString()),
          updatedAt: String(p.updated_at ?? p.created_at ?? new Date().toISOString()),
        }))
      : [];

    cachedSnapshot = {
      services: packages,
      requests: consultations,
      operations: orders,
      meetings: [],
      projectManagers: [],
      latestAssignmentDraft: null,
      metrics: {
        activeServices: packages.filter((s) => s.status === "Active").length,
        consultations: consultations.length,
        highPriority: consultations.filter((c) => c.priority === "High").length,
        activeProjects: orders.filter((o) => !/completed|archived|cancelled/i.test(o.lifecycleStatus)).length,
        revenueMtd: Number(transactionStats.paidRevenue ?? 0),
      },
    };
  } catch {
    // keep cached
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
};

const ensureFetched = () => {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchSnapshot().finally(() => { fetchPromise = null; });
  return fetchPromise;
};

const notify = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
};

const patchSnapshot = (updater: (snapshot: ServiceManagementSnapshot) => ServiceManagementSnapshot) => {
  const next = updater(cachedSnapshot);
  cachedSnapshot = next;
  notify();
  return cachedSnapshot;
};

if (typeof window !== "undefined") {
  ensureFetched();
}

export const apiServiceManagementRepository: ServiceManagementRepository = {
  getSnapshot() { return cachedSnapshot; },

  createService(input, existingId) {
    const optimistic: ServiceDefinition = {
      ...input,
      id: existingId || `service-${Date.now().toString(36)}`,
      source: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    patchSnapshot((snap) => ({
      ...snap,
      services: [optimistic, ...snap.services.filter((s) => s.id !== optimistic.id)],
    }));

    const request = existingId
      ? apiClient<Record<string, unknown>>(`${API_ENDPOINTS.admin.tanyaMahreen}/packages/${existingId}`, {
          method: "PUT",
          body: input,
        })
      : apiClient<Record<string, unknown>>(`${API_ENDPOINTS.admin.tanyaMahreen}/packages`, {
          method: "POST",
          body: input,
        });

    void request.then(() => ensureFetched()).catch(() => undefined);
    return optimistic;
  },

  updateRequest(id, patch) {
    patchSnapshot((snap) => ({
      ...snap,
      requests: snap.requests.map((request) =>
        request.id === id ? { ...request, ...patch } : request,
      ),
    }));

    void apiClient<unknown>(`${API_ENDPOINTS.admin.tanyaMahreen}/consultations/${id}`, {
      method: "PUT",
      body: {
        status: patch.status ? patch.status.toLowerCase() : undefined,
        assignedPm: patch.assignedPm,
        priority: patch.priority === "High" ? "high" : "normal",
      },
    })
      .then(() => ensureFetched())
      .catch(() => undefined);

    return cachedSnapshot;
  },

  updateOperation(id, patch) {
    patchSnapshot((snap) => ({
      ...snap,
      operations: snap.operations.map((operation) =>
        operation.id === id
          ? {
              ...operation,
              lifecycleStatus: patch.lifecycleStatus ?? operation.lifecycleStatus,
              budget: patch.budget ?? operation.budget,
              progress: patch.progress ?? operation.progress,
            }
          : operation,
      ),
    }));

    void apiClient<unknown>(`${API_ENDPOINTS.admin.tanyaMahreen}/orders/${id}`, {
      method: "PUT",
      body: {
        status: patch.lifecycleStatus ? patch.lifecycleStatus.toLowerCase() : undefined,
      },
    })
      .then(() => ensureFetched())
      .catch(() => undefined);

    return cachedSnapshot;
  },

  bulkAssignProjectManager(projectManager) {
    patchSnapshot((snap) => ({
      ...snap,
      requests: snap.requests.map((request) =>
        request.assignedPm ? request : { ...request, assignedPm: projectManager.trim() },
      ),
    }));
    notify();
    return cachedSnapshot;
  },

  saveBulkAssignmentDraft(input) {
    const record = {
      ...input,
      id: `assignment-${Date.now().toString(36)}`,
      projectManagerName: "",
      status: "Draft" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    patchSnapshot((snap) => ({ ...snap, latestAssignmentDraft: record }));
    return record;
  },

  confirmBulkAssignment(input) {
    patchSnapshot((snap) => ({
      ...snap,
      latestAssignmentDraft: null,
      requests: snap.requests.map((request) =>
        input.requestIds.includes(request.id)
          ? { ...request, assignedPm: "Project Manager", status: "Scheduled" }
          : request,
      ),
    }));

    for (const requestId of input.requestIds) {
      void apiClient<unknown>(`${API_ENDPOINTS.admin.tanyaMahreen}/consultations/${requestId}`, {
        method: "PATCH",
        body: { status: "scheduled" },
      }).catch(() => undefined);
    }
    void ensureFetched();
    return cachedSnapshot;
  },

  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => { window.removeEventListener(CHANGE_EVENT, handler); };
  },
};