import type { RegistrationDraft } from "../../types/auth";
import { readJson, removeStoredValue, writeJson } from "../storage/browserStorage";
import { AUTH_STORAGE_KEYS, emptyRegistrationDraft } from "./authConstants";

export const registrationDraftService = {
  load(): RegistrationDraft {
    return {
      ...emptyRegistrationDraft,
      ...readJson<Partial<RegistrationDraft>>(
        "local",
        AUTH_STORAGE_KEYS.registrationDraft,
        {},
      ),
    };
  },

  save(updates: Partial<RegistrationDraft>): RegistrationDraft {
    const nextDraft = { ...this.load(), ...updates };
    writeJson("local", AUTH_STORAGE_KEYS.registrationDraft, nextDraft);
    return nextDraft;
  },

  clear() {
    removeStoredValue("local", AUTH_STORAGE_KEYS.registrationDraft);
  },
};
