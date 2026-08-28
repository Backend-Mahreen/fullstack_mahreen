import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { resolveMediaUrl } from "../../api/media";
import type {
  NewsroomArticleRecord,
  NewsroomDatabase,
} from "../../data/newsroomLocalDatabase";
import type { NewsroomRepository } from "./newsroomRepository";

// Ubah setiap URL media backend ("/uploads/...") menjadi URL absolut yang siap
// dipakai <img src> di seluruh view client/admin, tanpa menyentuh tiap komponen.
const normalizeArticleMedia = (article: NewsroomArticleRecord): NewsroomArticleRecord => ({
  ...article,
  image: resolveMediaUrl(article.image),
  thumbnail: article.thumbnail ? resolveMediaUrl(article.thumbnail) : article.thumbnail,
  gallery: article.gallery?.map((item) => ({ ...item, src: resolveMediaUrl(item.src) })),
});

const normalizeDatabaseMedia = (database: NewsroomDatabase): NewsroomDatabase => ({
  ...database,
  articles: database.articles.map(normalizeArticleMedia),
});

export const apiNewsroomRepository: NewsroomRepository = {
  async getDatabase(includeAll = false) {
    const url = includeAll ? `${API_ENDPOINTS.newsroom.database}?includeAll=true` : API_ENDPOINTS.newsroom.database;
    const database = await apiClient<NewsroomDatabase>(url);
    return normalizeDatabaseMedia(database);
  },
  async saveArticle(article) {
    const saved = await apiClient<NewsroomArticleRecord>(API_ENDPOINTS.newsroom.articles, {
      method: "POST",
      body: article,
    });
    return normalizeArticleMedia(saved);
  },
  async deleteArticle(slug) {
    await apiClient<void>(API_ENDPOINTS.newsroom.article(slug), {
      method: "DELETE",
    });
  },
  recordView(slug) {
    return apiClient<NewsroomArticleRecord | null>(
      API_ENDPOINTS.newsroom.articleView(slug),
      { method: "POST" },
    );
  },
};
