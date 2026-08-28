type PurchaseProgressProps = {
  activeStep: 1 | 2 | 3;
  variant?: "compact" | "track";
  prefix?: "payment-steps" | "review-steps";
};

const labels = ["Shipping", "Payment", "Review"];

const PurchaseProgress = ({
  activeStep,
  variant = "track",
  prefix = "payment-steps",
}: PurchaseProgressProps) => {
  if (variant === "compact") {
    const compactLabels = ["Details", "Payment", "Success"];
    return (
      <ol className="steps" aria-label="Tahapan checkout">
        {compactLabels.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3;
          const state = step <= activeStep ? "active" : "inactive";
          return (
            <li key={label} style={{ display: "contents" }}>
              <span className={`steps__item steps__item--${state}`} aria-current={step === activeStep ? "step" : undefined}>
                <span className="steps__badge">{step < activeStep ? "✓" : step}</span>
                <span className="steps__label">{label}</span>
              </span>
              {step < 3 ? <span className="steps__divider" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className={prefix} aria-label="Progres checkout">
      <div className={`${prefix}__track`}>
        <div className={`${prefix}__fill`} />
      </div>
      <ul className={`${prefix}__items`}>
        {labels.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3;
          const state = step < activeStep ? "completed" : step === activeStep ? "active" : "inactive";
          return (
            <li className={`step-node step-node--${state}`} key={label} aria-current={step === activeStep ? "step" : undefined}>
              <div className="step-node__icon">{step < activeStep ? "✓" : step}</div>
              <span className="step-node__label">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PurchaseProgress;
