import type {
  Project,
  ScheduleEntry,
} from "../../pages/DashboardClient/types";
import {
  emitPlatformDataChange,
  subscribeToPlatformData,
} from "../storage/browserStorage";

export const DASHBOARD_PROJECTS_STORAGE_PREFIX = "mahreen:dashboard:projects:v2";
export const DASHBOARD_SCHEDULE_STORAGE_PREFIX = "mahreen:dashboard:schedule:v2";
const DASHBOARD_STORAGE_EVENT = "mahreen:dashboard-data-change";

export type DashboardWorkspaceSnapshot = {
  projects: Project[];
  scheduleEntries: ScheduleEntry[];
};

export type DashboardWorkspaceInput = {
  projects?: Project[];
  scheduleEntries?: ScheduleEntry[];
};

export interface DashboardRepository {
  synchronize(
    workspaceId: string,
    input: DashboardWorkspaceInput,
  ): DashboardWorkspaceSnapshot;
  upsertSchedule(workspaceId: string, entry: ScheduleEntry): ScheduleEntry[];
  patchProject(
    projectId: string,
    patch: Partial<Pick<Project, "status" | "progress" | "memberNames" | "budget" | "revenue">>,
  ): number;
  subscribe(listener: () => void): () => void;
}

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isProject = (value: unknown): value is Project => {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<Project>;
  return (
    hasText(project.id) &&
    hasText(project.title) &&
    hasText(project.description) &&
    Number.isFinite(project.progress) &&
    hasText(project.status) &&
    Number.isFinite(project.extraMembers) &&
    hasText(project.href) &&
    hasText(project.updatedAt)
  );
};

const isScheduleEntry = (value: unknown): value is ScheduleEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ScheduleEntry>;
  return (
    hasText(entry.id) &&
    hasText(entry.startsAt) &&
    hasText(entry.month) &&
    hasText(entry.day) &&
    hasText(entry.title) &&
    hasText(entry.description) &&
    hasText(entry.time) &&
    hasText(entry.label) &&
    hasText(entry.href)
  );
};

const readCollection = <T,>(
  key: string,
  isValid: (value: unknown) => value is T,
): T[] => {
  if (typeof window === "undefined") return [];

  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch {
    return [];
  }
};

const writeCollection = <T,>(key: string, items: T[]) => {
  if (typeof window === "undefined") return;

  try {
    const nextValue = JSON.stringify(items);
    if (window.localStorage.getItem(key) === nextValue) return;
    window.localStorage.setItem(key, nextValue);
    window.dispatchEvent(new CustomEvent(DASHBOARD_STORAGE_EVENT));
    emitPlatformDataChange();
  } catch {
    // The current in-memory snapshot remains usable when storage is blocked.
  }
};

const getScopedKey = (baseKey: string, workspaceId: string) => {
  const normalizedId = workspaceId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${baseKey}:${normalizedId || "anonymous"}`;
};

const mergeById = <T extends { id: string }>(stored: T[], incoming: T[]) => {
  const records = new Map(stored.map((record) => [record.id, record]));
  incoming.forEach((record) => records.set(record.id, record));
  return [...records.values()];
};

const mergeProjectsByNewest = (stored: Project[], incoming: Project[]) => {
  const records = new Map(stored.map((record) => [record.id, record]));
  incoming.forEach((record) => {
    const current = records.get(record.id);
    if (!current || Date.parse(record.updatedAt) >= Date.parse(current.updatedAt)) {
      records.set(record.id, record);
    }
  });
  return [...records.values()];
};

const sortProjects = (projects: Project[]) =>
  [...projects].sort(
    (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
  );

const onlyUpcomingSchedule = (entries: ScheduleEntry[]) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return entries
    .filter((entry) => {
      const startsAt = Date.parse(entry.startsAt);
      return Number.isFinite(startsAt) && startsAt >= startOfToday.getTime();
    })
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
};

const synchronize = (
  workspaceId: string,
  {
    projects: incomingProjects = [],
    scheduleEntries: incomingSchedule = [],
  }: DashboardWorkspaceInput,
): DashboardWorkspaceSnapshot => {
  const projectKey = getScopedKey(DASHBOARD_PROJECTS_STORAGE_PREFIX, workspaceId);
  const scheduleKey = getScopedKey(DASHBOARD_SCHEDULE_STORAGE_PREFIX, workspaceId);
  const projects = sortProjects(
    mergeProjectsByNewest(
      readCollection(projectKey, isProject),
      incomingProjects.filter(isProject),
    ),
  );
  const scheduleEntries = onlyUpcomingSchedule(
    mergeById(
      readCollection(scheduleKey, isScheduleEntry),
      incomingSchedule.filter(isScheduleEntry),
    ),
  );

  writeCollection(projectKey, projects);
  writeCollection(scheduleKey, scheduleEntries);

  return { projects, scheduleEntries };
};

export const localDashboardRepository: DashboardRepository = {
  synchronize,
  upsertSchedule(workspaceId, entry) {
    return synchronize(workspaceId, { scheduleEntries: [entry] }).scheduleEntries;
  },
  patchProject(projectId, patch) {
    if (typeof window === "undefined") return 0;
    const definedPatch = Object.fromEntries(
      Object.entries(patch).filter(([, value]) => value !== undefined),
    ) as typeof patch;
    let updated = 0;
    try {
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (!key?.startsWith(`${DASHBOARD_PROJECTS_STORAGE_PREFIX}:`)) continue;
        const projects = readCollection(key, isProject);
        if (!projects.some((project) => project.id === projectId)) continue;
        const nextProjects = projects.map((project) =>
          project.id === projectId
            ? { ...project, ...definedPatch, updatedAt: new Date().toISOString() }
            : project,
        );
        writeCollection(key, nextProjects);
        updated += 1;
      }
    } catch {
      return updated;
    }
    return updated;
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(DASHBOARD_STORAGE_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(DASHBOARD_STORAGE_EVENT, listener);
    };
  },
};

import { apiDashboardRepository } from "./apiDashboardRepository";

export const dashboardRepository: DashboardRepository = apiDashboardRepository;
