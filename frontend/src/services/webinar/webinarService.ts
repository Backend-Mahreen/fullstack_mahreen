import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { WebinarData } from "../../data/webinars";
import {
  storeWebinarRegistration,
  type StoredWebinarRegistration,
  type WebinarRegistrationFormData,
} from "../webinarRegistrationStorage";
import { runWithDataSource } from "../serviceMode";

const registerThroughApi = async (
  webinar: WebinarData,
  data: WebinarRegistrationFormData,
) => {
  const registration = await apiClient<StoredWebinarRegistration>(
    API_ENDPOINTS.webinars.register(webinar.slug),
    {
      method: "POST",
      body: {
        ...data,
        webinarSlug: webinar.slug,
      },
    },
  );
  return storeWebinarRegistration(registration);
};

export const webinarService = {
  register(webinar: WebinarData, data: WebinarRegistrationFormData) {
    return runWithDataSource(
      () => registerThroughApi(webinar, data),
    );
  },
};
