import type { Activity } from "../types";
import ActivityItem from "./ActivityItem";

type RecentActivityProps = {
  activities: Activity[];
};


const RecentActivity = ({ activities }: RecentActivityProps) => (
  <>
<aside className="client-dashboard__activity-block">
      <h2 className="client-dashboard__activity-title">Recent Activity</h2>

      <div className="dashboard-card client-dashboard__activity-card">
        <div className="client-dashboard__activity-timeline">
          {activities.map((activity, index) => (
            <ActivityItem activity={activity} index={index} key={activity.title} />
          ))}
        </div>
      </div>
    </aside>
  </>
);

export default RecentActivity;
