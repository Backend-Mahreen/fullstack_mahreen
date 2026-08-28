import {
  BadgeCheck,
  BookOpenCheck,
  FolderCheck,
  LibraryBig,
  UsersRound,
  Video,
} from "lucide-react";
import {
  formatRupiah,
  getWebinarRegistrationPath,
  type WebinarData,
} from "../../../../data/webinars";
import { getHashHref, handleHashRouteClick } from "../../../../utils/hashNavigation";

const styles = `
  .webinar-pricing-stack {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 22px;
  }

  .webinar-price-card,
  .webinar-bundle-card {
    width: 100%;
    min-width: 0;
    border: 1px solid rgba(226, 190, 105, 0.28);
    border-radius: 26px;
    background:
      radial-gradient(circle at 100% 0%, rgba(226, 190, 105, 0.07), transparent 34%),
      linear-gradient(145deg, #12110f 0%, #0a0a09 100%);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
  }

  .webinar-price-card {
    padding: clamp(30px, 3.5vw, 46px);
  }

  .webinar-price-card__eyebrow {
    color: rgba(255, 255, 255, 0.76);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  .webinar-price-card__price-row {
    display: flex;
    margin-top: 26px;
    gap: 16px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .webinar-price-card__price {
    margin: 0;
    color: #f4eee5;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(38px, 4vw, 58px);
    font-weight: 400;
    line-height: 1;
  }

  .webinar-price-card__original {
    color: rgba(255, 255, 255, 0.42);
    font-size: 12px;
    text-decoration: line-through;
  }

  .webinar-price-card__original.is-free {
    color: #d9b868;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .webinar-price-card__button {
    display: inline-flex;
    width: 100%;
    min-height: 62px;
    margin-top: 28px;
    align-items: center;
    justify-content: center;
    border: 1px solid #d9b868;
    border-radius: 12px;
    color: #20170a;
    background: #d9b868;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.01em;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  .webinar-price-card__button:hover,
  .webinar-price-card__button:focus-visible {
    background: #e9ca7d;
    box-shadow:
      0 0 22px rgba(217, 184, 104, 0.3),
      0 18px 42px rgba(217, 184, 104, 0.18);
    transform: translateY(-2px);
  }

  .webinar-price-card__benefits {
    display: grid;
    margin: 28px 0 0;
    padding: 0;
    grid-template-columns: 1fr;
    gap: 14px;
    list-style: none;
  }

  .webinar-price-card__benefit {
    display: flex;
    gap: 11px;
    align-items: flex-start;
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    line-height: 1.5;
  }

  .webinar-price-card__benefit svg {
    width: 17px;
    height: 17px;
    margin-top: 1px;
    flex: 0 0 17px;
    color: #d9b868;
  }

  .webinar-bundle-card {
    padding: 28px 30px;
  }

  .webinar-bundle-card h3 {
    margin: 0;
    color: #d9b868;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 23px;
    font-weight: 500;
  }

  .webinar-bundle-card p {
    margin: 16px 0 0;
    color: rgba(255, 255, 255, 0.57);
    font-size: 13px;
    line-height: 1.7;
  }

  .webinar-bundle-card a {
    display: inline-flex;
    margin-top: 20px;
    color: #f0d185;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.1px;
    text-transform: uppercase;
  }
`;

const benefitIcons = [
  BadgeCheck,
  Video,
  UsersRound,
  FolderCheck,
  BookOpenCheck,
  LibraryBig,
] as const;

type PricingCardProps = {
  webinar: WebinarData;
};

const PricingCard = ({ webinar }: PricingCardProps) => {
  const registrationPath = getWebinarRegistrationPath(webinar.slug);

  return (
    <>
      <style>{styles}</style>

      <aside className="webinar-pricing-stack" aria-label="Harga webinar">
        <section className="webinar-price-card" data-webinar-reveal>
          <span className="webinar-price-card__eyebrow">Investasi Ilmu</span>

          <div className="webinar-price-card__price-row">
            <p className="webinar-price-card__price">
              {webinar.isFree ? "Rp. 0,-" : formatRupiah(webinar.price)}
            </p>
            <span
              className={`webinar-price-card__original${
                webinar.isFree ? " is-free" : ""
              }`}
            >
              {webinar.isFree
                ? "Free Access"
                : formatRupiah(webinar.originalPrice)}
            </span>
          </div>

          <a
            className="webinar-price-card__button"
            href={getHashHref(registrationPath)}
            onClick={(event) => handleHashRouteClick(event, registrationPath)}
          >
            {webinar.isFree ? "Daftar Gratis" : "Daftar Sekarang"}
          </a>

          <ul className="webinar-price-card__benefits">
            {webinar.benefits.map((label, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];

              return (
                <li className="webinar-price-card__benefit" key={label}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="webinar-bundle-card" data-webinar-reveal>
          <h3>{webinar.bundleTitle}</h3>
          <p>{webinar.bundleDescription}</p>
          <a
            href={getHashHref(registrationPath)}
            onClick={(event) => handleHashRouteClick(event, registrationPath)}
          >
            Pelajari Selengkapnya
          </a>
        </section>
      </aside>
    </>
  );
};

export default PricingCard;
