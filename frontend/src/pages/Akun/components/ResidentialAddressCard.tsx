import { MapPin } from "lucide-react";
import CountryPicker from "../../../components/Form/CountryPicker";
import type { ProfileEditForm, ProfileFieldChange } from "./profileFormTypes";

type Props = Readonly<{ form: ProfileEditForm; onChange: ProfileFieldChange }>;

const ResidentialAddressCard = ({ form, onChange }: Props) => (
  <section className="profile-editor-card" data-profile-reveal="3" aria-labelledby="residential-address-title">
    <h2 className="profile-editor-card__title" id="residential-address-title"><MapPin aria-hidden="true" />Residential Address</h2>
    <div className="profile-editor-grid profile-editor-grid--two">
      <div className="profile-editor-field">
        <span id="profile-country-label">Country</span>
        <CountryPicker
          value={form.country}
          onChange={(value) => onChange("country", value)}
          ariaLabelledBy="profile-country-label"
        />
      </div>
      <label className="profile-editor-field">
        <span>Province</span>
        <input value={form.province} onChange={(event) => onChange("province", event.target.value)} placeholder="DKI Jakarta" />
      </label>
      <label className="profile-editor-field profile-editor-field--half">
        <span>City</span>
        <input value={form.city} onChange={(event) => onChange("city", event.target.value)} placeholder="South Jakarta" />
      </label>
      <label className="profile-editor-field profile-editor-field--wide">
        <span>Full Address</span>
        <textarea value={form.address} onChange={(event) => onChange("address", event.target.value)} placeholder="Sudirman Central Business District, Treasury Tower Lt. 18, Senayan, Kebayoran Baru" rows={3} />
      </label>
    </div>
  </section>
);

export default ResidentialAddressCard;
