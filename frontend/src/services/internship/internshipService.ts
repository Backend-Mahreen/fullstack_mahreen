import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type {
  InternshipApplicationInput,
  InternshipApplicationResult,
} from "../../types/internship";
import { readJson } from "../storage/browserStorage";
import { runWithDataSource } from "../serviceMode";
import { uploadFileToApi } from "../upload/uploadService";

export const LOCAL_INTERNSHIP_APPLICATIONS_KEY = "mahreen:internship:applications";

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

export const readLocalInternshipApplications = () =>
  readJson<StoredInternshipApplication[]>(
    "local",
    LOCAL_INTERNSHIP_APPLICATIONS_KEY,
    [],
  ).filter(
    (application) =>
      application &&
      typeof application.applicationId === "string" &&
      typeof application.email === "string",
  );

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
    return runWithDataSource(
      () => submitToApi(input),
    );
  },
};
