import { Clock3, X } from "lucide-react";
import type { DirectoryAuditEntry } from "./types";

type AuditLogPanelProps = Readonly<{
  entries: readonly DirectoryAuditEntry[];
  onClose: () => void;
}>;

const AuditLogPanel = ({ entries, onClose }: AuditLogPanelProps) => (
  <div className="user-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="user-modal user-audit-modal" role="dialog" aria-modal="true" aria-labelledby="audit-log-title">
      <header><div><span>Local activity</span><h2 id="audit-log-title">Audit Log</h2><p>Recent actions recorded by the user directory.</p></div><button type="button" aria-label="Close audit log" onClick={onClose}><X size={20} /></button></header>
      <div className="user-audit-list">
        {entries.map((entry) => (
          <article key={entry.id}><span><Clock3 size={16} /></span><div><strong>{entry.action}</strong><p>{entry.detail}</p><time dateTime={entry.timestamp}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.timestamp))}</time></div></article>
        ))}
      </div>
    </section>
  </div>
);

export default AuditLogPanel;
