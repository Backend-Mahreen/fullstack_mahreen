import type { ReactNode } from "react";
import { FileClock, LockKeyhole, ShieldCheck } from "lucide-react";
import mahreenLogo from "../../assets/Navbar/mahreen-logo.png";
import adminSecureAuthCss from "./AdminSecureAuth.css?inline";

type AdminAuthShellProps = Readonly<{
  children: ReactNode;
  variant: "login" | "recovery";
}>;

const AdminAuthShell = ({ children, variant }: AdminAuthShellProps) => {
  const isRecovery = variant === "recovery";

  return (
    <>
      <style>{adminSecureAuthCss}</style>
      <main className={`admin-secure-auth admin-secure-auth--${variant}`}>
        {isRecovery ? (
          <header className="admin-secure-auth__topbar">
            <a href="/" className="admin-secure-auth__wordmark">Mahreen Indonesia</a>
            <span className="admin-secure-auth__topbar-divider" />
            <span className="admin-secure-auth__topbar-node"><ShieldCheck size={9} /> Secure Node</span>
            <span className="admin-secure-auth__topbar-actions" aria-label="Status keamanan">
              <ShieldCheck size={13} />
              <LockKeyhole size={13} />
            </span>
          </header>
        ) : null}

        <section className="admin-secure-auth__visual" aria-label="Mahreen Enterprise Command Center">
          {!isRecovery ? (
            <a className="admin-secure-auth__logo" href="/" aria-label="Kembali ke Mahreen Indonesia">
              <img src={mahreenLogo} alt="Mahreen Indonesia" width="150" height="48" />
            </a>
          ) : null}

          <div className="admin-secure-auth__hero">
            <span className="admin-secure-auth__node-badge">
              <i aria-hidden="true" />
              {isRecovery ? "Encryption Active" : "Secure Node: Alpha-01"}
            </span>
            {isRecovery ? (
              <>
                <h1>Credential <strong>Recovery</strong></h1>
                <p>
                  Accessing the Mahreen corporate mainframe requires multi-factor verification.
                  If you have lost your credentials, follow the protocol to re-establish secure access.
                </p>
                <div className="admin-secure-auth__protocols">
                  <article>
                    <ShieldCheck size={15} />
                    <strong>AES-256 Protocol</strong>
                    <span>All recovery requests are logged and encrypted.</span>
                  </article>
                  <article>
                    <FileClock size={15} />
                    <strong>Audit Trail</strong>
                    <span>Successive failed attempts will trigger a node lockout.</span>
                  </article>
                </div>
              </>
            ) : (
              <>
                <h1>Enterprise <strong>Command Center</strong></h1>
                <p>
                  Access the sovereign administrative infrastructure of Mahreen Indonesia.
                  Authorized personnel only.
                </p>
              </>
            )}
          </div>

          {!isRecovery ? (
            <div className="admin-secure-auth__metrics" aria-label="Status sistem lokal">
              <span><small>Latency</small><strong>12ms</strong></span>
              <span><small>Uptime</small><strong>99.99%</strong></span>
              <span><small>Nodes</small><strong>Active</strong></span>
            </div>
          ) : null}
        </section>

        <section className="admin-secure-auth__panel">
          {children}
        </section>

        {isRecovery ? (
          <footer className="admin-secure-auth__footer">
            <a href="/" className="admin-secure-auth__footer-brand">Mahreen</a>
            <span>© 2026 Mahreen Indonesia. Secure Enterprise Portal.</span>
            <nav aria-label="Tautan kebijakan Admin">
              <a href="/kebijakan-privasi">Privacy Policy</a>
              <a href="/syarat-ketentuan">Security Protocol</a>
              <span>System Status</span>
            </nav>
          </footer>
        ) : null}
      </main>
    </>
  );
};

export default AdminAuthShell;
