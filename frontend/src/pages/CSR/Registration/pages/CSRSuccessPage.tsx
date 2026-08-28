import { ArrowLeft, ArrowRight, Check, FileText, Mail, Sparkles } from "lucide-react";

import CSRRegistrationLayout from "../components/CSRRegistrationLayout";
import useCSRRegistration from "../../../../hooks/useCSRRegistration";
import type { CSRRegistrationData } from "../../../../types/csrRegistration";

const SuccessStep = ({ data }: Readonly<{ data: CSRRegistrationData }>) => (
  <div className="csr-registration-stage" key="success-step">
    <div className="csr-registration-success-wrap">
      <article className="csr-registration-success-card" aria-labelledby="csr-registration-success-title">
        <div className="csr-registration-success-icon-wrap" aria-hidden="true">
          <span className="csr-registration-success-icon">
            <Check size={28} strokeWidth={3} />
          </span>
        </div>

        <h1 className="csr-registration-success-title" id="csr-registration-success-title">
          Application Received
        </h1>
        <p className="csr-registration-success-description">
          Pendaftaran Anda telah berhasil kami terima. Tim Mahreen CSR akan melakukan tinjauan mendalam terhadap aplikasi Anda dalam kurun waktu 3–5 hari kerja.
        </p>

        <div className="csr-registration-success-steps">
          <div className="csr-registration-success-step">
            <p className="csr-registration-success-step__eyebrow"><Mail size={11} /> Langkah 1</p>
            <h2 className="csr-registration-success-step__title">Verifikasi Email</h2>
            <p className="csr-registration-success-step__text">Periksa kotak masuk Anda untuk detail konfirmasi pendaftaran resmi.</p>
          </div>
          <div className="csr-registration-success-step">
            <p className="csr-registration-success-step__eyebrow"><FileText size={11} /> Langkah 2</p>
            <h2 className="csr-registration-success-step__title">Tinjauan Tim</h2>
            <p className="csr-registration-success-step__text">Tim kurator kami akan memvalidasi keselarasan profil dengan visi CSR kami.</p>
          </div>
          <div className="csr-registration-success-step">
            <p className="csr-registration-success-step__eyebrow"><Sparkles size={11} /> Langkah 3</p>
            <h2 className="csr-registration-success-step__title">Pengumuman Hasil</h2>
            <p className="csr-registration-success-step__text">Anda akan menerima notifikasi status aplikasi melalui email dan portal dashboard Mahreen.</p>
          </div>
        </div>

        {data.applicationId && (
          <p className="csr-registration-application-meta">
            Nomor aplikasi: {data.applicationId}
          </p>
        )}

        <div className="csr-registration-success-actions">
          <a className="csr-registration-button" href="/">
            <ArrowLeft size={14} />
            Back to Home
          </a>
          <a className="csr-registration-button csr-registration-button--ghost" href="/mahreen-csr">
            Explore Programs
            <ArrowRight size={14} />
          </a>
        </div>
      </article>
    </div>
  </div>
);

const CSRSuccessPage = () => {
  const { data } = useCSRRegistration(4);

  return (
    <CSRRegistrationLayout currentStep={4}>
      <SuccessStep data={data} />
    </CSRRegistrationLayout>
  );
};

export default CSRSuccessPage;
