import { ArrowUpRight, Clock3, Video } from "lucide-react";
import type { CSSProperties } from "react";
import { handleRouteClick } from "../../../../utils/hashNavigation";
import type { ScheduleEntry } from "../../types";

type ClientScheduleCardProps = Readonly<{
  entry: ScheduleEntry;
  index: number;
}>;

const ClientScheduleCard = ({ entry, index }: ClientScheduleCardProps) => (
  <article
    className="client-schedule-card"
    style={{ "--client-schedule-index": index } as CSSProperties}
  >
    <div
      className="client-schedule-card__date"
      aria-label={`${entry.day} ${entry.month}`}
    >
      <strong>{entry.day}</strong>
      <span>{entry.month}</span>
    </div>

    <div className="client-schedule-card__content">
      <div className="client-schedule-card__title-row">
        <div>
          <span className="client-schedule-card__tag">
            <Video aria-hidden="true" /> {entry.label}
          </span>
          <h2>{entry.title}</h2>
        </div>
        <span className="client-schedule-card__time">
          <Clock3 aria-hidden="true" /> {entry.time}
        </span>
      </div>
      <p>{entry.description}</p>
      {entry.attendees && <small>{entry.attendees}</small>}
    </div>

    <a
      className="client-schedule-card__action"
      href={entry.href}
      onClick={(event) => handleRouteClick(event, entry.href)}
    >
      BUKA JADWAL <ArrowUpRight aria-hidden="true" />
    </a>
  </article>
);

export default ClientScheduleCard;
