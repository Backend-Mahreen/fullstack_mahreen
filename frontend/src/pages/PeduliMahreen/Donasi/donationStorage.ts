import type {
  DonationDonorInformation,
  DonationDraft,
  DonationPaymentMethodId,
} from "./donationTypes";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

export const DONATION_STORAGE_KEY = "mahreen:peduli-donation-draft";
export const DONATION_HISTORY_STORAGE_KEY = "mahreen:peduli-donation-history:v1";
export const DONATION_CHANGE_EVENT = "mahreen:peduli-donation-change";
export const DEFAULT_DONATION_CAMPAIGN_ID = "PM-EDU-2026";

const emptyDonor: DonationDonorInformation = {
  fullName: "",
  email: "",
  whatsapp: "",
  anonymous: false,
  message: "",
};

const isBrowser = () => typeof window !== "undefined";

const getStorageKey = () => DONATION_STORAGE_KEY;

const getHistoryStorageKey = () => DONATION_HISTORY_STORAGE_KEY;

export const createDonationDraft = (
  amount = 100_000,
  campaignId = DEFAULT_DONATION_CAMPAIGN_ID,
): DonationDraft => {
  const now = new Date().toISOString();

  return {
    campaignId,
    amount,
    donor: emptyDonor,
    paymentMethod: null,
    transactionId: createTransactionId(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
};

const createTransactionId = () => {
  const now = new Date();
  const token = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes(),
  ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  return `PMH-${token.slice(-10)}`;
};

export const getDonationDraft = (): DonationDraft => {
  if (!isBrowser()) return createDonationDraft();

  try {
    const raw = window.sessionStorage.getItem(getStorageKey());
    if (!raw) return createDonationDraft();

    const parsed = JSON.parse(raw) as Partial<DonationDraft>;

    if (!parsed || typeof parsed.amount !== "number" || parsed.amount <= 0) {
      return createDonationDraft();
    }

    return {
      campaignId:
        typeof parsed.campaignId === "string" && parsed.campaignId
          ? parsed.campaignId
          : DEFAULT_DONATION_CAMPAIGN_ID,
      amount: parsed.amount,
      donor: {
        ...emptyDonor,
        ...(parsed.donor ?? {}),
      },
      paymentMethod: parsed.paymentMethod ?? null,
      transactionId:
        typeof parsed.transactionId === "string" && parsed.transactionId
          ? parsed.transactionId
          : createTransactionId(),
      status: parsed.status === "paid" || parsed.status === "pending"
        ? parsed.status
        : "draft",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return createDonationDraft();
  }
};

export const saveDonationDraft = (draft: DonationDraft) => {
  if (!isBrowser()) return draft;

  const nextDraft: DonationDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(getStorageKey(), JSON.stringify(nextDraft));
  return nextDraft;
};

export const saveDonationAmount = (amount: number, campaignId?: string) => {
  const draft = getDonationDraft();
  if (draft.status === "paid") {
    return saveDonationDraft(createDonationDraft(amount, campaignId));
  }
  return saveDonationDraft({
    ...draft,
    campaignId: campaignId || draft.campaignId,
    amount,
    status: "draft",
  });
};

export const saveDonorInformation = (donor: DonationDonorInformation) => {
  const draft = getDonationDraft();
  return saveDonationDraft({
    ...draft,
    donor,
    status: "draft",
  });
};

export const saveDonationPaymentMethod = (paymentMethod: DonationPaymentMethodId) => {
  const draft = getDonationDraft();
  return saveDonationDraft({
    ...draft,
    paymentMethod,
    status: "draft",
  });
};

export const markDonationPaid = async () => {
  const draft = getDonationDraft();

  const apiResult = await apiClient<{
    transactionId: string;
    status: string;
    donorName: string;
    amount: number;
    paymentMethod: string;
    campaignId: string | null;
    campaign: string;
    message: string;
    isAnonymous: boolean;
    createdAt: string;
  }>(API_ENDPOINTS.donations.create, {
    method: "POST",
    body: {
      donor: {
        fullName: draft.donor.fullName,
        email: draft.donor.email,
        whatsapp: draft.donor.whatsapp,
        anonymous: draft.donor.anonymous,
        message: draft.donor.message,
      },
      amount: draft.amount,
      campaignId: draft.campaignId,
      paymentMethod: draft.paymentMethod,
    },
  });

  const paidDraft: DonationDraft = {
    ...draft,
    transactionId: apiResult.transactionId,
    status: "paid",
    createdAt: apiResult.createdAt,
    updatedAt: new Date().toISOString(),
  };

  // Store in sessionStorage for the current session
  if (isBrowser()) {
    try {
      window.sessionStorage.setItem(getStorageKey(), JSON.stringify(paidDraft));

      // Also store in history
      const raw = window.sessionStorage.getItem(getHistoryStorageKey());
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const history = Array.isArray(parsed)
        ? parsed.filter(
            (item): item is DonationDraft =>
              Boolean(
                item &&
                  typeof item === "object" &&
                  typeof (item as Partial<DonationDraft>).transactionId === "string",
              ),
          )
        : [];
      const nextHistory = [
        paidDraft,
        ...history.filter(
          (item) => item.transactionId !== paidDraft.transactionId,
        ),
      ];
      window.sessionStorage.setItem(
        getHistoryStorageKey(),
        JSON.stringify(nextHistory),
      );
      window.dispatchEvent(new CustomEvent(DONATION_CHANGE_EVENT));
    } catch {
      // The paid draft remains available even when persistent storage is blocked.
    }
  }

  return paidDraft;
};

export const readDonationHistory = (): DonationDraft[] => {
  if (!isBrowser()) return [];

  try {
    const raw = window.sessionStorage.getItem(getHistoryStorageKey());
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is DonationDraft => {
      if (!item || typeof item !== "object") return false;
      const record = item as Partial<DonationDraft>;
      return (
        record.status === "paid" &&
        typeof record.amount === "number" &&
        record.amount > 0 &&
        typeof record.transactionId === "string" &&
        typeof record.campaignId === "string"
      );
    });
  } catch {
    return [];
  }
};
