import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { KonsultasiDraft } from "../konsultasiDraft";
import { readJson, writeJson } from "../storage/browserStorage";
import { runWithDataSource } from "../serviceMode";
import { uploadFileToApi } from "../upload/uploadService";

const LOCAL_REQUESTS_KEY = "mahreen:consultation:requests";

export type ConsultationResult = {
  requestId: string;
  submittedAt: string;
  status: "received";
};

export type StoredConsultationRequest = KonsultasiDraft & ConsultationResult;

const isStoredConsultationRequest = (
  value: unknown,
): value is StoredConsultationRequest => {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<StoredConsultationRequest>;
  return (
    typeof request.requestId === "string" &&
    typeof request.submittedAt === "string" &&
    request.status === "received" &&
    Array.isArray(request.services)
  );
};

export const readLocalConsultationRequests = () =>
  readJson<unknown[]>("local", LOCAL_REQUESTS_KEY, []).filter(
    isStoredConsultationRequest,
  );

export const readConsultationRequests = async (): Promise<StoredConsultationRequest[]> => {
  try {
    await apiClient<{ requests: StoredConsultationRequest[] }>(
      API_ENDPOINTS.clientDashboard.overview,
    );
    return [];
  } catch {
    return [];
  }
};

const submitThroughApi = async (draft: KonsultasiDraft, files: File[]) => {
  const uploadedFiles = await Promise.all(files.map(uploadFileToApi));
  return apiClient<ConsultationResult>(API_ENDPOINTS.consultations.create, {
    method: "POST",
    body: {
      ...draft,
      fileIds: uploadedFiles.map((file) => file.fileId),
    },
  });
};

const submitLocally = async (draft: KonsultasiDraft): Promise<ConsultationResult> => {
  const result: ConsultationResult = {
    requestId: `REQ-${Date.now().toString(36).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    status: "received",
  };
  const stored: StoredConsultationRequest = { ...draft, ...result };
  const existing = readJson<unknown[]>("local", LOCAL_REQUESTS_KEY, []);
  writeJson("local", LOCAL_REQUESTS_KEY, [...existing, stored]);
  return result;
};

export const consultationService = {
  submit(draft: KonsultasiDraft, files: File[]) {
    return runWithDataSource(
      () => submitThroughApi(draft, files),
      () => submitLocally(draft),
    );
  },
};
