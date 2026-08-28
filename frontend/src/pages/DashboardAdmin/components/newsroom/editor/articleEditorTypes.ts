export type ArticlePublicationStatus = "Draft" | "Scheduled" | "Published";

export type ArticleMediaItem = Readonly<{
  name: string;
  preview: string;
}>;

export type ArticleEditorData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: ArticlePublicationStatus;
  releaseDate: string;
  releaseTime: string;
  contentType: string;
  categories: string[];
  tags: string;
  primaryAuthor: string;
  coAuthor: string;
  showHomepage: boolean;
  featuredArticle: boolean;
  breakingNews: boolean;
  featuredImage: ArticleMediaItem | null;
  thumbnail: ArticleMediaItem | null;
  gallery: Array<ArticleMediaItem | null>;
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
};

export type ArticleEditorUpdate = Partial<ArticleEditorData>;

export const slugifyArticleTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const createInitialArticleData = (): ArticleEditorData => ({
  title: "",
  slug: "future-of-ai-technology",
  excerpt: "A brief hook for the article card...",
  content: "",
  status: "Draft",
  releaseDate: new Date().toISOString().slice(0, 10),
  releaseTime: "09:00",
  contentType: "Article",
  categories: ["Technology", "Creative"],
  tags: "AI, Transformation, Innovation",
  primaryAuthor: "Admin Mahreen",
  coAuthor: "",
  showHomepage: true,
  featuredArticle: false,
  breakingNews: false,
  featuredImage: null,
  thumbnail: null,
  gallery: [null, null, null, null],
  seoTitle: "The Future of AI Technology | Mahreen Indonesia",
  metaDescription: "Discover how Mahreen is leading the charge in AI integration...",
  ogImageUrl: "https://cdn.mahreen.id/og-default.jpg",
  canonicalUrl: "https://mahreen.id/insight/ai-future",
});
