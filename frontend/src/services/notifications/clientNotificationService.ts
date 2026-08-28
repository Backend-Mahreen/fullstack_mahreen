import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { env } from "../../config/env";
import type { AuthUser } from "../../types/auth";
import { AUTH_STORAGE_KEYS } from "../auth/authConstants";
import { emitPlatformDataChange, readJson } from "../storage/browserStorage";
import { getFlowStorage } from "../storage/dataSourceStorage";

export type ClientNotificationType =
  | "studio-order"
  | "donation"
  | "service-order"
  | "webinar"
  | "consultation"
  | "csr"
  | "internship"
  | "invoice";

export const CLIENT_NOTIFICATION_DETAIL_ROUTES = {
  "studio-order": "/akun#ongoing-order",
  donation: "/akun/overview",
  "service-order": "/akun/projects",
  webinar: "/akun/jadwal",
  consultation: "/akun/projects",
  csr: "/akun/dokumen",
  internship: "/akun/dokumen",
  invoice: "/akun/invoice",
} as const satisfies Readonly<Record<ClientNotificationType, string>>;

export const getClientNotificationDetailHref = (
  type: ClientNotificationType,
) => CLIENT_NOTIFICATION_DETAIL_ROUTES[type];

export type ClientNotificationImageKind =
  | "studio-product"
  | "studio"
  | "peduli"
  | "tanya"
  | "csr"
  | "internship"
  | "mahreen";

export type ClientNotificationImage = Readonly<{
  kind: ClientNotificationImageKind;
  url?: string;
  reference?: string;
  variant?: string;
  alt: string;
}>;

export type ClientNotification = Readonly<{
  id: string;
  sourceId: string;
  ownerId: string;
  ownerEmail: string;
  type: ClientNotificationType;
  title: string;
  description: string;
  status: string;
  detailHref: string;
  image: ClientNotificationImage;
  createdAt: string;
  readAt: string | null;
}>;

export type PublishClientNotificationInput = Readonly<{
  sourceId: string;
  ownerId?: string;
  ownerEmail?: string;
  type: ClientNotificationType;
  title: string;
  description: string;
  status: string;
  image: ClientNotificationImage;
}>;

export type ClientNotificationEventDetail = Readonly<{
  action: "published" | "changed";
  notification?: ClientNotification;
}>;

export const CLIENT_NOTIFICATIONS_STORAGE_KEY =
  "mahreen:client-notifications:v1";
export const CLIENT_NOTIFICATIONS_CHANGE_EVENT =
  "mahreen:client-notifications-change";

const MAX_NOTIFICATIONS = 50;
const CLIENT_NOTIFICATION_TYPES = new Set<ClientNotificationType>(
  Object.keys(CLIENT_NOTIFICATION_DETAIL_ROUTES) as ClientNotificationType[],
);
const MIN_NOTIFICATION_DESCRIPTION_LENGTH = 120;

const CLIENT_NOTIFICATION_DESCRIPTION_COPY = {
  "studio-order": {
    opening: "Terima kasih telah berbelanja di Mahreen Studio.",
    closing:
      "Pesanan Anda telah tercatat dan tim kami akan menyiapkan produk serta memperbarui statusnya melalui pusat notifikasi ini.",
  },
  donation: {
    opening: "Terima kasih telah menyalurkan dukungan melalui Peduli Mahreen.",
    closing:
      "Kontribusi Anda telah tercatat dan akan dikelola sesuai program yang dipilih. Perkembangan aktivitas dapat dipantau melalui akun Anda.",
  },
  "service-order": {
    opening: "Terima kasih telah memilih layanan profesional Mahreen Indonesia.",
    closing:
      "Pembayaran dan permintaan layanan Anda telah tercatat. Tim kami akan meninjau kebutuhan proyek lalu menghubungi Anda untuk tahap berikutnya.",
  },
  webinar: {
    opening: "Terima kasih telah bergabung dalam program pembelajaran Mahreen Indonesia.",
    closing:
      "Pendaftaran Anda telah aktif. Jadwal, akses acara, dan pembaruan penting berikutnya dapat dilihat melalui halaman jadwal akun Anda.",
  },
  consultation: {
    opening: "Terima kasih telah mengirimkan permintaan konsultasi kepada Mahreen Indonesia.",
    closing:
      "Tim kami akan mempelajari kebutuhan yang Anda sampaikan dan menghubungi Anda melalui kontak terdaftar untuk menentukan langkah berikutnya.",
  },
  csr: {
    opening: "Terima kasih telah mendaftar pada program Mahreen CSR.",
    closing:
      "Data pendaftaran Anda telah kami terima untuk proses peninjauan. Informasi hasil seleksi dan dokumen lanjutan akan disampaikan melalui akun Anda.",
  },
  internship: {
    opening: "Terima kasih telah mendaftar pada Mahreen Indonesia Internship.",
    closing:
      "Aplikasi Anda telah masuk ke tahap peninjauan. Setiap pembaruan seleksi dan kebutuhan dokumen berikutnya akan tersedia melalui akun Anda.",
  },
  invoice: {
    opening: "Terima kasih telah menyelesaikan pembayaran invoice Mahreen Indonesia.",
    closing:
      "Pembayaran Anda telah tercatat. Tim kami akan melanjutkan pekerjaan sesuai ruang lingkup proyek dan memberikan pembaruan melalui akun Anda.",
  },
} as const satisfies Readonly<
  Record<ClientNotificationType, Readonly<{ opening: string; closing: string }>>
>;

const normalizeIdentity = (value: string | null | undefined) =>
  value?.trim().toLowerCase() ?? "";

const isClientNotificationType = (
  value: unknown,
): value is ClientNotificationType =>
  typeof value === "string" &&
  CLIENT_NOTIFICATION_TYPES.has(value as ClientNotificationType);

const normalizeNotificationDescription = (
  type: ClientNotificationType,
  description: string,
) => {
  const normalized = description.trim().replace(/\s+/g, " ");
  if (normalized.length >= MIN_NOTIFICATION_DESCRIPTION_LENGTH) {
    return normalized;
  }

  const { opening, closing } = CLIENT_NOTIFICATION_DESCRIPTION_COPY[type];
  const detail = normalized.replace(/[.!?]+$/, "");
  return `${opening}${detail ? ` Rincian aktivitas: ${detail}.` : ""} ${closing}`;
};

const withCanonicalDetailHref = (
  notification: ClientNotification,
): ClientNotification => ({
  ...notification,
  description: normalizeNotificationDescription(
    notification.type,
    notification.description,
  ),
  detailHref: getClientNotificationDetailHref(notification.type),
});

const getCurrentUser = () => {
  const sessionUser = readJson<AuthUser | null>(
    "session",
    AUTH_STORAGE_KEYS.user,
    null,
  );
  if (sessionUser || env.dataSourceMode !== "local") return sessionUser;
  return readJson<AuthUser | null>("local", AUTH_STORAGE_KEYS.user, null);
};

const isNotification = (value: unknown): value is ClientNotification => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ClientNotification>;
  return Boolean(
      item.id &&
      item.sourceId &&
      isClientNotificationType(item.type) &&
      item.title &&
      item.description &&
      item.status &&
      typeof item.detailHref === "string" &&
      item.image &&
      item.createdAt,
  );
};

const readAll = (): ClientNotification[] => {
  const storage = getFlowStorage();
  if (!storage) return [];

  try {
    const parsed: unknown = JSON.parse(
      storage.getItem(CLIENT_NOTIFICATIONS_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter(isNotification).map(withCanonicalDetailHref)
      : [];
  } catch {
    return [];
  }
};

const dispatchChange = (detail: ClientNotificationEventDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ClientNotificationEventDetail>(
      CLIENT_NOTIFICATIONS_CHANGE_EVENT,
      { detail },
    ),
  );
};

const writeAll = (
  notifications: ClientNotification[],
  detail: ClientNotificationEventDetail = { action: "changed" },
) => {
  const storage = getFlowStorage();
  if (!storage) return false;

  try {
    storage.setItem(
      CLIENT_NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)),
    );
    dispatchChange(detail);
    emitPlatformDataChange();
    return true;
  } catch {
    return false;
  }
};

const belongsToUser = (
  notification: ClientNotification,
  user: Pick<AuthUser, "id" | "email">,
) => {
  const ownerId = normalizeIdentity(notification.ownerId);
  const ownerEmail = normalizeIdentity(notification.ownerEmail);
  return Boolean(
    (ownerId && ownerId === normalizeIdentity(user.id)) ||
      (ownerEmail && ownerEmail === normalizeIdentity(user.email)),
  );
};

const listForUser = (user: Pick<AuthUser, "id" | "email">) =>
  readAll()
    .filter((notification) => belongsToUser(notification, user))
    .sort(
      (left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );

const updateForUser = (
  user: Pick<AuthUser, "id" | "email">,
  update: (notification: ClientNotification) => ClientNotification | null,
) => {
  let changed = false;
  const next = readAll().flatMap((notification) => {
    if (!belongsToUser(notification, user)) return [notification];
    const updated = update(notification);
    if (updated !== notification) changed = true;
    return updated ? [updated] : [];
  });

  if (changed) writeAll(next);
  return changed;
};

const syncMutationToApi = (operation: () => Promise<unknown>) => {
  if (env.dataSourceMode === "local") return;
  void operation().catch(() => undefined);
};

export const clientNotificationService = {
  publish(input: PublishClientNotificationInput) {
    const currentUser = getCurrentUser();
    const ownerId = normalizeIdentity(input.ownerId || currentUser?.id);
    const ownerEmail = normalizeIdentity(input.ownerEmail || currentUser?.email);

    if (!ownerId && !ownerEmail) return null;

    const notifications = readAll();
    const existing = notifications.find(
      (notification) =>
        notification.type === input.type &&
        notification.sourceId === input.sourceId &&
        ((ownerId && normalizeIdentity(notification.ownerId) === ownerId) ||
          (ownerEmail &&
            normalizeIdentity(notification.ownerEmail) === ownerEmail)),
    );
    if (existing) return existing;

    const createdAt = new Date().toISOString();
    const notification: ClientNotification = {
      id: `${input.type}:${input.sourceId}:${Date.now().toString(36)}`,
      sourceId: input.sourceId,
      ownerId,
      ownerEmail,
      type: input.type,
      title: input.title,
      description: normalizeNotificationDescription(
        input.type,
        input.description,
      ),
      status: input.status,
      detailHref: getClientNotificationDetailHref(input.type),
      image: input.image,
      createdAt,
      readAt: null,
    };

    writeAll([notification, ...notifications], {
      action: "published",
      notification,
    });
    return notification;
  },

  listForUser(user: Pick<AuthUser, "id" | "email">) {
    return listForUser(user);
  },

  async loadForUser(user: Pick<AuthUser, "id" | "email">) {
    if (env.dataSourceMode === "local") {
      return listForUser(user);
    }

    try {
      const response = await apiClient<ClientNotification[]>(
        API_ENDPOINTS.clientNotifications.list,
      );
      const apiNotifications = response.filter(isNotification).map(
        (notification) => withCanonicalDetailHref({
          ...notification,
          ownerId: notification.ownerId || user.id,
          ownerEmail: notification.ownerEmail || user.email,
          readAt: notification.readAt || null,
        }),
      );
      const merged = new Map(
        listForUser(user).map((notification) => [
          `${notification.type}:${notification.sourceId}`,
          notification,
        ]),
      );
      apiNotifications.forEach((notification) => {
        const key = `${notification.type}:${notification.sourceId}`;
        const cached = merged.get(key);
        merged.set(key, {
          ...notification,
          readAt: notification.readAt || cached?.readAt || null,
        });
      });
      const notifications = [...merged.values()].sort(
        (left, right) =>
          Date.parse(right.createdAt) - Date.parse(left.createdAt),
      );
      const otherUsers = readAll().filter(
        (notification) => !belongsToUser(notification, user),
      );
      writeAll([...notifications, ...otherUsers]);
      return notifications;
    } catch {
      // Cache session menjaga menu tetap stabil saat endpoint sedang tidak tersedia.
      return listForUser(user);
    }
  },

  isOwnedByUser(
    notification: ClientNotification,
    user: Pick<AuthUser, "id" | "email">,
  ) {
    return belongsToUser(notification, user);
  },

  markAllRead(user: Pick<AuthUser, "id" | "email">) {
    const readAt = new Date().toISOString();
    const changed = updateForUser(user, (notification) =>
      notification.readAt ? notification : { ...notification, readAt },
    );
    syncMutationToApi(() =>
      apiClient(API_ENDPOINTS.clientNotifications.readAll, {
        method: "PATCH",
      }),
    );
    return changed;
  },

  markRead(user: Pick<AuthUser, "id" | "email">, notificationId: string) {
    const readAt = new Date().toISOString();
    const changed = updateForUser(user, (notification) =>
      notification.id === notificationId && !notification.readAt
        ? { ...notification, readAt }
        : notification,
    );
    syncMutationToApi(() =>
      apiClient(API_ENDPOINTS.clientNotifications.read(notificationId), {
        method: "PATCH",
      }),
    );
    return changed;
  },

  dismiss(user: Pick<AuthUser, "id" | "email">, notificationId: string) {
    const changed = updateForUser(user, (notification) =>
      notification.id === notificationId ? null : notification,
    );
    syncMutationToApi(() =>
      apiClient(API_ENDPOINTS.clientNotifications.remove(notificationId), {
        method: "DELETE",
      }),
    );
    return changed;
  },

  dismissMany(
    user: Pick<AuthUser, "id" | "email">,
    notificationIds: readonly string[],
  ) {
    const ids = new Set(notificationIds);
    if (ids.size === 0) return false;

    const changed = updateForUser(user, (notification) =>
      ids.has(notification.id) ? null : notification,
    );
    ids.forEach((notificationId) => {
      syncMutationToApi(() =>
        apiClient(API_ENDPOINTS.clientNotifications.remove(notificationId), {
          method: "DELETE",
        }),
      );
    });
    return changed;
  },

  subscribe(listener: (detail: ClientNotificationEventDetail) => void) {
    if (typeof window === "undefined") return () => undefined;

    const handleChange = (event: Event) => {
      const detail = event instanceof CustomEvent
        ? (event.detail as ClientNotificationEventDetail | undefined)
        : undefined;
      listener(detail ?? { action: "changed" });
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CLIENT_NOTIFICATIONS_STORAGE_KEY) {
        listener({ action: "changed" });
      }
    };

    window.addEventListener(CLIENT_NOTIFICATIONS_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(CLIENT_NOTIFICATIONS_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  },
};
