import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { CSRRegistrationData } from "../../types/csrRegistration";
import { readJson } from "../storage/browserStorage";
import { runWithDataSource } from "../serviceMode";
import { uploadFileToApi } from "../upload/uploadService";

export const LOCAL_CSR_APPLICATIONS_KEY = "mahreen:csr:applications";

export type CSRApplicationResult = {
  applicationId: string;
  submittedAt: string;
  status: "received";
};

export type StoredCSRApplication = CSRRegistrationData & CSRApplicationResult;

export const readLocalCSRApplications = () =>
  readJson<StoredCSRApplication[]>("local", LOCAL_CSR_APPLICATIONS_KEY, [])
    .filter(
      (application) =>
        application &&
        typeof application.applicationId === "string" &&
        typeof application.email === "string",
    )
    .sort(
      (left, right) => Date.parse(right.submittedAt) - Date.parse(left.submittedAt),
    );

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
    return runWithDataSource(
      () => submitToApi(data, file),
    );
  },
};
