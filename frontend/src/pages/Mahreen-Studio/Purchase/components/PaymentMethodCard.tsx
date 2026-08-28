import PaymentBrandLogo from "../../../../components/Payment/PaymentBrandLogo";
import type { PaymentBrandId } from "../../../../data/paymentBrands";

type PaymentMethodCardProps = {
  id: string;
  selected: boolean;
  brand: PaymentBrandId;
  title: string;
  description: string;
  virtualAccount: string;
  copied: boolean;
  onSelect: (id: string) => void;
  onCopy: (virtualAccount: string) => void;
};

const PaymentMethodCard = ({
  id,
  selected,
  brand,
  title,
  description,
  virtualAccount,
  copied,
  onSelect,
  onCopy,
}: PaymentMethodCardProps) => (
  <div
    className={`method-card ${selected ? "method-card--selected" : ""}`}
    onClick={() => onSelect(id)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(id);
      }
    }}
    role="radio"
    aria-checked={selected}
    tabIndex={0}
  >
    <span className="method-card__left">
      <span className="method-card__logo-box">
        <PaymentBrandLogo brand={brand} />
      </span>
      <span className="method-card__info">
        <span className="method-card__name">{title}</span>
        <span className="method-card__type">{description}</span>
        {selected ? (
          <span className="va-details">
            <span className="va-number-row">
              <span className="va-number">{virtualAccount}</span>
              <button
                type="button"
                className="btn-copy"
                onClick={(event) => {
                  event.stopPropagation();
                  onCopy(virtualAccount);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
                </svg>
                {copied ? "Tersalin!" : "Salin"}
              </button>
            </span>
            <span className="va-account-name">ATAS NAMA: MAHREEN TECH INDONESIA</span>
          </span>
        ) : null}
      </span>
    </span>
    <span className="radio-indicator" aria-hidden="true">
      {selected ? <span className="radio-indicator__dot" /> : null}
    </span>
  </div>
);

export default PaymentMethodCard;
