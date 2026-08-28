import { CalendarDays, Clock3 } from "lucide-react";
import ArticleEditorSection from "./ArticleEditorSection";
import type { ArticleEditorData, ArticleEditorUpdate } from "./articleEditorTypes";

type ArticlePublicationSettingsProps = Readonly<{
  onChange: (update: ArticleEditorUpdate) => void;
  value: ArticleEditorData;
}>;

const articlePublicationStyles = `
  .admin-article-publication input[type="date"],
  .admin-article-publication input[type="time"] {
    color-scheme: dark;
  }

  .admin-article-publication input::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
`;

const ArticlePublicationSettings = ({ onChange, value }: ArticlePublicationSettingsProps) => (
  <ArticleEditorSection className="admin-article-publication" delay={110} title="Publication">
    <style data-component="admin-article-publication">{articlePublicationStyles}</style>
    <div className="admin-article-section__body admin-article-stack">
      <label className="admin-article-field">
        <span>Status</span>
        <select value={value.status} onChange={(event) => onChange({ status: event.target.value as ArticleEditorData["status"] })}>
          <option>Draft</option>
          <option>Scheduled</option>
          <option>Published</option>
        </select>
      </label>
      <div className="admin-article-field">
        <span>Release Schedule</span>
        <label className="admin-article-input-icon">
          <input type="date" value={value.releaseDate} onChange={(event) => onChange({ releaseDate: event.target.value })} />
          <CalendarDays size={15} />
        </label>
        <label className="admin-article-input-icon">
          <input type="time" value={value.releaseTime} onChange={(event) => onChange({ releaseTime: event.target.value })} />
          <Clock3 size={15} />
        </label>
      </div>
    </div>
  </ArticleEditorSection>
);

export default ArticlePublicationSettings;
