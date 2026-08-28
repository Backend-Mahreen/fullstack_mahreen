import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import {
  clientSecurityRepository,
  createClientSecurityExport,
  type ClientSecuritySnapshot,
} from "../../../services/security/clientSecurityRepository";
import { navigateToRoute } from "../../../utils/hashNavigation";
import ActiveSessionsCard from "./components/ActiveSessionsCard";
import LoginActivityCard from "./components/LoginActivityCard";
import PasswordSecurityCard from "./components/PasswordSecurityCard";
import PrivacyDataCard from "./components/PrivacyDataCard";
import TwoFactorCard from "./components/TwoFactorCard";
import "./ClientSecurityPage.css";

const ClientSecurityPage = () => {
  const { user, session } = useAuth();
  const [snapshot, setSnapshot] = useState<ClientSecuritySnapshot | null>(() =>
    user ? clientSecurityRepository.getSnapshot(user.id) : null,
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!user || !session) return;
    const refresh = () => setSnapshot(clientSecurityRepository.getSnapshot(user.id));
    const unsubscribe = clientSecurityRepository.subscribe(refresh);
    clientSecurityRepository.recordSuccessfulLogin(user, session);
    return unsubscribe;
  }, [session, user]);

  if (!user || !snapshot) return null;

  const updatePreferences = (
    patch: Parameters<typeof clientSecurityRepository.updatePreferences>[1],
    message: string,
  ) => {
    setSnapshot(clientSecurityRepository.updatePreferences(user.id, patch));
    setFeedback(message);
  };

  const handleExport = () => {
    const data = createClientSecurityExport(user, snapshot);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mahreen-account-${user.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback("Data akun lokal berhasil disiapkan untuk diunduh.");
  };

  return (
    <ClientAccountLayout activeItem="security" className="client-security-page">
      <div className="client-security-content">
        <header className="client-security-header">
          <h1>Security Settings</h1>
          <p>
            Kelola keamanan akun dan preferensi privasi Anda untuk melindungi
            aset digital Mahreen.
          </p>
        </header>

        {feedback ? (
          <p className="client-security-feedback" role="status">{feedback}</p>
        ) : null}

        <div className="client-security-grid">
          <div className="client-security-grid__main">
            <PasswordSecurityCard
              onChangePassword={() => navigateToRoute("/akun/security/ubah-kata-sandi")}
            />
            <ActiveSessionsCard
              sessions={snapshot.sessions}
              onLogoutSession={(sessionId) => {
                setSnapshot(clientSecurityRepository.removeSession(user.id, sessionId));
                setFeedback("Sesi perangkat berhasil diakhiri.");
              }}
              onLogoutOtherSessions={() => {
                setSnapshot(clientSecurityRepository.removeOtherSessions(user.id));
                setFeedback("Semua sesi perangkat lain berhasil diakhiri.");
              }}
            />
            <LoginActivityCard records={snapshot.loginActivity} />
          </div>

          <aside className="client-security-grid__side" aria-label="Pengaturan tambahan">
            <TwoFactorCard
              enabled={snapshot.preferences.twoFactorEnabled}
              method={snapshot.preferences.twoFactorMethod}
              onConfigure={() => navigateToRoute("/akun/security/2fa")}
            />
            <PrivacyDataCard
              profileVisible={snapshot.preferences.profileVisible}
              onProfileVisibilityChange={(profileVisible) => updatePreferences(
                { profileVisible },
                "Preferensi visibilitas profil berhasil disimpan.",
              )}
              onExport={handleExport}
            />
          </aside>
        </div>
      </div>
    </ClientAccountLayout>
  );
};

export default ClientSecurityPage;
