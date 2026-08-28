export type EventAccessFilter = "ALL" | "FREE" | "PAID";
export type EventSort = "NEWEST" | "OLDEST";

type FilterSectionProps = {
  query: string;
  access: EventAccessFilter;
  sort: EventSort;
  onQueryChange: (value: string) => void;
  onAccessChange: (value: EventAccessFilter) => void;
  onSortChange: (value: EventSort) => void;
};

const accessOrder: readonly EventAccessFilter[] = ["ALL", "FREE", "PAID"];

const FilterSection = ({
  query,
  access,
  sort,
  onQueryChange,
  onAccessChange,
  onSortChange,
}: FilterSectionProps) => {
  const cycleAccess = () => {
    const currentIndex = accessOrder.indexOf(access);
    onAccessChange(accessOrder[(currentIndex + 1) % accessOrder.length]);
  };

  return (
    <section className="event-filter-section newsroom-content-section" aria-label="Filter event">
      <div className="filter-bar-container">
        <label className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Cari event</span>
          <input
            type="search"
            placeholder="Cari topik event (UI/UX, AI, Marketing...)"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        <div className="filter-buttons">
          <button className="btn-filter" type="button" onClick={cycleAccess} aria-label={`Filter akses: ${access}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {access === "ALL" ? "Semua" : access}
          </button>
          <button
            className="btn-filter"
            type="button"
            onClick={() => onSortChange(sort === "NEWEST" ? "OLDEST" : "NEWEST")}
            aria-label={`Urutan: ${sort === "NEWEST" ? "terbaru" : "terlama"}`}
          >
            {sort === "NEWEST" ? "Terbaru" : "Terlama"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
