import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { resolveMediaUrl } from "../../api/media";

export type WebinarStatus = "draft" | "published";

export type AdminWebinarRecord = Readonly<{
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  is_free: 0 | 1;
  image: string;
  schedule_date: string;
  schedule_time: string;
  topics: string[];
  mentors: unknown[];
  timeline: unknown[];
  benefits: string[];
  status: WebinarStatus;
  quota: number;
  registered_count: number;
  created_at: string;
  updated_at: string;
}>;

export type AdminWebinarPayload = Readonly<{
  title: string;
  category?: string;
  description?: string;
  duration?: string;
  price?: number;
  isFree?: boolean;
  image?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  topics?: string[];
  mentors?: unknown[];
  timeline?: unknown[];
  benefits?: string[];
  status?: WebinarStatus;
  quota?: number;
}>;

export type AdminWebinarListParams = Readonly<{
  status?: WebinarStatus;
  category?: string;
  isFree?: boolean;
  search?: string;
  sortBy?: "created_at" | "title" | "schedule_date" | "price" | "registered_count";
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

export type AdminWebinarStats = Readonly<{
  total: number;
  published: number;
  draft: number;
  freeCount: number;
  paidCount: number;
  totalRegistered: number;
  categoryBreakdown: readonly { category: string; count: number }[];
  statusBreakdown: readonly { status: string; count: number }[];
  monthlyWebinars: readonly { month: string; count: number }[];
}>;

const normalizeWebinarMedia = (webinar: AdminWebinarRecord): AdminWebinarRecord => ({
  ...webinar,
  image: resolveMediaUrl(webinar.image),
});

const parseJson = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const webinarAdminService = {
  async list(params: AdminWebinarListParams = {}): Promise<AdminPaginatedResult<AdminWebinarRecord>> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.category) searchParams.set("category", params.category);
    if (params.isFree !== undefined) searchParams.set("isFree", String(params.isFree));
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortDir) searchParams.set("sortDir", params.sortDir);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    const result = await apiClient<AdminPaginatedResult<AdminWebinarRecord>>(
      `${API_ENDPOINTS.admin.webinars}${query ? `?${query}` : ""}`,
    );
    return {
      ...result,
      items: result.items.map((item) => ({
        ...normalizeWebinarMedia(item),
        topics: parseJson(item.topics).map(String),
        benefits: parseJson(item.benefits).map(String),
      })),
    };
  },

  async get(webinarId: string): Promise<AdminWebinarRecord> {
    const webinar = await apiClient<AdminWebinarRecord>(API_ENDPOINTS.admin.webinar(webinarId));
    return normalizeWebinarMedia(webinar);
  },

  async stats(): Promise<AdminWebinarStats> {
    return apiClient<AdminWebinarStats>(API_ENDPOINTS.admin.webinarStats);
  },

  async create(payload: AdminWebinarPayload): Promise<AdminWebinarRecord> {
    const webinar = await apiClient<AdminWebinarRecord>(API_ENDPOINTS.admin.webinars, {
      method: "POST",
      body: payload,
    });
    return normalizeWebinarMedia(webinar);
  },

  async update(webinarId: string, payload: Partial<AdminWebinarPayload>): Promise<AdminWebinarRecord> {
    const webinar = await apiClient<AdminWebinarRecord>(API_ENDPOINTS.admin.webinar(webinarId), {
      method: "PUT",
      body: payload,
    });
    return normalizeWebinarMedia(webinar);
  },

  async updateStatus(webinarId: string, status: WebinarStatus): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.webinarStatus(webinarId), {
      method: "PATCH",
      body: { status },
    });
  },

  async remove(webinarId: string): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.webinar(webinarId), {
      method: "DELETE",
    });
  },
};
