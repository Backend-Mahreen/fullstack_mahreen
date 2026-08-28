import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UsersRound,
  Wallet,
} from "lucide-react";
import {
  adminAnalyticsRepository,
  type AdminAnalyticsSnapshot,
} from "../../../../services/admin/apiAdminAnalyticsRepository";

type AdminAnalyticsPageProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("id-ID").format(value);
};

const GrowthBadge = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span className={`admin-analytics-growth${isPositive ? " is-up" : " is-down"}`}>
      <Icon size={13} aria-hidden="true" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const AdminAnalyticsPage = ({ query, onLocalAction }: AdminAnalyticsPageProps) => {
  const [snapshot, setSnapshot] = useState<AdminAnalyticsSnapshot>(() =>
    adminAnalyticsRepository.getSnapshot(),
  );

  useEffect(() => {
    const unsubscribe = adminAnalyticsRepository.subscribe(() => {
      setSnapshot(adminAnalyticsRepository.getSnapshot());
    });
    return unsubscribe;
  }, []);

  const filteredTopPages = query.trim()
    ? snapshot.topPages.filter((page) =>
        [page.path, page.category].some((value) =>
          value.toLowerCase().includes(query.trim().toLowerCase()),
        ),
      )
    : snapshot.topPages;

  const maxTraffic = Math.max(1, ...snapshot.traffic.map((point) => point.pageViews));
  const maxFunnel = Math.max(1, ...snapshot.funnel.map((stage) => stage.count));

  const metrics = [
    { label: "Page Views", value: formatCompactNumber(snapshot.pageViews.current), note: `${snapshot.days} hari terakhir`, growth: snapshot.pageViews.changePercentage, Icon: Eye },
    { label: "Sessions", value: formatCompactNumber(snapshot.sessions.current), note: `${snapshot.sessions.total} total`, growth: snapshot.sessions.changePercentage, Icon: MousePointerClick },
    { label: "Users", value: formatCompactNumber(snapshot.users.current), note: `${snapshot.users.total} total`, growth: snapshot.users.changePercentage, Icon: UsersRound },
    { label: "Revenue", value: new Intl.NumberFormat("id-ID", { notation: "compact" }).format(snapshot.revenue.current), note: "Transaksi berbayar", growth: snapshot.revenue.changePercentage, Icon: Wallet },
  ];

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="admin-analytics-title">
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">BUSINESS INTELLIGENCE · TRAFFIC & CONVERSION</span>
          <h1 id="admin-analytics-title">Analytics & Monitoring</h1>
          <p>Ringkasan trafik, konversi, perangkat, dan performa konten seluruh ekosistem Mahreen.</p>
        </div>
        <div className="admin-feature-heading__controls">
          <button
            className="admin-feature-gold-button"
            type="button"
            onClick={() => {
              void adminAnalyticsRepository.refresh().then(() => {
                setSnapshot(adminAnalyticsRepository.getSnapshot());
                onLocalAction("Data analytics berhasil diperbarui.");
              });
            }}
          >
            <RefreshCw size={15} /> Muat Ulang
          </button>
        </div>
      </header>

      <div className="admin-feature-metrics">
        {metrics.map(({ label, value, note, growth, Icon }, index) => (
          <article className="admin-feature-metric" key={label} style={{ "--feature-delay": `${index * 65}ms` } as React.CSSProperties}>
            <div className="admin-feature-metric__top"><Icon size={18} /><span>{note}</span></div>
            <strong>{value}</strong>
            <span>{label}</span>
            <div className="admin-feature-metric__growth"><GrowthBadge value={growth} /></div>
          </article>
        ))}
      </div>

      <div className="admin-feature-grid">
        <article className="admin-feature-panel">
          <header className="admin-feature-panel__heading"><div><h2>Traffic (30 hari)</h2><p>Page views harian dari analytics events</p></div></header>
          {snapshot.traffic.length === 0 ? (
            <div className="admin-analytics-empty">Belum ada data trafik. Kunjungi situs agar page view tercatat.</div>
          ) : (
            <div className="admin-analytics-bar-chart">
              {snapshot.traffic.map((point) => (
                <div className="admin-analytics-bar" key={point.date} title={`${point.date}: ${point.pageViews} views`}>
                  <span style={{ "--analytics-bar": `${Math.max(3, (point.pageViews / maxTraffic) * 100)}%` } as React.CSSProperties} />
                  <small>{point.date.slice(5)}</small>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-feature-panel">
          <header className="admin-feature-panel__heading"><div><h2>Traffic Sources</h2><p>Distribusi asal kunjungan</p></div></header>
          {snapshot.trafficSources.length === 0 ? (
            <div className="admin-analytics-empty">Belum ada data sumber trafik.</div>
          ) : (
            <div className="admin-analytics-list">
              {snapshot.trafficSources.map((source) => (
                <div className="admin-analytics-list__item" key={source.source}>
                  <span>{source.source}</span>
                  <strong>{source.count}</strong>
                  <i><b style={{ "--analytics-progress": `${source.percentage}%` } as React.CSSProperties} /></i>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-feature-panel">
          <header className="admin-feature-panel__heading"><div><h2>Conversion Funnel</h2><p>Kunjungan → registrasi → konsultasi → pesanan → transaksi</p></div></header>
          {snapshot.funnel.length === 0 ? (
            <div className="admin-analytics-empty">Belum ada data funnel.</div>
          ) : (
            <div className="admin-analytics-funnel">
              {snapshot.funnel.map((stage) => (
                <div className="admin-analytics-funnel__row" key={stage.stage}>
                  <span>{stage.stage}</span>
                  <div><i style={{ "--analytics-funnel": `${Math.max(4, (stage.count / maxFunnel) * 100)}%` } as React.CSSProperties} /></div>
                  <strong>{stage.count}</strong>
                  <em>{stage.conversionFromPrevious.toFixed(1)}%</em>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-feature-panel">
          <header className="admin-feature-panel__heading"><div><h2>Devices</h2><p>Perangkat pengunjung</p></div></header>
          {snapshot.devices.length === 0 ? (
            <div className="admin-analytics-empty">Belum ada data perangkat.</div>
          ) : (
            <div className="admin-analytics-list">
              {snapshot.devices.map((device) => (
                <div className="admin-analytics-list__item" key={device.device}>
                  <span>{device.device}</span>
                  <strong>{device.count}</strong>
                  <i><b style={{ "--analytics-progress": `${device.percentage}%` } as React.CSSProperties} /></i>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="admin-feature-grid">
        <article className="admin-feature-panel">
          <header className="admin-feature-panel__heading"><div><h2>Top Pages</h2><p>Halaman paling banyak dikunjungi</p></div></header>
          {filteredTopPages.length === 0 ? (
            <div className="admin-analytics-empty">Belum ada data halaman.</div>
          ) : (
            <div className="admin-analytics-table-wrap">
              <table className="admin-feature-table">
                <thead><tr><th>Path</th><th>Category</th><th>Views</th><th>Sesi</th><th>%</th></tr></thead>
                <tbody>
                  {filteredTopPages.map((page) => (
                    <tr key={`${page.path}-${page.category}`}>
                      <td><code>{page.path}</code></td>
                      <td>{page.category}</td>
                      <td>{page.pageViews}</td>
                      <td>{page.uniqueSessions}</td>
                      <td>{page.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="admin-feature-panel">
          <header className="admin-feature-panel__heading"><div><h2>Ecosystem</h2><p>Kontribusi pendapatan per vertikal</p></div></header>
          {snapshot.ecosystem.verticals.length === 0 ? (
            <div className="admin-analytics-empty">Belum ada data ekosistem.</div>
          ) : (
            <div className="admin-analytics-list">
              {snapshot.ecosystem.verticals.map((vertical) => (
                <div className="admin-analytics-list__item" key={vertical.key}>
                  <span>{vertical.label}</span>
                  <strong>{vertical.metricLabel}: {vertical.metricValue}</strong>
                  <i><b style={{ "--analytics-progress": `${vertical.revenueShare}%` } as React.CSSProperties} /></i>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="admin-analytics-summary">
        <BarChart3 size={16} aria-hidden="true" />
        <span>
          {snapshot.pageViews.total} total page views · {snapshot.sessions.total} total sesi ·{" "}
          {snapshot.articleViews} views artikel · Rp{" "}
          {new Intl.NumberFormat("id-ID").format(snapshot.donationRaised)} donasi terkumpul
        </span>
      </div>
    </section>
  );
};

export default AdminAnalyticsPage;
