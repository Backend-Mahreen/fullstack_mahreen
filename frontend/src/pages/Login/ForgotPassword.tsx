import { useState, type FormEvent } from "react";
import { ArrowLeft, CircleCheck, Mail } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import { navigateToHashRoute } from "../../utils/hashNavigation";
import { authService } from "../../services/auth/authService";
import RecoverySecurityCard from "./recovery/RecoverySecurityCard";
import RecoveryShell from "./recovery/RecoveryShell";

const ForgotPassword = () => {
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("email") ?? "";
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const result = await authService.requestPasswordReset(normalizedEmail);
      // Pesan dibuat generik agar alamat email terdaftar tidak dapat ditebak.
      setSubmitted(true);
      if (result.demoToken) {
        window.setTimeout(() => {
          navigateToHashRoute(
            `/atur-ulang-sandi?token=${encodeURIComponent(result.demoToken ?? "")}`,
          );
        }, 600);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Instruksi pemulihan belum dapat dikirim. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <RecoveryShell variant="forgot" visual={<RecoverySecurityCard variant="forgot" />}>
        <div className="recovery-brand">Mahreen Indonesia</div>
        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <div className="recovery-reveal" style={{ "--recovery-delay": "80ms" } as React.CSSProperties}>
            <h1 className="recovery-title">Lupa Kata Sandi</h1>
            <p className="recovery-subtitle">Jangan khawatir, masukkan email Anda dan kami akan mengirimkan instruksi pemulihan ke alamat terdaftar Anda.</p>
          </div>
          <label className="recovery-field recovery-reveal" htmlFor="recovery-email" style={{ "--recovery-delay": "160ms" } as React.CSSProperties}>
            <span className="recovery-label">Alamat Email</span>
            <span className="recovery-input-shell">
              <span className="recovery-input-icon" aria-hidden="true"><Mail size={18} /></span>
              <input id="recovery-email" className="recovery-input" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="email@perusahaan.com" autoComplete="email" required />
            </span>
          </label>
          {error && <p className="recovery-feedback recovery-feedback--error" role="alert">{error}</p>}
          {submitted && <p className="recovery-feedback" role="status"><CircleCheck size={18} aria-hidden="true" />Jika email terdaftar, tautan pemulihan akan dikirim. Periksa inbox dan folder spam Anda.</p>}
          <div className="recovery-reveal" style={{ "--recovery-delay": "240ms" } as React.CSSProperties}>
            <button className="recovery-button" type="submit" disabled={submitting || submitted}>{submitting ? "Mengirim…" : submitted ? "Instruksi Dikirim" : "Kirim Instruksi Pemulihan"}</button>
            <button className="recovery-back" type="button" onClick={() => navigateToHashRoute("/login")}><ArrowLeft size={16} aria-hidden="true" />Kembali ke Login</button>
          </div>
        </form>
      </RecoveryShell>
      <div className="recovery-tail recovery-tail--closing"><ClosingSection /></div>
      <div className="recovery-tail recovery-tail--footer"><Footer /></div>
    </>
  );
};
export default ForgotPassword;
