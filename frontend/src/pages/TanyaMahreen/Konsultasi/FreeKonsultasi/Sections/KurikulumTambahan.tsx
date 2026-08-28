import { ClipboardPlus } from "lucide-react";

interface KurikulumTambahanProps {
  value: string;
  onChange: (value: string) => void;
}

const KurikulumTambahan = ({ value, onChange }: KurikulumTambahanProps) => {
  return (
    <section className="consult-card consult-form-reveal" aria-labelledby="catatan-title">
      <h2 className="consult-section-title" id="catatan-title">
        <ClipboardPlus aria-hidden="true" />
        <span>7. Catatan Tambahan</span>
      </h2>

      <textarea
        className="consult-textarea consult-textarea--notes"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Apa pun yang ingin Anda sampaikan kepada tim kami..."
        aria-label="Catatan tambahan"
      />
    </section>
  );
};

export default KurikulumTambahan;
