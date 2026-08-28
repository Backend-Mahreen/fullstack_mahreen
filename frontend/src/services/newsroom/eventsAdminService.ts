import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { resolveMediaUrl } from "../../api/media";

export type EventAccessType = "FREE" | "PAID";
export type EventStatus = "draft" | "published";

export type AdminEventRecord = Readonly<{
  id: string;
  title: string;
  category: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image: string;
  is_featured: 0 | 1;
  access_type: EventAccessType;
  status: EventStatus;
  quota: number;
  price: number;
  created_at: string;
  updated_at: string;
}>;

export type AdminEventPayload = Readonly<{
  title: string;
  category?: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  image?: string;
  isFeatured?: boolean;
  accessType?: EventAccessType;
  status?: EventStatus;
  quota?: number;
  price?: number;
}>;

export type AdminEventListParams = Readonly<{
  status?: EventStatus;
  category?: string;
  accessType?: EventAccessType;
  featured?: boolean;
  search?: string;
  sortBy?: "created_at" | "event_date" | "title";
  sortDir?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}>;

export type AdminPaginatedResult<T> = Readonly<{
  items: T[];
  pagination: Readonly<{
    total: number;
    page: number;
    limit: number;
    offset: number;
    totalPages: number;
    hasMore: boolean;
  }>;
}>;

export type AdminEventStats = Readonly<{
  total: number;
  published: number;
  draft: number;
  freeCount: number;
  paidCount: number;
  featuredCount: number;
  categoryBreakdown: readonly { category: string; count: number }[];
  statusBreakdown: readonly { status: string; count: number }[];
  monthlyEvents: readonly { month: string; count: number }[];
}>;

const normalizeEventMedia = (event: AdminEventRecord): AdminEventRecord => ({
  ...event,
  image: resolveMediaUrl(event.image),
});

export const eventsAdminService = {
  async list(params: AdminEventListParams = {}): Promise<AdminPaginatedResult<AdminEventRecord>> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.category) searchParams.set("category", params.category);
    if (params.accessType) searchParams.set("accessType", params.accessType);
    if (params.featured !== undefined) searchParams.set("featured", String(params.featured));
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortDir) searchParams.set("sortDir", params.sortDir);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    const result = await apiClient<AdminPaginatedResult<AdminEventRecord>>(
      `${API_ENDPOINTS.admin.events}${query ? `?${query}` : ""}`,
    );
    return {
      ...result,
      items: result.items.map(normalizeEventMedia),
    };
  },

  async get(eventId: string): Promise<AdminEventRecord> {
    const event = await apiClient<AdminEventRecord>(API_ENDPOINTS.admin.event(eventId));
    return normalizeEventMedia(event);
  },

  async stats(): Promise<AdminEventStats> {
    return apiClient<AdminEventStats>(API_ENDPOINTS.admin.eventStats);
  },

  async create(payload: AdminEventPayload): Promise<AdminEventRecord> {
    const event = await apiClient<AdminEventRecord>(API_ENDPOINTS.admin.events, {
      method: "POST",
      body: payload,
    });
    return normalizeEventMedia(event);
  },

  async update(eventId: string, payload: Partial<AdminEventPayload>): Promise<AdminEventRecord> {
    const event = await apiClient<AdminEventRecord>(API_ENDPOINTS.admin.event(eventId), {
      method: "PUT",
      body: payload,
    });
    return normalizeEventMedia(event);
  },

  async updateStatus(eventId: string, status: EventStatus): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.eventStatus(eventId), {
      method: "PATCH",
      body: { status },
    });
  },

  async remove(eventId: string): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.event(eventId), {
      method: "DELETE",
    });
  },
};
