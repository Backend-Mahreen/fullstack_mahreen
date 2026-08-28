import { useState } from "react";
import { Building2, LockKeyhole, Sparkles, UserRound, UsersRound } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Closing-section/Closing-section";
import Footer from "../../components/Footer/Footer";
import AuthTheme, { AuthProgress } from "../Auth/AuthShell";
import { registrationDraftService } from "../../services/auth/registrationDraftService";
import { navigateToHashRoute } from "../../utils/hashNavigation";
import type { AccountType } from "../../types/auth";


const daftarPageStyles = `
@keyframes registerCardShine {
  0% { transform: translateX(-130%) skewX(-18deg); }
  100% { transform: translateX(240%) skewX(-18deg); }
}

@keyframes registerSelectedPulse {
  0%, 100% { box-shadow: 0 18px 46px rgba(0, 0, 0, .34), 0 0 0 rgba(216, 182, 111, 0); }
  50% { box-shadow: 0 22px 58px rgba(0, 0, 0, .42), 0 0 30px rgba(216, 182, 111, .14); }
}

.register-account-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  margin-top: 34px;
}

.register-account-card {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-width: 0;
  min-height: 220px;
  overflow: hidden;
  border-radius: 14px;
  background:
    radial-gradient(circle at 84% 12%, rgba(216, 182, 111, .08), transparent 28%),
    linear-gradient(145deg, #171717 0%, #111 100%);
  transition:
    transform .32s cubic-bezier(.22, 1, .36, 1),
    border-color .32s ease,
    box-shadow .32s ease,
    background .32s ease;
}

.register-account-card::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -40%;
  left: -38%;
  width: 34%;
  height: 180%;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(239, 204, 128, .13), transparent);
  opacity: 0;
}

.register-account-card::after {
  content: "✓";
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid rgba(239, 204, 128, .55);
  border-radius: 50%;
  background: rgba(216, 182, 111, .11);
  color: #efcc80;
  font-size: 14px;
  font-weight: 800;
  opacity: 0;
  transform: scale(.72) rotate(-12deg);
  transition: opacity .24s ease, transform .32s cubic-bezier(.22, 1, .36, 1);
}

.register-account-card:hover {
  transform: translateY(-8px);
  border-color: rgba(239, 204, 128, .68);
  box-shadow: 0 24px 58px rgba(0, 0, 0, .42), 0 0 30px rgba(216, 182, 111, .1);
}

.register-account-card:hover::before {
  opacity: 1;
  animation: registerCardShine .72s ease-out both;
}

.register-account-card.is-selected {
  /* The base card reveal starts at opacity: 0. Setting opacity explicitly
     prevents the selected-state pulse animation from replacing the reveal
     animation and making the selected card disappear. */
  opacity: 1;
  visibility: visible;
  border-color: #d8b66f;
  background:
    radial-gradient(circle at 84% 12%, rgba(239, 204, 128, .18), transparent 34%),
    linear-gradient(145deg, rgba(216, 182, 111, .14), #151515 52%);
  box-shadow: 0 22px 58px rgba(0, 0, 0, .42), 0 0 30px rgba(216, 182, 111, .14);
  animation: registerSelectedPulse 3.2s ease-in-out infinite;
}

.register-account-card.is-selected::after {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.register-account-card .auth-choice-icon {
  transition: transform .32s cubic-bezier(.22, 1, .36, 1), box-shadow .32s ease, background .32s ease;
}

.register-account-card:hover .auth-choice-icon,
.register-account-card.is-selected .auth-choice-icon {
  transform: translateY(-2px) scale(1.08);
  background: rgba(216, 182, 111, .16);
  box-shadow: 0 0 22px rgba(216, 182, 111, .13);
}

.register-account-card h3,
.register-account-card p {
  position: relative;
  z-index: 1;
}

.register-account-card h3 {
  transition: color .25s ease, transform .25s ease;
}

.register-account-card:hover h3,
.register-account-card.is-selected h3 {
  color: #efcc80;
  transform: translateX(2px);
}

.register-story-panel {
  min-width: 0;
  padding-top: 4px;
}

.register-display-title {
  display: grid;
  gap: clamp(16px, 1.7vw, 26px);
  max-width: 100%;
  margin-top: 18px;
  font-size: clamp(48px, 5.25vw, 82px);
  line-height: 1.02;
  letter-spacing: -.035em;
}

.register-display-group {
  display: grid;
  gap: clamp(2px, .35vw, 8px);
}

.register-display-group > span {
  display: block;
}

.register-display-group--gold {
  color: var(--auth-gold-soft);
  font-weight: 600;
}

.register-story-panel > .auth-lead {
  margin-top: clamp(24px, 2.4vw, 36px);
}

@media (max-width: 1040px) {
  .register-display-title {
    font-size: clamp(44px, 6.3vw, 68px);
  }
}

@media (max-width: 720px) {
  .register-account-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 26px;
  }

  .register-account-card {
    min-height: 190px;
    padding: 16px 14px;
    border-radius: 12px;
  }

  .register-account-card::after {
    top: 11px;
    right: 11px;
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  .register-account-card .auth-choice-icon {
    width: 38px;
    height: 38px;
    margin-bottom: 14px;
  }

  .register-account-card h3 {
    font-size: 16px;
  }

  .register-account-card p {
    font-size: 14px;
    line-height: 1.5;
  }

  .register-display-title {
    gap: 12px;
    margin-top: 14px;
    font-size: clamp(42px, 12vw, 62px);
    line-height: 1.04;
  }
}

@media (max-width: 520px) {
  .register-account-grid {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: inline mandatory;
    scrollbar-width: thin;
    padding: 2px 2px 12px;
  }

  .register-account-card {
    scroll-snap-align: start;
  }

  .register-display-title {
    font-size: clamp(40px, 15vw, 56px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .register-account-card,
  .register-account-card::before,
  .register-account-card::after,
  .register-account-card .auth-choice-icon,
  .register-account-card h3 {
    animation: none !important;
    transition-duration: .01ms !important;
  }
}
`;

const identityOptions: readonly {
  id: AccountType;
  title: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    id: "individual",
    title: "Individu",
    description: "Akses personal ke seluruh ekosistem, investasi, pembelajaran, dan berita Mahreen.",
    icon: UserRound,
  },
  {
    id: "company",
    title: "Perusahaan",
    description: "Solusi korporasi untuk manajemen portofolio, layanan, dan kemitraan strategis.",
    icon: Building2,
  },
  {
    id: "community",
    title: "Komunitas",
    description: "Ruang kolaboratif untuk organisasi, komunitas, dan kolektif sosial Indonesia.",
    icon: UsersRound,
  },
];

const Daftar = () => {
  const initialDraft = registrationDraftService.load();
  const [selectedIdentity, setSelectedIdentity] = useState<AccountType | "">(
    initialDraft.accountType,
  );

  const handleContinue = () => {
    if (!selectedIdentity) return;
    registrationDraftService.save({ accountType: selectedIdentity });
    navigateToHashRoute("/daftar/informasi-dasar");
  };

  return (
    <>
      <style>{daftarPageStyles}</style>
      <Navbar />
      <AuthTheme>
        <main className="auth-global-page">
          <section className="auth-stage auth-two-column">
            <div>
              <AuthProgress current={1} label="Account Selection" />

              <div className="auth-inline">
                <div>
                  <h1 className="auth-title auth-title--sans">Choose your identity</h1>
                  <p className="auth-lead">
                    Pilih jenis akun yang paling sesuai. Setiap tipe memberikan pengalaman ekosistem yang disesuaikan.
                  </p>
                </div>
                <p className="auth-lead" style={{ margin: 0, fontSize: 14 }}>
                  Sudah memiliki akun? <a className="auth-login-link" href="/login">Login</a>
                </p>
              </div>

              <div className="auth-identity-grid register-account-grid">
                {identityOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = option.id === selectedIdentity;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`auth-choice-card register-account-card ${isSelected ? "is-selected" : ""}`}
                      onClick={() => setSelectedIdentity(option.id)}
                      aria-pressed={isSelected}
                    >
                      <span className="auth-choice-icon"><Icon size={20} /></span>
                      <h3>{option.title}</h3>
                      <p>{option.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="auth-actions">
                <a className="auth-button" href="/">× &nbsp;Batal</a>
                <button
                  className="auth-button auth-button--primary"
                  type="button"
                  disabled={!selectedIdentity}
                  onClick={handleContinue}
                >
                  Lanjut ke Step 2 <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <aside className="register-story-panel">
              <p className="auth-kicker">Mahreen Unified Account</p>
              <h2 className="auth-display-title register-display-title">
                <span className="register-display-group">
                  <span>One</span>
                  <span>Account.</span>
                </span>
                <strong className="register-display-group register-display-group--gold">
                  <span>Every</span>
                  <span>Experience.</span>
                </strong>
              </h2>
              <p className="auth-lead">
                Satu akses mulus menuju seluruh ekosistem digital Mahreen, dari layanan kreatif hingga program komunitas.
              </p>

              <div className="auth-feature-list">
                <div className="auth-feature-box">
                  <span className="auth-feature-icon"><LockKeyhole size={18} /></span>
                  <div><strong>Institutional Security</strong><span>Perlindungan akun berlapis untuk pengalaman yang lebih aman.</span></div>
                </div>
                <div className="auth-feature-box">
                  <span className="auth-feature-icon"><Sparkles size={18} /></span>
                  <div><strong>AI Personalization</strong><span>Preferensi layanan tersimpan dan dapat disesuaikan kapan saja.</span></div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </AuthTheme>
      <ClosingSection />
      <Footer />
    </>
  );
};

export default Daftar;