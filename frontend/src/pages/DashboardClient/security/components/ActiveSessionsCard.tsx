import { Laptop, LogOut, Phone } from "lucide-react";
import type { ClientDeviceSession } from "../../../../services/security/clientSecurityRepository";
import { formatSecurityTime } from "../securityFormatting";

type ActiveSessionsCardProps = Readonly<{
  sessions: ClientDeviceSession[];
  onLogoutSession: (sessionId: string) => void;
  onLogoutOtherSessions: () => void;
}>;

const ActiveSessionsCard = ({
  sessions,
  onLogoutSession,
  onLogoutOtherSessions,
}: ActiveSessionsCardProps) => {
  const hasOtherSessions = sessions.some((session) => !session.current);

  return (
    <section className="client-security-card">
      <div className="client-security-sessions__header">
        <h2>Sesi Aktif</h2>
        <button
          type="button"
          disabled={!hasOtherSessions}
          onClick={onLogoutOtherSessions}
        >
          Logout dari Semua Perangkat
        </button>
      </div>
      <div className="client-security-sessions__list">
        {sessions.map((session) => (
          <article
            className={`client-security-session${session.current ? " is-current" : ""}`}
            key={session.id}
          >
            <div className="client-security-session__left">
              <span className="client-security-session__icon" aria-hidden="true">
                {session.type === "desktop" ? <Laptop /> : <Phone />}
              </span>
              <span className="client-security-session__info">
                <strong>{session.device} – {session.location}</strong>
                <small>
                  {session.browser || session.app} • {session.current
                    ? "Sedang Aktif"
                    : formatSecurityTime(session.lastActiveAt)}
                </small>
              </span>
            </div>
            {session.current ? (
              <span className="client-security-session__badge">CURRENT</span>
            ) : (
              <button
                className="client-security-session__logout"
                type="button"
                title="Tutup sesi"
                aria-label={`Tutup sesi ${session.device}`}
                onClick={() => onLogoutSession(session.id)}
              >
                <LogOut aria-hidden="true" />
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ActiveSessionsCard;
