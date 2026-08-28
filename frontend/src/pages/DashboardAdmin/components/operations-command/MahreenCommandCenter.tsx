import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Clock3,
  Download,
  Landmark,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  adminOperationsRepository,
  type CommandCenterSnapshot,
} from "../../../../services/admin/adminOperationsRepository";
import { formatIdr } from "../../../../utils/formatCurrency";

type MahreenCommandCenterProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const formatCompactIdr = (value: number) => {
  if (value >= 1_000_000_000) return `IDR ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `IDR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `IDR ${(value / 1_000).toFixed(1)}K`;
  return `IDR ${new Intl.NumberFormat("en-US").format(value)}`;
};

const toCoordinates = (values: number[]) => values.map((value, index) => {
  const x = 18 + index * (604 / Math.max(1, values.length - 1));
  const y = 248 - value * 2.85;
  return `${x},${y}`;
}).join(" ");

const MahreenCommandCenter = ({ query, onLocalAction }: MahreenCommandCenterProps) => {
  const [snapshot, setSnapshot] = useState<CommandCenterSnapshot>(() =>
    adminOperationsRepository.getCommandCenterSnapshot(),
  );
  const [pendingOnly, setPendingOnly] = useState(false);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const unsubscribe = adminOperationsRepository.subscribe(() => {
      setSnapshot(adminOperationsRepository.getCommandCenterSnapshot());
    });
    const interval = window.setInterval(() => setClock(new Date()), 1_000);
    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, []);

  const transactions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return snapshot.transactions.filter((transaction) => {
      const matchesQuery = !normalized || [transaction.id, transaction.division, transaction.client, transaction.method, transaction.status]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesQuery && (!pendingOnly || transaction.status === "Pending");
    });
  }, [pendingOnly, query, snapshot.transactions]);

  const actualPoints = toCoordinates(snapshot.actualRevenue);
  const forecastPoints = toCoordinates(snapshot.forecastRevenue);
  const actualArea = `18,248 ${actualPoints} 622,248`;

  const metrics = [
    { label: "Total Revenue", value: formatCompactIdr(snapshot.metrics.totalRevenue), note: `${snapshot.transactions.length} local records`, detail: "Current local month", Icon: Banknote },
    { label: "Avg Daily Revenue", value: formatCompactIdr(snapshot.metrics.averageDailyRevenue), note: "Calculated", detail: "From paid local activity", Icon: TrendingUp },
    { label: "Projected Month-End", value: formatCompactIdr(snapshot.metrics.projectedMonthEnd), note: "Local projection", detail: "", Icon: Sparkles },
    { label: "Profit Margin", value: `${snapshot.metrics.profitMargin}%`, note: "Awaiting cost data", detail: "No dummy cost assumption", Icon: Landmark },
  ];
  const currentMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(clock);
  const jakartaClock = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(clock);

  return (
    <section className="admin-feature-page admin-feature-enter admin-command-page" aria-labelledby="mahreen-command-title">
      <header className="admin-feature-heading">
        <div><span className="admin-feature-eyebrow">OPERATIONS · REAL-TIME TELEMETRY</span><h1 id="mahreen-command-title">Mahreen Command Center</h1><p>Ecosystem synchronization complete. Visualizing real-time telemetry across all operational verticals.</p></div>
        <div className="admin-feature-heading__controls"><span className="admin-feature-live"><i /> Local Sync Live</span><span className="admin-command-clock"><Clock3 size={15} />{jakartaClock}<br />GMT+7</span></div>
      </header>

      <div className="admin-feature-metrics admin-command-metrics">
        {metrics.map(({ label, value, note, detail, Icon }, index) => <article className="admin-feature-metric admin-command-metric" key={label} style={{ "--feature-delay": `${index * 65}ms` } as React.CSSProperties}><div className="admin-feature-metric__top"><Icon size={18} /><span>{note}</span></div><span>{label}</span><strong>{value}</strong>{detail ? <small>{detail}</small> : <i><b /></i>}</article>)}
      </div>

      <div className="admin-feature-grid admin-command-overview-grid">
        <article className="admin-feature-panel admin-command-chart-panel">
          <header className="admin-feature-panel__heading"><div><h2>Revenue vs Forecast</h2><p>Daily local activity for {currentMonth}</p></div><div className="admin-chart-legend"><span className="is-actual">Actual</span><span>Forecast</span></div></header>
          <div className="admin-command-line-chart">
            <svg viewBox="0 0 640 270" role="img" aria-label="Revenue versus forecast diagram">
              <defs><linearGradient id="command-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dfbd70" stopOpacity=".19" /><stop offset="100%" stopColor="#dfbd70" stopOpacity="0" /></linearGradient></defs>
              {[55, 110, 165, 220].map((y) => <line key={y} x1="18" x2="622" y1={y} y2={y} className="admin-line-chart__grid" />)}
              <polygon points={actualArea} fill="url(#command-area)" className="admin-line-chart__area" />
              <polyline points={forecastPoints} className="admin-command-line-chart__forecast" />
              <polyline points={actualPoints} className="admin-line-chart__line" />
            </svg>
            <div className="admin-command-line-chart__labels"><span>H-11</span><span>H-8</span><span>H-5</span><span>H-2</span><span>Today</span></div>
          </div>
        </article>

        <article className="admin-feature-panel admin-command-share-panel">
          <header className="admin-feature-panel__heading"><div><h2>Division Share</h2><p>Contribution by business vertical</p></div></header>
          <div className="admin-command-share-list">{snapshot.divisionShare.map((division, index) => <div key={division.label}><span><strong>{division.label}</strong><em>{division.value}%</em></span><i><b style={{ "--bar-value": `${division.value}%`, "--chart-delay": `${index * 90}ms` } as React.CSSProperties} /></i><small>{division.subtitle}</small></div>)}</div>
          <footer><span>Local Activity<strong>Synced across user flows</strong></span><b>{snapshot.transactions.length}</b></footer>
        </article>
      </div>

      <article className="admin-feature-panel admin-command-ledger">
        <header className="admin-feature-panel__heading"><div><h2>Transaction Ledger</h2><p>Real-time financial synchronization across all gateways</p></div><div><button type="button" className={pendingOnly ? "is-active" : ""} onClick={() => setPendingOnly((current) => !current)}><SlidersHorizontal size={15} /> Filter</button><button className="admin-feature-gold-button" type="button" onClick={() => onLocalAction("Laporan transaksi disiapkan dari penyimpanan lokal.")}><Download size={15} /> Export Report</button></div></header>
        <div className="admin-feature-table-scroll"><table className="admin-feature-table admin-command-table"><thead><tr><th>Transaction ID</th><th>Date</th><th>Division</th><th>Client/Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead><tbody>{transactions.map((transaction) => <tr key={transaction.id}><td><code>{transaction.id}</code></td><td>{transaction.date}</td><td><span className="admin-command-division">{transaction.division}</span></td><td><strong>{transaction.client}</strong></td><td><strong>{formatIdr(transaction.amount)}</strong></td><td>{transaction.method}</td><td><span className={`admin-command-status admin-command-status--${transaction.status.toLowerCase()}`}>{transaction.status}</span></td></tr>)}{transactions.length === 0 ? <tr><td colSpan={7}>Belum ada transaksi pengguna pada penyimpanan lokal.</td></tr> : null}</tbody></table></div>
        <footer className="admin-command-ledger__footer">Showing {transactions.length} of {snapshot.transactions.length} local transactions</footer>
      </article>
    </section>
  );
};

export default MahreenCommandCenter;
