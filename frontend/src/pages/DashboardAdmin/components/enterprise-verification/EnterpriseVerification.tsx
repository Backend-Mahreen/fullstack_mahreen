import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  FileCheck2,
  KeyRound,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import {
  adminOperationsRepository,
  type VerificationSnapshot,
} from "../../../../services/admin/adminOperationsRepository";

type EnterpriseVerificationProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const logIcons = [ShieldCheck, AlertTriangle, FileCheck2, KeyRound];

const EnterpriseVerification = ({ query, onLocalAction }: EnterpriseVerificationProps) => {
  const [snapshot, setSnapshot] = useState<VerificationSnapshot>(() =>
    adminOperationsRepository.getVerificationSnapshot(),
  );

  useEffect(() => adminOperationsRepository.subscribe(() => {
    setSnapshot(adminOperationsRepository.getVerificationSnapshot());
  }), []);

  const requests = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return snapshot.requests;
    return snapshot.requests.filter((request) => [request.name, request.type, request.priority, request.status]
      .some((value) => value.toLowerCase().includes(normalized)));
  }, [query, snapshot.requests]);

  const metrics = [
    { label: "Total Verifications", value: snapshot.metrics.totalVerifications.toLocaleString("en-US"), note: `${snapshot.requests.length} local requests`, detail: "", Icon: BadgeCheck },
    { label: "Document Audit Queue", value: snapshot.metrics.auditQueue.toString(), note: "Needs review", detail: "Derived from user submissions", Icon: FileCheck2 },
    { label: "Identity Match Rate", value: `${snapshot.metrics.identityMatchRate}%`, note: "Calculated", detail: "", Icon: Smartphone },
    { label: "System Security Status", value: snapshot.metrics.securityStatus, note: "Local", detail: "Browser storage scan active", Icon: ShieldCheck },
  ];

  const updateStatus = (id: string, status: "Pending" | "Under Review" | "Verified") => {
    const nextStatus = status === "Pending" ? "Under Review" : status === "Under Review" ? "Verified" : "Pending";
    setSnapshot(adminOperationsRepository.updateVerificationStatus(id, nextStatus));
    onLocalAction(`Status verifikasi diperbarui menjadi ${nextStatus} dan langsung tersambung ke dashboard pengguna.`);
  };

  return (
    <section className="admin-feature-page admin-feature-enter admin-verification-page" aria-labelledby="enterprise-verification-title">
      <header className="admin-feature-heading"><div><span className="admin-feature-eyebrow">SYSTEMS ONLINE</span><h1 id="enterprise-verification-title">Enterprise <em>Verification</em></h1><p>Centralized telemetry for Mahreen Indonesia’s digital identity and document validation ecosystem.</p></div></header>

      <div className="admin-feature-metrics admin-verification-metrics">
        {metrics.map(({ label, value, note, detail, Icon }, index) => <article className="admin-feature-metric admin-verification-metric" key={label} style={{ "--feature-delay": `${index * 65}ms` } as React.CSSProperties}><div className="admin-feature-metric__top"><Icon size={18} /><span>{note}</span></div><span>{label}</span><strong>{value}</strong>{detail ? <small>{detail}</small> : <i><b /></i>}</article>)}
      </div>

      <div className="admin-feature-grid admin-verification-main-grid">
        <article className="admin-feature-panel admin-verification-requests">
          <header className="admin-feature-panel__heading"><h2>Recent Verification Requests</h2><button type="button" onClick={() => onLocalAction("Semua permintaan verifikasi ditampilkan dari penyimpanan lokal.")}>View All →</button></header>
          <div className="admin-feature-table-scroll"><table className="admin-feature-table"><thead><tr><th>Applicant Name</th><th>Type</th><th>Date</th><th>Priority</th><th>Status</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><td><div className="admin-feature-person"><span>{request.initials}</span><strong>{request.name}</strong></div></td><td>{request.type}</td><td>{request.date}</td><td><span className={`admin-verification-priority admin-verification-priority--${request.priority.toLowerCase()}`}>{request.priority}</span></td><td><button type="button" className={`admin-verification-status admin-verification-status--${request.status.toLowerCase().replaceAll(" ", "-")}`} onClick={() => updateStatus(request.id, request.status)} title="Klik untuk mengubah status">{request.status}</button></td></tr>)}</tbody></table></div>
        </article>

        <article className="admin-feature-panel admin-verification-breakdown">
          <header className="admin-feature-panel__heading"><h2>Verification Type<br />Breakdown</h2></header>
          <div className="admin-verification-donut"><svg viewBox="0 0 120 120" role="img" aria-label={`${snapshot.metrics.identityMatchRate} percent total success`}><circle cx="60" cy="60" r="45" className="admin-verification-donut__track" /><circle cx="60" cy="60" r="45" className="admin-verification-donut__value" style={{ "--donut-offset": `${282.74 * (1 - snapshot.metrics.identityMatchRate / 100)}` } as React.CSSProperties} /><text x="60" y="58">{snapshot.metrics.identityMatchRate}%</text><text x="60" y="70">Total Success</text></svg></div>
          <div className="admin-verification-legend">{snapshot.breakdown.map((item, index) => <div key={item.label}><span><i className={`tone-${index}`} />{item.label}</span><strong>{item.value}%</strong></div>)}</div>
        </article>
      </div>

      <div className="admin-feature-grid admin-verification-bottom-grid">
        <article className="admin-feature-panel admin-security-logs">
          <header className="admin-feature-panel__heading"><h2>Security Infrastructure Logs</h2><span><Sparkles size={13} /> Streaming Real-time</span></header>
          <div className="admin-security-log-list">{snapshot.logs.map((log, index) => { const Icon = logIcons[index] ?? ScanFace; return <div className={log.tone === "danger" ? "is-danger" : ""} key={log.id}><span><Icon size={17} /></span><div><strong>{log.title}</strong><small>{log.detail}</small></div><time>{log.time}</time></div>; })}</div>
        </article>

        <aside className="admin-verification-aside"><article className="admin-feature-panel admin-network-card"><span>Local Data Health</span><strong>{snapshot.networkHealth}%</strong><p>Identity, document, credential, CSR, internship, and webinar records are read from this browser.</p></article><article className="admin-executive-card"><h2>Executive Summary</h2><p>{snapshot.metrics.auditQueue} submission membutuhkan review dan {snapshot.requests.filter((request) => request.status === "Verified").length} sudah terverifikasi.</p><button type="button" onClick={() => onLocalAction("Laporan verifikasi lokal siap diekspor saat adapter backend tersedia.")}>Prepare Local Report</button></article></aside>
      </div>
    </section>
  );
};

export default EnterpriseVerification;
