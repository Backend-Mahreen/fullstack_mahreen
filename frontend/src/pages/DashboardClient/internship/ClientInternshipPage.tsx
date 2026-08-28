import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type InternshipApplication = {
  id: string;
  fullName: string;
  university: string;
  major: string;
  semester: number;
  specialization: string;
  batchId: string;
  status: string;
  reviewedAt: string;
  adminNotes: string;
  createdAt: string;
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    pending: "Menunggu Review",
    screening: "Screening",
    interview: "Interview",
    accepted: "Diterima",
    rejected: "Ditolak",
    withdrawn: "Dibatalkan",
  };
  return map[s.toLowerCase()] || s;
};

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (v === "accepted") return "client-internship__badge--accepted";
  if (v === "rejected" || v === "withdrawn") return "client-internship__badge--rejected";
  if (v === "interview") return "client-internship__badge--interview";
  return "client-internship__badge--pending";
};

const ClientInternshipPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<InternshipApplication[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    void apiClient<{ items: InternshipApplication[] }>(API_ENDPOINTS.clientInternshipApplications.list)
      .then((res) => { if (active) setApplications(res.items || []); })
      .catch(() => { if (active) setError("Gagal memuat data aplikasi internship."); });
    return () => { active = false; };
  }, [user]);

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="internship" className="client-internship-page">
      <div className="client-internship-content">
        <header className="client-internship-header">
          <h1>Internship Saya</h1>
          <p>Status aplikasi dan partisipasi Anda dalam program internship Mahreen.</p>
        </header>

        {error && <p className="client-internship__error" role="alert">{error}</p>}

        {!applications ? (
          <div className="client-internship__skeleton" aria-label="Memuat aplikasi internship">
            {[0, 1, 2].map((i) => <span key={i} />)}
          </div>
        ) : applications.length === 0 ? (
          <section className="client-internship__empty" role="status">
            <GraduationCap aria-hidden="true" />
            <h2>Belum ada aplikasi internship</h2>
            <p>Anda dapat mendaftar program internship melalui halaman publik.</p>
            <a href="/internship">Lihat Program Internship</a>
          </section>
        ) : (
          <div className="client-internship-list">
            {applications.map((app) => (
              <div key={app.id} className="client-internship-item">
                <div className="client-internship-item__main">
                  <span className="client-internship-item__name">{app.fullName}</span>
                  <span className={`client-internship__badge ${statusColor(app.status)}`}>
                    {statusLabel(app.status)}
                  </span>
                </div>
                <div className="client-internship-item__details">
                  {app.university && <span>{app.university}</span>}
                  {app.major && <span>{app.major}</span>}
                  {app.semester > 0 && <span>Semester {app.semester}</span>}
                  {app.specialization && <span>{app.specialization}</span>}
                </div>
                <div className="client-internship-item__date">
                  {new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                {app.adminNotes && (
                  <div className="client-internship-item__notes">
                    <strong>Catatan admin:</strong> {app.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientInternshipPage;
