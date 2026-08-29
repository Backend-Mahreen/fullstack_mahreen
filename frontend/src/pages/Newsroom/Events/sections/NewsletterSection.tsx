import { useState, type FormEvent } from "react";
import { apiClient } from "../../../../api/apiClient";
import { API_ENDPOINTS } from "../../../../api/endpoints";

const NewsletterSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setMessage("Isi nama dan email aktif dengan format yang benar.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient(API_ENDPOINTS.engagement.newsletterSubscriptions, {
        method: "POST",
        body: {
          email: normalizedEmail,
          name: name.trim(),
          source: "newsroom",
        },
      });
      setMessage("Berhasil. Update event akan dikirim ke email Anda.");
      setName("");
      setEmail("");
    } catch {
      setMessage("Gagal berlangganan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="event-newsletter-section newsroom-content-section">
      <div className="event-newsletter-box" data-newsroom-reveal>
        <h3>Jangan Lewatkan Event Berikutnya</h3>
        <p>Dapatkan update eksklusif mengenai insight, teknologi, dan kesempatan berkarier langsung ke email Anda.</p>
        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-label="Nama lengkap"
          />
          <input
            type="email"
            placeholder="Email Anda"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label="Email"
          />
          <button className="btn-subscribe" type="submit" disabled={submitting}>
            {submitting ? "Mengirim..." : "Langganan"}
          </button>
        </form>
        <p role="status" aria-live="polite" style={{ minHeight: 20, marginTop: 14, color: "var(--newsroom-gold)" }}>
          {message}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
