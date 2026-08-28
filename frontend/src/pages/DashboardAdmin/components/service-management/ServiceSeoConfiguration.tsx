import { SearchCheck } from "lucide-react";
import type { ServiceFormData } from "./serviceFormTypes";

type ServiceSeoConfigurationProps = {
  data: ServiceFormData;
  onChange: <Key extends keyof ServiceFormData>(
    key: Key,
    value: ServiceFormData[Key],
  ) => void;
};

const ServiceSeoConfiguration = ({ data, onChange }: ServiceSeoConfigurationProps) => (
  <section className="ans-card ans-seo ans-reveal" style={{ "--ans-delay": "260ms" } as React.CSSProperties}>
    <header className="ans-card__heading"><span><SearchCheck aria-hidden="true" /></span><h2>SEO Configuration</h2></header>
    <label className="ans-field is-wide"><span>SEO Title</span><input value={data.seoTitle} maxLength={70} onChange={(event) => onChange("seoTitle", event.target.value)} placeholder="Focus keyword for search engine..." /><small>{data.seoTitle.length}/70</small></label>
    <label className="ans-field is-wide"><span>Meta Description</span><textarea className="is-small" value={data.metaDescription} maxLength={160} onChange={(event) => onChange("metaDescription", event.target.value)} placeholder="Brief summary for search results snippets..." /><small>{data.metaDescription.length}/160</small></label>
  </section>
);

export default ServiceSeoConfiguration;
