import { env } from "../config/env";
import { API_ENDPOINTS } from "./endpoints";
import { apiClient } from "./apiClient";

type UploadResponse = Readonly<{
  fileId: string;
  fileName: string;
  fileUrl: string;
}>;

/**
 * Turunkan origin backend dari apiBaseUrl.
 * - "/api" (dev via proxy)  -> "" (biarkan relative, proxy Vite yang menangani)
 * - "https://api.host/api"  -> "https://api.host"
 */
const backendOrigin = (() => {
  const base = env.apiBaseUrl;
  if (!base || base.startsWith("/")) return "";
  try {
    return new URL(base).origin;
  } catch {
    return "";
  }
})();

/**
 * Ubah path media backend menjadi URL yang bisa dipakai <img src>.
 * - data URL / http(s) / blob  -> dikembalikan apa adanya
 * - "/uploads/x.png"           -> "<backendOrigin>/uploads/x.png"
 */
export const resolveMediaUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  if (/^(?:data:|blob:|https?:\/\/)/i.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${backendOrigin}${url}`;
  return url;
};

/**
 * Unggah satu file gambar ke backend, kembalikan fileUrl root-relative
 * (mis. "/uploads/uuid.png"). Simpan fileUrl ini, JANGAN base64.
 */
export const uploadImageFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<UploadResponse>(API_ENDPOINTS.uploads.create, {
    method: "POST",
    body: formData,
  });
};

/**
 * Unduh gambar dari URL eksternal via backend proxy.
 * Backend mengunduh gambar, menyimpan ke /uploads/, dan mengembalikan
 * fileUrl root-relative. Solusi CORS: semua gambar jadi same-origin.
 */
export const uploadImageFromUrl = async (url: string): Promise<UploadResponse> => {
  return apiClient<UploadResponse>(API_ENDPOINTS.uploads.fromUrl, {
    method: "POST",
    body: { url },
  });
};
