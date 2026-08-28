interface SteepProgresProps {
  currentStep?: number;
}

const steps = [
  "Isi Form",
  "Review Data",
  "Klien Permintaan",
  "Hubungi PM",
];

const SteepProgres = ({ currentStep = 1 }: SteepProgresProps) => {
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), steps.length);

  return (
    <nav className="consult-stepper" aria-label="Tahapan konsultasi">
      <div className="consult-stepper__track" aria-hidden="true">
        <span
          className="consult-stepper__progress"
          style={{
            width: `${((safeCurrentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {steps.map((step, index) => {
        const number = index + 1;
        const isActive = number === safeCurrentStep;
        const isComplete = number < safeCurrentStep;

        return (
          <div
            className={`consult-stepper__item${isActive ? " is-active" : ""}${
              isComplete ? " is-complete" : ""
            }`}
            key={step}
            aria-current={isActive ? "step" : undefined}
          >
            <span className="consult-stepper__number">{number}</span>
            <span className="consult-stepper__label">{step}</span>
          </div>
        );
      })}
    </nav>
  );
};

export default SteepProgres;
