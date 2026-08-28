import { Award, BriefcaseBusiness, HandHeart, ShoppingBag } from "lucide-react";
import type { DashboardMetric, MetricIcon } from "../types";

type MetricCardsProps = {
  metrics: DashboardMetric[];
};


const getMetricIcon = (icon: MetricIcon) => {
  if (icon === "projects") return <BriefcaseBusiness aria-hidden="true" />;
  if (icon === "orders") return <ShoppingBag aria-hidden="true" />;
  if (icon === "donations") return <HandHeart aria-hidden="true" />;
  return <Award aria-hidden="true" />;
};

const MetricCards = ({ metrics }: MetricCardsProps) => (
  <>
<div className="client-dashboard__metric-grid">
      {metrics.map((metric) => (
        <a
          className={`dashboard-card client-dashboard__metric-card${metric.compact ? " client-dashboard__metric-card--compact" : ""}`}
          href={metric.href}
          key={metric.label}
          aria-label={`${metric.label}: ${metric.value.replace("\n", " ")}. ${metric.note.replace("\n", " ")}`}
        >
          {getMetricIcon(metric.icon)}
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.note}</small>
        </a>
      ))}
    </div>
  </>
);

export default MetricCards;
