import { useEffect, type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getLoginRedirectRoute } from "../../services/auth/authNavigation";
import type { AccountRole } from "../../types/auth";
import { navigateToHashRoute } from "../../utils/hashNavigation";

const RedirectingState = ({ label }: Readonly<{ label: string }>) => (
  <main
    aria-live="polite"
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#050505",
      color: "#d8b66f",
      fontFamily: "Inter, sans-serif",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      fontSize: 14,
    }}
  >
    {label}
  </main>
);

const AccessDeniedState = ({ role, targetPath }: Readonly<{ role: AccountRole; targetPath: string }>) => {
  const loginRoute = getLoginRedirectRoute(targetPath).split("?")[0];

  return (
  <main
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "#050505",
      color: "#f2ede5",
      fontFamily: "Inter, sans-serif",
      textAlign: "center",
    }}
  >
    <div style={{ width: "min(100%, 520px)", padding: 36, border: "1px solid rgba(216,182,111,.25)", borderRadius: 18, background: "#0d0d0d" }}>
      <p style={{ margin: 0, color: "#d8b66f", fontSize: 14, letterSpacing: ".12em" }}>AKSES DIBATASI</p>
      <h1 style={{ margin: "14px 0", fontFamily: "Georgia, serif", fontWeight: 400 }}>Portal ini membutuhkan peran berbeda.</h1>
      <p style={{ color: "#999" }}>Akun aktif memiliki peran <strong>{role}</strong>. Masuk dengan akun yang sesuai untuk membuka portal ini.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <a href={loginRoute} style={{ padding: "11px 18px", borderRadius: 999, background: "#d8b66f", color: "#111", textDecoration: "none", fontWeight: 700 }}>Ganti Akun</a>
        <a href="/akun" style={{ padding: "11px 18px", border: "1px solid rgba(255,255,255,.18)", borderRadius: 999, color: "#fff", textDecoration: "none" }}>Client Portal</a>
      </div>
    </div>
  </main>
  );
};

const ProtectedRoute = ({
  children,
  targetPath,
  allowedRoles,
}: Readonly<{ children: ReactNode; targetPath: string; allowedRoles?: readonly AccountRole[] }>) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigateToHashRoute(getLoginRedirectRoute(targetPath));
    }
  }, [isAuthenticated, isLoading, targetPath]);

  if (isLoading) return <RedirectingState label="Memeriksa sesi..." />;
  if (!isAuthenticated || !user) return <RedirectingState label="Mengarahkan ke halaman login..." />;
  if (allowedRoles && !allowedRoles.includes(user.role ?? "client")) {
    return <AccessDeniedState role={user.role ?? "client"} targetPath={targetPath} />;
  }
  return children;
};

export default ProtectedRoute;
