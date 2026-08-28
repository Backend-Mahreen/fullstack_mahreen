type DonationStepperProps = Readonly<{
  activeStep: 1 | 2 | 3;
}>;

const steps = [
  { number: 1, label: "Nominal" },
  { number: 2, label: "Data Diri" },
  { number: 3, label: "Pembayaran" },
] as const;

const DonationStepper = ({ activeStep }: DonationStepperProps) => (
  <div className="donation-stepper" aria-label={`Langkah ${activeStep} dari 3`}>
    {steps.map((step) => (
      <div
        key={step.number}
        className={`donation-stepper__item${
          step.number === activeStep ? " is-active" : step.number < activeStep ? " is-complete" : ""
        }`}
      >
        <span className="donation-stepper__number">{step.number}</span>
        <span className="donation-stepper__label">{step.label}</span>
      </div>
    ))}
  </div>
);

export default DonationStepper;
