import { useMemo } from "react";
import ClientAccountLayout from "../../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../../hooks/useAuth";
import { authService } from "../../../../services/auth/authService";
import { clientSecurityRepository } from "../../../../services/security/clientSecurityRepository";
import { navigateToRoute } from "../../../../utils/hashNavigation";
import ChangePasswordForm from "./ChangePasswordForm";
import PasswordSecurityAside from "./PasswordSecurityAside";
import "./PasswordSecurity.css";

const ChangePasswordPage = () => {
  const { user } = useAuth();
  const activeSessions = useMemo(
    () => user ? clientSecurityRepository.getSnapshot(user.id).sessions.length : 0,
    [user],
  );

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="security" className="password-security-page">
      <div className="password-security-shell">
        <header className="password-change-heading password-change-reveal">
          <h1>Ubah Kata Sandi</h1>
          <p>
            Pastikan kata sandi Anda kuat dan unik untuk melindungi akses ke
            seluruh ekosistem Mahreen.
          </p>
        </header>

        <div className="password-change-grid">
          <div className="password-change-reveal" style={{ "--password-delay": "60ms" } as React.CSSProperties}>
            <ChangePasswordForm
              onSave={(currentPassword, newPassword) =>
                authService.changePassword(user.id, currentPassword, newPassword)
              }
              onCancel={() => navigateToRoute("/akun/security")}
            />
          </div>
          <PasswordSecurityAside activeSessions={Math.max(activeSessions, 1)} />
        </div>
      </div>
    </ClientAccountLayout>
  );
};

export default ChangePasswordPage;
