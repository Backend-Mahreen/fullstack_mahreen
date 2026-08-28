import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

export type ArticleComment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type CreateArticleCommentInput = {
  authorName: string;
  email?: string;
  content: string;
};

export const articleCommentsService = {
  async list(slug: string): Promise<ArticleComment[]> {
    return apiClient<ArticleComment[]>(API_ENDPOINTS.newsroom.articleComments(slug));
  },

  async create(slug: string, input: CreateArticleCommentInput): Promise<ArticleComment> {
    return apiClient<ArticleComment>(API_ENDPOINTS.newsroom.articleComments(slug), {
      method: "POST",
      body: input,
    });
  },
};
