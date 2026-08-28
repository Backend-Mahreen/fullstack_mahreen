import { ArrowUpRight } from "lucide-react";
import { usePublishedNewsroomDatabase } from "../../../../hooks/useNewsroomDatabase";

const styles = `
  .article-related {
    width: 100%;
    padding: 28px;
    border: 1px solid rgba(229, 196, 119, 0.18);
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(20, 19, 17, 0.98), rgba(10, 10, 9, 0.98));
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.28);
  }

  .article-related__title {
    margin: 0 0 8px;
    color: #f2ece4;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.2;
  }

  .article-related__line {
    width: 48px;
    height: 1px;
    margin-bottom: 9px;
    background: #e5c477;
    box-shadow: 0 0 10px rgba(229, 196, 119, 0.25);
  }

  .article-related__item {
    display: block;
    padding: 18px 0;
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .article-related__item:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .article-related__meta {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #b89a5e;
    font-size: 9px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 0.75px;
    text-transform: uppercase;
  }

  .article-related__date {
    flex: 0 0 auto;
    color: #858078;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
  }

  .article-related__item-title {
    display: flex;
    margin: 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    color: #e6e0d8;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.55;
    transition: color 180ms ease;
  }

  .article-related__item svg {
    flex: 0 0 auto;
    margin-top: 3px;
    color: #e5c477;
    opacity: 0;
    transform: translate(-5px, 5px);
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .article-related__item:hover .article-related__item-title,
  .article-related__item:focus-visible .article-related__item-title {
    color: #e5c477;
  }

  .article-related__item:hover svg,
  .article-related__item:focus-visible svg {
    opacity: 1;
    transform: translate(0, 0);
  }

  @media (max-width: 980px) {
    .article-related {
      padding: 24px;
    }
  }
`;

type BeritaTerkaitProps = {
  currentSlug: string;
};

const BeritaTerkait = ({ currentSlug }: BeritaTerkaitProps) => {
  const { articles } = usePublishedNewsroomDatabase();
  const relatedArticles = [...articles]
    .filter((article) => article.slug !== currentSlug)
    .sort(
      (first, second) =>
        new Date(second.publishedAt || second.createdAt || 0).getTime() -
        new Date(first.publishedAt || first.createdAt || 0).getTime(),
    )
    .slice(0, 3);

  return (
    <>
      <style>{styles}</style>

      <aside className="article-related" data-article-reveal>
        <h2 className="article-related__title">Berita Terkait</h2>
        <div className="article-related__line" aria-hidden="true" />

        {relatedArticles.map((article) => (
          <a
            className="article-related__item"
            href={`/newsroom/berita/${article.slug}`}
            key={article.slug}
          >
            <div className="article-related__meta">
              <span>{article.category}</span>
              <time className="article-related__date">{article.publishedAt}</time>
            </div>

            <p className="article-related__item-title">
              <span>{article.title}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </p>
          </a>
        ))}
      </aside>
    </>
  );
};

export default BeritaTerkait;
