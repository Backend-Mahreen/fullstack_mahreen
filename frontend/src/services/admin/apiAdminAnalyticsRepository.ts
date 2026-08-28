import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type AdminAnalyticsTrafficPoint = {
  date: string;
  pageViews: number;
  sessions: number;
};

export type AdminAnalyticsTopPage = {
  path: string;
  category: string;
  pageViews: number;
  uniqueSessions: number;
  percentage: number;
};

export type AdminAnalyticsDevice = {
  device: string;
  count: number;
  percentage: number;
};

export type AdminAnalyticsFunnelStage = {
  stage: string;
  count: number;
  conversionFromStart: number;
  conversionFromPrevious: number;
};

export type AdminAnalyticsEcosystemVertical = {
  key: string;
  label: string;
  revenue: number;
  revenueShare: number;
  metricLabel: string;
  metricValue: number;
};

export type AdminAnalyticsSnapshot = {
  days: number;
  pageViews: { total: number; current: number; previous: number; changePercentage: number };
  sessions: { total: number; current: number; previous: number; changePercentage: number };
  users: { total: number; current: number; previous: number; changePercentage: number };
  revenue: { total: number; current: number; previous: number; changePercentage: number };
  articleViews: number;
  donationRaised: number;
  averagePagesPerSession: number;
  trafficSources: { source: string; count: number; percentage: number }[];
  traffic: AdminAnalyticsTrafficPoint[];
  topPages: AdminAnalyticsTopPage[];
  devices: AdminAnalyticsDevice[];
  funnel: AdminAnalyticsFunnelStage[];
  ecosystem: {
    totalRevenue: number;
    verticals: AdminAnalyticsEcosystemVertical[];
  };
};

const asNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const emptySnapshot = (days = 30): AdminAnalyticsSnapshot => ({
  days,
  pageViews: { total: 0, current: 0, previous: 0, changePercentage: 0 },
  sessions: { total: 0, current: 0, previous: 0, changePercentage: 0 },
  users: { total: 0, current: 0, previous: 0, changePercentage: 0 },
  revenue: { total: 0, current: 0, previous: 0, changePercentage: 0 },
  articleViews: 0,
  donationRaised: 0,
  averagePagesPerSession: 0,
  trafficSources: [],
  traffic: [],
  topPages: [],
  devices: [],
  funnel: [],
  ecosystem: { totalRevenue: 0, verticals: [] },
});

const CHANGE_EVENT = "mahreen:admin-analytics-change";
let cachedSnapshot: AdminAnalyticsSnapshot = emptySnapshot();
let fetchPromise: Promise<AdminAnalyticsSnapshot> | null = null;

const fetchAnalytics = async (): Promise<AdminAnalyticsSnapshot> => {
  try {
    const [overview, traffic, topPages, devices, funnel, ecosystem] = await Promise.all([
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.analyticsOverview),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.analyticsTraffic),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.analyticsTopPages),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.analyticsDevices),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.analyticsFunnel),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.analyticsEcosystem),
    ]);

    const pageViews = (overview.pageViews ?? {}) as Record<string, unknown>;
    const sessions = (overview.sessions ?? {}) as Record<string, unknown>;
    const users = (overview.users ?? {}) as Record<string, unknown>;
    const revenue = (overview.revenue ?? {}) as Record<string, unknown>;

    const snapshot: AdminAnalyticsSnapshot = {
      days: asNumber(overview.periodDays) || 30,
      pageViews: {
        total: asNumber(pageViews.total),
        current: asNumber(pageViews.current),
        previous: asNumber(pageViews.previous),
        changePercentage: asNumber(pageViews.changePercentage),
      },
      sessions: {
        total: asNumber(sessions.total),
        current: asNumber(sessions.current),
        previous: asNumber(sessions.previous),
        changePercentage: asNumber(sessions.changePercentage),
      },
      users: {
        total: asNumber(users.total),
        current: asNumber(users.current),
        previous: asNumber(users.previous),
        changePercentage: asNumber(users.changePercentage),
      },
      revenue: {
        total: asNumber(revenue.total),
        current: asNumber(revenue.current),
        previous: asNumber(revenue.previous),
        changePercentage: asNumber(revenue.changePercentage),
      },
      articleViews: asNumber(overview.articleViews),
      donationRaised: asNumber(overview.donationRaised),
      averagePagesPerSession: asNumber(overview.averagePagesPerSession),
      trafficSources: Array.isArray(overview.trafficSources)
        ? (overview.trafficSources as Record<string, unknown>[]).map((item) => ({
            source: String(item.source ?? ""),
            count: asNumber(item.count),
            percentage: asNumber(item.percentage),
          }))
        : [],
      traffic: Array.isArray(traffic)
        ? (traffic as Record<string, unknown>[]).map((item) => ({
            date: String(item.date ?? ""),
            pageViews: asNumber(item.pageViews),
            sessions: asNumber(item.sessions),
          }))
        : [],
      topPages: Array.isArray(topPages)
        ? (topPages as Record<string, unknown>[]).map((item) => ({
            path: String(item.path ?? ""),
            category: String(item.category ?? ""),
            pageViews: asNumber(item.pageViews),
            uniqueSessions: asNumber(item.uniqueSessions),
            percentage: asNumber(item.percentage),
          }))
        : [],
      devices: Array.isArray(devices)
        ? (devices as Record<string, unknown>[]).map((item) => ({
            device: String(item.device ?? ""),
            count: asNumber(item.count),
            percentage: asNumber(item.percentage),
          }))
        : [],
      funnel: Array.isArray(funnel)
        ? (funnel as Record<string, unknown>[]).map((item) => ({
            stage: String(item.stage ?? ""),
            count: asNumber(item.count),
            conversionFromStart: asNumber(item.conversionFromStart),
            conversionFromPrevious: asNumber(item.conversionFromPrevious),
          }))
        : [],
      ecosystem: {
        totalRevenue: asNumber(ecosystem.totalRevenue),
        verticals: Array.isArray(ecosystem.verticals)
          ? (ecosystem.verticals as Record<string, unknown>[]).map((item) => ({
              key: String(item.key ?? ""),
              label: String(item.label ?? ""),
              revenue: asNumber(item.revenue),
              revenueShare: asNumber(item.revenueShare),
              metricLabel: String(item.metricLabel ?? ""),
              metricValue: asNumber(item.metricValue),
            }))
          : [],
      },
    };

    return snapshot;
  } catch {
    return emptySnapshot();
  }
};

const ensureFetched = () => {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchAnalytics().then((snapshot) => {
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

if (typeof window !== "undefined") {
  ensureFetched();
}

export const adminAnalyticsRepository = {
  getSnapshot() {
    return cachedSnapshot;
  },

  refresh() {
    return ensureFetched();
  },

  subscribe(listener: () => void) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
    };
  },
};
