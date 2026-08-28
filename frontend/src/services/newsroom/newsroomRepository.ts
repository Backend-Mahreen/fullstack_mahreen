import type {
  NewsroomArticleRecord,
  NewsroomDatabase,
} from "../../data/newsroomLocalDatabase";

export type NewsroomRepository = Readonly<{
  getDatabase: (includeAll?: boolean) => Promise<NewsroomDatabase>;
  saveArticle: (article: NewsroomArticleRecord) => Promise<NewsroomArticleRecord>;
  deleteArticle: (slug: string) => Promise<void>;
  recordView: (slug: string) => Promise<NewsroomArticleRecord | null>;
}>;
