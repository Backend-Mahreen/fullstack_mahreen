import { SquarePen } from "lucide-react";

interface CatatanTambahanProps {
  notes?: string;
}

const CatatanTambahan = ({ notes = "" }: CatatanTambahanProps) => {
  return (
    <section className="review-card review-card--section review-reveal" aria-labelledby="catatan-tambahan-title">
      <h2 className="review-section-title" id="catatan-tambahan-title">
        <SquarePen aria-hidden="true" />
        <span>Catatan Tambahan</span>
      </h2>

      <div className="review-text-box review-text-box--note">
        <p>{notes.trim() || "Tidak ada catatan tambahan"}</p>
      </div>
    </section>
  );
};

export default CatatanTambahan;
