import { Check } from "lucide-react";

import { stepMeta } from "../../../../data/csrRegistration";
import type { RegistrationStep } from "../../../../types/csrRegistration";
import { navigateToStep } from "../../../../utils/csrRegistration";

const ProgressIndicator = ({
  currentStep,
}: Readonly<{ currentStep: RegistrationStep }>) => (
  <nav className="csr-registration-progress" aria-label="Tahapan pendaftaran CSR">
    {stepMeta.map((item) => {
      const isActive = item.number === currentStep;
      const isComplete = item.number < currentStep;
      const canReturn = item.number < currentStep && currentStep < 4;

      return (
        <div
          className={`csr-registration-progress__step${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
          key={item.number}
        >
          <button
            className={`csr-registration-progress__button${canReturn ? " can-return" : ""}`}
            type="button"
            onClick={() => canReturn && navigateToStep(item.number)}
            disabled={!canReturn}
            aria-current={isActive ? "step" : undefined}
            aria-label={`${item.label}, langkah ${item.number}${isActive ? ", aktif" : ""}`}
          >
            <span className="csr-registration-progress__circle">
              {isComplete ? <Check size={15} strokeWidth={2.1} /> : item.number}
            </span>
            <span className="csr-registration-progress__label">{item.label}</span>
          </button>
        </div>
      );
    })}
  </nav>
);

export default ProgressIndicator;
