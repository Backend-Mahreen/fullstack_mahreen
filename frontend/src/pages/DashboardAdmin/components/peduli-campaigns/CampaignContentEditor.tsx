import { Bold, Italic, Link, List, NotebookText } from "lucide-react";
import type { CampaignFormData } from "./campaignFormTypes";

type CampaignContentEditorProps = {
  form: CampaignFormData;
  onChange: (patch: Partial<CampaignFormData>) => void;
};

const CampaignContentEditor = ({ form, onChange }: CampaignContentEditorProps) => (
  <section className="acw-card acw-reveal" style={{ "--acw-delay": "240ms" } as React.CSSProperties}>
    <header className="acw-card__heading">
      <span><NotebookText aria-hidden="true" /></span>
      <h2>Konten &amp; Cerita</h2>
    </header>
    <label className="acw-field">
      <span>Cerita Campaign</span>
      <div className="acw-editor">
        <div className="acw-editor__toolbar" aria-label="Toolbar teks">
          <button aria-label="Tebal" type="button"><Bold aria-hidden="true" /></button>
          <button aria-label="Miring" type="button"><Italic aria-hidden="true" /></button>
          <button aria-label="Daftar" type="button"><List aria-hidden="true" /></button>
          <button aria-label="Tautan" type="button"><Link aria-hidden="true" /></button>
        </div>
        <textarea
          maxLength={4000}
          onChange={(event) => onChange({ story: event.target.value })}
          placeholder="Bangun narasi kemanusiaan yang menyentuh di sini..."
          value={form.story}
        />
      </div>
    </label>
    <label className="acw-field acw-field--spaced">
      <span>Meta Description (SEO)</span>
      <textarea
        className="is-small"
        maxLength={160}
        onChange={(event) => onChange({ metaDescription: event.target.value })}
        placeholder="Ringkasan singkat untuk hasil pencarian Google..."
        value={form.metaDescription}
      />
      <small>{form.metaDescription.length}/160 karakter</small>
    </label>
  </section>
);

export default CampaignContentEditor;
