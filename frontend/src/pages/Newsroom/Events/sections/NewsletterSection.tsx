import { useState, type FormEvent } from "react";

const NEWSLETTER_KEY = "mahreen:newsroom:event-newsletter";

const NewsletterSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setMessage("Isi nama dan email aktif dengan format yang benar.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) ?? "[]") as Array<{
      name: string;
      email: string;
      createdAt: string;
    }>;
    const withoutDuplicate = existing.filter((entry) => entry.email !== normalizedEmail);
    localStorage.setItem(
      NEWSLETTER_KEY,
      JSON.stringify([
        ...withoutDuplicate,
        { name: name.trim(), email: normalizedEmail, createdAt: new Date().toISOString() },
      ]),
    );
    setMessage("Berhasil. Update event akan dikirim ke email Anda.");
    setName("");
    setEmail("");
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
          <button className="btn-subscribe" type="submit">Langganan</button>
        </form>
        <p role="status" aria-live="polite" style={{ minHeight: 20, marginTop: 14, color: "var(--newsroom-gold)" }}>
          {message}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
