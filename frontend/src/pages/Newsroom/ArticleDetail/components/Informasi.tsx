import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail } from "lucide-react";

const styles = `
  .article-information {
    width: 100%;
    padding: 30px 28px;
    overflow: hidden;
    border: 1px solid rgba(229, 196, 119, 0.42);
    border-radius: 14px;
    color: #211d17;
    background:
      radial-gradient(circle at 85% 0%, rgba(255, 255, 255, 0.32), transparent 34%),
      linear-gradient(145deg, #e8c978 0%, #d4ae58 100%);
    box-shadow: 0 26px 65px rgba(0, 0, 0, 0.3);
  }

  .article-information__icon {
    display: grid;
    width: 42px;
    height: 42px;
    margin-bottom: 20px;
    place-items: center;
    border: 1px solid rgba(34, 29, 21, 0.22);
    border-radius: 50%;
  }

  .article-information__title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 25px;
    font-weight: 600;
    line-height: 1.15;
  }

  .article-information__description {
    margin: 12px 0 22px;
    color: rgba(32, 27, 20, 0.72);
    font-size: 12px;
    line-height: 1.65;
  }

  .article-information__form {
    display: grid;
    gap: 10px;
  }

  .article-information__input {
    width: 100%;
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid rgba(34, 29, 21, 0.17);
    border-radius: 5px;
    outline: none;
    color: #241f18;
    background: rgba(255, 255, 255, 0.2);
    font: inherit;
    font-size: 12px;
    transition: border-color 180ms ease, background-color 180ms ease;
  }

  .article-information__input::placeholder {
    color: rgba(34, 29, 21, 0.45);
  }

  .article-information__input:focus {
    border-color: rgba(34, 29, 21, 0.55);
    background: rgba(255, 255, 255, 0.34);
  }

  .article-information__button {
    min-height: 44px;
    padding: 0 16px;
    border: 0;
    border-radius: 5px;
    color: #f8f1e5;
    background: #11100e;
    cursor: pointer;
    font: inherit;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 180ms ease, background-color 180ms ease;
  }

  .article-information__button:hover,
  .article-information__button:focus-visible {
    background: #000;
    transform: translateY(-2px);
  }

  .article-information__success {
    display: flex;
    min-height: 76px;
    padding: 15px;
    align-items: center;
    gap: 11px;
    border: 1px solid rgba(34, 29, 21, 0.18);
    border-radius: 7px;
    color: #211d17;
    background: rgba(255, 255, 255, 0.22);
    font-size: 12px;
    line-height: 1.55;
  }
`;

const Informasi = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      <style>{styles}</style>

      <section className="article-information" data-article-reveal>
        <div className="article-information__icon">
          <Mail size={19} aria-hidden="true" />
        </div>
        <h2 className="article-information__title">Tetap Terinformasi</h2>
        <p className="article-information__description">
          Dapatkan berita eksklusif mengenai ekosistem dan inovasi terbaru
          langsung di inbox Anda.
        </p>

        {isSubmitted ? (
          <div className="article-information__success" role="status">
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>Terima kasih. Pembaruan berikutnya akan kami kirimkan.</span>
          </div>
        ) : (
          <form className="article-information__form" onSubmit={handleSubmit}>
            <input
              className="article-information__input"
              type="email"
              name="email"
              placeholder="Email Anda"
              aria-label="Email Anda"
              required
            />
            <button className="article-information__button" type="submit">
              Daftar Sekarang
            </button>
          </form>
        )}
      </section>
    </>
  );
};

export default Informasi;
