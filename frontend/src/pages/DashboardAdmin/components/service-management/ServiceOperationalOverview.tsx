import { CalendarDays, MoreHorizontal } from "lucide-react";
import type {
  ServiceMeeting,
  ServiceOperation,
  ServiceRequest,
} from "../../../../services/serviceManagement/serviceManagementRepository";

type ServiceOperationalOverviewProps = {
  meetings: ServiceMeeting[];
  operations: ServiceOperation[];
  requests: ServiceRequest[];
  onCalendarOpen: () => void;
};

const sameLocalDay = (isoValue: string, reference: Date) => {
  const value = new Date(isoValue);
  return (
    Number.isFinite(value.getTime()) &&
    value.getFullYear() === reference.getFullYear() &&
    value.getMonth() === reference.getMonth() &&
    value.getDate() === reference.getDate()
  );
};

const toClock = (isoValue: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoValue));

const ServiceOperationalOverview = ({
  meetings,
  operations,
  requests,
  onCalendarOpen,
}: ServiceOperationalOverviewProps) => {
  const todayMeetings = meetings
    .filter((meeting) => sameLocalDay(meeting.startsAt, new Date()))
    .slice(0, 4);
  const leads = requests.filter((request) => request.status !== "Archived").length;
  const consultations = requests.filter((request) =>
    ["Reviewed", "Scheduled", "Converted"].includes(request.status),
  ).length;
  const proposals = operations.filter((operation) => operation.progress >= 20).length;
  const deals = operations.filter(
    (operation) => operation.revenue > 0 || operation.progress >= 35,
  ).length;
  const stageValues = [leads, consultations, proposals, deals];
  const stageLabels = ["Lead", "Consult", "Proposal", "Deal"];
  const denominator = Math.max(leads, 1);
  const supportingStats = [
    {
      label: "Consultation",
      value: requests.filter((request) => request.status === "Pending").length,
      note: "Pending reviews",
    },
    {
      label: "Proposals",
      value: operations.filter((operation) => operation.progress < 35).length,
      note: "Awaiting progress",
    },
    {
      label: "Payments",
      value: operations.filter((operation) => operation.revenue > 0).length,
      note: "Recorded locally",
    },
    {
      label: "Completed",
      value: operations.filter((operation) =>
        /completed/i.test(operation.lifecycleStatus),
      ).length,
      note: "All records",
    },
  ];

  return (
    <section className="sm-admin__overview-grid">
      <article className="sm-admin__panel sm-admin__funnel sm-admin__reveal" style={{ "--sm-delay": "310ms" } as React.CSSProperties}>
        <header className="sm-admin__panel-heading">
          <h2>Operational Funnel</h2>
          <button type="button" aria-label="Operational funnel options"><MoreHorizontal aria-hidden="true" /></button>
        </header>

        <div className="sm-admin__funnel-stages" aria-label="Tahapan funnel operasional">
          {stageLabels.map((label, index) => {
            const percentage = Math.round((stageValues[index] / denominator) * 100);
            return (
              <div className={`sm-admin__funnel-stage is-stage-${index + 1}`} key={label}>
                <span>{label}</span>
                <strong>{Math.min(100, percentage)}%</strong>
              </div>
            );
          })}
        </div>

        <div className="sm-admin__funnel-stats">
          {supportingStats.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
      </article>

      <aside className="sm-admin__panel sm-admin__meetings sm-admin__reveal" style={{ "--sm-delay": "370ms" } as React.CSSProperties}>
        <header className="sm-admin__meetings-heading">
          <h2>Meetings<br />Today</h2>
          <span>{todayMeetings.length}<small>Scheduled</small></span>
        </header>

        {todayMeetings.length > 0 ? (
          <div className="sm-admin__meeting-list">
            {todayMeetings.map((meeting) => {
              const clock = toClock(meeting.startsAt).split(" ");
              return (
                <a href={meeting.href} className="sm-admin__meeting" key={meeting.id}>
                  <time><strong>{clock[0]}</strong><small>{clock[1]}</small></time>
                  <span />
                  <div><strong>{meeting.title}</strong><small>{meeting.client} · {meeting.location}</small></div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="sm-admin__meeting-empty">
            <CalendarDays aria-hidden="true" />
            <strong>Belum ada meeting hari ini</strong>
            <span>Jadwal yang dikonfirmasi user akan tampil otomatis.</span>
          </div>
        )}

        <button className="sm-admin__calendar-button" type="button" onClick={onCalendarOpen}>View Full Calendar</button>
      </aside>
    </section>
  );
};

export default ServiceOperationalOverview;
