import type { StoredConsultationRequest } from "../consultation/consultationService";
import { readLocalConsultationRequests } from "../consultation/consultationService";
import {
  DASHBOARD_PROJECTS_STORAGE_PREFIX,
  DASHBOARD_SCHEDULE_STORAGE_PREFIX,
  dashboardRepository,
} from "../dashboard/dashboardRepository";
import { emitPlatformDataChange } from "../storage/browserStorage";
import type {
  Project,
  ScheduleEntry,
} from "../../pages/DashboardClient/types";

const ADMIN_STATE_KEY = "mahreen:admin:service-management:v1";
const SERVICE_MANAGEMENT_EVENT = "mahreen:service-management-change";

export type ServiceLifecycleStatus = "Active" | "Draft" | "Archived";
export type ConsultationStatus =
  | "Pending"
  | "Reviewed"
  | "Scheduled"
  | "Converted"
  | "Cancelled"
  | "Archived";

export type ServiceDefinition = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: ServiceLifecycleStatus;
  description?: string;
  features?: string[];
  thumbnail?: string;
  gallery?: string[];
  seoTitle?: string;
  metaDescription?: string;
  visibility?: "Admin Only" | "Public";
  source: "admin" | "activity";
  createdAt: string;
  updatedAt: string;
};

export type ServiceRequest = {
  id: string;
  clientName: string;
  email: string;
  company: string;
  serviceRequested: string;
  serviceCategory: string;
  date: string;
  status: ConsultationStatus;
  assignedPm: string;
  budgetLabel: string;
  priority: "High" | "Normal";
};

export type ServiceOperation = {
  id: string;
  title: string;
  stakeholder: string;
  category: string;
  lifecycleStatus: string;
  budget: number;
  revenue: number;
  progress: number;
  href: string;
  updatedAt: string;
};

export type ServiceMeeting = {
  id: string;
  title: string;
  client: string;
  startsAt: string;
  time: string;
  location: string;
  href: string;
};

export type ServiceManagementMetrics = {
  activeServices: number;
  consultations: number;
  highPriority: number;
  activeProjects: number;
  revenueMtd: number;
};

export type ServiceManagementSnapshot = {
  services: ServiceDefinition[];
  requests: ServiceRequest[];
  operations: ServiceOperation[];
  meetings: ServiceMeeting[];
  projectManagers: ProjectManager[];
  latestAssignmentDraft: BulkAssignmentRecord | null;
  metrics: ServiceManagementMetrics;
};

export type NewServiceInput = {
  name: string;
  category: string;
  price: number;
  status: ServiceLifecycleStatus;
  description?: string;
  features?: string[];
  thumbnail?: string;
  gallery?: string[];
  seoTitle?: string;
  metaDescription?: string;
  visibility?: "Admin Only" | "Public";
};

export type AssignmentMeetingMode = "Zoom" | "Meet" | "Offline";
export type AssignmentPriority = "Standard" | "High Priority" | "Urgent";

export type ProjectManager = {
  id: string;
  name: string;
  role: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  activeLoad: number;
  maxLoad: number;
  avatarKey: "sarah" | "aditya" | "ilham";
};

export type BulkAssignmentInput = {
  requestIds: string[];
  projectManagerId: string;
  meetingMode: AssignmentMeetingMode;
  scheduledAt: string;
  priority: AssignmentPriority;
};

export type BulkAssignmentRecord = BulkAssignmentInput & {
  id: string;
  projectManagerName: string;
  status: "Draft" | "Applied";
  createdAt: string;
  updatedAt: string;
};

type RequestOverride = Partial<
  Pick<ServiceRequest, "status" | "assignedPm" | "priority">
>;
type OperationOverride = Partial<
  Pick<ServiceOperation, "lifecycleStatus" | "budget" | "progress">
>;

type StoredAdminState = {
  services: ServiceDefinition[];
  requestOverrides: Record<string, RequestOverride>;
  operationOverrides: Record<string, OperationOverride>;
  assignments: BulkAssignmentRecord[];
};

export interface ServiceManagementRepository {
  getSnapshot(): ServiceManagementSnapshot;
  createService(input: NewServiceInput, existingId?: string): ServiceDefinition;
  updateRequest(id: string, patch: RequestOverride): ServiceManagementSnapshot;
  updateOperation(id: string, patch: OperationOverride): ServiceManagementSnapshot;
  bulkAssignProjectManager(projectManager: string): ServiceManagementSnapshot;
  saveBulkAssignmentDraft(input: BulkAssignmentInput): BulkAssignmentRecord;
  confirmBulkAssignment(input: BulkAssignmentInput): ServiceManagementSnapshot;
  subscribe(listener: () => void): () => void;
}

const emptyState = (): StoredAdminState => ({
  services: [],
  requestOverrides: {},
  operationOverrides: {},
  assignments: [],
});

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const LOCAL_PROJECT_MANAGERS: ProjectManager[] = [];

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const readAdminState = (): StoredAdminState => {
  if (typeof window === "undefined") return emptyState();
  const state = safeParse<Partial<StoredAdminState>>(
    window.localStorage.getItem(ADMIN_STATE_KEY),
    {},
  );
  return {
    services: Array.isArray(state.services) ? state.services : [],
    requestOverrides:
      state.requestOverrides && typeof state.requestOverrides === "object"
        ? state.requestOverrides
        : {},
    operationOverrides:
      state.operationOverrides && typeof state.operationOverrides === "object"
        ? state.operationOverrides
        : {},
    assignments: Array.isArray(state.assignments) ? state.assignments : [],
  };
};

const writeAdminState = (state: StoredAdminState) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(SERVICE_MANAGEMENT_EVENT));
    emitPlatformDataChange();
    return true;
  } catch {
    // The in-memory interaction remains usable if browser storage is blocked.
    return false;
  }
};

const readCollectionsByPrefix = <T,>(
  prefix: string,
  validator: (value: unknown) => value is T,
) => {
  if (typeof window === "undefined") return [] as T[];
  const items: T[] = [];
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(`${prefix}:`)) continue;
      const parsed = safeParse<unknown>(window.localStorage.getItem(key), []);
      if (Array.isArray(parsed)) {
        items.push(...parsed.filter(validator));
      }
    }
  } catch {
    return [];
  }
  return items;
};

const isProject = (value: unknown): value is Project => {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<Project>;
  return (
    hasText(project.id) &&
    hasText(project.title) &&
    hasText(project.status) &&
    hasText(project.updatedAt) &&
    typeof project.progress === "number"
  );
};

const isScheduleEntry = (value: unknown): value is ScheduleEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ScheduleEntry>;
  return (
    hasText(entry.id) &&
    hasText(entry.title) &&
    hasText(entry.startsAt) &&
    hasText(entry.time) &&
    hasText(entry.href)
  );
};

const normalize = (value: string) => value.trim().toLowerCase();

const slugify = (value: string) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "service";

const dedupeNewest = <T extends { id: string; updatedAt: string }>(items: T[]) => {
  const records = new Map<string, T>();
  items.forEach((item) => {
    const current = records.get(item.id);
    if (!current || Date.parse(item.updatedAt) >= Date.parse(current.updatedAt)) {
      records.set(item.id, item);
    }
  });
  return [...records.values()];
};

const mapRequest = (
  request: StoredConsultationRequest,
  override: RequestOverride | undefined,
): ServiceRequest => {
  const serviceRequested = request.services.join(", ") || "Business Consultation";
  return {
    id: request.requestId,
    clientName: request.clientInfo.nama || "Client",
    email: request.clientInfo.email,
    company: request.clientInfo.perusahaan || "Individual",
    serviceRequested,
    serviceCategory: request.services[0] || "Consultation",
    date: request.submittedAt,
    status: override?.status ?? "Pending",
    assignedPm: override?.assignedPm ?? "",
    budgetLabel: request.budget || "Belum ditentukan",
    priority:
      override?.priority ?? (request.target === "Secepatnya" ? "High" : "Normal"),
  };
};

const mapOperation = (
  project: Project,
  override: OperationOverride | undefined,
): ServiceOperation => ({
  id: project.id,
  title: project.title,
  stakeholder: project.company || project.clientName || "Individual Client",
  category: project.serviceCategory || "Consulting",
  lifecycleStatus: override?.lifecycleStatus ?? project.status,
  budget: override?.budget ?? project.budget ?? 0,
  revenue: project.revenue ?? 0,
  progress: override?.progress ?? project.progress,
  href: project.href,
  updatedAt: project.updatedAt,
});

const mapMeeting = (entry: ScheduleEntry): ServiceMeeting => ({
  id: entry.id,
  title: entry.title,
  client: entry.memberNames?.[0] || entry.description.split("\n")[0] || "Client",
  startsAt: entry.startsAt,
  time: entry.time,
  location: entry.label,
  href: entry.href,
});

const deriveServices = (
  storedServices: ServiceDefinition[],
  requests: ServiceRequest[],
  operations: ServiceOperation[],
) => {
  const services = new Map<string, ServiceDefinition>();
  const now = new Date().toISOString();

  [...requests.map((request) => request.serviceCategory), ...operations.map((operation) => operation.category)]
    .filter(Boolean)
    .forEach((name) => {
      const key = normalize(name);
      if (!services.has(key)) {
        services.set(key, {
          id: `activity:${slugify(name)}`,
          name,
          category: name,
          price: 0,
          status: "Active",
          source: "activity",
          createdAt: now,
          updatedAt: now,
        });
      }
    });

  storedServices.forEach((service) => services.set(normalize(service.name), service));
  return [...services.values()].sort((left, right) => left.name.localeCompare(right.name));
};

const isCurrentMonth = (isoValue: string) => {
  const value = new Date(isoValue);
  const today = new Date();
  return (
    Number.isFinite(value.getTime()) &&
    value.getFullYear() === today.getFullYear() &&
    value.getMonth() === today.getMonth()
  );
};

const getProjectManagers = (assignments: BulkAssignmentRecord[]) =>
  LOCAL_PROJECT_MANAGERS.map((manager) => {
    const assignedRequests = assignments
      .filter(
        (assignment) =>
          assignment.status === "Applied" &&
          assignment.projectManagerId === manager.id,
      )
      .reduce(
        (total, assignment) => total + assignment.requestIds.length,
        0,
      );
    return {
      ...manager,
      activeLoad: manager.activeLoad + assignedRequests,
    };
  });

const formatAssignmentTime = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  if (!Number.isFinite(date.getTime())) return "Waktu belum ditentukan";
  const start = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const endDate = new Date(date.getTime() + 60 * 60 * 1000);
  const end = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(endDate);
  return `${start} - ${end} WIB`;
};

const deriveAssignmentMeetings = (
  assignments: BulkAssignmentRecord[],
  requests: ServiceRequest[],
): ServiceMeeting[] => {
  const requestMap = new Map(requests.map((request) => [request.id, request]));
  return assignments
    .filter(
      (assignment) =>
        assignment.status === "Applied" && hasText(assignment.scheduledAt),
    )
    .flatMap((assignment) =>
      assignment.requestIds.map((requestId) => {
        const request = requestMap.get(requestId);
        return {
          id: `${assignment.id}:${requestId}`,
          title: request
            ? `Consultation · ${request.serviceRequested}`
            : "Tanya Mahreen Consultation",
          client: request?.clientName || "Client",
          startsAt: assignment.scheduledAt,
          time: formatAssignmentTime(assignment.scheduledAt),
          location: assignment.meetingMode,
          href: "/admin?module=tanya-mahreen",
        };
      }),
    );
};

const getSnapshot = (): ServiceManagementSnapshot => {
  const state = readAdminState();
  const requests = readLocalConsultationRequests()
    .map((request) => mapRequest(request, state.requestOverrides[request.requestId]))
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
  const projects = dedupeNewest(
    readCollectionsByPrefix(DASHBOARD_PROJECTS_STORAGE_PREFIX, isProject),
  );
  const operations = projects
    .map((project) => mapOperation(project, state.operationOverrides[project.id]))
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const dashboardMeetings = readCollectionsByPrefix(
    DASHBOARD_SCHEDULE_STORAGE_PREFIX,
    isScheduleEntry,
  )
    .map(mapMeeting)
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
  const meetings = [
    ...deriveAssignmentMeetings(state.assignments, requests),
    ...dashboardMeetings,
  ].sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
  const services = deriveServices(state.services, requests, operations);

  return {
    services,
    requests,
    operations,
    meetings,
    projectManagers: getProjectManagers(state.assignments),
    latestAssignmentDraft:
      state.assignments.find((assignment) => assignment.status === "Draft") ?? null,
    metrics: {
      activeServices: services.filter((service) => service.status === "Active").length,
      consultations: requests.filter((request) => request.status !== "Archived").length,
      highPriority: requests.filter(
        (request) => request.priority === "High" && request.status === "Pending",
      ).length,
      activeProjects: operations.filter(
        (operation) =>
          !/completed|archived|cancelled/i.test(operation.lifecycleStatus),
      ).length,
      revenueMtd: operations
        .filter((operation) => isCurrentMonth(operation.updatedAt))
        .reduce((total, operation) => total + operation.revenue, 0),
    },
  };
};

const createAssignmentRecord = (
  input: BulkAssignmentInput,
  projectManagerName: string,
  status: BulkAssignmentRecord["status"],
  previousDraft?: BulkAssignmentRecord,
): BulkAssignmentRecord => {
  const now = new Date().toISOString();
  return {
    ...input,
    requestIds: [...new Set(input.requestIds.filter(hasText))],
    id:
      previousDraft?.id ??
      `ASN-${Date.now().toString(36).toUpperCase()}`,
    projectManagerName,
    status,
    createdAt: previousDraft?.createdAt ?? now,
    updatedAt: now,
  };
};

export const localServiceManagementRepository: ServiceManagementRepository = {
  getSnapshot,
  createService(input, existingId) {
    const state = readAdminState();
    const now = new Date().toISOString();
    const existingService = existingId
      ? state.services.find((service) => service.id === existingId)
      : undefined;
    const service: ServiceDefinition = {
      id: existingService?.id ?? `SVC-${Date.now().toString(36).toUpperCase()}`,
      name: input.name.trim() || "Untitled Service",
      category: input.category.trim() || "Uncategorized",
      price: Math.max(0, input.price),
      status: input.status,
      description: input.description?.trim() ?? "",
      features: (input.features ?? []).map((feature) => feature.trim()).filter(Boolean),
      thumbnail: input.thumbnail ?? "",
      gallery: (input.gallery ?? []).filter(hasText).slice(0, 4),
      seoTitle: input.seoTitle?.trim() ?? "",
      metaDescription: input.metaDescription?.trim() ?? "",
      visibility:
        input.visibility ?? (input.status === "Active" ? "Public" : "Admin Only"),
      source: "admin",
      createdAt: existingService?.createdAt ?? now,
      updatedAt: now,
    };
    const persisted = writeAdminState({
      ...state,
      services: [
        service,
        ...state.services.filter((item) => item.id !== service.id),
      ],
    });
    if (!persisted) {
      throw new Error("Service storage quota exceeded");
    }
    return service;
  },
  updateRequest(id, patch) {
    const state = readAdminState();
    writeAdminState({
      ...state,
      requestOverrides: {
        ...state.requestOverrides,
        [id]: { ...state.requestOverrides[id], ...patch },
      },
    });
    if (patch.status) {
      const progressByStatus: Partial<Record<ConsultationStatus, number>> = {
        Pending: 20,
        Reviewed: 28,
        Scheduled: 35,
        Converted: 55,
        Cancelled: 0,
        Archived: 100,
      };
      dashboardRepository.patchProject(`consultation:${id}`, {
        status: patch.status,
        progress: progressByStatus[patch.status],
      });
    }
    return getSnapshot();
  },
  updateOperation(id, patch) {
    const state = readAdminState();
    writeAdminState({
      ...state,
      operationOverrides: {
        ...state.operationOverrides,
        [id]: { ...state.operationOverrides[id], ...patch },
      },
    });
    dashboardRepository.patchProject(id, {
      status: patch.lifecycleStatus,
      progress: patch.progress,
      budget: patch.budget,
    });
    return getSnapshot();
  },
  bulkAssignProjectManager(projectManager) {
    const state = readAdminState();
    const requestOverrides = { ...state.requestOverrides };
    readLocalConsultationRequests().forEach((request) => {
      const current = requestOverrides[request.requestId];
      if (!current?.assignedPm) {
        requestOverrides[request.requestId] = {
          ...current,
          assignedPm: projectManager.trim(),
        };
      }
    });
    writeAdminState({ ...state, requestOverrides });
    return getSnapshot();
  },
  saveBulkAssignmentDraft(input) {
    const state = readAdminState();
    const projectManager = getProjectManagers(state.assignments).find(
      (manager) => manager.id === input.projectManagerId,
    );
    const previousDraft = state.assignments.find(
      (assignment) => assignment.status === "Draft",
    );
    const record = createAssignmentRecord(
      input,
      projectManager?.name || "Project Manager",
      "Draft",
      previousDraft,
    );
    writeAdminState({
      ...state,
      assignments: [
        record,
        ...state.assignments.filter(
          (assignment) => assignment.status !== "Draft",
        ),
      ],
    });
    return record;
  },
  confirmBulkAssignment(input) {
    const state = readAdminState();
    const projectManager = getProjectManagers(state.assignments).find(
      (manager) => manager.id === input.projectManagerId,
    );
    if (!projectManager || input.requestIds.length === 0) return getSnapshot();

    const previousDraft = state.assignments.find(
      (assignment) => assignment.status === "Draft",
    );
    const record = createAssignmentRecord(
      input,
      projectManager.name,
      "Applied",
      previousDraft,
    );
    const requestOverrides = { ...state.requestOverrides };
    record.requestIds.forEach((requestId) => {
      requestOverrides[requestId] = {
        ...requestOverrides[requestId],
        assignedPm: projectManager.name,
        priority: record.priority === "Standard" ? "Normal" : "High",
        status: record.scheduledAt ? "Scheduled" : "Reviewed",
      };
    });
    writeAdminState({
      ...state,
      requestOverrides,
      assignments: [
        record,
        ...state.assignments.filter(
          (assignment) =>
            assignment.status !== "Draft" && assignment.id !== record.id,
        ),
      ],
    });
    record.requestIds.forEach((requestId) => {
      dashboardRepository.patchProject(`consultation:${requestId}`, {
        status: record.scheduledAt ? "Scheduled" : "Reviewed",
        progress: record.scheduledAt ? 35 : 28,
      });
    });
    return getSnapshot();
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener("storage", listener);
    window.addEventListener(SERVICE_MANAGEMENT_EVENT, listener);
    return () => {
      window.removeEventListener("storage", listener);
      window.removeEventListener(SERVICE_MANAGEMENT_EVENT, listener);
    };
  },
};

import { apiServiceManagementRepository } from "./apiServiceManagementRepository";

export const serviceManagementRepository: ServiceManagementRepository =
  apiServiceManagementRepository;

export const formatServiceCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
