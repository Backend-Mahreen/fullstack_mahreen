import { Search, SlidersHorizontal } from "lucide-react";
import type { ChangeEvent } from "react";

const styles = `
  .newsroom-list-filter {
    position: relative;
    z-index: 2;
    width: min(100%, 1640px);
    margin-inline: auto;
    padding: 68px clamp(26px, 4.5vw, 78px) 32px;
  }

  .newsroom-list-filter__bar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(150px, 180px);
    gap: 18px;
    align-items: center;
  }

  .newsroom-list-filter__search {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 62px;
    align-items: center;
    color: #88827b;
    background: #11110f;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }

  .newsroom-list-filter__search:focus-within {
    border-color: rgba(229, 196, 119, 0.65);
    box-shadow: 0 0 0 3px rgba(229, 196, 119, 0.08);
  }

  .newsroom-list-filter__search svg {
    margin-left: 20px;
    flex: 0 0 auto;
  }

  .newsroom-list-filter__search input {
    width: 100%;
    min-width: 0;
    height: 60px;
    padding: 0 20px 0 14px;
    border: 0;
    outline: 0;
    color: #eee8df;
    background: transparent;
    font-size: 15px;
  }

  .newsroom-list-filter__search input::placeholder {
    color: #716c66;
  }

  .newsroom-list-filter__button,
  .newsroom-list-filter__sort {
    display: inline-flex;
    min-height: 62px;
    padding: 0 22px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    color: #ded7ce;
    background: #11110f;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-size: 14px;
    transition:
      color 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .newsroom-list-filter__button:hover,
  .newsroom-list-filter__button:focus-visible,
  .newsroom-list-filter__button.is-active {
    color: #e5c477;
    border-color: rgba(229, 196, 119, 0.58);
    background: rgba(229, 196, 119, 0.06);
  }

  .newsroom-list-filter__sort {
    width: 100%;
    outline: 0;
    appearance: auto;
  }

  .newsroom-list-filter__categories {
    display: flex;
    max-height: 0;
    margin-top: 0;
    gap: 12px;
    flex-wrap: wrap;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 300ms cubic-bezier(0.22, 1, 0.36, 1),
      margin-top 300ms ease,
      opacity 220ms ease;
  }

  .newsroom-list-filter__categories.is-open {
    max-height: 180px;
    margin-top: 20px;
    opacity: 1;
  }

  .newsroom-list-filter__category {
    min-height: 42px;
    padding: 0 18px;
    color: #aaa39a;
    background: #0e0d0c;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 999px;
    font-size: 12px;
    transition: color 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .newsroom-list-filter__category:hover,
  .newsroom-list-filter__category:focus-visible,
  .newsroom-list-filter__category.is-active {
    color: #1a140c;
    background: #e5c477;
    border-color: #e5c477;
  }

  @media (max-width: 820px) {
    .newsroom-list-filter__bar {
      grid-template-columns: 1fr auto;
    }

    .newsroom-list-filter__sort {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 560px) {
    .newsroom-list-filter {
      padding: 46px 20px 24px;
    }

    .newsroom-list-filter__bar {
      grid-template-columns: 1fr;
    }

    .newsroom-list-filter__button,
    .newsroom-list-filter__sort {
      width: 100%;
    }
  }
`;

export type NewsroomSort = "newest" | "oldest" | "title";

export type FilterSectionProps = {
  searchQuery: string;
  categories: readonly string[];
  activeCategory: string;
  sortBy: NewsroomSort;
  isFilterOpen: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: NewsroomSort) => void;
  onToggleFilter: () => void;
};

const FilterSection = ({
  searchQuery,
  categories,
  activeCategory,
  sortBy,
  isFilterOpen,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onToggleFilter,
}: FilterSectionProps) => {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as NewsroomSort);
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className="newsroom-list-filter"
        aria-label="Pencarian dan penyaringan artikel"
        data-newsroom-list-reveal
      >
        <div className="newsroom-list-filter__bar">
          <label className="newsroom-list-filter__search">
            <Search size={21} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari topik berita (AI, Marketing, Mahreen...)"
              aria-label="Cari artikel Newsroom"
            />
          </label>

          <button
            className={`newsroom-list-filter__button${isFilterOpen ? " is-active" : ""}`}
            type="button"
            onClick={onToggleFilter}
            aria-expanded={isFilterOpen}
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            Filter
          </button>

          <select
            className="newsroom-list-filter__sort"
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Urutkan artikel"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title">Judul A–Z</option>
          </select>
        </div>

        <div
          className={`newsroom-list-filter__categories${isFilterOpen ? " is-open" : ""}`}
        >
          {categories.map((category) => (
            <button
              className={`newsroom-list-filter__category${activeCategory === category ? " is-active" : ""}`}
              type="button"
              onClick={() => onCategoryChange(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export default FilterSection;
