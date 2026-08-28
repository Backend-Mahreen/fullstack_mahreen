import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import {
  adminClientsRepository,
  type AdminClientRecord,
  type AdminClientStats,
  type AdminClientActivity,
} from "../../../../services/admin/apiAdminClientsRepository";

type ClientsAdminProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const clientsAdminStyles = `
  .admin-clients-table-wrap { overflow-x: auto; }
  .admin-clients-empty { padding: 40px 20px; color: #817d75; font-size: 12px; text-align: center; }
  .admin-client-detail {
    margin-top: 18px; padding: 22px; border: 1px solid rgba(240,200,70,.18); border-radius: 12px;
    background: rgba(255,255,255,.018);
  }
  .admin-client-detail__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .admin-client-detail__head h3 { margin: 0; color: #ece9e3; font-size: 16px; }
  .admin-client-detail__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px; }
  .admin-client-detail__stat { padding: 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 8px; background: rgba(255,255,255,.02); }
  .admin-client-detail__stat span { display: block; color: #817d75; font-size: 10px; text-transform: uppercase; }
  .admin-client-detail__stat strong { display: block; margin-top: 4px; color: #e5c477; font-size: 16px; }
  .admin-client-detail__activity { display: grid; gap: 8px; }
  .admin-client-detail__activity-item { padding: 10px 12px; border: 1px solid rgba(255,255,255,.07); border-radius: 6px; }
  .admin-client-detail__activity-item strong { color: #d9d5cc; font-size: 12px; }
  .admin-client-detail__activity-item p { margin: 3px 0 0; color: #817d75; font-size: 11px; }
  .admin-clients-row-actions button {
    display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px;
    border: 1px solid rgba(240,200,70,.25); border-radius: 6px; color: #e5c477;
    background: transparent; cursor: pointer; font-size: 11px;
  }
  .admin-clients-row-actions button:hover { background: rgba(240,200,70,.08); }
  @media (max-width: 720px) {
    .admin-client-detail__stats { grid-template-columns: repeat(2, 1fr); }
  }
`;

const ClientsAdmin = ({ query, onLocalAction }: ClientsAdminProps) => {
  const [clients, setClients] = useState<AdminClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminClientStats | null>(null);
  const [activity, setActivity] = useState<AdminClientActivity[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminClientsRepository.list({ search: query || undefined, limit: 100 });
      setClients(result.items);
    } catch {
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async; setState terjadi setelah await, bukan sinkron.
    void loadClients();
  }, [loadClients]);

  const loadDetail = async (clientId: string) => {
    setSelectedId(clientId);
    setDetailLoading(true);
    setStats(null);
    setActivity([]);
    try {
      const [statsResult, activityResult] = await Promise.all([
        adminClientsRepository.getStats(clientId),
        adminClientsRepository.getActivity(clientId, 10),
      ]);
      setStats(statsResult);
      setActivity(activityResult);
    } catch {
      onLocalAction("Gagal memuat detail client.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="admin-clients-title">
      <style>{clientsAdminStyles}</style>
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">CLIENT DIRECTORY</span>
          <h1 id="admin-clients-title">Clients</h1>
          <p>Pantau klien, total pesanan, pengeluaran, donasi, dan sertifikat.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="admin-clients-empty">Memuat daftar client...</div>
      ) : clients.length === 0 ? (
        <div className="admin-clients-empty">
          <Search size={20} style={{ display: "block", margin: "0 auto 10px" }} />
          Tidak ada client yang cocok.
        </div>
      ) : (
        <div className="admin-clients-table-wrap">
          <table className="admin-feature-table">
            <thead>
              <tr><th>Nama</th><th>Email</th><th>Institusi</th><th>Pesanan</th><th>Total Belanja</th><th>Donasi</th><th>Sertifikat</th><th></th></tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td><strong>{client.full_name}</strong></td>
                  <td>{client.email}</td>
                  <td>{client.institution || "-"}</td>
                  <td>{client.total_orders}</td>
                  <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(client.total_spent)}</td>
                  <td>{client.total_donations}</td>
                  <td>{client.total_certificates}</td>
                  <td className="admin-clients-row-actions">
                    <button type="button" onClick={() => void loadDetail(client.id)}>
                      Detail <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId ? (
        <div className="admin-client-detail">
          {detailLoading ? (
            <div className="admin-clients-empty">Memuat detail...</div>
          ) : stats ? (
            <>
              <div className="admin-client-detail__head">
                <h3>{stats.user.full_name}<span style={{ color: "#817d75", fontWeight: 400, marginLeft: 8 }}>{stats.user.email}</span></h3>
                <button className="admin-clients-row-actions" type="button" onClick={() => setSelectedId(null)}
                  style={{ border: "1px solid rgba(255,255,255,.15)", borderRadius: 6, padding: "4px 10px", background: "transparent", color: "#9a948a", cursor: "pointer" }}>
                  Tutup
                </button>
              </div>
              <div className="admin-client-detail__stats">
                <div className="admin-client-detail__stat"><span>Proyek Aktif</span><strong>{stats.activeProjects}</strong></div>
                <div className="admin-client-detail__stat"><span>Total Pesanan</span><strong>{stats.totalOrders}</strong></div>
                <div className="admin-client-detail__stat"><span>Total Donasi</span><strong>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stats.totalDonated)}</strong></div>
                <div className="admin-client-detail__stat"><span>Sertifikat</span><strong>{stats.totalCertificates}</strong></div>
              </div>
              {activity.length > 0 ? (
                <div className="admin-client-detail__activity">
                  {activity.map((item) => (
                    <div className="admin-client-detail__activity-item" key={item.id}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-clients-empty">Belum ada aktivitas.</div>
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default ClientsAdmin;