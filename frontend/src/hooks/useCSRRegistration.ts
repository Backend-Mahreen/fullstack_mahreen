import { useEffect, useState } from "react";

import type { CSRRegistrationData, RegistrationStep } from "../types/csrRegistration";
import { readCSRRegistrationData, saveCSRRegistrationData } from "../services/csrRegistrationStorage";
import { hasCompleteRegistrationDetails, navigateToStep } from "../utils/csrRegistration";

const useCSRRegistration = (step: RegistrationStep) => {
  const [data, setData] = useState<CSRRegistrationData>(readCSRRegistrationData);

  const updateData = (updates: Partial<CSRRegistrationData>) => {
    setData((currentData) => {
      const nextData = { ...currentData, ...updates };
      saveCSRRegistrationData(nextData);
      return nextData;
    });
  };

  useEffect(() => {
    if (step > 1 && !data.role) {
      navigateToStep(1);
      return;
    }

    if (step > 2 && !hasCompleteRegistrationDetails(data)) {
      navigateToStep(2);
      return;
    }

    if (step === 4 && !data.submittedAt) {
      navigateToStep(3);
    }
  }, [data, step]);

  return { data, updateData };
};

export default useCSRRegistration;
