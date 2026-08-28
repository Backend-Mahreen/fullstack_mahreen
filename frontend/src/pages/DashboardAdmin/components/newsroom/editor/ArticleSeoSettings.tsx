import { Info, Upload } from "lucide-react";
import ArticleEditorSection from "./ArticleEditorSection";
import type { ArticleEditorData, ArticleEditorUpdate } from "./articleEditorTypes";

type ArticleSeoSettingsProps = Readonly<{
  onChange: (update: ArticleEditorUpdate) => void;
  value: ArticleEditorData;
}>;

const articleSeoSettingsStyles = `
  .admin-article-seo__info {
    position: absolute;
    z-index: 2;
    top: 22px;
    right: 23px;
    color: #9e988d;
  }
  .admin-article-seo__urls {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 18px;
  }
  .admin-article-seo__upload-url {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    gap: 7px;
  }
  .admin-article-seo__upload-url > button {
    display: grid;
    width: 42px;
    height: 47px;
    place-items: center;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-radius: 2px;
    color: #d5c895;
    background: #292824;
    cursor: pointer;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease;
  }
  .admin-article-seo__upload-url > button:hover {
    color: var(--article-yellow);
    border-color: rgba(239, 199, 63, 0.45);
    background: rgba(239, 199, 63, 0.065);
  }

  @media (max-width: 700px) {
    .admin-article-seo__urls { grid-template-columns: 1fr; }
  }
`;

const ArticleSeoSettings = ({ onChange, value }: ArticleSeoSettingsProps) => (
  <ArticleEditorSection className="admin-article-seo" delay={310} title="Search Engine Optimization">
    <style data-component="admin-article-seo-settings">{articleSeoSettingsStyles}</style>
    <Info className="admin-article-seo__info" size={15} aria-label="SEO information" />
    <div className="admin-article-section__body admin-article-stack">
      <label className="admin-article-field">
        <span>SEO Title</span>
        <input value={value.seoTitle} onChange={(event) => onChange({ seoTitle: event.target.value })} />
      </label>
      <label className="admin-article-field">
        <span>Meta Description</span>
        <textarea rows={3} value={value.metaDescription} onChange={(event) => onChange({ metaDescription: event.target.value })} />
      </label>
      <div className="admin-article-seo__urls">
        <label className="admin-article-field">
          <span>OG Image (Social)</span>
          <span className="admin-article-seo__upload-url">
            <input value={value.ogImageUrl} onChange={(event) => onChange({ ogImageUrl: event.target.value })} />
            <button type="button" aria-label="Use featured image URL" onClick={() => onChange({ ogImageUrl: value.featuredImage?.preview || value.ogImageUrl })}>
              <Upload size={14} />
            </button>
          </span>
        </label>
        <label className="admin-article-field">
          <span>Canonical URL</span>
          <input value={value.canonicalUrl} onChange={(event) => onChange({ canonicalUrl: event.target.value })} />
        </label>
      </div>
    </div>
  </ArticleEditorSection>
);

export default ArticleSeoSettings;
