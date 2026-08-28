import {
  Bold,
  Code2,
  ImageIcon,
  Italic,
  Link2,
  List,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useRef, useState } from "react";
import ArticleEditorSection from "./ArticleEditorSection";
import {
  slugifyArticleTitle,
  type ArticleEditorData,
  type ArticleEditorUpdate,
} from "./articleEditorTypes";

type ArticleBasicInformationProps = Readonly<{
  onChange: (update: ArticleEditorUpdate) => void;
  value: ArticleEditorData;
}>;

const richTextTools = [
  { label: "Bold", icon: Bold, before: "**", after: "**", placeholder: "bold text" },
  { label: "Italic", icon: Italic, before: "_", after: "_", placeholder: "italic text" },
  { label: "List", icon: List, before: "\n- ", after: "", placeholder: "list item" },
  { label: "Link", icon: Link2, before: "[", after: "](https://)", placeholder: "link text" },
  { label: "Image", icon: ImageIcon, before: "![", after: "](https://)", placeholder: "image alt" },
  { label: "Code", icon: Code2, before: "`", after: "`", placeholder: "code" },
] as const;

const articleBasicInformationStyles = `
  .admin-article-field--hero > input {
    height: 59px;
    padding: 0 16px;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .admin-article-basic__meta-grid {
    display: grid;
    margin-top: 22px;
    grid-template-columns: minmax(260px, 0.9fr) minmax(280px, 1.1fr);
    gap: 15px;
  }

  .admin-article-slug-input {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
  }

  .admin-article-slug-input > b {
    display: flex;
    height: 47px;
    padding: 0 12px;
    align-items: center;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-right: 0;
    border-radius: 2px 0 0 2px;
    color: #9a958b;
    background: #1b1a18;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 500;
  }

  .admin-article-slug-input > input { border-radius: 0 2px 2px 0; }
  .admin-article-basic .admin-article-field:last-child { margin-top: 22px; }

  .admin-article-rich-editor {
    overflow: hidden;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-radius: 3px;
    background: var(--article-input);
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }

  .admin-article-rich-editor:focus-within {
    border-color: rgba(239, 199, 63, 0.48);
    box-shadow: 0 0 0 3px rgba(239, 199, 63, 0.055);
  }

  .admin-article-rich-editor.is-fullscreen {
    position: fixed;
    z-index: 410;
    inset: 24px;
    display: grid;
    border-color: rgba(239, 199, 63, 0.4);
    background: #0b0b0a;
    box-shadow: 0 32px 110px rgba(0, 0, 0, 0.88), 0 0 0 100vmax rgba(0, 0, 0, 0.78);
    grid-template-rows: auto 1fr;
  }

  .admin-article-rich-editor__toolbar {
    display: flex;
    min-height: 47px;
    padding: 6px 9px;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 1px solid rgba(226, 191, 95, 0.14);
    background: #1a1917;
  }

  .admin-article-rich-editor__toolbar > div {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .admin-article-rich-editor__toolbar button {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 1px solid transparent;
    border-radius: 3px;
    color: #c9c3b8;
    background: transparent;
    cursor: pointer;
    transition: color 160ms ease, border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
  }

  .admin-article-rich-editor__toolbar button:hover {
    color: var(--article-yellow);
    border-color: rgba(239, 199, 63, 0.18);
    background: rgba(239, 199, 63, 0.06);
    transform: translateY(-1px);
  }

  .admin-article-rich-editor textarea {
    display: block;
    min-height: 345px;
    padding: 20px;
    border: 0;
    outline: 0;
    color: #d9d5cd;
    background: #080808;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.75;
    resize: vertical;
  }

  .admin-article-rich-editor.is-fullscreen textarea { height: 100%; resize: none; }

  @media (max-width: 700px) {
    .admin-article-basic__meta-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 520px) {
    .admin-article-field--hero > input { height: 54px; font-size: 15px; }
    .admin-article-rich-editor__toolbar { align-items: flex-start; flex-direction: column; }
    .admin-article-rich-editor__toolbar > div { width: 100%; justify-content: space-between; }
    .admin-article-rich-editor textarea { min-height: 300px; }
    .admin-article-rich-editor.is-fullscreen { inset: 8px; }
  }
`;

const ArticleBasicInformation = ({ onChange, value }: ArticleBasicInformationProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const updateTitle = (title: string) => {
    const update: ArticleEditorUpdate = { title };
    if (!slugEdited) update.slug = slugifyArticleTitle(title) || "future-of-ai-technology";
    onChange(update);
  };

  const insertMarkup = (before: string, after = before, placeholder = "text") => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.content.slice(start, end) || placeholder;
    const content = `${value.content.slice(0, start)}${before}${selected}${after}${value.content.slice(end)}`;
    onChange({ content });
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  return (
    <ArticleEditorSection className="admin-article-basic" delay={70} title="Basic Information">
      <style data-component="admin-article-basic-information">{articleBasicInformationStyles}</style>
      <div className="admin-article-section__body">
        <label className="admin-article-field admin-article-field--hero">
          <span>Article Title</span>
          <input
            autoFocus
            value={value.title}
            onChange={(event) => updateTitle(event.target.value)}
            placeholder="Enter a compelling headline..."
          />
        </label>

        <div className="admin-article-basic__meta-grid">
          <label className="admin-article-field admin-article-field--slug">
            <span>URL Slug</span>
            <span className="admin-article-slug-input">
              <b>/news/</b>
              <input
                value={value.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  onChange({ slug: slugifyArticleTitle(event.target.value) });
                }}
                aria-label="URL slug"
              />
            </span>
          </label>
          <label className="admin-article-field">
            <span>Subtitle / Excerpt</span>
            <input value={value.excerpt} onChange={(event) => onChange({ excerpt: event.target.value })} />
          </label>
        </div>

        <label className="admin-article-field">
          <span>Rich Text Content</span>
          <div className={`admin-article-rich-editor${fullscreen ? " is-fullscreen" : ""}`}>
            <div className="admin-article-rich-editor__toolbar" role="toolbar" aria-label="Rich text toolbar">
              <div>
                {richTextTools.map(({ label, icon: Icon, before, after, placeholder }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    aria-label={label}
                    onClick={() => insertMarkup(before, after, placeholder)}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label={fullscreen ? "Exit full screen editor" : "Open full screen editor"}
                title={fullscreen ? "Exit full screen" : "Full screen"}
                onClick={() => setFullscreen((current) => !current)}
              >
                {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
            <textarea
              ref={editorRef}
              value={value.content}
              onChange={(event) => onChange({ content: event.target.value })}
              placeholder="Start writing your story here..."
              aria-label="Article content"
            />
          </div>
        </label>
      </div>
    </ArticleEditorSection>
  );
};

export default ArticleBasicInformation;
