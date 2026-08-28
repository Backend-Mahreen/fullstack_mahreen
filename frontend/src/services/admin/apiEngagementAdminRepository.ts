import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type ContactInquiryStatus = "new" | "read" | "responded" | "closed";
export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type ContactInquiryRecord = Readonly<{
  id: string;
  name: string;
  email: string;
  company: string;
  partnership: string;
  details: string;
  status: ContactInquiryStatus;
  created_at: string;
}>;

export type SupportTicketRecord = Readonly<{
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: SupportTicketStatus;
  created_at: string;
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

export type AdminListParams = Readonly<{
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}>;

const buildQuery = (params: AdminListParams) => {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  return searchParams.toString();
};

export const apiEngagementAdminRepository = {
  async listContactInquiries(params: AdminListParams = {}): Promise<AdminPaginatedResult<ContactInquiryRecord>> {
    const query = buildQuery(params);
    return apiClient<AdminPaginatedResult<ContactInquiryRecord>>(
      `${API_ENDPOINTS.admin.contactInquiries}${query ? `?${query}` : ""}`,
    );
  },

  async updateContactInquiryStatus(id: string, status: ContactInquiryStatus): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.contactInquiryStatus(id), {
      method: "PATCH",
      body: { status },
    });
  },

  async deleteContactInquiry(id: string): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.contactInquiry(id), { method: "DELETE" });
  },

  async listSupportTickets(params: AdminListParams = {}): Promise<AdminPaginatedResult<SupportTicketRecord>> {
    const query = buildQuery(params);
    return apiClient<AdminPaginatedResult<SupportTicketRecord>>(
      `${API_ENDPOINTS.admin.supportTickets}${query ? `?${query}` : ""}`,
    );
  },

  async updateSupportTicketStatus(id: string, status: SupportTicketStatus): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.supportTicketStatus(id), {
      method: "PATCH",
      body: { status },
    });
  },

  async deleteSupportTicket(id: string): Promise<void> {
    await apiClient(API_ENDPOINTS.admin.supportTicket(id), { method: "DELETE" });
  },
};