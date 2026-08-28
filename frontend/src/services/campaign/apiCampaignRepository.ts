import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  CampaignDefinition,
  CampaignRecord,
  CampaignSnapshot,
  CampaignRepository,
} from "./campaignRepository";

const emptySnapshot: CampaignSnapshot = {
  campaigns: [],
  metrics: { totalCollected: 0, totalDonors: 0, activeGoals: 0, averageCompletion: 0 },
};

const CHANGE_EVENT = "mahreen:peduli-campaign-change";
let cachedSnapshot: CampaignSnapshot = emptySnapshot;
let fetchPromise: Promise<void> | null = null;

const fetchSnapshot = async () => {
  try {
    const [statsData, campaignsData] = await Promise.allSettled([
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.campaignStats),
      apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.campaigns),
    ]);

    const stats = statsData.status === "fulfilled" ? statsData.value : {} as Record<string, unknown>;
    const campaignsList = campaignsData.status === "fulfilled" && Array.isArray(campaignsData.value.items)
      ? campaignsData.value.items.map((c: Record<string, unknown>): CampaignRecord => ({
          id: String(c.id ?? ""), title: String(c.title ?? ""),
          category: (c.category as CampaignRecord["category"]) ?? "Education",
          location: String(c.location ?? ""),
          targetAmount: Number(c.target_amount ?? c.targetAmount ?? 0),
          endDate: String(c.end_date ?? c.endDate ?? ""),
          pic: String(c.pic ?? ""), story: String(c.story ?? ""),
          metaDescription: String(c.meta_description ?? c.metaDescription ?? ""),
          thumbnail: String(c.thumbnail ?? c.image ?? ""),
          gallery: Array.isArray(c.gallery) ? c.gallery.map(String) : [],
          visibility: (c.visibility as CampaignRecord["visibility"]) ?? "Public",
          publishSchedule: String(c.publish_schedule ?? c.publishSchedule ?? ""),
          allowAnonymous: Boolean(c.allow_anonymous ?? c.allowAnonymous),
          notifySubscribers: Boolean(c.notify_subscribers ?? c.notifySubscribers),
          status: (c.status as CampaignRecord["status"]) ?? "Draft",
          source: (c.source as CampaignRecord["source"]) ?? "admin",
          createdAt: String(c.created_at ?? c.createdAt ?? new Date().toISOString()),
          updatedAt: String(c.updated_at ?? c.updatedAt ?? new Date().toISOString()),
          collectedAmount: Number(c.collected_amount ?? c.collectedAmount ?? 0),
          donorCount: Number(c.donor_count ?? c.donorCount ?? 0),
          progress: Number(c.progress ?? 0),
          daysLeft: Number(c.days_left ?? c.daysLeft ?? 0),
        }))
      : [];

    cachedSnapshot = {
      campaigns: campaignsList,
      metrics: {
        totalCollected: Number(stats.totalRaised ?? stats.totalCollected ?? 0),
        totalDonors: Number(stats.totalDonors ?? 0),
        activeGoals: Number(stats.activeCampaigns ?? stats.activeGoals ?? 0),
        averageCompletion: Number(stats.targetAchievementPercentage ?? stats.averageCompletion ?? 0),
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

if (typeof window !== "undefined") {
  ensureFetched();
}

export const apiCampaignRepository: CampaignRepository = {
  getSnapshot() { return cachedSnapshot; },
  saveCampaign(input, existingId) {
    const optimistic: CampaignDefinition = {
      ...input,
      id: existingId || `campaign-${Date.now().toString(36)}`,
      source: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    cachedSnapshot = {
      ...cachedSnapshot,
      campaigns: [
        optimistic as CampaignRecord,
        ...cachedSnapshot.campaigns.filter((campaign) => campaign.id !== optimistic.id),
      ],
    };

    const request = existingId
      ? apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.campaign(existingId), {
          method: "PUT",
          body: input,
        })
      : apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.campaigns, {
          method: "POST",
          body: input,
        });

    void request.then(() => ensureFetched()).catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }

    return optimistic;
  },
  deleteCampaign(id) {
    const next = {
      ...cachedSnapshot,
      campaigns: cachedSnapshot.campaigns.filter((campaign) => campaign.id !== id),
    };
    cachedSnapshot = next;

    void apiClient<unknown>(API_ENDPOINTS.admin.campaign(id), { method: "DELETE" })
      .then(() => ensureFetched())
      .catch(() => undefined);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }

    return next;
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => { window.removeEventListener(CHANGE_EVENT, handler); };
  },
};
