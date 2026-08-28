import { useEffect, useRef } from "react";
import { env } from "../config/env";
import { AUTH_STORAGE_KEYS } from "../services/auth/authConstants";

type StreamEventCallback<T> = (data: T) => void;

interface StreamOptions {
  topics?: string[];
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

/**
 * Hook untuk connect ke Server-Sent Events (SSE) stream user.
 * Menerima generic type `T` untuk memastikan event payload type-safe.
 * 
 * @param eventName Nama event yang ingin di-listen, misal "order_update"
 * @param callback Fungsi yang dieksekusi saat event diterima
 * @param options Konfigurasi topik dan callback lifecycle
 */
export function useResourceStream<T = unknown>(
  eventName: string,
  callback: StreamEventCallback<T>,
  options?: StreamOptions,
) {
  const savedCallback = useRef(callback);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Keep callback ref updated agar tidak perlu re-subscribe jika function berubah
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const readToken = (): string | null => {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEYS.session);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        return typeof parsed?.accessToken === "string" ? parsed.accessToken : null;
      } catch {
        return null;
      }
    };

    const token = readToken();
    if (!token) return;

    const { topics = ["all"] } = options || {};
    const topicsQuery = topics.join(",");
    const url = `${env.apiBaseUrl}/client/stream?topics=${topicsQuery}&token=${token}`;
    
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      options?.onConnect?.();
    };

    es.onerror = (err) => {
      options?.onError?.(err);
      // EventSource akan auto-reconnect.
    };

    const handleEvent = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as T;
        savedCallback.current(data);
      } catch (err) {
        console.error(`Failed to parse SSE data for ${eventName}:`, err);
      }
    };

    es.addEventListener(eventName, handleEvent);

    return () => {
      es.removeEventListener(eventName, handleEvent);
      es.close();
      options?.onDisconnect?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- topics di-extract terpisah, onConnect/onError tidak re-bind
  }, [eventName, options?.topics?.join(",")]); 
}
