export type EventItem = {
  id: number;
  day: string;
  month: string;
  year: string;
  type: string;
  title: string;
  meta: string;
  action: string;
  href: string;
  featured?: boolean;
};

type EventCardProps = {
  event: EventItem;
  enterDelay?: number;
};

const EventCard = ({ event, enterDelay = 0 }: EventCardProps) => {
  return (
    <>

      <article
        className={`newsroom-event-row${event.featured ? " is-featured" : ""}`}
        style={{ animationDelay: `${enterDelay}ms` }}
      >
        <div className="newsroom-event-row__date">
          <strong>{event.day}</strong>
          <span>{event.month}</span>
          <small>{event.year}</small>
        </div>

        <div className="newsroom-event-row__copy">
          <span>{event.type}</span>
          <h3>{event.title}</h3>
          <p>{event.meta}</p>
        </div>

        <a href={event.href}>{event.action}</a>
      </article>
    </>
  );
};

export default EventCard;
