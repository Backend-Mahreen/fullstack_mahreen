import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  DashboardWorkspaceSnapshot,
  DashboardRepository,
} from "./dashboardRepository";

const emptySnapshot: DashboardWorkspaceSnapshot = {
  projects: [],
  scheduleEntries: [],
};

const mapProject = (p: Record<string, unknown>): import("../../pages/DashboardClient/types").Project => ({
  id: String(p.id ?? ""),
  title: String(p.title ?? ""),
  description: String(p.description ?? ""),
  progress: Number(p.progress ?? 0),
  status: String(p.status ?? ""),
  extraMembers: Number(p.extraMembers ?? 0),
  href: String(p.href ?? "#"),
  memberNames: Array.isArray(p.memberNames) ? p.memberNames.map(String) : [],
  updatedAt: String(p.updatedAt ?? new Date().toISOString()),
  budget: p.budget != null ? Number(p.budget) : undefined,
  revenue: p.revenue != null ? Number(p.revenue) : undefined,
});

const mapScheduleEntry = (s: Record<string, unknown>): import("../../pages/DashboardClient/types").ScheduleEntry => ({
  id: String(s.id ?? ""),
  startsAt: String(s.startsAt ?? ""),
  month: String(s.month ?? ""),
  day: String(s.day ?? ""),
  title: String(s.title ?? ""),
  description: String(s.description ?? ""),
  time: String(s.time ?? ""),
  label: String(s.label ?? ""),
  href: String(s.href ?? "#"),
  mandatory: Boolean(s.mandatory),
  showAvatars: Boolean(s.showAvatars),
  attendees: s.attendees != null ? String(s.attendees) : undefined,
  memberNames: Array.isArray(s.memberNames) ? s.memberNames.map(String) : undefined,
});

const fetchDashboard = async (): Promise<DashboardWorkspaceSnapshot> => {
  try {
    const data = await apiClient<Record<string, unknown>>(API_ENDPOINTS.clientDashboard.overview);
    const projects = Array.isArray(data.projects) ? data.projects.map(mapProject) : [];
    const scheduleEntries = Array.isArray(data.scheduleEntries) ? data.scheduleEntries.map(mapScheduleEntry) : [];
    return { projects, scheduleEntries };
  } catch {
    return emptySnapshot;
  }
};

export const apiDashboardRepository: DashboardRepository = {
  synchronize(_workspaceId, _input) {
    return emptySnapshot;
  },

  upsertSchedule(_workspaceId, entry) {
    return [entry];
  },

  patchProject() {
    return 0;
  },

  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("storage", listener);
    };
  },
};

export const fetchClientDashboard = fetchDashboard;
