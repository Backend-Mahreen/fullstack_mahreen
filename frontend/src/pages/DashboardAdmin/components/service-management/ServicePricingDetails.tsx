import { BadgeDollarSign, Plus, Trash2 } from "lucide-react";
import type { ServiceFormData } from "./serviceFormTypes";

type ServicePricingDetailsProps = {
  data: ServiceFormData;
  onChange: <Key extends keyof ServiceFormData>(
    key: Key,
    value: ServiceFormData[Key],
  ) => void;
};

const ServicePricingDetails = ({ data, onChange }: ServicePricingDetailsProps) => {
  const updateFeature = (index: number, value: string) => {
    onChange("features", data.features.map((feature, itemIndex) => itemIndex === index ? value : feature));
  };

  const addFeature = () => {
    if (data.features.length >= 8) return;
    onChange("features", [...data.features, ""]);
  };

  const removeFeature = (index: number) => {
    const nextFeatures = data.features.filter((_, itemIndex) => itemIndex !== index);
    onChange("features", nextFeatures.length ? nextFeatures : [""]);
  };

  return (
    <section className="ans-card ans-pricing ans-reveal" style={{ "--ans-delay": "180ms" } as React.CSSProperties}>
      <header className="ans-card__heading"><span><BadgeDollarSign aria-hidden="true" /></span><h2>Pricing &amp; Detail</h2></header>
      <label className="ans-field is-wide"><span>Harga Mulai</span><div className="ans-price-input"><b>Rp</b><input type="number" min="0" value={data.price} onChange={(event) => onChange("price", event.target.value)} placeholder="0" /></div></label>
      <label className="ans-field is-wide"><span>Deskripsi Layanan</span><textarea value={data.description} onChange={(event) => onChange("description", event.target.value)} placeholder="Deskripsikan keunggulan layanan secara detail..." /></label>
      <div className="ans-feature-heading"><span>Feature List</span><button type="button" onClick={addFeature}><Plus aria-hidden="true" />Tambah Fitur</button></div>
      <div className="ans-feature-list">
        {data.features.map((feature, index) => (
          <div className="ans-feature" key={`feature-${index}`}><input value={feature} onChange={(event) => updateFeature(index, event.target.value)} placeholder={index === 0 ? "Contoh: Konsultasi 1-on-1 Eksklusif" : "Contoh: Laporan Analisis Bulanan"} /><button type="button" aria-label={`Hapus fitur ${index + 1}`} onClick={() => removeFeature(index)}><Trash2 aria-hidden="true" /></button></div>
        ))}
      </div>
    </section>
  );
};

export default ServicePricingDetails;
