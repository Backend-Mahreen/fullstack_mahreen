import { Mail, MapPin, Phone } from "lucide-react";

const directContactCardStyles = `
  .direct-contact-card {
    margin-top: 60px;
    padding: 31px 32px 28px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 17px;
    background: #121212;
  }

  .direct-contact-card__title {
    margin: 0;
    padding-bottom: 19px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    color: #f0ece6;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 24px;
    font-weight: 600;
  }

  .direct-contact-card__list {
    display: grid;
    gap: 18px;
    margin: 22px 0 0;
    padding: 0;
    list-style: none;
  }

  .direct-contact-card__item {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 14px;
    align-items: center;
  }

  .direct-contact-card__icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 1px solid rgba(203, 168, 112, 0.16);
    border-radius: 50%;
    background: rgba(203, 168, 112, 0.08);
    color: #b8955f;
  }

  .direct-contact-card__icon svg {
    width: 17px;
    height: 17px;
    stroke-width: 1.5;
  }

  .direct-contact-card__label {
    display: block;
    margin-bottom: 4px;
    color: #77777d;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .direct-contact-card__value {
    color: #e4e4e7;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.45;
    text-decoration: none;
  }

  .direct-contact-card__value:hover,
  .direct-contact-card__value:focus-visible {
    color: #d2af78;
  }

  @media (max-width: 980px) {
    .direct-contact-card {
      margin-top: 40px;
    }
  }

  @media (max-width: 520px) {
    .direct-contact-card {
      padding: 25px 22px;
    }
  }
`;

const DirectContactCard = () => (
  <>
    <style data-component="direct-contact-card">{directContactCardStyles}</style>
    <aside className="direct-contact-card" aria-labelledby="direct-contact-title">
      <h2 className="direct-contact-card__title" id="direct-contact-title">
        Kontak Langsung
      </h2>
      <ul className="direct-contact-card__list">
        <li className="direct-contact-card__item">
          <span className="direct-contact-card__icon" aria-hidden="true">
            <Phone />
          </span>
          <div>
            <span className="direct-contact-card__label">WhatsApp</span>
            <a className="direct-contact-card__value" href="https://wa.me/6289652647385" target="_blank" rel="noreferrer">
              +62 896-5264-7385
            </a>
          </div>
        </li>
        <li className="direct-contact-card__item">
          <span className="direct-contact-card__icon" aria-hidden="true">
            <Mail />
          </span>
          <div>
            <span className="direct-contact-card__label">E-mail Resmi</span>
            <a className="direct-contact-card__value" href="mailto:info@mahreenindonesia.com">
              info@mahreenindonesia.com
            </a>
          </div>
        </li>
        <li className="direct-contact-card__item">
          <span className="direct-contact-card__icon" aria-hidden="true">
            <MapPin />
          </span>
          <div>
            <span className="direct-contact-card__label">Lokasi</span>
            <span className="direct-contact-card__value">Cimahi, Jawa Barat, Indonesia</span>
          </div>
        </li>
      </ul>
    </aside>
  </>
);

export default DirectContactCard;
