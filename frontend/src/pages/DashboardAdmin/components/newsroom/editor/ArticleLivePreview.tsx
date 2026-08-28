import { CalendarDays, Clock3, X } from "lucide-react";
import type { ArticleEditorData } from "./articleEditorTypes";

type ArticleLivePreviewProps = Readonly<{
  onClose: () => void;
  value: ArticleEditorData;
}>;

const articleLivePreviewStyles = `
  .admin-article-preview-backdrop {
    position: fixed;
    z-index: 390;
    inset: 0;
    display: grid;
    padding: 24px;
    place-items: center;
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(9px);
  }
  .admin-article-preview {
    width: min(100%, 880px);
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    border: 1px solid rgba(239, 199, 63, 0.3);
    border-radius: 10px;
    background: #111110;
    box-shadow: 0 34px 110px rgba(0, 0, 0, 0.8);
    scrollbar-width: thin;
    scrollbar-color: rgba(239, 199, 63, 0.25) transparent;
  }
  .admin-article-preview > header {
    position: sticky;
    z-index: 2;
    top: 0;
    display: flex;
    min-height: 74px;
    padding: 16px 20px;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1px solid rgba(239, 199, 63, 0.17);
    background: rgba(17, 17, 16, 0.94);
    backdrop-filter: blur(14px);
  }
  .admin-article-preview > header > div { display: grid; gap: 2px; }
  .admin-article-preview > header span {
    color: var(--article-yellow);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .admin-article-preview > header strong { font-size: 15px; }
  .admin-article-preview > header button {
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    color: #aaa49a;
    background: transparent;
    cursor: pointer;
  }
  .admin-article-preview > header button:hover {
    color: var(--article-yellow);
    border-color: rgba(239, 199, 63, 0.28);
  }
  .admin-article-preview__hero,
  .admin-article-preview__placeholder {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 7;
    object-fit: cover;
  }
  .admin-article-preview__placeholder {
    display: grid;
    place-items: center;
    color: #625e56;
    background: radial-gradient(circle at 50% 45%, rgba(239, 199, 63, 0.06), transparent 30%), #090909;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .admin-article-preview__content { padding: clamp(28px, 5vw, 58px); }
  .admin-article-preview__content > span {
    color: var(--article-yellow);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .admin-article-preview__content h2 {
    margin: 12px 0 13px;
    color: #f2efe8;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(30px, 5vw, 52px);
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.035em;
  }
  .admin-article-preview__content > p {
    max-width: 720px;
    margin: 0;
    color: #aaa49a;
    font-size: 14px;
    line-height: 1.65;
  }
  .admin-article-preview__content > div {
    display: flex;
    margin: 22px 0 31px;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    color: #7f7a71;
    font-size: 14px;
  }
  .admin-article-preview__content > div > span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .admin-article-preview__content > section {
    padding-top: 28px;
    border-top: 1px solid rgba(239, 199, 63, 0.14);
    color: #d1ccc3;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 16px;
    line-height: 1.8;
    white-space: pre-wrap;
  }
  .admin-article-preview__content > .admin-article-preview__gallery {
    display: grid;
    margin: 24px 0 0;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    color: inherit;
  }
  .admin-article-preview__gallery img {
    width: 100%;
    aspect-ratio: 1 / 0.78;
    object-fit: cover;
    border: 1px solid rgba(239, 199, 63, 0.15);
    border-radius: 5px;
    transition: filter 180ms ease, transform 180ms ease;
  }
  .admin-article-preview__gallery img:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }

  @media (max-width: 520px) {
    .admin-article-preview-backdrop { padding: 10px; }
    .admin-article-preview { max-height: calc(100vh - 20px); }
    .admin-article-preview > header { min-height: 66px; padding: 13px 14px; }
    .admin-article-preview__content > .admin-article-preview__gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
`;

const ArticleLivePreview = ({ onClose, value }: ArticleLivePreviewProps) => (
  <div className="admin-article-preview-backdrop" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <style data-component="admin-article-live-preview">{articleLivePreviewStyles}</style>
    <article className="admin-article-preview admin-article-enter" role="dialog" aria-modal="true" aria-labelledby="article-preview-title">
      <header>
        <div><span>Live Preview</span><strong>Mahreen Newsroom</strong></div>
        <button type="button" aria-label="Close preview" onClick={onClose}><X size={20} /></button>
      </header>
      {value.featuredImage ? <img width="1600" height="900" className="admin-article-preview__hero" src={value.featuredImage.preview} alt="Article header preview" /> : <div className="admin-article-preview__placeholder">Featured image preview</div>}
      <div className="admin-article-preview__content">
        <span>{value.categories.join(" · ") || "Mahreen Indonesia"}</span>
        <h2 id="article-preview-title">{value.title || "Enter a compelling headline..."}</h2>
        <p>{value.excerpt || "A brief hook for the article card will appear here."}</p>
        <div><span><CalendarDays size={14} /> {value.releaseDate}</span><span><Clock3 size={14} /> {value.releaseTime}</span><span>By {value.primaryAuthor}</span></div>
        <section>{value.content || "Start writing your story to see the article body preview."}</section>
        {value.gallery.some(Boolean) ? (
          <div className="admin-article-preview__gallery" aria-label="Gallery preview">
            {value.gallery.map((image, index) => image ? (
              <img width="1200" height="800" src={image.preview} alt={image.name || `Gallery preview ${index + 1}`} key={`${image.preview}-${index}`} />
            ) : null)}
          </div>
        ) : null}
      </div>
    </article>
  </div>
);

export default ArticleLivePreview;
