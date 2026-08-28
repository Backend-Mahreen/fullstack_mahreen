import { BadgeCheck, UserRound } from "lucide-react";
import InternationalPhoneInput from "../../../components/Form/InternationalPhoneInput";
import type { ProfileEditForm, ProfileFieldChange } from "./profileFormTypes";

type Props = Readonly<{ form: ProfileEditForm; onChange: ProfileFieldChange }>;

const PersonalInformationCard = ({ form, onChange }: Props) => (
  <section className="profile-editor-card" data-profile-reveal="2" aria-labelledby="personal-information-title">
    <h2 className="profile-editor-card__title" id="personal-information-title"><UserRound aria-hidden="true" />Personal Information</h2>
    <div className="profile-editor-grid profile-editor-grid--two">
      <label className="profile-editor-field">
        <span>Full Name</span>
        <input value={form.fullName} onChange={(event) => onChange("fullName", event.target.value)} placeholder="Alexander Mahreen" required />
      </label>
      <label className="profile-editor-field">
        <span>Nickname</span>
        <input value={form.nickname} onChange={(event) => onChange("nickname", event.target.value)} placeholder="Alex" />
      </label>
      <label className="profile-editor-field">
        <span>Email Address</span>
        <span className="profile-editor-input-with-badge">
          <input value={form.email} disabled aria-describedby="verified-email-label" />
          <small id="verified-email-label"><BadgeCheck aria-hidden="true" />Verified</small>
        </span>
      </label>
      <label className="profile-editor-field">
        <span>WhatsApp Number</span>
        <InternationalPhoneInput
          className="profile-editor-phone"
          value={form.whatsapp}
          onChange={(value) => onChange("whatsapp", value)}
          placeholder="812 3456 7890"
        />
      </label>
      <label className="profile-editor-field profile-editor-field--half">
        <span>Date of Birth</span>
        <input type="date" value={form.birthDate} onChange={(event) => onChange("birthDate", event.target.value)} />
      </label>
    </div>
  </section>
);

export default PersonalInformationCard;
