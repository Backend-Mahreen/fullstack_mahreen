import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { env } from "../../config/env";
import { LOCAL_ADMIN_CREDENTIALS } from "../../services/auth/authConstants";
import { navigateToHashRoute } from "../../utils/hashNavigation";
import AdminAuthShell from "./AdminAuthShell";

const resolveAdminEmail = (administratorId: string) => {
  const normalized = administratorId.trim();
  return normalized.toUpperCase() === LOCAL_ADMIN_CREDENTIALS.id
    ? LOCAL_ADMIN_CREDENTIALS.email
    : normalized.toLowerCase();
};

const getSafeAdminRedirect = (value: string | null): string => {
  if (
    !value ||
    !value.startsWith("/admin") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("#")
  ) {
    return "/admin";
  }
  return value;
};

const AdminLogin = () => {
  const { isAuthenticated, user, loginAdmin, logout } = useAuth();
  const [administratorId, setAdministratorId] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const authRequired = searchParams.get("required") === "1";
  const redirectTarget = getSafeAdminRedirect(searchParams.get("redirect"));

  useEffect(() => {
    if (isAuthenticated && (user?.role === "admin" || user?.role === "superadmin")) {
      navigateToHashRoute(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, user?.role, redirectTarget]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await loginAdmin({
        email: resolveAdminEmail(administratorId),
        password: securityKey,
        remember,
      });

      if (result.user.role !== "admin" && result.user.role !== "superadmin") {
        await logout();
        throw new Error("Akun ini tidak memiliki otorisasi untuk Enterprise Command Center.");
      }

      setAccessGranted(true);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 480));
      navigateToHashRoute(redirectTarget, { replace: true });
    } catch (caughtError) {
      setAccessGranted(false);
      const message = caughtError instanceof Error ? caughtError.message : "Secure access tidak dapat diverifikasi.";
      setError(
        message.includes("Email atau kata sandi")
          ? "Administrator ID atau Security Key tidak sesuai."
          : message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthShell variant="login">
      <div className="admin-secure-login">
        <div className="admin-secure-login__heading admin-auth-reveal" style={{ "--admin-auth-delay": "80ms" } as React.CSSProperties}>
          <span className="admin-secure-login__shield"><ShieldCheck size={21} /></span>
          <h1>Admin Secure Login</h1>
          <p>Identity verification required for system access.</p>
        </div>

        {authRequired ? (
          <p className="admin-secure-login__notice admin-auth-reveal" role="status">
            <LockKeyhole size={13} /> Secure authentication is required to continue.
          </p>
        ) : null}

        <form className="admin-secure-login__form" onSubmit={handleSubmit}>
          <label className="admin-secure-field admin-auth-reveal" style={{ "--admin-auth-delay": "150ms" } as React.CSSProperties}>
            <span>Administrator ID</span>
            <span className="admin-secure-input">
              <BriefcaseBusiness size={15} aria-hidden="true" />
              <input
                value={administratorId}
                onChange={(event) => { setAdministratorId(event.target.value); setError(""); }}
                placeholder="Enter identification code"
                autoComplete="username"
                spellCheck={false}
                required
              />
            </span>
          </label>

          <label className="admin-secure-field admin-auth-reveal" style={{ "--admin-auth-delay": "220ms" } as React.CSSProperties}>
            <span className="admin-secure-field__inline">
              <span>Security Key</span>
              <a href="/admin/forgot-credentials">Forgot credentials?</a>
            </span>
            <span className="admin-secure-input">
              <KeyRound size={15} aria-hidden="true" />
              <input
                type={showSecurityKey ? "text" : "password"}
                value={securityKey}
                onChange={(event) => { setSecurityKey(event.target.value); setError(""); }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowSecurityKey((current) => !current)}
                aria-label={showSecurityKey ? "Hide Security Key" : "Show Security Key"}
              >
                {showSecurityKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          <label className="admin-secure-remember admin-auth-reveal" style={{ "--admin-auth-delay": "290ms" } as React.CSSProperties}>
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <i aria-hidden="true"><b /></i>
            <span>Remember this device for 30 days</span>
          </label>

          {error ? <p className="admin-secure-feedback is-error" role="alert">{error}</p> : null}
          {accessGranted ? <p className="admin-secure-feedback is-success" role="status"><ShieldCheck size={14} /> Identity verified. Opening secure node…</p> : null}

          <button className="admin-secure-submit admin-auth-reveal" style={{ "--admin-auth-delay": "340ms" } as React.CSSProperties} type="submit" disabled={submitting || accessGranted}>
            <span>{submitting ? "Verifying Identity" : "Access System"}</span>
            {submitting ? <LoaderCircle className="is-spinning" size={18} /> : <ArrowRight size={18} />}
          </button>
        </form>

        <div className="admin-secure-login__trust admin-auth-reveal" style={{ "--admin-auth-delay": "410ms" } as React.CSSProperties}>
          <div>
            <span><ShieldCheck size={10} /> Mahreen Security Ecosystem</span>
            <span><LockKeyhole size={10} /> Secure Session</span>
          </div>
          <p>
            {env.dataSourceMode === "local"
              ? "Local secure simulation active. Access attempts are recorded in this browser."
              : "Authentication and access policies are enforced by the production backend."}
          </p>
        </div>
      </div>
    </AdminAuthShell>
  );
};

export default AdminLogin;
