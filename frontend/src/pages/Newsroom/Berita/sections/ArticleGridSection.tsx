import { ArrowDown } from "lucide-react";
import ArticleCard, {
  type NewsroomArticle,
} from "../components/ArticleCard";

const styles = `
  .newsroom-list-grid-section {
    width: min(100%, 1640px);
    margin-inline: auto;
    padding: 30px clamp(26px, 4.5vw, 78px) 112px;
  }


  .newsroom-list-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
  }

  .newsroom-list-grid-section__empty {
    display: grid;
    min-height: 320px;
    padding: 40px;
    place-items: center;
    color: #aaa39a;
    background: #0d0c0b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    font-size: 16px;
    text-align: center;
  }

  .newsroom-list-grid-section__load {
    display: flex;
    margin-top: 54px;
    justify-content: center;
  }

  .newsroom-list-grid-section__load button {
    display: inline-flex;
    min-height: 54px;
    padding: 0 28px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    color: #e5c477;
    background: transparent;
    border: 1px solid rgba(229, 196, 119, 0.48);
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    transition:
      color 180ms ease,
      background 180ms ease,
      transform 180ms ease;
  }

  .newsroom-list-grid-section__load button:hover,
  .newsroom-list-grid-section__load button:focus-visible {
    color: #17110a;
    background: #e5c477;
    transform: translateY(-2px);
  }

  @media (max-width: 1320px) {
    .newsroom-list-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 960px) {
    .newsroom-list-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 700px) {
    .newsroom-list-grid-section {
      padding: 22px 20px 76px;
    }

    .newsroom-list-grid {
      grid-template-columns: 1fr;
    }
  }
`;

type ArticleGridSectionProps = {
  articles: readonly NewsroomArticle[];
  visibleCount: number;
  onLoadMore: () => void;
};

const ArticleGridSection = ({
  articles,
  visibleCount,
  onLoadMore,
}: ArticleGridSectionProps) => {
  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <>
      <style>{styles}</style>

      <section className="newsroom-list-grid-section">
        {visibleArticles.length > 0 ? (
          <div className="newsroom-list-grid">
            {visibleArticles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        ) : (
          <div
            className="newsroom-list-grid-section__empty"
            data-newsroom-list-reveal
          >
            Artikel yang sesuai belum ditemukan. Coba gunakan kata kunci atau
            kategori lain.
          </div>
        )}

        {hasMore && (
          <div
            className="newsroom-list-grid-section__load"
            data-newsroom-list-reveal
          >
            <button type="button" onClick={onLoadMore}>
              Load More Updates
              <ArrowDown size={17} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default ArticleGridSection;
