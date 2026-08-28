import { readJson, writeJson } from "../storage/browserStorage";

export type AdminRecoverySelection = "administrator-id" | "security-key" | "both";

export type AdminRecoveryRequest = {
  id: string;
  selection: AdminRecoverySelection;
  corporateEmail: string;
  status: "pending-verification";
  createdAt: string;
};

const ADMIN_RECOVERY_STORAGE_KEY = "mahreen:admin:credential-recovery:v1";

const createRequestId = () =>
  `MHR-REC-${Date.now().toString(36).toUpperCase()}`;

export const adminCredentialRecoveryService = {
  async requestRecovery(
    selection: AdminRecoverySelection,
    corporateEmail: string,
  ): Promise<AdminRecoveryRequest> {
    const normalizedEmail = corporateEmail.trim().toLowerCase();

    const request: AdminRecoveryRequest = {
      id: createRequestId(),
      selection,
      corporateEmail: normalizedEmail,
      status: "pending-verification",
      createdAt: new Date().toISOString(),
    };

    const current = readJson<AdminRecoveryRequest[]>(
      "local",
      ADMIN_RECOVERY_STORAGE_KEY,
      [],
    );
    writeJson("local", ADMIN_RECOVERY_STORAGE_KEY, [request, ...current].slice(0, 20));
    return request;
  },

  getRequests(): AdminRecoveryRequest[] {
    return readJson<AdminRecoveryRequest[]>(
      "local",
      ADMIN_RECOVERY_STORAGE_KEY,
      [],
    );
  },
};
