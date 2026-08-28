import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import InternationalPhoneInput from "../../components/Form/InternationalPhoneInput";
import AuthTheme, { AuthProgress } from "../Auth/AuthShell";
import { registrationDraftService } from "../../services/auth/registrationDraftService";
import { navigateToHashRoute } from "../../utils/hashNavigation";

const InformasiDasar = () => {
  const initialDraft = useMemo(() => registrationDraftService.load(), []);
  const [form, setForm] = useState(initialDraft);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1_200_000) {
      setError("Ukuran foto maksimal 1,2 MB untuk simulasi frontend ini.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, profilePhoto: String(reader.result ?? "") }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.accountType) {
      navigateToHashRoute("/daftar");
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.nickname.trim() ||
      !form.email.trim() ||
      !form.whatsapp.trim() ||
      !form.password ||
      !form.birthDate ||
      !form.gender
    ) {
      setError("Lengkapi seluruh informasi dasar sebelum melanjutkan.");
      return;
    }

    if (form.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    registrationDraftService.save(form);
    navigateToHashRoute("/daftar/profil-preferensi");
  };

  return (
    <>
      <Navbar />
      <AuthTheme>
        <main className="auth-global-page auth-step2-page">
          <section className="auth-step2-shell">
            <aside className="auth-step2-aside">
              <div className="auth-step2-brand-block">
                <div className="auth-brand">Mahreen Indonesia</div>
                <p className="auth-brand-copy">
                  Ecosystem Platform for Premium Bespoke<br />
                  Craftsmanship &amp; Technology.
                </p>
              </div>

              <div className="auth-feature-list auth-step2-feature-list">
                <div className="auth-feature-box auth-step2-feature-box">
                  <span className="auth-feature-icon">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <strong>Identitas Terverifikasi</strong>
                    <span>Langkah awal menuju ekosistem eksklusif Mahreen.</span>
                  </div>
                </div>
                <div className="auth-feature-box auth-step2-feature-box">
                  <span className="auth-feature-icon">
                    <LockKeyhole size={18} />
                  </span>
                  <div>
                    <strong>Privasi Terjamin</strong>
                    <span>Data Anda tersimpan aman selama proses pendaftaran.</span>
                  </div>
                </div>
              </div>

              <p className="auth-helper auth-step2-copyright">
                © 2026 Mahreen Indonesia.
                <br />
                Crafted for the elite.
              </p>
            </aside>

            <div className="auth-step2-main">
              <div className="auth-step2-content">
                <AuthProgress current={2} label="Informasi Dasar" />

                <div className="auth-step2-upload-block auth-step2-upload-block--form">
                  <label className="auth-upload auth-step2-upload">
                    <input type="file" accept="image/*" onChange={handlePhoto} />
                    {form.profilePhoto ? (
                      <img width="96" height="96" decoding="async" src={form.profilePhoto} alt="Pratinjau foto profil" />
                    ) : (
                      <span className="auth-upload-label">
                        <Camera size={25} />
                        <span>Upload Foto</span>
                      </span>
                    )}
                  </label>
                  <p>
                    Unggah foto profil resmi Anda untuk
                    <br />
                    verifikasi visual.
                  </p>
                </div>

                <form className="auth-step2-form" onSubmit={handleSubmit}>
                  <div className="auth-form-grid auth-step2-form-grid">
                    <label className="auth-field">
                      <span className="auth-label">Nama Lengkap</span>
                      <input
                        className="auth-input"
                        name="fullName"
                        value={form.fullName}
                        onChange={updateField}
                        placeholder="Mahreen Alexandra"
                      />
                    </label>
                    <label className="auth-field">
                      <span className="auth-label">Nama Panggilan</span>
                      <input
                        className="auth-input"
                        name="nickname"
                        value={form.nickname}
                        onChange={updateField}
                        placeholder="Mahreen"
                      />
                    </label>
                    <label className="auth-field">
                      <span className="auth-label">Email</span>
                      <input
                        className="auth-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={updateField}
                        placeholder="alexandra@mahreen.com"
                      />
                    </label>
                    <label className="auth-field">
                      <span className="auth-label">Nomor WhatsApp</span>
                      <InternationalPhoneInput
                        className="auth-input"
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={(value) =>
                          setForm((current) => ({ ...current, whatsapp: value }))
                        }
                        placeholder="812 3456 7890"
                        required
                      />
                    </label>
                    <label className="auth-field auth-field--wide">
                      <span className="auth-label">Password</span>
                      <span className="auth-password-wrap">
                        <input
                          className="auth-input"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={updateField}
                          placeholder="Minimal 8 karakter"
                        />
                        <button
                          className="auth-icon-button"
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          aria-label={
                            showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                          }
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </span>
                      <span className="auth-helper">
                        Gunakan minimal 8 karakter dengan kombinasi angka dan simbol.
                      </span>
                    </label>
                    <label className="auth-field">
                      <span className="auth-label">Tanggal Lahir</span>
                      <input
                        className="auth-input"
                        type="date"
                        name="birthDate"
                        value={form.birthDate}
                        onChange={updateField}
                      />
                    </label>
                    <label className="auth-field">
                      <span className="auth-label">Jenis Kelamin</span>
                      <select
                        className="auth-select"
                        name="gender"
                        value={form.gender}
                        onChange={updateField}
                      >
                        <option value="">Pilih...</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                        <option value="Tidak ingin menyebutkan">Tidak ingin menyebutkan</option>
                      </select>
                    </label>
                  </div>

                  {error && <p className="auth-error">{error}</p>}

                  <div className="auth-actions auth-step2-actions">
                    <button
                      className="auth-button"
                      type="button"
                      onClick={() => navigateToHashRoute("/daftar")}
                    >
                      Kembali
                    </button>
                    <button className="auth-button auth-button--primary" type="submit">
                      Simpan &amp; Lanjutkan
                    </button>
                  </div>
                </form>
              </div>

              <p className="auth-step2-help">
                <span aria-hidden="true">▧</span>
                Butuh bantuan pengisian? <a href="/contact?pillar=general">Hubungi Concierge</a>
              </p>
            </div>
          </section>
        </main>
      </AuthTheme>
      <ClosingSection />
      <Footer />
    </>
  );
};

export default InformasiDasar;
