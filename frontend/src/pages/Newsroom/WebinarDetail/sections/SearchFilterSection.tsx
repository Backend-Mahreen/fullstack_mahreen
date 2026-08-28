import { useState, type FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { navigateToHashRoute } from "../../../../utils/hashNavigation";
import type { EventAccessFilter, EventSort } from "../../Events/sections/FilterSection";

const styles = `
  .webinar-search-section {
    width: min(100% - 40px, 1460px);
    margin: clamp(54px, 6vw, 84px) auto 0;
  }

  .webinar-search-panel {
    display: grid;
    padding: 14px;
    grid-template-columns: minmax(0, 1fr) auto 150px;
    gap: 12px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 18px;
    background: linear-gradient(145deg, #121212, #0a0a0a);
  }

  .webinar-search-field {
    display: flex;
    min-width: 0;
    min-height: 54px;
    padding: 0 18px;
    gap: 12px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 11px;
    background: #0d0d0d;
  }

  .webinar-search-field svg { color: #d8d2c8; }
  .webinar-search-field input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: #f2ede5;
    background: transparent;
    font-size: 13px;
  }
  .webinar-search-field input::placeholder { color: rgba(255, 255, 255, 0.38); }

  .webinar-search-filter,
  .webinar-search-sort {
    min-height: 54px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 11px;
    color: rgba(255, 255, 255, 0.8);
    background: #0d0d0d;
    font-size: 12px;
  }

  .webinar-search-filter {
    display: inline-flex;
    padding: 0 20px;
    gap: 9px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .webinar-search-filter:hover { border-color: rgba(229, 196, 119, 0.55); }
  .webinar-search-sort { padding: 0 14px; outline: none; }

  @media (max-width: 760px) {
    .webinar-search-panel { grid-template-columns: 1fr; }
  }
`;

const accessOrder: readonly EventAccessFilter[] = ["ALL", "FREE", "PAID"];

const SearchFilterSection = () => {
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<EventAccessFilter>("ALL");
  const [sort, setSort] = useState<EventSort>("NEWEST");

  const cycleAccess = () => {
    const currentIndex = accessOrder.indexOf(access);
    setAccess(accessOrder[(currentIndex + 1) % accessOrder.length]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams({ section: "event-list", access, sort });
    if (query.trim()) params.set("query", query.trim());
    navigateToHashRoute(`/newsroom/events?${params.toString()}`);
  };

  return (
    <>
      <style>{styles}</style>
      <section className="webinar-search-section" data-webinar-reveal aria-label="Cari event lain">
        <form className="webinar-search-panel" onSubmit={handleSubmit}>
          <label className="webinar-search-field">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari topik webinar (UI/UX, AI, Marketing...)"
              aria-label="Cari topik webinar"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <button className="webinar-search-filter" type="button" onClick={cycleAccess}>
            <SlidersHorizontal size={17} aria-hidden="true" />
            {access === "ALL" ? "Semua Akses" : access}
          </button>

          <select
            className="webinar-search-sort"
            aria-label="Urutkan webinar"
            value={sort}
            onChange={(event) => setSort(event.target.value as EventSort)}
          >
            <option value="NEWEST">Terbaru</option>
            <option value="OLDEST">Terlama</option>
          </select>
          <button type="submit" className="webinar-search-filter" style={{ gridColumn: "1 / -1" }}>
            <Search size={16} aria-hidden="true" /> Cari Event
          </button>
        </form>
      </section>
    </>
  );
};

export default SearchFilterSection;
