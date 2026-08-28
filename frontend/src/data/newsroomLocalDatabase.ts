/**
 * Newsroom local database — types and localStorage cache layer.
 * Seed data removed — all data now comes from API.
 */

export type NewsroomArticleContent = Readonly<{
  lead: string;
  sections: readonly Readonly<{
    heading: string;
    paragraphs: readonly string[];
  }>[];
  quote?: Readonly<{
    text: string;
    author: string;
  }>;
  figure?: Readonly<{
    image: string;
    alt: string;
    caption: string;
  }>;
}>;

// "Under Review" dapat dikembalikan API dari status DB under_review,
// meskipun editor artikel hanya mengelola Draft/Scheduled/Published.
export type NewsroomPublicationStatus =
  | "Draft"
  | "Scheduled"
  | "Published"
  | "Under Review";

export type NewsroomArticleVisibility = Readonly<{
  showHomepage: boolean;
  featuredArticle: boolean;
  breakingNews: boolean;
}>;

export type NewsroomArticleGalleryImage = Readonly<{
  src: string;
  alt: string;
}>;

export type NewsroomArticleSeo = Readonly<{
  title: string;
  description: string;
  ogImageUrl: string;
  canonicalUrl: string;
}>;

export type NewsroomArticleRecord = Readonly<{
  id: string | number;
  slug: string;
  title: string;
  detailTitle: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image: string;
  imageSrcSet?: string;
  imageSizes?: string;
  imageWidth?: number;
  imageHeight?: number;
  thumbnail?: string;
  gallery?: readonly NewsroomArticleGalleryImage[];
  author: string;
  featured?: boolean;
  viewCount?: number;
  publicationStatus?: NewsroomPublicationStatus;
  source?: "seed" | "admin" | "api";
  createdAt?: string;
  updatedAt?: string;
  releaseAt?: string;
  contentType?: string;
  categories?: readonly string[];
  tags?: string;
  coAuthor?: string;
  editorContent?: string;
  seo?: NewsroomArticleSeo;
  visibility?: NewsroomArticleVisibility;
  content: NewsroomArticleContent;
}>;

export type NewsroomEventRecord = Readonly<{
  id: string;
  numericId: number;
  access: "FREE" | "PAID";
  category: string;
  title: string;
  dateLabel: string;
  dateValue: string;
  day: string;
  month: string;
  year: string;
  time: string;
  location: string;
  href: string;
  image: string;
  action: string;
  featured?: boolean;
  price?: number;
}>;

export type NewsroomWebinarCardRecord = Readonly<{
  id: number;
  title: string;
  category:
    | "Berita Mahreen"
    | "Artikel & Insight"
    | "Event & Webinar"
    | "Internship Update";
  label: string;
  date: string;
  duration: string;
  speaker: string;
  price: string;
  image: string;
  href: string;
  labelTone?: "gold" | "light" | "red";
}>;

export type NewsroomTopicRecord = Readonly<{
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  webinarCount: number;
}>;

export type NewsroomSpeakerRecord = Readonly<{
  name: string;
  role: string;
  description: string;
  image: string;
}>;

export type NewsroomAnnouncementRecord = Readonly<{
  text: string;
  iconKey: "megaphone" | "star";
}>;

export type NewsroomNavigationRecord = Readonly<{
  label: string;
  href: string;
  iconKey: "trending" | "tag" | "calendar" | "verification";
}>;

export type NewsroomCategoryRecord = Readonly<{
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}>;

export type NewsroomDatabase = Readonly<{
  schemaVersion: 1;
  featuredArticleSlug: string;
  articles: readonly NewsroomArticleRecord[];
  events: readonly NewsroomEventRecord[];
  webinarCards: readonly NewsroomWebinarCardRecord[];
  topics: readonly NewsroomTopicRecord[];
  categories: readonly NewsroomCategoryRecord[];
  speakers: readonly NewsroomSpeakerRecord[];
  announcements: readonly NewsroomAnnouncementRecord[];
  navigation: readonly NewsroomNavigationRecord[];
}>;

const emptyDatabase: NewsroomDatabase = {
  schemaVersion: 1,
  featuredArticleSlug: "",
  articles: [],
  events: [],
  webinarCards: [],
  topics: [],
  categories: [],
  speakers: [],
  announcements: [],
  navigation: [],
};

const STORAGE_KEY = "mahreen.newsroom.database.v1";
const CHANGE_EVENT = "mahreen:newsroom-database-change";
let cachedDatabase: NewsroomDatabase | null = null;

const cloneEmptyDatabase = (): NewsroomDatabase =>
  JSON.parse(JSON.stringify(emptyDatabase)) as NewsroomDatabase;

const isDatabaseShape = (value: unknown): value is NewsroomDatabase => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NewsroomDatabase>;
  return (
    candidate.schemaVersion === 1 &&
    Array.isArray(candidate.articles) &&
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.webinarCards) &&
    Array.isArray(candidate.topics) &&
    Array.isArray(candidate.categories) &&
    Array.isArray(candidate.speakers) &&
    Array.isArray(candidate.announcements) &&
    Array.isArray(candidate.navigation)
  );
};

const persistDatabase = (database: NewsroomDatabase) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    return true;
  } catch {
    return false;
  }
};

const loadDatabase = (): NewsroomDatabase => {
  if (cachedDatabase) return cachedDatabase;
  const fallback = cloneEmptyDatabase();

  if (typeof window === "undefined") {
    cachedDatabase = fallback;
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isDatabaseShape(parsed)) {
        cachedDatabase = parsed;
        return parsed;
      }
    }
  } catch {
    // Invalid or unavailable local storage is replaced with empty database.
  }

  cachedDatabase = fallback;
  persistDatabase(fallback);
  return fallback;
};

const notifyDatabaseChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const getNewsroomDatabase = () => loadDatabase();

export const isPublishedNewsroomArticle = (article: NewsroomArticleRecord) =>
  article.publicationStatus === undefined || article.publicationStatus === "Published";

export const getPublishedNewsroomArticles = () =>
  getNewsroomDatabase().articles.filter(isPublishedNewsroomArticle);

export const saveNewsroomDatabase = (database: NewsroomDatabase) => {
  if (!persistDatabase(database)) {
    throw new Error("Newsroom local storage is unavailable or full.");
  }
  cachedDatabase = database;
  notifyDatabaseChange();
  return database;
};

export const resetNewsroomDatabase = () => {
  const database = cloneEmptyDatabase();
  return saveNewsroomDatabase(database);
};

export const upsertNewsroomArticle = (article: NewsroomArticleRecord) => {
  const current = getNewsroomDatabase();
  const existingIndex = current.articles.findIndex(
    (item) => item.id === article.id || item.slug === article.slug,
  );
  const articles = existingIndex >= 0
    ? current.articles.map((item, index) => (index === existingIndex ? article : item))
    : [article, ...current.articles];

  const shouldFeatureArticle =
    isPublishedNewsroomArticle(article) &&
    Boolean(article.featured || article.visibility?.featuredArticle || article.visibility?.showHomepage);
  const featuredArticleSlug = shouldFeatureArticle
    ? article.slug
    : current.featuredArticleSlug;

  return saveNewsroomDatabase({ ...current, featuredArticleSlug, articles });
};

export const deleteNewsroomArticle = (slug: string) => {
  const current = getNewsroomDatabase();
  const articles = current.articles.filter((article) => article.slug !== slug);
  if (articles.length === current.articles.length) return current;

  const featuredArticleSlug = current.featuredArticleSlug === slug
    ? articles.find(isPublishedNewsroomArticle)?.slug ?? ""
    : current.featuredArticleSlug;

  return saveNewsroomDatabase({ ...current, featuredArticleSlug, articles });
};

export const incrementNewsroomArticleView = (slug: string) => {
  const current = getNewsroomDatabase();
  const articleIndex = current.articles.findIndex((article) => article.slug === slug);
  if (articleIndex < 0) return null;

  const currentArticle = current.articles[articleIndex];
  const article: NewsroomArticleRecord = {
    ...currentArticle,
    viewCount: (currentArticle.viewCount ?? 0) + 1,
  };
  const articles = current.articles.map((item, index) =>
    index === articleIndex ? article : item,
  );
  saveNewsroomDatabase({ ...current, articles });
  return article;
};

export const subscribeNewsroomDatabase = (listener: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedDatabase = null;
    listener();
  };
  const handleLocalChange = () => listener();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleLocalChange);
  };
};

export const getNewsroomStorageKey = () => STORAGE_KEY;
