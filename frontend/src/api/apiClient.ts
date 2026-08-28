import { env } from "../config/env";
import type { ApiEnvelope } from "../types/api";
import { ApiError, type ApiErrorDetails } from "./apiError";
import { AUTH_STORAGE_KEYS } from "../services/auth/authConstants";

type RequestBody = BodyInit | Record<string, unknown> | null;

const readAccessToken = (): string | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.session);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return typeof parsed?.accessToken === "string" ? parsed.accessToken : null;
  } catch {
    return null;
  }
};

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: RequestBody;
  timeoutMs?: number;
};

type ErrorPayload = {
  message?: string;
  code?: string;
  errors?: ApiErrorDetails;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isBodyInit = (value: unknown): value is BodyInit =>
  typeof value === "string" ||
  value instanceof Blob ||
  value instanceof FormData ||
  value instanceof URLSearchParams ||
  value instanceof ArrayBuffer ||
  ArrayBuffer.isView(value);

const buildRequestBody = (
  body: RequestBody | undefined,
): BodyInit | null | undefined => {
  if (body === undefined) return undefined;
  if (body === null) return null;
  if (isBodyInit(body)) return body;
  return JSON.stringify(body);
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
};

const unwrapResponse = <T,>(payload: unknown): T => {
  if (isRecord(payload) && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Menyimpan access token baru hasil refresh ke sesi yang tersimpan,
 * agar readAccessToken() mengembalikan token terbaru (bukan yang kedaluwarsa).
 */
const persistRefreshedAccessToken = (accessToken: string) => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.session);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    parsed.accessToken = accessToken;
    window.localStorage.setItem(AUTH_STORAGE_KEYS.session, JSON.stringify(parsed));
  } catch {
    // Penyimpanan tidak tersedia — token akan dipakai pada retry via param.
  }
};

const tryRefreshToken = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });
      if (response.ok) {
        const payload = await response.json().catch(() => null);
        if (payload?.data?.session?.accessToken) {
          persistRefreshedAccessToken(payload.data.session.accessToken);
          window.dispatchEvent(new Event("mahreen:auth-state-change"));
          return true;
        }
      }
      return false;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const buildFetchOptions = (
  endpoint: string,
  options: ApiRequestOptions,
): { url: string; fetchOptions: RequestInit } => {
  const requestBody = buildRequestBody(options.body);
  const isFormData = requestBody instanceof FormData;
  const headers = new Headers(options.headers);

  if (requestBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!headers.has("X-Requested-With")) headers.set("X-Requested-With", "XMLHttpRequest");

  const accessToken = readAccessToken();
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return {
    url: `${env.apiBaseUrl}${endpoint}`,
    fetchOptions: {
      ...options,
      body: requestBody,
      headers,
      // Saat kredensial diaktifkan, gunakan "include" agar cookie sesi ikut
      // terkirim meski API berada di origin berbeda. "same-origin" sebelumnya
      // menyebabkan cookie tidak terkirim pada konfigurasi cross-origin.
      credentials: options.credentials ?? (env.useCredentials ? "include" : "same-origin"),
    },
  };
};

const executeRequest = async <T,>(
  url: string,
  fetchOptions: RequestInit,
  timeoutMs: number,
): Promise<T> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    const payload = await parseResponseBody(response);

    if (!response.ok) {
      const errorPayload = isRecord(payload) ? (payload as ErrorPayload) : {};
      throw new ApiError({
        message: errorPayload.message ?? `Permintaan gagal dengan status ${response.status}.`,
        status: response.status,
        code: errorPayload.code,
        details: errorPayload.errors,
      });
    }

    return unwrapResponse<T>(payload);
  } finally {
    window.clearTimeout(timeout);
  }
};

export const apiClient = async <T,>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const timeoutMs = options.timeoutMs ?? env.apiTimeoutMs;
  const { url, fetchOptions } = buildFetchOptions(endpoint, options);

  try {
    return await executeRequest<T>(url, fetchOptions, timeoutMs);
  } catch (error) {
    // Refresh otomatis ketika token kedaluwarsa (401), KECUALI untuk
    // /auth/refresh (hindari rekursi) dan /auth/login|register (request inisialisasi).
    const isAuthRefreshEligible =
      error instanceof ApiError &&
      error.status === 401 &&
      !endpoint.endsWith("/auth/refresh") &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/register");

    if (isAuthRefreshEligible) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Bangun ulang request agar Authorization memakai token baru hasil refresh.
        const rebuilt = buildFetchOptions(endpoint, options);
        return executeRequest<T>(rebuilt.url, rebuilt.fetchOptions, timeoutMs);
      }
    }

    if (error instanceof ApiError) throw error;

    const isAbort = error instanceof DOMException && error.name === "AbortError";
    throw new ApiError({
      message: isAbort
        ? "Permintaan ke server melewati batas waktu."
        : "Server tidak dapat dihubungi. Periksa koneksi atau konfigurasi API.",
      isNetworkError: true,
    });
  }
};
