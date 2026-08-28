import { useEffect, useMemo, useState } from "react";
import NewsroomLayout from "../layout/NewsroomLayout";
import NewsroomCardStyles from "../components/NewsroomCardStyles";
import { usePublishedNewsroomDatabase } from "../../../hooks/useNewsroomDatabase";
import ArticleGridSection from "./sections/ArticleGridSection";
import FilterSection, {
  type NewsroomSort,
} from "./sections/FilterSection";
import HeroSection from "./sections/HeroSection";

const styles = `
  .newsroom-list-page {
    --newsroom-gold: #e5c477;
    --newsroom-gold-light: #f0d58f;
    --newsroom-border: rgba(229, 196, 119, 0.24);

    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100dvh;
    padding-top: var(--navbar-height, 74px);
    overflow-x: clip;
    color: #f4efe8;
    background: #000;
    font-family: Arial, Helvetica, sans-serif;
  }

  .newsroom-list-page,
  .newsroom-list-page *,
  .newsroom-list-page *::before,
  .newsroom-list-page *::after {
    box-sizing: border-box;
  }

  .newsroom-list-page a {
    color: inherit;
    text-decoration: none;
  }

  .newsroom-list-page button,
  .newsroom-list-page input,
  .newsroom-list-page select {
    font: inherit;
  }

  .newsroom-list-page__main {
    width: 100%;
    min-width: 0;
    overflow-x: clip;
    background: #000;
  }

  .newsroom-list-page [data-newsroom-list-reveal] {
    opacity: 1;
    transform: none;
    animation: newsroom-list-reveal-in 220ms ease-out both;
  }

  @keyframes newsroom-list-reveal-in {
    from {
      opacity: 0.75;
      transform: translate3d(0, 8px, 0);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-list-page *,
    .newsroom-list-page *::before,
    .newsroom-list-page *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .newsroom-list-page [data-newsroom-list-reveal] {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;

const INDONESIAN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// publishedAt bisa berupa ISO ("2025-07-15T04:22:11.000Z") maupun format
// tampilan id-ID ("15 Agu 2026") yang tidak diparse engine. Normalisasi
// agar sorting newest/oldest tetap akurat.
const parseArticleDate = (value: string | undefined): number => {
  if (!value) return 0;
  const isoParsed = new Date(value);
  if (!Number.isNaN(isoParsed.getTime())) return isoParsed.getTime();
  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(value.trim());
  if (!match) return 0;
  const monthIndex = INDONESIAN_MONTHS.indexOf(match[2]);
  if (monthIndex < 0) return 0;
  return new Date(Number(match[3]), monthIndex, Number(match[1])).getTime();
};

const topicSearchAliases: Record<string, string> = {
  "artificial intelligence": "AI",
  "digital marketing": "Marketing",
  "ui/ux design": "UI/UX",
  "website development": "Website",
  branding: "Brand",
  technology: "Technology",
  "content marketing": "Konten",
  "social media": "Marketing",
  seo: "Marketing",
  "google ads": "Marketing",
};

const readArticleQuery = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const rawQuery = searchParams.get("query") ?? searchParams.get("topic") ?? "";
  return topicSearchAliases[rawQuery.trim().toLowerCase()] ?? rawQuery;
};

const readInitialVisibleCount = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("view") === "all" ? Number.MAX_SAFE_INTEGER : 8;
};

const NewsroomBerita = () => {
  const { articles: newsroomArticles } = usePublishedNewsroomDatabase();
  const [searchQuery, setSearchQuery] = useState(readArticleQuery);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<NewsroomSort>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(readInitialVisibleCount);

  const categories = useMemo(
    () => [
      "Semua",
      ...Array.from(new Set(newsroomArticles.map((article) => article.category))),
    ],
    [newsroomArticles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = newsroomArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "Semua" || article.category === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "title") {
        return first.title.localeCompare(second.title, "id");
      }

      const firstTime = parseArticleDate(first.publishedAt) || parseArticleDate(first.createdAt);
      const secondTime = parseArticleDate(second.publishedAt) || parseArticleDate(second.createdAt);
      return sortBy === "oldest" ? firstTime - secondTime : secondTime - firstTime;
    });
  }, [activeCategory, newsroomArticles, searchQuery, sortBy]);

  useEffect(() => {
    const syncQueryFromHash = () => {
      setSearchQuery(readArticleQuery());
      setVisibleCount(readInitialVisibleCount());
    };
    window.addEventListener("hashchange", syncQueryFromHash);
    return () => window.removeEventListener("hashchange", syncQueryFromHash);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(6);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    setVisibleCount(6);
  };

  const handleSortChange = (value: NewsroomSort) => {
    setSortBy(value);
    setVisibleCount(6);
  };

  return (
    <>
      <style>{styles}</style>
      <NewsroomCardStyles />

      <NewsroomLayout>
        <div className="newsroom-list-page">
          <main className="newsroom-list-page__main">
            <HeroSection />
            <FilterSection
              searchQuery={searchQuery}
              categories={categories}
              activeCategory={activeCategory}
              sortBy={sortBy}
              isFilterOpen={isFilterOpen}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onToggleFilter={() => setIsFilterOpen((current) => !current)}
            />
            <ArticleGridSection
              articles={filteredArticles}
              visibleCount={visibleCount}
              onLoadMore={() => setVisibleCount((current) => current + 3)}
            />
          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default NewsroomBerita;
