import {
  Banknote,
  Layers3,
  MessageSquareText,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  formatServiceCurrency,
  type ServiceManagementMetrics as Metrics,
} from "../../../../services/serviceManagement/serviceManagementRepository";

type ServiceManagementMetricsProps = {
  metrics: Metrics;
};

type MetricItem = {
  label: string;
  value: string;
  accent?: string;
  note: string;
  icon: LucideIcon;
};

const ServiceManagementMetrics = ({ metrics }: ServiceManagementMetricsProps) => {
  const items: MetricItem[] = [
    {
      label: "Active Services",
      value: String(metrics.activeServices),
      accent: "API Sync",
      note: "Portfolio layanan aktif",
      icon: Layers3,
    },
    {
      label: "Consultations",
      value: String(metrics.consultations),
      accent: metrics.highPriority ? `${metrics.highPriority} high priority` : "0 priority",
      note: "Permintaan konsultasi lokal",
      icon: MessageSquareText,
    },
    {
      label: "Active Projects",
      value: String(metrics.activeProjects),
      accent: "ongoing",
      note: "Lifecycle management aktif",
      icon: Workflow,
    },
    {
      label: "Revenue (MTD)",
      value: formatServiceCurrency(metrics.revenueMtd),
      note: "Pendapatan tercatat bulan ini",
      icon: Banknote,
    },
  ];

  return (
    <section className="sm-admin__metrics" aria-label="Service Management metrics">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <article
            className="sm-admin__metric sm-admin__reveal"
            style={{ "--sm-delay": `${100 + index * 55}ms` } as React.CSSProperties}
            key={item.label}
          >
            <div className="sm-admin__metric-topline">
              <span>{item.label}</span>
              <Icon aria-hidden="true" />
            </div>
            <div className="sm-admin__metric-value">
              <strong>{item.value}</strong>
              {item.accent ? <b>{item.accent}</b> : null}
            </div>
            <small>{item.note}</small>
          </article>
        );
      })}
    </section>
  );
};

export default ServiceManagementMetrics;
