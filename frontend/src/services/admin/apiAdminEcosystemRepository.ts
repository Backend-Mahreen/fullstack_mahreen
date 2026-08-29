import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  CsrAdminSnapshot,
  CsrVolunteerApplication,
  InternshipAdminSnapshot,
  StudioProductRecord,
  StudioProductStatus,
  AdminEcosystemRepository,
  StudioAdminSnapshot,
} from "./adminEcosystemRepository";

const emptyCsrSnapshot: CsrAdminSnapshot = {
  metrics: { totalVolunteers: 0, activePartners: 0, impactReach: 0, sustainabilityScore: "0%" },
  distribution: [], partners: [], applications: [],
};

const emptyStudioSnapshot: StudioAdminSnapshot = {
  products: [], inventoryForecast: [0, 0, 0, 0, 0, 0, 0],
  warehouses: [{ label: "Local Inventory", value: 0 }], activeVisibility: 0,
};

const emptyInternshipSnapshot: InternshipAdminSnapshot = {
  metrics: { totalApplicants: 0, activeInterns: 0, completionRate: 0, universityPartners: 0 },
  applicantTrend: [],
  selection: [
    { label: "Applied", value: 0 }, { label: "Interview", value: 0 },
    { label: "Accepted", value: 0 }, { label: "Rejected", value: 0, tone: "danger" },
  ],
  verticals: [], acceptedInterns: [],
};

const CHANGE_EVENT = "mahreen:admin-ecosystem-change";
let cachedCsr: CsrAdminSnapshot = emptyCsrSnapshot;
let cachedStudio: StudioAdminSnapshot = emptyStudioSnapshot;
let cachedInternship: InternshipAdminSnapshot = emptyInternshipSnapshot;
let fetchPromise: Promise<void> | null = null;

const fetchAll = async () => {
  const [csr, studio, internship] = await Promise.allSettled([
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.csrOverview),
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.studioInventory),
    apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.internshipAnalytics),
  ]);

  if (csr.status === "fulfilled") {
    const d = csr.value;
    const m = (d.metrics ?? {}) as Record<string, unknown>;
    cachedCsr = {
      metrics: {
        totalVolunteers: Number(m.totalVolunteers ?? 0),
        activePartners: Number(m.activePartners ?? 0),
        impactReach: Number(m.impactReach ?? 0),
        sustainabilityScore: String(m.sustainabilityScore ?? "0%"),
      },
      distribution: Array.isArray(d.distribution) ? d.distribution.map((x: Record<string, unknown>) => ({ label: String(x.label ?? ""), value: Number(x.value ?? 0) })) : [],
      partners: Array.isArray(d.partners) ? d.partners.map((p: Record<string, unknown>) => ({ id: String(p.id ?? ""), name: String(p.name ?? ""), tier: String(p.tier ?? ""), contribution: String(p.contribution ?? "") })) : [],
      applications: Array.isArray(d.applications) ? d.applications.map((a: Record<string, unknown>): CsrVolunteerApplication => ({ id: String(a.id ?? ""), name: String(a.name ?? ""), initials: String(a.initials ?? ""), background: String(a.background ?? ""), role: String(a.role ?? ""), date: String(a.date ?? ""), status: (a.status as CsrVolunteerApplication["status"]) ?? "Review Pending" })) : [],
    };
  }

  if (studio.status === "fulfilled") {
    const d = studio.value;
    cachedStudio = {
      products: Array.isArray(d.products) ? d.products.map((p: Record<string, unknown>): StudioProductRecord => ({
        id: String(p.id ?? ""), name: String(p.name ?? ""), subtitle: String(p.subtitle ?? ""),
        category: String(p.category ?? ""), sku: String(p.sku ?? ""), price: Number(p.price ?? 0),
        stock: Number(p.stock ?? 0), lowStockThreshold: Number(p.lowStockThreshold ?? 0),
        status: (p.status as StudioProductStatus) ?? "In Stock",
        visibility: (p.visibility as "Public" | "Hidden") ?? "Public",
        collection: (p.collection as "Essentials" | "Signature" | "Limited Edition") ?? "Essentials",
        description: String(p.description ?? ""), material: String(p.material ?? ""),
        tags: Array.isArray(p.tags) ? p.tags.map(String) : [], weight: String(p.weight ?? ""),
        dimensions: String(p.dimensions ?? ""), shippingClass: String(p.shippingClass ?? ""),
        createdAt: String(p.createdAt ?? new Date().toISOString()),
      })) : [],
      inventoryForecast: Array.isArray(d.inventoryForecast) ? d.inventoryForecast.map(Number) : [0, 0, 0, 0, 0, 0, 0],
      warehouses: Array.isArray(d.warehouses) ? d.warehouses.map((w: Record<string, unknown>) => ({ label: String(w.label ?? ""), value: Number(w.value ?? 0) })) : [{ label: "Local Inventory", value: 0 }],
      activeVisibility: Number(d.activeVisibility ?? 0),
    };
  }

  if (internship.status === "fulfilled") {
    const d = internship.value;
    const m = (d.metrics ?? {}) as Record<string, unknown>;
    cachedInternship = {
      metrics: {
        totalApplicants: Number(m.totalApplicants ?? 0), activeInterns: Number(m.activeInterns ?? 0),
        completionRate: Number(m.completionRate ?? 0), universityPartners: Number(m.universityPartners ?? 0),
      },
      applicantTrend: Array.isArray(d.applicantTrend) ? d.applicantTrend.map((t: Record<string, unknown>) => ({ label: String(t.label ?? ""), value: Number(t.value ?? 0) })) : [],
      selection: Array.isArray(d.selection) ? d.selection.map((s: Record<string, unknown>) => ({ label: String(s.label ?? ""), value: Number(s.value ?? 0), tone: s.tone as "danger" | undefined })) : [],
      verticals: Array.isArray(d.verticals) ? d.verticals.map((v: Record<string, unknown>) => ({ label: String(v.label ?? ""), interns: Number(v.interns ?? 0) })) : [],
      acceptedInterns: Array.isArray(d.acceptedInterns) ? d.acceptedInterns.map((i: Record<string, unknown>) => ({ id: String(i.id ?? ""), name: String(i.name ?? ""), initials: String(i.initials ?? ""), university: String(i.university ?? ""), role: String(i.role ?? ""), joinedAt: String(i.joinedAt ?? "") })) : [],
    };
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

export const apiAdminEcosystemRepository: AdminEcosystemRepository = {
  getCsrSnapshot() { return cachedCsr; },
  getStudioSnapshot() { return cachedStudio; },
  getInternshipSnapshot() { return cachedInternship; },
  saveStudioProduct(input) {
    const record: StudioProductRecord = {
      ...input,
      id: `studio-${Date.now().toString(36)}`,
      status: (input.stock <= 0
        ? "Out of Stock"
        : input.stock <= input.lowStockThreshold
          ? "Low Stock"
          : "In Stock") as StudioProductStatus,
      createdAt: new Date().toISOString(),
    };

    // Snapshot BARU agar React merender ulang; persistensi best-effort.
    cachedStudio = {
      ...cachedStudio,
      products: [record, ...cachedStudio.products],
    };

    void apiClient(API_ENDPOINTS.admin.studioProducts, {
      method: "POST",
      body: {
        title: input.name,
        description: input.description,
        price: input.price,
        collectionName: input.collection,
        category: input.category,
        image: input.image,
        isFeatured: input.visibility === "Public",
        stock: input.stock,
        sku: input.sku,
        status: input.stock <= 0 ? "out_of_stock" : "published",
        gallery: [],
      },
    })
      .then(() => ensureFetched())
      .catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }

    return record;
  },
  removeStudioProduct(id) {
    cachedStudio = {
      ...cachedStudio,
      products: cachedStudio.products.filter((product) => product.id !== id),
    };

    void apiClient(API_ENDPOINTS.admin.studioProduct(id), { method: "DELETE" })
      .then(() => ensureFetched())
      .catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }
  },
  updateStudioProduct(id, patch) {
    const existing = cachedStudio.products.find((p) => p.id === id);
    if (!existing) throw new Error("Produk tidak ditemukan.");

    const updated: StudioProductRecord = {
      ...existing,
      ...patch,
      status: (patch.stock != null
        ? patch.stock <= 0
          ? "Out of Stock"
          : patch.stock <= (patch.lowStockThreshold ?? existing.lowStockThreshold)
            ? "Low Stock"
            : "In Stock"
        : existing.status) as StudioProductStatus,
    };

    cachedStudio = {
      ...cachedStudio,
      products: cachedStudio.products.map((p) => (p.id === id ? updated : p)),
    };

    void apiClient(API_ENDPOINTS.admin.studioProduct(id), {
      method: "PUT",
      body: {
        title: patch.name ?? existing.name,
        description: patch.description ?? existing.description,
        price: patch.price ?? existing.price,
        collectionName: patch.collection ?? existing.collection,
        category: patch.category ?? existing.category,
        image: patch.image ?? existing.image,
        isFeatured: (patch.visibility ?? existing.visibility) === "Public",
        stock: patch.stock ?? existing.stock,
        sku: patch.sku ?? existing.sku,
        status: (patch.stock ?? existing.stock) <= 0 ? "out_of_stock" : "published",
        gallery: [],
      },
    })
      .then(() => ensureFetched())
      .catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }

    return updated;
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => { window.removeEventListener(CHANGE_EVENT, handler); };
  },
};
