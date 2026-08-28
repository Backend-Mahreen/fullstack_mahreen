import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { resolveMediaUrl } from "../../api/media";

export type PublicEventAccess = "FREE" | "PAID";

export type PublicEventRecord = Readonly<{
  id: string;
  title: string;
  category: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image: string;
  is_featured: 0 | 1;
  access_type: PublicEventAccess;
  quota: number;
  price: number;
  created_at: string;
}>;

const normalizeEventMedia = (event: PublicEventRecord): PublicEventRecord => ({
  ...event,
  image: resolveMediaUrl(event.image),
});

/**
 * Ambil detail satu event dari endpoint publik. Endpoint hanya mengembalikan
 * event berstatus published (backend memfilter status selain itu -> 404).
 */
export const getPublicEventById = async (eventId: string): Promise<PublicEventRecord> => {
  const event = await apiClient<PublicEventRecord>(API_ENDPOINTS.events.event(eventId));
  return normalizeEventMedia(event);
};

export const listPublicEvents = async (): Promise<PublicEventRecord[]> => {
  const events = await apiClient<PublicEventRecord[]>(API_ENDPOINTS.events.list);
  return events.map(normalizeEventMedia);
};
