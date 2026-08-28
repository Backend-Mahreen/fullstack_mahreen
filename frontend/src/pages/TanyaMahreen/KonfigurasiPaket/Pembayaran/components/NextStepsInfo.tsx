import { Check, Circle } from "lucide-react";

const steps = [
  {
    title: "Konfirmasi Pembayaran",
    description: "Sistem akan memverifikasi data Anda secara real-time.",
  },
  {
    title: "Akses Client Portal",
    description: "Email aktivasi dashboard proyek pribadi akan dikirimkan.",
  },
  {
    title: "Kick-off Meeting",
    description: "Pilih jadwal konsultasi pertama bersama Project Manager.",
  },
];

const NextStepsInfo = () => (
  <section className="tp-next-steps" aria-labelledby="next-steps-title">
    <p id="next-steps-title" className="tp-next-steps__eyebrow">
      Langkah Selanjutnya
    </p>

    <ol className="tp-next-steps__list">
      {steps.map((step, index) => (
        <li key={step.title} className={index === 0 ? "is-active" : ""}>
          <span className="tp-next-steps__marker" aria-hidden="true">
            {index === 0 ? <Check /> : <Circle />}
          </span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default NextStepsInfo;
