import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { BriefcaseBusiness, GraduationCap, Link2, Palette, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import AuthTheme, { AuthProgress } from "../Auth/AuthShell";
import { registrationDraftService } from "../../services/auth/registrationDraftService";
import { navigateToHashRoute } from "../../utils/hashNavigation";

const serviceOptions = [
  "Tanya Mahreen",
  "Mahreen Studio",
  "Internship",
  "Peduli Mahreen",
  "Mahreen CSR",
  "Exclusive Events",
] as const;

const ProfilPreferensi = () => {
  const initialDraft = useMemo(() => registrationDraftService.load(), []);
  const [form, setForm] = useState(initialDraft);
  const [error, setError] = useState("");

  const updateField = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const toggleInterest = (interest: string) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName || !form.email) {
      navigateToHashRoute("/daftar/informasi-dasar");
      return;
    }

    if (!form.jobTitle.trim() || !form.institution.trim()) {
      setError("Isi pekerjaan dan institusi agar pengalaman akun dapat dipersonalisasi.");
      return;
    }

    if (form.interests.length === 0) {
      setError("Pilih minimal satu layanan yang Anda minati.");
      return;
    }

    registrationDraftService.save(form);
    navigateToHashRoute("/daftar/ringkasan");
  };

  return (
    <>
      <Navbar />
      <AuthTheme>
        <main className="auth-global-page">
          <section className="auth-stage auth-stage--compact">
            <div className="auth-two-column auth-two-column--profile">
              <aside>
                <p className="auth-kicker">Pendaftaran Akun</p>
                <h1 className="auth-title" style={{ color: "var(--auth-gold-soft)" }}>Lengkapi Profil &amp; Preferensi Anda</h1>
                <p className="auth-lead">
                  Bantu kami menyesuaikan pengalaman ekosistem Mahreen untuk kebutuhan personal dan profesional Anda.
                </p>

                <div className="auth-feature-list">
                  <div className="auth-feature-box">
                    <span className="auth-feature-icon"><Sparkles size={17} /></span>
                    <div><strong>Informasi Dasar</strong><span>Data identitas telah tersimpan.</span></div>
                  </div>
                  <div className="auth-feature-box">
                    <span className="auth-feature-icon"><GraduationCap size={17} /></span>
                    <div><strong>Verifikasi Identitas</strong><span>Profil akan diverifikasi pada tahap backend.</span></div>
                  </div>
                  <div className="auth-feature-box">
                    <span className="auth-feature-icon"><Palette size={17} /></span>
                    <div><strong>Profil Tambahan &amp; Layanan</strong><span>Tentukan minat utama Anda.</span></div>
                  </div>
                </div>
              </aside>

              <div>
                <AuthProgress current={3} label="Profil & Preferensi" />
                <form className="auth-card" onSubmit={handleSubmit}>
                  <div className="auth-card-header">
                    <span className="auth-section-icon"><BriefcaseBusiness size={18} /></span>
                    <div><h2>Informasi Profesional</h2><p>Lengkapi konteks pekerjaan atau aktivitas Anda.</p></div>
                  </div>

                  <div className="auth-form-grid">
                    <label className="auth-field">
                      <span className="auth-label">Pekerjaan / Jabatan</span>
                      <input className="auth-input" name="jobTitle" value={form.jobTitle} onChange={updateField} placeholder="Contoh: Senior Architect" />
                    </label>
                    <label className="auth-field">
                      <span className="auth-label">Institusi / Perusahaan</span>
                      <input className="auth-input" name="institution" value={form.institution} onChange={updateField} placeholder="Nama institusi saat ini" />
                    </label>
                    <label className="auth-field auth-field--wide">
                      <span className="auth-label">Tautan Media Sosial (Opsional)</span>
                      <div className="auth-form-grid">
                        <label className="auth-field">
                          <span className="auth-helper"><Link2 size={12} /> LinkedIn</span>
                          <input className="auth-input" name="linkedin" value={form.linkedin} onChange={updateField} placeholder="LinkedIn URL" />
                        </label>
                        <label className="auth-field">
                          <span className="auth-helper">Portfolio / Web</span>
                          <input className="auth-input" name="portfolio" value={form.portfolio} onChange={updateField} placeholder="https://portfolio.com" />
                        </label>
                        <label className="auth-field auth-field--wide">
                          <span className="auth-helper">Instagram / X</span>
                          <input className="auth-input" name="instagram" value={form.instagram} onChange={updateField} placeholder="@username" />
                        </label>
                      </div>
                    </label>
                  </div>

                  <div className="auth-divider" />

                  <div className="auth-card-header">
                    <span className="auth-section-icon"><Sparkles size={18} /></span>
                    <div><h2>Minat Layanan</h2><p>Pilih layanan yang ingin Anda jelajahi lebih lanjut.</p></div>
                  </div>

                  <div className="auth-interest-grid">
                    {serviceOptions.map((interest) => {
                      const isSelected = form.interests.includes(interest);
                      return (
                        <button
                          className={`auth-interest ${isSelected ? "is-selected" : ""}`}
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          aria-pressed={isSelected}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  <p className="auth-note">Preferensi dapat diubah kapan saja melalui pengaturan profil pada dashboard Mahreen.</p>
                  {error && <p className="auth-error">{error}</p>}

                  <div className="auth-actions">
                    <button className="auth-button" type="button" onClick={() => navigateToHashRoute("/daftar/informasi-dasar")}>Kembali</button>
                    <button className="auth-button auth-button--primary" type="submit">Selesaikan Pendaftaran</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </AuthTheme>
      <ClosingSection />
      <Footer />
    </>
  );
};

export default ProfilPreferensi;
