import { BadgeCheck, CheckCircle2, Download, Fingerprint, ShieldAlert } from "lucide-react";
import type {
  VerificationCertificate,
  VerificationResultStatus,
} from "../../../../services/verification/verificationService";

type VerificationResultProps = Readonly<{
  documentId: string;
  isFreshResult: boolean;
  status: VerificationResultStatus;
  certificate: VerificationCertificate | null;
  isLoading: boolean;
  onDownload: () => void;
}>;

const STATUS_LABEL: Record<VerificationResultStatus, string> = {
  valid: "Dokumen Valid",
  revoked: "Dokumen Dicabut",
  expired: "Dokumen Kedaluwarsa",
  invalid: "Status Tidak Dikenali",
  not_found: "Dokumen Tidak Ditemukan",
};

const STATUS_TONE: Record<VerificationResultStatus, string> = {
  valid: "is-valid",
  revoked: "is-invalid",
  expired: "is-invalid",
  invalid: "is-invalid",
  not_found: "is-invalid",
};

const VerificationResult = ({ documentId, isFreshResult, status, certificate, isLoading, onDownload }: VerificationResultProps) => {
  const tone = STATUS_TONE[status];
  const label = STATUS_LABEL[status];
  const isPositive = status === "valid";
  const Icon = isPositive ? BadgeCheck : ShieldAlert;

  return (
    <section className="mvc-result-section" id="hasil-verifikasi">
      <div className="mvc-container">
        <header className="mvc-section-heading" data-mvc-reveal><span>Hasil Verifikasi</span><p>Status validasi dokumen resmi Mahreen Indonesia.</p></header>

        {isLoading ? (
          <article className="mvc-result-card" data-mvc-reveal style={{ "--mvc-delay": "80ms" } as React.CSSProperties}>
            <div className="mvc-result-card__body">
              <p style={{ color: "#8b857d", fontSize: 14 }}>Memeriksa dokumen...</p>
            </div>
          </article>
        ) : (
          <article
            className={`mvc-result-card ${tone}${isFreshResult ? " is-fresh" : ""}`}
            data-mvc-reveal
            style={{ "--mvc-delay": "80ms" } as React.CSSProperties}
          >
            <div className="mvc-result-card__top">
              <strong><Icon size={20} aria-hidden="true" />{label}</strong>
              <span>Mahreen Verification System</span>
            </div>
            <div className="mvc-result-card__body">
              <dl className="mvc-result-card__details">
                <div><dt>Nomor/Kode</dt><dd>{documentId || "-"}</dd></div>
                <div><dt>Penerima</dt><dd>{certificate?.recipientName ?? "-"}</dd></div>
                <div><dt>Jenis Program</dt><dd>{certificate?.programType ?? "-"}</dd></div>
                <div><dt>Nama Program</dt><dd>{certificate?.programName ?? "-"}</dd></div>
                <div><dt>Nomor Sertifikat</dt><dd>{certificate?.certificateNumber ?? "-"}</dd></div>
                <div><dt>Diterbitkan</dt><dd>{certificate?.issuedAt ?? "-"}</dd></div>
                {certificate?.expiresAt ? <div><dt>Berlaku Hingga</dt><dd>{certificate.expiresAt}</dd></div> : null}
              </dl>
              <div className="mvc-result-card__footer">
                <div className="mvc-signature">
                  <span className="mvc-signature__mark" aria-hidden="true"><Fingerprint size={24} /></span>
                  <span>
                    <strong>Digital Signature</strong>
                    <small>{isPositive ? "Validated by Mahreen" : "Periksa kembali dokumen Anda"}</small>
                  </span>
                  {isPositive ? <CheckCircle2 className="mvc-signature__check" size={20} aria-hidden="true" /> : null}
                </div>
                {isPositive ? (
                  <button type="button" onClick={onDownload}><Download size={18} aria-hidden="true" />Download PDF</button>
                ) : null}
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
};
export default VerificationResult;
