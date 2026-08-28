import type {
  CampaignCategory,
  CampaignDefinition,
  CampaignStatus,
  CampaignVisibility,
  NewCampaignInput,
} from "../../../../services/campaign/campaignRepository";

export type CampaignFormData = {
  title: string;
  category: CampaignCategory;
  location: string;
  targetAmount: string;
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
};

export const createEmptyCampaignForm = (): CampaignFormData => ({
  title: "",
  category: "Education",
  location: "",
  targetAmount: "",
  endDate: "",
  pic: "Admin Mahreen",
  story: "",
  metaDescription: "",
  thumbnail: "",
  gallery: [],
  visibility: "Public",
  publishSchedule: "",
  allowAnonymous: true,
  notifySubscribers: false,
  status: "Draft",
});

export const mapCampaignToForm = (
  campaign?: CampaignDefinition | null,
): CampaignFormData =>
  campaign
    ? {
        title: campaign.title,
        category: campaign.category,
        location: campaign.location,
        targetAmount: String(campaign.targetAmount || ""),
        endDate: campaign.endDate,
        pic: campaign.pic,
        story: campaign.story,
        metaDescription: campaign.metaDescription,
        thumbnail: campaign.thumbnail,
        gallery: campaign.gallery,
        visibility: campaign.visibility,
        publishSchedule: campaign.publishSchedule,
        allowAnonymous: campaign.allowAnonymous,
        notifySubscribers: campaign.notifySubscribers,
        status: campaign.status,
      }
    : createEmptyCampaignForm();

export const mapFormToCampaignInput = (
  form: CampaignFormData,
  status: CampaignStatus,
): NewCampaignInput => ({
  title: form.title,
  category: form.category,
  location: form.location,
  targetAmount: Number(form.targetAmount.replace(/\D/g, "")) || 0,
  endDate: form.endDate,
  pic: form.pic,
  story: form.story,
  metaDescription: form.metaDescription,
  thumbnail: form.thumbnail,
  gallery: form.gallery,
  visibility: form.visibility,
  publishSchedule: form.publishSchedule,
  allowAnonymous: form.allowAnonymous,
  notifySubscribers: form.notifySubscribers,
  status,
});

export const getCampaignFormCompletion = (form: CampaignFormData) => {
  const requirements = [
    form.title.trim(),
    form.location.trim(),
    form.targetAmount,
    form.endDate,
    form.pic.trim(),
    form.story.trim(),
    form.metaDescription.trim(),
    form.thumbnail,
  ];
  return Math.round(
    (requirements.filter(Boolean).length / requirements.length) * 100,
  );
};
