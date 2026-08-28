import type { EventAccessFilter, EventSort } from "./FilterSection";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";
import { handleNewsroomImageError } from "../../utils/newsroomImageFallback";

type EventGridSectionProps = {
  query: string;
  access: EventAccessFilter;
  sort: EventSort;
};

const getEventHref = (event: { id?: string | number; href?: string }) =>
  event.href || `/newsroom/events/${encodeURIComponent(String(event.id))}`;

const EventGridSection = ({ query, access, sort }: EventGridSectionProps) => {
  const { events: eventData } = useNewsroomDatabase();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredEvents = eventData
    .filter((event) => {
      const accessMatches = access === "ALL" || event.access === access;
      const queryMatches =
        normalizedQuery.length === 0 ||
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.category.toLowerCase().includes(normalizedQuery);

      return accessMatches && queryMatches;
    })
    .sort((first, second) => {
      const difference = (first.dateValue ?? "").localeCompare(second.dateValue ?? "");
      return sort === "NEWEST" ? -difference : difference;
    });

  return (
    <section className="event-grid-section newsroom-content-section" id="event-list" aria-labelledby="event-list-title">
      <h2 id="event-list-title" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        Daftar event Mahreen
      </h2>

      {filteredEvents.length > 0 ? (
        <div className="event-grid-4" aria-live="polite">
          {filteredEvents.map((event, index) => (
            <article
              className="event-card"
              key={event.id}
              data-newsroom-reveal
              style={{ transitionDelay: `${100 + index * 50}ms` }}
            >
              <div className="event-card-image-box">
                <img
                  decoding="async"
                  loading="lazy"
                  src={event.image}
                  alt=""
                  onError={handleNewsroomImageError}
                />
                <span className={`event-badge ${event.access.toLowerCase()}`}>{event.access}</span>
              </div>
              <div className="event-card-body">
                <div className="event-meta-info">
                  <span>{event.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{event.dateLabel}</span>
                </div>
                <h3 className="event-title event-title-serif">{event.title}</h3>
                <div className="event-time">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {event.time}
                </div>
                <a className="btn-detail-event" href={getEventHref(event)}>Detail Event</a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="newsroom-empty-state" role="status" aria-live="polite">
          Tidak ada event yang cocok dengan pencarian atau filter tersebut.
        </div>
      )}
    </section>
  );
};

export default EventGridSection;
