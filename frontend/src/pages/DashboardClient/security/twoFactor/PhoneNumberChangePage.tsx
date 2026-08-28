import { ArrowLeft, ArrowRight, Check, LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import InternationalPhoneInput from "../../../../components/Form/InternationalPhoneInput";
import ClientAccountLayout from "../../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../../hooks/useAuth";
import {
  clientTwoFactorService,
  maskSecurityPhone,
} from "../../../../services/security/clientTwoFactorService";
import { navigateToRoute } from "../../../../utils/hashNavigation";
import PhoneChangeStepper from "./PhoneChangeStepper";
import PhoneSecurityAside from "./PhoneSecurityAside";
import "../TwoFactorSecurity.css";

type PhoneNumberChangePageProps = Readonly<{
  step: 1 | 2 | 3;
}>;

const PhoneNumberChangePage = ({ step }: PhoneNumberChangePageProps) => {
  const { user } = useAuth();
  const initialSettings = useMemo(
    () => (user ? clientTwoFactorService.getInitial(user) : null),
    [user],
  );
  const [verificationMethod, setVerificationMethod] = useState<"otp" | "password">("otp");
  const [phoneInput, setPhoneInput] = useState("");
  const [error, setError] = useState("");

  if (!user || !initialSettings) return null;

  const goToNewNumber = () => navigateToRoute("/akun/security/ubah-nomor/nomor-baru");
  const goBackToTwoFactor = () => navigateToRoute("/akun/security/2fa");
  const goBackToSecurity = () => navigateToRoute("/akun/security");

  const submitNewNumber = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      clientTwoFactorService.updatePhone(user, phoneInput);
      navigateToRoute("/akun/security/ubah-nomor/selesai");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Nomor telepon belum valid.");
    }
  };

  return (
    <ClientAccountLayout activeItem="security" className="twofa-account-page">
      <div className="phone-change-shell">
        <header className="phone-change-header twofa-reveal">
          <button type="button" onClick={goBackToTwoFactor}><ArrowLeft aria-hidden="true" /> Kembali ke Keamanan</button>
          <h1>Ubah Nomor Telepon</h1>
          <p>Demi keamanan akun Anda, penggantian nomor telepon memerlukan verifikasi identitas melalui nomor lama atau kata sandi utama.</p>
        </header>

        <PhoneChangeStepper step={step} />

        <div className="phone-change-grid">
          <div className="phone-change-main">
            {step === 1 ? (
              <section className="phone-verify-card twofa-reveal" style={{ "--twofa-delay": "90ms" } as React.CSSProperties}>
                <header>
                  <div><h2>Verifikasi Identitas</h2><p>Langkah awal untuk memastikan bahwa ini memang Anda.</p></div>
                  <ShieldCheck aria-hidden="true" />
                </header>
                <div className="phone-current-number">
                  <MessageSquareText aria-hidden="true" />
                  <div><small>NOMOR TERDAFTAR SAAT INI</small><strong>{maskSecurityPhone(initialSettings.phoneNumber)}</strong></div>
                  <span>TERVERIFIKASI</span>
                </div>
                <small className="phone-field-label">Pilih Metode Verifikasi</small>
                <button
                  className={"phone-verification-option" + (verificationMethod === "otp" ? " is-selected" : "")}
                  type="button"
                  onClick={() => setVerificationMethod("otp")}
                >
                  <MessageSquareText aria-hidden="true" />
                  <span><strong>Kirim OTP ke Nomor Lama</strong><small>Kode 6-digit akan dikirimkan melalui SMS.</small></span>
                  <i />
                </button>
                <button
                  className={"phone-verification-option" + (verificationMethod === "password" ? " is-selected" : "")}
                  type="button"
                  onClick={() => setVerificationMethod("password")}
                >
                  <LockKeyhole aria-hidden="true" />
                  <span><strong>Gunakan Kata Sandi Utama</strong><small>Verifikasi menggunakan password akun Mahreen Anda.</small></span>
                  <i />
                </button>
                <button className="phone-primary-action" type="button" onClick={goToNewNumber}>
                  Kirim Kode Verifikasi
                </button>
                <p className="phone-support-note">Tidak memiliki akses ke nomor lama? <a href="mailto:info@mahreenindonesia.com">Hubungi Tim Mahreen</a></p>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="phone-new-number twofa-reveal" style={{ "--twofa-delay": "90ms" } as React.CSSProperties}>
                <h2>Masukkan Nomor Telepon Baru</h2>
                <p>Pastikan nomor ini aktif dan dapat menerima pesan SMS atau WhatsApp untuk proses verifikasi selanjutnya.</p>
                <form onSubmit={submitNewNumber}>
                  <label htmlFor="new-phone-number">NOMOR TELEPON</label>
                  <InternationalPhoneInput
                    id="new-phone-number"
                    className="phone-number-field"
                    autoComplete="tel"
                    value={phoneInput}
                    onChange={setPhoneInput}
                    placeholder="812 3456 7890"
                    required
                    invalid={Boolean(error)}
                    describedBy={error ? "new-phone-number-error" : undefined}
                  />
                  {error ? <p id="new-phone-number-error" className="phone-form-error" role="alert">{error}</p> : null}
                  <button className="phone-primary-action" type="submit">
                    Kirim Kode Verifikasi <ArrowRight aria-hidden="true" />
                  </button>
                </form>
                <div className="phone-encryption-note"><ShieldCheck aria-hidden="true" />Data Anda akan diamankan dengan enkripsi end-to-end Mahreen Shield.</div>
              </section>
            ) : null}

            {step === 3 ? (
              <section className="phone-success twofa-reveal" style={{ "--twofa-delay": "90ms" } as React.CSSProperties}>
                <div className="phone-success__icon"><Check aria-hidden="true" /></div>
                <h2>Nomor Telepon Berhasil Diperbarui</h2>
                <p>Nomor baru Anda <strong>{maskSecurityPhone(initialSettings.phoneNumber)}</strong> kini aktif sebagai metode verifikasi utama Anda.</p>
                <div className="phone-success__status">
                  <ShieldCheck aria-hidden="true" />
                  <span><small>STATUS KEAMANAN</small><strong>Optimal</strong></span>
                  <b>• Terverifikasi</b>
                </div>
                <button className="phone-primary-action phone-success__back" type="button" onClick={goBackToSecurity}>
                  Kembali ke Keamanan <ArrowRight aria-hidden="true" />
                </button>
              </section>
            ) : null}
          </div>

          <PhoneSecurityAside />
        </div>
      </div>
    </ClientAccountLayout>
  );
};

export default PhoneNumberChangePage;
