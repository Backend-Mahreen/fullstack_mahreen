import type { ClientDocumentRecord } from "../../pages/DashboardClient/documents/types";
import { subscribeToPlatformData } from "../storage/browserStorage";

const SESSION_STORAGE_KEY = "mahreen:client-documents:v1";

const seedDocuments: ClientDocumentRecord[] = [
  {
    id: "brief-kartika-digital",
    title: "Brief_Kartika_Digital.pdf",
    project: "Redesign Website",
    sizeLabel: "2.4 MB",
    updatedAt: "2026-06-01T09:00:00.000Z",
    kind: "pdf",
  },
  {
    id: "wireframe-v2-final",
    title: "Wireframe_v2_Final.fig",
    project: "Redesign Website",
    sizeLabel: "8.1 MB",
    updatedAt: "2026-06-15T10:30:00.000Z",
    kind: "figma",
  },
  {
    id: "brand-guidelines-v1",
    title: "Brand_Guidelines_v1.pdf",
    project: "Brand Identity",
    sizeLabel: "14.2 MB",
    updatedAt: "2026-05-28T08:15:00.000Z",
    kind: "guide",
  },
  {
    id: "content-plan-juli",
    title: "Content_Plan_Juli.xlsx",
    project: "Social Media",
    sizeLabel: "1.1 MB",
    updatedAt: "2026-07-01T07:45:00.000Z",
    kind: "sheet",
  },
  {
    id: "invoice-2026-001",
    title: "Invoice_INV-2026-001.pdf",
    project: "Billing",
    sizeLabel: "0.3 MB",
    updatedAt: "2026-06-01T11:00:00.000Z",
    kind: "invoice",
  },
  {
    id: "mou-kartika-mahreen",
    title: "MOU_Kartika_Mahreen.pdf",
    project: "Legal",
    sizeLabel: "1.8 MB",
    updatedAt: "2026-04-30T09:30:00.000Z",
    kind: "legal",
  },
];

const getStorageKey = (accountId: string) => {
  const safeAccountId = accountId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${SESSION_STORAGE_KEY}:${safeAccountId || "anonymous"}`;
};

const isClientDocument = (value: unknown): value is ClientDocumentRecord => {
  if (!value || typeof value !== "object") return false;
  const doc = value as Partial<ClientDocumentRecord>;
  return (
    typeof doc.id === "string" &&
    typeof doc.title === "string" &&
    typeof doc.project === "string" &&
    typeof doc.sizeLabel === "string" &&
    typeof doc.updatedAt === "string" &&
    typeof doc.kind === "string"
  );
};

const cloneDocuments = (documents: ClientDocumentRecord[]) =>
  documents.map((doc) => ({ ...doc }));

const readDocuments = (accountId: string): ClientDocumentRecord[] => {
  if (typeof window === "undefined") return cloneDocuments(seedDocuments);

  try {
    const key = getStorageKey(accountId);
    const raw = window.sessionStorage.getItem(key);
    if (!raw) {
      const seeded = cloneDocuments(seedDocuments);
      window.sessionStorage.setItem(key, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return cloneDocuments(seedDocuments);
    const valid = parsed.filter(isClientDocument);
    return valid.length > 0 ? valid : cloneDocuments(seedDocuments);
  } catch {
    return cloneDocuments(seedDocuments);
  }
};

export const clientDocumentsRepository = {
  getSnapshot(accountId: string) {
    return cloneDocuments(readDocuments(accountId)).sort(
      (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
    );
  },

  reset(accountId: string) {
    const documents = cloneDocuments(seedDocuments);
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(getStorageKey(accountId), JSON.stringify(documents));
      } catch {
        // Fallback: return in-memory
      }
    }
    return documents;
  },

  subscribe(listener: () => void) {
    return subscribeToPlatformData(listener);
  },
};
