import { useResourceStream } from "./useResourceStream";

export type NotificationEvent = {
  type: string;
  resourceId: string;
  action: "created" | "updated" | "deleted";
  message: string;
};

export const NOTIFICATION_EVENT_BUS_NAME = "mahreen:notification";

export type ResourceKey =
  | "orders"
  | "invoices"
  | "consultations"
  | "donations"
  | "transactions"
  | "certificates"
  | "csr"
  | "internship"
  | "newsroom"
  | "all";

/**
 * Memetakan tipe event notifikasi ke resource cache yang perlu di-refresh.
 */
const mapEventToResource = (eventType: string): ResourceKey => {
  if (eventType.startsWith("order_")) return "orders";
  if (eventType.startsWith("consultation_")) return "consultations";
  if (eventType.startsWith("donation_")) return "donations";
  if (eventType.startsWith("transaction_")) return "invoices";
  if (eventType.startsWith("certificate_")) return "certificates";
  if (eventType.startsWith("csr_")) return "csr";
  if (eventType.startsWith("internship_")) return "internship";
  if (eventType.startsWith("user_")) return "all";
  if (eventType.startsWith("newsroom_")) return "newsroom";
  return "all";
};

/**
 * Hook yang otomatis memberitahu komponen lain untuk me-refresh data
 * ketika notifikasi spesifik datang dari Server-Sent Events stream backend.
 * Menggunakan CustomEvent DOM sehingga tanpa dependensi SWR / react-query.
 */
export function useNotificationTrigger() {
  useResourceStream<NotificationEvent>("notification", (event) => {
    if (typeof window === "undefined") return;
    const resource = mapEventToResource(event.type);
    window.dispatchEvent(
      new CustomEvent(NOTIFICATION_EVENT_BUS_NAME, {
        detail: { event, resource },
      }),
    );
    // Trigger refresh list notifikasi agar entri baru dari backend langsung muncul.
    window.dispatchEvent(
      new CustomEvent("mahreen:notifications:refresh", { detail: { source: "sse" } }),
    );
  });
}
