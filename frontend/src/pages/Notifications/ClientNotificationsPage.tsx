import {
  BellRing,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ClientNotificationImage from "../../components/Notifications/ClientNotificationImage";
import { useAuth } from "../../hooks/useAuth";
import { NOTIFICATION_EVENT_BUS_NAME } from "../../hooks/useNotificationTrigger";
import {
  clientNotificationService,
  type ClientNotification,
} from "../../services/notifications/clientNotificationService";
import { navigateToRoute } from "../../utils/hashNavigation";
import "./ClientNotificationsPage.css";

const formatNotificationDate = (createdAt: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));

const ClientNotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ClientNotification[]>(
    () => (user ? clientNotificationService.listForUser(user) : []),
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!user) return;

    let active = true;
    const refresh = () => {
      if (active) setNotifications(clientNotificationService.listForUser(user));
    };

    refresh();
    void clientNotificationService
      .loadForUser(user)
      .then((nextNotifications) => {
        if (active) setNotifications(nextNotifications);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = clientNotificationService.subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const onNotify = () => {
      if (!user) return;
      setNotifications(clientNotificationService.listForUser(user));
      void clientNotificationService.loadForUser(user).then((next) => {
        setNotifications(next);
      }).catch(() => undefined);
    };
    window.addEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
    return () => window.removeEventListener(NOTIFICATION_EVENT_BUS_NAME, onNotify);
  }, [user]);

  const unreadCount = useMemo(
    () => notifications.filter(({ readAt }) => !readAt).length,
    [notifications],
  );
  const activeSelectedIds = useMemo(() => {
    const availableIds = new Set(notifications.map(({ id }) => id));
    return new Set([...selectedIds].filter((id) => availableIds.has(id)));
  }, [notifications, selectedIds]);
  const allSelected =
    notifications.length > 0 &&
    notifications.every(({ id }) => activeSelectedIds.has(id));

  if (!user) return null;

  const markRead = (notificationId: string) => {
    clientNotificationService.markRead(user, notificationId);
  };

  const toggleDescription = (notification: ClientNotification) => {
    const opening = !expandedIds.has(notification.id);
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(notification.id)) next.delete(notification.id);
      else next.add(notification.id);
      return next;
    });
    if (opening) markRead(notification.id);
  };

  const openDetail = (notification: ClientNotification) => {
    markRead(notification.id);
    navigateToRoute(notification.detailHref);
  };

  const toggleSelected = (notificationId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(notificationId)) next.delete(notificationId);
      else next.add(notificationId);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(
      allSelected
        ? new Set()
        : new Set(notifications.map((notification) => notification.id)),
    );
  };

  const deleteSelected = () => {
    const deletedCount = activeSelectedIds.size;
    if (deletedCount === 0) return;
    clientNotificationService.dismissMany(user, [...activeSelectedIds]);
    setSelectedIds(new Set());
    setFeedback(`${deletedCount} notifikasi berhasil dihapus.`);
  };

  const markAllRead = () => {
    clientNotificationService.markAllRead(user);
    setFeedback("Semua notifikasi sudah ditandai sebagai dibaca.");
  };

  return (
    <>
      <Navbar homeHref="/" homeLabel="Home" />
      <main className="client-notifications-page">
        <div className="client-notifications">
        <header className="client-notifications__header">
          <div>
            <span className="client-notifications__eyebrow">Pusat Aktivitas</span>
            <h1>Notifikasi</h1>
            <p>
              Pantau transaksi dan aktivitas akun Anda dalam satu tempat.
              {unreadCount > 0
                ? ` ${unreadCount} pesan belum dibaca.`
                : " Semua pesan sudah dibaca."}
            </p>
          </div>

          <div className="client-notifications__header-actions">
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck aria-hidden="true" />
              Tandai semua dibaca
            </button>
            <button
              className="is-danger"
              type="button"
              onClick={deleteSelected}
              disabled={activeSelectedIds.size === 0}
            >
              <Trash2 aria-hidden="true" />
              Hapus{activeSelectedIds.size > 0 ? ` (${activeSelectedIds.size})` : ""}
            </button>
          </div>
        </header>

        <p className="client-notifications__feedback" aria-live="polite">
          {feedback}
        </p>

        {notifications.length > 0 && (
          <div className="client-notifications__select-all">
            <label>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
              />
              <span>Pilih semua pesan</span>
            </label>
            <span>{notifications.length} notifikasi</span>
          </div>
        )}

        <section
          className="client-notifications__list"
          aria-label="Daftar notifikasi"
          aria-busy={loading}
        >
          {loading && notifications.length === 0 ? (
            <div className="client-notifications__loading" role="status">
              <span />
              <span />
              <span />
              <p>Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="client-notifications__empty" role="status">
              <BellRing aria-hidden="true" />
              <h2>Belum ada notifikasi</h2>
              <p>Aktivitas akun dan transaksi baru akan muncul di halaman ini.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const expanded = expandedIds.has(notification.id);
              const selected = selectedIds.has(notification.id);
              const unread = !notification.readAt;
              const descriptionId = `notification-description-${notification.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

              return (
                <article
                  className={`client-notification-card${unread ? " is-unread" : ""}${selected ? " is-selected" : ""}`}
                  key={notification.id}
                >
                  <label className="client-notification-card__select">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSelected(notification.id)}
                    />
                    <span className="client-notifications__visually-hidden">
                      Pilih {notification.title}
                    </span>
                  </label>

                  <button
                    className="client-notification-card__summary"
                    type="button"
                    onClick={() => markRead(notification.id)}
                    aria-label={`Tandai pesan ${notification.title} sebagai dibaca`}
                  >
                    <ClientNotificationImage
                      className="client-notification-card__image"
                      image={notification.image}
                      width={96}
                      height={96}
                    />
                    <span className="client-notification-card__copy">
                      <span className="client-notification-card__meta">
                        <span className="client-notification-card__status">
                          {notification.status}
                        </span>
                        <span
                          className={`client-notification-card__read-state${unread ? " is-unread" : ""}`}
                        >
                          {unread ? "Belum dibaca" : "Sudah dibaca"}
                        </span>
                      </span>
                      <strong>{notification.title}</strong>
                      <time dateTime={notification.createdAt}>
                        {formatNotificationDate(notification.createdAt)}
                      </time>
                    </span>
                  </button>

                  <div className="client-notification-card__actions">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={descriptionId}
                      onClick={() => toggleDescription(notification)}
                    >
                      {expanded ? (
                        <ChevronUp aria-hidden="true" />
                      ) : (
                        <ChevronDown aria-hidden="true" />
                      )}
                      <span>{expanded ? "Tutup" : "Deskripsi"}</span>
                    </button>
                    <button
                      className="client-notification-card__detail"
                      type="button"
                      onClick={() => openDetail(notification)}
                      aria-label={`Lihat detail ${notification.title}`}
                    >
                      <Eye aria-hidden="true" />
                      <span>Lihat detail</span>
                    </button>
                  </div>

                  <div
                    className={`client-notification-card__description${expanded ? " is-expanded" : ""}`}
                    id={descriptionId}
                    hidden={!expanded}
                  >
                    <p>{notification.description}</p>
                  </div>
                </article>
              );
            })
          )}
        </section>
        </div>
      </main>
    </>
  );
};

export default ClientNotificationsPage;
