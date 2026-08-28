import { ArrowUpRight, Sparkles } from "lucide-react";
import { handleNewsroomImageError } from "../../utils/newsroomImageFallback";

export type NewsroomArticle = Readonly<{
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
  thumbnail?: string;
  source?: "seed" | "admin" | "api";
}>;

type ArticleCardProps = {
  article: NewsroomArticle;
};

const articleCardSyncStyles = `
  .newsroom-list-card--admin {
    border-color: rgba(229, 196, 119, 0.4);
    animation: newsroom-admin-card-in 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .newsroom-list-card__new-badge {
    position: absolute;
    z-index: 3;
    top: 13px;
    left: 13px;
    display: inline-flex;
    min-height: 27px;
    padding: 5px 10px;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(255, 230, 157, 0.5);
    border-radius: 999px;
    color: #17110a;
    background: linear-gradient(135deg, #f5db91, #d8ad4d);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28);
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  @keyframes newsroom-admin-card-in {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .newsroom-list-card--admin { animation: none; }
  }
`;

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <>
      <style data-component="newsroom-admin-article-card">{articleCardSyncStyles}</style>
      <article className={`newsroom-list-card${article.source === "admin" ? " newsroom-list-card--admin" : ""}`} data-newsroom-list-reveal>
        <a
          className="newsroom-list-card__media"
          href={`/newsroom/berita/${article.slug}`}
          aria-label={`Baca artikel ${article.title}`}
        >
          {article.source === "admin" ? (
            <span className="newsroom-list-card__new-badge"><Sparkles size={12} /> Baru</span>
          ) : null}
          <img
            src={article.thumbnail || article.image}
            alt={article.title}
            loading="lazy"
            decoding="async"
            onError={handleNewsroomImageError}
          />
        </a>

        <div className="newsroom-list-card__body">
          <div className="newsroom-list-card__meta">
            <span>{article.category}</span>
            <time>{article.publishedAt}</time>
          </div>

          <h2 className="newsroom-list-card__title">{article.title}</h2>
          <p className="newsroom-list-card__excerpt">{article.excerpt}</p>

          <a
            className="newsroom-list-card__link"
            href={`/newsroom/berita/${article.slug}`}
          >
            Baca Selengkapnya
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </article>
    </>
  );
};

export default ArticleCard;
