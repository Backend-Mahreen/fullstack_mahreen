import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { formatIdr } from "../../utils/formatCurrency";
import type {
  AdminActivity,
  AdminMetric,
  AdminTransaction,
} from "../../pages/DashboardAdmin/types";
import type {
  AdminEcosystemDistribution,
  AdminOverviewSnapshot,
  AdminProgramSnapshot,
  AdminWorkspaceRepository,
} from "./adminWorkspaceRepository";

type ApiOverviewResponse = {
  metrics?: AdminMetric[] | Record<string, unknown>;
  revenueChart?: number[];
  actualRevenue?: number[];
  ecosystemDistribution?: AdminEcosystemDistribution[];
  divisionShare?: Record<string, unknown>[];
  transactions?: AdminTransaction[];
  activities?: AdminActivity[];
  programs?: AdminProgramSnapshot;
  totalUsers?: number;
  activeUsers?: number;
  newRegistrations?: number;
  activeProjects?: number;
  consultationRequests?: number;
  highPriority?: number;
  studioOrders?: number;
  totalRevenue?: number;
  recentTransactions?: AdminTransaction[];
  systemActivities?: AdminActivity[];
};

const emptySnapshot: AdminOverviewSnapshot = {
  metrics: [],
  revenueChart: [],
  ecosystemDistribution: [],
  transactions: [],
  activities: [],
  programs: {
    internship: { totalApplicants: 0, interviews: 0, activeParticipants: 0 },
    donation: { donors: 0, collected: "Rp 0", targetProgress: 0, distributed: "Rp 0" },
    csr: { activePartners: 0, runningPrograms: 0, pendingProposals: 0 },
  },
};

const CHANGE_EVENT = "mahreen:admin-workspace-change";
let cachedSnapshot: AdminOverviewSnapshot = emptySnapshot;
let fetchPromise: Promise<AdminOverviewSnapshot> | null = null;

const fetchOverview = async (): Promise<AdminOverviewSnapshot> => {
  try {
    const data = await apiClient<ApiOverviewResponse>(API_ENDPOINTS.admin.commandCenter);

    const mapTransactions = (raw: unknown): AdminTransaction[] => {
      if (!Array.isArray(raw)) return [];
      return (raw as Record<string, unknown>[]).map((t, index) => {
        const rawStatus = String(t.status ?? "");
        const status: AdminTransaction["status"] =
          rawStatus === "Settled" || rawStatus === "Paid"
            ? "Paid"
            : rawStatus === "Review"
              ? "Review"
              : "Pending";
        const amountValue = t.amount;
        const amount =
          typeof amountValue === "number"
            ? formatIdr(amountValue)
            : String(amountValue ?? "");
        return {
          invoice: String(t.invoice ?? t.id ?? `TRX-${index}`),
          client: String(t.client ?? t.client_name ?? ""),
          service: String(t.service ?? t.division ?? ""),
          amount,
          status,
          date: String(t.date ?? ""),
        };
      });
    };

    if (Array.isArray(data.metrics)) {
      return {
        metrics: data.metrics,
        revenueChart: data.revenueChart ?? [],
        ecosystemDistribution: data.ecosystemDistribution ?? [],
        transactions: mapTransactions(data.transactions),
        activities: data.activities ?? [],
        programs: data.programs ?? emptySnapshot.programs,
      };
    }

    const m = (data.metrics ?? {}) as Record<string, unknown>;
    const metrics: AdminMetric[] = [
      {
        label: "Revenue",
        value: formatIdr(Number(m.totalRevenue ?? data.totalRevenue ?? 0)),
        note: `Avg ${formatIdr(Number(m.averageDailyRevenue ?? 0))}/hari`,
        trend: "Live",
        icon: "revenue",
        progress: 0,
      },
      {
        label: "Registered Users",
        value: (data.totalUsers ?? 0).toLocaleString("id-ID"),
        note: `${data.activeUsers ?? 0} akun aktif`,
        trend: `${data.newRegistrations ?? 0} baru`,
        icon: "users",
      },
      {
        label: "Active Projects",
        value: `${data.activeProjects ?? 0} Projects`,
        note: `${data.consultationRequests ?? 0} consultation requests`,
        trend: `${data.highPriority ?? 0} priority`,
        icon: "projects",
      },
      {
        label: "Studio Orders",
        value: `${data.studioOrders ?? 0} Orders`,
        note: "Studio products",
        trend: "Live",
        icon: "orders",
      },
    ];

    const divisionShare = Array.isArray(data.divisionShare)
      ? (data.divisionShare as Record<string, unknown>[]).map((item) => ({
          label: String(item.label ?? ""),
          value: `${Number(item.value ?? 0)}%`,
          progress: Number(item.value ?? 0),
        }))
      : [];

    return {
      metrics,
      revenueChart: data.revenueChart ?? data.actualRevenue ?? [],
      ecosystemDistribution: data.ecosystemDistribution ?? divisionShare,
      transactions: mapTransactions(data.recentTransactions ?? data.transactions),
      activities: data.systemActivities ?? data.activities ?? [],
      programs: data.programs ?? emptySnapshot.programs,
    };
  } catch {
    return emptySnapshot;
  }
};

const loadOverview = () => {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchOverview().then((snapshot) => {
    cachedSnapshot = snapshot;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }
    return snapshot;
  }).finally(() => {
    fetchPromise = null;
  });
  return fetchPromise;
};

// Trigger initial fetch
if (typeof window !== "undefined") {
  loadOverview();
}

export const apiAdminWorkspaceRepository: AdminWorkspaceRepository = {
  getOverviewSnapshot() {
    return cachedSnapshot;
  },

  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
    };
  },
};

export const fetchAdminOverview = fetchOverview;
export const refreshAdminOverview = async () => {
  fetchPromise = null;
  return loadOverview();
};
