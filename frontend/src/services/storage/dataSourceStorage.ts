import { env } from "../../config/env";

const getBrowserStorage = (kind: "local" | "session"): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

/**
 * Cache sementara untuk menjaga alur multi-halaman.
 *
 * Mode demo memakai localStorage supaya data contoh tetap ada setelah browser
 * ditutup. Mode API hanya memakai sessionStorage; sumber kebenaran tetap backend
 * dan cache akan hilang ketika tab ditutup.
 */
export const getFlowStorage = () =>
  getBrowserStorage(env.dataSourceMode === "local" ? "local" : "session");

/**
 * Penyimpanan record permanen khusus simulator FE. Pada mode API fungsi ini
 * sengaja mengembalikan null agar data domain tidak diam-diam tersimpan lokal.
 */
export const getDemoRecordStorage = () =>
  env.dataSourceMode === "local" ? getBrowserStorage("local") : null;

export const isPersistentDemoStorageEnabled = () =>
  env.dataSourceMode === "local";
