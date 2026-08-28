import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type CsrApplication = {
  id: string;
  programId: string;
  role: string;
  fullName: string;
  email: string;
  institution: string;
  focusArea: string;
  motivation: string;
  status: string;
  reviewedAt: string;
  createdAt: string;
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    pending: "Menunggu Review",
    approved: "Disetujui",
    rejected: "Ditolak",
    waitlisted: "Daftar Tunggu",
  };
  return map[s.toLowerCase()] || s;
};

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (v === "approved") return "client-csr__badge--approved";
  if (v === "rejected") return "client-csr__badge--rejected";
  if (v === "waitlisted") return "client-csr__badge--waitlisted";
  return "client-csr__badge--pending";
};

const ClientCsrPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<CsrApplication[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    void apiClient<{ items: CsrApplication[] }>(API_ENDPOINTS.clientCsrApplications.list)
      .then((res) => { if (active) setApplications(res.items || []); })
      .catch(() => { if (active) setError("Gagal memuat data aplikasi CSR."); });
    return () => { active = false; };
  }, [user]);

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="csr" className="client-csr-page">
      <div className="client-csr-content">
        <header className="client-csr-header">
          <h1>CSR Saya</h1>
          <p>Daftar aplikasi dan partisipasi program CSR Mahreen Indonesia.</p>
        </header>

        {error && <p className="client-csr__error" role="alert">{error}</p>}

        {!applications ? (
          <div className="client-csr__skeleton" aria-label="Memuat aplikasi CSR">
            {[0, 1, 2].map((i) => <span key={i} />)}
          </div>
        ) : applications.length === 0 ? (
          <section className="client-csr__empty" role="status">
            <Building2 aria-hidden="true" />
            <h2>Belum ada aplikasi CSR</h2>
            <p>Anda dapat mendaftar program CSR melalui halaman publik.</p>
            <a href="/mahreen-csr">Lihat Program CSR</a>
          </section>
        ) : (
          <div className="client-csr-list">
            {applications.map((app) => (
              <div key={app.id} className="client-csr-item">
                <div className="client-csr-item__main">
                  <span className="client-csr-item__role">{app.role || "Volunteer"}</span>
                  <span className={`client-csr__badge ${statusColor(app.status)}`}>
                    {statusLabel(app.status)}
                  </span>
                </div>
                <div className="client-csr-item__details">
                  {app.institution && <span>{app.institution}</span>}
                  {app.focusArea && <span>Fokus: {app.focusArea}</span>}
                  <span>
                    {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                {app.motivation && <p className="client-csr-item__motivation">{app.motivation}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientCsrPage;
