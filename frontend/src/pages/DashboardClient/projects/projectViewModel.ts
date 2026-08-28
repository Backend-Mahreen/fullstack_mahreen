import type { Project } from "../types";

export type ClientProjectMilestone = {
  label: string;
  completed: boolean;
};

export type ClientProjectView = {
  id: string;
  title: string;
  category: string;
  status: "BERJALAN" | "REVIEW" | "SELESAI";
  projectManager: string;
  budget: string;
  progress: number;
  startDate: string;
  deadline: string;
  milestones: ClientProjectMilestone[];
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Menunggu konfirmasi";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatBudget = (budget?: number) => {
  if (!budget || budget <= 0) return "Menunggu konfirmasi";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(budget);
};

const normalizeStatus = (status: string): ClientProjectView["status"] => {
  const normalized = status.toLowerCase();
  if (/selesai|complete|delivered|closed/.test(normalized)) return "SELESAI";
  if (/review|approval|verification/.test(normalized)) return "REVIEW";
  return "BERJALAN";
};

const createMilestones = (progress: number): ClientProjectMilestone[] => {
  const stages = [
    "Discovery & Brief",
    "Wireframe & Perencanaan",
    "Produksi & Implementasi",
    "Testing & Review",
    "Final Delivery",
  ];
  const completedStages = Math.min(
    stages.length,
    Math.floor(Math.max(0, Math.min(100, progress)) / 20),
  );

  return stages.map((label, index) => ({
    label,
    completed: index < completedStages,
  }));
};

export const toClientProjectView = (
  project: Project,
  currentUserName: string,
): ClientProjectView => {
  const progress = Math.max(0, Math.min(100, Math.round(project.progress)));
  const manager = project.memberNames?.find(
    (name) => name.trim().toLowerCase() !== currentUserName.trim().toLowerCase(),
  );

  return {
    id: project.id,
    title: project.title,
    category: project.serviceCategory || "Mahreen Project",
    status: normalizeStatus(project.status),
    projectManager: manager || "Tim Mahreen",
    budget: formatBudget(project.budget),
    progress,
    startDate: formatDate(project.updatedAt),
    deadline: "Menunggu konfirmasi",
    milestones: createMilestones(progress),
  };
};
