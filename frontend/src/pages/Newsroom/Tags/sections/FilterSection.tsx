export type TopicCategory = "ALL" | "TECH" | "BUSINESS" | "CREATIVE" | "CAREER";
export type TopicSort = "POPULAR" | "ALPHABETICAL";

type FilterSectionProps = {
  query: string;
  category: TopicCategory;
  sort: TopicSort;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: TopicCategory) => void;
  onSortChange: (value: TopicSort) => void;
};

const categoryOrder: readonly TopicCategory[] = ["ALL", "TECH", "BUSINESS", "CREATIVE", "CAREER"];
const categoryLabels: Record<TopicCategory, string> = {
  ALL: "Semua",
  TECH: "Teknologi",
  BUSINESS: "Bisnis",
  CREATIVE: "Kreatif",
  CAREER: "Karier",
};

const FilterSection = ({
  query,
  category,
  sort,
  onQueryChange,
  onCategoryChange,
  onSortChange,
}: FilterSectionProps) => {
  const cycleCategory = () => {
    const currentIndex = categoryOrder.indexOf(category);
    onCategoryChange(categoryOrder[(currentIndex + 1) % categoryOrder.length]);
  };

  return (
    <section className="tag-filter-section newsroom-content-section" aria-label="Filter topik">
      <div className="filter-bar-container">
        <label className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          <span className="visually-hidden">Cari topik</span>
          <input
            type="search"
            placeholder="Cari topik (UI/UX, AI, Marketing...)"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        <div className="filter-buttons">
          <button className="btn-filter" type="button" onClick={cycleCategory}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {categoryLabels[category]}
          </button>
          <button
            className="btn-filter"
            type="button"
            onClick={() => onSortChange(sort === "POPULAR" ? "ALPHABETICAL" : "POPULAR")}
          >
            {sort === "POPULAR" ? "Terpopuler" : "A-Z"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
