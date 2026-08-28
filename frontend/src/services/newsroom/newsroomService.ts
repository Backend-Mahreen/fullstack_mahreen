import {
  deleteNewsroomArticle,
  getNewsroomDatabase,
  saveNewsroomDatabase,
  subscribeNewsroomDatabase,
  upsertNewsroomArticle,
  type NewsroomArticleRecord,
} from "../../data/newsroomLocalDatabase";
import { apiNewsroomRepository } from "./apiNewsroomRepository";

let hydrationRequest: Promise<void> | null = null;
let hasHydrated = false;
const viewedArticleSlugs = new Set<string>();

const getViewSessionKey = (slug: string) => `mahreen.newsroom.viewed.${slug}`;

const hasRecordedView = (slug: string) => {
  if (viewedArticleSlugs.has(slug)) return true;
  try {
    return window.sessionStorage.getItem(getViewSessionKey(slug)) === "1";
  } catch {
    return false;
  }
};

const markViewRecorded = (slug: string) => {
  viewedArticleSlugs.add(slug);
  try {
    window.sessionStorage.setItem(getViewSessionKey(slug), "1");
  } catch {
    // Set memori tetap mencegah view ganda selama tab aktif.
  }
};

const unmarkViewRecorded = (slug: string) => {
  viewedArticleSlugs.delete(slug);
  try {
    window.sessionStorage.removeItem(getViewSessionKey(slug));
  } catch {
    // Tidak ada state browser yang perlu dipulihkan.
  }
};

export const newsroomService = {
  getSnapshot: getNewsroomDatabase,
  subscribe: subscribeNewsroomDatabase,

  hydrate(includeAll = false) {
    if (hasHydrated && !includeAll) return Promise.resolve();
    if (hydrationRequest && !includeAll) return hydrationRequest;

    hydrationRequest = apiNewsroomRepository.getDatabase(includeAll)
      .then((database) => {
        saveNewsroomDatabase(database);
        hasHydrated = true;
      })
      .finally(() => {
        hydrationRequest = null;
      });

    return hydrationRequest;
  },

  hydrateAdmin() {
    hasHydrated = false;
    return this.hydrate(true);
  },

  async saveArticle(article: NewsroomArticleRecord) {
    const savedArticle = await apiNewsroomRepository.saveArticle(article);
    const cachedArticle = getNewsroomDatabase().articles.find(
      (item) => item.slug === savedArticle.slug,
    );
    if (cachedArticle !== savedArticle) upsertNewsroomArticle(savedArticle);
    return savedArticle;
  },

  async deleteArticle(slug: string) {
    await apiNewsroomRepository.deleteArticle(slug);
    if (getNewsroomDatabase().articles.some((article) => article.slug === slug)) {
      deleteNewsroomArticle(slug);
    }
  },

  async recordView(slug: string) {
    if (hasRecordedView(slug)) return null;
    markViewRecorded(slug);

    try {
      const article = await apiNewsroomRepository.recordView(slug);
      const cachedArticle = getNewsroomDatabase().articles.find(
        (item) => item.slug === slug,
      );
      if (article && cachedArticle !== article) upsertNewsroomArticle(article);
      return article;
    } catch (error) {
      unmarkViewRecorded(slug);
      throw error;
    }
  },

  getDataSourceMode() {
    return "api" as const;
  },
};
