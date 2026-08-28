import NewsCard from "../components/NewsCard";
import { usePublishedNewsroomDatabase } from "../../../../hooks/useNewsroomDatabase";

const styles = `
  .newsroom-featured {
    padding-top: clamp(50px, 7vw, 88px);
    scroll-margin-top: 86px;
  }

  .newsroom-search-row {
    display: grid;
    grid-template-columns: minmax(320px, 1.1fr) minmax(420px, 1fr);
    gap: clamp(26px, 5vw, 68px);
    align-items: end;
  }

  .newsroom-search {
    display: grid;
    gap: 10px;
  }

  .newsroom-search > span {
    color: var(--newsroom-gold);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .newsroom-search__field {
    position: relative;
    display: flex;
    min-height: 44px;
    align-items: center;
    background: var(--newsroom-brown-soft);
  }

  .newsroom-search__field input {
    width: 100%;
    height: 44px;
    padding: 0 48px 0 15px;
    border: 1px solid transparent;
    outline: 0;
    color: #eee8df;
    background: transparent;
    font-size: 12px;
    transition: border-color 180ms ease;
  }

  .newsroom-search__field input:focus {
    border-color: var(--newsroom-gold);
  }

  .newsroom-search__field input::placeholder {
    color: #716c66;
  }

  .newsroom-search__field > span {
    position: absolute;
    right: 12px;
    color: var(--newsroom-gold);
    font-size: 19px;
  }

  .newsroom-category-tabs {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 13px 26px;
    align-items: center;
  }

  .newsroom-category-tabs button {
    position: relative;
    padding: 0 0 12px;
    border: 0;
    color: #b9b1a8;
    background: transparent;
    font-size: 12px;
    letter-spacing: 0.3px;
    white-space: nowrap;
    cursor: pointer;
    transition: color 180ms ease;
  }

  .newsroom-category-tabs button::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    background: var(--newsroom-gold);
    transform: scaleX(0);
    transition: transform 180ms ease;
  }

  .newsroom-category-tabs button:hover,
  .newsroom-category-tabs button:focus-visible,
  .newsroom-category-tabs button.is-active {
    color: var(--newsroom-gold);
  }

  .newsroom-category-tabs button.is-active::after {
    transform: scaleX(1);
  }

  @media (max-width: 980px) {
    .newsroom-search-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .newsroom-category-tabs {
      display: flex;
      padding-bottom: 8px;
      gap: 18px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .newsroom-category-tabs::-webkit-scrollbar {
      display: none;
    }
  }
`;

export type NewsroomCategory =
  | "Semua"
  | "Berita Mahreen"
  | "Artikel & Insight"
  | "Event & Webinar"
  | "Internship Update";

type FeaturedSectionProps = {
  activeCategory: NewsroomCategory;
  searchQuery: string;
  onCategoryChange: (category: NewsroomCategory) => void;
  onSearchChange: (query: string) => void;
};

const newsroomCategories: readonly NewsroomCategory[] = [
  "Semua",
  "Berita Mahreen",
  "Artikel & Insight",
  "Event & Webinar",
  "Internship Update",
];

const FeaturedSection = ({
  activeCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: FeaturedSectionProps) => {
  const database = usePublishedNewsroomDatabase();
  const featuredArticle =
    database.articles.find(
      (article) => article.slug === database.featuredArticleSlug,
    ) ?? database.articles[0];

  return (
    <>
      <style>{styles}</style>

      <section
        className="newsroom-featured newsroom-content-section"
        id="newsroom-trending"
        aria-label="Artikel unggulan Newsroom"
      >
        <div
          className="newsroom-search-row"
          id="newsroom-tags"
          data-newsroom-reveal
        >
          <label className="newsroom-search">
            <span>Cari Informasi</span>
            <div className="newsroom-search__field">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Ketik kata kunci..."
                aria-label="Cari informasi Newsroom"
              />
              <span aria-hidden="true">⌕</span>
            </div>
          </label>

          <div
            className="newsroom-category-tabs"
            role="tablist"
            aria-label="Kategori berita"
          >
            {newsroomCategories.map((category) => (
              <button
                className={activeCategory === category ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => onCategoryChange(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {featuredArticle && (
          <NewsCard
            eyebrow={featuredArticle.category}
            title={featuredArticle.title}
            description={featuredArticle.excerpt}
            author={featuredArticle.author}
            readTime={featuredArticle.readTime}
            image={featuredArticle.image}
            imageSrcSet={featuredArticle.imageSrcSet}
            imageSizes={featuredArticle.imageSizes}
            imageWidth={featuredArticle.imageWidth}
            imageHeight={featuredArticle.imageHeight}
            href={`/newsroom/berita/${featuredArticle.slug}`}
          />
        )}
      </section>
    </>
  );
};

export default FeaturedSection;
