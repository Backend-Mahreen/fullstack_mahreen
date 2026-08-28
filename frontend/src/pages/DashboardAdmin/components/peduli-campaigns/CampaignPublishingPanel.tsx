import { Eye, Lightbulb, Save, Send, Trash2 } from "lucide-react";
import type { CampaignVisibility } from "../../../../services/campaign/campaignRepository";
import type { CampaignFormData } from "./campaignFormTypes";

type CampaignPublishingPanelProps = {
  completion: number;
  form: CampaignFormData;
  hasExistingCampaign: boolean;
  onChange: (patch: Partial<CampaignFormData>) => void;
  onDelete: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
};

const CampaignPublishingPanel = ({
  completion,
  form,
  hasExistingCampaign,
  onChange,
  onDelete,
  onPublish,
  onSaveDraft,
}: CampaignPublishingPanelProps) => (
  <aside className="acw-side-column">
    <section className="acw-card acw-publishing acw-reveal" style={{ "--acw-delay": "150ms" } as React.CSSProperties}>
      <header>
        <h2>Publishing</h2>
        <span>{form.status}</span>
      </header>
      <label className="acw-publish-row">
        <span><Eye aria-hidden="true" /><span>Visibility<small>Settings</small></span></span>
        <select
          onChange={(event) => onChange({ visibility: event.target.value as CampaignVisibility })}
          value={form.visibility}
        >
          <option>Public</option>
          <option>Admin Only</option>
        </select>
      </label>
      <label className="acw-publish-row">
        <span><Send aria-hidden="true" /><span>Publish<small>Schedule</small></span></span>
        <input
          aria-label="Jadwal publikasi"
          onChange={(event) => onChange({ publishSchedule: event.target.value })}
          type="datetime-local"
          value={form.publishSchedule}
        />
      </label>
      <label className="acw-check">
        <input
          checked={form.allowAnonymous}
          onChange={(event) => onChange({ allowAnonymous: event.target.checked })}
          type="checkbox"
        />
        <span>Aktifkan donasi anonim</span>
      </label>
      <label className="acw-check">
        <input
          checked={form.notifySubscribers}
          onChange={(event) => onChange({ notifySubscribers: event.target.checked })}
          type="checkbox"
        />
        <span>Kirim notifikasi ke subscriber</span>
      </label>
      <button className="acw-publish-button" onClick={onPublish} type="button">
        <Send aria-hidden="true" /> Terbitkan Campaign
      </button>
      <button className="acw-draft-button" onClick={onSaveDraft} type="button">
        <Save aria-hidden="true" /> Simpan Draft
      </button>
      {hasExistingCampaign ? (
        <button className="acw-delete-button" onClick={onDelete} type="button">
          <Trash2 aria-hidden="true" /> Hapus Campaign
        </button>
      ) : null}
    </section>

    <section className="acw-card acw-optimization acw-reveal" style={{ "--acw-delay": "230ms" } as React.CSSProperties}>
      <h2><Lightbulb aria-hidden="true" /> Optimasi Campaign</h2>
      <p>
        Campaign dengan judul, cerita, metadata, dan visual lengkap lebih mudah dipahami calon donatur.
      </p>
      <div className="acw-completion">
        <i style={{ width: `${completion}%` }} />
      </div>
      <small>{completion}% Form Completion</small>
    </section>
  </aside>
);

export default CampaignPublishingPanel;
