import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import CheckoutDetailsFields from "../Purchase/components/CheckoutDetailsFields";
import CheckoutOrderCard from "../Purchase/components/CheckoutOrderCard";
import PurchaseEmptyState from "../Purchase/components/PurchaseEmptyState";
import PurchasePageShell from "../Purchase/components/PurchasePageShell";
import PurchaseProgress from "../Purchase/components/PurchaseProgress";
import {
  calculateStudioItemsTotals,
  getActiveStudioCartItems,
  getLatestStudioCartItem,
  readStudioCheckout,
  saveStudioCheckout,
} from "../Purchase/storage";
import type { StudioCartItem, StudioShippingDetails } from "../Purchase/types";

const orderSummaryStyles = `
  .order-summary-page {
    background-color: #060606;
    width: 100%;
    min-height: 100vh;
    color: #ffffff;
    font-family: "Inter", sans-serif;
  }

  .order-summary-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 24px 80px 24px;
  }

  /* ===== STEPS INDICATOR ===== */
  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    list-style: none;
    margin: 0 0 48px 0;
    padding: 0;
  }

  .steps__item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .steps__badge {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    transition: all 200ms ease;
  }

  .steps__label {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .steps__item--active .steps__badge {
    background: #e4c47f;
    color: #0a0a0a;
    box-shadow: 0 0 14px rgba(228, 196, 127, 0.4);
  }

  .steps__item--active .steps__label {
    color: #e4c47f;
  }

  .steps__item--inactive .steps__badge {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .steps__item--inactive .steps__label {
    color: rgba(255, 255, 255, 0.4);
  }

  .steps__divider {
    width: 48px;
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
  }

  /* ===== CHECKOUT GRID ===== */
  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: start;
  }

  @media (min-width: 992px) {
    .checkout-grid {
      grid-template-columns: 1.3fr 1fr;
      gap: 48px;
    }
  }

  /* ===== FORMS & SECTIONS ===== */
  .checkout-forms {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .form-section__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #ffffff;
    margin-bottom: 16px;
  }

  .form-section__title svg {
    color: #e4c47f;
  }

  .card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card--summary {
    position: sticky;
    top: 100px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 640px) {
    .field-row {
      grid-template-columns: 1fr 1fr;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.3px;
  }

  .field input,
  .field textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 13px 16px;
    color: #ffffff;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
  }

  .field input::placeholder,
  .field textarea::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  .field input:focus,
  .field textarea:focus {
    border-color: #e4c47f;
    background: rgba(228, 196, 127, 0.04);
    box-shadow: 0 0 12px rgba(228, 196, 127, 0.15);
  }

  .form-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 12px;
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 12px;
    padding: 14px 22px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms ease;
  }

  .btn-ghost:hover {
    border-color: rgba(255, 255, 255, 0.35);
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #e4c47f;
    color: #0a0a0a;
    border: 1px solid #e4c47f;
    border-radius: 12px;
    padding: 14px 28px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: all 200ms ease;
  }

  .btn-primary:hover {
    background: #eed59b;
    box-shadow: 0 0 20px rgba(228, 196, 127, 0.35);
  }

  /* ===== ORDER SUMMARY SIDEBAR ===== */
  .order-summary__title {
    font-family: "Playfair Display", serif;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px 0;
    color: #ffffff;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .product-item {
    display: flex;
    gap: 16px;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .product-item__thumb {
    width: 76px;
    height: 90px;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .product-item__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-item__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-grow: 1;
  }

  .product-item__name {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .product-item__variant {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  .product-item__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
  }

  .product-item__qty {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .product-item__price {
    font-size: 14px;
    font-weight: 600;
    color: #e4c47f;
  }

  .summary-lines {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .summary-line__free {
    color: #4ade80;
    font-weight: 600;
  }

  .summary-line__total {
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
  }

  .summary-line__total span:last-child {
    color: #e4c47f;
  }

  .secure-note {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(228, 196, 127, 0.05);
    border: 1px solid rgba(228, 196, 127, 0.18);
    border-radius: 12px;
    margin-top: 8px;
  }

  .secure-note svg {
    color: #e4c47f;
    flex-shrink: 0;
  }

  .secure-note__title {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .secure-note__desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin: 2px 0 0 0;
  }

  @media (max-width: 991px) {
    .order-summary-container {
      padding: 100px 20px 60px 20px;
    }

    .checkout-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      width: 100%;
    }

    .checkout-forms {
      display: contents;
    }

    .form-section {
      width: min(100%, 680px);
      margin: 0 auto;
    }

    .form-section__title {
      justify-content: center;
      text-align: center;
    }

    .order-summary {
      order: 3;
      width: min(100%, 680px);
      margin: 0 auto;
    }

    .card--summary {
      position: static;
    }

    .form-actions {
      order: 4;
      width: min(100%, 680px);
      margin: 8px auto 0 auto;
    }
  }

  @media (max-width: 640px) {
    .order-summary-container {
      padding: 96px 16px 50px 16px;
    }

    .card {
      padding: 20px;
    }

    .form-actions {
      flex-direction: column-reverse;
      gap: 12px;
    }

    .btn-ghost, .btn-primary {
      width: 100%;
      justify-content: center;
      padding: 16px;
      font-size: 14px;
    }
  }
`;

const emptyShippingDetails: StudioShippingDetails = {
  fullName: "",
  whatsapp: "",
  email: "",
  street: "",
  province: "",
  city: "",
  subdistrict: "",
  postal: "",
};

const OrderSummary = () => {
  const { user } = useAuth();
  const checkout = useMemo(() => readStudioCheckout(), []);
  const cartItems = useMemo<StudioCartItem[]>(
    () => checkout?.items ?? getActiveStudioCartItems(),
    [checkout],
  );
  const cartItem = useMemo<StudioCartItem | null>(
    () => cartItems[0] ?? checkout?.item ?? getLatestStudioCartItem(),
    [cartItems, checkout],
  );
  const [formData, setFormData] = useState<StudioShippingDetails>(() => ({
    ...emptyShippingDetails,
    ...(checkout?.shipping ?? {}),
    fullName: checkout?.shipping.fullName || user?.fullName || "",
    email: checkout?.shipping.email || user?.email || "",
    whatsapp: checkout?.shipping.whatsapp || user?.whatsapp || "",
  }));

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const field = event.target.id as keyof StudioShippingDetails;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePhoneChange = (whatsapp: string) => {
    setFormData((current) => ({ ...current, whatsapp }));
  };

  const handleNextStep = (event: FormEvent) => {
    event.preventDefault();
    if (!cartItem) return;
    saveStudioCheckout(cartItems, formData);
    navigateToHashRoute("/mahreen-studio/checkout/payment");
  };

  if (!cartItem) {
    return (
      <PurchasePageShell
        pageClassName="order-summary-page"
        styleName="order-summary"
        styles={orderSummaryStyles}
        showClosing={false}
      >
        <PurchaseEmptyState
          title="Keranjang pembelian masih kosong"
          description="Pilih produk Mahreen Studio terlebih dahulu. Warna, ukuran, jumlah, harga, dan gambar produk akan diteruskan otomatis ke checkout dan pembayaran."
          actionLabel="Lihat Koleksi"
          onAction={() => navigateToHashRoute("/mahreen-studio/latest-collection")}
        />
      </PurchasePageShell>
    );
  }

  const totals = calculateStudioItemsTotals(cartItems);

  return (
    <PurchasePageShell
      pageClassName="order-summary-page"
      styleName="order-summary"
      styles={orderSummaryStyles}
    >
      <main className="order-summary-container">
        <PurchaseProgress activeStep={1} variant="compact" />

        <form onSubmit={handleNextStep} className="checkout-grid">
          <div className="checkout-forms">
            <CheckoutDetailsFields
              value={formData}
              onChange={handleChange}
              onPhoneChange={handlePhoneChange}
            />
            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigateToHashRoute(`/mahreen-studio/product/${cartItem.productSlug}`)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M9.5 3L4 8l5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Kembali ke Produk
              </button>
              <button type="submit" className="btn-primary">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>

          <CheckoutOrderCard items={cartItems} {...totals} />
        </form>
      </main>
    </PurchasePageShell>
  );
};

export default OrderSummary;
