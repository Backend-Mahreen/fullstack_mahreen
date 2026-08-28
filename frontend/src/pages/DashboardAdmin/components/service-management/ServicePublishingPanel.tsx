import { Rocket, Save, Trash2 } from "lucide-react";

type ServicePublishingPanelProps = {
  active: boolean;
  isSaving: boolean;
  lastSaved: string | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  onDiscard: () => void;
};

const ServicePublishingPanel = ({
  active,
  isSaving,
  lastSaved,
  onSaveDraft,
  onPublish,
  onDiscard,
}: ServicePublishingPanelProps) => (
  <aside className="ans-card ans-publishing ans-reveal" style={{ "--ans-delay": "230ms" } as React.CSSProperties}>
    <strong>Publishing Panel</strong>
    <dl><div><dt>Last Saved</dt><dd>{lastSaved ?? "Not yet saved"}</dd></div><div><dt>Visibility</dt><dd>{active ? "Public" : "Admin Only"}</dd></div></dl>
    <button className="ans-publishing__draft" type="button" disabled={isSaving} onClick={onSaveDraft}><Save aria-hidden="true" />{isSaving ? "Saving..." : "Save Draft"}</button>
    <button className="ans-publishing__publish" type="button" disabled={isSaving} onClick={onPublish}><Rocket aria-hidden="true" />{isSaving ? "Publishing..." : "Publish Service"}</button>
    <button className="ans-publishing__discard" type="button" onClick={onDiscard}><Trash2 aria-hidden="true" />Discard Changes</button>
  </aside>
);

export default ServicePublishingPanel;
