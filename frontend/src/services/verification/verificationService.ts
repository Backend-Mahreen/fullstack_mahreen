import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type VerificationResultStatus =
  | "valid"
  | "revoked"
  | "expired"
  | "invalid"
  | "not_found";

export type VerificationCertificate = Readonly<{
  id: string;
  certificateNumber: string;
  verificationCode: string;
  recipientName: string;
  programType: string;
  programName: string;
  issuedAt: string;
  expiresAt: string;
  status: string;
}>;

export type VerificationCheckResult = Readonly<{
  result: VerificationResultStatus;
  valid: boolean;
  certificate: VerificationCertificate | null;
}>;

export const verificationService = {
  async check(code: string): Promise<VerificationCheckResult> {
    return apiClient<VerificationCheckResult>(API_ENDPOINTS.verification.check, {
      method: "POST",
      body: { code },
    });
  },
};
