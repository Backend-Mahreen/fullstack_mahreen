import { fetchWebinars } from "./apiWebinarRepository";

/**
 * Types-only file. All seed data removed — data now comes from API.
 */

export type WebinarTimelineItem = {
  title: string;
  description: string;
  date: string;
};

export type WebinarMentor = {
  name: string;
  image: string;
  imageAlt: string;
  quote: string;
  bio: string;
  profileHref: string;
};

export type WebinarData = {
  slug: string;
  title: string;
  titleLead: string;
  titleHighlight: string;
  category: string;
  durationMinutes: number;
  description: string;
  price: number;
  originalPrice: number;
  isFree: boolean;
  scheduleDate: string;
  scheduleTime: string;
  heroImage: string;
  heroImageAlt: string;
  topics: readonly string[];
  mentor: WebinarMentor;
  timeline: readonly WebinarTimelineItem[];
  benefits: readonly string[];
  bundleTitle: string;
  bundleDescription: string;
};

let webinarCache: ReadonlyArray<WebinarData> | null = null;

export const getAllWebinars = (): ReadonlyArray<WebinarData> => {
  return webinarCache ?? [];
};

export const getWebinarBySlug = (slug: string) =>
  getAllWebinars().find((webinar) => webinar.slug === slug) ?? null;

export const loadWebinarsFromApi = async (): Promise<ReadonlyArray<WebinarData>> => {
  const webinars = await fetchWebinars();
  webinarCache = webinars;
  return webinars;
};

export const saveWebinars = (items: ReadonlyArray<WebinarData>) => {
  webinarCache = items;
  return items;
};

export const upsertWebinar = (webinar: WebinarData) => {
  const current = getAllWebinars();
  const exists = current.some((item) => item.slug === webinar.slug);
  return saveWebinars(
    exists
      ? current.map((item) => (item.slug === webinar.slug ? webinar : item))
      : [...current, webinar],
  );
};

export const resetWebinars = () => saveWebinars([]);

export const getWebinarDetailPath = (slug: string) =>
  `/newsroom/webinar/${encodeURIComponent(slug)}`;

export const getWebinarRegistrationPath = (slug: string) =>
  `${getWebinarDetailPath(slug)}/daftar`;

export const getWebinarPaymentPath = (slug: string) =>
  `${getWebinarDetailPath(slug)}/pembayaran`;

export const getWebinarPaymentInstructionPath = (
  slug: string,
  method: "qris" | "bank-transfer" | "e-wallet",
) =>
  `${getWebinarPaymentPath(slug)}/${
    method === "bank-transfer" ? "transfer-bank" : "qris"
  }`;

export const getWebinarSuccessPath = (slug: string) =>
  `${getWebinarDetailPath(slug)}/sukses`;

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
