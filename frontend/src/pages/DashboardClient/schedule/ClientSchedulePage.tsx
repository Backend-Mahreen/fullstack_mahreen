import { CalendarPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import { dashboardDataService } from "../../../services/dashboard/dashboardDataService";
import { navigateToRoute } from "../../../utils/hashNavigation";
import type { ScheduleEntry } from "../types";
import ClientScheduleCard from "./components/ClientScheduleCard";
import ClientScheduleSkeleton from "./components/ClientScheduleSkeleton";
import "./ClientSchedulePage.css";

const ClientSchedulePage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ScheduleEntry[] | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;
    const refresh = () => {
      void dashboardDataService
        .load(user)
        .then((data) => {
          if (active) setEntries(data.scheduleEntries);
        })
        .catch(() => {
          if (active) setEntries([]);
        });
    };
    const frame = window.requestAnimationFrame(refresh);
    const unsubscribe = dashboardDataService.subscribe(refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, [user]);

  if (!user) return null;

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <ClientAccountLayout activeItem="schedule" className="client-schedule-page">
      <div className="client-schedule-content">
        <header className="client-schedule-header">
          <div>
            <h1>Jadwal</h1>
            <p>{today}</p>
          </div>
          <button type="button" onClick={() => navigateToRoute("/tanya-mahreen")}>
            <CalendarPlus2 aria-hidden="true" /> BUAT JADWAL
          </button>
        </header>

        {!entries ? (
          <ClientScheduleSkeleton />
        ) : entries.length ? (
          <div className="client-schedule-list">
            {entries.map((entry, index) => (
              <ClientScheduleCard entry={entry} index={index} key={entry.id} />
            ))}
          </div>
        ) : (
          <section className="client-schedule-empty" role="status">
            <CalendarPlus2 aria-hidden="true" />
            <h2>Belum ada jadwal mendatang</h2>
            <p>
              Jadwal konsultasi, webinar, dan progres proyek akan muncul
              otomatis di sini.
            </p>
            <button type="button" onClick={() => navigateToRoute("/tanya-mahreen")}>
              Mulai konsultasi
            </button>
          </section>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientSchedulePage;
