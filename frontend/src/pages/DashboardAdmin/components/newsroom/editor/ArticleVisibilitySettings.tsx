import ArticleEditorSection from "./ArticleEditorSection";
import type { ArticleEditorData, ArticleEditorUpdate } from "./articleEditorTypes";

type ArticleVisibilitySettingsProps = Readonly<{
  onChange: (update: ArticleEditorUpdate) => void;
  value: ArticleEditorData;
}>;

const articleVisibilityStyles = `
  .admin-article-toggle-list { display: grid; gap: 14px; }
  .admin-article-toggle-list > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .admin-article-toggle-list > div > span {
    color: #d1ccc2;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
  }
  .admin-article-toggle-list button {
    position: relative;
    width: 36px;
    height: 20px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    background: #4a4944;
    cursor: pointer;
    transition: border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
  }
  .admin-article-toggle-list button > i {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #9b978d;
    transition: background-color 180ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .admin-article-toggle-list button.is-on {
    border-color: rgba(239, 199, 63, 0.45);
    background: #d9b52f;
    box-shadow: 0 0 14px rgba(239, 199, 63, 0.14);
  }
  .admin-article-toggle-list button.is-on > i {
    background: #fff0a9;
    transform: translateX(16px);
  }
`;

const ArticleVisibilitySettings = ({ onChange, value }: ArticleVisibilitySettingsProps) => {
  const options = [
    { key: "showHomepage", label: "Show on Homepage" },
    { key: "featuredArticle", label: "Featured Article" },
    { key: "breakingNews", label: "Breaking News Banner" },
  ] as const;

  return (
    <ArticleEditorSection className="admin-article-visibility" delay={210} title="Visibility Settings">
      <style data-component="admin-article-visibility">{articleVisibilityStyles}</style>
      <div className="admin-article-section__body admin-article-toggle-list">
        {options.map((option) => (
          <div key={option.key}>
            <span>{option.label}</span>
            <button
              className={value[option.key] ? "is-on" : ""}
              type="button"
              role="switch"
              aria-checked={value[option.key]}
              aria-label={option.label}
              onClick={() => onChange({ [option.key]: !value[option.key] })}
            >
              <i />
            </button>
          </div>
        ))}
      </div>
    </ArticleEditorSection>
  );
};

export default ArticleVisibilitySettings;
