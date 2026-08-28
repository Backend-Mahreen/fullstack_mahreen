import { usePublishedNewsroomDatabase } from "../../../hooks/useNewsroomDatabase";
import type { NewsItem } from "../types";
import NewsCard, { NewsCardStyles } from "./NewsCard";
import SectionHeader from "./SectionHeader";

const newsroomSectionStyles = `
  .client-dashboard__news-block .client-dashboard__news-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
    gap: 16px;
  }
  .client-dashboard__news-heading > a {
    display: inline-flex;
    min-height: 34px;
    padding: 8px 13px;
    align-items: center;
    justify-content: center;
    border: 1px solid #e7c56d;
    border-radius: 999px;
    color: #161109;
    background: linear-gradient(135deg, #f2d784, #dcb657);
    box-shadow: 0 8px 22px rgba(216, 180, 91, 0.16);
    font-size: 14px;
    font-weight: 850;
    letter-spacing: 0.035em;
    text-decoration: none;
    transition: filter 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }
  .client-dashboard__news-heading > a:hover,
  .client-dashboard__news-heading > a:focus-visible {
    color: #0d0a05;
    filter: brightness(1.08);
    box-shadow: 0 11px 28px rgba(216, 180, 91, 0.24);
    transform: translateY(-2px);
  }
  .client-dashboard__news-grid .client-dashboard__news-empty {
    grid-column: 1 / -1;
  }
  @media (max-width: 820px) {
    .client-dashboard__news-block .client-dashboard__news-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 580px) {
    .client-dashboard__news-block .client-dashboard__news-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const NewsroomSection = () => {
  const database = usePublishedNewsroomDatabase();
  const newsItems: readonly NewsItem[] = [...database.articles]
    .sort((first, second) => Number(second.id) - Number(first.id))
    .slice(0, 3)
    .map((article) => ({
        category: article.category,
        title: article.title,
        excerpt: article.excerpt,
        image: article.thumbnail || article.image,
        imageAlt: `Visual berita ${article.title}`,
        href: `/newsroom/berita/${encodeURIComponent(article.slug)}`,
        isNew: article.source === "admin",
      }));

  return (
    <>
      <style data-component="client-newsroom-section">{newsroomSectionStyles}</style>
      <NewsCardStyles />
      <div className="client-dashboard__news-block">
        <SectionHeader
          className="client-dashboard__news-heading"
          title="Newsroom"
          actionLabel="Lihat semua"
          actionHref="/newsroom/berita?view=all"
        />
        <div className="client-dashboard__news-grid">
          {newsItems.length > 0 ? (
            newsItems.map((item) => <NewsCard item={item} key={item.href} />)
          ) : (
            <div className="dashboard-card client-dashboard__news-empty">
              Berita belum tersedia.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsroomSection;
