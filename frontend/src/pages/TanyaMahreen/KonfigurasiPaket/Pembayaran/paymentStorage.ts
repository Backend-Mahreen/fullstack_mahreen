import type {
  BillingInformationValue,
  PaymentDetailsValue,
  PaymentMethodId,
  ServicePaymentDraft,
  WebsitePackageSelection,
} from "./paymentTypes";
import type { AuthUser } from "../../../../types/auth";
import { AUTH_STORAGE_KEYS } from "../../../../services/auth/authConstants";
import {
  emitPlatformDataChange,
  readJson,
  writeJson,
} from "../../../../services/storage/browserStorage";

export const PAYMENT_DRAFT_KEY = "mahreen:service-payment-draft";
export const PAYMENT_MEETING_KEY = "mahreen:service-payment-meeting";
export const PAYMENT_HISTORY_KEY = "mahreen:service-payment-history:v1";
export const PAYMENT_MEETING_HISTORY_KEY = "mahreen:service-meeting-history:v1";
const allowedPaymentMethods: readonly PaymentMethodId[] = [
  "bank-transfer",
  "virtual-account",
  "e-wallet",
];

export type PaymentMeeting = {
  selectedDate: string;
  selectedTime: string;
  method: "Video Call";
  updatedAt: string;
};

export type StoredServicePaymentRecord = Omit<ServicePaymentDraft, "paymentDetails"> & {
  clientId: string;
  clientEmail: string;
};

export type StoredPaymentMeeting = PaymentMeeting & {
  transactionId: string;
  clientId: string;
};

const getCurrentUser = () =>
  readJson<AuthUser | null>("session", AUTH_STORAGE_KEYS.user, null) ??
  readJson<AuthUser | null>("local", AUTH_STORAGE_KEYS.user, null);

export const readServicePaymentHistory = () =>
  readJson<StoredServicePaymentRecord[]>("local", PAYMENT_HISTORY_KEY, [])
    .filter((item) => item && typeof item.transactionId === "string")
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));

export const readPaymentMeetingHistory = () =>
  readJson<StoredPaymentMeeting[]>("local", PAYMENT_MEETING_HISTORY_KEY, [])
    .filter((item) => item && typeof item.transactionId === "string")
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));

export const storeServicePaymentRecord = (draft: ServicePaymentDraft) => {
  const user = getCurrentUser();
  const { paymentDetails: _paymentDetails, ...safeDraft } = draft;
  void _paymentDetails;
  const record: StoredServicePaymentRecord = {
    ...safeDraft,
    clientId: user?.id ?? "anonymous",
    clientEmail: user?.email?.trim().toLowerCase() ?? "",
  };
  const history = readServicePaymentHistory();
  writeJson("local", PAYMENT_HISTORY_KEY, [
    record,
    ...history.filter((item) => item.transactionId !== record.transactionId),
  ]);
  return record;
};

export const getPaymentMeeting = (): PaymentMeeting | null => {
  if (typeof window === "undefined") return null;

  try {
    const rawMeeting = window.sessionStorage.getItem(PAYMENT_MEETING_KEY);
    if (!rawMeeting) return null;
    const meeting = JSON.parse(rawMeeting) as Partial<PaymentMeeting>;
    return typeof meeting.selectedDate === "string" &&
      typeof meeting.selectedTime === "string" &&
      meeting.method === "Video Call" &&
      typeof meeting.updatedAt === "string"
      ? (meeting as PaymentMeeting)
      : null;
  } catch {
    return null;
  }
};

export const savePaymentMeeting = (
  selectedDate: string,
  selectedTime: string,
): PaymentMeeting => {
  const meeting: PaymentMeeting = {
    selectedDate,
    selectedTime,
    method: "Video Call",
    updatedAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(PAYMENT_MEETING_KEY, JSON.stringify(meeting));
  const draft = getPaymentDraft();
  const user = getCurrentUser();
  if (draft) {
    const storedMeeting: StoredPaymentMeeting = {
      ...meeting,
      transactionId: draft.transactionId,
      clientId: user?.id ?? "anonymous",
    };
    const history = readPaymentMeetingHistory();
    writeJson("local", PAYMENT_MEETING_HISTORY_KEY, [
      storedMeeting,
      ...history.filter((item) => item.transactionId !== storedMeeting.transactionId),
    ]);
  } else {
    emitPlatformDataChange();
  }
  return meeting;
};

export const createTransactionId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const sequence = `${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
    .padStart(10, "0")
    .slice(-10);

  return `INV/${year}/${sequence}`;
};

export const savePaymentDraft = (draft: ServicePaymentDraft) => {
  // Draft hanya hidup selama sesi browser. Data pembayaran sensitif tidak
  // boleh disimpan di localStorage.
  window.localStorage.removeItem(PAYMENT_DRAFT_KEY);
  window.sessionStorage.setItem(PAYMENT_DRAFT_KEY, JSON.stringify(draft));
};

export const createAndSavePaymentDraft = (value: {
  selection: WebsitePackageSelection;
  billingInformation: BillingInformationValue;
  selectedMethod: PaymentMethodId;
  paymentDetails: PaymentDetailsValue;
  total: number;
}) => {
  const draft: ServicePaymentDraft = {
    ...value,
    transactionId: createTransactionId(),
    status: "pending",
    updatedAt: new Date().toISOString(),
  };

  savePaymentDraft(draft);
  return draft;
};

export const getPaymentDraft = (): ServicePaymentDraft | null => {
  if (typeof window === "undefined") return null;

  try {
    // Hapus format lama yang pernah menyimpan detail kartu secara persisten.
    window.localStorage.removeItem(PAYMENT_DRAFT_KEY);
    const rawDraft = window.sessionStorage.getItem(PAYMENT_DRAFT_KEY);
    if (!rawDraft) return null;

    const parsed = JSON.parse(rawDraft) as ServicePaymentDraft;

    if (
      !parsed ||
      typeof parsed.total !== "number" ||
      typeof parsed.transactionId !== "string" ||
      !allowedPaymentMethods.includes(parsed.selectedMethod) ||
      !parsed.paymentDetails ||
      !parsed.selection ||
      !parsed.billingInformation
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const markPaymentPaid = () => {
  const draft = getPaymentDraft();
  if (!draft) return null;

  const paidDraft: ServicePaymentDraft = {
    ...draft,
    status: "paid",
    updatedAt: new Date().toISOString(),
  };

  savePaymentDraft(paidDraft);
  storeServicePaymentRecord(paidDraft);
  return paidDraft;
};

export const getClientEmail = (fullName: string) => {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "") || "client";

  return `${slug}@client.mahreen.test`;
};
