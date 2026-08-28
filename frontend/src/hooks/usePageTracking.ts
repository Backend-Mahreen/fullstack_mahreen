import { useEffect, useRef } from "react";
import { trackingService } from "../services/analytics/trackingService";

/**
 * Mencatat page_view setiap kali path berubah (navigasi SPA).
 * Path pertama (initial load) juga dicatat sekali.
 */
export const usePageTracking = (path: string) => {
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (lastPathRef.current === normalized) return;
    lastPathRef.current = normalized;
    trackingService.trackPageViewOnce(normalized);
  }, [path]);
};
