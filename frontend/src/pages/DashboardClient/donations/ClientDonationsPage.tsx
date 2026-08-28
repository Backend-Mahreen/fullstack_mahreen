import { HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type Donation = {
  id: string;
  amount: number;
  campaign: string;
  paymentMethod: string;
  paymentStatus: string;
  message: string;
  createdAt: string;
};

type DonationSummary = {
  totalDonations: number;
  totalAmount: number;
  paidDonations: number;
};

const formatCurrency = (n: number) =>
  `Rp ${n.toLocaleString("id-ID")}`;

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (v === "paid") return "client-donations__badge--paid";
  if (v === "pending") return "client-donations__badge--pending";
  return "client-donations__badge--failed";
};

const ClientDonationsPage = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[] | null>(null);
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      try {
        const [listRes, sumRes] = await Promise.all([
          apiClient<{ items: Donation[] }>(API_ENDPOINTS.clientDonations.list),
          apiClient<DonationSummary>(API_ENDPOINTS.clientDonations.summary),
        ]);
        if (active) {
          setDonations(listRes.items || []);
          setSummary(sumRes);
        }
      } catch {
        if (active) setError("Gagal memuat data donasi.");
      }
    };
    void load();
    return () => { active = false; };
  }, [user]);

  if (!user) return null;

  return (
    <ClientAccountLayout activeItem="donations" className="client-donations-page">
      <div className="client-donations-content">
        <header className="client-donations-header">
          <h1>Donasi Saya</h1>
          <p>Riwayat donasi dan kontribusi Anda untuk program sosial Mahreen.</p>
        </header>

        {summary && (
          <div className="client-donations-summary">
            <div className="client-donations-summary__card">
              <span className="client-donations-summary__label">Total Donasi</span>
              <span className="client-donations-summary__value">{summary.totalDonations}</span>
            </div>
            <div className="client-donations-summary__card">
              <span className="client-donations-summary__label">Total Diberikan</span>
              <span className="client-donations-summary__value">{formatCurrency(summary.totalAmount)}</span>
            </div>
            <div className="client-donations-summary__card">
              <span className="client-donations-summary__label">Berhasil Dibayar</span>
              <span className="client-donations-summary__value">{summary.paidDonations}</span>
            </div>
          </div>
        )}

        {error && <p className="client-donations__error" role="alert">{error}</p>}

        {!donations ? (
          <div className="client-donations__skeleton" aria-label="Memuat donasi">
            {[0, 1, 2].map((i) => <span key={i} />)}
          </div>
        ) : donations.length === 0 ? (
          <section className="client-donations__empty" role="status">
            <HandHeart aria-hidden="true" />
            <h2>Belum ada donasi</h2>
            <p>Donasi Anda akan tampil di sini setelah Anda berkontribusi.</p>
            <a href="/peduli-mahreen">Mulai berdonasi</a>
          </section>
        ) : (
          <div className="client-donations-list">
            {donations.map((d) => (
              <div key={d.id} className="client-donations-item">
                <div className="client-donations-item__main">
                  <span className="client-donations-item__campaign">{d.campaign || "Donasi Umum"}</span>
                  <span className={`client-donations__badge ${statusColor(d.paymentStatus)}`}>
                    {d.paymentStatus}
                  </span>
                </div>
                <div className="client-donations-item__details">
                  <span className="client-donations-item__amount">{formatCurrency(d.amount)}</span>
                  <span className="client-donations-item__date">
                    {new Date(d.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                {d.message && <p className="client-donations-item__message">{d.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientDonationsPage;
