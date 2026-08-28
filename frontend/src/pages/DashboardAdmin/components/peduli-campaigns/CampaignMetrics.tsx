import { Gauge, Goal, HandCoins, UsersRound } from "lucide-react";
import {
  formatCampaignCompactCurrency,
  type CampaignMetrics as CampaignMetricsData,
} from "../../../../services/campaign/campaignRepository";

type CampaignMetricsProps = {
  metrics: CampaignMetricsData;
};

const CampaignMetrics = ({ metrics }: CampaignMetricsProps) => {
  const items = [
    {
      label: "Total Collected",
      value: formatCampaignCompactCurrency(metrics.totalCollected),
      note: "Local donation ledger",
      icon: HandCoins,
    },
    {
      label: "Total Donors",
      value: metrics.totalDonors.toLocaleString("id-ID"),
      note: "Verified paid donations",
      icon: UsersRound,
    },
    {
      label: "Active Goals",
      value: String(metrics.activeGoals),
      note: "Published and in period",
      icon: Goal,
    },
    {
      label: "Avg Completion",
      value: `${metrics.averageCompletion}%`,
      note: "Across active campaigns",
      icon: Gauge,
    },
  ];

  return (
    <section className="pcm-metrics" aria-label="Ringkasan campaign">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <article
            className="pcm-metric pcm-reveal"
            key={item.label}
            style={{ "--pcm-delay": `${100 + index * 65}ms` } as React.CSSProperties}
          >
            <div>
              <Icon aria-hidden="true" />
              {index === 0 ? <span>Local Sync</span> : null}
            </div>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        );
      })}
    </section>
  );
};

export default CampaignMetrics;
