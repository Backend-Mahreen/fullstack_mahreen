import { useEffect, useState, type CSSProperties } from "react";
import { Clock3, Radio } from "lucide-react";
import { adminWorkspaceRepository } from "../../../services/admin/adminWorkspaceRepository";
import type { AdminModuleKey } from "../types";
import AdminAnalyticsPanels from "./AdminAnalyticsPanels";
import AdminMetricCard from "./AdminMetricCard";
import AdminProgramPanels from "./AdminProgramPanels";
import AdminQuickActions from "./AdminQuickActions";
import RecentTransactions from "./RecentTransactions";
import SystemActivity from "./SystemActivity";

const getJakartaTime = () => new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
}).format(new Date());

type AdminOverviewProps = Readonly<{
  onSelect: (module: AdminModuleKey) => void;
  query: string;
}>;

const AdminOverview = ({ onSelect, query }: AdminOverviewProps) => {
  const [currentTime, setCurrentTime] = useState(getJakartaTime);
  const [snapshot, setSnapshot] = useState(() => adminWorkspaceRepository.getOverviewSnapshot());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(getJakartaTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const refresh = () => setSnapshot(adminWorkspaceRepository.getOverviewSnapshot());
    return adminWorkspaceRepository.subscribe(refresh);
  }, []);

  return (
    <>
      <section className="admin-command-heading admin-animate" style={{ "--admin-delay": "20ms" } as CSSProperties}>
        <div>
          <span className="admin-command-heading__eyebrow">Mahreen Indonesia · Administration</span>
          <h1>Mahreen Command Center</h1>
          <p>Ecosystem synchronization complete. Visualize real-time telemetry across all operational verticals.</p>
        </div>
        <div className="admin-command-heading__status" aria-label={`Sistem aktif, waktu ${currentTime} GMT+7`}>
          <span><Radio size={12} aria-hidden="true" /> System Live</span>
          <strong><Clock3 size={12} aria-hidden="true" /> {currentTime}<small>GMT+7</small></strong>
        </div>
      </section>

      <section className="admin-metrics-grid" aria-label="Metrik utama">
        {snapshot.metrics.map((metric, index) => <AdminMetricCard key={metric.label} metric={metric} index={index} />)}
      </section>

      <AdminProgramPanels onSelect={onSelect} programs={snapshot.programs} />
      <AdminAnalyticsPanels
        distribution={snapshot.ecosystemDistribution}
        onSelect={onSelect}
        revenueChart={snapshot.revenueChart}
      />

      <section className="admin-operations-grid" aria-label="Transaksi dan aktivitas sistem">
        <RecentTransactions query={query} onSelect={onSelect} transactions={snapshot.transactions} />
        <SystemActivity activities={snapshot.activities} query={query} />
      </section>

      <AdminQuickActions onSelect={onSelect} />
    </>
  );
};

export default AdminOverview;
