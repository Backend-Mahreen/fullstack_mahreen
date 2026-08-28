import { CalendarCheck } from "lucide-react";

interface TargetPenyelesaianProps {
  value: string;
  onChange: (value: string) => void;
}

const targetOptions = ["Secepatnya", "1 Minggu", "2 Minggu", "1 Bulan", "Fleksibel"];

const TargetPenyelesaian = ({ value, onChange }: TargetPenyelesaianProps) => {
  return (
    <section className="consult-card consult-form-reveal" aria-labelledby="target-title">
      <h2 className="consult-section-title" id="target-title">
        <CalendarCheck aria-hidden="true" />
        <span>5. Target Penyelesaian</span>
      </h2>

      <div className="consult-target-options">
        {targetOptions.map((option) => (
          <button
            className={`consult-option-button consult-target-button${
              value === option ? " is-selected" : ""
            }`}
            type="button"
            key={option}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TargetPenyelesaian;
