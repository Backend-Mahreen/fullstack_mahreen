import { CalendarClock } from "lucide-react";
import type { WebinarData } from "../../../../data/webinars";

const styles = `
  .webinar-timeline-section {
    width: min(100% - 40px, 1460px);
    margin: clamp(86px, 10vw, 150px) auto clamp(94px, 10vw, 152px);
  }

  .webinar-timeline-heading {
    display: flex;
    gap: 14px;
    align-items: center;
  }

  .webinar-timeline-heading svg {
    color: #d9b868;
  }

  .webinar-timeline-heading h2 {
    margin: 0;
    color: #f1ebe3;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(31px, 3.2vw, 48px);
    font-weight: 500;
  }

  .webinar-timeline {
    position: relative;
    max-width: 1020px;
    margin-top: 44px;
    padding-left: 76px;
  }

  .webinar-timeline::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 22px;
    width: 1px;
    content: "";
    background: linear-gradient(#d9b868, rgba(217, 184, 104, 0.15));
  }

  .webinar-timeline-item {
    position: relative;
    display: grid;
    min-height: 110px;
    margin-bottom: 24px;
    padding: 27px 30px;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 18px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 17px;
    background: linear-gradient(145deg, #11110f, #090909);
  }

  .webinar-timeline-item::before {
    position: absolute;
    top: 34px;
    left: -65px;
    width: 22px;
    height: 22px;
    content: "";
    border: 4px solid #080808;
    border-radius: 50%;
    background: #d9b868;
    box-shadow: 0 0 0 2px #d9b868;
  }

  .webinar-timeline-item h3 {
    margin: 0;
    color: #f1ebe3;
    font-size: 17px;
    font-weight: 700;
  }

  .webinar-timeline-item p {
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.55);
    font-size: 13px;
    line-height: 1.6;
  }

  .webinar-timeline-item time {
    color: #d9b868;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }

  @media (max-width: 680px) {
    .webinar-timeline {
      padding-left: 46px;
    }

    .webinar-timeline::before {
      left: 10px;
    }

    .webinar-timeline-item {
      grid-template-columns: 1fr;
    }

    .webinar-timeline-item::before {
      left: -46px;
    }
  }
`;

type TimelineSectionProps = {
  webinar: WebinarData;
};

const TimelineSection = ({ webinar }: TimelineSectionProps) => {
  return (
    <>
      <style>{styles}</style>

      <section className="webinar-timeline-section" aria-labelledby="timeline-title">
        <div className="webinar-timeline-heading" data-webinar-reveal>
          <CalendarClock size={30} aria-hidden="true" />
          <h2 id="timeline-title">Timeline Pelaksanaan</h2>
        </div>

        <div className="webinar-timeline">
          {webinar.timeline.map((item) => (
            <article className="webinar-timeline-item" data-webinar-reveal key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <time>{item.date}</time>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default TimelineSection;
