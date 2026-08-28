import type {
  NewsroomArticleContent,
  NewsroomArticleRecord,
} from "../../../../../data/newsroomLocalDatabase";
import type { ArticleEditorSubmission } from "./NewsroomArticleEditor";
import {
  createInitialArticleData,
  slugifyArticleTitle,
  type ArticleEditorData,
  type ArticleMediaItem,
} from "./articleEditorTypes";

const cleanParagraph = (value: string) =>
  value
    .replace(/^#{1,4}\s+/, "")
    .replace(/^[-*]\s+/, "• ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

const buildContent = (
  content: string,
  excerpt: string,
  existingContent?: NewsroomArticleContent,
): NewsroomArticleContent => {
  const paragraphs = content
    .split(/\n\s*\n|\n(?=[-•])/)
    .map(cleanParagraph)
    .filter(Boolean);

  return {
    lead: excerpt,
    sections: [
      {
        heading: "Isi Artikel",
        paragraphs: paragraphs.length > 0 ? paragraphs : [excerpt],
      },
    ],
    quote: existingContent?.quote,
    figure: existingContent?.figure,
  };
};

const formatPublicationDate = (date: string) => {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Hari ini";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const calculateReadTime = (content: string) => {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} Min Read`;
};

export const mapEditorSubmissionToArticle = (
  { article, status }: ArticleEditorSubmission,
  fallbackImage: string,
  existingArticle?: NewsroomArticleRecord | null,
): NewsroomArticleRecord => {
  const now = new Date().toISOString();
  const slug = slugifyArticleTitle(article.slug || article.title);
  const image = article.featuredImage?.preview || existingArticle?.image || article.thumbnail?.preview || fallbackImage;
  const releaseAt = `${article.releaseDate}T${article.releaseTime || "09:00"}:00`;

  return {
    id: existingArticle?.id ?? Date.now(),
    slug,
    title: article.title.trim(),
    detailTitle: article.title.trim(),
    excerpt: article.excerpt.trim(),
    category: article.categories[0] || "Artikel & Insight",
    publishedAt: formatPublicationDate(article.releaseDate),
    readTime: calculateReadTime(article.content),
    image,
    thumbnail: article.thumbnail?.preview,
    gallery: article.gallery
      .filter((item): item is ArticleMediaItem => item !== null)
      .map((item) => ({ src: item.preview, alt: item.name || article.title.trim() })),
    author: article.primaryAuthor,
    featured: article.featuredArticle || article.showHomepage,
    viewCount: existingArticle?.viewCount ?? 0,
    publicationStatus: status,
    source: existingArticle?.source ?? "admin",
    createdAt: existingArticle?.createdAt ?? now,
    updatedAt: now,
    releaseAt,
    contentType: article.contentType,
    categories: article.categories,
    tags: article.tags,
    coAuthor: article.coAuthor,
    editorContent: article.content,
    seo: {
      title: article.seoTitle,
      description: article.metaDescription,
      ogImageUrl: article.ogImageUrl,
      canonicalUrl: article.canonicalUrl,
    },
    visibility: {
      showHomepage: article.showHomepage,
      featuredArticle: article.featuredArticle,
      breakingNews: article.breakingNews,
    },
    content: buildContent(article.content, article.excerpt, existingArticle?.content),
  };
};

const createMediaItem = (preview: string | undefined, name: string) =>
  preview ? { name, preview } : null;

const getEditableContent = (article: NewsroomArticleRecord) =>
  article.editorContent ?? article.content.sections
    .flatMap((section) => section.paragraphs)
    .join("\n\n");

export const mapArticleToEditorData = (
  article: NewsroomArticleRecord,
): ArticleEditorData => {
  const initial = createInitialArticleData();
  const gallery: Array<ArticleMediaItem | null> = (article.gallery ?? []).map((item) => ({
    name: item.alt,
    preview: item.src,
  }));
  while (gallery.length < 4) gallery.push(null);

  const releaseAt = article.releaseAt ?? article.createdAt;
  const releaseDate = releaseAt?.slice(0, 10) || initial.releaseDate;
  const releaseTime = releaseAt?.slice(11, 16) || initial.releaseTime;

  return {
    ...initial,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: getEditableContent(article),
    // Editor hanya mendukung Draft/Scheduled/Published. Artikel dengan status
    // "Under Review" (dari DB) dipetakan ke Draft agar form tidak kosong.
    status: article.publicationStatus === "Under Review" ? "Draft" : (article.publicationStatus ?? "Published"),
    releaseDate,
    releaseTime,
    contentType: article.contentType ?? initial.contentType,
    categories: [...(article.categories ?? [article.category])],
    tags: article.tags ?? "",
    primaryAuthor: article.author,
    coAuthor: article.coAuthor ?? "",
    showHomepage: article.visibility?.showHomepage ?? Boolean(article.featured),
    featuredArticle: article.visibility?.featuredArticle ?? false,
    breakingNews: article.visibility?.breakingNews ?? false,
    featuredImage: createMediaItem(article.image, "Featured image"),
    thumbnail: createMediaItem(article.thumbnail, "Article thumbnail"),
    gallery,
    seoTitle: article.seo?.title ?? article.detailTitle,
    metaDescription: article.seo?.description ?? article.excerpt,
    ogImageUrl: article.seo?.ogImageUrl ?? article.image,
    canonicalUrl: article.seo?.canonicalUrl ?? `/newsroom/berita/${article.slug}`,
  };
};
