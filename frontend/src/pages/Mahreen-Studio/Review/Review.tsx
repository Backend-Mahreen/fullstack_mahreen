import { useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import PurchaseEmptyState from "../Purchase/components/PurchaseEmptyState";
import PurchasePageShell from "../Purchase/components/PurchasePageShell";
import PurchaseProgress from "../Purchase/components/PurchaseProgress";
import ReviewConfirmationCard from "../Purchase/components/ReviewConfirmationCard";
import { readStudioOrder } from "../Purchase/storage";

const reviewStyles = `
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,400&display=swap");

  .review-page {
    min-height: 100vh;
    background-color: #050505;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
  }

  .review-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 120px 24px 80px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ===== STEPS INDICATOR ===== */
  .review-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 640px;
    margin: 0 auto 48px auto;
    position: relative;
  }

  .review-steps__track {
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
    z-index: 1;
  }

  .review-steps__fill {
    height: 100%;
    width: 100%;
    background: #e5c483;
    box-shadow: 0 0 10px rgba(229, 196, 131, 0.5);
  }

  .review-steps__items {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: relative;
    z-index: 2;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .step-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .step-node__icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    transition: all 250ms ease;
  }

  .step-node--completed .step-node__icon {
    background: #c8a96a;
    color: #050505;
    border: 1px solid rgba(229, 196, 131, 0.2);
  }

  .step-node--active .step-node__icon {
    background: #e5c483;
    color: #050505;
    box-shadow: 0 0 16px rgba(229, 196, 131, 0.4);
  }

  .step-node__label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #e5c483;
  }

  /* ===== MAIN CONFIRMATION CARD ===== */
  .confirmation-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 56px 40px;
    max-width: 680px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
  }

  .icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(229, 196, 131, 0.1);
    border: 1px solid rgba(229, 196, 131, 0.3);
    box-shadow: 0 0 25px rgba(227, 194, 129, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e5c483;
    margin-bottom: 24px;
  }

  .confirmation-title {
    font-size: 24px;
    font-weight: 700;
    color: #e5e2e1;
    margin: 0 0 12px 0;
  }

  .confirmation-desc {
    font-size: 15px;
    color: #d0c5b5;
    line-height: 1.6;
    margin: 0 0 36px 0;
    max-width: 460px;
  }

  /* SUMMARY INNER BOX */
  .summary-box {
    width: 100%;
    background: #1c1b1b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: left;
    margin-bottom: 36px;
  }

  .summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .summary-header__label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.8px;
    color: #d0c5b5;
    text-transform: uppercase;
  }

  .summary-header__val {
    font-size: 15px;
    font-weight: 700;
    color: #e5c483;
  }

  .status-badge {
    background: rgba(229, 196, 131, 0.1);
    color: #e5c483;
    border: 1px solid rgba(229, 196, 131, 0.2);
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
  }

  .review-product {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .review-product img {
    width: 72px;
    height: 82px;
    object-fit: cover;
    border-radius: 12px;
    background: #252525;
  }

  .review-product__name {
    margin: 0 0 5px;
    color: #f2ede4;
    font-size: 14px;
    font-weight: 700;
  }

  .review-product__variant,
  .review-product__sku {
    margin: 0;
    color: rgba(255, 255, 255, 0.48);
    font-size: 14px;
    line-height: 1.55;
  }

  .review-product strong {
    color: #e5c483;
    font-size: 14px;
    white-space: nowrap;
  }

  .item-lines {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .item-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .item-line__name {
    color: #b8b8b8;
  }

  .item-line__price {
    color: #e5e2e1;
    font-weight: 500;
  }

  .item-line--total {
    padding-top: 8px;
    font-size: 16px;
    font-weight: 700;
  }

  .item-line--total .item-line__name {
    color: #e5e2e1;
  }

  .item-line--total .item-line__price {
    color: #e5c483;
    font-size: 18px;
  }

  /* ADDRESS BOX */
  .address-box {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: #201f1f;
    border-radius: 12px;
    padding: 16px;
  }

  .address-box__icon {
    color: #e5c483;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .address-box__title {
    font-size: 14px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0 0 2px 0;
  }

  .address-box__text {
    font-size: 14px;
    color: #d0c5b5;
    margin: 0;
    line-height: 1.4;
  }

  /* ACTION BUTTONS */
  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 100%;
    flex-wrap: wrap;
  }

  .btn-primary-action {
    flex: 1;
    min-width: 200px;
    background: #e5c483;
    color: #261a00;
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(229, 196, 131, 0.3);
    transition: all 250ms ease;
  }

  .btn-primary-action:hover {
    background: #f0d59e;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(229, 196, 131, 0.45);
  }

  .btn-secondary-action {
    flex: 1;
    min-width: 200px;
    background: transparent;
    color: #e5e2e1;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 16px 24px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 250ms ease;
    text-decoration: none;
  }

  .btn-secondary-action:hover {
    border-color: #e5c483;
    color: #e5c483;
    background: rgba(229, 196, 131, 0.05);
  }

  /* RESPONSIVE */
  @media (max-width: 640px) {
    .review-container {
      padding: 100px 16px 60px 16px;
    }

    .confirmation-card {
      padding: 36px 20px;
    }

    .review-product {
      grid-template-columns: 62px minmax(0, 1fr);
    }

    .review-product img { width: 62px; height: 72px; }
    .review-product strong { grid-column: 2; }

    .action-buttons {
      flex-direction: column;
    }

    .btn-primary-action, .btn-secondary-action {
      width: 100%;
    }
  }
`;

const ReviewPage = () => {
  const { user } = useAuth();
  const order = useMemo(() => readStudioOrder(), []);

  if (!order) {
    return (
      <PurchasePageShell
        pageClassName="review-page"
        styleName="mahreen-review"
        styles={reviewStyles}
        showClosing={false}
      >
        <PurchaseEmptyState
          eyebrow="Ringkasan belum tersedia"
          title="Belum ada pembayaran yang dikonfirmasi"
          description="Ringkasan hanya dibuat dari transaksi Mahreen Studio yang telah dikonfirmasi. Selesaikan checkout agar data pesanan tersimpan secara lokal."
          actionLabel="Kembali ke Koleksi"
          onAction={() => navigateToHashRoute("/mahreen-studio/latest-collection")}
        />
      </PurchasePageShell>
    );
  }

  const customerName = order.shipping.fullName || user?.fullName || "Pelanggan Mahreen";

  return (
    <PurchasePageShell
      pageClassName="review-page"
      styleName="mahreen-review"
      styles={reviewStyles}
    >
      <main className="review-container">
        <PurchaseProgress activeStep={3} prefix="review-steps" />
        <ReviewConfirmationCard
          order={order}
          customerName={customerName}
          onTrackOrder={() => navigateToHashRoute("/mahreen-studio/lacak-pesanan")}
          onBackToStudio={() => navigateToHashRoute("/mahreen-studio")}
        />
      </main>
    </PurchasePageShell>
  );
};

export default ReviewPage;
