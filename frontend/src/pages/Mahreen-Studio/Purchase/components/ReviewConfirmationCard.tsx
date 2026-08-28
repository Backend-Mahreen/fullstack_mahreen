import { formatRupiah } from "../storage";
import type { StudioOrder } from "../types";

type ReviewConfirmationCardProps = {
  order: StudioOrder;
  customerName: string;
  onTrackOrder: () => void;
  onBackToStudio: () => void;
};

const ReviewConfirmationCard = ({
  order,
  customerName,
  onTrackOrder,
  onBackToStudio,
}: ReviewConfirmationCardProps) => {
  const address = [
    order.shipping.street,
    order.shipping.subdistrict,
    order.shipping.city,
    order.shipping.province,
    order.shipping.postal,
  ].filter(Boolean).join(", ");

  return (
    <article className="confirmation-card">
      <div className="icon-wrapper" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="confirmation-title">Pembayaran Berhasil</h1>
      <p className="confirmation-desc">
        Terima kasih atas kepercayaan Anda, {customerName}. Pesanan telah diterima dan sedang disiapkan oleh tim Mahreen Studio.
      </p>

      <section className="summary-box" aria-label="Ringkasan pesanan">
        <div className="summary-header">
          <div>
            <span className="summary-header__label">NOMOR PESANAN</span>
            <div className="summary-header__val">{order.orderNumber}</div>
          </div>
          <div>
            <span className="summary-header__label" style={{ display: "block", textAlign: "right" }}>STATUS</span>
            <span className="status-badge">Confirmed</span>
          </div>
        </div>

        {order.items.map((item) => (
          <div className="review-product" key={item.productSlug + item.color + item.size}>
            <img width="800" height="1000" decoding="async" loading="lazy" src={item.productImage} alt={item.productTitle} />
            <div className="review-product__copy">
              <p className="review-product__name">{item.productTitle}</p>
              <p className="review-product__variant">
                {item.colorLabel} · {item.size} · Qty {item.quantity}
              </p>
              <p className="review-product__sku">{item.productSku}</p>
            </div>
            <strong>{formatRupiah(item.price * item.quantity)}</strong>
          </div>
        ))}

        <dl className="item-lines">
          <div className="item-line">
            <dt className="item-line__name">PPN 11%</dt>
            <dd className="item-line__price">{formatRupiah(order.tax)}</dd>
          </div>
          <div className="item-line">
            <dt className="item-line__name">Biaya Admin</dt>
            <dd className="item-line__price">{formatRupiah(order.adminFee)}</dd>
          </div>
          {order.discount > 0 ? (
            <div className="item-line">
              <dt className="item-line__name">Diskon Promo</dt>
              <dd className="item-line__price">-{formatRupiah(order.discount)}</dd>
            </div>
          ) : null}
          <div className="item-line item-line--total">
            <dt className="item-line__name">Total</dt>
            <dd className="item-line__price">{formatRupiah(order.grandTotal)}</dd>
          </div>
        </dl>

        <address className="address-box">
          <svg className="address-box__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div>
            <p className="address-box__title">Alamat Pengiriman</p>
            <p className="address-box__text">{address || "Alamat pengiriman belum tersedia"}</p>
          </div>
        </address>
      </section>

      <div className="action-buttons">
        <button type="button" className="btn-primary-action" onClick={onTrackOrder}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="16 8 20 8 23 11 23 16 16 16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>Cek Status Pengiriman</span>
        </button>
        <button type="button" className="btn-secondary-action" onClick={onBackToStudio}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5" />
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>Kembali ke Mahreen Studio</span>
        </button>
      </div>
    </article>
  );
};

export default ReviewConfirmationCard;
