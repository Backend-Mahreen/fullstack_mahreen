import type { ReactNode } from "react";

type NewsroomMetricCardProps = Readonly<{
  context: string;
  icon: ReactNode;
  label: string;
  value: string;
}>;

const newsroomMetricCardStyles = `
  .admin-newsroom-metric__context {
    display: inline-flex;
    max-width: 180px;
    justify-content: flex-end;
    color: #b7a45f;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-align: right;
    text-transform: uppercase;
  }
`;

const NewsroomMetricCard = ({ context, icon, label, value }: NewsroomMetricCardProps) => (
  <article className="admin-newsroom-metric admin-animate">
    <style data-component="admin-newsroom-metric-context">{newsroomMetricCardStyles}</style>
    <div className="admin-newsroom-metric__topline">
      <span className="admin-newsroom-metric__icon">{icon}</span>
      <span className="admin-newsroom-metric__context">{context}</span>
    </div>
    <span className="admin-newsroom-metric__label">{label}</span>
    <strong>{value}</strong>
  </article>
);

export default NewsroomMetricCard;
