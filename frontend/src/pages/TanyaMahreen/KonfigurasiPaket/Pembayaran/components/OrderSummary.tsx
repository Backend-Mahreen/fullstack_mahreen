import type { WebsitePackageSelection } from "../paymentTypes";

type OrderSummaryProps = {
  selection: WebsitePackageSelection;
};

const formatRupiah = (value: number) =>
  `Rp ${Math.max(0, value).toLocaleString("id-ID")}`;

const OrderSummary = ({ selection }: OrderSummaryProps) => {
  const subtotal =
    selection.tier.price +
    selection.addOns.reduce((sum, addOn) => sum + addOn.priceValue, 0);
  const total = Number.isFinite(selection.total) ? selection.total : subtotal;

  return (
    <aside className="tp-summary-card" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title">Ringkasan Pesanan</h2>

      <div className="tp-summary-card__items">
        <div className="tp-summary-item">
          <div>
            <strong>{selection.tier.name}</strong>
            <span>{selection.category ?? "Website Solutions"}</span>
          </div>
          <p>{formatRupiah(selection.tier.price)}</p>
        </div>

        {selection.addOns.map((addOn) => (
          <div key={addOn.id ?? addOn.title} className="tp-summary-item">
            <div>
              <strong>Add-on: {addOn.title}</strong>
              <span>Tambahan layanan terpilih</span>
            </div>
            <p>{formatRupiah(addOn.priceValue)}</p>
          </div>
        ))}
      </div>

      <div className="tp-summary-card__calculation">
        <div>
          <span>Subtotal</span>
          <strong>{formatRupiah(subtotal)}</strong>
        </div>
        <div>
          <span>Biaya Layanan (0%)</span>
          <strong className="is-gold">FREE</strong>
        </div>
      </div>

      <div className="tp-summary-card__total">
        <span>Total Harga</span>
        <div>
          <strong>{formatRupiah(total)}</strong>
          <small>Harga belum termasuk PPN</small>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
