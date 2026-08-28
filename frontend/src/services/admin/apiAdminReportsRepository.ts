import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type ReportLogEntry = Readonly<{
  id: string;
  timestamp: string;
  source: "audit" | "activity" | "analytics";
  action: string;
  actor: string;
  title: string;
  description: string;
  resource: string;
  resourceId: string;
  metadata?: unknown;
}>;

export type ReportLogParams = Readonly<{
  source?: "all" | "audit" | "activity" | "analytics";
  action?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}>;

export type ReportLogResult = Readonly<{
  items: ReportLogEntry[];
  pagination: Readonly<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;
  summary: Readonly<{
    total: number;
    bySource: Record<string, number>;
  }>;
}>;

export const adminReportsRepository = {
  async list(params: ReportLogParams = {}): Promise<ReportLogResult> {
    const searchParams = new URLSearchParams();
    if (params.source && params.source !== "all") searchParams.set("source", params.source);
    if (params.action) searchParams.set("action", params.action);
    if (params.search) searchParams.set("search", params.search);
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    return apiClient<ReportLogResult>(
      `${API_ENDPOINTS.admin.reportsLogs}${query ? `?${query}` : ""}`,
    );
  },

  async exportCsv(params: Omit<ReportLogParams, "page" | "limit"> = {}): Promise<string> {
    const searchParams = new URLSearchParams();
    if (params.source && params.source !== "all") searchParams.set("source", params.source);
    if (params.action) searchParams.set("action", params.action);
    if (params.search) searchParams.set("search", params.search);
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);

    const query = searchParams.toString();
    const response = await apiClient<string>(
      `${API_ENDPOINTS.admin.reportsExport}${query ? `?${query}` : ""}`,
      { timeoutMs: 30000 },
    );
    return typeof response === "string" ? response : "";
  },
};