import type { StudioOrder } from "../types";

type TrackingShipmentCardProps = {
  order: StudioOrder;
};

const formatDate = (value: string, includeTime = false) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" } : {}),
  }).format(new Date(value));

const TrackingShipmentCard = ({ order }: TrackingShipmentCardProps) => {
  const createdAt = new Date(order.createdAt);
  const processedAt = new Date(createdAt);
  processedAt.setHours(processedAt.getHours() + 8);
  const shippedAt = new Date(createdAt);
  shippedAt.setDate(shippedAt.getDate() + 1);

  return (
    <article className="shipment-card" aria-label="Detail lacak pengiriman">
      <div className="shipment-card__header">
        <div className="shipment-card__title-group">
          <div className="shipment-card__icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="16 8 20 8 23 11 23 16 16 16" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h2 className="shipment-card__awb">{order.trackingNumber}</h2>
            <p className="shipment-card__product-name">
              {order.item.productTitle} ({order.item.colorLabel || order.item.color})
              {order.items.length > 1 ? " +" + (order.items.length - 1) + " produk" : ""}
            </p>
          </div>
        </div>
        <div className="shipment-card__eta-box">
          <p className="shipment-card__eta-label">ESTIMASI KEDATANGAN</p>
          <p className="shipment-card__eta-date">{formatDate(order.estimatedArrival)}</p>
        </div>
      </div>

      <div className="shipment-card__body">
        <section aria-label="Status pengiriman">
          <ol className="timeline">
            <div className="timeline__progress-line" aria-hidden="true" />
            <li className="timeline-item">
              <div className="timeline-item__badge">✓</div>
              <h3 className="timeline-item__title">Pesanan Diterima</h3>
              <time className="timeline-item__time">{formatDate(order.createdAt, true)}</time>
              <p className="timeline-item__desc">Pesanan telah divalidasi oleh sistem Mahreen Studio.</p>
            </li>
            <li className="timeline-item">
              <div className="timeline-item__badge">✓</div>
              <h3 className="timeline-item__title">Sedang Diproses</h3>
              <time className="timeline-item__time">{formatDate(processedAt.toISOString(), true)}</time>
              <p className="timeline-item__desc">Koleksi sedang dipersiapkan dan dikemas sesuai standar kurasi.</p>
            </li>
            <li className="timeline-item">
              <div className="timeline-item__badge">🚚</div>
              <h3 className="timeline-item__title">Dalam Pengiriman</h3>
              <time className="timeline-item__time">{formatDate(shippedAt.toISOString(), true)}</time>
              <blockquote className="timeline-quote">Paket telah meninggalkan gudang transit dan menuju pusat distribusi regional.</blockquote>
            </li>
            <li className="timeline-item timeline-item--future">
              <div className="timeline-item__badge">4</div>
              <h3 className="timeline-item__title">Sampai di Tujuan</h3>
              <span className="timeline-item__time">Estimasi: {formatDate(order.estimatedArrival)}</span>
            </li>
          </ol>
        </section>

        <aside className="logistics-info" aria-label="Informasi logistik">
          <div>
            <h3 className="section-label">KURIR LOGISTIK</h3>
            <div className="courier-box">
              <div className="courier-logo">J&amp;T</div>
              <div>
                <p className="courier-name">J &amp; T Express</p>
                <p className="courier-awb">Nomor AWB: {order.trackingNumber}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="section-label">LOKASI TERKINI</h3>
            <div className="location-box">
              <div className="location-map-mock">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1" />
                </svg>
                <div className="location-tag">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" color="#e5c483" aria-hidden="true">
                    <path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>Transit: Pusat Distribusi Regional</span>
                </div>
              </div>
            </div>
          </div>
          <a href="mailto:info@mahreenindonesia.com" className="btn-support-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>Hubungi Support Mahreen</span>
          </a>
        </aside>
      </div>
    </article>
  );
};

export default TrackingShipmentCard;
