import { apiClient } from "../api/apiClient";
import { resolveMediaUrl } from "../api/media";
import type { WebinarData } from "./webinars";

const emptyWebinars: WebinarData[] = [];

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseDurationMinutes = (duration: unknown): number => {
  if (typeof duration === "number") return duration;
  if (typeof duration !== "string") return 0;
  const match = duration.match(/(\d+(?:[.,]\d+)?)\s*(?:jam|h|hours?)/i);
  if (!match) return 0;
  const hours = Number(match[1].replace(",", "."));
  return Math.round((Number.isFinite(hours) ? hours : 0) * 60);
};

const parseMentors = (value: unknown): WebinarData["mentor"] => {
  const list = Array.isArray(value) ? value : [];
  const first = (list[0] as Record<string, unknown> | undefined) ?? {};
  return {
    name: String(first.name ?? ""),
    image: resolveMediaUrl(String(first.image ?? "")),
    imageAlt: String(first.imageAlt ?? first.name ?? ""),
    quote: String(first.quote ?? ""),
    bio: String(first.bio ?? ""),
    profileHref: String(first.profileHref ?? "/newsroom"),
  };
};

const parseJsonArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const mapWebinar = (w: Record<string, unknown>): WebinarData => {
  const title = String(w.title ?? "");
  const topics = parseJsonArray(w.topics).map(String);
  const timeline = parseJsonArray(w.timeline).map((item) => {
    const entry = (item as Record<string, unknown>) ?? {};
    return {
      title: String(entry.title ?? ""),
      description: String(entry.description ?? ""),
      date: String(entry.date ?? ""),
    };
  });
  const benefits = parseJsonArray(w.benefits).map(String);

  return {
    slug: String(w.slug ?? ""),
    title,
    titleLead: String(w.titleLead ?? w.title ?? ""),
    titleHighlight: String(w.titleHighlight ?? ""),
    category: String(w.category ?? ""),
    durationMinutes: toNumber(w.durationMinutes) || parseDurationMinutes(w.duration),
    description: String(w.description ?? ""),
    price: toNumber(w.price),
    originalPrice: toNumber(w.originalPrice),
    isFree: w.isFree === true || w.is_free === true || toNumber(w.is_free) === 1,
    scheduleDate: String(w.scheduleDate ?? w.schedule_date ?? ""),
    scheduleTime: String(w.scheduleTime ?? w.schedule_time ?? ""),
    heroImage: resolveMediaUrl(String(w.heroImage ?? w.image ?? "")),
    heroImageAlt: String(w.heroImageAlt ?? ""),
    topics,
    mentor: parseMentors(w.mentors ?? w.mentor),
    timeline,
    benefits,
    bundleTitle: String(w.bundleTitle ?? ""),
    bundleDescription: String(w.bundleDescription ?? ""),
  };
};

export const fetchWebinars = async (): Promise<WebinarData[]> => {
  try {
    const data = await apiClient<Record<string, unknown>>("/webinars");
    // Backend sendSuccess envelope: { data: [...] } atau array langsung
    const raw = Array.isArray(data)
      ? data
      : Array.isArray((data as Record<string, unknown>).data)
        ? ((data as Record<string, unknown>).data as Record<string, unknown>[])
        : [];
    return raw.map(mapWebinar);
  } catch {
    return emptyWebinars;
  }
};

export const fetchWebinarBySlug = async (slug: string): Promise<WebinarData | null> => {
  try {
    const data = await apiClient<Record<string, unknown>>(`/webinars/${encodeURIComponent(slug)}`);
    // Backend sendSuccess envelope: { data: {...} } atau objek langsung
    const raw = (data as Record<string, unknown>)?.data ?? data;
    return raw ? mapWebinar(raw as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};
