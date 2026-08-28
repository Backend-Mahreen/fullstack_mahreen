import { CircleDot } from "lucide-react";
import type { ServiceFormData } from "./serviceFormTypes";

type ServiceBasicInformationProps = {
  data: ServiceFormData;
  onChange: <Key extends keyof ServiceFormData>(
    key: Key,
    value: ServiceFormData[Key],
  ) => void;
};

const categories = [
  "Branding",
  "Business Consultation",
  "Digital Transformation",
  "CSR Strategy",
  "Creative Service",
  "Legal Consultation",
];

const ServiceBasicInformation = ({ data, onChange }: ServiceBasicInformationProps) => (
  <section className="ans-card ans-basic ans-reveal" style={{ "--ans-delay": "100ms" } as React.CSSProperties}>
    <header className="ans-card__heading"><span><CircleDot aria-hidden="true" /></span><h2>Informasi Dasar</h2></header>
    <label className="ans-field is-wide"><span>Nama Layanan</span><input value={data.name} onChange={(event) => onChange("name", event.target.value)} placeholder="Masukkan nama layanan..." /></label>
    <div className="ans-two-fields">
      <label className="ans-field"><span>Kategori Layanan</span><select value={data.category} onChange={(event) => onChange("category", event.target.value)}>{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
      <div className="ans-status-field"><div><span>Status Layanan</span><small>{data.active ? "Aktifkan untuk publikasi" : "Simpan sebagai draft"}</small></div><button className={data.active ? "is-active" : ""} type="button" role="switch" aria-checked={data.active} onClick={() => onChange("active", !data.active)}><i /></button></div>
    </div>
  </section>
);

export default ServiceBasicInformation;
