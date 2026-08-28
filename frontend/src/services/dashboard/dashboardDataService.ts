import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  getDashboardLocalData,
  type DashboardLocalData,
} from "../../pages/DashboardClient/dashboardLocalData";
import type { AuthUser } from "../../types/auth";
import { runWithDataSource } from "../serviceMode";
import { dashboardRepository } from "./dashboardRepository";

export interface DashboardDataSource {
  load(user: AuthUser): Promise<DashboardLocalData>;
}

export const localDashboardDataSource: DashboardDataSource = {
  async load(user) {
    return getDashboardLocalData(user);
  },
};

export const apiDashboardDataSource: DashboardDataSource = {
  async load() {
    return apiClient<DashboardLocalData>(API_ENDPOINTS.clientDashboard.overview);
  },
};

export const dashboardDataService = {
  getInitial(user: AuthUser): DashboardLocalData | null {
    return getDashboardLocalData(user);
  },
  load(user: AuthUser): Promise<DashboardLocalData> {
    return runWithDataSource(
      () => apiDashboardDataSource.load(user),
      () => localDashboardDataSource.load(user),
    );
  },
  subscribe(listener: () => void) {
    return dashboardRepository.subscribe(listener);
  },
};
