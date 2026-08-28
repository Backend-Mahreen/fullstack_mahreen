import { CalendarRange } from "lucide-react";
import type { CampaignFormData } from "./campaignFormTypes";

type CampaignTargetPeriodProps = {
  form: CampaignFormData;
  onChange: (patch: Partial<CampaignFormData>) => void;
};

const CampaignTargetPeriod = ({ form, onChange }: CampaignTargetPeriodProps) => (
  <section className="acw-card acw-reveal" style={{ "--acw-delay": "170ms" } as React.CSSProperties}>
    <header className="acw-card__heading">
      <span><CalendarRange aria-hidden="true" /></span>
      <h2>Target &amp; Periode</h2>
    </header>
    <div className="acw-three-fields">
      <label className="acw-field">
        <span>Target Dana (Rp)</span>
        <div className="acw-money-input">
          <b>Rp</b>
          <input
            inputMode="numeric"
            onChange={(event) => onChange({ targetAmount: event.target.value.replace(/\D/g, "") })}
            placeholder="0"
            value={form.targetAmount}
          />
        </div>
      </label>
      <label className="acw-field">
        <span>Tanggal Berakhir</span>
        <input
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => onChange({ endDate: event.target.value })}
          type="date"
          value={form.endDate}
        />
      </label>
      <label className="acw-field">
        <span>Penanggung Jawab (PIC)</span>
        <input
          onChange={(event) => onChange({ pic: event.target.value })}
          placeholder="Nama PIC"
          value={form.pic}
        />
      </label>
    </div>
  </section>
);

export default CampaignTargetPeriod;
