import {
  DONATION_CHANGE_EVENT,
  readDonationHistory,
} from "../../pages/PeduliMahreen/Donasi/donationStorage";
import { emitPlatformDataChange } from "../storage/browserStorage";

export const CAMPAIGN_STORAGE_KEY = "mahreen:admin:peduli-campaigns:v1";
export const CAMPAIGN_CHANGE_EVENT = "mahreen:peduli-campaign-change";

export type CampaignCategory =
  | "Emergency"
  | "Education"
  | "Sustainable Life"
  | "Health";
export type CampaignStatus = "Draft" | "Published" | "Archived";
export type CampaignVisibility = "Public" | "Admin Only";

export type CampaignDefinition = {
  id: string;
  title: string;
  category: CampaignCategory;
  location: string;
  targetAmount: number;
  endDate: string;
  pic: string;
  story: string;
  metaDescription: string;
  thumbnail: string;
  gallery: string[];
  visibility: CampaignVisibility;
  publishSchedule: string;
  allowAnonymous: boolean;
  notifySubscribers: boolean;
  status: CampaignStatus;
  source: "starter" | "admin";
  createdAt: string;
  updatedAt: string;
};

export type NewCampaignInput = Omit<
  CampaignDefinition,
  "id" | "source" | "createdAt" | "updatedAt"
>;

export type CampaignRecord = CampaignDefinition & {
  collectedAmount: number;
  donorCount: number;
  progress: number;
  daysLeft: number;
};

export type CampaignMetrics = {
  totalCollected: number;
  totalDonors: number;
  activeGoals: number;
  averageCompletion: number;
};

export type CampaignSnapshot = {
  campaigns: CampaignRecord[];
  metrics: CampaignMetrics;
};

type StoredCampaignState = {
  campaigns: CampaignDefinition[];
};

export interface CampaignRepository {
  getSnapshot(): CampaignSnapshot;
  saveCampaign(input: NewCampaignInput, existingId?: string): CampaignDefinition;
  deleteCampaign(id: string): CampaignSnapshot;
  subscribe(listener: () => void): () => void;
}

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const readState = (): StoredCampaignState => {
  const fallback = { campaigns: [] as CampaignDefinition[] };
  if (typeof window === "undefined") return fallback;
  const stored = safeParse<Partial<StoredCampaignState>>(
    window.localStorage.getItem(CAMPAIGN_STORAGE_KEY),
    {},
  );
  if (!Array.isArray(stored.campaigns)) {
    return fallback;
  }
  return { campaigns: stored.campaigns };
};

const writeState = (state: StoredCampaignState) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CAMPAIGN_CHANGE_EVENT));
    emitPlatformDataChange();
    return true;
  } catch {
    return false;
  }
};

const getDaysLeft = (endDate: string) => {
  const end = new Date(`${endDate}T23:59:59`);
  if (!Number.isFinite(end.getTime())) return 0;
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
};

const getSnapshot = (): CampaignSnapshot => {
  const state = readState();
  const paidDonations = readDonationHistory();
  const campaigns = state.campaigns
    .map((campaign): CampaignRecord => {
      const donations = paidDonations.filter(
        (donation) => donation.campaignId === campaign.id,
      );
      const collectedAmount = donations.reduce(
        (total, donation) => total + donation.amount,
        0,
      );
      const progress = campaign.targetAmount
        ? Math.min(100, Math.round((collectedAmount / campaign.targetAmount) * 100))
        : 0;
      return {
        ...campaign,
        collectedAmount,
        donorCount: donations.length,
        progress,
        daysLeft: getDaysLeft(campaign.endDate),
      };
    })
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const visibleCampaigns = campaigns.filter(
    (campaign) => campaign.status === "Published" && campaign.visibility === "Public",
  );
  const activeCampaigns = visibleCampaigns.filter(
    (campaign) => campaign.daysLeft > 0,
  );
  const totalCollected = visibleCampaigns.reduce(
    (total, campaign) => total + campaign.collectedAmount,
    0,
  );
  const totalDonors = visibleCampaigns.reduce(
    (total, campaign) => total + campaign.donorCount,
    0,
  );
  const averageCompletion = activeCampaigns.length
    ? Math.round(
        activeCampaigns.reduce((total, campaign) => total + campaign.progress, 0) /
          activeCampaigns.length,
      )
    : 0;

  return {
    campaigns,
    metrics: {
      totalCollected,
      totalDonors,
      activeGoals: activeCampaigns.length,
      averageCompletion,
    },
  };
};

export const localCampaignRepository: CampaignRepository = {
  getSnapshot,
  saveCampaign(input, existingId) {
    const state = readState();
    const now = new Date().toISOString();
    const existing = existingId
      ? state.campaigns.find((campaign) => campaign.id === existingId)
      : undefined;
    const campaign: CampaignDefinition = {
      ...input,
      id: existing?.id ?? `PM-${Date.now().toString(36).toUpperCase()}`,
      title: input.title.trim() || "Campaign Tanpa Judul",
      location: input.location.trim(),
      targetAmount: Math.max(0, Number(input.targetAmount) || 0),
      pic: input.pic.trim(),
      story: input.story.trim(),
      metaDescription: input.metaDescription.trim(),
      thumbnail: input.thumbnail,
      gallery: input.gallery.filter(Boolean).slice(0, 4),
      source: "admin",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const persisted = writeState({
      campaigns: [
        campaign,
        ...state.campaigns.filter((item) => item.id !== campaign.id),
      ],
    });
    if (!persisted) throw new Error("Campaign storage quota exceeded");
    return campaign;
  },
  deleteCampaign(id) {
    const state = readState();
    const persisted = writeState({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
    });
    if (!persisted) throw new Error("Campaign storage is unavailable");
    return getSnapshot();
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener("storage", listener);
    window.addEventListener(CAMPAIGN_CHANGE_EVENT, listener);
    window.addEventListener(DONATION_CHANGE_EVENT, listener);
    return () => {
      window.removeEventListener("storage", listener);
      window.removeEventListener(CAMPAIGN_CHANGE_EVENT, listener);
      window.removeEventListener(DONATION_CHANGE_EVENT, listener);
    };
  },
};

// Replace this export with an API adapter when the backend endpoint is ready.
import { apiCampaignRepository } from "./apiCampaignRepository";

export const campaignRepository: CampaignRepository = apiCampaignRepository;

export const formatCampaignCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCampaignCompactCurrency = (value: number) => {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  return formatCampaignCurrency(value);
};
