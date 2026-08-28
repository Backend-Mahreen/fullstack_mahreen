import { FileText } from "lucide-react";

interface CeritakanKebutuhanProps {
  kebutuhan: string;
  onKebutuhanChange: (value: string) => void;
}

const CeritakanKebutuhan = ({
  kebutuhan,
  onKebutuhanChange,
}: CeritakanKebutuhanProps) => {
  return (
    <section
      className="consult-card consult-card--needs consult-form-reveal"
      aria-labelledby="kebutuhan-title"
    >
      <h2 className="consult-section-title" id="kebutuhan-title">
        <FileText aria-hidden="true" />
        <span>3. Ceritakan Kebutuhan</span>
      </h2>

      <textarea
        className="consult-textarea consult-textarea--large"
        value={kebutuhan}
        onChange={(event) => onKebutuhanChange(event.target.value)}
        placeholder="Deskripsikan masalah, tujuan, atau tantangan bisnis Anda saat ini secara detail..."
        aria-label="Ceritakan kebutuhan bisnis"
        required
      />
    </section>
  );
};

export default CeritakanKebutuhan;
