import { ArrowRight, CircleUserRound } from "lucide-react";
import { useMemo } from "react";
import type { NewsroomArticleRecord } from "../../../../data/newsroomLocalDatabase";

type NewsroomActivityStreamProps = Readonly<{
  articles: readonly NewsroomArticleRecord[];
}>;

const getActivityTime = (article: NewsroomArticleRecord) => {
  const timestamp = article.updatedAt ?? article.createdAt;
  if (!timestamp) return article.publishedAt;
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return article.publishedAt;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

const NewsroomActivityStream = ({ articles }: NewsroomActivityStreamProps) => {
  const activities = useMemo(() => [...articles]
    .sort(
      (first, second) =>
        new Date(second.updatedAt || second.createdAt || second.publishedAt || 0).getTime() -
        new Date(first.updatedAt || first.createdAt || first.publishedAt || 0).getTime(),
    )
    .slice(0, 3)
    .map((article) => {
      const wasUpdated = Boolean(
        article.createdAt && article.updatedAt && article.createdAt !== article.updatedAt,
      );
      const publicationStatus = article.publicationStatus ?? "Published";
      return {
        action: wasUpdated ? "Updated" : publicationStatus,
        user: article.author,
        entity: `Article: “${article.title}”`,
        status: wasUpdated ? "Modified" : "Success",
        time: getActivityTime(article),
      } as const;
    }), [articles]);

  return (
    <article className="admin-newsroom-panel admin-newsroom-activity admin-animate">
    <header className="admin-newsroom-panel__header">
      <h2>Activity Stream</h2>
      <button type="button">View logs <ArrowRight size={14} aria-hidden="true" /></button>
    </header>
    <div className="admin-newsroom-table-scroll">
      <table>
        <thead><tr><th>Action</th><th>User</th><th>Entity</th><th>Status</th><th>Time</th></tr></thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={`${activity.action}-${activity.time}`}>
              <td>{activity.action}</td>
              <td><span className="admin-newsroom-user"><CircleUserRound size={18} /> {activity.user}</span></td>
              <td>{activity.entity}</td>
              <td><span className={`admin-newsroom-activity-status admin-newsroom-activity-status--${activity.status.toLowerCase()}`}>{activity.status}</span></td>
              <td>{activity.time}</td>
            </tr>
          ))}
          {activities.length === 0 ? (
            <tr><td colSpan={5}>Belum ada aktivitas Newsroom.</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
    </article>
  );
};

export default NewsroomActivityStream;
