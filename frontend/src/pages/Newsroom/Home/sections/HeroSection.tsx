import { ArrowRight, Megaphone, Star } from "lucide-react";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";

const styles = `
  .newsroom-hero {
    position: relative;
    min-height: 410px;
    padding: clamp(48px, 6vw, 72px) clamp(28px, 4.5vw, 70px) 72px;
    overflow: hidden;
    background:
      radial-gradient(circle at 67% 12%, rgba(255, 255, 255, 0.14), transparent 38%),
      linear-gradient(180deg, #a7a7a7 0%, #696969 29%, #242424 65%, #070707 100%);
  }

  .newsroom-hero::before {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.22), transparent 34%),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.012) 0,
        rgba(255, 255, 255, 0.012) 1px,
        transparent 1px,
        transparent 6px
      );
  }

  .newsroom-hero__content {
    position: relative;
    z-index: 1;
    width: min(700px, 76%);
  }

  .newsroom-hero h1 {
    margin: 16px 0 0;
    color: #f4efe8;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(58px, 7vw, 96px);
    font-weight: 400;
    line-height: 0.88;
    letter-spacing: -3px;
  }

  .newsroom-hero p {
    max-width: 660px;
    margin: 20px 0 0;
    color: #c6c0b8;
    font-size: 14px;
    line-height: 1.65;
  }

  .newsroom-hero p strong {
    display: block;
    color: #f1ebe3;
    font-weight: 700;
  }

  .newsroom-hero__actions {
    display: flex;
    margin-top: 22px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .newsroom-button {
    display: inline-flex;
    min-height: 44px;
    padding: 0 23px;
    gap: 11px;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition:
      color 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      transform 180ms ease;
  }

  .newsroom-button:hover,
  .newsroom-button:focus-visible {
    transform: translateY(-2px);
  }

  .newsroom-button--primary {
    color: #292016;
    background: var(--newsroom-gold);
    border-color: var(--newsroom-gold);
  }

  .newsroom-button--primary:hover,
  .newsroom-button--primary:focus-visible {
    background: var(--newsroom-gold-light);
    border-color: var(--newsroom-gold-light);
  }

  .newsroom-button--outline {
    color: #e6dfd6;
    background: rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 255, 255, 0.22);
  }

  .newsroom-button--outline:hover,
  .newsroom-button--outline:focus-visible {
    color: var(--newsroom-gold);
    border-color: var(--newsroom-gold);
  }

  .newsroom-ticker {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    min-height: 42px;
    overflow: hidden;
    color: #282016;
    background: var(--newsroom-gold);
  }

  .newsroom-ticker__track {
    display: flex;
    min-width: max-content;
    min-height: 42px;
    gap: 44px;
    align-items: center;
    animation: newsroomTicker 25s linear infinite;
  }

  .newsroom-ticker__track span {
    display: inline-flex;
    gap: 12px;
    align-items: center;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }

  .newsroom-ticker__track span:first-child {
    margin-left: 32px;
  }

  @keyframes newsroomTicker {
    from { transform: translateX(0); }
    to { transform: translateX(-18%); }
  }

  @media (max-width: 780px) {
    .newsroom-hero {
      min-height: 450px;
      padding-inline: 24px;
    }

    .newsroom-hero__content {
      width: 100%;
    }

    .newsroom-hero h1 {
      letter-spacing: -2px;
    }

    .newsroom-ticker__track {
      animation: none;
      transform: none;
    }
  }

  @media (max-width: 520px) {
    .newsroom-hero h1 {
      font-size: 50px;
    }

    .newsroom-hero p {
      font-size: 12px;
    }

    .newsroom-button {
      width: 100%;
    }
  }
`;

const announcementIcons = {
  megaphone: Megaphone,
  star: Star,
} as const;

const HeroSection = () => {
  const { announcements } = useNewsroomDatabase();

  return (
    <>
      <style>{styles}</style>

      <section className="newsroom-hero" aria-labelledby="newsroom-title">
        <div className="newsroom-hero__content" data-newsroom-reveal>
          <span className="newsroom-kicker">Archive 2024</span>
          <h1 id="newsroom-title">Newsroom</h1>
          <p>
            <strong>
              Berita, Insight, Edukasi, dan Perkembangan Terbaru dari Mahreen
              Indonesia.
            </strong>
            Ikuti berbagai artikel, berita, pengumuman, event, serta insight
            seputar bisnis, teknologi, pendidikan, kreativitas, dan seluruh
            ekosistem Mahreen Indonesia.
          </p>

          <div className="newsroom-hero__actions">
            <a
              className="newsroom-button newsroom-button--primary"
              href="/newsroom/berita"
            >
              Jelajahi Artikel
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              className="newsroom-button newsroom-button--outline"
              href="/newsroom?section=newsroom-events"
            >
              Lihat Event
            </a>
          </div>
        </div>

        <div className="newsroom-ticker" data-newsroom-reveal>
          <div className="newsroom-ticker__track">
            {announcements.map((announcement) => {
              const Icon = announcementIcons[announcement.iconKey];

              return (
                <span key={announcement.text}>
                  <Icon size={15} aria-hidden="true" />
                  {announcement.text}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
