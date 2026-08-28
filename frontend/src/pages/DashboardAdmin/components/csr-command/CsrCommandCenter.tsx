import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Handshake,
  Leaf,
  MoreHorizontal,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import {
  adminEcosystemRepository,
  type CsrAdminSnapshot,
} from "../../../../services/admin/adminEcosystemRepository";

type CsrCommandCenterProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("en-US").format(value);
};

const CsrCommandCenter = ({ query, onLocalAction }: CsrCommandCenterProps) => {
  const [snapshot, setSnapshot] = useState<CsrAdminSnapshot>(() =>
    adminEcosystemRepository.getCsrSnapshot(),
  );
  const [reviewOnly, setReviewOnly] = useState(false);

  useEffect(() => adminEcosystemRepository.subscribe(() => {
    setSnapshot(adminEcosystemRepository.getCsrSnapshot());
  }), []);

  const applications = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return snapshot.applications.filter((application) => {
      const matchesQuery = !normalized || [application.name, application.background, application.role, application.status]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesQuery && (!reviewOnly || application.status !== "Waitlisted");
    });
  }, [query, reviewOnly, snapshot.applications]);

  const metrics = [
    { label: "Total Volunteers", value: formatCompactNumber(snapshot.metrics.totalVolunteers), note: `${snapshot.applications.length} local records`, Icon: UsersRound },
    { label: "Active Partners", value: snapshot.metrics.activePartners.toString(), note: `${snapshot.partners.length} connected`, Icon: Handshake },
    { label: "Impact Reach", value: formatCompactNumber(snapshot.metrics.impactReach), note: "Local donation reach", Icon: Leaf },
    { label: "Sustainability Score", value: snapshot.metrics.sustainabilityScore, note: "Calculated locally", Icon: Sparkles },
  ];

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="csr-command-title">
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">MAHREEN CSR · GLOBAL IMPACT</span>
          <h1 id="csr-command-title">CSR Ecosystem Command<br />Center</h1>
          <p>Real-time oversight of global humanitarian and sustainability initiatives.</p>
        </div>
        <div className="admin-feature-heading__controls">
          <button type="button"><CalendarDays size={15} /> Local Activity · Updated now</button>
          <span className="admin-feature-live"><i /> Local sync active</span>
        </div>
      </header>

      <div className="admin-feature-metrics">
        {metrics.map(({ label, value, note, Icon }, index) => (
          <article className="admin-feature-metric" key={label} style={{ "--feature-delay": `${index * 65}ms` } as React.CSSProperties}>
            <div className="admin-feature-metric__top"><Icon size={18} /><span>{note}</span></div>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-feature-grid admin-feature-grid--csr">
        <article className="admin-feature-panel admin-feature-panel--distribution">
          <header className="admin-feature-panel__heading">
            <div><h2>Volunteer Distribution</h2><p>Resource allocation across key impact sectors.</p></div>
            <div className="admin-feature-segment"><span className="is-active">Sector</span><span>Region</span></div>
          </header>
          <div className="admin-distribution-chart" aria-label="Volunteer distribution chart">
            {snapshot.distribution.map((item, index) => (
              <div className="admin-distribution-chart__item" key={item.label}>
                <div>
                  <span style={{ "--chart-value": `${item.value}%`, "--chart-delay": `${index * 90}ms` } as React.CSSProperties} />
                  <strong>{item.value}%</strong>
                </div>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-feature-panel admin-partner-panel">
          <header className="admin-feature-panel__heading"><div><h2>Partner<br />Contributions</h2></div></header>
          <div className="admin-partner-list">
            {snapshot.partners.map((partner) => (
              <div key={partner.id}>
                <span>{partner.id}</span>
                <div><strong>{partner.name}</strong><small>{partner.tier}</small></div>
                <div><strong>{partner.contribution}</strong><small>Contribution</small></div>
              </div>
            ))}
          </div>
          <button className="admin-feature-outline-button" type="button" onClick={() => onLocalAction("Leaderboard mitra dibuka dari data lokal.")}>View Full Leaderboard</button>
        </article>
      </div>

      <article className="admin-feature-panel admin-feature-table-panel">
        <header className="admin-feature-panel__heading">
          <div><h2>Recent Volunteer Applications</h2><p>Pending review from global regions.</p></div>
          <button className={`admin-feature-gold-button admin-filter-list-button${reviewOnly ? " is-active" : ""}`} type="button" onClick={() => setReviewOnly((current) => !current)}><SlidersHorizontal size={15} /> {reviewOnly ? "Show All" : "Filter List"}</button>
        </header>
        <div className="admin-feature-table-scroll">
          <table className="admin-feature-table">
            <thead><tr><th>Applicant Name</th><th>Background</th><th>Requested Role</th><th>Application Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td><div className="admin-feature-person"><span>{application.initials}</span><strong>{application.name}</strong></div></td>
                  <td>{application.background}</td>
                  <td><span className="admin-feature-pill">{application.role}</span></td>
                  <td>{application.date}</td>
                  <td><span className={`admin-feature-status admin-feature-status--${application.status.toLowerCase().replaceAll(" ", "-")}`}>{application.status}</span></td>
                  <td><button className="admin-feature-icon-button" type="button" aria-label={`Tindakan ${application.name}`} onClick={() => onLocalAction(`Detail ${application.name} dibuka dari data lokal.`)}><MoreHorizontal size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default CsrCommandCenter;
