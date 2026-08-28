import { formatRupiah } from "../storage";
import type { StudioCartItem } from "../types";

type CheckoutOrderCardProps = {
  items: StudioCartItem[];
  subtotal: number;
  tax: number;
  adminFee: number;
  grandTotal: number;
};

const CheckoutOrderCard = ({ items, subtotal, tax, adminFee, grandTotal }: CheckoutOrderCardProps) => (
  <aside className="order-summary">
    <div className="card card--summary">
      <h3 className="order-summary__title">Ringkasan Pesanan</h3>
      {items.map((item) => (
        <div className="product-item" key={item.productSlug + item.color + item.size}>
          <div className="product-item__thumb">
            <img width="800" height="1000" decoding="async" loading="lazy" src={item.productImage} alt={item.productTitle} />
          </div>
          <div className="product-item__info">
            <p className="product-item__name">{item.productTitle}</p>
            <p className="product-item__variant">{item.colorLabel || item.color} / {item.size}</p>
            <div className="product-item__meta">
              <span className="product-item__qty">Qty: {item.quantity}</span>
              <span className="product-item__price">{formatRupiah(item.price * item.quantity)}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="summary-lines">
        <div className="summary-line"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
        <div className="summary-line"><span>Ongkir</span><span className="summary-line__free">Gratis</span></div>
        <div className="summary-line"><span>PPN 11%</span><span>{formatRupiah(tax)}</span></div>
        <div className="summary-line"><span>Biaya Admin</span><span>{formatRupiah(adminFee)}</span></div>
        <div className="summary-line summary-line__total"><span>Total</span><span>{formatRupiah(grandTotal)}</span></div>
      </div>
      <div className="secure-note">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden="true">
          <path d="M8 1l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V4l7-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="secure-note__title">Checkout Aman</p>
          <p className="secure-note__desc">Data dan informasi pembayaran dilindungi.</p>
        </div>
      </div>
    </div>
  </aside>
);

export default CheckoutOrderCard;
