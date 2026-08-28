import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  clientNotificationService,
  type ClientNotification,
} from "../../services/notifications/clientNotificationService";
import ClientNotificationImage from "./ClientNotificationImage";
import "./ClientNotificationToast.css";

const TOAST_DURATION_MS = 2_000;

const ClientNotificationToast = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState<ClientNotification | null>(
    null,
  );
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const clearToastTimeout = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const unsubscribe = clientNotificationService.subscribe((detail) => {
      const nextNotification = detail.notification;
      if (
        detail.action !== "published" ||
        !nextNotification ||
        !user ||
        !clientNotificationService.isOwnedByUser(nextNotification, user)
      ) {
        return;
      }

      clearToastTimeout();
      setNotification(nextNotification);
      timeoutRef.current = window.setTimeout(() => {
        setNotification(null);
        timeoutRef.current = null;
      }, TOAST_DURATION_MS);
    });

    return () => {
      unsubscribe();
      clearToastTimeout();
    };
  }, [user]);

  if (!notification || typeof document === "undefined") return null;

  return createPortal(
    <aside
      className="client-notification-toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <ClientNotificationImage
        className="client-notification-toast__image"
        image={notification.image}
      />
      <span className="client-notification-toast__check" aria-hidden="true">
        <CheckCircle2 />
      </span>
      <span className="client-notification-toast__copy">
        <small>{notification.status}</small>
        <strong>{notification.title}</strong>
        <span>{notification.description}</span>
      </span>
      <button
        type="button"
        aria-label="Tutup notifikasi"
        onClick={() => setNotification(null)}
      >
        <X aria-hidden="true" />
      </button>
      <i aria-hidden="true" />
    </aside>,
    document.body,
  );
};

export default ClientNotificationToast;
