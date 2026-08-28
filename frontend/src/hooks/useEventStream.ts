import { useEffect, useRef } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import { env } from "../config/env";
import { newsroomService } from "../services/newsroom/newsroomService";

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

/**
 * Hook SSE yang mendengarkan perubahan events dari admin.
 * Saat admin create/update/delete event, client otomatis
 * me-refresh data newsroom tanpa perlu refresh halaman.
 *
 * URL stream dibangun dari `env.apiBaseUrl` ("/api" di dev melalui proxy
 * Vite) sehingga koneksi bersifat same-origin dan bebas masalah CORS.
 *
 * Hook ini sepenuhnya defensif: seluruh pembuatan koneksi dibungkus
 * try/catch sehingga kegagalan SSE tidak pernah merusak rendering.
 */
const useEventStream = () => {
  const reconnectAttempts = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const isCancelled = false;
    let reconnectTimer: number | undefined;

    const cleanup = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimer !== undefined) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = undefined;
      }
    };

    const connect = () => {
      if (isCancelled) return;

      let eventSource: EventSource;
      try {
        const streamUrl = `${env.apiBaseUrl}${API_ENDPOINTS.events.eventStream}`;
        eventSource = new EventSource(streamUrl);
      } catch {
        // Browser menolak membuat EventSource (mis. URL invalid).
        return;
      }

      eventSourceRef.current = eventSource;

      const handleEvent = (_event: MessageEvent) => {
        newsroomService.hydrate().catch(() => {
          // Snapshot lokal tetap digunakan bila hydrate gagal.
        });
      };

      eventSource.addEventListener("event:created", handleEvent);
      eventSource.addEventListener("event:updated", handleEvent);
      eventSource.addEventListener("event:deleted", handleEvent);

      eventSource.onopen = () => {
        reconnectAttempts.current = 0;
      };

      eventSource.onerror = () => {
        eventSource.close();
        eventSourceRef.current = null;

        if (isCancelled) return;

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          reconnectTimer = window.setTimeout(
            connect,
            RECONNECT_DELAY_MS * reconnectAttempts.current,
          );
        }
      };
    };

    connect();

    return cleanup;
  }, []);
};

export default useEventStream;
