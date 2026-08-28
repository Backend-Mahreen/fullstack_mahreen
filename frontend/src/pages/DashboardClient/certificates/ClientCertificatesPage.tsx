import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type Certificate = {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  programType: string;
  programName: string;
  issuedAt: string;
  expiresAt: string;
  status: string;
  fileUrl: string;
  verificationCount: number;
};

type CertificateSummary = {
  totalCertificates: number;
  issuedCertificates: number;
  verifiedCertificates: number;
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    issued: "Diterbitkan",
    revoked: "Dicabut",
    expired: "Kedaluwarsa",
  };
  return map[s.toLowerCase()] || s;
};

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (v === "issued") return "client-certificates__badge--issued";
  if (v === "revoked") return "client-certificates__badge--revoked";
  return "client-certificates__badge--expired";
};

const ClientCertificatesPage = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [summary, setSummary] = useState<CertificateSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      try {
        const [listRes, sumRes] = await Promise.all([
          apiClient<{ items: Certificate[] }>(API_ENDPOINTS.clientCertificates.list),
          apiClient<CertificateSummary>(API_ENDPOINTS.clientCertificates.summary),
        ]);
        if (active) {
          setCertificates(listRes.items || []);
          setSummary(sumRes);
        }
      } catch {
        if (active) setError("Gagal memuat data sertifikat.");
      }
    };
    void load();
    return () => { active = false; };
  }, [user]);

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="certificates" className="client-certificates-page">
      <div className="client-certificates-content">
        <header className="client-certificates-header">
          <h1>Sertifikat Saya</h1>
          <p>Sertifikat yang telah diterbitkan untuk program dan kontribusi Anda.</p>
        </header>

        {summary && (
          <div className="client-certificates-summary">
            <div className="client-certificates-summary__card">
              <span className="client-certificates-summary__label">Total Sertifikat</span>
              <span className="client-certificates-summary__value">{summary.totalCertificates}</span>
            </div>
            <div className="client-certificates-summary__card">
              <span className="client-certificates-summary__label">Diterbitkan</span>
              <span className="client-certificates-summary__value">{summary.issuedCertificates}</span>
            </div>
            <div className="client-certificates-summary__card">
              <span className="client-certificates-summary__label">Terverifikasi</span>
              <span className="client-certificates-summary__value">{summary.verifiedCertificates}</span>
            </div>
          </div>
        )}

        {error && <p className="client-certificates__error" role="alert">{error}</p>}

        {!certificates ? (
          <div className="client-certificates__skeleton" aria-label="Memuat sertifikat">
            {[0, 1, 2].map((i) => <span key={i} />)}
          </div>
        ) : certificates.length === 0 ? (
          <section className="client-certificates__empty" role="status">
            <BadgeCheck aria-hidden="true" />
            <h2>Belum ada sertifikat</h2>
            <p>Sertifikat akan muncul di sini setelah diterbitkan oleh admin.</p>
          </section>
        ) : (
          <div className="client-certificates-list">
            {certificates.map((cert) => (
              <div key={cert.id} className="client-certificates-item">
                <div className="client-certificates-item__main">
                  <span className="client-certificates-item__name">{cert.programName || cert.programType}</span>
                  <span className={`client-certificates__badge ${statusColor(cert.status)}`}>
                    {statusLabel(cert.status)}
                  </span>
                </div>
                <div className="client-certificates-item__details">
                  <span>No: {cert.certificateNumber}</span>
                  {cert.programType && <span>{cert.programType}</span>}
                  {cert.issuedAt && (
                    <span>
                      Diterbitkan: {new Date(cert.issuedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
                {cert.fileUrl && (
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="client-certificates-item__download">
                    Unduh Sertifikat
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientCertificatesPage;
