import { useCallback, useEffect, useState } from "react";
import { Download, FileSearch } from "lucide-react";
import {
  adminReportsRepository,
  type ReportLogEntry,
} from "../../../../services/admin/apiAdminReportsRepository";

type ReportsAdminProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const reportsAdminStyles = `
  .admin-reports-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 4px 0 16px;
    align-items: center;
  }
  .admin-reports-toolbar select,
  .admin-reports-toolbar input {
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 6px;
    color: #e6e0d8;
    background: #0d0d0c;
    font: inherit;
    font-size: 12px;
    outline: none;
  }
  .admin-reports-toolbar select:focus,
  .admin-reports-toolbar input:focus { border-color: rgba(240,200,70,.5); }
  .admin-reports-empty { padding: 40px 20px; color: #817d75; font-size: 12px; text-align: center; }
  .admin-reports-table-wrap { overflow-x: auto; }
  .admin-reports-source { display: inline-flex; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
  .admin-reports-source.is-audit { color: #7fb4e0; background: rgba(127,180,224,.1); }
  .admin-reports-source.is-activity { color: #e5c477; background: rgba(229,196,119,.1); }
  .admin-reports-source.is-analytics { color: #7fd6a1; background: rgba(127,214,161,.1); }
`;

const SOURCE_LABEL: Record<string, string> = {
  audit: "Audit",
  activity: "Activity",
  analytics: "Analytics",
};

const ReportsAdmin = ({ query, onLocalAction }: ReportsAdminProps) => {
  const [rows, setRows] = useState<ReportLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLogs = useCallback(async (nextSource = source, nextPage = page) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await adminReportsRepository.list({
        source: nextSource as ReportLogEntry["source"],
        search: query || undefined,
        page: nextPage,
        limit: 50,
      });
      setRows(result.items);
      setTotalPages(result.pagination.totalPages || 1);
    } catch {
      setRows([]);
      setError("Laporan gagal dimuat. Periksa koneksi server.");
    } finally {
      setIsLoading(false);
    }
  }, [query, source, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async; setState terjadi setelah await, bukan sinkron.
    void loadLogs();
  }, [loadLogs]);

  const handleExport = () => {
    void (async () => {
      try {
        const csv = await adminReportsRepository.exportCsv({ source: source as ReportLogEntry["source"], search: query || undefined });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mahreen-report.csv";
        link.click();
        URL.revokeObjectURL(url);
        onLocalAction("Laporan berhasil diekspor.");
      } catch {
        onLocalAction("Gagal mengekspor laporan.");
      }
    })();
  };

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="admin-reports-title">
      <style>{reportsAdminStyles}</style>
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">SYSTEM REPORTS · SUPERADMIN</span>
          <h1 id="admin-reports-title">Reports & Logs</h1>
          <p>Gabungan audit log, aktivitas sistem, dan event analitik dalam satu tampilan.</p>
        </div>
        <div className="admin-feature-heading__controls">
          <button className="admin-feature-gold-button" type="button" onClick={handleExport}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </header>

      <div className="admin-reports-toolbar">
        <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}>
          <option value="all">Semua Sumber</option>
          <option value="audit">Audit</option>
          <option value="activity">Activity</option>
          <option value="analytics">Analytics</option>
        </select>
      </div>

      {isLoading ? (
        <div className="admin-reports-empty">Memuat laporan...</div>
      ) : error ? (
        <div className="admin-reports-empty">{error}</div>
      ) : rows.length === 0 ? (
        <div className="admin-reports-empty">
          <FileSearch size={20} style={{ display: "block", margin: "0 auto 10px" }} />
          Belum ada log yang cocok.
        </div>
      ) : (
        <div className="admin-reports-table-wrap">
          <table className="admin-feature-table">
            <thead>
              <tr><th>Waktu</th><th>Sumber</th><th>Aksi</th><th>Pelaku</th><th>Keterangan</th><th>Resource</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><code>{row.timestamp}</code></td>
                  <td><span className={`admin-reports-source is-${row.source}`}>{SOURCE_LABEL[row.source] ?? row.source}</span></td>
                  <td>{row.action}</td>
                  <td><strong>{row.actor}</strong></td>
                  <td>{row.title}</td>
                  <td><code>{row.resource}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="admin-feature-pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Sebelumnya</button>
          <span>Halaman {page} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Berikutnya →</button>
        </div>
      ) : null}
    </section>
  );
};

export default ReportsAdmin;