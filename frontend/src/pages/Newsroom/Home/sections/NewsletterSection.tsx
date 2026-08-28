import { useState, type FormEvent } from "react";

const styles = `
  .newsroom-newsletter {
    padding-top: clamp(58px, 7vw, 90px);
    padding-bottom: clamp(60px, 8vw, 110px);
  }

  .newsroom-newsletter__panel {
    max-width: 100%;
    min-width: 0;
    overflow-x: clip;
    padding: clamp(40px, 5.2vw, 70px);
    background: #38342f;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .newsroom-newsletter h2 {
    margin: 0;
    color: #eee7de;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: 400;
    overflow-wrap: break-word;
    text-wrap: balance;
  }

  .newsroom-newsletter p {
    max-width: 700px;
    margin: 12px 0 0;
    color: #aaa39a;
    font-size: 12px;
    line-height: 1.7;
  }

  .newsroom-newsletter form {
    display: grid;
    max-width: 760px;
    margin-top: 26px;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;
  }

  .newsroom-newsletter input {
    min-width: 0;
    height: 48px;
    padding: 0 16px;
    border: 1px solid transparent;
    outline: 0;
    color: #eee8df;
    background: #292622;
    font-size: 12px;
  }

  .newsroom-newsletter input:focus {
    border-color: var(--newsroom-gold);
  }

  .newsroom-newsletter input::placeholder {
    color: #77716a;
  }

  .newsroom-newsletter button {
    min-height: 48px;
    padding: 0 28px;
    border: 1px solid var(--newsroom-gold);
    color: #251e14;
    background: var(--newsroom-gold);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 180ms ease, border-color 180ms ease;
  }

  .newsroom-newsletter button:hover,
  .newsroom-newsletter button:focus-visible {
    background: var(--newsroom-gold-light);
    border-color: var(--newsroom-gold-light);
  }

  .newsroom-newsletter__success {
    width: fit-content;
    margin-top: 26px;
    padding: 15px 20px;
    color: #2b2317;
    background: var(--newsroom-gold);
    font-size: 12px;
  }

  @media (max-width: 720px) {
    .newsroom-newsletter form {
      grid-template-columns: 1fr;
    }
  }
`;

const NewsletterSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className="newsroom-newsletter newsroom-content-section"
        aria-labelledby="newsletter-title"
      >
        <div className="newsroom-newsletter__panel" data-newsroom-reveal>
          <h2 id="newsletter-title">
            Tetap Terhubung dengan Mahreen Indonesia
          </h2>
          <p>
            Dapatkan update eksklusif mengenai insight bisnis, teknologi, dan
            kesempatan berkarier langsung ke email Anda.
          </p>

          {isSubmitted ? (
            <div className="newsroom-newsletter__success" role="status">
              Terima kasih. Email Anda sudah terdaftar.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                autoComplete="name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Anda"
                autoComplete="email"
                required
              />
              <button type="submit">Langganan</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsletterSection;
