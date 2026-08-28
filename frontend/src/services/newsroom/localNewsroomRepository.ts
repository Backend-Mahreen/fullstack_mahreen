import {
  deleteNewsroomArticle,
  getNewsroomDatabase,
  incrementNewsroomArticleView,
  upsertNewsroomArticle,
} from "../../data/newsroomLocalDatabase";
import type { NewsroomRepository } from "./newsroomRepository";

export const localNewsroomRepository: NewsroomRepository = {
  async getDatabase() {
    return getNewsroomDatabase();
  },
  async saveArticle(article) {
    upsertNewsroomArticle(article);
    return article;
  },
  async deleteArticle(slug) {
    deleteNewsroomArticle(slug);
  },
  async recordView(slug) {
    return incrementNewsroomArticleView(slug);
  },
};
