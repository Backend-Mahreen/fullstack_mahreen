import { BadgeCheck } from "lucide-react";
import MentorCard from "../components/MentorCard";
import PricingCard from "../components/PricingCard";
import type { WebinarData } from "../../../../data/webinars";

const styles = `
  .webinar-learning-section {
    width: min(100% - 40px, 1460px);
    margin: clamp(64px, 8vw, 112px) auto 0;
  }

  .webinar-learning-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.72fr);
    gap: clamp(34px, 4.5vw, 68px);
    align-items: start;
  }

  .webinar-learning-heading {
    display: flex;
    gap: 13px;
    align-items: center;
  }

  .webinar-learning-heading svg {
    color: #d9b868;
    fill: #d9b868;
  }

  .webinar-learning-heading h2 {
    margin: 0;
    color: #f1ebe3;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(31px, 3.2vw, 47px);
    font-weight: 500;
  }

  .webinar-learning-grid {
    display: grid;
    margin-top: 28px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .webinar-learning-item {
    display: flex;
    min-height: 96px;
    padding: 22px 24px;
    gap: 14px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: rgba(255, 255, 255, 0.82);
    background: linear-gradient(145deg, #111, #090909);
    font-size: 14px;
    line-height: 1.5;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .webinar-learning-item:hover {
    border-color: rgba(217, 184, 104, 0.46);
    transform: translateY(-3px);
  }

  .webinar-learning-item svg {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    color: #d9b868;
  }

  @media (max-width: 1040px) {
    .webinar-learning-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .webinar-learning-grid {
      grid-template-columns: 1fr;
    }
  }
`;

type LearningSectionProps = {
  webinar: WebinarData;
};

const LearningSection = ({ webinar }: LearningSectionProps) => {
  return (
    <>
      <style>{styles}</style>

      <section className="webinar-learning-section">
        <div className="webinar-learning-layout">
          <div>
            <div className="webinar-learning-heading" data-webinar-reveal>
              <BadgeCheck size={28} aria-hidden="true" />
              <h2>Yang Akan Dipelajari</h2>
            </div>

            <div className="webinar-learning-grid">
              {webinar.topics.map((topic) => (
                <article className="webinar-learning-item" data-webinar-reveal key={topic}>
                  <BadgeCheck aria-hidden="true" />
                  <span>{topic}</span>
                </article>
              ))}
            </div>

            <MentorCard webinar={webinar} />
          </div>

          <PricingCard webinar={webinar} />
        </div>
      </section>
    </>
  );
};

export default LearningSection;
