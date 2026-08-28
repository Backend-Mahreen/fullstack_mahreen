import { formatIdr } from "../../utils/formatCurrency";
import type {
  AdminActivity,
  AdminMetric,
  AdminTransaction,
} from "../../pages/DashboardAdmin/types";
import { readStudioOrders } from "../../pages/Mahreen-Studio/Purchase/storage";
import { campaignRepository, formatCampaignCompactCurrency } from "../campaign/campaignRepository";
import { readLocalCSRApplications } from "../csr/csrApplicationService";
import { readLocalInternshipApplications } from "../internship/internshipService";
import { serviceManagementRepository } from "../serviceManagement/serviceManagementRepository";
import { subscribeToPlatformData } from "../storage/browserStorage";
import { userDirectoryRepository } from "../userDirectory/userDirectoryRepository";
import { adminEcosystemRepository } from "./adminEcosystemRepository";
import { adminOperationsRepository } from "./adminOperationsRepository";

export const ADMIN_WORKSPACE_CHANGE_EVENT = "mahreen:admin-workspace-change";

export type AdminEcosystemDistribution = {
  label: string;
  value: string;
  progress: number;
};

export type AdminProgramSnapshot = {
  internship: {
    totalApplicants: number;
    interviews: number;
    activeParticipants: number;
  };
  donation: {
    donors: number;
    collected: string;
    targetProgress: number;
    distributed: string;
  };
  csr: {
    activePartners: number;
    runningPrograms: number;
    pendingProposals: number;
  };
};

export type AdminOverviewSnapshot = {
  metrics: AdminMetric[];
  revenueChart: number[];
  ecosystemDistribution: AdminEcosystemDistribution[];
  transactions: AdminTransaction[];
  activities: AdminActivity[];
  programs: AdminProgramSnapshot;
};

export interface AdminWorkspaceRepository {
  getOverviewSnapshot(): AdminOverviewSnapshot;
  subscribe(listener: () => void): () => void;
}

const relativeTime = (isoValue: string) => {
  const elapsed = Date.now() - Date.parse(isoValue);
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "Baru saja";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} jam lalu` : `${Math.floor(hours / 24)} hari lalu`;
};

const getOverviewSnapshot = (): AdminOverviewSnapshot => {
  const operations = adminOperationsRepository.getCommandCenterSnapshot();
  const users = userDirectoryRepository.getSnapshot();
  const services = serviceManagementRepository.getSnapshot();
  const studioOrders = readStudioOrders();
  const campaigns = campaignRepository.getSnapshot();
  const csr = adminEcosystemRepository.getCsrSnapshot();
  const internships = readLocalInternshipApplications();
  const csrApplications = readLocalCSRApplications();
  const metrics: AdminMetric[] = [
    {
      label: "Local Revenue",
      value: formatIdr(operations.metrics.totalRevenue),
      note: `${operations.transactions.length} transaksi pengguna`,
      trend: operations.transactions.length ? "Live" : "Belum ada data",
      icon: "revenue",
      progress: operations.metrics.projectedMonthEnd
        ? Math.min(100, Math.round((operations.metrics.totalRevenue / operations.metrics.projectedMonthEnd) * 100))
        : 0,
    },
    {
      label: "Registered Users",
      value: users.metrics.totalUsers.toLocaleString("id-ID"),
      note: `${users.metrics.activeNow} akun aktif`,
      trend: `${users.metrics.registrations} baru`,
      icon: "users",
    },
    {
      label: "Active Projects",
      value: `${services.metrics.activeProjects} Projects`,
      note: `${services.metrics.consultations} consultation requests`,
      trend: `${services.metrics.highPriority} priority`,
      icon: "projects",
    },
    {
      label: "Studio Orders",
      value: `${studioOrders.length} Orders`,
      note: studioOrders[0]?.item.productTitle ?? "Belum ada pesanan",
      trend: studioOrders.length ? "Local synced" : "Empty",
      icon: "orders",
    },
  ];
  const transactionStatus = (status: "Settled" | "Pending"): AdminTransaction["status"] =>
    status === "Settled" ? "Paid" : "Pending";
  const transactions: AdminTransaction[] = operations.transactions.slice(0, 8).map((transaction) => ({
    invoice: transaction.id,
    client: transaction.client,
    service: transaction.division,
    amount: formatIdr(transaction.amount),
    status: transactionStatus(transaction.status),
    date: transaction.date,
  }));
  const activities: AdminActivity[] = [
    ...services.requests.slice(0, 2).map((request) => ({
      actor: request.clientName,
      action: request.status,
      detail: request.serviceRequested,
      time: relativeTime(request.date),
    })),
    ...csrApplications.slice(0, 1).map((application) => ({
      actor: application.fullName,
      action: "CSR application",
      detail: application.focusArea,
      time: relativeTime(application.submittedAt),
    })),
    ...internships.slice(0, 1).map((application) => ({
      actor: application.fullName,
      action: "Internship application",
      detail: application.program,
      time: relativeTime(application.submittedAt),
    })),
  ].slice(0, 4);
  const totalDistribution = Math.max(1, ...operations.divisionShare.map((item) => item.value));
  return {
    metrics,
    revenueChart: operations.actualRevenue,
    ecosystemDistribution: operations.divisionShare.map((item) => ({
      label: item.label,
      value: `${item.value}%`,
      progress: Math.round((item.value / totalDistribution) * 100),
    })),
    transactions,
    activities: activities.length
      ? activities
      : [{ actor: "Local system", action: "Ready", detail: "Aktivitas pengguna akan tampil otomatis di sini.", time: "Live" }],
    programs: {
      internship: {
        totalApplicants: internships.length,
        interviews: 0,
        activeParticipants: 0,
      },
      donation: {
        donors: campaigns.metrics.totalDonors,
        collected: formatCampaignCompactCurrency(campaigns.metrics.totalCollected),
        targetProgress: campaigns.metrics.averageCompletion,
        distributed: formatCampaignCompactCurrency(0),
      },
      csr: {
        activePartners: csr.metrics.activePartners,
        runningPrograms: campaigns.metrics.activeGoals,
        pendingProposals: csrApplications.length,
      },
    },
  };
};

export const localAdminWorkspaceRepository: AdminWorkspaceRepository = {
  getOverviewSnapshot,
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(ADMIN_WORKSPACE_CHANGE_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(ADMIN_WORKSPACE_CHANGE_EVENT, listener);
    };
  },
};

// Seluruh UI Admin bergantung pada kontrak ini. Saat backend siap, ganti
import { apiAdminWorkspaceRepository } from "./apiAdminWorkspaceRepository";

export const adminWorkspaceRepository: AdminWorkspaceRepository =
  apiAdminWorkspaceRepository;
