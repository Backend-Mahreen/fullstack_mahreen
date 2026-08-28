import { ArrowRight } from "lucide-react";

interface ButtunKirimProps {
  submitting?: boolean;
}

const ButtunKirim = ({ submitting = false }: ButtunKirimProps) => {
  return (
    <div className="consult-submit-area consult-form-reveal">
      <p className="consult-privacy-copy">
        Dengan mengirimkan form ini, Anda setuju dengan<br />
        <a href="/kebijakan-privasi">Kebijakan Privasi</a> kami. Tim kami akan
        menghubungi Anda<br />dalam waktu <strong>24 jam.</strong>
      </p>

      <button className="consult-submit-button" type="submit" disabled={submitting}>
        <span>{submitting ? "Menyiapkan Review..." : "Lanjutkan ke Review"}</span>
        <ArrowRight aria-hidden="true" />
      </button>
    </div>
  );
};

export default ButtunKirim;
