import { Banknote } from "lucide-react";

interface BudgetProps {
  value: string;
  onChange: (value: string) => void;
}

const budgetOptions = [
  "< 1 Juta",
  "1 - 3 Juta",
  "3 - 5 Juta",
  "5 - 10 Juta",
  "> 10 Juta",
];

const Budget = ({ value, onChange }: BudgetProps) => {
  return (
    <section
      className="consult-card consult-card--budget consult-form-reveal"
      aria-labelledby="budget-title"
    >
      <h2 className="consult-section-title" id="budget-title">
        <Banknote aria-hidden="true" />
        <span>4. Budget</span>
      </h2>

      <div className="consult-budget-options">
        {budgetOptions.map((option) => {
          const selected = value === option;

          return (
            <label
              className={`consult-radio-option${selected ? " is-selected" : ""}`}
              key={option}
            >
              <input
                type="radio"
                name="budget"
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
              />
              <span className="consult-radio-dot" aria-hidden="true" />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
};

export default Budget;
