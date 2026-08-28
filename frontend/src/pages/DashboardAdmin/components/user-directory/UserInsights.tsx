import { AlertTriangle, ChartNoAxesColumnIncreasing, History, PieChart } from "lucide-react";

type RoleBreakdownItem = { role: string; count: number };
type GrowthItem = { month: string; count: number };

type UserInsightsProps = Readonly<{
  onAuditOpen: () => void;
  onSecurityReview: () => void;
  roleBreakdown: RoleBreakdownItem[];
  monthlyGrowth: GrowthItem[];
  totalUsers: number;
}>;

const roleLabel = (role: string): string => {
  const normalized = role.trim().toLowerCase();
  if (normalized === "superadmin") return "Superadmin";
  if (normalized === "admin") return "Admin";
  if (normalized === "intern") return "Intern";
  if (normalized === "client") return "Client";
  return role || "Lainnya";
};

const UserInsights = ({
  onAuditOpen,
  onSecurityReview,
  roleBreakdown,
  monthlyGrowth,
  totalUsers,
}: UserInsightsProps) => {
  const totalBreakdown = roleBreakdown.reduce((sum, item) => sum + item.count, 0);
  const maxGrowth = monthlyGrowth.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <aside className="user-directory-insights" aria-label="User insights">
      <section className="user-insight-card user-directory-enter" style={{ "--user-delay": "300ms" } as React.CSSProperties}>
        <h2><PieChart size={16} /> Role Distribution</h2>
        {roleBreakdown.length ? (
          <div className="user-role-list">
            {roleBreakdown.slice(0, 5).map((role, index) => {
              const percentage = totalBreakdown > 0 ? Math.round((role.count / totalBreakdown) * 100) : 0;
              return (
                <div key={role.role}>
                  <span><small>{roleLabel(role.role)}</small><b>{percentage}%</b></span>
                  <i><em style={{ "--role-width": `${percentage}%`, "--role-delay": `${index * 80}ms` } as React.CSSProperties} /></i>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="user-insight-empty">Belum ada data distribusi peran.</p>
        )}
        <button className="user-link-button" type="button" onClick={onAuditOpen}>View full report</button>
      </section>

      <section className="user-insight-card user-directory-enter" style={{ "--user-delay": "360ms" } as React.CSSProperties}>
        <h2><ChartNoAxesColumnIncreasing size={16} /> Growth Trends</h2>
        {monthlyGrowth.length ? (
          <div className="user-growth-chart" aria-label="Pertumbuhan pengguna per bulan">
            {monthlyGrowth.slice(-7).map((item, index) => {
              const height = maxGrowth > 0 ? Math.max(8, Math.round((item.count / maxGrowth) * 100)) : 0;
              return <i key={`${item.month}-${index}`} style={{ "--growth-height": `${height}%`, "--growth-delay": `${index * 75}ms` } as React.CSSProperties} />;
            })}
          </div>
        ) : (
          <p className="user-insight-empty">Belum ada data pertumbuhan.</p>
        )}
        <div className="user-growth-meta">
          <span>{monthlyGrowth.length ? monthlyGrowth[monthlyGrowth.length - 1].month : "—"}</span>
          <b>{monthlyGrowth.length ? `+${monthlyGrowth[monthlyGrowth.length - 1].count}` : "0"}</b>
        </div>
      </section>

      <section className="user-security-card user-directory-enter" style={{ "--user-delay": "420ms" } as React.CSSProperties}>
        <h2><AlertTriangle size={17} /> Security Audit</h2>
        <p><strong>{totalUsers || 0} accounts</strong> terdaftar di direktori. Tinjauan manual diperlukan untuk akun yang disuspend atau mencurigakan.</p>
        <button type="button" onClick={onSecurityReview}>Review Security Logs</button>
      </section>

      <button className="user-audit-button user-directory-enter" style={{ "--user-delay": "480ms" } as React.CSSProperties} type="button" onClick={onAuditOpen}>
        <History size={18} /> Audit Log
      </button>
    </aside>
  );
};

export default UserInsights;
