import type { CSSProperties, ReactNode } from "react";

type ArticleEditorSectionProps = Readonly<{
  children: ReactNode;
  className?: string;
  delay?: number;
  title: string;
}>;

const articleEditorSectionStyles = `
  .admin-article-section {
    position: relative;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--article-border);
    border-radius: 6px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.012), transparent 52%), var(--article-panel);
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.12);
    transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
  }

  .admin-article-section::before {
    position: absolute;
    z-index: 0;
    top: -80px;
    right: -80px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    content: "";
    background: radial-gradient(circle, rgba(239, 199, 63, 0.04), transparent 66%);
    pointer-events: none;
  }

  .admin-article-section:hover {
    border-color: rgba(239, 199, 63, 0.34);
    box-shadow: 0 19px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(239, 199, 63, 0.02) inset;
    transform: translateY(-2px);
  }

  .admin-article-section__heading {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 62px;
    padding: 21px 23px 12px;
    align-items: center;
    gap: 14px;
  }

  .admin-article-section__heading > span {
    flex: 0 0 auto;
    color: var(--article-yellow);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .admin-article-section__heading > i {
    display: block;
    height: 1px;
    flex: 1;
    background: linear-gradient(90deg, rgba(239, 199, 63, 0.24), rgba(255, 255, 255, 0.045));
  }

  .admin-article-section__body {
    position: relative;
    z-index: 1;
    padding: 10px 23px 24px;
  }

  .admin-article-stack { display: grid; gap: 18px; }
  .admin-article-field { display: grid; min-width: 0; gap: 8px; }

  .admin-article-field > span:first-child,
  .admin-article-mini-label {
    color: #aaa398;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .admin-article-field input,
  .admin-article-field select,
  .admin-article-field textarea {
    width: 100%;
    min-width: 0;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-radius: 2px;
    outline: 0;
    color: #e9e5dd;
    background: var(--article-input);
    font-size: 14px;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
  }

  .admin-article-field input,
  .admin-article-field select { height: 47px; padding: 0 13px; }
  .admin-article-field textarea { padding: 13px; resize: vertical; }
  .admin-article-field select { color-scheme: dark; }
  .admin-article-field input::placeholder,
  .admin-article-field textarea::placeholder { color: #676d7d; }

  .admin-article-field input:focus,
  .admin-article-field select:focus,
  .admin-article-field textarea:focus {
    border-color: rgba(239, 199, 63, 0.58);
    background: #0d0d0c;
    box-shadow: 0 0 0 3px rgba(239, 199, 63, 0.065), 0 0 24px rgba(239, 199, 63, 0.025);
  }

  .admin-article-field > small {
    color: #706b62;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
  }

  .admin-article-input-icon { position: relative; display: block; }
  .admin-article-input-icon + .admin-article-input-icon { margin-top: 8px; }
  .admin-article-input-icon > svg {
    position: absolute;
    z-index: 2;
    top: 50%;
    right: 13px;
    color: #aaa398;
    pointer-events: none;
    transform: translateY(-50%);
  }
  .admin-article-input-icon input { padding-right: 40px; }

  @media (max-width: 1180px) {
    .admin-article-section__body { padding-right: 18px; padding-left: 18px; }
  }

  @media (max-width: 520px) {
    .admin-article-section__heading { min-height: 56px; padding: 18px 16px 10px; }
    .admin-article-section__body { padding: 9px 16px 19px; }
  }
`;

const ArticleEditorSection = ({ children, className = "", delay = 0, title }: ArticleEditorSectionProps) => (
  <section
    className={`admin-article-section admin-article-enter ${className}`.trim()}
    style={{ "--article-delay": `${delay}ms` } as CSSProperties}
  >
    <style data-component="admin-article-editor-section">{articleEditorSectionStyles}</style>
    <header className="admin-article-section__heading">
      <span>{title}</span>
      <i aria-hidden="true" />
    </header>
    {children}
  </section>
);

export default ArticleEditorSection;
