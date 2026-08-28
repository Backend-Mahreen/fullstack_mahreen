import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";

type EventRegistrationProps = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventAccessType: string;
  eventPrice?: number;
  onSuccess: (registrationId: string) => void;
  onBack: () => void;
};

type RegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
};

const EventRegistration = ({
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
  eventAccessType,
  eventPrice,
  onSuccess,
  onBack,
}: EventRegistrationProps) => {
  const { user } = useAuth();
  const [form, setForm] = useState<RegistrationPayload>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.whatsapp || "",
    institution: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof RegistrationPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Nama lengkap dan email wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiClient<{
        id: string;
        status: string;
      }>(API_ENDPOINTS.events.register(eventId), {
        method: "POST",
        body: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          institution: form.institution.trim(),
        },
      });
      onSuccess(result.id);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Gagal mendaftar event. Silakan coba lagi.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (value: string) => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="event-registration">
      <style>{`
        .event-registration {
          width: min(100%, 560px);
          margin: 0 auto;
          padding: 40px 24px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .event-registration__header {
          margin-bottom: 32px;
        }
        .event-registration__header h2 {
          margin: 0 0 8px;
          color: #f1ece5;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 400;
        }
        .event-registration__header p {
          margin: 0;
          color: #aaa39a;
          font-size: 14px;
        }
        .event-registration__event-info {
          display: grid;
          gap: 12px;
          padding: 16px;
          margin-bottom: 28px;
          border: 1px solid rgba(229, 196, 119, 0.2);
          border-radius: 8px;
          background: rgba(229, 196, 119, 0.04);
        }
        .event-registration__event-info h3 {
          margin: 0;
          color: #e5c477;
          font-size: 16px;
          font-weight: 600;
        }
        .event-registration__event-info span {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #aaa39a;
          font-size: 13px;
        }
        .event-registration__event-info svg {
          color: #b7a45f;
        }
        .event-registration__form {
          display: grid;
          gap: 16px;
        }
        .event-registration__field {
          display: grid;
          gap: 6px;
        }
        .event-registration__field label {
          color: #c5c0b7;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .event-registration__field input {
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          background: #0a0a0a;
          color: #f4efe8;
          font-size: 14px;
          outline: none;
          transition: border-color 180ms ease;
        }
        .event-registration__field input:focus {
          border-color: rgba(229, 196, 119, 0.5);
        }
        .event-registration__field input::placeholder {
          color: #5c584f;
        }
        .event-registration__error {
          padding: 10px 14px;
          border-radius: 6px;
          background: rgba(211, 76, 57, 0.1);
          border: 1px solid rgba(211, 76, 57, 0.3);
          color: #ef9a8e;
          font-size: 13px;
        }
        .event-registration__actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .event-registration__submit {
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
        .event-registration__submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .event-registration__back {
          padding: 12px 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          background: transparent;
          color: #d8d2c9;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 180ms ease;
        }
        .event-registration__back:hover {
          border-color: rgba(229, 196, 119, 0.4);
          color: #e5c477;
        }
        .event-registration__price {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #c5c0b7;
          font-size: 13px;
        }
        .event-registration__price strong {
          color: #e5c477;
          font-size: 15px;
        }
      `}</style>

      <div className="event-registration__header">
        <h2>Daftar Event</h2>
        <p>Isi data diri Anda untuk mendaftar event ini.</p>
      </div>

      <div className="event-registration__event-info">
        <h3>{eventTitle}</h3>
        {eventDate ? (
          <span>
            <CalendarDays size={14} />
            {formatDate(eventDate)}
          </span>
        ) : null}
        {eventLocation ? (
          <span>
            <MapPin size={14} />
            {eventLocation}
          </span>
        ) : null}
        <span>
          {eventAccessType === "FREE" ? "Gratis" : "Berbayar"}
          {eventPrice ? ` - Rp ${eventPrice.toLocaleString("id-ID")}` : ""}
        </span>
      </div>

      <form className="event-registration__form" onSubmit={handleSubmit}>
        <div className="event-registration__field">
          <label htmlFor="reg-fullname">Nama Lengkap *</label>
          <input
            id="reg-fullname"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
          />
        </div>

        <div className="event-registration__field">
          <label htmlFor="reg-email">Email *</label>
          <input
            id="reg-email"
            type="email"
            placeholder="contoh@email.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="event-registration__field">
          <label htmlFor="reg-phone">Nomor Telepon</label>
          <input
            id="reg-phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div className="event-registration__field">
          <label htmlFor="reg-institution">Institusi / Organisasi</label>
          <input
            id="reg-institution"
            type="text"
            placeholder="Nama kampus atau perusahaan"
            value={form.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
          />
        </div>

        {eventAccessType !== "FREE" && eventPrice ? (
          <div className="event-registration__price">
            <span>Total Pembayaran</span>
            <strong>Rp {eventPrice.toLocaleString("id-ID")}</strong>
          </div>
        ) : null}

        {error ? <div className="event-registration__error">{error}</div> : null}

        <div className="event-registration__actions">
          <button type="button" className="event-registration__back" onClick={onBack}>
            Kembali
          </button>
          <button
            type="submit"
            className="event-registration__submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Memproses..."
              : eventAccessType === "FREE"
                ? "Daftar Sekarang"
                : "Lanjut ke Pembayaran"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistration;
