import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { CSRRegistrationData } from "../../types/csrRegistration";
import { uploadFileToApi } from "../upload/uploadService";

export type CSRApplicationResult = {
  applicationId: string;
  submittedAt: string;
  status: "received";
};

export type StoredCSRApplication = CSRRegistrationData & CSRApplicationResult;

type CSRApplicationRequest = {
  role: CSRRegistrationData["role"];
  fullName: string;
  focusArea: string;
  email: string;
  whatsapp: string;
  province: string;
  city: string;
  vision: string;
  motivation: string;
  acceptedTerms: boolean;
  documentFileId?: string;
};

const toRequest = (
  data: CSRRegistrationData,
  documentFileId?: string,
): CSRApplicationRequest => ({
  role: data.role,
  fullName: data.fullName,
  focusArea: data.focusArea,
  email: data.email,
  whatsapp: data.whatsapp,
  province: data.province,
  city: data.city,
  vision: data.vision,
  motivation: data.motivation,
  acceptedTerms: data.acceptedTerms,
  documentFileId,
});

export const readCSRApplications = async (): Promise<StoredCSRApplication[]> => {
  try {
    const data = await apiClient<{ applications: StoredCSRApplication[] }>(
      API_ENDPOINTS.clientCsrApplications.list,
    );
    return (data.applications || [])
      .filter(
        (app) =>
          app &&
          typeof app.applicationId === "string" &&
          typeof app.email === "string",
      )
      .sort(
        (left, right) =>
          Date.parse(right.submittedAt) - Date.parse(left.submittedAt),
      );
  } catch {
    return [];
  }
};

const submitToApi = async (
  data: CSRRegistrationData,
  file?: File,
): Promise<CSRApplicationResult> => {
  const uploaded = file ? await uploadFileToApi(file) : null;
  return apiClient<CSRApplicationResult>(API_ENDPOINTS.csr.applications, {
    method: "POST",
    body: toRequest(data, uploaded?.fileId),
  });
};

export const csrApplicationService = {
  submit(data: CSRRegistrationData, file?: File) {
    return submitToApi(data, file);
  },
};
