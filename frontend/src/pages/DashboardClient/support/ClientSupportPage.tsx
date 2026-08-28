import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type SupportTicket = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: string;
  createdAt: string;
};

type SupportSummary = {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    open: "Terbuka",
    in_progress: "Diproses",
    resolved: "Selesai",
    closed: "Ditutup",
  };
  return map[s.toLowerCase()] || s;
};

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (v === "resolved" || v === "closed") return "client-support__badge--resolved";
  if (v === "in_progress") return "client-support__badge--in-progress";
  return "client-support__badge--open";
};

const ClientSupportPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [summary, setSummary] = useState<SupportSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      try {
        const [listRes, sumRes] = await Promise.all([
          apiClient<{ items: SupportTicket[] }>(API_ENDPOINTS.clientSupportTickets.list),
          apiClient<SupportSummary>(API_ENDPOINTS.clientSupportTickets.summary),
        ]);
        if (active) {
          setTickets(listRes.items || []);
          setSummary(sumRes);
        }
      } catch {
        if (active) setError("Gagal memuat data tiket dukungan.");
      }
    };
    void load();
    return () => { active = false; };
  }, [user]);

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="support" className="client-support-page">
      <div className="client-support-content">
        <header className="client-support-header">
          <h1>Support Tickets</h1>
          <p>Tiket dukungan dan pertanyaan yang telah Anda kirimkan.</p>
        </header>

        {summary && (
          <div className="client-support-summary">
            <div className="client-support-summary__card">
              <span className="client-support-summary__label">Total Tiket</span>
              <span className="client-support-summary__value">{summary.totalTickets}</span>
            </div>
            <div className="client-support-summary__card">
              <span className="client-support-summary__label">Masih Terbuka</span>
              <span className="client-support-summary__value">{summary.openTickets}</span>
            </div>
            <div className="client-support-summary__card">
              <span className="client-support-summary__label">Selesai</span>
              <span className="client-support-summary__value">{summary.resolvedTickets}</span>
            </div>
          </div>
        )}

        {error && <p className="client-support__error" role="alert">{error}</p>}

        {!tickets ? (
          <div className="client-support__skeleton" aria-label="Memuat tiket dukungan">
            {[0, 1, 2].map((i) => <span key={i} />)}
          </div>
        ) : tickets.length === 0 ? (
          <section className="client-support__empty" role="status">
            <Ticket aria-hidden="true" />
            <h2>Belum ada tiket dukungan</h2>
            <p>Tiket dukungan Anda akan tampil di sini.</p>
            <a href="/kontak">Hubungi Kami</a>
          </section>
        ) : (
          <div className="client-support-list">
            {tickets.map((t) => (
              <div key={t.id} className="client-support-item">
                <div className="client-support-item__main">
                  <span className="client-support-item__category">{t.category || "Umum"}</span>
                  <span className={`client-support__badge ${statusColor(t.status)}`}>
                    {statusLabel(t.status)}
                  </span>
                </div>
                <p className="client-support-item__message">{t.message}</p>
                <div className="client-support-item__date">
                  {new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientSupportPage;
