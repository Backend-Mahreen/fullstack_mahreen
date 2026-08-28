import { Clock3 } from "lucide-react";
import type { ScheduleEntry } from "../types";

type ScheduleItemProps = {
  entry: ScheduleEntry;
};

const SCHEDULE_ITEM_STYLES = `
  .client-dashboard__schedule article {
    position: relative;
    isolation: isolate;
    display: grid;
    min-width: 0;
    min-height: 300px;
    padding: 40px 42px;
    grid-template-columns: 92px minmax(0, 1fr);
    align-content: center;
    gap: 24px;
    opacity: 0;
    transform: translate3d(0, 14px, 0);
    animation: dashboard-schedule-item-in 560ms cubic-bezier(.22,1,.36,1) both;
  }

  .client-dashboard__schedule article::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    background: radial-gradient(circle at 18% 18%, rgba(217, 183, 101, .09), transparent 34%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 260ms ease;
  }

  .client-dashboard__schedule article:hover::before,
  .client-dashboard__schedule article:focus-within::before {
    opacity: 1;
  }

  .client-dashboard__schedule article:nth-child(1) {
    animation-delay: 180ms;
  }

  .client-dashboard__schedule article:nth-child(2) {
    animation-delay: 260ms;
  }

  .client-dashboard__schedule article + article {
    border-left: 1px solid #24231f;
  }

  .client-dashboard__schedule time {
    display: flex;
    width: 88px;
    height: 92px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #34322e;
    border-radius: 18px;
    background: linear-gradient(145deg, #252525, #1d1d1d);
    box-shadow: inset 0 1px rgba(255,255,255,.025), 0 10px 28px -24px rgba(217, 183, 101, .75);
  }

  .client-dashboard__schedule time span {
    color: #e3c371;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: .03em;
    text-transform: uppercase;
  }

  .client-dashboard__schedule time strong {
    margin-top: 2px;
    color: #ece9e4;
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
  }

  .client-dashboard__schedule article > div:nth-child(2) {
    position: relative;
    z-index: 1;
    min-width: 0;
    padding-right: 128px;
  }

  .client-dashboard__schedule h3 {
    max-width: 420px;
    margin: 0;
    overflow-wrap: anywhere;
    color: #efebe6;
    font-size: clamp(24px, 2vw, 28px);
    font-weight: 700;
    line-height: 1.24;
    letter-spacing: -.03em;
    white-space: pre-line;
  }

  .client-dashboard__schedule p {
    max-width: 420px;
    margin: 10px 0 0;
    overflow-wrap: anywhere;
    color: #aaa39a;
    font-size: 16px;
    line-height: 1.55;
    white-space: pre-line;
  }

  .client-dashboard__schedule-time {
    display: inline-flex;
    margin-top: 22px;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: #b5aea5;
    font-size: 15px;
    line-height: 1.4;
  }

  .client-dashboard__schedule-time svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
  }

  .client-dashboard__schedule-time b {
    margin-left: 10px;
    color: #e5c570;
    font-weight: 700;
  }

  .client-dashboard__schedule-label {
    position: absolute;
    z-index: 2;
    top: 32px;
    right: 32px;
    max-width: 160px;
    padding: 10px 12px;
    border: 1px solid rgba(255,255,255,.025);
    border-radius: 8px;
    overflow: hidden;
    background: #202020;
    color: #8f8a83;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .client-dashboard__schedule-label.is-mandatory {
    border-color: rgba(217, 183, 101, .14);
    background: rgba(217, 183, 101, .15);
    color: #e7c671;
    box-shadow: 0 0 14px rgba(217, 183, 101, .08);
  }

  .client-dashboard__schedule-attendees {
    position: absolute;
    z-index: 2;
    bottom: 34px;
    left: 228px;
    display: flex;
  }

  .client-dashboard__schedule-attendees span {
    display: grid;
    width: 32px;
    height: 32px;
    margin-left: -6px;
    place-items: center;
    border: 2px solid #141414;
    border-radius: 50%;
    background: #2b2b2b;
    color: #d7d0c7;
    font-size: 14px;
    font-weight: 800;
  }

  .client-dashboard__schedule-attendees span:first-child {
    margin-left: 0;
  }

  .client-dashboard__schedule-open {
    position: absolute;
    z-index: 4;
    inset: 0;
    border-radius: inherit;
  }

  .client-dashboard__schedule-open:focus-visible {
    outline: 1px solid #e8c779;
    outline-offset: -4px;
  }

  @keyframes dashboard-schedule-item-in {
    from { opacity: 0; transform: translate3d(0,14px,0); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 1120px) and (min-width: 821px) {
    .client-dashboard__schedule article {
      padding-inline: 30px;
      grid-template-columns: 82px minmax(0, 1fr);
      gap: 20px;
    }

    .client-dashboard__schedule article > div:nth-child(2) {
      padding-right: 0;
    }

    .client-dashboard__schedule-label {
      position: static;
      grid-column: 2;
      width: fit-content;
      max-width: 100%;
      margin-top: 12px;
    }

    .client-dashboard__schedule-attendees {
      position: static;
      margin-top: 18px;
    }
  }

  @media (max-width: 820px) {
    .client-dashboard__schedule article {
      min-height: 260px;
      padding: 32px 28px;
      grid-template-columns: 76px minmax(0, 1fr);
    }

    .client-dashboard__schedule article + article {
      border-top: 1px solid #24231f;
      border-left: 0;
    }

    .client-dashboard__schedule time {
      width: 72px;
      height: 78px;
    }

    .client-dashboard__schedule time span {
      font-size: 14px;
    }

    .client-dashboard__schedule time strong {
      font-size: 28px;
    }

    .client-dashboard__schedule article > div:nth-child(2) {
      padding-right: 0;
    }

    .client-dashboard__schedule-label {
      position: static;
      width: fit-content;
      max-width: 100%;
      margin-top: 12px;
    }

    .client-dashboard__schedule-attendees {
      position: static;
      margin-top: 18px;
    }
  }

  @media (max-width: 520px) {
    .client-dashboard__schedule article {
      min-height: 0;
      padding: 26px 22px;
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .client-dashboard__schedule time {
      width: 74px;
      height: 78px;
    }

    .client-dashboard__schedule h3 {
      max-width: 100%;
      font-size: 22px;
    }

    .client-dashboard__schedule p,
    .client-dashboard__schedule-time {
      font-size: 14px;
    }
  }
`;

export const ScheduleItemStyles = () => <style>{SCHEDULE_ITEM_STYLES}</style>;

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const ScheduleItem = ({ entry }: ScheduleItemProps) => (
  <article>
      <time><span>{entry.month}</span><strong>{entry.day}</strong></time>
      <div>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
        <span className="client-dashboard__schedule-time">
          <Clock3 aria-hidden="true" /> {entry.time}
          {entry.attendees ? <b>{entry.attendees}</b> : null}
        </span>
      </div>
      <span className={`client-dashboard__schedule-label${entry.mandatory ? " is-mandatory" : ""}`}>
        {entry.label}
      </span>
      {entry.showAvatars ? (
        <div className="client-dashboard__schedule-attendees" aria-label="Peserta jadwal">
          {(entry.memberNames ?? []).slice(0, 2).map((member) => (
            <span aria-label={member} key={member}>{getInitials(member)}</span>
          ))}
        </div>
      ) : null}
      <a
        className="client-dashboard__schedule-open"
        href={entry.href}
        aria-label={`Buka jadwal ${entry.title.replace("\n", " ")}`}
      />
    </article>
);

export default ScheduleItem;
