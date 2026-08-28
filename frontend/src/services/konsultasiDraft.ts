export interface KonsultasiClientInfo {
  nama: string;
  perusahaan: string;
  email: string;
  whatsapp: string;
  kota: string;
}

export interface KonsultasiFileMeta {
  name: string;
  size: number;
  type: string;
}

export interface KonsultasiDraft {
  clientInfo: KonsultasiClientInfo;
  services: string[];
  kebutuhan: string;
  budget: string;
  target: string;
  notes: string;
  files: KonsultasiFileMeta[];
  updatedAt: string;
}

const STORAGE_KEY = "mahreen-konsultasi-draft";
const REVIEW_STATUS_KEY = "mahreen-konsultasi-review-status";
let inMemoryFiles: File[] = [];

export interface KonsultasiReviewStatus {
  status: "reviewed";
  reviewedAt: string;
}

export const createEmptyKonsultasiDraft = (): KonsultasiDraft => ({
  clientInfo: {
    nama: "",
    perusahaan: "",
    email: "",
    whatsapp: "",
    kota: "",
  },
  services: [],
  kebutuhan: "",
  budget: "",
  target: "",
  notes: "",
  files: [],
  updatedAt: new Date(0).toISOString(),
});

export const saveKonsultasiDraft = (
  draft: Omit<KonsultasiDraft, "updatedAt">,
  files: File[] = [],
) => {
  const payload: KonsultasiDraft = {
    ...draft,
    files: files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
    updatedAt: new Date().toISOString(),
  };

  inMemoryFiles = [...files];
  // sessionStorage bisa melempar pada mode privat/kuota penuh. Bungkus agar
  // handler submit tetap berlanjut (data tersimpan di inMemoryFiles).
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.sessionStorage.removeItem(REVIEW_STATUS_KEY);
  } catch {
    // Penyimpanan tidak tersedia — abaikan, draft tetap ada di memori.
  }
  return payload;
};

export const getKonsultasiDraft = (): KonsultasiDraft | null => {
  try {
    const rawDraft = window.sessionStorage.getItem(STORAGE_KEY);
    if (!rawDraft) return null;

    const parsedDraft = JSON.parse(rawDraft) as Partial<KonsultasiDraft>;
    const emptyDraft = createEmptyKonsultasiDraft();

    return {
      ...emptyDraft,
      ...parsedDraft,
      clientInfo: {
        ...emptyDraft.clientInfo,
        ...(parsedDraft.clientInfo ?? {}),
      },
      services: Array.isArray(parsedDraft.services) ? parsedDraft.services : [],
      files: Array.isArray(parsedDraft.files) ? parsedDraft.files : [],
    };
  } catch {
    return null;
  }
};

export const getKonsultasiFiles = () => [...inMemoryFiles];

export const markKonsultasiReviewed = (): KonsultasiReviewStatus => {
  const reviewStatus: KonsultasiReviewStatus = {
    status: "reviewed",
    reviewedAt: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(REVIEW_STATUS_KEY, JSON.stringify(reviewStatus));
  } catch {
    // Penyimpanan tidak tersedia — abaikan.
  }
  return reviewStatus;
};

export const isKonsultasiReviewed = () => {
  try {
    const rawStatus = window.sessionStorage.getItem(REVIEW_STATUS_KEY);
    if (!rawStatus) return false;

    const parsedStatus = JSON.parse(rawStatus) as Partial<KonsultasiReviewStatus>;
    return parsedStatus.status === "reviewed" && Boolean(parsedStatus.reviewedAt);
  } catch {
    return false;
  }
};

export const clearKonsultasiReviewStatus = () => {
  window.sessionStorage.removeItem(REVIEW_STATUS_KEY);
};

export const clearKonsultasiDraft = () => {
  inMemoryFiles = [];
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(REVIEW_STATUS_KEY);
};
