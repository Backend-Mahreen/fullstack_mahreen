import { Save } from "lucide-react";

type Props = Readonly<{ saving: boolean; onCancel: () => void }>;

const ProfileFormActions = ({ saving, onCancel }: Props) => (
  <div className="profile-editor-actions" data-profile-reveal="5">
    <button className="profile-editor-button profile-editor-button--secondary" type="button" onClick={onCancel}>Cancel</button>
    <button className="profile-editor-button profile-editor-button--primary" type="submit" disabled={saving}><Save aria-hidden="true" />{saving ? "Saving..." : "Save Changes"}</button>
  </div>
);

export default ProfileFormActions;
