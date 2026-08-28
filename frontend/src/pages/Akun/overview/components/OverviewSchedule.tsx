import { ArrowRight } from "lucide-react";
import type { ScheduleEntry } from "../../../DashboardClient/types";

const OverviewSchedule = ({ entries }: Readonly<{ entries: ScheduleEntry[] }>) => (
  <section className="account-overview__panel" aria-labelledby="overview-schedule-title">
    <header className="account-overview__panel-header">
      <div>
        <span>AGENDA</span>
        <h2 id="overview-schedule-title">Jadwal Terdekat</h2>
      </div>
      <a href="/akun/jadwal" aria-label="Lihat semua jadwal"><ArrowRight aria-hidden="true" /></a>
    </header>
    <div className="account-overview__schedule-list">
      {entries.length ? entries.slice(0, 3).map((entry) => (
        <article className="account-overview__schedule" key={entry.id}>
          <time dateTime={entry.startsAt}>
            <strong>{entry.day}</strong>
            <span>{entry.month}</span>
          </time>
          <div>
            <h3>{entry.title}</h3>
            <p>{entry.time}</p>
          </div>
          <a href={entry.href}>{entry.label}</a>
        </article>
      )) : (
        <p className="account-overview__empty">Belum ada jadwal mendatang.</p>
      )}
    </div>
  </section>
);

export default OverviewSchedule;
