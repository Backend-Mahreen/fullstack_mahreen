import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard, { type EventItem } from "../components/EventCard";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";

const styles = `
  .newsroom-events {
    padding-top: clamp(70px, 8vw, 108px);
    scroll-margin-top: 86px;
  }

  .newsroom-events__heading {
    display: flex;
    gap: 24px;
    align-items: flex-end;
    justify-content: space-between;
  }

  .newsroom-events__heading h2 {
    margin: 0;
    color: #e7dfd5;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: 400;
  }

  .newsroom-events__heading > div {
    display: flex;
    gap: 8px;
  }

  .newsroom-events__heading button {
    display: inline-flex;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.12);
    align-items: center;
    justify-content: center;
    color: #b8b1a8;
    background: transparent;
    cursor: pointer;
    transition: color 180ms ease, border-color 180ms ease;
  }

  .newsroom-events__heading button:hover,
  .newsroom-events__heading button:focus-visible {
    color: var(--newsroom-gold);
    border-color: var(--newsroom-gold);
  }

  .newsroom-event-list {
    display: grid;
    margin-top: 26px;
    gap: 12px;
  }
`;

const getEventDay = (dateValue: string) => {
  if (!dateValue) return "";
  const day = new Date(`${dateValue}T00:00:00`).getDate();
  return Number.isNaN(day) ? "" : String(day);
};

const EventCalendar = () => {
  const { events: storedEvents } = useNewsroomDatabase();
  const events = useMemo<readonly EventItem[]>(
    () =>
      storedEvents.map((event, index) => ({
        id: event.numericId || Number(String(event.id).replace(/\D/g, "").slice(0, 9)) || index,
        day: event.day || getEventDay(event.dateValue ?? ""),
        month: event.month,
        year: event.year,
        type: event.category,
        title: event.title,
        meta: `${event.location || ""}${event.time ? ` | ${event.time}` : ""}`,
        action: event.action || "Detail Event",
        href: event.href || `/newsroom/events/${encodeURIComponent(String(event.id))}`,
        featured: event.featured,
      })),
    [storedEvents],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleEvents = useMemo(() => {
    if (events.length <= 2) return events;
    const safeIndex = activeIndex % events.length;
    return [events[safeIndex], events[(safeIndex + 1) % events.length]];
  }, [activeIndex, events]);

  const move = (direction: number) => {
    if (events.length === 0) return;
    setActiveIndex((current) =>
      (current + direction + events.length) % events.length,
    );
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className="newsroom-events newsroom-content-section"
        id="newsroom-events"
        aria-labelledby="events-title"
      >
        <div className="newsroom-events__heading" data-newsroom-reveal>
          <h2 id="events-title">Kalender Event</h2>
          <div>
            <button type="button" aria-label="Event sebelumnya" onClick={() => move(-1)}>
              <ChevronLeft size={17} />
            </button>
            <button type="button" aria-label="Event berikutnya" onClick={() => move(1)}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="newsroom-event-list" aria-live="polite">
          {visibleEvents.map((event, index) => (
            <EventCard
              event={event}
              enterDelay={index * 90}
              key={`${activeIndex}-${event.id}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default EventCalendar;
