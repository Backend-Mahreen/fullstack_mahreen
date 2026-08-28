import { CircleDollarSign } from "lucide-react";
import type { CampaignCategory } from "../../../../services/campaign/campaignRepository";
import type { CampaignFormData } from "./campaignFormTypes";

type CampaignBasicInformationProps = {
  form: CampaignFormData;
  onChange: (patch: Partial<CampaignFormData>) => void;
};

const categories: CampaignCategory[] = [
  "Education",
  "Emergency",
  "Sustainable Life",
  "Health",
];

const CampaignBasicInformation = ({ form, onChange }: CampaignBasicInformationProps) => (
  <section className="acw-card acw-reveal" style={{ "--acw-delay": "100ms" } as React.CSSProperties}>
    <header className="acw-card__heading">
      <span><CircleDollarSign aria-hidden="true" /></span>
      <h2>Informasi Utama</h2>
    </header>
    <label className="acw-field">
      <span>Judul Campaign</span>
      <input
        maxLength={90}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="Contoh: Renovasi Sekolah Pelosok"
        value={form.title}
      />
    </label>
    <div className="acw-two-fields acw-two-fields--wide-right">
      <label className="acw-field">
        <span>Kategori</span>
        <select
          onChange={(event) => onChange({ category: event.target.value as CampaignCategory })}
          value={form.category}
        >
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
      <label className="acw-field">
        <span>Lokasi Campaign</span>
        <input
          onChange={(event) => onChange({ location: event.target.value })}
          placeholder="Masukkan kota atau provinsi"
          value={form.location}
        />
      </label>
    </div>
  </section>
);

export default CampaignBasicInformation;
