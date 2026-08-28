import { ArrowLeft, Eye, LoaderCircle, Save, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ArticleBasicInformation from "./ArticleBasicInformation";
import ArticleClassification from "./ArticleClassification";
import ArticleEditorActionBar from "./ArticleEditorActionBar";
import ArticleLivePreview from "./ArticleLivePreview";
import ArticleMediaAssets from "./ArticleMediaAssets";
import ArticlePublicationSettings from "./ArticlePublicationSettings";
import ArticleSeoSettings from "./ArticleSeoSettings";
import ArticleVisibilitySettings from "./ArticleVisibilitySettings";
import {
  createInitialArticleData,
  type ArticleEditorData,
  type ArticleEditorUpdate,
  type ArticlePublicationStatus,
} from "./articleEditorTypes";

export type ArticleEditorSubmission = Readonly<{
  article: ArticleEditorData;
  status: ArticlePublicationStatus;
}>;

type NewsroomArticleEditorProps = Readonly<{
  initialValue?: ArticleEditorData;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onBack: () => void;
  onLocalAction: (message: string) => void;
  onSubmit: (submission: ArticleEditorSubmission) => void;
}>;

const newsroomArticleEditorStyles = `
  .admin-article-editor {
    --article-border: rgba(224, 189, 91, 0.2);
    --article-border-soft: rgba(255, 255, 255, 0.075);
    --article-panel: #151514;
    --article-input: #0a0a09;
    --article-yellow: #efc73f;
    --article-muted: #8d887d;
    position: relative;
    width: 100%;
    padding-bottom: 12px;
  }

  .admin-article-editor__header {
    display: flex;
    min-height: 78px;
    margin-bottom: 26px;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .admin-article-editor__header > div {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .admin-article-editor__header > div:first-child > button {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 7px;
    color: #dad5cb;
    background: rgba(255, 255, 255, 0.015);
    cursor: pointer;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
  }

  .admin-article-editor__header > div:first-child > button:hover {
    color: var(--article-yellow);
    border-color: rgba(239, 199, 63, 0.38);
    background: rgba(239, 199, 63, 0.055);
    transform: translateX(-3px);
  }

  .admin-article-editor__header h1 {
    margin: 0;
    color: #f1eee7;
    font-size: clamp(27px, 2.4vw, 38px);
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.035em;
  }

  .admin-article-editor__header p {
    margin: 6px 0 0;
    color: var(--article-muted);
    font-size: 14px;
  }

  .admin-article-editor__header > div:last-child { gap: 12px; }

  .admin-article-editor__header > div:last-child button,
  .admin-article-aside-preview {
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

  .admin-article-editor__header > div:last-child button:last-child {
    min-width: 148px;
    border-color: #f0c846;
    color: #151208;
    background: linear-gradient(135deg, #f7d559, #eab932);
    box-shadow: 0 11px 30px rgba(225, 178, 42, 0.13);
  }

  .admin-article-editor__header > div:last-child button::after {
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

  .admin-article-editor__header > div:last-child button:hover,
  .admin-article-aside-preview:hover {
    color: #f2cf59;
    border-color: rgba(239, 199, 63, 0.48);
    background: rgba(239, 199, 63, 0.055);
    transform: translateY(-2px);
  }

  .admin-article-editor__header > div:last-child button:last-child:hover {
    color: #151208;
    background: linear-gradient(135deg, #ffe57d, #f0c13d);
    box-shadow: 0 15px 36px rgba(225, 178, 42, 0.23);
  }

  .admin-article-editor__header > div:last-child button:hover::after {
    transform: rotate(20deg) translateX(750%);
  }

  .admin-article-editor button:disabled {
    opacity: 0.56;
    cursor: wait;
    transform: none !important;
  }

  .admin-article-submit-spinner {
    animation: admin-article-submit-spin 780ms linear infinite;
  }

  @keyframes admin-article-submit-spin {
    to { transform: rotate(360deg); }
  }

  .admin-article-validation {
    margin: -5px 0 20px;
    padding: 12px 16px;
    border: 1px solid rgba(222, 110, 93, 0.35);
    border-radius: 5px;
    color: #e6aaa0;
    background: rgba(177, 69, 53, 0.08);
    font-size: 14px;
  }

  .admin-article-editor__layout {
    display: grid;
    grid-template-columns: minmax(0, 2.08fr) minmax(320px, 0.92fr);
    align-items: start;
    gap: 24px;
  }

  .admin-article-editor__main,
  .admin-article-editor__aside {
    display: grid;
    min-width: 0;
    gap: 22px;
  }

  .admin-article-aside-preview {
    width: 100%;
    border-style: dashed;
  }

  .admin-article-enter {
    opacity: 0;
    animation: admin-article-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--article-delay, 0ms);
  }

  @keyframes admin-article-enter {
    from { opacity: 0; transform: translateY(18px) scale(0.992); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (max-width: 1180px) {
    .admin-article-editor__layout {
      grid-template-columns: minmax(0, 1.72fr) minmax(290px, 0.82fr);
      gap: 18px;
    }
  }

  @media (max-width: 880px) {
    .admin-article-editor__layout { grid-template-columns: 1fr; }
    .admin-article-editor__aside {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: stretch;
    }
    .admin-article-editor__aside .admin-article-section,
    .admin-article-aside-preview { height: 100%; }
  }

  @media (max-width: 700px) {
    .admin-article-editor__header {
      margin-bottom: 20px;
      align-items: stretch;
      flex-direction: column;
    }
    .admin-article-editor__header > div:last-child { width: 100%; }
    .admin-article-editor__header > div:last-child button { flex: 1; }
  }

  @media (max-width: 520px) {
    .admin-article-editor__header > div:first-child { align-items: flex-start; }
    .admin-article-editor__header h1 { font-size: 25px; }
    .admin-article-editor__header p { max-width: 270px; line-height: 1.5; }
    .admin-article-editor__header > div:last-child {
      align-items: stretch;
      flex-direction: column;
    }
    .admin-article-editor__header > div:last-child button { width: 100%; }
    .admin-article-editor__aside { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .admin-article-editor *,
    .admin-article-editor *::before,
    .admin-article-editor *::after {
      animation-duration: 1ms !important;
      animation-delay: 0ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
    }
  }
`;

const NewsroomArticleEditor = ({
  initialValue,
  isSubmitting = false,
  mode = "create",
  onBack,
  onLocalAction,
  onSubmit,
}: NewsroomArticleEditorProps) => {
  const [article, setArticle] = useState(() => initialValue ?? createInitialArticleData());
  const [isSyncing, setIsSyncing] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const syncTimerRef = useRef<number | null>(null);

  const updateArticle = useCallback((update: ArticleEditorUpdate) => {
    setArticle((current) => ({ ...current, ...update }));
    setValidationError("");
    setIsSyncing(true);
    if (syncTimerRef.current !== null) window.clearTimeout(syncTimerRef.current);
    syncTimerRef.current = window.setTimeout(() => setIsSyncing(false), 780);
  }, []);

  useEffect(() => {
    syncTimerRef.current = window.setTimeout(() => setIsSyncing(false), 780);
    return () => {
      if (syncTimerRef.current !== null) window.clearTimeout(syncTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (previewOpen) setPreviewOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [previewOpen]);

  const submitArticle = (status: ArticlePublicationStatus) => {
    if (!article.title.trim()) {
      setValidationError("Article title wajib diisi sebelum konten disimpan atau dipublikasikan.");
      onLocalAction("Newsroom: lengkapi judul artikel terlebih dahulu.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const finalStatus = status === "Published" && article.status === "Scheduled"
      ? "Scheduled"
      : status;
    onSubmit({ article: { ...article, status: finalStatus }, status: finalStatus });
  };

  const saveStatus = mode === "edit" ? article.status : "Draft";
  const publishLabel = mode === "edit" && article.status === "Published"
    ? "Update Published"
    : "Publish Content";

  return (
    <section className="admin-article-editor">
      <style data-component="admin-newsroom-article-editor">{newsroomArticleEditorStyles}</style>
      <header className="admin-article-editor__header admin-article-enter">
        <div>
          <button type="button" aria-label="Back to Newsroom Intelligence" onClick={onBack}><ArrowLeft size={20} /></button>
          <div>
            <h1>{mode === "edit" ? "Edit Article" : "Create New Article"}</h1>
            <p>{mode === "edit" ? "Update the existing article and synchronize it with every user view." : "Sophisticated content crafting for the Mahreen Indonesia ecosystem."}</p>
          </div>
        </div>
        <div>
          <button type="button" disabled={isSubmitting} onClick={() => submitArticle(saveStatus)}><Save size={15} /> {mode === "edit" ? "Save Changes" : "Save as Draft"}</button>
          <button type="button" disabled={isSubmitting} onClick={() => submitArticle("Published")}>
            {isSubmitting ? <LoaderCircle className="admin-article-submit-spinner" size={15} /> : <Send size={15} />}
            {isSubmitting ? "Saving..." : publishLabel}
          </button>
        </div>
      </header>

      {validationError ? <div className="admin-article-validation admin-article-enter" role="alert">{validationError}</div> : null}

      <div className="admin-article-editor__layout">
        <div className="admin-article-editor__main">
          <ArticleBasicInformation value={article} onChange={updateArticle} />
          <ArticleMediaAssets value={article} onChange={updateArticle} />
          <ArticleSeoSettings value={article} onChange={updateArticle} />
        </div>
        <aside className="admin-article-editor__aside">
          <ArticlePublicationSettings value={article} onChange={updateArticle} />
          <ArticleClassification value={article} onChange={updateArticle} />
          <ArticleVisibilitySettings value={article} onChange={updateArticle} />
          <button className="admin-article-aside-preview" type="button" onClick={() => setPreviewOpen(true)}><Eye size={16} /> Open Live Preview</button>
        </aside>
      </div>

      <ArticleEditorActionBar
        isSubmitting={isSubmitting}
        isSyncing={isSyncing}
        onPreview={() => setPreviewOpen(true)}
        onPublish={() => submitArticle("Published")}
        publishLabel={publishLabel}
      />

      {previewOpen ? <ArticleLivePreview value={article} onClose={() => setPreviewOpen(false)} /> : null}
    </section>
  );
};

export default NewsroomArticleEditor;
