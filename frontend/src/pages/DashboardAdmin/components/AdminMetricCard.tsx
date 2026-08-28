import type { CSSProperties } from "react";
import { BriefcaseBusiness, CircleDollarSign, ShoppingBag, UsersRound, type LucideIcon } from "lucide-react";
import type { AdminMetric, AdminMetricIcon } from "../types";

const metricIcons: Readonly<Record<AdminMetricIcon, LucideIcon>> = {
  revenue: CircleDollarSign,
  users: UsersRound,
  projects: BriefcaseBusiness,
  orders: ShoppingBag,
};

type AdminMetricCardProps = Readonly<{
  index: number;
  metric: AdminMetric;
}>;

const AdminMetricCard = ({ index, metric }: AdminMetricCardProps) => {
  const Icon = metricIcons[metric.icon];
  const animationStyle = { "--admin-delay": `${90 + index * 55}ms` } as CSSProperties;

  return (
    <article className="admin-metric-card admin-animate" style={animationStyle}>
      <div className="admin-metric-card__topline">
        <span className="admin-metric-card__icon"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>
        <span className="admin-chip">{metric.trend}</span>
      </div>
      <span className="admin-metric-card__label">{metric.label}</span>
      <strong>{metric.value}</strong>
      <small>{metric.note}</small>
      {typeof metric.progress === "number" ? (
        <span className="admin-progress" aria-label={`${metric.progress}% dari target`}>
          <span style={{ "--admin-progress": `${metric.progress}%` } as CSSProperties} />
        </span>
      ) : null}
    </article>
  );
};

export default AdminMetricCard;
