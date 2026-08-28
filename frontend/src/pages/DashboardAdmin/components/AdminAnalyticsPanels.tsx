import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { AdminEcosystemDistribution } from "../../../services/admin/adminWorkspaceRepository";
import type { AdminModuleKey } from "../types";

const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;

type AdminAnalyticsPanelsProps = Readonly<{
  distribution: readonly AdminEcosystemDistribution[];
  onSelect: (module: AdminModuleKey) => void;
  revenueChart: readonly number[];
}>;

const AdminAnalyticsPanels = ({ distribution, onSelect, revenueChart }: AdminAnalyticsPanelsProps) => (
  <section className="admin-analytics-grid" aria-label="Analitik ekosistem">
    <article className="admin-panel admin-chart-panel admin-animate" style={{ "--admin-delay": "475ms" } as CSSProperties}>
      <div className="admin-panel__heading">
        <div><h2>Visual Intelligence</h2><p>Monthly Revenue Projection (M)</p></div>
        <div className="admin-chart-panel__legend"><span className="is-active">2026</span><span>2025</span><span>YoY</span></div>
      </div>
      <div className="admin-bar-chart" aria-label="Grafik proyeksi pendapatan bulanan">
        {revenueChart.map((value, index) => (
          <div className="admin-bar-chart__column" key={monthLabels[index]}>
            <span
              className="admin-bar-chart__bar"
              style={{
                "--admin-bar-height": `${value}%`,
                "--admin-bar-delay": `${500 + index * 35}ms`,
              } as CSSProperties}
              title={`${monthLabels[index]}: ${value}%`}
            />
            <small>{monthLabels[index]}</small>
          </div>
        ))}
      </div>
    </article>

    <article className="admin-panel admin-distribution-panel admin-animate" style={{ "--admin-delay": "530ms" } as CSSProperties}>
      <div className="admin-panel__heading">
        <div><h2>Ecosystem Distribution</h2><p>Revenue contribution by operational vertical</p></div>
        <button className="admin-link-button" type="button" onClick={() => onSelect("analytics")}>
          Detail <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </div>
      <div className="admin-distribution-list">
        {distribution.map((item) => (
          <div className="admin-distribution-list__item" key={item.label}>
            <div><span>{item.label}</span><strong>{item.value}</strong></div>
            <span className="admin-progress"><span style={{ "--admin-progress": `${item.progress}%` } as CSSProperties} /></span>
          </div>
        ))}
      </div>
    </article>
  </section>
);

export default AdminAnalyticsPanels;
