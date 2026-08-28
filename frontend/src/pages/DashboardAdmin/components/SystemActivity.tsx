import type { CSSProperties } from "react";
import { Clock3 } from "lucide-react";
import type { AdminActivity } from "../types";

type SystemActivityProps = Readonly<{
  activities: readonly AdminActivity[];
  query: string;
}>;

const SystemActivity = ({ activities: sourceActivities, query }: SystemActivityProps) => {
  const normalizedQuery = query.trim().toLowerCase();
  const activities = normalizedQuery
    ? sourceActivities.filter((activity) => Object.values(activity).some((value) => value.toLowerCase().includes(normalizedQuery)))
    : sourceActivities;

  return (
    <article className="admin-panel admin-activity admin-animate" style={{ "--admin-delay": "640ms" } as CSSProperties}>
      <div className="admin-panel__heading"><div><h2>System Activity</h2><p>Aktivitas operasional terbaru</p></div></div>
      {activities.length ? (
        <ol className="admin-activity__list">
          {activities.map((activity) => (
            <li key={`${activity.actor}-${activity.time}`}>
              <span className="admin-activity__marker" aria-hidden="true" />
              <div><strong>{activity.actor} <em>{activity.action}</em></strong><p>{activity.detail}</p><small><Clock3 size={10} /> {activity.time}</small></div>
            </li>
          ))}
        </ol>
      ) : <div className="admin-empty-state">Aktivitas tidak ditemukan.</div>}
    </article>
  );
};

export default SystemActivity;
