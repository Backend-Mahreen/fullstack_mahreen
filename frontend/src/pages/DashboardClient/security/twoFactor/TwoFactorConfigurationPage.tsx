import { useEffect, useMemo, useState } from "react";
import ClientAccountLayout from "../../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../../hooks/useAuth";
import {
  clientTwoFactorService,
  type ClientTwoFactorSettings,
} from "../../../../services/security/clientTwoFactorService";
import { navigateToRoute } from "../../../../utils/hashNavigation";
import ChangePhoneCard from "./ChangePhoneCard";
import CurrentMethodCard from "./CurrentMethodCard";
import RecoveryCodeCard from "./RecoveryCodeCard";
import SecurityScorePanel from "./SecurityScorePanel";
import "../TwoFactorSecurity.css";

const TwoFactorConfigurationPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ClientTwoFactorSettings | null>(() =>
    user ? clientTwoFactorService.getInitial(user) : null,
  );
  const [recoveryRevealed, setRecoveryRevealed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setSettings(clientTwoFactorService.getInitial(user));
    const unsubscribe = clientTwoFactorService.subscribe(refresh);
    void clientTwoFactorService.load(user).then(setSettings);
    return unsubscribe;
  }, [user]);

  const stableSettings = useMemo(
    () => settings ?? (user ? clientTwoFactorService.getInitial(user) : null),
    [settings, user],
  );

  if (!user || !stableSettings) return null;

  return (
    <ClientAccountLayout activeItem="security" className="twofa-account-page">
      <div className="twofa-shell">
        <header className="twofa-heading twofa-reveal">
          <h1>Konfigurasi Ulang Autentikasi 2 Faktor</h1>
          <p>
            Perbarui metode keamanan Anda untuk memastikan akses akun tetap
            terlindungi dengan standar enkripsi tertinggi Mahreen Indonesia.
          </p>
        </header>

        <div className="twofa-layout">
          <div className="twofa-main">
            <CurrentMethodCard phoneNumber={stableSettings.phoneNumber} />
            <ChangePhoneCard
              onChangePhone={() => navigateToRoute("/akun/security/ubah-nomor")}
            />
            <RecoveryCodeCard
              recoveryCode={stableSettings.recoveryCode}
              revealed={recoveryRevealed}
              onReveal={() => setRecoveryRevealed((current) => !current)}
              onRegenerate={() => {
                setSettings(clientTwoFactorService.rotateRecoveryCode(user));
                setRecoveryRevealed(true);
              }}
            />
          </div>
          <SecurityScorePanel />
        </div>
      </div>
    </ClientAccountLayout>
  );
};

export default TwoFactorConfigurationPage;
