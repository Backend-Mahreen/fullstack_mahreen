import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type AdminClientRecord = Readonly<{
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login_at: string;
  account_type: string;
  institution: string;
  job_title: string;
  total_orders: number;
  active_projects: number;
  total_spent: number;
  total_donations: number;
  total_consultations: number;
  total_certificates: number;
}>;

export type AdminClientStats = Readonly<{
  user: { id: string; full_name: string; email: string; role: string; status: string; created_at: string };
  activeProjects: number;
  totalOrders: number;
  ongoingOrder: { id: string; service_key: string; tier: string; client_name: string; total_price: number; status: string; invoice_id: string; created_at: string } | null;
  totalDonations: number;
  totalDonated: number;
  totalCertificates: number;
  issuedCertificates: number;
}>;

export type AdminClientActivity = Readonly<{
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}>;

export type AdminPaginatedResult<T> = Readonly<{
  items: T[];
  pagination: Readonly<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}>;

export type AdminClientListParams = Readonly<{
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}>;

const asNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const adminClientsRepository = {
  async list(params: AdminClientListParams = {}): Promise<AdminPaginatedResult<AdminClientRecord>> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    return apiClient<AdminPaginatedResult<AdminClientRecord>>(
      `${API_ENDPOINTS.admin.clients}${query ? `?${query}` : ""}`,
    );
  },

  async getStats(clientId: string): Promise<AdminClientStats> {
    const data = await apiClient<Record<string, unknown>>(API_ENDPOINTS.admin.clientStats(clientId));
    const ongoing = data.ongoingOrder as Record<string, unknown> | null;
    return {
      user: (data.user ?? {}) as AdminClientStats["user"],
      activeProjects: asNumber(data.activeProjects),
      totalOrders: asNumber(data.totalOrders),
      ongoingOrder: ongoing ? {
        id: String(ongoing.id ?? ""),
        service_key: String(ongoing.service_key ?? ""),
        tier: String(ongoing.tier ?? ""),
        client_name: String(ongoing.client_name ?? ""),
        total_price: asNumber(ongoing.total_price),
        status: String(ongoing.status ?? ""),
        invoice_id: String(ongoing.invoice_id ?? ""),
        created_at: String(ongoing.created_at ?? ""),
      } : null,
      totalDonations: asNumber(data.totalDonations),
      totalDonated: asNumber(data.totalDonated),
      totalCertificates: asNumber(data.totalCertificates),
      issuedCertificates: asNumber(data.issuedCertificates),
    };
  },

  async getActivity(clientId: string, limit = 20): Promise<AdminClientActivity[]> {
    const data = await apiClient<AdminClientActivity[]>(
      `${API_ENDPOINTS.admin.clientActivity(clientId)}?limit=${limit}`,
    );
    return Array.isArray(data) ? data : [];
  },

  async getOrders(clientId: string, limit = 50): Promise<Record<string, unknown>[]> {
    const data = await apiClient<{ items: Record<string, unknown>[] }>(
      `${API_ENDPOINTS.admin.clientOrders(clientId)}?limit=${limit}`,
    );
    return Array.isArray(data) ? data : (data?.items ?? []);
  },

  async getCertificates(clientId: string, limit = 50): Promise<Record<string, unknown>[]> {
    const data = await apiClient<{ items: Record<string, unknown>[] }>(
      `${API_ENDPOINTS.admin.clientCertificates(clientId)}?limit=${limit}`,
    );
    return Array.isArray(data) ? data : (data?.items ?? []);
  },

  async getConsultations(clientId: string, limit = 50): Promise<Record<string, unknown>[]> {
    const data = await apiClient<{ items: Record<string, unknown>[] }>(
      `${API_ENDPOINTS.admin.clientConsultations(clientId)}?limit=${limit}`,
    );
    return Array.isArray(data) ? data : (data?.items ?? []);
  },
};