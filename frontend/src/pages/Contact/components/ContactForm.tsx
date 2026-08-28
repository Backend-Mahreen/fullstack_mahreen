import { useEffect, useState, type FormEvent } from "react";
import { Check, Send, X } from "lucide-react";
import { publicEngagementService } from "../../../services/engagement/publicEngagementService";

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  partnership: string;
  details: string;
};

const partnershipOptions = [
  { value: "", label: "Pilih pilar atau kebutuhan kolaborasi" },
  { value: "business", label: "Tanya Mahreen - Business Solutions" },
  { value: "studio", label: "Mahreen Studio" },
  { value: "csr", label: "Mahreen CSR" },
  { value: "peduli", label: "Peduli Mahreen" },
  { value: "internship", label: "Mahreen Indonesia Internship" },
  { value: "media", label: "Newsroom & Media Partnership" },
  { value: "general", label: "Kolaborasi Umum" },
] as const;

const getInitialPartnership = () => {
  if (typeof window === "undefined") return "";

  const query = window.location.search.replace(/^\?/, "");
  const requestedPillar = new URLSearchParams(query).get("pillar") ?? "";
  return partnershipOptions.some((option) => option.value === requestedPillar)
    ? requestedPillar
    : "";
};

const createInitialForm = (): ContactFormState => ({
  name: "",
  email: "",
  company: "",
  partnership: getInitialPartnership(),
  details: "",
});

const contactFormStyles = `
  .contact-form-card {
    padding: clamp(30px, 3vw, 48px);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 22px;
    background: #121212;
  }

  .contact-form-card,
  .contact-form-card *,
  .contact-success-modal,
  .contact-success-modal * {
    box-sizing: border-box;
  }

  .contact-form-card__title {
    margin: 0;
    color: #f1ede7;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(30px, 2.4vw, 40px);
    font-weight: 600;
    line-height: 1;
  }

  .contact-form-card__intro {
    max-width: 690px;
    margin: 13px 0 29px;
    color: #737379;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }

  .contact-form {
    display: grid;
    gap: 19px;
  }

  .contact-form__field {
    display: grid;
    gap: 9px;
  }

  .contact-form__label {
    color: #a98a5e;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.65px;
    text-transform: uppercase;
  }

  .contact-form__control {
    width: 100%;
    min-height: 51px;
    padding: 0 17px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    outline: none;
    background: #070707;
    color: #f4f4f5;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  .contact-form__control::placeholder {
    color: #696970;
  }

  .contact-form__control:focus {
    border-color: rgba(203, 168, 112, 0.62);
    box-shadow: 0 0 0 3px rgba(203, 168, 112, 0.08);
  }

  .contact-form__control--select {
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, #9c7d50 50%),
      linear-gradient(135deg, #9c7d50 50%, transparent 50%);
    background-position:
      calc(100% - 20px) 22px,
      calc(100% - 15px) 22px;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
  }

  .contact-form__control--textarea {
    min-height: 133px;
    padding-top: 16px;
    resize: vertical;
    border-color: rgba(203, 168, 112, 0.34);
  }

  .contact-form__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 100%;
    min-height: 52px;
    margin-top: 7px;
    padding: 0 22px;
    border: 1px solid #dfbd78;
    border-radius: 999px;
    background: #d0ad78;
    color: #17120c;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 11px 23px rgba(208, 173, 120, 0.22);
    transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
  }

  .contact-form__button:hover,
  .contact-form__button:focus-visible {
    background: #dfbd78 !important;
    color: #17120c !important;
    border-color: #efd18e !important;
    transform: translateY(-1px);
    filter: brightness(1.04);
    box-shadow: 0 14px 30px rgba(208, 173, 120, 0.3) !important;
  }

  .contact-form__button svg {
    width: 17px;
    height: 17px;
  }

  .contact-form__status {
    margin: -5px 0 0;
    color: #d8b66f;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  .contact-success-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2400;
    display: grid;
    padding: 24px;
    place-items: center;
    background: rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(12px);
    animation: contact-backdrop-in 220ms ease both;
  }

  .contact-success-modal {
    position: relative;
    width: min(100%, 610px);
    overflow: hidden;
    padding: clamp(40px, 6vw, 68px) clamp(28px, 6vw, 56px) clamp(30px, 5vw, 44px);
    border: 1px solid rgba(222, 188, 116, 0.34);
    border-radius: 28px;
    background:
      radial-gradient(circle at 50% 0%, rgba(216, 182, 111, 0.16), transparent 37%),
      linear-gradient(145deg, #14120e 0%, #080808 58%, #050505 100%);
    color: #f5f0e8;
    text-align: center;
    box-shadow:
      0 34px 90px rgba(0, 0, 0, 0.68),
      0 0 50px rgba(216, 182, 111, 0.1);
    animation: contact-modal-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .contact-success-modal::before {
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    content: "";
    background: linear-gradient(90deg, transparent, #e1bd72, transparent);
  }

  .contact-success-modal__close-icon {
    position: absolute;
    top: 18px;
    right: 18px;
    display: grid;
    width: 42px;
    height: 42px;
    padding: 0;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.025) !important;
    color: rgba(255, 255, 255, 0.76) !important;
    cursor: pointer;
  }

  .contact-success-modal__close-icon:hover,
  .contact-success-modal__close-icon:focus-visible {
    border-color: rgba(216, 182, 111, 0.64) !important;
    background: rgba(216, 182, 111, 0.09) !important;
    color: #e1bd72 !important;
    box-shadow: 0 0 20px rgba(216, 182, 111, 0.14) !important;
  }

  .contact-success-modal__icon {
    display: grid;
    width: 94px;
    height: 94px;
    margin: 0 auto 26px;
    place-items: center;
    border: 1px solid rgba(225, 189, 114, 0.62);
    border-radius: 50%;
    background: rgba(216, 182, 111, 0.08);
    color: #efd18e;
    box-shadow:
      0 0 0 12px rgba(216, 182, 111, 0.035),
      0 0 36px rgba(216, 182, 111, 0.17);
  }

  .contact-success-modal__icon svg {
    width: 38px;
    height: 38px;
    stroke-width: 2;
  }

  .contact-success-modal__eyebrow {
    margin: 0 0 18px;
    color: #d8b66f;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .contact-success-modal__title {
    margin: 0;
    color: #f6f1e9;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(38px, 7vw, 58px);
    font-weight: 600;
    line-height: 0.98;
  }

  .contact-success-modal__copy {
    max-width: 470px;
    margin: 22px auto 32px;
    color: rgba(255, 255, 255, 0.58);
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.8;
  }

  .contact-success-modal__button {
    width: min(100%, 300px);
    min-height: 56px;
    padding: 0 28px;
    border: 1px solid rgba(225, 189, 114, 0.62);
    border-radius: 999px;
    background: transparent !important;
    color: #f3e9d4 !important;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .contact-success-modal__button:hover,
  .contact-success-modal__button:focus-visible {
    border-color: #e4c37e !important;
    background: rgba(216, 182, 111, 0.1) !important;
    color: #f6d990 !important;
    box-shadow: 0 0 26px rgba(216, 182, 111, 0.16) !important;
    transform: translateY(-1px);
  }

  @keyframes contact-backdrop-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes contact-modal-in {
    from {
      opacity: 0;
      transform: translateY(26px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 560px) {
    .contact-form-card {
      padding: 28px 20px;
      border-radius: 18px;
    }

    .contact-success-backdrop {
      padding: 16px;
    }

    .contact-success-modal {
      border-radius: 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-success-backdrop,
    .contact-success-modal {
      animation: none;
    }
  }
`;

const ContactForm = () => {
  const [form, setForm] = useState<ContactFormState>(createInitialForm);
  const [status, setStatus] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSuccessOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSuccessOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSuccessOpen]);

  const setField = (field: keyof ContactFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(form.email.trim()) ||
      !form.partnership ||
      !form.details.trim()
    ) {
      setStatus("Lengkapi seluruh kolom wajib sebelum mengirim formulir.");
      return;
    }

    setStatus("");
    setIsSubmitting(true);

    try {
      await publicEngagementService.submitContact({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim() || undefined,
        partnership: form.partnership,
        details: form.details.trim(),
      });
      setIsSuccessOpen(true);
      setForm(createInitialForm());
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Pesan belum dapat dikirim. Silakan coba kembali.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style data-component="contact-form">{contactFormStyles}</style>
      <section className="contact-form-card" aria-labelledby="contact-form-title">
        <h2 className="contact-form-card__title" id="contact-form-title">Hubungi Kami</h2>
        <p className="contact-form-card__intro">
          Isi detail kebutuhan Anda. Tim Mahreen Indonesia akan meninjau pesan dan menghubungi Anda melalui email yang didaftarkan.
        </p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label className="contact-form__field">
            <span className="contact-form__label">Nama Lengkap *</span>
            <input
              className="contact-form__control"
              type="text"
              autoComplete="name"
              placeholder="Masukkan nama lengkap Anda"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              required
            />
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">Alamat Email *</span>
            <input
              className="contact-form__control"
              type="email"
              autoComplete="email"
              placeholder="Masukkan email aktif Anda"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              required
            />
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">Perusahaan / Institusi (Opsional)</span>
            <input
              className="contact-form__control"
              type="text"
              autoComplete="organization"
              placeholder="Nama perusahaan atau universitas Anda"
              value={form.company}
              onChange={(event) => setField("company", event.target.value)}
            />
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">Pilar Kemitraan *</span>
            <select
              className="contact-form__control contact-form__control--select"
              value={form.partnership}
              onChange={(event) => setField("partnership", event.target.value)}
              required
            >
              {partnershipOptions.map((option) => (
                <option key={option.value || "placeholder"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">Detail Kolaborasi / Rencana Proyek *</span>
            <textarea
              className="contact-form__control contact-form__control--textarea"
              placeholder="Tuliskan gagasan, ide proyek, atau pertanyaan kerja sama Anda di sini..."
              value={form.details}
              onChange={(event) => setField("details", event.target.value)}
              required
            />
          </label>

          {status && <p className="contact-form__status" role="status">{status}</p>}

          <button className="contact-form__button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
            <Send aria-hidden="true" />
          </button>
        </form>
      </section>

      {isSuccessOpen && (
        <div
          className="contact-success-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSuccessOpen(false);
          }}
        >
          <section
            className="contact-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            aria-describedby="contact-success-description"
          >
            <button
              className="contact-success-modal__close-icon"
              type="button"
              aria-label="Tutup pemberitahuan"
              onClick={() => setIsSuccessOpen(false)}
            >
              <X aria-hidden="true" />
            </button>

            <div className="contact-success-modal__icon" aria-hidden="true">
              <Check />
            </div>
            <p className="contact-success-modal__eyebrow">Submission Confirmed</p>
            <h2 className="contact-success-modal__title" id="contact-success-title">
              Pengiriman Berhasil
            </h2>
            <p className="contact-success-modal__copy" id="contact-success-description">
              Pesan Anda sudah kami terima. Tim Mahreen Indonesia akan memeriksa detailnya dan menghubungi Anda melalui email yang didaftarkan.
            </p>
            <button
              className="contact-success-modal__button"
              type="button"
              onClick={() => setIsSuccessOpen(false)}
            >
              Tutup
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default ContactForm;
