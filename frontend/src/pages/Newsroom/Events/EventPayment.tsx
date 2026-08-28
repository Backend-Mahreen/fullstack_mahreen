import { useState } from "react";
import { CreditCard, QrCode, ArrowLeft } from "lucide-react";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";

type EventPaymentProps = {
  eventId: string;
  registrationId: string;
  eventTitle: string;
  eventPrice: number;
  onSuccess: () => void;
  onBack: () => void;
};

type PaymentMethod = "bri_va" | "qris";

const EventPayment = ({
  eventId,
  registrationId,
  eventTitle,
  eventPrice,
  onSuccess,
  onBack,
}: EventPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const result = await apiClient<{
        orderId: string;
        payment?: {
          token?: string;
          redirect_url?: string;
          _warning?: string;
        };
      }>(API_ENDPOINTS.events.payment(eventId), {
        method: "POST",
        body: {
          registrationId,
          method: selectedMethod === "bri_va" ? "bri_va" : "qris",
        },
      });

      if (result.payment?.redirect_url) {
        window.location.href = result.payment.redirect_url;
      } else if (result.payment?._warning) {
        setError(result.payment._warning);
        setTimeout(() => onSuccess(), 2000);
      } else {
        onSuccess();
      }
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Gagal memproses pembayaran. Silakan coba lagi.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-payment">
      <style>{`
        .event-payment {
          width: min(100%, 560px);
          margin: 0 auto;
          padding: 40px 24px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .event-payment__header {
          margin-bottom: 32px;
        }
        .event-payment__header h2 {
          margin: 0 0 8px;
          color: #f1ece5;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 400;
        }
        .event-payment__header p {
          margin: 0;
          color: #aaa39a;
          font-size: 14px;
        }
        .event-payment__summary {
          padding: 16px;
          margin-bottom: 28px;
          border: 1px solid rgba(229, 196, 119, 0.2);
          border-radius: 8px;
          background: rgba(229, 196, 119, 0.04);
        }
        .event-payment__summary h3 {
          margin: 0 0 8px;
          color: #e5c477;
          font-size: 16px;
        }
        .event-payment__summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          color: #c5c0b7;
          font-size: 13px;
        }
        .event-payment__summary-row strong {
          color: #f4efe8;
        }
        .event-payment__total {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #e5c477;
          font-size: 15px;
          font-weight: 700;
        }
        .event-payment__methods {
          display: grid;
          gap: 12px;
          margin-bottom: 28px;
        }
        .event-payment__methods-label {
          color: #c5c0b7;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .event-payment__method {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          background: transparent;
          color: #d8d2c9;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 180ms ease, background 180ms ease;
          text-align: left;
        }
        .event-payment__method:hover {
          border-color: rgba(229, 196, 119, 0.3);
          background: rgba(229, 196, 119, 0.04);
        }
        .event-payment__method.is-active {
          border-color: rgba(229, 196, 119, 0.5);
          background: rgba(229, 196, 119, 0.08);
          color: #e5c477;
        }
        .event-payment__method svg {
          color: #b7a45f;
          flex-shrink: 0;
        }
        .event-payment__method-info {
          display: grid;
          gap: 2px;
        }
        .event-payment__method-name {
          font-weight: 600;
        }
        .event-payment__method-desc {
          color: #8a857b;
          font-size: 12px;
        }
        .event-payment__error {
          padding: 10px 14px;
          margin-bottom: 16px;
          border-radius: 6px;
          background: rgba(211, 76, 57, 0.1);
          border: 1px solid rgba(211, 76, 57, 0.3);
          color: #ef9a8e;
          font-size: 13px;
        }
        .event-payment__actions {
          display: flex;
          gap: 12px;
        }
        .event-payment__pay {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          background: linear-gradient(135deg, #f7d559, #eab932);
          color: #151208;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 180ms ease;
        }
        .event-payment__pay:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .event-payment__back {
          padding: 12px 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          background: transparent;
          color: #d8d2c9;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 180ms ease;
        }
        .event-payment__back:hover {
          border-color: rgba(229, 196, 119, 0.4);
          color: #e5c477;
        }
        .event-payment__note {
          margin-top: 20px;
          padding: 12px;
          border-radius: 6px;
          background: rgba(229, 196, 119, 0.06);
          color: #8a857b;
          font-size: 12px;
          line-height: 1.6;
        }
      `}</style>

      <div className="event-payment__header">
        <h2>Pembayaran</h2>
        <p>Pilih metode pembayaran dan selesaikan transaksi.</p>
      </div>

      <div className="event-payment__summary">
        <h3>{eventTitle}</h3>
        <div className="event-payment__summary-row">
          <span>Jenis Tiket</span>
          <strong>Berbayar</strong>
        </div>
        <div className="event-payment__total">
          <span>Total</span>
          <span>Rp {eventPrice.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="event-payment__methods">
        <span className="event-payment__methods-label">Metode Pembayaran</span>

        <button
          type="button"
          className={`event-payment__method ${selectedMethod === "qris" ? "is-active" : ""}`}
          onClick={() => setSelectedMethod("qris")}
        >
          <QrCode size={20} />
          <div className="event-payment__method-info">
            <span className="event-payment__method-name">QRIS</span>
            <span className="event-payment__method-desc">
              Scan QR dari semua bank & e-wallet
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`event-payment__method ${selectedMethod === "bri_va" ? "is-active" : ""}`}
          onClick={() => setSelectedMethod("bri_va")}
        >
          <CreditCard size={20} />
          <div className="event-payment__method-info">
            <span className="event-payment__method-name">BRI Virtual Account</span>
            <span className="event-payment__method-desc">
              Bayar melalui BRI VA (ATM, mobile banking, internet banking)
            </span>
          </div>
        </button>
      </div>

      {error ? <div className="event-payment__error">{error}</div> : null}

      <div className="event-payment__actions">
        <button type="button" className="event-payment__back" onClick={onBack}>
          <ArrowLeft size={14} /> Kembali
        </button>
        <button
          type="button"
          className="event-payment__pay"
          onClick={handlePay}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Memproses..."
            : `Bayar Rp ${eventPrice.toLocaleString("id-ID")}`}
        </button>
      </div>

      <div className="event-payment__note">
        Setelah menekan tombol bayar, Anda akan diarahkan ke halaman pembayaran
        Midtrans. Selesaikan pembayaran sesuai metode yang dipilih. Status
        registrasi akan otomatis terupdate setelah pembayaran berhasil.
      </div>
    </div>
  );
};

export default EventPayment;
