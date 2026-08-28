import { WandSparkles } from "lucide-react";

interface RingkasanBriefProps {
  kebutuhan: string;
}

const RingkasanBrief = ({ kebutuhan }: RingkasanBriefProps) => {
  return (
    <section className="review-card review-card--section review-reveal" aria-labelledby="ringkasan-brief-title">
      <h2 className="review-section-title" id="ringkasan-brief-title">
        <WandSparkles aria-hidden="true" />
        <span>Ringkasan Brief Kebutuhan</span>
      </h2>

      <div className="review-text-box">
        <p>{kebutuhan || "Brief kebutuhan belum diisi."}</p>
      </div>
    </section>
  );
};

export default RingkasanBrief;
