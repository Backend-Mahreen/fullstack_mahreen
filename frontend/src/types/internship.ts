export type InternshipApplicationInput = {
  program: string;
  fullName: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  university: string;
  major: string;
  semester: string;
  cv: File;
  portfolio?: File;
  motivationLetter: File;
};

export type InternshipApplicationResult = {
  applicationId: string;
  submittedAt: string;
  status: "received";
};
