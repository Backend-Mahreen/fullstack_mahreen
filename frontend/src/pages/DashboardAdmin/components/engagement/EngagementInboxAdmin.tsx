import { useCallback, useEffect, useState } from "react";
import { Inbox, Mail, MessageSquare, Trash2 } from "lucide-react";
import {
  apiEngagementAdminRepository,
  type ContactInquiryRecord,
  type ContactInquiryStatus,
  type SupportTicketRecord,
  type SupportTicketStatus,
} from "../../../../services/admin/apiEngagementAdminRepository";

type EngagementInboxAdminProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

type InboxTab = "contact" | "support";

const engagementStyles = `
  .admin-engagement-tabs {
    display: inline-flex;
    margin-bottom: 20px;
    padding: 4px;
    gap: 3px;
    border: 1px solid rgba(239,199,63,.18);
    border-radius: 6px;
    background: rgba(255,255,255,.018);
  }
  .admin-engagement-tabs button {
    min-height: 36px;
    padding: 7px 16px;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #8f8a80;
    background: transparent;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    letter-spacing: .09em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .admin-engagement-tabs button.is-active {
    border-color: rgba(239,199,63,.4);
    color: #17140b;
    background: linear-gradient(135deg, #f5d35b, #e9ba37);
  }
  .admin-engagement-empty { padding: 40px 20px; color: #817d75; font-size: 12px; text-align: center; }
  .admin-engagement-toolbar { display: flex; gap: 10px; padding: 0 0 14px; align-items: center; flex-wrap: wrap; }
  .admin-engagement-toolbar select {
    min-height: 34px; padding: 0 12px; border: 1px solid rgba(255,255,255,.1); border-radius: 6px;
    color: #e6e0d8; background: #0d0d0c; font: inherit; font-size: 12px; outline: none;
  }
  .admin-engagement-toolbar select:focus { border-color: rgba(240,200,70,.5); }
  .admin-engagement-list { display: grid; gap: 12px; }
  .admin-engagement-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 14px;
    padding: 16px 18px;
    border: 1px solid rgba(240,200,70,.14);
    border-radius: 10px;
    background: rgba(255,255,255,.018);
    align-items: center;
  }
  .admin-engagement-item:hover { border-color: rgba(240,200,70,.3); }
  .admin-engagement-item__main { min-width: 0; }
  .admin-engagement-item__head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
  .admin-engagement-item__head strong { color: #ece9e3; font-size: 13px; }
  .admin-engagement-item__head span { color: #817d75; font-size: 11px; }
  .admin-engagement-item__body { color: #a8a299; font-size: 12px; line-height: 1.6; }
  .admin-engagement-item__meta { color: #817d75; font-size: 10px; margin-top: 6px; }
  .admin-engagement-badge { display: inline-flex; padding: 3px 9px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
  .admin-engagement-badge.is-new, .admin-engagement-badge.is-open { color: #e5c477; background: rgba(229,196,119,.12); }
  .admin-engagement-badge.is-read, .admin-engagement-badge.is-in_progress { color: #7fb4e0; background: rgba(127,180,224,.12); }
  .admin-engagement-badge.is-responded, .admin-engagement-badge.is-resolved { color: #7fd6a1; background: rgba(127,214,161,.12); }
  .admin-engagement-badge.is-closed { color: #817d75; background: rgba(129,125,117,.12); }
  .admin-engagement-actions { display: flex; gap: 8px; align-items: center; }
  .admin-engagement-actions select {
    min-height: 30px; padding: 0 8px; border: 1px solid rgba(255,255,255,.12); border-radius: 6px;
    color: #d9d5cc; background: #0d0d0c; font: inherit; font-size: 11px; outline: none;
  }
  .admin-engagement-actions button {
    display: grid; width: 30px; height: 30px; padding: 0; place-items: center;
    border: 1px solid rgba(224,141,108,.35); border-radius: 6px; color: #e08d6c;
    background: transparent; cursor: pointer;
  }
  .admin-engagement-actions button:hover { background: rgba(224,141,108,.1); }
  @media (max-width: 720px) {
    .admin-engagement-item { grid-template-columns: 1fr; }
  }
`;

const CONTACT_STATUSES: ContactInquiryStatus[] = ["new", "read", "responded", "closed"];
const SUPPORT_STATUSES: SupportTicketStatus[] = ["open", "in_progress", "resolved", "closed"];

const EngagementInboxAdmin = ({ query, onLocalAction }: EngagementInboxAdminProps) => {
  const [tab, setTab] = useState<InboxTab>("contact");
  const [contactRows, setContactRows] = useState<ContactInquiryRecord[]>([]);
  const [supportRows, setSupportRows] = useState<SupportTicketRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const search = query || undefined;
      const [contactResult, supportResult] = await Promise.all([
        apiEngagementAdminRepository.listContactInquiries({
          status: statusFilter === "all" ? undefined : statusFilter,
          search,
          limit: 100,
        }),
        apiEngagementAdminRepository.listSupportTickets({
          status: statusFilter === "all" ? undefined : statusFilter,
          search,
          limit: 100,
        }),
      ]);
      setContactRows(contactResult.items);
      setSupportRows(supportResult.items);
    } catch {
      onLocalAction("Inbox gagal dimuat. Periksa koneksi server.");
    } finally {
      setIsLoading(false);
    }
  }, [query, statusFilter, onLocalAction]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async
    void load();
  }, [load]);

  const reload = () => { void load(); };

  const changeContactStatus = (id: string, status: ContactInquiryStatus) => {
    void apiEngagementAdminRepository.updateContactInquiryStatus(id, status)
      .then(reload)
      .catch(() => onLocalAction("Gagal mengubah status pesan kontak."));
  };

  const changeSupportStatus = (id: string, status: SupportTicketStatus) => {
    void apiEngagementAdminRepository.updateSupportTicketStatus(id, status)
      .then(reload)
      .catch(() => onLocalAction("Gagal mengubah status tiket."));
  };

  const deleteContact = (id: string) => {
    if (!window.confirm("Hapus pesan kontak ini?")) return;
    void apiEngagementAdminRepository.deleteContactInquiry(id)
      .then(reload)
      .catch(() => onLocalAction("Gagal menghapus pesan kontak."));
  };

  const deleteSupport = (id: string) => {
    if (!window.confirm("Hapus tiket bantuan ini?")) return;
    void apiEngagementAdminRepository.deleteSupportTicket(id)
      .then(reload)
      .catch(() => onLocalAction("Gagal menghapus tiket."));
  };

  const renderContact = () => (
    <div className="admin-engagement-list">
      {contactRows.map((item) => (
        <div className="admin-engagement-item" key={item.id}>
          <div className="admin-engagement-item__main">
            <div className="admin-engagement-item__head">
              <strong>{item.name}</strong>
              <span>{item.email}</span>
              <span className={`admin-engagement-badge is-${item.status}`}>{item.status}</span>
            </div>
            <div className="admin-engagement-item__body">{item.details}</div>
            <div className="admin-engagement-item__meta">
              {[item.partnership, item.company].filter(Boolean).join(" · ")} · {item.created_at}
            </div>
          </div>
          <div className="admin-engagement-actions">
            <select value={item.status} onChange={(e) => changeContactStatus(item.id, e.target.value as ContactInquiryStatus)}>
              {CONTACT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button type="button" aria-label="Hapus" onClick={() => deleteContact(item.id)}><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupport = () => (
    <div className="admin-engagement-list">
      {supportRows.map((item) => (
        <div className="admin-engagement-item" key={item.id}>
          <div className="admin-engagement-item__main">
            <div className="admin-engagement-item__head">
              <strong>{item.name}</strong>
              <span>{item.email}</span>
              <span className={`admin-engagement-badge is-${item.status}`}>{item.status}</span>
            </div>
            <div className="admin-engagement-item__body">{item.message}</div>
            <div className="admin-engagement-item__meta">
              {item.category} · {item.created_at}
            </div>
          </div>
          <div className="admin-engagement-actions">
            <select value={item.status} onChange={(e) => changeSupportStatus(item.id, e.target.value as SupportTicketStatus)}>
              {SUPPORT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button type="button" aria-label="Hapus" onClick={() => deleteSupport(item.id)}><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="admin-engagement-title">
      <style>{engagementStyles}</style>
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">ENGAGEMENT INBOX</span>
          <h1 id="admin-engagement-title">Contact & Support</h1>
          <p>Kelola pesan kontak dan tiket bantuan dari pengunjung.</p>
        </div>
      </header>

      <div className="admin-engagement-tabs" role="tablist" aria-label="Pilih inbox">
        <button type="button" role="tab" aria-selected={tab === "contact"} className={tab === "contact" ? "is-active" : ""} onClick={() => setTab("contact")}>
          <Mail size={14} /> Contact Inquiries
        </button>
        <button type="button" role="tab" aria-selected={tab === "support"} className={tab === "support" ? "is-active" : ""} onClick={() => setTab("support")}>
          <MessageSquare size={14} /> Support Tickets
        </button>
      </div>

      <div className="admin-engagement-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Semua Status</option>
          {(tab === "contact" ? CONTACT_STATUSES : SUPPORT_STATUSES).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="admin-engagement-empty">Memuat inbox...</div>
      ) : tab === "contact" ? (
        contactRows.length ? renderContact() : (
          <div className="admin-engagement-empty"><Inbox size={20} style={{ display: "block", margin: "0 auto 10px" }} />Belum ada pesan kontak.</div>
        )
      ) : (
        supportRows.length ? renderSupport() : (
          <div className="admin-engagement-empty"><Inbox size={20} style={{ display: "block", margin: "0 auto 10px" }} />Belum ada tiket bantuan.</div>
        )
      )}
    </section>
  );
};

export default EngagementInboxAdmin;