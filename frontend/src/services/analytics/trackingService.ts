import { env } from "../../config/env";

const SESSION_STORAGE_KEY = "mahreen:analytics:session";
const PAGE_TRACKED_KEY = "mahreen:analytics:page";

export type TrackEventInput = Readonly<{
  eventName: string;
  category?: string;
  path: string;
  referrer?: string;
  sessionId?: string;
  device?: string;
  country?: string;
  metadata?: Record<string, unknown>;
}>;

const detectDevice = () => {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent || "";
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
  if (/mobi|iphone|android|blackberry|opera mini/i.test(ua)) return "mobile";
  return "desktop";
};

const readOrCreateSessionId = () => {
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const sessionId = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    return `s-${Date.now().toString(36)}`;
  }
};

const readReferrer = () => {
  if (typeof document === "undefined") return "";
  const referrer = document.referrer || "";
  if (!referrer) return "direct";
  return referrer;
};

/**
 * Mencatat event analitik ke backend. Menggunakan sendBeacon agar permintaan
 * tidak menggantung render dan tetap terkirim saat halaman ditutup/dinavigasi.
 * Kegagalan pencatatan diabaikan — tracking tidak boleh mengganggu pengguna.
 */
export const trackingService = {
  track(input: TrackEventInput) {
    const payload = JSON.stringify({
      eventName: input.eventName,
      category: input.category ?? "",
      path: input.path,
      referrer: input.referrer ?? readReferrer(),
      sessionId: input.sessionId ?? readOrCreateSessionId(),
      device: input.device ?? detectDevice(),
      country: input.country ?? "",
      metadata: input.metadata,
    });

    try {
      const url = `${env.apiBaseUrl}${"/analytics/track"}`;
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
        return;
      }
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      // Abaikan seluruh error tracking.
    }
  },

  trackPageView(path: string, extraMetadata?: Record<string, unknown>) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    this.track({
      eventName: "page_view",
      category: "page",
      path: normalized,
      metadata: extraMetadata,
    });
  },

  /**
   * Mencatat page_view hanya sekali per path per sesi tab, untuk menghindari
   * inflasi angka saat SPA me-render ulang komponen.
   */
  trackPageViewOnce(path: string) {
    try {
      const recorded = window.sessionStorage.getItem(PAGE_TRACKED_KEY);
      const alreadyTracked = recorded && recorded.split("|").includes(path);
      if (alreadyTracked) return;
      this.trackPageView(path);
      window.sessionStorage.setItem(PAGE_TRACKED_KEY, [recorded, path].filter(Boolean).join("|"));
    } catch {
      this.trackPageView(path);
    }
  },
};
