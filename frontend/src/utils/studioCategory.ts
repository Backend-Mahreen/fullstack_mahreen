import { apiClient } from "../api/apiClient";
import { API_ENDPOINTS } from "../api/endpoints";

export type StudioCategory = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
};

let cachedCategories: StudioCategory[] | null = null;
let fetchPromise: Promise<StudioCategory[]> | null = null;

const mapCategory = (c: Record<string, unknown>): StudioCategory => ({
  id: String(c.id ?? ""),
  name: String(c.name ?? ""),
  slug: String(c.slug ?? ""),
  displayOrder: Number(c.display_order ?? 0),
});

export const fetchStudioCategories = async (): Promise<StudioCategory[]> => {
  if (cachedCategories) return cachedCategories;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient<Record<string, unknown>[]>(API_ENDPOINTS.studioPublic.categories)
    .then((data) => {
      const categories = Array.isArray(data) ? data.map(mapCategory) : [];
      cachedCategories = categories;
      return categories;
    })
    .catch(() => {
      const fallback: StudioCategory[] = [
        { id: "apparel", name: "Apparel", slug: "apparel", displayOrder: 1 },
        { id: "accessories", name: "Accessories", slug: "accessories", displayOrder: 2 },
        { id: "merchandise", name: "Merchandise", slug: "merchandise", displayOrder: 3 },
      ];
      cachedCategories = fallback;
      return fallback;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
};

export const normalizeStudioCategory = (raw: string): string => {
  const lower = raw.toLowerCase();
  if (lower.includes("apparel") || lower.includes("fashion")) return "Apparel";
  if (lower.includes("access")) return "Accessories";
  if (lower.includes("home") || lower.includes("decor")) return "Home Decor";
  if (lower.includes("light")) return "Lighting";
  if (lower.includes("furnish")) return "Furnishings";
  return "Merchandise";
};

export const invalidateCategoryCache = () => {
  cachedCategories = null;
};
