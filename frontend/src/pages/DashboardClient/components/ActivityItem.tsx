import { Award, Check, CircleDollarSign } from "lucide-react";
import type { Activity, ActivityIcon } from "../types";

type ActivityItemProps = {
  activity: Activity;
  index?: number;
};


const getActivityIcon = (icon: ActivityIcon) => {
  if (icon === "certificate") return <Award aria-hidden="true" />;
  if (icon === "payment") return <CircleDollarSign aria-hidden="true" />;
  return <Check aria-hidden="true" />;
};

const ActivityItem = ({ activity, index = 0 }: ActivityItemProps) => {
  const iconClassName = [
    "client-dashboard__activity-icon",
    activity.icon === "certificate"
      ? "client-dashboard__activity-icon--certificate"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
<a
        className="client-dashboard__activity"
        href={activity.href}
        style={{ "--activity-index": index } as React.CSSProperties}
        aria-label={`${activity.title}: ${activity.description}`}
      >
        <div className="client-dashboard__activity-icon-wrap">
          <span className={iconClassName}>{getActivityIcon(activity.icon)}</span>
        </div>

        <div className="client-dashboard__activity-copy">
          <h3>{activity.title}</h3>
          <p>{activity.description}</p>
          <time>{activity.time}</time>
        </div>
      </a>
    </>
  );
};

export default ActivityItem;
