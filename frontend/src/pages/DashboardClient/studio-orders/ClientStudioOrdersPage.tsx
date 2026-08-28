import { Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type StudioOrder = {
  id: string;
  productName: string;
  variant: string;
  quantity: number;
  totalPrice: number;
  status: string;
  trackingNumber: string;
  paymentMethod: string;
  createdAt: string;
};

type StudioOrderSummary = {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
};

const formatCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    confirmed: "Dikonfirmasi",
    processing: "Diproses",
    shipped: "Dikirim",
    delivered: "Terkirim",
    cancelled: "Dibatalkan",
  };
  return map[s.toLowerCase()] || s;
};

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (v === "delivered") return "client-studio-orders__badge--delivered";
  if (v === "shipped") return "client-studio-orders__badge--shipped";
  if (v === "cancelled") return "client-studio-orders__badge--cancelled";
  return "client-studio-orders__badge--pending";
};

const ClientStudioOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<StudioOrder[] | null>(null);
  const [summary, setSummary] = useState<StudioOrderSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      try {
        const [listRes, sumRes] = await Promise.all([
          apiClient<{ items: StudioOrder[] }>(API_ENDPOINTS.clientStudioOrders.list),
          apiClient<StudioOrderSummary>(API_ENDPOINTS.clientStudioOrders.summary),
        ]);
        if (active) {
          setOrders(listRes.items || []);
          setSummary(sumRes);
        }
      } catch {
        if (active) setError("Gagal memuat data pesanan studio.");
      }
    };
    void load();
    return () => { active = false; };
  }, [user]);

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="studio-orders" className="client-studio-orders-page">
      <div className="client-studio-orders-content">
        <header className="client-studio-orders-header">
          <h1>Studio Orders</h1>
          <p>Riwayat pesanan produk Mahreen Studio Anda.</p>
        </header>

        {summary && (
          <div className="client-studio-orders-summary">
            <div className="client-studio-orders-summary__card">
              <span className="client-studio-orders-summary__label">Total Pesanan</span>
              <span className="client-studio-orders-summary__value">{summary.totalOrders}</span>
            </div>
            <div className="client-studio-orders-summary__card">
              <span className="client-studio-orders-summary__label">Total Pengeluaran</span>
              <span className="client-studio-orders-summary__value">{formatCurrency(summary.totalSpent)}</span>
            </div>
            <div className="client-studio-orders-summary__card">
              <span className="client-studio-orders-summary__label">Menunggu Proses</span>
              <span className="client-studio-orders-summary__value">{summary.pendingOrders}</span>
            </div>
          </div>
        )}

        {error && <p className="client-studio-orders__error" role="alert">{error}</p>}

        {!orders ? (
          <div className="client-studio-orders__skeleton" aria-label="Memuat pesanan studio">
            {[0, 1, 2].map((i) => <span key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <section className="client-studio-orders__empty" role="status">
            <Shirt aria-hidden="true" />
            <h2>Belum ada pesanan</h2>
            <p>Pesanan produk Mahreen Studio Anda akan tampil di sini.</p>
            <a href="/studio">Jelajahi Produk</a>
          </section>
        ) : (
          <div className="client-studio-orders-list">
            {orders.map((o) => (
              <div key={o.id} className="client-studio-orders-item">
                <div className="client-studio-orders-item__main">
                  <span className="client-studio-orders-item__name">{o.productName}</span>
                  <span className={`client-studio-orders__badge ${statusColor(o.status)}`}>
                    {statusLabel(o.status)}
                  </span>
                </div>
                <div className="client-studio-orders-item__details">
                  {o.variant && <span>{o.variant}</span>}
                  <span>Qty: {o.quantity}</span>
                  <span className="client-studio-orders-item__price">{formatCurrency(o.totalPrice)}</span>
                </div>
                <div className="client-studio-orders-item__meta">
                  <span>
                    {new Date(o.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  {o.trackingNumber && <span>Tracking: {o.trackingNumber}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientStudioOrdersPage;
