import { Award } from "lucide-react";
import type { CSSProperties } from "react";
import { newsroomAuthors, newsroomTopics } from "./newsroomAdminData";

const NewsroomTrendingTopics = () => (
  <article className="admin-newsroom-panel admin-newsroom-trending admin-animate">
    <header className="admin-newsroom-panel__header">
      <h2>Trending Topics</h2>
    </header>

    <div className="admin-newsroom-topic-list">
      {newsroomTopics.map((topic) => (
        <div key={topic.label}>
          <div><span>{topic.label}</span><strong>{topic.progress}%</strong></div>
          <span className="admin-newsroom-topic-progress">
            <span style={{ "--newsroom-progress": `${topic.progress}%` } as CSSProperties} />
          </span>
        </div>
      ))}
    </div>

    <div className="admin-newsroom-authors">
      <span className="admin-newsroom-section-label">Top Authors</span>
      {newsroomAuthors.map((author) => (
        <div className="admin-newsroom-author" key={author.name}>
          <img src={author.avatar} alt="" width="36" height="36" loading="lazy" />
          <div><strong>{author.name}</strong><span>{author.detail}</span></div>
          {author.featured ? <Award size={17} aria-label="Top author" /> : null}
        </div>
      ))}
    </div>
  </article>
);

export default NewsroomTrendingTopics;
