import { CalendarDays, Clock3 } from "lucide-react";
import {
  getAllWebinars,
  getWebinarRegistrationPath,
} from "../../../data/webinars";
import SectionHeader from "./SectionHeader";


const WebinarInvite = () => {
  const now = new Date();
  const webinars = getAllWebinars();
  const webinar =
    webinars
      .map((item) => ({ item, date: new Date(item.scheduleDate) }))
      .filter(({ date }) => Number.isFinite(date.getTime()) && date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .at(0)?.item ?? webinars[0];

  if (!webinar) return null;

  return (
    <>
<aside className="client-dashboard__invite-block">
        <SectionHeader title="Invited For You" />
        <article className="dashboard-card client-dashboard__invite-card">
          <span>Webinar Invite</span>
          <h3>{webinar.title}</h3>
          <p>
            Sesi bersama {webinar.mentor.name} · {webinar.category}.
          </p>
          <div className="client-dashboard__invite-meta">
            <span>
              <Clock3 aria-hidden="true" /> {webinar.scheduleTime}
            </span>
            <span>
              <CalendarDays aria-hidden="true" /> {webinar.scheduleDate}
            </span>
          </div>
          <a
            className="client-dashboard__invite-button"
            href={getWebinarRegistrationPath(webinar.slug)}
          >
            RSVP Now
          </a>
        </article>
      </aside>
    </>
  );
};

export default WebinarInvite;
