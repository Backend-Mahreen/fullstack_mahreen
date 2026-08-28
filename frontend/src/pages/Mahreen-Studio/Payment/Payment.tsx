import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import { studioOrderService } from "../../../services/studio/studioOrderService";
import PaymentMethodCard from "../Purchase/components/PaymentMethodCard";
import PurchaseEmptyState from "../Purchase/components/PurchaseEmptyState";
import PaymentSummaryCard from "../Purchase/components/PaymentSummaryCard";
import PaymentSuccessModal from "../Purchase/components/PaymentSuccessModal";
import PurchasePageShell from "../Purchase/components/PurchasePageShell";
import PurchaseProgress from "../Purchase/components/PurchaseProgress";
import {
  calculateStudioItemsTotals,
  getActiveStudioCartItems,
  getLatestStudioCartItem,
  readStudioCheckout,
} from "../Purchase/storage";
import type { StudioCartItem } from "../Purchase/types";

const paymentStyles = `
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,400&display=swap");

  .payment-page {
    min-height: 100vh;
    background-color: #050505;
    color: #ffffff;
    font-family: "Plus Jakarta Sans", sans-serif;
  }

  .payment-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 120px 24px 80px 24px;
  }

  /* ===== STEPS INDICATOR ===== */
  .payment-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 640px;
    margin: 0 auto 56px auto;
    position: relative;
  }

  .payment-steps__track {
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
    z-index: 1;
  }

  .payment-steps__fill {
    height: 100%;
    width: 50%;
    background: #e5c483;
    box-shadow: 0 0 10px rgba(229, 196, 131, 0.5);
  }

  .payment-steps__items {
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

  .step-node--inactive .step-node__icon {
    background: #2a2a2a;
    color: #d0c5b5;
  }

  .step-node__label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
  }

  .step-node--completed .step-node__label {
    color: #d0c5b5;
  }

  .step-node--active .step-node__label {
    color: #e5c483;
  }

  .step-node--inactive .step-node__label {
    color: #d0c5b5;
    opacity: 0.6;
  }

  /* ===== MAIN GRID ===== */
  .payment-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: start;
  }

  @media (min-width: 992px) {
    .payment-grid {
      grid-template-columns: 1.35fr 1fr;
      gap: 48px;
    }
  }

  /* ===== LEFT COLUMN ===== */
  .payment-methods-col {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .timer-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(229, 196, 131, 0.05);
    border: 1px solid rgba(229, 196, 131, 0.2);
    border-radius: 16px;
    padding: 20px 24px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .timer-banner__left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .timer-banner__icon {
    color: #e5c483;
    flex-shrink: 0;
  }

  .timer-banner__eyebrow {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.2px;
    color: #e5c483;
    margin: 0 0 2px 0;
    text-transform: uppercase;
  }

  .timer-banner__clock {
    font-size: 24px;
    font-weight: 700;
    color: #e5c483;
    margin: 0;
    letter-spacing: 1px;
  }

  .timer-banner__badge {
    background: rgba(229, 196, 131, 0.1);
    border: 1px solid rgba(229, 196, 131, 0.2);
    color: #e5c483;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .payment-heading__title {
    font-size: 24px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0 0 8px 0;
  }

  .payment-heading__desc {
    font-size: 14px;
    color: #d0c5b5;
    margin: 0;
  }

  /* METHOD CARDS */
  .method-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .method-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 250ms ease;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
  }

  .method-card:hover {
    border-color: rgba(229, 196, 131, 0.4);
    background: rgba(255, 255, 255, 0.02);
  }

  .method-card--selected {
    background: rgba(255, 255, 255, 0.03);
    border-color: #e5c483;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .method-card__left {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .method-card__logo-box {
    width: 64px;
    height: 40px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    flex-shrink: 0;
  }

  .method-card__logo-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .method-card__info {
    display: flex;
    flex-direction: column;
  }

  .method-card__name {
    font-size: 16px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0 0 4px 0;
  }

  .method-card__type {
    font-size: 14px;
    color: #d0c5b5;
    margin: 0;
  }

  .va-details {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .va-number-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .va-number {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #e5c483;
    font-family: monospace;
  }

  .btn-copy {
    background: transparent;
    border: none;
    color: #e5c483;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    transition: background 200ms ease;
  }

  .btn-copy:hover {
    background: rgba(229, 196, 131, 0.1);
  }

  .va-account-name {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: rgba(208, 197, 181, 0.6);
    margin-top: 4px;
    text-transform: uppercase;
  }

  .radio-indicator {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 200ms ease;
  }

  .method-card--selected .radio-indicator {
    border-color: #e5c483;
  }

  .radio-indicator__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e5c483;
  }

  /* ===== RIGHT COLUMN SUMMARY ===== */
  .order-summary-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .summary-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 28px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .summary-card__title {
    font-size: 20px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0 0 20px 0;
  }

  .cart-item-preview {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cart-item-preview-list {
    display: grid;
    max-height: 340px;
    overflow: auto;
  }

  .cart-item-preview__thumb {
    width: 72px;
    height: 84px;
    border-radius: 10px;
    background: #201f1f;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cart-item-preview__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cart-item-preview__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-grow: 1;
  }

  .cart-item-preview__name {
    font-size: 14px;
    font-weight: 600;
    color: #e5e2e1;
    margin: 0;
  }

  .cart-item-preview__variant {
    font-size: 14px;
    color: #d0c5b5;
    margin: 0;
  }

  .cart-item-preview__price {
    font-size: 14px;
    font-weight: 600;
    color: #e5c483;
    margin: 4px 0 0 0;
  }

  .summary-breakdown {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .summary-row__label {
    color: #d0c5b5;
  }

  .summary-row__value {
    color: #e5e2e1;
    font-weight: 500;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .summary-total__label {
    font-size: 16px;
    color: #e5e2e1;
    font-weight: 500;
  }

  .summary-total__amount {
    font-size: 26px;
    font-weight: 700;
    color: #e5c483;
    margin: 0;
    line-height: 1;
  }

  .summary-total__sub {
    font-size: 14px;
    letter-spacing: 0.5px;
    color: #d0c5b5;
    text-align: right;
    margin-top: 4px;
  }

  .btn-confirm-payment {
    width: 100%;
    background: #e5c483;
    color: #050505;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 24px;
    box-shadow: 0 4px 20px rgba(229, 196, 131, 0.3);
    transition: all 250ms ease;
  }

  .btn-confirm-payment:hover {
    background: #f0d59e;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(229, 196, 131, 0.45);
  }

  .btn-confirm-payment:disabled {
    opacity: 0.58;
    cursor: wait;
    transform: none;
    box-shadow: none;
  }

  .security-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    color: #d0c5b5;
    margin-top: 16px;
  }

  .promo-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    gap: 12px;
  }

  .promo-input {
    flex-grow: 1;
    background: #0e0e0e;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px 16px;
    color: #e5e2e1;
    font-size: 14px;
    outline: none;
  }

  .promo-input:focus {
    border-color: #e5c483;
  }

  .btn-promo-apply {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e5e2e1;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms ease;
  }

  .btn-promo-apply:hover {
    border-color: #e5c483;
    color: #e5c483;
  }

  /* MODAL STYLES */
  .payment-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 12000;
    display: grid;
    width: 100vw;
    height: 100dvh;
    padding: 24px;
    place-items: center;
    overflow: hidden;
    overscroll-behavior: none;
    touch-action: none;
    background: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(12px);
    animation: paymentModalBackdropIn 180ms ease-out both;
  }

  .payment-modal-card {
    width: min(600px, 100%);
    max-height: calc(100dvh - 48px);
    padding: clamp(34px, 5vw, 48px);
    overflow: hidden;
    border: 1px solid rgba(229, 196, 131, 0.9);
    border-radius: 24px;
    background: #111111;
    text-align: center;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.72);
    animation: paymentModalCardIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .payment-modal-icon {
    display: grid;
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    place-items: center;
    border: 1px solid #e5c483;
    border-radius: 50%;
    background: rgba(229, 196, 131, 0.12);
    color: #e5c483;
    font-size: 38px;
    font-weight: 500;
    line-height: 1;
  }

  .payment-modal-title {
    margin: 0 0 14px;
    color: #f2f0ed;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: clamp(26px, 4vw, 32px);
    font-weight: 700;
    line-height: 1.2;
  }

  .payment-modal-desc {
    max-width: 490px;
    margin: 0 auto 34px;
    color: #cfc7bd;
    font-size: 15px;
    line-height: 1.65;
  }

  .payment-modal-btn {
    width: 100%;
    min-height: 66px;
    padding: 16px 24px;
    border: 0;
    border-radius: 14px;
    background: #e5c483;
    color: #0a0a0a;
    cursor: pointer;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  }

  .payment-modal-btn:hover,
  .payment-modal-btn:focus-visible {
    background: #efd497;
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(229, 196, 131, 0.2);
  }

  .payment-modal-btn:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 3px;
  }

  @keyframes paymentModalBackdropIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes paymentModalCardIn {
    from { opacity: 0; transform: translateY(10px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (max-width: 560px) {
    .payment-modal-backdrop { padding: 16px; }
    .payment-modal-card {
      max-height: calc(100dvh - 32px);
      padding: 30px 22px;
      border-radius: 20px;
    }
    .payment-modal-icon {
      width: 68px;
      height: 68px;
      margin-bottom: 20px;
      font-size: 32px;
    }
    .payment-modal-desc { margin-bottom: 26px; }
    .payment-modal-btn { min-height: 58px; }
  }

  @media (max-height: 620px) {
    .payment-modal-card { padding: 24px 28px; }
    .payment-modal-icon {
      width: 58px;
      height: 58px;
      margin-bottom: 14px;
      font-size: 28px;
    }
    .payment-modal-title { margin-bottom: 8px; font-size: 24px; }
    .payment-modal-desc {
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 1.5;
    }
    .payment-modal-btn { min-height: 52px; padding: 12px 18px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .payment-modal-backdrop,
    .payment-modal-card {
      animation: none !important;
    }
  }

  /* ===== MOBILE RESPONSIVE UX ===== */
  @media (max-width: 991px) {
    .payment-container {
      padding: 100px 20px 60px 20px;
    }

    .payment-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
      width: 100%;
    }

    .payment-methods-col {
      width: min(100%, 680px);
      margin: 0 auto;
    }

    .order-summary-col {
      order: 2;
      width: min(100%, 680px);
      margin: 0 auto;
    }
  }

  .method-card {
    width: 100%;
    text-align: left;
  }

  .promo-feedback {
    margin: -12px 4px 0;
    color: #e5c483;
    font-size: 14px;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .timer-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .va-number-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .summary-card {
      padding: 20px;
    }
  }
`;

const paymentMethods = [
  {
    id: "bca",
    brand: "bca" as const,
    title: "BCA Virtual Account",
    description: "Transfer manual atau verifikasi otomatis",
    virtualAccount: "8092 0122 3445 990",
  },
  {
    id: "mandiri",
    brand: "mandiri" as const,
    title: "Mandiri Virtual Account",
    description: "Direct Bank Transfer",
    virtualAccount: "8830 8912 0041 882",
  },
  {
    id: "bri",
    brand: "bri" as const,
    title: "BRI Virtual Account",
    description: "BRIVA Automated Verification",
    virtualAccount: "1294 0018 7654 321",
  },
] as const;

const PaymentPage = () => {
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
  const [selectedMethod, setSelectedMethod] = useState<string>("bca");
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(86400);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totals = cartItem ? calculateStudioItemsTotals(cartItems, discount) : null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return [hours, minutes, remainingSeconds]
      .map((value) => value.toString().padStart(2, "0"))
      .join(":");
  };

  const handleCopyVa = async (methodId: string, virtualAccount: string) => {
    try {
      await navigator.clipboard.writeText(virtualAccount.replace(/\s/g, ""));
      setCopiedMethod(methodId);
      window.setTimeout(() => setCopiedMethod(null), 2000);
    } catch {
      setCopiedMethod(null);
    }
  };

  const handleApplyPromo = (event: FormEvent) => {
    event.preventDefault();
    if (!cartItem) return;

    if (promoCode.trim().toUpperCase() === "MAHREEN10") {
      const promoDiscount = Math.round(
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 0.1,
      );
      setDiscount(promoDiscount);
      setPromoMessage("Kode MAHREEN10 berhasil dipakai. Diskon 10% telah diterapkan.");
      return;
    }

    setDiscount(0);
    setPromoMessage(promoCode.trim() ? "Kode promo tidak valid atau sudah kedaluwarsa." : "Masukkan kode promo terlebih dahulu.");
  };

  const handleConfirmPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPaymentError("");

    try {
      const order = await studioOrderService.placeOrder(selectedMethod, discount);

      if (!order) {
        setPaymentError("Data checkout belum lengkap. Kembali ke tahap alamat pengiriman terlebih dahulu.");
        return;
      }

      setIsSuccessModalOpen(true);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Pesanan belum dapat diproses. Silakan coba kembali.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const customerName = checkout?.shipping.fullName || user?.fullName || "Pelanggan Mahreen";

  if (!cartItem) {
    return (
      <PurchasePageShell
        pageClassName="payment-page"
        styleName="mahreen-payment"
        styles={paymentStyles}
        showClosing={false}
      >
        <PurchaseEmptyState
          title="Belum ada produk untuk dibayar"
          description="Pilih produk, warna, ukuran, dan jumlah terlebih dahulu. Pilihan Anda akan tersimpan secara lokal sampai backend transaksi dihubungkan."
          actionLabel="Pilih Produk"
          onAction={() => navigateToHashRoute("/mahreen-studio/latest-collection")}
        />
      </PurchasePageShell>
    );
  }

  if (!checkout || !totals) {
    return (
      <PurchasePageShell
        pageClassName="payment-page"
        styleName="mahreen-payment"
        styles={paymentStyles}
        showClosing={false}
      >
        <PurchaseEmptyState
          eyebrow="Checkout belum lengkap"
          title="Lengkapi alamat pengiriman"
          description="Produk sudah tersimpan, tetapi data penerima belum lengkap. Lanjutkan dari ringkasan pesanan agar pembayaran terhubung dengan produk yang benar."
          actionLabel="Lengkapi Checkout"
          onAction={() => navigateToHashRoute("/mahreen-studio/order-summary")}
        />
      </PurchasePageShell>
    );
  }

  return (
    <PurchasePageShell
      pageClassName="payment-page"
      styleName="mahreen-payment"
      styles={paymentStyles}
    >
      <main className="payment-container">
        <PurchaseProgress activeStep={2} prefix="payment-steps" />

        <div className="payment-grid">
          <div className="payment-methods-col">
            <div className="timer-banner">
              <div className="timer-banner__left">
                <svg className="timer-banner__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div>
                  <p className="timer-banner__eyebrow">SELESAIKAN DALAM</p>
                  <p className="timer-banner__clock"><time>{formatTime(timeLeft)}</time></p>
                </div>
              </div>
              <span className="timer-banner__badge">Verifikasi Otomatis</span>
            </div>

            <div className="payment-heading">
              <h1 className="payment-heading__title">Metode Pembayaran</h1>
              <p className="payment-heading__desc">Pilih virtual account untuk menyelesaikan pembelian Mahreen Studio.</p>
              {paymentError ? <p className="promo-feedback" role="alert">{paymentError}</p> : null}
            </div>

            <div className="method-list" role="radiogroup" aria-label="Pilih metode pembayaran">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  {...method}
                  selected={selectedMethod === method.id}
                  copied={copiedMethod === method.id}
                  onSelect={setSelectedMethod}
                  onCopy={(virtualAccount) => handleCopyVa(method.id, virtualAccount)}
                />
              ))}
            </div>
          </div>

          <PaymentSummaryCard
            items={cartItems}
            {...totals}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromo={handleApplyPromo}
            promoMessage={promoMessage}
            onConfirm={handleConfirmPayment}
            isConfirming={isProcessing}
          />
        </div>
      </main>

      {isSuccessModalOpen ? (
        <PaymentSuccessModal
          customerName={customerName}
          onContinue={() => navigateToHashRoute("/mahreen-studio/review")}
        />
      ) : null}
    </PurchasePageShell>
  );
};

export default PaymentPage;
