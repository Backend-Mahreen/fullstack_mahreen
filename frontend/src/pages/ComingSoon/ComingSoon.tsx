import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const comingSoonStyles = `
  .coming-soon-page {
    min-height: 100svh;
    padding: 150px 24px 96px;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 50% 20%, rgba(216, 184, 106, 0.12), transparent 34%),
      #050505;
    color: #ffffff;
    text-align: center;
  }

  .coming-soon-page,
  .coming-soon-page * {
    box-sizing: border-box;
  }

  .coming-soon-page__content {
    width: min(720px, 100%);
  }

  .coming-soon-page__eyebrow {
    margin: 0 0 18px;
    color: #d8b86a;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .coming-soon-page__title {
    margin: 0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(42px, 7vw, 78px);
    font-weight: 500;
    line-height: 1.04;
  }

  .coming-soon-page__description {
    max-width: 610px;
    margin: 26px auto 0;
    color: rgba(255, 255, 255, 0.68);
    font-family: "Inter", Arial, sans-serif;
    font-size: 16px;
    line-height: 1.75;
  }

  .coming-soon-page__actions {
    margin-top: 38px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
  }

  .coming-soon-page__button {
    min-width: 190px;
    padding: 15px 26px;
    border: 1px solid #d8b86a;
    border-radius: 999px;
    color: #080808;
    background: #d8b86a;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: transform 180ms ease, filter 180ms ease;
  }

  .coming-soon-page__button--secondary {
    color: #ffffff;
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .coming-soon-page__button:hover,
  .coming-soon-page__button:focus-visible {
    transform: translateY(-2px);
    filter: brightness(1.08);
  }
`;

const ComingSoon = ({ eyebrow, title, description }: ComingSoonProps) => {
  return (
    <>
      <style data-component="coming-soon">{comingSoonStyles}</style>
      <Navbar />

      <main className="coming-soon-page">
        <div className="coming-soon-page__content">
          <p className="coming-soon-page__eyebrow">{eyebrow}</p>
          <h1 className="coming-soon-page__title">{title}</h1>
          <p className="coming-soon-page__description">{description}</p>

          <div className="coming-soon-page__actions">
            <a className="coming-soon-page__button" href="/">
              Kembali ke Beranda
            </a>
            <a
              className="coming-soon-page__button coming-soon-page__button--secondary"
              href="/contact"
            >
              Hubungi Mahreen
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ComingSoon;
