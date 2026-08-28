import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type FaqRecord = Readonly<{
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}>;

export type FaqListParams = Readonly<{
  category?: string;
  search?: string;
}>;

export const faqService = {
  async list(params: FaqListParams = {}): Promise<FaqRecord[]> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set("category", params.category);
    if (params.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    return apiClient<FaqRecord[]>(`${API_ENDPOINTS.faqs.list}${query ? `?${query}` : ""}`);
  },
};
