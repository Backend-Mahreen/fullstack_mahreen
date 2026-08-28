import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { runWithDataSource } from "../serviceMode";
import { getDemoRecordStorage } from "../storage/dataSourceStorage";

const LOCAL_ENGAGEMENT_KEY = "mahreen:engagement:submissions";

export type PublicSubmissionResult = Readonly<{
  submissionId: string;
  submittedAt: string;
  status: "received";
}>;

export type ContactInquiryInput = Readonly<{
  name: string;
  email: string;
  company?: string;
  partnership: string;
  details: string;
}>;

export type NewsletterSource =
  | "newsroom-home"
  | "newsroom-events"
  | "article-detail"
  | "studio-inner-circle";

export type NewsletterSubscriptionInput = Readonly<{
  email: string;
  name?: string;
  source: NewsletterSource;
  articleSlug?: string;
}>;

export type SupportTicketInput = Readonly<{
  name: string;
  email: string;
  category: string;
  message: string;
}>;

type LocalEngagementRecord = PublicSubmissionResult &
  Readonly<{
    kind: "contact" | "newsletter" | "support";
    payload: ContactInquiryInput | NewsletterSubscriptionInput | SupportTicketInput;
  }>;

const createLocalResult = (): PublicSubmissionResult => ({
  submissionId: `ENG-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`,
  submittedAt: new Date().toISOString(),
  status: "received",
});

const persistLocalSubmission = async (
  kind: LocalEngagementRecord["kind"],
  payload: LocalEngagementRecord["payload"],
): Promise<PublicSubmissionResult> => {
  const result = createLocalResult();
  const storage = getDemoRecordStorage();

  if (storage) {
    let records: LocalEngagementRecord[] = [];

    try {
      const stored = storage.getItem(LOCAL_ENGAGEMENT_KEY);
      const parsed = stored ? (JSON.parse(stored) as unknown) : [];
      if (Array.isArray(parsed)) records = parsed as LocalEngagementRecord[];
    } catch {
      records = [];
    }

    try {
      storage.setItem(
        LOCAL_ENGAGEMENT_KEY,
        JSON.stringify([...records, { ...result, kind, payload }]),
      );
    } catch {
      // Demo tetap dapat digunakan ketika browser memblokir storage.
    }
  }

  return result;
};

export const publicEngagementService = Object.freeze({
  submitContact(input: ContactInquiryInput) {
    return runWithDataSource(
      () =>
        apiClient<PublicSubmissionResult>(API_ENDPOINTS.engagement.contactInquiries, {
          method: "POST",
          body: input,
        }),
      () => persistLocalSubmission("contact", input),
    );
  },

  subscribeNewsletter(input: NewsletterSubscriptionInput) {
    return runWithDataSource(
      () =>
        apiClient<PublicSubmissionResult>(
          API_ENDPOINTS.engagement.newsletterSubscriptions,
          {
            method: "POST",
            body: input,
          },
        ),
      () => persistLocalSubmission("newsletter", input),
    );
  },

  submitSupportTicket(input: SupportTicketInput) {
    return runWithDataSource(
      () =>
        apiClient<PublicSubmissionResult>(API_ENDPOINTS.engagement.supportTickets, {
          method: "POST",
          body: input,
        }),
      () => persistLocalSubmission("support", input),
    );
  },
});
