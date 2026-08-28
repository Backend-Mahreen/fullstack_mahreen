import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { handleNewsroomImageError } from "../../utils/newsroomImageFallback";

export type WebinarItem = {
  id: number;
  title: string;
  category:
    | "Berita Mahreen"
    | "Artikel & Insight"
    | "Event & Webinar"
    | "Internship Update";
  label: string;
  date: string;
  duration: string;
  speaker: string;
  price: string;
  image: string;
  href: string;
  labelTone?: "gold" | "light" | "red";
};

type WebinarCardProps = {
  webinar: WebinarItem;
};

const labelBackground: Record<NonNullable<WebinarItem["labelTone"]>, string> = {
  gold: "#e5c477",
  light: "#dcd9ec",
  red: "#b93136",
};

const WebinarCard = ({ webinar }: WebinarCardProps) => {
  const labelTone = webinar.labelTone ?? "gold";
  const labelColor = labelTone === "red" ? "#fff" : "#21190e";

  return (
    <>

      <article className="newsroom-webinar-card" data-newsroom-reveal>
        <a className="newsroom-webinar-card__image" href={webinar.href}>
          <img
            decoding="async"
            loading="lazy"
            src={webinar.image}
            alt={webinar.title}
            onError={handleNewsroomImageError}
          />
          <span
            style={{
              background: labelBackground[labelTone],
              color: labelColor,
            }}
          >
            {webinar.label}
          </span>
        </a>

        <div className="newsroom-webinar-card__body">
          <div className="newsroom-webinar-card__meta">
            <span>
              <CalendarDays size={14} aria-hidden="true" />
              {webinar.date}
            </span>
            <span>
              <Clock3 size={14} aria-hidden="true" />
              {webinar.duration}
            </span>
          </div>

          <h3>
            <a href={webinar.href}>{webinar.title}</a>
          </h3>

          <div className="newsroom-webinar-card__footer">
            <span>
              <UserRound size={14} aria-hidden="true" />
              {webinar.speaker}
            </span>
            <strong>{webinar.price}</strong>
          </div>
        </div>
      </article>
    </>
  );
};

export default WebinarCard;
