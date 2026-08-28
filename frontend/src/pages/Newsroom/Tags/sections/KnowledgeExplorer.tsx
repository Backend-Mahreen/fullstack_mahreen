import {
  BookOpen,
} from "lucide-react";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";
import type { TopicCategory, TopicSort } from "./FilterSection";

type KnowledgeExplorerProps = {
  query: string;
  category: TopicCategory;
  sort: TopicSort;
  visibleCount: number;
  onLoadMore: () => void;
};

const KnowledgeExplorer = ({
  query,
  category: _category,
  sort,
  visibleCount,
  onLoadMore,
}: KnowledgeExplorerProps) => {
  const { topics } = useNewsroomDatabase();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTopics = [...topics]
    .filter((item) => {
      const queryMatches =
        normalizedQuery.length === 0 ||
        (item.name || "").toLowerCase().includes(normalizedQuery) ||
        (item.slug || "").toLowerCase().includes(normalizedQuery);
      return queryMatches;
    })
    .sort((first, second) =>
      sort === "ALPHABETICAL"
        ? (first.name || "").localeCompare(second.name || "")
        : (second.articleCount || 0) - (first.articleCount || 0),
    );

  const visibleTopics = filteredTopics.slice(0, visibleCount);
  const hasMore = visibleTopics.length < filteredTopics.length;

  return (
    <section
      className="tag-knowledge-section newsroom-content-section"
      id="knowledge-explorer"
    >
      <div className="tag-knowledge-header" data-newsroom-reveal>
        <div>
          <h2>Knowledge Explorer</h2>
          <p>Temukan topik menarik dalam ekosistem Mahreen.</p>
        </div>
        <span className="tag-topics-count">
          {filteredTopics.length} TOPICS AVAILABLE
        </span>
      </div>

      {visibleTopics.length > 0 ? (
        <div className="tag-grid-4" aria-live="polite">
          {visibleTopics.map((item, index) => (
            <article
              key={item.id || item.slug || index}
              className="tag-card-small"
              data-newsroom-reveal
              style={{ transitionDelay: `${100 + index * 50}ms` }}
            >
              <div className="tag-card-small-header">
                <div className="tag-card-icon-small" aria-hidden="true">
                  <BookOpen />
                </div>
                <span className="tag-badge-article">
                  {item.articleCount || 0} ARTICLES
                </span>
              </div>
              <h4>{item.name}</h4>
              <p>{item.webinarCount || 0} webinars</p>
              <a
                href={`/newsroom/berita?topic=${encodeURIComponent(item.name || "")}`}
                className="tag-explore-link"
              >
                Explore <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="newsroom-empty-state" role="status">
          Topik yang Anda cari belum tersedia.
        </div>
      )}

      {hasMore && (
        <div className="tag-load-more" data-newsroom-reveal>
          <button
            className="btn-pill-outline"
            type="button"
            onClick={onLoadMore}
          >
            Muat Topik Lainnya
          </button>
        </div>
      )}
    </section>
  );
};

export default KnowledgeExplorer;
