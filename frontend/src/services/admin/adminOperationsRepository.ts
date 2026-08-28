import { AUTH_STORAGE_KEYS } from "../auth/authConstants";
import { readLocalCSRApplications } from "../csr/csrApplicationService";
import { readLocalInternshipApplications } from "../internship/internshipService";
import {
  emitPlatformDataChange,
  readJson,
  subscribeToPlatformData,
} from "../storage/browserStorage";
import { readAllWebinarRegistrations } from "../webinarRegistrationStorage";
import { readDonationHistory } from "../../pages/PeduliMahreen/Donasi/donationStorage";
import { getInitials } from "../../utils/formatName";
import { readStudioOrders } from "../../pages/Mahreen-Studio/Purchase/storage";
import { readServicePaymentHistory } from "../../pages/TanyaMahreen/KonfigurasiPaket/Pembayaran/paymentStorage";
import type { StoredAccount } from "../../types/auth";

export const ADMIN_OPERATIONS_STORAGE_KEY = "mahreen:admin:operations:v2";
export const ADMIN_OPERATIONS_CHANGE_EVENT = "mahreen:admin-operations-change";
const LEGACY_ADMIN_OPERATIONS_STORAGE_KEY = "mahreen:admin:operations:v1";

export type CommandCenterTransaction = {
  id: string;
  date: string;
  division: "Consultancy" | "Studio" | "Donations" | "CSR";
  client: string;
  amount: number;
  method: string;
  status: "Settled" | "Pending";
};

export type CommandCenterSnapshot = {
  metrics: {
    totalRevenue: number;
    averageDailyRevenue: number;
    projectedMonthEnd: number;
    profitMargin: number;
  };
  actualRevenue: number[];
  forecastRevenue: number[];
  divisionShare: Array<{ label: string; subtitle: string; value: number }>;
  transactions: CommandCenterTransaction[];
};

export type VerificationRequest = {
  id: string;
  name: string;
  initials: string;
  type: "Identity" | "Document" | "Credential";
  date: string;
  priority: "Urgent" | "Normal" | "High";
  status: "Pending" | "Under Review" | "Verified";
  ownerEmail?: string;
};

export type SecurityLog = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: "danger";
};

export type VerificationSnapshot = {
  metrics: {
    totalVerifications: number;
    auditQueue: number;
    identityMatchRate: number;
    securityStatus: string;
  };
  requests: VerificationRequest[];
  breakdown: Array<{ label: string; value: number }>;
  logs: SecurityLog[];
  networkHealth: number;
};

export type PortfolioRecord = {
  id: string;
  projectName: string;
  category: string;
  clientName: string;
  projectDate: string;
  description: string;
  technologies: string[];
  visibility: "Public" | "Private";
  userImpact: string;
  efficiencyGain: string;
  revenueGrowth: string;
  heroImage?: string;
  status: "Draft" | "Published";
  createdAt: string;
};

export type NewPortfolioRecord = Omit<PortfolioRecord, "id" | "createdAt">;

type StoredAdminOperations = {
  version: 2;
  portfolios: PortfolioRecord[];
  verificationOverrides: Record<string, VerificationRequest["status"]>;
  updatedAt: string;
};

export interface AdminOperationsRepository {
  getCommandCenterSnapshot(): CommandCenterSnapshot;
  getVerificationSnapshot(): VerificationSnapshot;
  updateVerificationStatus(id: string, status: VerificationRequest["status"]): VerificationSnapshot;
  getPortfolios(): PortfolioRecord[];
  savePortfolio(portfolio: NewPortfolioRecord): PortfolioRecord;
  subscribe(listener: () => void): () => void;
}

const emptyState = (): StoredAdminOperations => ({
  version: 2,
  portfolios: [],
  verificationOverrides: {},
  updatedAt: new Date().toISOString(),
});

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const normalizeEmail = (value: string | undefined) => value?.trim().toLowerCase() ?? "";
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date)
    : value;
};
const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(date)
    : "--:--:--";
};

const readOperations = (): StoredAdminOperations => {
  const fallback = emptyState();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(ADMIN_OPERATIONS_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_ADMIN_OPERATIONS_STORAGE_KEY);
    if (!raw) return fallback;
    const stored = JSON.parse(raw) as Partial<StoredAdminOperations> & {
      portfolios?: PortfolioRecord[];
    };
    return {
      version: 2,
      portfolios: Array.isArray(stored.portfolios) ? stored.portfolios : [],
      verificationOverrides:
        stored.verificationOverrides && typeof stored.verificationOverrides === "object"
          ? stored.verificationOverrides
          : {},
      updatedAt: stored.updatedAt || fallback.updatedAt,
    };
  } catch {
    return fallback;
  }
};

const writeOperations = (state: StoredAdminOperations) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(
      ADMIN_OPERATIONS_STORAGE_KEY,
      JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
    );
    window.dispatchEvent(new CustomEvent(ADMIN_OPERATIONS_CHANGE_EVENT));
    emitPlatformDataChange();
    return true;
  } catch {
    return false;
  }
};

type DatedTransaction = CommandCenterTransaction & { timestamp: string };

const getLocalTransactions = (): DatedTransaction[] => {
  const serviceTransactions: DatedTransaction[] = readServicePaymentHistory().map((payment) => ({
    id: payment.transactionId,
    timestamp: payment.updatedAt,
    date: formatDate(payment.updatedAt),
    division: "Consultancy",
    client: payment.billingInformation.companyName || payment.billingInformation.fullName,
    amount: payment.total,
    method: payment.selectedMethod.replaceAll("-", " "),
    status: payment.status === "paid" ? "Settled" : "Pending",
  }));
  const studioTransactions: DatedTransaction[] = readStudioOrders().map((order) => ({
    id: order.orderNumber,
    timestamp: order.createdAt,
    date: formatDate(order.createdAt),
    division: "Studio",
    client: order.shipping.fullName,
    amount: order.grandTotal,
    method: order.paymentMethod,
    status: "Settled",
  }));
  const donationTransactions: DatedTransaction[] = readDonationHistory().map((donation) => ({
    id: donation.transactionId,
    timestamp: donation.updatedAt,
    date: formatDate(donation.updatedAt),
    division: "Donations",
    client: donation.donor.anonymous ? "Anonymous Donor" : donation.donor.fullName || "Donor",
    amount: donation.amount,
    method: donation.paymentMethod ?? "Donation",
    status: "Settled",
  }));
  return [...serviceTransactions, ...studioTransactions, ...donationTransactions]
    .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp));
};

const getCommandCenterSnapshot = (): CommandCenterSnapshot => {
  const transactionsWithDates = getLocalTransactions();
  const settled = transactionsWithDates.filter((transaction) => transaction.status === "Settled");
  const totalRevenue = settled.reduce((total, transaction) => total + transaction.amount, 0);
  const activeDays = new Set(settled.map((transaction) => transaction.timestamp.slice(0, 10))).size;
  const averageDailyRevenue = activeDays ? Math.round(totalRevenue / activeDays) : 0;
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const projectedMonthEnd = averageDailyRevenue * daysInMonth;
  const recentDates = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (11 - index));
    return date.toISOString().slice(0, 10);
  });
  const dailyTotals = recentDates.map((date) =>
    settled
      .filter((transaction) => transaction.timestamp.slice(0, 10) === date)
      .reduce((total, transaction) => total + transaction.amount, 0),
  );
  const chartMax = Math.max(1, ...dailyTotals);
  const actualRevenue = dailyTotals.map((value) => Math.round((value / chartMax) * 70));
  const forecastRevenue = dailyTotals.map((_, index) => {
    const values = dailyTotals.slice(0, index + 1).filter((value) => value > 0);
    const average = values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
    return Math.round((average / chartMax) * 70);
  });
  const divisionConfig = [
    ["Tanya Mahreen", "Consultancy & Advisory", "Consultancy"],
    ["Mahreen Studio", "Retail & Production", "Studio"],
    ["Peduli Mahreen", "Community Donations", "Donations"],
    ["Mahreen CSR", "Corporate Sustainability", "CSR"],
  ] as const;
  const divisionShare = divisionConfig.map(([label, subtitle, division]) => {
    const amount = settled
      .filter((transaction) => transaction.division === division)
      .reduce((total, transaction) => total + transaction.amount, 0);
    return { label, subtitle, value: totalRevenue ? Math.round((amount / totalRevenue) * 100) : 0 };
  });
  return {
    metrics: {
      totalRevenue,
      averageDailyRevenue,
      projectedMonthEnd,
      profitMargin: 0,
    },
    actualRevenue,
    forecastRevenue,
    divisionShare,
    transactions: transactionsWithDates.map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      division: transaction.division,
      client: transaction.client,
      amount: transaction.amount,
      method: transaction.method,
      status: transaction.status,
    })),
  };
};

const readAccounts = () =>
  readJson<StoredAccount[]>("local", AUTH_STORAGE_KEYS.accounts, []).filter(
    (account) => account && typeof account.id === "string" && typeof account.email === "string",
  );

const getVerificationSnapshot = (): VerificationSnapshot => {
  const overrides = readOperations().verificationOverrides;
  const accounts: VerificationRequest[] = readAccounts().map((account) => ({
    id: `IDENTITY:${account.id}`,
    name: account.fullName,
    initials: getInitials(account.fullName),
    type: "Identity",
    date: formatDate(account.createdAt),
    priority: "Normal",
    status: overrides[`IDENTITY:${account.id}`] ?? "Verified",
    ownerEmail: normalizeEmail(account.email),
  }));
  const csrRequests: VerificationRequest[] = readLocalCSRApplications().map((application) => ({
    id: `CSR:${application.applicationId}`,
    name: application.fullName,
    initials: getInitials(application.fullName),
    type: "Document",
    date: formatDate(application.submittedAt),
    priority: application.document ? "High" : "Normal",
    status: overrides[`CSR:${application.applicationId}`] ?? "Under Review",
    ownerEmail: normalizeEmail(application.email),
  }));
  const internshipRequests: VerificationRequest[] = readLocalInternshipApplications().map((application) => ({
    id: `INTERN:${application.applicationId}`,
    name: application.fullName,
    initials: getInitials(application.fullName),
    type: "Credential",
    date: formatDate(application.submittedAt),
    priority: "Normal",
    status: overrides[`INTERN:${application.applicationId}`] ?? "Under Review",
    ownerEmail: normalizeEmail(application.email),
  }));
  const webinarRequests: VerificationRequest[] = readAllWebinarRegistrations().map((registration) => ({
    id: `WEBINAR:${registration.id}`,
    name: registration.fullName,
    initials: getInitials(registration.fullName),
    type: "Credential",
    date: formatDate(registration.createdAt),
    priority: "Normal",
    status: overrides[`WEBINAR:${registration.id}`] ?? (registration.status === "confirmed" ? "Verified" : "Pending"),
    ownerEmail: normalizeEmail(registration.email),
  }));
  const requests = [...accounts, ...csrRequests, ...internshipRequests, ...webinarRequests];
  const total = requests.length;
  const verified = requests.filter((request) => request.status === "Verified").length;
  const types = ["Identity", "Document", "Credential"] as const;
  const breakdown = types.map((label) => ({
    label,
    value: total ? Math.round((requests.filter((request) => request.type === label).length / total) * 100) : 0,
  }));
  const logs: SecurityLog[] = requests.slice(0, 4).map((request) => ({
    id: `LOG:${request.id}`,
    title: `${request.type} ${request.status}`,
    detail: `${request.name} · ${request.id}`,
    time: formatTime(new Date().toISOString()),
  }));
  return {
    metrics: {
      totalVerifications: total,
      auditQueue: requests.filter((request) => request.status !== "Verified").length,
      identityMatchRate: total ? Number(((verified / total) * 100).toFixed(1)) : 0,
      securityStatus: "Local Secured",
    },
    requests,
    breakdown,
    logs,
    networkHealth: typeof window !== "undefined" && window.localStorage ? 100 : 0,
  };
};

export const localAdminOperationsRepository: AdminOperationsRepository = {
  getCommandCenterSnapshot: () => clone(getCommandCenterSnapshot()),
  getVerificationSnapshot: () => clone(getVerificationSnapshot()),
  updateVerificationStatus(id, status) {
    const state = readOperations();
    if (!writeOperations({
      ...state,
      verificationOverrides: { ...state.verificationOverrides, [id]: status },
    })) {
      throw new Error("Penyimpanan status verifikasi tidak tersedia.");
    }
    return getVerificationSnapshot();
  },
  getPortfolios: () => clone(readOperations().portfolios),
  savePortfolio(input) {
    const state = readOperations();
    const portfolio: PortfolioRecord = {
      ...input,
      id: `PORT-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    if (!writeOperations({ ...state, portfolios: [portfolio, ...state.portfolios] })) {
      throw new Error("Penyimpanan lokal Admin tidak tersedia.");
    }
    return portfolio;
  },
  subscribe(listener) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(ADMIN_OPERATIONS_CHANGE_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(ADMIN_OPERATIONS_CHANGE_EVENT, listener);
    };
  },
};

// Ganti ekspor aktif ini dengan adapter API yang menerapkan kontrak yang sama
import { apiAdminOperationsRepository } from "./apiAdminOperationsRepository";

export const adminOperationsRepository: AdminOperationsRepository =
  apiAdminOperationsRepository;
