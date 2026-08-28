import { ExternalLink } from "lucide-react";
import type { WebinarData } from "../../../../data/webinars";

const styles = `
  .webinar-mentor-card {
    display: grid;
    min-width: 0;
    margin-top: 42px;
    padding: clamp(28px, 3vw, 42px);
    grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
    gap: clamp(26px, 3vw, 44px);
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    background:
      radial-gradient(circle at 0% 0%, rgba(218, 184, 104, 0.06), transparent 30%),
      linear-gradient(145deg, #11110f 0%, #080808 100%);
  }

  .webinar-mentor-card__image {
    width: 100%;
    aspect-ratio: 0.9;
    object-fit: cover;
    object-position: center 18%;
    border: 1px solid rgba(218, 184, 104, 0.46);
    border-radius: 20px;
    filter: sepia(0.12) contrast(1.04);
  }

  .webinar-mentor-card__eyebrow {
    color: #d9b868;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  .webinar-mentor-card h3 {
    margin: 12px 0 0;
    color: #f4eee5;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(29px, 3vw, 44px);
    font-weight: 500;
  }

  .webinar-mentor-card__quote {
    margin: 14px 0 0;
    color: rgba(255, 255, 255, 0.78);
    font-size: 15px;
    line-height: 1.65;
  }

  .webinar-mentor-card__bio {
    margin: 18px 0 0;
    color: rgba(255, 255, 255, 0.54);
    font-size: 13px;
    line-height: 1.7;
  }

  .webinar-mentor-card__link {
    display: inline-flex;
    margin-top: 24px;
    gap: 8px;
    align-items: center;
    color: #d9b868;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  @media (max-width: 680px) {
    .webinar-mentor-card {
      grid-template-columns: 1fr;
    }

    .webinar-mentor-card__image {
      max-width: 240px;
    }
  }
`;

type MentorCardProps = {
  webinar: WebinarData;
};

const MentorCard = ({ webinar }: MentorCardProps) => {
  const { mentor } = webinar;

  return (
    <>
      <style>{styles}</style>

      <article className="webinar-mentor-card" data-webinar-reveal>
        <img decoding="async" loading="lazy"
          className="webinar-mentor-card__image"
          src={mentor.image}
          alt={mentor.imageAlt}
        />

        <div>
          <span className="webinar-mentor-card__eyebrow">Your Mentor</span>
          <h3>{mentor.name}</h3>
          <p className="webinar-mentor-card__quote">“{mentor.quote}”</p>
          <p className="webinar-mentor-card__bio">{mentor.bio}</p>
          <a className="webinar-mentor-card__link" href={mentor.profileHref}>
            View LinkedIn Profile
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </article>
    </>
  );
};

export default MentorCard;
