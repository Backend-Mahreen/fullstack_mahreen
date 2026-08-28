import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import PurchaseEmptyState from "../Purchase/components/PurchaseEmptyState";
import PurchasePageShell from "../Purchase/components/PurchasePageShell";
import TrackingSearchCard from "../Purchase/components/TrackingSearchCard";
import TrackingShipmentCard from "../Purchase/components/TrackingShipmentCard";
import { readStudioOrder } from "../Purchase/storage";

const lacakStyles = `
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

  .lacak-page {
    min-height: 100vh;
    background-color: #050505;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
  }

  .lacak-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 120px 24px 80px 24px;
  }

  /* HEADER SECTION */
  .lacak-header {
    margin-bottom: 40px;
  }

  .lacak-header__title {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 700;
    letter-spacing: -1.2px;
    color: #e5e2e1;
    margin: 0 0 16px 0;
  }

  .lacak-header__desc {
    font-size: 16px;
    color: #d0c5b5;
    max-width: 680px;
    margin: 0;
    line-height: 1.6;
  }

  /* GRID CONTAINER */
  .lacak-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
  }

  @media (min-width: 992px) {
    .lacak-main-grid {
      grid-template-columns: 1fr 340px;
      gap: 40px;
    }
  }

  .lacak-content-col {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* SEARCH FORM */
  .search-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  .search-form {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-input-wrap {
    position: relative;
    flex-grow: 1;
    min-width: 260px;
  }

  .search-input-wrap svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.4);
  }

  .search-input {
    width: 100%;
    background: #1c1b1b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 16px 16px 16px 48px;
    color: #e5e2e1;
    font-size: 15px;
    outline: none;
    transition: border-color 200ms ease;
  }

  .search-input:focus {
    border-color: #e5c483;
  }

  .btn-lacak {
    background: #e5c483;
    color: #402d00;
    border: none;
    border-radius: 12px;
    padding: 16px 36px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    transition: all 250ms ease;
    box-shadow: 0 4px 15px rgba(229, 196, 131, 0.25);
  }

  .btn-lacak:hover {
    background: #f0d59e;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(229, 196, 131, 0.4);
  }

  /* SHIPMENT ARTICLE CARD */
  .shipment-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  .shipment-card__header {
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .shipment-card__title-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .shipment-card__icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(229, 196, 131, 0.1);
    border: 1px solid rgba(229, 196, 131, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e5c483;
  }

  .shipment-card__awb {
    font-size: 22px;
    font-weight: 700;
    color: #e5e2e1;
    margin: 0;
  }

  .shipment-card__product-name {
    font-size: 14px;
    color: #d0c5b5;
    margin: 2px 0 0 0;
  }

  .shipment-card__eta-box {
    text-align: right;
  }

  .shipment-card__eta-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.2px;
    color: #d0c5b5;
    margin: 0;
    text-transform: uppercase;
  }

  .shipment-card__eta-date {
    font-size: 22px;
    font-weight: 700;
    color: #e5c483;
    margin: 2px 0 0 0;
  }

  .shipment-card__body {
    padding: 32px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
  }

  @media (min-width: 768px) {
    .shipment-card__body {
      grid-template-columns: 1.2fr 1fr;
    }
  }

  /* TIMELINE */
  .timeline {
    position: relative;
    padding-left: 36px;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .timeline::before {
    content: "";
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 13px;
    width: 2px;
    background: rgba(255, 255, 255, 0.08);
  }

  .timeline__progress-line {
    position: absolute;
    top: 12px;
    left: 13px;
    width: 2px;
    height: 65%;
    background: #e5c483;
    box-shadow: 0 0 10px rgba(229, 196, 131, 0.5);
  }

  .timeline-item {
    position: relative;
  }

  .timeline-item__badge {
    position: absolute;
    left: -36px;
    top: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #e5c483;
    color: #050505;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    transform: translateX(-4px);
    z-index: 2;
  }

  .timeline-item--future .timeline-item__badge {
    background: #2a2a2a;
    border: 2px solid rgba(255, 255, 255, 0.1);
    color: #d0c5b5;
  }

  .timeline-item--future {
    opacity: 0.45;
  }

  .timeline-item__title {
    font-size: 16px;
    font-weight: 600;
    color: #e5c483;
    margin: 0;
  }

  .timeline-item--future .timeline-item__title {
    color: #e5e2e1;
  }

  .timeline-item__time {
    font-size: 14px;
    color: #d0c5b5;
    margin-top: 2px;
    display: block;
  }

  .timeline-item__desc {
    font-size: 14px;
    color: #b8b8b8;
    margin: 6px 0 0 0;
    line-height: 1.5;
  }

  .timeline-quote {
    background: #1c1b1b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 14px 16px;
    font-style: italic;
    font-size: 14px;
    color: #e5e2e1;
    margin-top: 10px;
    line-height: 1.5;
  }

  /* LOGISTICS INFO SIDE */
  .logistics-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .section-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.2px;
    color: #d0c5b5;
    margin: 0 0 12px 0;
    text-transform: uppercase;
  }

  .courier-box {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #1c1b1b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 16px;
  }

  .courier-logo {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #e5c483;
    font-size: 14px;
    flex-shrink: 0;
  }

  .courier-name {
    font-size: 15px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0;
  }

  .courier-awb {
    font-size: 14px;
    color: #d0c5b5;
    margin: 2px 0 0 0;
  }

  .location-box {
    background: #1c1b1b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }

  .location-map-mock {
    height: 120px;
    background: linear-gradient(135deg, #181818 0%, #282828 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .location-tag {
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #e5e2e1;
    background: rgba(5, 5, 5, 0.85);
    padding: 8px 12px;
    border-radius: 8px;
    backdrop-filter: blur(4px);
  }

  .btn-support-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #e5e2e1;
    border-radius: 12px;
    padding: 14px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 200ms ease;
  }

  .btn-support-link:hover {
    border-color: #e5c483;
    color: #e5c483;
    background: rgba(229, 196, 131, 0.05);
  }

  /* SIDEBAR HELP */
  .help-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .help-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .help-card__title {
    font-size: 20px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0 0 12px 0;
  }

  .help-card__desc {
    font-size: 14px;
    color: #d0c5b5;
    line-height: 1.6;
    margin: 0 0 20px 0;
  }

  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #e5e2e1;
    font-size: 14px;
    text-decoration: none;
    transition: color 200ms ease;
  }

  .contact-item:hover {
    color: #e5c483;
  }

  .platinum-note {
    background: rgba(229, 196, 131, 0.05);
    border: 1px solid rgba(229, 196, 131, 0.2);
    border-radius: 12px;
    padding: 16px;
  }

  .platinum-note__header {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #e5c483;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 6px 0;
  }

  .platinum-note__text {
    font-size: 14px;
    color: #e5e2e1;
    margin: 0;
    line-height: 1.5;
  }

  .faq-accordion {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .faq-details {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 12px 0;
  }

  .faq-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    color: #e5e2e1;
    cursor: pointer;
    list-style: none;
  }

  .faq-content {
    font-size: 14px;
    color: #d0c5b5;
    margin-top: 10px;
    line-height: 1.5;
  }

  /* MOBILE RESPONSIVE */
  @media (max-width: 991px) {
    .lacak-container {
      padding: 100px 20px 60px 20px;
    }

    .lacak-main-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    .lacak-content-col {
      width: min(100%, 680px);
      margin: 0 auto;
    }

    .help-sidebar {
      width: min(100%, 680px);
      margin: 0 auto;
    }
  }
`;

const LacakPesananPage = () => {
  const { user } = useAuth();
  const order = useMemo(() => readStudioOrder(), []);
  const [searchValue, setSearchValue] = useState(() => order?.trackingNumber ?? "");
  const [searchMessage, setSearchMessage] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (!order) return;
    const normalizedValue = searchValue.trim().toUpperCase();
    const isMatch = [order.trackingNumber, order.orderNumber]
      .map((value) => value.toUpperCase())
      .includes(normalizedValue);

    setSearchMessage(
      isMatch
        ? `Pesanan ${order.orderNumber} ditemukan dan status terbaru telah ditampilkan.`
        : "Nomor resi atau ID pesanan tidak ditemukan. Periksa kembali nomor yang dimasukkan.",
    );
  };

  if (!order) {
    return (
      <PurchasePageShell
        pageClassName="lacak-page"
        styleName="mahreen-lacak"
        styles={lacakStyles}
        showClosing={false}
      >
        <PurchaseEmptyState
          eyebrow="Lacak pesanan"
          title="Belum ada pesanan lokal"
          description="Nomor pesanan dan resi akan muncul setelah pembayaran dikonfirmasi. Untuk sementara, data transaksi disimpan di perangkat ini sambil menunggu integrasi backend."
          actionLabel="Belanja Sekarang"
          onAction={() => navigateToHashRoute("/mahreen-studio/latest-collection")}
        />
      </PurchasePageShell>
    );
  }

  return (
    <PurchasePageShell
      pageClassName="lacak-page"
      styleName="mahreen-lacak"
      styles={lacakStyles}
    >
      <main className="lacak-container">
        <header className="lacak-header">
          <h1 className="lacak-header__title">Lacak Pesanan</h1>
          <p className="lacak-header__desc">
            Pantau status pengiriman koleksi Mahreen Studio menggunakan nomor resi atau ID pesanan Anda.
          </p>
        </header>

        <div className="lacak-main-grid">
          <div className="lacak-content-col">
            <TrackingSearchCard
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearch}
              message={searchMessage}
            />
            <TrackingShipmentCard order={order} />
          </div>

          <aside className="help-sidebar">
            <section className="help-card">
              <h2 className="help-card__title">Butuh Bantuan?</h2>
              <p className="help-card__desc">
                Tim dukungan pelanggan siap membantu apabila Anda mengalami kendala saat melacak pesanan.
              </p>
              <div className="contact-list">
                <a href="mailto:info@mahreenindonesia.com" className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" color="#e5c483" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>info@mahreenindonesia.com</span>
                </a>
                <a href="tel:+6289652647385" className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" color="#e5c483" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>+62 896-5264-7385</span>
                </a>
              </div>
              <div className="platinum-note">
                <p className="platinum-note__header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Layanan Member
                </p>
                <p className="platinum-note__text">
                  Hai {user?.fullName || order.shipping.fullName || "Member"}, pesanan Anda mendapatkan prioritas penanganan.
                </p>
              </div>
            </section>

            <section className="help-card">
              <h2 className="help-card__title">Panduan Pengiriman</h2>
              <div className="faq-accordion">
                <details className="faq-details">
                  <summary className="faq-summary"><span>Berapa lama proses pengiriman?</span><span>▾</span></summary>
                  <p className="faq-content">Estimasi pengiriman adalah 2–3 hari kerja untuk Jabodetabek dan 3–5 hari kerja untuk wilayah lainnya.</p>
                </details>
                <details className="faq-details">
                  <summary className="faq-summary"><span>Apakah alamat dapat diganti?</span><span>▾</span></summary>
                  <p className="faq-content">Perubahan alamat dapat dilakukan selama pesanan belum diserahkan kepada kurir. Hubungi Support Mahreen untuk bantuan.</p>
                </details>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </PurchasePageShell>
  );
};

export default LacakPesananPage;
