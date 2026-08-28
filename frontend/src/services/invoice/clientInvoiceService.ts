import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { env } from "../../config/env";
import type { ClientInvoice } from "../../pages/Akun/invoice/types";
import {
  getPaymentDraft,
  readServicePaymentHistory,
} from "../../pages/TanyaMahreen/KonfigurasiPaket/Pembayaran/paymentStorage";
import type { AuthUser } from "../../types/auth";
import { clientNotificationService } from "../notifications/clientNotificationService";
import { runWithDataSource } from "../serviceMode";
import {
  emitPlatformDataChange,
  subscribeToPlatformData,
} from "../storage/browserStorage";

const STORAGE_PREFIX = "mahreen:client-invoices:v1";
const INVOICE_EVENT = "mahreen:client-invoices-change";

const normalizeIdentity = (value: string | null | undefined) =>
  value?.trim().toLowerCase() ?? "";

const storageKey = (userId: string) => {
  const safeId = userId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${STORAGE_PREFIX}:${safeId || "anonymous"}`;
};

const demoInvoices = (): ClientInvoice[] => [
  {
    id: "demo-invoice-001",
    code: "INV-2026-001",
    project: "Redesign Website",
    issuedAt: "2026-06-01T08:00:00.000Z",
    dueAt: "2026-06-15T08:00:00.000Z",
    amount: 3_750_000,
    status: "paid",
    updatedAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "demo-invoice-002",
    code: "INV-2026-002",
    project: "Brand Identity",
    issuedAt: "2026-05-15T08:00:00.000Z",
    dueAt: "2026-05-29T08:00:00.000Z",
    amount: 2_250_000,
    status: "paid",
    updatedAt: "2026-05-15T08:00:00.000Z",
  },
  {
    id: "demo-invoice-003",
    code: "INV-2026-003",
    project: "Social Media July",
    issuedAt: "2026-07-01T08:00:00.000Z",
    dueAt: "2026-07-15T08:00:00.000Z",
    amount: 3_000_000,
    status: "pending",
    updatedAt: "2026-07-01T08:00:00.000Z",
  },
  {
    id: "demo-invoice-004",
    code: "INV-2026-004",
    project: "Redesign Website (DP 50%)",
    issuedAt: "2026-01-01T08:00:00.000Z",
    dueAt: "2026-01-08T08:00:00.000Z",
    amount: 3_750_000,
    status: "overdue",
    updatedAt: "2026-01-08T08:00:00.000Z",
  },
];

const isInvoice = (value: unknown): value is ClientInvoice => {
  if (!value || typeof value !== "object") return false;
  const invoice = value as Partial<ClientInvoice>;
  return Boolean(
    invoice.id &&
      invoice.code &&
      invoice.project &&
      invoice.issuedAt &&
      invoice.dueAt &&
      typeof invoice.amount === "number" &&
      ["paid", "pending", "overdue"].includes(invoice.status ?? "") &&
      invoice.updatedAt,
  );
};

const readStored = (userId: string): ClientInvoice[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(storageKey(userId)) ?? "[]",
    );
    return Array.isArray(parsed) ? parsed.filter(isInvoice) : [];
  } catch {
    return [];
  }
};

const writeStored = (userId: string, invoices: ClientInvoice[]) => {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(invoices);
  if (window.localStorage.getItem(storageKey(userId)) === serialized) return;
  window.localStorage.setItem(storageKey(userId), serialized);
  window.dispatchEvent(new CustomEvent(INVOICE_EVENT));
  emitPlatformDataChange();
};

const fromLocalPayments = (user: AuthUser): ClientInvoice[] => {
  const email = normalizeIdentity(user.email);
  const records = readServicePaymentHistory().filter(
    (record) =>
      record.clientId === user.id || normalizeIdentity(record.clientEmail) === email,
  );
  const sessionDraft = getPaymentDraft();
  const sessionRecords = sessionDraft &&
    normalizeIdentity(sessionDraft.billingInformation.fullName) ===
      normalizeIdentity(user.fullName)
    ? [sessionDraft]
    : [];

  return [...records, ...sessionRecords].map((record) => {
    const issuedAt = record.updatedAt;
    const dueAt = new Date(Date.parse(issuedAt) + 14 * 24 * 60 * 60 * 1_000);
    const status = record.status === "paid"
      ? "paid"
      : dueAt.getTime() < Date.now()
        ? "overdue"
        : "pending";
    return {
      id: `service:${record.transactionId}`,
      code: record.transactionId.replaceAll("/", "-"),
      project: record.selection.tier.name,
      issuedAt,
      dueAt: dueAt.toISOString(),
      amount: record.total,
      status,
      updatedAt: record.updatedAt,
    } satisfies ClientInvoice;
  });
};

const mergeInvoices = (...groups: ClientInvoice[][]) => {
  const records = new Map<string, ClientInvoice>();
  groups.flat().forEach((invoice) => {
    const current = records.get(invoice.id);
    if (
      !current ||
      Date.parse(invoice.updatedAt) >= Date.parse(current.updatedAt)
    ) {
      records.set(invoice.id, invoice);
    }
  });
  return [...records.values()].sort(
    (left, right) => Date.parse(right.issuedAt) - Date.parse(left.issuedAt),
  );
};

const loadLocal = (user: AuthUser) => {
  const stored = readStored(user.id);
  const base = stored.length ? stored : demoInvoices();
  const invoices = mergeInvoices(base, fromLocalPayments(user));
  writeStored(user.id, invoices);
  return invoices;
};

const payLocal = (user: AuthUser, invoiceId: string, paymentMethod: string) => {
  const invoices = loadLocal(user).map((invoice) =>
    invoice.id === invoiceId
      ? {
          ...invoice,
          status: "paid" as const,
          paymentMethod,
          updatedAt: new Date().toISOString(),
        }
      : invoice,
  );
  writeStored(user.id, invoices);
  return invoices.find((invoice) => invoice.id === invoiceId) ?? null;
};

export const clientInvoiceService = {
  getInitial(user: AuthUser) {
    return env.dataSourceMode === "local" ? loadLocal(user) : null;
  },
  load(user: AuthUser) {
    return runWithDataSource(
      () => apiClient<ClientInvoice[]>(API_ENDPOINTS.clientInvoices.list),
      async () => loadLocal(user),
    );
  },
  async pay(user: AuthUser, invoiceId: string, paymentMethod: string) {
    const invoice = await runWithDataSource(
      () => apiClient<ClientInvoice>(API_ENDPOINTS.clientInvoices.pay(invoiceId), {
        method: "POST",
        body: { paymentMethod },
      }),
      async () => payLocal(user, invoiceId, paymentMethod),
    );

    if (invoice?.status === "paid") {
      clientNotificationService.publish({
        sourceId: invoice.id,
        ownerId: user.id,
        ownerEmail: user.email,
        type: "invoice",
        title: "Invoice berhasil dibayar",
        description: `Terima kasih telah menyelesaikan pembayaran invoice ${invoice.code} untuk proyek ${invoice.project}. Pembayaran Anda telah tercatat dengan status lunas. Tim kami akan melanjutkan pekerjaan sesuai ruang lingkup proyek dan memberikan pembaruan berikutnya melalui akun Anda.`,
        status: "Lunas",
        image: {
          kind: "tanya",
          alt: "Layanan Mahreen",
        },
      });
    }

    return invoice;
  },
  subscribe(listener: () => void) {
    if (typeof window === "undefined") return () => undefined;
    const unsubscribePlatform = subscribeToPlatformData(listener);
    window.addEventListener(INVOICE_EVENT, listener);
    return () => {
      unsubscribePlatform();
      window.removeEventListener(INVOICE_EVENT, listener);
    };
  },
};
