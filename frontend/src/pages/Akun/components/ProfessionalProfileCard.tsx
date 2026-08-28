import { BriefcaseBusiness, Link2 } from "lucide-react";
import type { ProfileEditForm, ProfileFieldChange } from "./profileFormTypes";

type Props = Readonly<{ form: ProfileEditForm; onChange: ProfileFieldChange }>;

const ProfessionalProfileCard = ({ form, onChange }: Props) => (
  <section className="profile-editor-card" data-profile-reveal="4" aria-labelledby="professional-profile-title">
    <h2 className="profile-editor-card__title" id="professional-profile-title"><BriefcaseBusiness aria-hidden="true" />Professional Profile</h2>
    <div className="profile-editor-grid profile-editor-grid--two">
      <label className="profile-editor-field">
        <span>Job Title</span>
        <input value={form.jobTitle} onChange={(event) => onChange("jobTitle", event.target.value)} placeholder="Principal UX Architect" />
      </label>
      <label className="profile-editor-field">
        <span>Company/Institution</span>
        <input value={form.institution} onChange={(event) => onChange("institution", event.target.value)} placeholder="Mahreen Tech Corp" />
      </label>
      <label className="profile-editor-field profile-editor-field--wide">
        <span>LinkedIn URL</span>
        <span className="profile-editor-link-input"><Link2 aria-hidden="true" /><input value={form.linkedin} onChange={(event) => onChange("linkedin", event.target.value)} placeholder="linkedin.com/in/alexmahreen" /></span>
      </label>
    </div>
  </section>
);

export default ProfessionalProfileCard;
