import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type TagRecord = Readonly<{
  id: string;
  title: string;
  description: string;
  article_count: number;
  webinar_count: number;
  categories: string[];
  created_at: string;
}>;

export type TagPayload = Readonly<{
  title: string;
  description?: string;
  categories?: string[];
}>;

export type TagListParams = Readonly<{
  search?: string;
  page?: number;
  limit?: number;
}>;

export type PaginatedResult<T> = Readonly<{
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

export const tagsAdminService = {
  async list(params: TagListParams = {}): Promise<PaginatedResult<TagRecord>> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    return apiClient<PaginatedResult<TagRecord>>(
      `${API_ENDPOINTS.admin.tags}${query ? `?${query}` : ""}`,
    );
  },

  async get(tagId: string): Promise<TagRecord> {
    return apiClient<TagRecord>(API_ENDPOINTS.admin.tag(tagId));
  },

  async create(payload: TagPayload): Promise<TagRecord> {
    return apiClient<TagRecord>(API_ENDPOINTS.admin.tags, {
      method: "POST",
      body: payload,
    });
  },

  async update(tagId: string, payload: Partial<TagPayload>): Promise<TagRecord> {
    return apiClient<TagRecord>(API_ENDPOINTS.admin.tag(tagId), {
      method: "PUT",
      body: payload,
    });
  },

  async remove(tagId: string): Promise<void> {
    await apiClient<void>(API_ENDPOINTS.admin.tag(tagId), {
      method: "DELETE",
    });
  },
};
