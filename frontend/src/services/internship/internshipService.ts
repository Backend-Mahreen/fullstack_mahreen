import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  InternshipApplicationInput,
  InternshipApplicationResult,
} from "../../types/internship";
import { uploadFileToApi } from "../upload/uploadService";

export type StoredInternshipApplication = InternshipApplicationResult & {
  program: string;
  fullName: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  university: string;
  major: string;
  semester: string;
  files: {
    cv: string;
    portfolio: string | null;
    motivationLetter: string;
  };
};

export const readInternshipApplications = async (): Promise<StoredInternshipApplication[]> => {
  try {
    const data = await apiClient<{ applications: StoredInternshipApplication[] }>(
      API_ENDPOINTS.clientInternshipApplications.list,
    );
    return (data.applications || []).filter(
      (app) =>
        app &&
        typeof app.applicationId === "string" &&
        typeof app.email === "string",
    );
  } catch {
    return [];
  }
};

const submitToApi = async (input: InternshipApplicationInput) => {
  const [cv, portfolio, motivationLetter] = await Promise.all([
    uploadFileToApi(input.cv),
    input.portfolio ? uploadFileToApi(input.portfolio) : Promise.resolve(null),
    uploadFileToApi(input.motivationLetter),
  ]);

  return apiClient<InternshipApplicationResult>(API_ENDPOINTS.internships.create, {
    method: "POST",
    body: {
      program: input.program,
      fullName: input.fullName,
      email: input.email,
      whatsapp: input.whatsapp,
      linkedin: input.linkedin,
      university: input.university,
      major: input.major,
      semester: input.semester,
      cvFileId: cv.fileId,
      portfolioFileId: portfolio?.fileId,
      motivationLetterFileId: motivationLetter.fileId,
    },
  });
};

export const internshipService = {
  submit(input: InternshipApplicationInput) {
    return submitToApi(input);
  },
};
