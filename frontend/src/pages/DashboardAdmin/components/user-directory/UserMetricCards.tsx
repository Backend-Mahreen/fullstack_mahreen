import { Shield, UserPlus, UsersRound } from "lucide-react";

type UserMetricCardsProps = Readonly<{
  metrics: {
    totalUsers: number;
    activeNow: number;
    registrations: number;
    security: number;
  };
}>;

const compactNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const UserMetricCards = ({ metrics }: UserMetricCardsProps) => (
  <section className="user-directory-metrics" aria-label="User directory metrics">
    <article className="user-metric-card user-directory-enter" style={{ "--user-delay": "70ms" } as React.CSSProperties}>
      <div className="user-metric-card__top"><span>Total users</span><span className="user-metric-card__icon is-gold"><UsersRound size={19} /></span></div>
      <div className="user-metric-card__value"><strong>{compactNumber(metrics.totalUsers)}</strong><small>+12%</small></div>
      <div className="user-metric-card__progress"><i style={{ "--metric-width": "72%" } as React.CSSProperties} /></div>
    </article>

    <article className="user-metric-card user-directory-enter" style={{ "--user-delay": "120ms" } as React.CSSProperties}>
      <div className="user-metric-card__top"><span>Active now</span><b className="user-live-pill"><i /> Live</b></div>
      <div className="user-metric-card__value"><strong>{compactNumber(metrics.activeNow)}</strong><em>Real-time users</em></div>
      <div className="user-metric-mini-chart" aria-hidden="true">
        {[30, 58, 88, 67].map((height, index) => <i key={height} style={{ height: `${height}%`, animationDelay: `${180 + index * 65}ms` }} />)}
      </div>
    </article>

    <article className="user-metric-card user-directory-enter" style={{ "--user-delay": "170ms" } as React.CSSProperties}>
      <div className="user-metric-card__top"><span>New registrations</span><span className="user-metric-card__icon"><UserPlus size={19} /></span></div>
      <div className="user-metric-card__value"><strong>{compactNumber(metrics.registrations)}</strong><em>Today</em></div>
      <p>4.2% increase from yesterday</p>
    </article>

    <article className="user-metric-card user-directory-enter" style={{ "--user-delay": "220ms" } as React.CSSProperties}>
      <div className="user-metric-card__top"><span>Account security</span><span className="user-metric-card__icon is-green"><Shield size={19} /></span></div>
      <div className="user-metric-card__value"><strong>{metrics.security}%</strong><em>2FA Enabled</em></div>
      <div className="user-metric-card__progress is-green"><i style={{ "--metric-width": `${metrics.security}%` } as React.CSSProperties} /></div>
    </article>
  </section>
);

export default UserMetricCards;
