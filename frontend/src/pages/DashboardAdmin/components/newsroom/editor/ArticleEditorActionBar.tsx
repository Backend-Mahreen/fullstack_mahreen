import { Cloud, Eye, LoaderCircle, Send } from "lucide-react";

type ArticleEditorActionBarProps = Readonly<{
  isSubmitting: boolean;
  isSyncing: boolean;
  onPreview: () => void;
  onPublish: () => void;
  publishLabel?: string;
}>;

const articleEditorActionBarStyles = `
  .admin-article-action-bar {
    position: sticky;
    z-index: 50;
    bottom: 15px;
    display: flex;
    min-height: 72px;
    margin-top: 24px;
    padding: 12px 17px 12px 22px;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-radius: 4px;
    background: rgba(41, 41, 39, 0.96);
    box-shadow: 0 17px 48px rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(16px);
  }
  .admin-article-action-bar > div:first-child {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #c8c2b8;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    letter-spacing: 0.08em;
  }
  .admin-article-action-bar > div:first-child > span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--article-yellow);
    box-shadow: 0 0 12px rgba(239, 199, 63, 0.48);
  }
  .admin-article-action-bar > div:first-child.is-syncing > span {
    animation: admin-article-sync-pulse 900ms ease-in-out infinite;
  }
  .admin-article-action-bar > div:first-child.is-saved > span {
    background: #7ec28b;
    box-shadow: 0 0 10px rgba(90, 190, 112, 0.35);
  }
  .admin-article-action-bar > div:last-child {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .admin-article-action-bar > div:last-child button {
    position: relative;
    display: inline-flex;
    min-height: 43px;
    padding: 10px 18px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(239, 199, 63, 0.28);
    border-radius: 3px;
    color: #d8d3c9;
    background: #10100f;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.06em;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }
  .admin-article-action-bar > div:last-child button:last-child {
    min-width: 148px;
    border-color: #f0c846;
    color: #151208;
    background: linear-gradient(135deg, #f7d559, #eab932);
    box-shadow: 0 11px 30px rgba(225, 178, 42, 0.13);
  }
  .admin-article-action-bar > div:last-child button:last-child::after {
    position: absolute;
    top: -80%;
    left: -45%;
    width: 25%;
    height: 260%;
    content: "";
    background: rgba(255, 255, 255, 0.28);
    filter: blur(3px);
    transform: rotate(20deg) translateX(-320%);
    transition: transform 520ms ease;
  }
  .admin-article-action-bar > div:last-child button:hover {
    color: #f2cf59;
    border-color: rgba(239, 199, 63, 0.48);
    background: rgba(239, 199, 63, 0.055);
    transform: translateY(-2px);
  }
  .admin-article-action-bar > div:last-child button:last-child:hover {
    color: #151208;
    background: linear-gradient(135deg, #ffe57d, #f0c13d);
    box-shadow: 0 15px 36px rgba(225, 178, 42, 0.23);
  }
  .admin-article-action-bar > div:last-child button:last-child:hover::after {
    transform: rotate(20deg) translateX(750%);
  }
  .admin-article-action-bar button:disabled {
    opacity: 0.56;
    cursor: wait;
    transform: none;
  }

  @keyframes admin-article-sync-pulse {
    0%, 100% {
      opacity: 0.48;
      box-shadow: 0 0 6px rgba(239, 199, 63, 0.22);
      transform: scale(0.82);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 17px rgba(239, 199, 63, 0.72);
      transform: scale(1.12);
    }
  }

  @media (max-width: 700px) {
    .admin-article-action-bar {
      bottom: 10px;
      min-height: 68px;
      padding: 11px 13px;
    }
  }

  @media (max-width: 520px) {
    .admin-article-action-bar {
      position: relative;
      bottom: auto;
      align-items: stretch;
      flex-direction: column;
    }
    .admin-article-action-bar > div:last-child { width: 100%; }
    .admin-article-action-bar > div:last-child button { flex: 1; }
  }
`;

const ArticleEditorActionBar = ({ isSubmitting, isSyncing, onPreview, onPublish, publishLabel = "Publish Content" }: ArticleEditorActionBarProps) => (
  <footer className="admin-article-action-bar admin-article-enter">
    <style data-component="admin-article-action-bar">{articleEditorActionBarStyles}</style>
    <div className={isSyncing ? "is-syncing" : "is-saved"} aria-live="polite">
      <span />
      <Cloud size={15} />
      {isSyncing ? "Preparing changes for local storage..." : "All changes ready to save locally"}
    </div>
    <div>
      <button type="button" onClick={onPreview}><Eye size={15} /> Live Preview</button>
      <button type="button" disabled={isSubmitting} onClick={onPublish}>
        {isSubmitting ? <LoaderCircle className="admin-article-submit-spinner" size={15} /> : <Send size={15} />}
        {isSubmitting ? "Saving..." : publishLabel}
      </button>
    </div>
  </footer>
);

export default ArticleEditorActionBar;
