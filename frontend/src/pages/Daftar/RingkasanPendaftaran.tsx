import { useMemo, useState, type FormEvent } from "react";
import { BadgeCheck, FileCheck2 } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import AuthTheme, { AuthProgress } from "../Auth/AuthShell";
import { useAuth } from "../../hooks/useAuth";
import { registrationDraftService } from "../../services/auth/registrationDraftService";
import { navigateToHashRoute } from "../../utils/hashNavigation";

const accountLabels = {
  individual: "Individual Account",
  company: "Institutional Portfolio",
  community: "Community Collaboration",
} as const;

const RingkasanPendaftaran = () => {
  const draft = useMemo(() => registrationDraftService.load(), []);
  const { register } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(draft.newsletter);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.accountType || !draft.fullName || !draft.email || !draft.password) {
      navigateToHashRoute("/daftar");
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setError("Setujui Syarat & Ketentuan dan Kebijakan Privasi untuk membuat akun.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const account = await register({ ...draft, newsletter });
      const params = new URLSearchParams({
        registered: "1",
        email: account.email,
      });
      navigateToHashRoute(`/login?${params.toString()}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Akun tidak dapat dibuat.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const accountLabel = draft.accountType ? accountLabels[draft.accountType] : "Belum dipilih";

  return (
    <>
      <Navbar />
      <AuthTheme>
        <main className="auth-global-page">
          <section className="auth-stage auth-stage--review">
            <div className="auth-review-top">
              <div className="auth-review-progress-wrap">
                <AuthProgress
                  current={4}
                  label="Ringkasan dan persetujuan akhir"
                />
              </div>
            </div>

            <div className="auth-review-content">
                <div className="auth-review-intro-stack">
                  <aside className="auth-legal-nav" aria-label="Legal Center">
                    <h3>Legal Center</h3>
                    <p>Resources &amp; Compliance</p>
                    <span>Overview</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Compliance</span>
                    <span className="is-active">Disclosures</span>
                  </aside>

                  <aside className="auth-card auth-review-intro">
                    <p className="auth-kicker">Finalisasi Akun</p>
                    <h1 className="auth-title auth-review-title">
                      Langkah Terakhir Menuju Eksklusivitas.
                    </h1>
                    <p className="auth-lead">
                      Tinjau informasi Anda untuk memastikan setiap detail mencerminkan
                      profil profesional di ekosistem Mahreen Indonesia.
                    </p>
                  </aside>
                </div>

                <form className="auth-review-form" onSubmit={handleCreateAccount}>
                  <section className="auth-card">
                    <div className="auth-card-header">
                      <span className="auth-section-icon"><BadgeCheck size={19} /></span>
                      <div>
                        <h2>Ringkasan Pendaftaran</h2>
                        <p>Pastikan semua data sudah benar sebelum akun dibuat.</p>
                      </div>
                    </div>

                    <div className="auth-summary-grid">
                      <div className="auth-summary-item">
                        <span>Tipe Akun</span>
                        <strong>{accountLabel}</strong>
                      </div>
                      <div className="auth-summary-item">
                        <span>Nama Lengkap</span>
                        <strong>{draft.fullName || "-"}</strong>
                      </div>
                      <div className="auth-summary-item">
                        <span>Email</span>
                        <strong>{draft.email || "-"}</strong>
                      </div>
                      <div className="auth-summary-item">
                        <span>Institusi</span>
                        <strong>{draft.institution || "-"}</strong>
                      </div>
                    </div>

                    <div className="auth-divider" />
                    <div className="auth-summary-item">
                      <span>Minat &amp; Fokus</span>
                      <div className="auth-chip-row">
                        {draft.interests.length > 0
                          ? draft.interests.map((interest) => (
                              <span className="auth-chip" key={interest}>{interest}</span>
                            ))
                          : <span className="auth-chip">Belum dipilih</span>}
                      </div>
                    </div>
                  </section>

                  <section className="auth-card auth-consent-card">
                    <div className="auth-card-header">
                      <span className="auth-section-icon"><FileCheck2 size={18} /></span>
                      <div>
                        <h2>Pernyataan &amp; Persetujuan</h2>
                        <p>Konfirmasi persetujuan sebelum menyelesaikan pendaftaran.</p>
                      </div>
                    </div>

                    <div className="auth-check-list">
                      <label className="auth-check">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(event) => setTermsAccepted(event.target.checked)}
                        />
                        <span>
                          Saya menyetujui <a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a>
                          {" "}yang berlaku dalam platform Mahreen Indonesia.
                        </span>
                      </label>
                      <label className="auth-check">
                        <input
                          type="checkbox"
                          checked={privacyAccepted}
                          onChange={(event) => setPrivacyAccepted(event.target.checked)}
                        />
                        <span>
                          Saya telah membaca dan memahami <a href="/kebijakan-privasi">Kebijakan Privasi</a>
                          {" "}terkait pengelolaan data pribadi.
                        </span>
                      </label>
                      <label className="auth-check">
                        <input
                          type="checkbox"
                          checked={newsletter}
                          onChange={(event) => setNewsletter(event.target.checked)}
                        />
                        <span>Kirimkan pembaruan mingguan mengenai portofolio, layanan, dan agenda Mahreen.</span>
                      </label>
                    </div>

                    {error && <p className="auth-error" role="alert">{error}</p>}
                  </section>

                  <div className="auth-actions">
                    <button
                      className="auth-button"
                      type="button"
                      onClick={() => navigateToHashRoute("/daftar/profil-preferensi")}
                    >
                      ← Kembali
                    </button>
                    <button className="auth-button auth-button--primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Membuat akun..." : "Buat Akun →"}
                    </button>
                  </div>
                </form>
            </div>
          </section>
        </main>
      </AuthTheme>
      <ClosingSection />
      <Footer />
    </>
  );
};

export default RingkasanPendaftaran;
