import { CalendarClock } from "lucide-react";
import { useState } from "react";
import type { ScheduleEntry } from "../types";
import ScheduleNavigationMenu from "../menus/ScheduleNavigationMenu";
import ScheduleItem, { ScheduleItemStyles } from "./ScheduleItem";
import SectionHeader from "./SectionHeader";

type UpcomingScheduleProps = {
  entries: ScheduleEntry[];
};

const UPCOMING_SCHEDULE_STYLES = `
  .client-dashboard__schedule-block {
    min-width: 0;
  }

  .client-dashboard__section-heading--schedule {
    min-height: 44px;
    margin-bottom: 24px;
    padding-inline: 4px;
  }

  .client-dashboard__section-heading--schedule h2 {
    color: #d8d1c8;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -.018em;
  }

  .client-dashboard__schedule {
    display: grid;
    min-width: 0;
    min-height: 300px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: hidden;
    border-color: #292722;
    border-radius: 24px;
    background: linear-gradient(145deg, #151515 0%, #121212 74%);
    box-shadow: 0 0 0 1px rgba(217, 183, 101, .025), 0 22px 58px -38px rgba(217, 183, 101, .4);
    transition: border-color 280ms ease, box-shadow 280ms ease, transform 280ms cubic-bezier(.22,1,.36,1);
  }

  .client-dashboard__schedule:hover {
    border-color: rgba(217, 183, 101, .32);
    box-shadow: 0 0 30px rgba(217, 183, 101, .08), 0 26px 64px -34px rgba(217, 183, 101, .5);
    transform: translateY(-2px);
  }

  .client-dashboard__schedule-empty {
    display: grid;
    min-height: 300px;
    padding: 42px 30px;
    grid-column: 1 / -1;
    place-items: center;
    align-content: center;
    text-align: center;
  }

  .client-dashboard__schedule-empty svg {
    width: 38px;
    height: 38px;
    color: #d9b765;
    filter: drop-shadow(0 0 10px rgba(217, 183, 101, .24));
  }

  .client-dashboard__schedule-empty h3 {
    margin: 18px 0 0;
    color: #eee9e2;
    font-size: 24px;
  }

  .client-dashboard__schedule-empty p {
    max-width: 560px;
    margin: 10px 0 0;
    color: #8e8982;
    font-size: 15px;
    line-height: 1.65;
  }

  @media (max-width: 820px) {
    .client-dashboard__schedule {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .client-dashboard__section-heading--schedule {
      padding-inline: 0;
    }

    .client-dashboard__section-heading--schedule h2 {
      font-size: 18px;
    }

    .client-dashboard__schedule,
    .client-dashboard__schedule-empty {
      min-height: 240px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .client-dashboard__schedule {
      transform: none;
      transition: none;
    }
  }
`;

const ITEMS_PER_PAGE = 2;

const UpcomingSchedule = ({ entries }: UpcomingScheduleProps) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(entries.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const visibleEntries = entries.slice(
    safePage * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  const showPrevious = () => {
    if (pageCount <= 1) return;
    setPage((current) => (current - 1 + pageCount) % pageCount);
  };

  const showNext = () => {
    if (pageCount <= 1) return;
    setPage((current) => (current + 1) % pageCount);
  };

  return (
    <>
      <style>{UPCOMING_SCHEDULE_STYLES}</style>
      <ScheduleItemStyles />
      <section id="schedule" className="client-dashboard__schedule-block" data-dashboard-reveal data-dashboard-step="8">
        <SectionHeader title="Upcoming Schedule" className="client-dashboard__section-heading--schedule">
          <ScheduleNavigationMenu
            onPrevious={showPrevious}
            onNext={showNext}
            previousDisabled={pageCount <= 1}
            nextDisabled={pageCount <= 1}
          />
        </SectionHeader>
        <div
          className="dashboard-card client-dashboard__schedule"
          aria-label={`Jadwal mendatang, halaman ${safePage + 1} dari ${pageCount}`}
          aria-live="polite"
        >
          {visibleEntries.length > 0 ? (
            visibleEntries.map((entry) => (
              <ScheduleItem entry={entry} key={entry.id} />
            ))
          ) : (
            <div className="client-dashboard__schedule-empty" role="status">
              <CalendarClock aria-hidden="true" />
              <h3>Belum ada jadwal mendatang</h3>
              <p>
                Jadwal akan muncul otomatis setelah Anda mengonfirmasi meeting,
                mendaftar webinar, atau membuat pesanan Studio.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default UpcomingSchedule;
