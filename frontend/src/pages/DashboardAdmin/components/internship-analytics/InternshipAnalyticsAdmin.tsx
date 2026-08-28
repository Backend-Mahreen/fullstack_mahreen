import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Palette,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  adminEcosystemRepository,
  type InternshipAdminSnapshot,
} from "../../../../services/admin/adminEcosystemRepository";

type InternshipAnalyticsAdminProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const verticalIcons = [Palette, Code2, GraduationCap, BriefcaseBusiness];

const InternshipAnalyticsAdmin = ({ query, onLocalAction }: InternshipAnalyticsAdminProps) => {
  const [snapshot, setSnapshot] = useState<InternshipAdminSnapshot>(() =>
    adminEcosystemRepository.getInternshipSnapshot(),
  );
  const [period, setPeriod] = useState<"Yearly" | "Monthly">("Yearly");

  useEffect(() => adminEcosystemRepository.subscribe(() => {
    setSnapshot(adminEcosystemRepository.getInternshipSnapshot());
  }), []);

  const interns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return snapshot.acceptedInterns;
    return snapshot.acceptedInterns.filter((intern) => [intern.name, intern.university, intern.role]
      .some((value) => value.toLowerCase().includes(normalized)));
  }, [query, snapshot.acceptedInterns]);

  const trendPoints = snapshot.applicantTrend;
  const maxTrend = Math.max(1, ...trendPoints.map((item) => item.value));
  const chartCoordinates = trendPoints.map((item, index) => {
    const x = 24 + index * (592 / Math.max(1, trendPoints.length - 1));
    const y = 230 - (item.value / maxTrend) * 190;
    return `${x},${y}`;
  }).join(" ");
  const areaCoordinates = `24,230 ${chartCoordinates} 616,230`;
  const maxSelection = Math.max(1, ...snapshot.selection.map((item) => item.value));

  const metrics = [
    { label: "Total Applicants", value: snapshot.metrics.totalApplicants.toLocaleString("en-US"), note: "Local applications", Icon: UsersRound },
    { label: "Active Interns", value: snapshot.metrics.activeInterns.toString(), note: "From current status", Icon: BriefcaseBusiness },
    { label: "Completion Rate", value: `${snapshot.metrics.completionRate}%`, note: "Calculated locally", Icon: ShieldCheck },
    { label: "University Partners", value: snapshot.metrics.universityPartners.toString(), note: "Unique institutions", Icon: GraduationCap },
  ];

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="internship-analytics-title">
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">MAHREEN INTERNSHIP · TALENT INTELLIGENCE</span>
          <h1 id="internship-analytics-title">Internship Recap & Analytics</h1>
          <p>A performance overview generated from internship applications saved by users in this browser.</p>
        </div>
      </header>

      <div className="admin-feature-metrics admin-feature-metrics--internship">
        {metrics.map(({ label, value, note, Icon }, index) => (
          <article className="admin-feature-metric" key={label} style={{ "--feature-delay": `${index * 65}ms` } as React.CSSProperties}>
            <div className="admin-feature-metric__top"><Icon size={18} /><span>{note}</span></div>
            <strong>{value}</strong><span>{label}</span>
          </article>
        ))}
      </div>

      <div className="admin-feature-grid admin-feature-grid--internship-chart">
        <article className="admin-feature-panel admin-applicant-chart-panel">
          <header className="admin-feature-panel__heading"><h2>Applicant Trends</h2><div className="admin-feature-segment"><button type="button" className={period === "Yearly" ? "is-active" : ""} onClick={() => setPeriod("Yearly")}>Yearly</button><button type="button" className={period === "Monthly" ? "is-active" : ""} onClick={() => setPeriod("Monthly")}>Monthly</button></div></header>
          <div className="admin-line-chart">
            <svg viewBox="0 0 640 260" role="img" aria-label="Applicant trend line chart">
              <defs><linearGradient id="internship-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dfbd70" stopOpacity=".34" /><stop offset="100%" stopColor="#dfbd70" stopOpacity=".02" /></linearGradient></defs>
              {[40, 95, 150, 205].map((y) => <line key={y} x1="24" x2="616" y1={y} y2={y} className="admin-line-chart__grid" />)}
              <polygon points={areaCoordinates} fill="url(#internship-area)" className="admin-line-chart__area" />
              <polyline points={chartCoordinates} className="admin-line-chart__line" />
            </svg>
            <div className="admin-line-chart__labels">{trendPoints.map((item) => <span key={item.label}>{item.label}</span>)}</div>
          </div>
        </article>

        <article className="admin-feature-panel admin-selection-panel">
          <header className="admin-feature-panel__heading"><h2>Selection Status</h2></header>
          <div className="admin-selection-list">
            {snapshot.selection.map((item, index) => <div key={item.label}><span><strong>{item.label}</strong><em>{item.value.toLocaleString("en-US")}</em></span><i><b className={item.tone === "danger" ? "is-danger" : ""} style={{ "--bar-value": `${Math.max(7, item.value / maxSelection * 100)}%`, "--chart-delay": `${index * 100}ms` } as React.CSSProperties} /></i></div>)}
          </div>
          <p className="admin-selection-note"><TrendingUp size={16} /> Selection bars use the current local application status without seeded totals.</p>
        </article>
      </div>

      <div className="admin-feature-grid admin-feature-grid--internship-bottom">
        <article className="admin-feature-panel admin-verticals-panel">
          <header className="admin-feature-panel__heading"><h2>Top Verticals</h2></header>
          <div className="admin-vertical-list">
            {snapshot.verticals.map((vertical, index) => {
              const Icon = verticalIcons[index] ?? BriefcaseBusiness;
              return <button type="button" key={vertical.label} onClick={() => onLocalAction(`${vertical.label} dibuka dari data lokal.`)}><span><Icon size={17} /></span><div><strong>{vertical.label}</strong><small>{vertical.interns} Interns</small></div>{index < 2 ? <TrendingUp size={16} /> : <ArrowRight size={16} />}</button>;
            })}
          </div>
        </article>

        <article className="admin-feature-panel admin-accepted-panel">
          <header className="admin-feature-panel__heading"><h2>Latest Applications</h2><button type="button" onClick={() => onLocalAction("Seluruh aplikasi internship ditampilkan dari penyimpanan lokal.")}>View All</button></header>
          <div className="admin-feature-table-scroll">
            <table className="admin-feature-table">
              <thead><tr><th>Name</th><th>University</th><th>Program</th><th>Submitted</th></tr></thead>
              <tbody>{interns.map((intern) => <tr key={intern.id}><td><div className="admin-feature-person"><span>{intern.initials}</span><strong>{intern.name}</strong></div></td><td>{intern.university}</td><td><span className="admin-feature-pill admin-feature-pill--gold">{intern.role}</span></td><td>{intern.joinedAt}</td></tr>)}</tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default InternshipAnalyticsAdmin;
