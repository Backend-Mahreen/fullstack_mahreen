import type { WebinarData } from "../../data/webinars";
import {
  saveWebinarRegistration,
  type WebinarRegistrationFormData,
} from "../webinarRegistrationStorage";
import { runWithDataSource } from "../serviceMode";

const registerThroughApi = async (
  webinar: WebinarData,
  data: WebinarRegistrationFormData,
) => {
  return saveWebinarRegistration(webinar, data);
};

export const webinarService = {
  register(webinar: WebinarData, data: WebinarRegistrationFormData) {
    return runWithDataSource(
      () => registerThroughApi(webinar, data),
    );
  },
};
