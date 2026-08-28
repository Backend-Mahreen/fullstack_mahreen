import { formatRupiah } from "../storage";
import type { StudioCartItem } from "../types";

type PaymentSummaryCardProps = {
  items: StudioCartItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  adminFee: number;
  discount: number;
  grandTotal: number;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: (event: React.FormEvent) => void;
  promoMessage?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
};

const PaymentSummaryCard = ({
  items,
  subtotal,
  tax,
  shippingFee,
  adminFee,
  discount,
  grandTotal,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoMessage,
  onConfirm,
  isConfirming = false,
}: PaymentSummaryCardProps) => (
  <div className="order-summary-col">
    <div className="summary-card">
      <h2 className="summary-card__title">Ringkasan Pesanan</h2>
      <div className="cart-item-preview-list">
        {items.map((item) => (
          <div className="cart-item-preview" key={item.productSlug + item.color + item.size}>
            <div className="cart-item-preview__thumb">
              <img width="800" height="1000" decoding="async" loading="lazy" src={item.productImage} alt={item.productTitle} />
            </div>
            <div className="cart-item-preview__info">
              <p className="cart-item-preview__name">{item.productTitle}</p>
              <p className="cart-item-preview__variant">{item.colorLabel || item.color} • {item.size} • Qty {item.quantity}</p>
              <p className="cart-item-preview__price">{formatRupiah(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="summary-breakdown">
        <div className="summary-row"><span className="summary-row__label">Subtotal</span><span className="summary-row__value">{formatRupiah(subtotal)}</span></div>
        <div className="summary-row"><span className="summary-row__label">Ongkir</span><span className="summary-row__value">{shippingFee === 0 ? "Gratis" : formatRupiah(shippingFee)}</span></div>
        <div className="summary-row"><span className="summary-row__label">PPN 11%</span><span className="summary-row__value">{formatRupiah(tax)}</span></div>
        <div className="summary-row"><span className="summary-row__label">Biaya Admin</span><span className="summary-row__value">{formatRupiah(adminFee)}</span></div>
        {discount > 0 ? (
          <div className="summary-row">
            <span className="summary-row__label" style={{ color: "#4ade80" }}>Diskon Promo</span>
            <span className="summary-row__value" style={{ color: "#4ade80" }}>-{formatRupiah(discount)}</span>
          </div>
        ) : null}
      </div>
      <div className="summary-total">
        <span className="summary-total__label">Total</span>
        <div>
          <p className="summary-total__amount">{formatRupiah(grandTotal)}</p>
          <p className="summary-total__sub">TERMASUK PAJAK</p>
        </div>
      </div>
      <button
        type="button"
        className="btn-confirm-payment"
        onClick={onConfirm}
        disabled={isConfirming}
      >
        {isConfirming ? "MEMPROSES..." : "KONFIRMASI PEMBAYARAN"}
      </button>
      <div className="security-text">
        <svg width="14" height="16" viewBox="0 0 16 20" fill="none" aria-hidden="true">
          <path d="M8 1l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V4l7-3z" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span>Pembayaran aman dan terenkripsi</span>
      </div>
    </div>
    <form className="promo-card" onSubmit={onApplyPromo}>
      <input type="text" className="promo-input" placeholder="Kode promo (coba: MAHREEN10)" value={promoCode} onChange={(event) => onPromoCodeChange(event.target.value)} />
      <button type="submit" className="btn-promo-apply">Pakai</button>
    </form>
    {promoMessage ? <p className="promo-feedback" role="status">{promoMessage}</p> : null}
  </div>
);

export default PaymentSummaryCard;
