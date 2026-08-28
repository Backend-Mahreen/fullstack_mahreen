import { useState, type FormEvent } from "react";
import { ArrowLeft, CircleCheck } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import { navigateToHashRoute } from "../../utils/hashNavigation";
import { authService } from "../../services/auth/authService";
import PasswordInput from "./recovery/PasswordInput";
import RecoverySecurityCard from "./recovery/RecoverySecurityCard";
import RecoveryShell from "./recovery/RecoveryShell";

type ResetPasswordProps = Readonly<{ initialToken?: string | null }>;

const ResetPassword = ({ initialToken = null }: ResetPasswordProps) => {
  const token = initialToken?.trim() ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (!token) { setError("Token pemulihan tidak ditemukan. Minta tautan baru dari halaman lupa kata sandi."); return; }
    if (password.length < 10) { setError("Kata sandi harus terdiri dari minimal 10 karakter."); return; }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError("Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.");
      return;
    }
    if (password !== confirmPassword) { setError("Konfirmasi kata sandi belum sama."); return; }
    setSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Kata sandi gagal diperbarui.");
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <Navbar />
      <RecoveryShell variant="reset" visual={<RecoverySecurityCard variant="reset" />}>
        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <div className="recovery-reveal" style={{ "--recovery-delay": "60ms" } as React.CSSProperties}>
            <h1 className="recovery-title">Atur Ulang Kata Sandi</h1>
            <p className="recovery-subtitle">Silakan masukkan kata sandi baru Anda untuk mengamankan kembali akun Mahreen ID Anda.</p>
          </div>
          {!success && (
            <div className="recovery-reveal" style={{ "--recovery-delay": "140ms" } as React.CSSProperties}>
              <PasswordInput id="new-password" label="Kata Sandi Baru" value={password} onChange={(value) => { setPassword(value); setError(""); }} visible={showPassword} onToggleVisibility={() => setShowPassword((current) => !current)} />
              <PasswordInput id="confirm-new-password" label="Konfirmasi Kata Sandi Baru" value={confirmPassword} onChange={(value) => { setConfirmPassword(value); setError(""); }} visible={showConfirmation} confirmation onToggleVisibility={() => setShowConfirmation((current) => !current)} />
              <p className="recovery-hint">Gunakan minimal 10 karakter dengan huruf besar, huruf kecil, angka, dan simbol.</p>
            </div>
          )}
          {error && <p className="recovery-feedback recovery-feedback--error" role="alert">{error}</p>}
          {success && <p className="recovery-feedback" role="status"><CircleCheck size={18} aria-hidden="true" />Kata sandi berhasil diperbarui. Anda sudah dapat masuk dengan kredensial baru.</p>}
          <div className="recovery-reveal" style={{ "--recovery-delay": "220ms" } as React.CSSProperties}>
            {!success ? <button className="recovery-button" type="submit" disabled={submitting}>{submitting ? "Menyimpan…" : "Simpan Kata Sandi Baru"}</button> : <button className="recovery-button" type="button" onClick={() => navigateToHashRoute("/login")}>Masuk dengan Kata Sandi Baru</button>}
            <button className="recovery-back" type="button" onClick={() => navigateToHashRoute("/login")}><ArrowLeft size={16} aria-hidden="true" />Kembali ke Login</button>
          </div>
        </form>
      </RecoveryShell>
      <div className="recovery-tail recovery-tail--closing"><ClosingSection /></div>
      <div className="recovery-tail recovery-tail--footer"><Footer /></div>
    </>
  );
};
export default ResetPassword;
