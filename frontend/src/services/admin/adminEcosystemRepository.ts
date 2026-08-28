import { campaignRepository } from "../campaign/campaignRepository";
import { readLocalCSRApplications } from "../csr/csrApplicationService";
import { readLocalInternshipApplications } from "../internship/internshipService";
import {
  emitPlatformDataChange,
  subscribeToPlatformData,
} from "../storage/browserStorage";
import { getInitials } from "../../utils/formatName";

export const ADMIN_ECOSYSTEM_STORAGE_KEY = "mahreen:admin:ecosystem:v2";
export const ADMIN_ECOSYSTEM_CHANGE_EVENT = "mahreen:admin-ecosystem-change";
const LEGACY_ADMIN_ECOSYSTEM_STORAGE_KEY = "mahreen:admin:ecosystem:v1";

export type CsrMetricSnapshot = {
  totalVolunteers: number;
  activePartners: number;
  impactReach: number;
  sustainabilityScore: string;
};

export type CsrDistributionItem = {
  label: string;
  value: number;
};

export type CsrPartner = {
  id: string;
  name: string;
  tier: string;
  contribution: string;
};

export type CsrVolunteerApplication = {
  id: string;
  name: string;
  initials: string;
  background: string;
  role: string;
  date: string;
  status: "Review Pending" | "Waitlisted" | "Urgent Review";
};

export type CsrAdminSnapshot = {
  metrics: CsrMetricSnapshot;
  distribution: CsrDistributionItem[];
  partners: CsrPartner[];
  applications: CsrVolunteerApplication[];
};

export type StudioProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type StudioProductRecord = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  lowStockThreshold: number;
  status: StudioProductStatus;
  visibility: "Public" | "Hidden";
  collection: "Essentials" | "Signature" | "Limited Edition";
  description: string;
  material: string;
  tags: string[];
  weight: string;
  dimensions: string;
  shippingClass: string;
  image?: string;
  createdAt: string;
};

export type StudioAdminSnapshot = {
  products: StudioProductRecord[];
  inventoryForecast: number[];
  warehouses: Array<{ label: string; value: number }>;
  activeVisibility: number;
};

export type InternshipMetricSnapshot = {
  totalApplicants: number;
  activeInterns: number;
  completionRate: number;
  universityPartners: number;
};

export type InternshipAdminSnapshot = {
  metrics: InternshipMetricSnapshot;
  applicantTrend: Array<{ label: string; value: number }>;
  selection: Array<{ label: string; value: number; tone?: "danger" }>;
  verticals: Array<{ label: string; interns: number }>;
  acceptedInterns: Array<{
    id: string;
    name: string;
    initials: string;
    university: string;
    role: string;
    joinedAt: string;
  }>;
};

type StoredAdminEcosystem = {
  version: 2;
  csr: CsrAdminSnapshot;
  studio: StudioAdminSnapshot;
  internship: InternshipAdminSnapshot;
  updatedAt: string;
};

export type NewStudioProduct = Omit<StudioProductRecord, "id" | "createdAt" | "status">;

export interface AdminEcosystemRepository {
  getCsrSnapshot(): CsrAdminSnapshot;
  getStudioSnapshot(): StudioAdminSnapshot;
  getInternshipSnapshot(): InternshipAdminSnapshot;
  saveStudioProduct(product: NewStudioProduct): StudioProductRecord;
  removeStudioProduct(id: string): void;
  subscribe(listener: () => void): () => void;
}

const createDefaultEcosystem = (): StoredAdminEcosystem => ({
  version: 2,
  csr: {
    metrics: {
      totalVolunteers: 0,
      activePartners: 0,
      impactReach: 0,
      sustainabilityScore: "0%",
    },
    distribution: ["Education", "Environment", "Tech Empowerment", "Healthcare"].map((label) => ({ label, value: 0 })),
    partners: [],
    applications: [],
  },
  studio: {
    products: [],
    inventoryForecast: [0, 0, 0, 0, 0, 0, 0],
    warehouses: [{ label: "Local Inventory", value: 0 }],
    activeVisibility: 0,
  },
  internship: {
    metrics: {
      totalApplicants: 0,
      activeInterns: 0,
      completionRate: 0,
      universityPartners: 0,
    },
    applicantTrend: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((label) => ({ label, value: 0 })),
    selection: [
      { label: "Applied", value: 0 },
      { label: "Interview", value: 0 },
      { label: "Accepted", value: 0 },
      { label: "Rejected", value: 0, tone: "danger" },
    ],
    verticals: [],
    acceptedInterns: [],
  },
  updatedAt: new Date().toISOString(),
});

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const readEcosystem = (): StoredAdminEcosystem => {
  const fallback = createDefaultEcosystem();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(ADMIN_ECOSYSTEM_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_ADMIN_ECOSYSTEM_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(ADMIN_ECOSYSTEM_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const stored = JSON.parse(raw) as Partial<StoredAdminEcosystem>;
    return {
      version: 2,
      csr: fallback.csr,
      studio: stored.studio
        ? {
            ...fallback.studio,
            products: Array.isArray(stored.studio.products)
              ? stored.studio.products.filter((product) =>
                  !["studio-aurelius", "studio-obsidian", "studio-silk", "studio-clock"].includes(product.id),
                )
              : [],
          }
        : fallback.studio,
      internship: fallback.internship,
      updatedAt: stored.updatedAt || fallback.updatedAt,
    };
  } catch {
    return fallback;
  }
};

const writeEcosystem = (state: StoredAdminEcosystem) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(
      ADMIN_ECOSYSTEM_STORAGE_KEY,
      JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
    );
    window.dispatchEvent(new CustomEvent(ADMIN_ECOSYSTEM_CHANGE_EVENT));
    emitPlatformDataChange();
    return true;
  } catch {
    return false;
  }
};

const getProductStatus = (stock: number, threshold: number): StudioProductStatus => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= threshold) return "Low Stock";
  return "In Stock";
};

const getCsrSnapshot = (): CsrAdminSnapshot => {
  const applications = readLocalCSRApplications();
  const campaignSnapshot = campaignRepository.getSnapshot();
  const sectors = ["Education", "Environment", "Tech Empowerment", "Healthcare"];
  const sectorCounts = new Map(sectors.map((sector) => [sector, 0]));
  applications.forEach((application) => {
    const focus = application.focusArea.toLowerCase();
    const sector = focus.includes("health")
      ? "Healthcare"
      : focus.includes("environment") || focus.includes("lingkungan")
        ? "Environment"
        : focus.includes("tech") || focus.includes("digital")
          ? "Tech Empowerment"
          : "Education";
    sectorCounts.set(sector, (sectorCounts.get(sector) ?? 0) + 1);
  });
  const total = Math.max(1, applications.length);
  const partners = applications
    .filter((application) => application.role === "community-partner")
    .map((application, index) => ({
      id: String(index + 1).padStart(2, "0"),
      name: application.fullName,
      tier: "Community Partner",
      contribution: "Pending Review",
    }));
  return {
    metrics: {
      totalVolunteers: applications.filter((application) => application.role === "volunteer").length,
      activePartners: partners.length,
      impactReach: campaignSnapshot.metrics.totalDonors,
      sustainabilityScore: `${campaignSnapshot.metrics.averageCompletion}%`,
    },
    distribution: sectors.map((label) => ({
      label,
      value: applications.length ? Math.round(((sectorCounts.get(label) ?? 0) / total) * 100) : 0,
    })),
    partners,
    applications: applications.map((application) => ({
      id: application.applicationId,
      name: application.fullName,
      initials: getInitials(application.fullName),
      background: [application.focusArea, application.city, application.province].filter(Boolean).join(" · "),
      role: application.role === "community-partner" ? "Community Partner" : "Volunteer",
      date: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(application.submittedAt)),
      status: "Review Pending",
    })),
  };
};

const getStudioSnapshot = (): StudioAdminSnapshot => {
  const state = readEcosystem().studio;
  const products = state.products;
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const publicProducts = products.filter((product) => product.visibility === "Public").length;
  const fill = products.length ? Math.min(100, Math.round(totalStock / products.length)) : 0;
  const maxProductStock = Math.max(1, ...products.map((product) => product.stock));
  return {
    products: clone(products),
    inventoryForecast: Array.from({ length: 7 }, (_, index) => {
      const product = products[index];
      return product ? Math.round((product.stock / maxProductStock) * 100) : 0;
    }),
    warehouses: [{ label: "Local Inventory", value: fill }],
    activeVisibility: products.length ? Math.round((publicProducts / products.length) * 100) : 0,
  };
};

const getInternshipSnapshot = (): InternshipAdminSnapshot => {
  const applications = readLocalInternshipApplications();
  const monthLabels = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
  const monthIndexes = [0, 2, 4, 6, 8, 10];
  const groupedPrograms = new Map<string, number>();
  applications.forEach((application) => {
    groupedPrograms.set(application.program, (groupedPrograms.get(application.program) ?? 0) + 1);
  });
  return {
    metrics: {
      totalApplicants: applications.length,
      activeInterns: 0,
      completionRate: 0,
      universityPartners: new Set(applications.map((application) => application.university.trim().toLowerCase()).filter(Boolean)).size,
    },
    applicantTrend: monthLabels.map((label, index) => ({
      label,
      value: applications.filter((application) => new Date(application.submittedAt).getMonth() === monthIndexes[index]).length,
    })),
    selection: [
      { label: "Applied", value: applications.length },
      { label: "Interview", value: 0 },
      { label: "Accepted", value: 0 },
      { label: "Rejected", value: 0, tone: "danger" },
    ],
    verticals: [...groupedPrograms.entries()].map(([label, interns]) => ({ label, interns })).slice(0, 4),
    acceptedInterns: applications.slice(0, 8).map((application) => ({
      id: application.applicationId,
      name: application.fullName,
      initials: getInitials(application.fullName),
      university: application.university,
      role: application.program,
      joinedAt: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(application.submittedAt)),
    })),
  };
};

export const localAdminEcosystemRepository: AdminEcosystemRepository = {
  getCsrSnapshot: () => clone(getCsrSnapshot()),
  getStudioSnapshot: () => clone(getStudioSnapshot()),
  getInternshipSnapshot: () => clone(getInternshipSnapshot()),
  saveStudioProduct(input) {
    const state = readEcosystem();
    const product: StudioProductRecord = {
      ...input,
      id: `studio-${Date.now().toString(36)}`,
      status: getProductStatus(input.stock, input.lowStockThreshold),
      createdAt: new Date().toISOString(),
    };
    if (!writeEcosystem({
      ...state,
      studio: { ...state.studio, products: [product, ...state.studio.products] },
    })) {
      throw new Error("Penyimpanan lokal Admin tidak tersedia.");
    }
    return product;
  },
  removeStudioProduct(id) {
    const state = readEcosystem();
    if (!writeEcosystem({
      ...state,
      studio: {
        ...state.studio,
        products: state.studio.products.filter((product) => product.id !== id),
      },
    })) {
      throw new Error("Penyimpanan lokal Admin tidak tersedia.");
    }
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(ADMIN_ECOSYSTEM_CHANGE_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(ADMIN_ECOSYSTEM_CHANGE_EVENT, listener);
    };
  },
};

import { apiAdminEcosystemRepository } from "./apiAdminEcosystemRepository";

export const adminEcosystemRepository: AdminEcosystemRepository =
  apiAdminEcosystemRepository;
