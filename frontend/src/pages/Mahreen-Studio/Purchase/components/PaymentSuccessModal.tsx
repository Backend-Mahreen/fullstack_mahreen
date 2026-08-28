import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PaymentSuccessModalProps = {
  customerName: string;
  onContinue: () => void;
};

const PaymentSuccessModal = ({ customerName, onContinue }: PaymentSuccessModalProps) => {
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const previousBodyStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const previousHtmlOverflow = html.style.overflow;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      continueButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      body.style.position = previousBodyStyle.position;
      body.style.top = previousBodyStyle.top;
      body.style.left = previousBodyStyle.left;
      body.style.right = previousBodyStyle.right;
      body.style.width = previousBodyStyle.width;
      body.style.overflow = previousBodyStyle.overflow;
      html.style.overflow = previousHtmlOverflow;
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, []);

  return createPortal(
    <div
      className="payment-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-success-title"
      aria-describedby="payment-success-description"
    >
      <div className="payment-modal-card">
        <div className="payment-modal-icon" aria-hidden="true">✓</div>
        <h2 className="payment-modal-title" id="payment-success-title">
          Pembayaran Dikonfirmasi!
        </h2>
        <p className="payment-modal-desc" id="payment-success-description">
          Terima kasih, {customerName}. Transaksi Anda telah dicatat dan pesanan akan segera diproses.
        </p>
        <button
          ref={continueButtonRef}
          className="payment-modal-btn"
          type="button"
          onClick={onContinue}
        >
          Lihat Status &amp; Ringkasan Pesanan
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default PaymentSuccessModal;
