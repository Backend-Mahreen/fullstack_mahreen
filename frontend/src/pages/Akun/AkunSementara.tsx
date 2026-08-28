import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import AuthTheme from "../Auth/AuthShell";
import { useAuth } from "../../hooks/useAuth";
import { navigateToRoute } from "../../utils/hashNavigation";

const accountTypeLabels = {
  individual: "Individu",
  company: "Perusahaan",
  community: "Komunitas",
} as const;

const AkunSementara = () => {
  const { session, user: account, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigateToRoute("/login");
  };

  if (!session || !account) {
    return (
      <>
        <Navbar />
        <AuthTheme>
          <main className="auth-global-page">
            <section className="auth-stage auth-stage--compact">
              <div className="auth-card auth-account-card" style={{ textAlign: "center" }}>
                <span className="auth-section-icon" style={{ margin: "0 auto 18px" }}><ShieldCheck size={20} /></span>
                <h1 className="auth-title">Sesi Belum Aktif</h1>
                <p className="auth-lead" style={{ marginInline: "auto" }}>Masuk terlebih dahulu untuk melihat dashboard akun sementara.</p>
                <div className="auth-actions" style={{ justifyContent: "center" }}>
                  <a className="auth-button auth-button--primary" href="/login">Masuk ke Akun</a>
                </div>
              </div>
            </section>
          </main>
        </AuthTheme>
        <ClosingSection />
        <Footer />
      </>
    );
  }

  const initials = account.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <>
      <Navbar />
      <AuthTheme>
        <main className="auth-global-page">
          <section className="auth-stage auth-stage--compact">
            <div className="auth-card auth-account-card">
              <div className="auth-account-hero">
                <div className="auth-account-avatar">
                  {account.profilePhoto ? <img decoding="async" src={account.profilePhoto} alt={account.fullName} /> : initials || <UserRound size={30} />}
                </div>
                <p className="auth-kicker">Mahreen Unified Account</p>
                <h1 className="auth-title">Selamat datang, {account.nickname || account.fullName}</h1>
                <p className="auth-lead" style={{ marginInline: "auto" }}>Akun frontend sementara berhasil aktif pada browser ini.</p>
              </div>

              <div className="auth-summary-grid">
                <div className="auth-summary-item"><span>Nama Lengkap</span><strong>{account.fullName}</strong></div>
                <div className="auth-summary-item"><span>Tipe Akun</span><strong>{accountTypeLabels[account.accountType]}</strong></div>
                <div className="auth-summary-item"><span>Email</span><strong>{account.email}</strong></div>
                <div className="auth-summary-item"><span>Institusi</span><strong>{account.institution || "Belum diisi"}</strong></div>
                <div className="auth-summary-item"><span>Pekerjaan</span><strong>{account.jobTitle || "Belum diisi"}</strong></div>
                <div className="auth-summary-item"><span>ID Akun</span><strong>{account.id}</strong></div>
              </div>

              <div className="auth-divider" />
              <div className="auth-summary-item">
                <span>Minat Layanan</span>
                <div className="auth-chip-row">
                  {account.interests.length > 0
                    ? account.interests.map((interest) => <span className="auth-chip" key={interest}>{interest}</span>)
                    : <span className="auth-chip">Belum dipilih</span>}
                </div>
              </div>

              <div className="auth-actions">
                <a className="auth-button" href="/">Kembali ke Beranda</a>
                <button className="auth-button auth-button--primary" type="button" onClick={handleLogout}><LogOut size={16} /> Keluar</button>
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

export default AkunSementara;
