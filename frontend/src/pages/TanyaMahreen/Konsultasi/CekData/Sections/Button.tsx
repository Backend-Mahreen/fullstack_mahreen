import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";

interface ButtonProps {
  onEdit: () => void;
  onContinue: () => void;
  submitting?: boolean;
  error?: string;
}

const Button = ({ onEdit, onContinue, submitting = false, error = "" }: ButtonProps) => {
  return (
    <section className="review-actions review-reveal" aria-label="Tindakan review data">
      <div className="review-action-buttons">
        <button className="review-button review-button--secondary" type="button" onClick={onEdit}>
          <ArrowLeft aria-hidden="true" />
          <span>Edit Data</span>
        </button>

        <button className="review-button review-button--primary" type="button" onClick={onContinue} disabled={submitting}>
          <span>{submitting ? "Mengirim Permintaan..." : "Kirim Permintaan"}</span>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>

      {error && <p className="review-security-copy" role="alert">{error}</p>}
      <p className="review-security-copy">
        <LockKeyhole aria-hidden="true" />
        <span>Data Anda aman dan terenkripsi. Sesuai Kebijakan Privasi Mahreen Indonesia.</span>
      </p>
    </section>
  );
};

export default Button;
