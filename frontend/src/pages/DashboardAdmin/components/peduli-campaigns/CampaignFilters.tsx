import { Grid2X2, List } from "lucide-react";
import type { CampaignCategory } from "../../../../services/campaign/campaignRepository";

export type CampaignFilter = "All Campaigns" | CampaignCategory;
export type CampaignViewMode = "grid" | "list";

type CampaignFiltersProps = {
  active: CampaignFilter;
  mode: CampaignViewMode;
  onChange: (filter: CampaignFilter) => void;
  onModeChange: (mode: CampaignViewMode) => void;
};

const FILTERS: CampaignFilter[] = [
  "All Campaigns",
  "Emergency",
  "Education",
  "Sustainable Life",
];

const CampaignFilters = ({
  active,
  mode,
  onChange,
  onModeChange,
}: CampaignFiltersProps) => (
  <div className="pcm-toolbar pcm-reveal" style={{ "--pcm-delay": "330ms" } as React.CSSProperties}>
    <div className="pcm-tabs" role="tablist" aria-label="Filter kategori campaign">
      {FILTERS.map((filter) => (
        <button
          aria-selected={active === filter}
          className={active === filter ? "is-active" : ""}
          key={filter}
          onClick={() => onChange(filter)}
          role="tab"
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
    <div className="pcm-view-switch" aria-label="Mode tampilan">
      <button
        aria-label="Tampilan grid"
        className={mode === "grid" ? "is-active" : ""}
        onClick={() => onModeChange("grid")}
        type="button"
      >
        <Grid2X2 aria-hidden="true" />
      </button>
      <button
        aria-label="Tampilan list"
        className={mode === "list" ? "is-active" : ""}
        onClick={() => onModeChange("list")}
        type="button"
      >
        <List aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default CampaignFilters;
