import { ArrowRight, Clock3, UsersRound } from "lucide-react";
import avatarOne from "../../../../assets/Internship/raka-pratama.jpg";
import avatarTwo from "../../../../assets/Internship/siti-mahreen.jpg";
import avatarThree from "../../../../assets/Internship/dimas-andre.jpg";
import { getWebinarRegistrationPath, type WebinarData } from "../../../../data/webinars";
import { getHashHref, handleHashRouteClick } from "../../../../utils/hashNavigation";

const styles = `
  .webinar-detail-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background:
      radial-gradient(circle at 20% 30%, rgba(218, 184, 104, 0.05), transparent 28%),
      #000;
  }

  .webinar-detail-hero__inner {
    display: grid;
    width: min(100%, 1500px);
    min-height: clamp(540px, 48vw, 720px);
    margin-inline: auto;
    padding: clamp(76px, 7vw, 114px) clamp(30px, 6vw, 94px);
    grid-template-columns: minmax(0, 0.95fr) minmax(420px, 1.05fr);
    gap: clamp(42px, 7vw, 100px);
    align-items: center;
  }

  .webinar-detail-hero__copy {
    min-width: 0;
    animation: webinarHeroCopyIn 780ms 100ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .webinar-detail-hero__meta {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    color: rgba(255, 255, 255, 0.68);
    font-size: 11px;
  }

  .webinar-detail-hero__badge {
    display: inline-flex;
    min-height: 30px;
    padding: 0 15px;
    align-items: center;
    border: 1px solid rgba(218, 184, 104, 0.46);
    border-radius: 999px;
    color: #d9b868;
    background: rgba(218, 184, 104, 0.11);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .webinar-detail-hero__duration {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  .webinar-detail-hero__title {
    max-width: 760px;
    margin: 34px 0 0;
    color: #f4efe7;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(56px, 5.3vw, 88px);
    font-weight: 500;
    line-height: 0.97;
    letter-spacing: -0.045em;
  }

  .webinar-detail-hero__title span {
    color: #d9b868;
  }

  .webinar-detail-hero__description {
    max-width: 700px;
    margin: 28px 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 15px;
    line-height: 1.75;
  }

  .webinar-detail-hero__actions {
    display: flex;
    margin-top: 42px;
    gap: 24px;
    align-items: center;
    flex-wrap: wrap;
  }

  .webinar-detail-hero__button {
    display: inline-flex;
    min-height: 60px;
    padding: 0 28px;
    gap: 12px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: #241b0d;
    background: #d9b868;
    font-size: 15px;
    font-weight: 800;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  .webinar-detail-hero__button:hover,
  .webinar-detail-hero__button:focus-visible {
    background: #edcf82;
    box-shadow: 0 16px 40px rgba(217, 184, 104, 0.2);
    transform: translateY(-2px);
  }

  .webinar-detail-hero__registrants {
    display: flex;
    gap: 12px;
    align-items: center;
    color: rgba(255, 255, 255, 0.65);
    font-size: 11px;
  }

  .webinar-detail-hero__avatars {
    display: flex;
    padding-left: 10px;
  }

  .webinar-detail-hero__avatar,
  .webinar-detail-hero__avatar-more {
    width: 38px;
    height: 38px;
    margin-left: -10px;
    border: 2px solid #000;
    border-radius: 50%;
  }

  .webinar-detail-hero__avatar {
    object-fit: cover;
  }

  .webinar-detail-hero__avatar-more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #33312d;
    font-size: 9px;
    font-weight: 700;
  }

  .webinar-detail-hero__visual {
    position: relative;
    min-width: 0;
    animation: webinarHeroVisualIn 880ms 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .webinar-detail-hero__visual::before {
    position: absolute;
    inset: 10% 8% -12%;
    z-index: -1;
    content: "";
    background: radial-gradient(circle, rgba(218, 184, 104, 0.16), transparent 70%);
    filter: blur(24px);
  }

  .webinar-detail-hero__image {
    display: block;
    width: 100%;
    min-height: 420px;
    aspect-ratio: 1.45;
    object-fit: cover;
    border: 1px solid rgba(218, 184, 104, 0.18);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45);
  }

  @keyframes webinarHeroCopyIn {
    from { opacity: 0; transform: translate3d(-28px, 20px, 0); }
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarHeroVisualIn {
    from { opacity: 0; transform: translate3d(30px, 0, 0) scale(0.97); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 1080px) {
    .webinar-detail-hero__inner {
      grid-template-columns: 1fr;
    }

    .webinar-detail-hero__visual {
      order: -1;
    }

    .webinar-detail-hero__image {
      min-height: 360px;
    }
  }

  @media (max-width: 640px) {
    .webinar-detail-hero__inner {
      min-height: auto;
      padding: 52px 20px 68px;
    }

    .webinar-detail-hero__title {
      font-size: clamp(44px, 13vw, 66px);
    }

    .webinar-detail-hero__image {
      min-height: 260px;
    }
  }
`;

type HeroSectionProps = {
  webinar: WebinarData;
};

const HeroSection = ({ webinar }: HeroSectionProps) => {
  const registrationPath = getWebinarRegistrationPath(webinar.slug);

  return (
    <>
      <style>{styles}</style>

      <section className="webinar-detail-hero" aria-labelledby="webinar-title">
        <div className="webinar-detail-hero__inner">
          <div className="webinar-detail-hero__copy">
            <div className="webinar-detail-hero__meta">
              <span className="webinar-detail-hero__badge">
                {webinar.category}
              </span>
              <span className="webinar-detail-hero__duration">
                <Clock3 size={14} aria-hidden="true" />
                {webinar.durationMinutes} Menit
              </span>
            </div>

            <h1 className="webinar-detail-hero__title" id="webinar-title">
              {webinar.titleLead} <span>{webinar.titleHighlight}</span>
            </h1>

            <p className="webinar-detail-hero__description">
              {webinar.description}
            </p>

            <div className="webinar-detail-hero__actions">
              <a
                className="webinar-detail-hero__button"
                href={getHashHref(registrationPath)}
                onClick={(event) => handleHashRouteClick(event, registrationPath)}
              >
                Daftar Sekarang
                <ArrowRight size={18} aria-hidden="true" />
              </a>

              <div className="webinar-detail-hero__registrants">
                <div className="webinar-detail-hero__avatars" aria-hidden="true">
                  <img decoding="async" className="webinar-detail-hero__avatar" src={avatarOne} alt="" />
                  <img decoding="async" className="webinar-detail-hero__avatar" src={avatarTwo} alt="" />
                  <img decoding="async" className="webinar-detail-hero__avatar" src={avatarThree} alt="" />
                  <span className="webinar-detail-hero__avatar-more">+800</span>
                </div>
                <span>
                  <UsersRound size={14} aria-hidden="true" /> Pendaftar Terakhir
                </span>
              </div>
            </div>
          </div>

          <div className="webinar-detail-hero__visual">
            <img decoding="async"
              className="webinar-detail-hero__image"
              src={webinar.heroImage}
              alt={webinar.heroImageAlt}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
