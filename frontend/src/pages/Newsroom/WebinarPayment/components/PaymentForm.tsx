import {
  Building2,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  HelpCircle,
  LoaderCircle,
  LockKeyhole,
  QrCode,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import bcaLogo from "../../../../assets/Newsroom/payment-banks/bca.svg";
import bniLogo from "../../../../assets/Newsroom/payment-banks/bni.svg";
import briLogo from "../../../../assets/Newsroom/payment-banks/bri.svg";
import mandiriLogo from "../../../../assets/Newsroom/payment-banks/mandiri.svg";
import {
  formatRupiah,
  getWebinarPaymentInstructionPath,
  getWebinarRegistrationPath,
  type WebinarData,
} from "../../../../data/webinars";
import {
  calculateWebinarPayment,
  readWebinarBank,
  readWebinarPaymentMethod,
  saveWebinarBank,
  saveWebinarPayment,
  saveWebinarPaymentMethod,
  type WebinarBank,
  type WebinarPaymentMethod,
} from "../../../../services/webinarPaymentStorage";
import {
  readWebinarRegistration,
  type StoredWebinarRegistration,
} from "../../../../services/webinarRegistrationStorage";
import {
  getHashHref,
  handleHashRouteClick,
  navigateToHashRoute,
} from "../../../../utils/hashNavigation";

const paymentMethods = [
  {
    id: "qris" as const,
    title: "QRIS",
    description: "Instant confirmation via GoPay, OVO, Dana, LinkAja",
    icon: QrCode,
  },
  {
    id: "bank-transfer" as const,
    title: "Bank Transfer",
    description: "Transfer via BCA, Mandiri, BNI, or BRI",
    icon: Building2,
  },
] as const;

const bankOptions: ReadonlyArray<{
  id: WebinarBank;
  label: string;
  logo: string;
}> = [
  { id: "bca", label: "Bank Central Asia", logo: bcaLogo },
  { id: "mandiri", label: "Bank Mandiri", logo: mandiriLogo },
  { id: "bni", label: "Bank Negara Indonesia", logo: bniLogo },
  { id: "bri", label: "Bank Rakyat Indonesia", logo: briLogo },
];

const styles = `
  .webinar-payment {
    width: min(100%, 1160px);
    margin-inline: auto;
  }

  .webinar-payment__header {
    text-align: center;
    opacity: 0;
    transform: translateY(18px);
    animation: webinarPaymentEnter 620ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both;
  }

  .webinar-payment__step {
    display: inline-flex;
    min-height: 25px;
    padding: 5px 14px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(214, 180, 103, 0.08);
    border-radius: 999px;
    color: #d4b568;
    background: rgba(201, 165, 78, 0.08);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .webinar-payment__title {
    margin: 16px 0 0;
    color: #f2ede7;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(38px, 4.8vw, 50px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .webinar-payment__subtitle {
    margin: 12px auto 0;
    color: rgba(255, 255, 255, 0.62);
    font-size: 16px;
    line-height: 1.7;
    text-wrap: balance;
  }

  .webinar-payment__layout {
    display: grid;
    margin-top: clamp(28px, 4vw, 38px);
    grid-template-columns: minmax(0, 1.45fr) minmax(370px, 0.9fr);
    gap: clamp(28px, 4.5vw, 54px);
    align-items: start;
  }

  .webinar-payment__content {
    min-width: 0;
    padding-top: 9px;
    opacity: 0;
    transform: translateX(-22px);
    animation: webinarPaymentEnterLeft 720ms cubic-bezier(0.16, 1, 0.3, 1) 180ms both;
  }

  .webinar-payment__lead {
    margin: 0;
    color: rgba(255, 255, 255, 0.84);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 18px;
    font-weight: 500;
  }

  .webinar-payment__copy {
    max-width: 560px;
    margin: 12px 0 0;
    color: rgba(255, 255, 255, 0.61);
    font-size: 15px;
    line-height: 1.72;
  }

  .webinar-payment__eyebrow {
    display: block;
    margin-top: 25px;
    color: #d4b568;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .webinar-payment__methods {
    display: grid;
    margin-top: 18px;
    gap: 13px;
  }

  .webinar-payment-method {
    position: relative;
    display: grid;
    width: 100%;
    min-height: 94px;
    padding: 19px 21px;
    grid-template-columns: 52px minmax(0, 1fr) 24px;
    gap: 14px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    color: inherit;
    background: linear-gradient(145deg, rgba(14, 14, 14, 0.98), rgba(7, 7, 7, 0.98));
    text-align: left;
    cursor: pointer;
    opacity: 0;
    transform: translateY(14px);
    animation: webinarPaymentMethodEnter 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .webinar-payment-method:nth-child(1) { animation-delay: 280ms; }
  .webinar-payment-method:nth-child(2) { animation-delay: 340ms; }

  .webinar-payment-method:hover,
  .webinar-payment-method:focus-visible {
    border-color: rgba(214, 180, 103, 0.42);
    outline: none;
    transform: translateY(-2px);
  }

  .webinar-payment-method.is-selected {
    border-color: #d4b568;
    background:
      radial-gradient(circle at 0% 50%, rgba(212, 181, 104, 0.08), transparent 31%),
      linear-gradient(145deg, rgba(17, 16, 13, 0.99), rgba(7, 7, 7, 0.99));
    box-shadow:
      0 0 0 1px rgba(212, 181, 104, 0.08),
      0 14px 34px rgba(0, 0, 0, 0.24);
  }

  .webinar-payment-method__icon {
    display: inline-flex;
    width: 52px;
    height: 52px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.055);
  }

  .webinar-payment-method.is-selected .webinar-payment-method__icon {
    color: #d4b568;
    background: rgba(212, 181, 104, 0.1);
  }

  .webinar-payment-method__icon svg {
    width: 23px;
    height: 23px;
  }

  .webinar-payment-method__title {
    display: block;
    color: rgba(255, 255, 255, 0.88);
    font-size: 15px;
    font-weight: 600;
  }

  .webinar-payment-method__description {
    display: block;
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.54);
    font-size: 12px;
    line-height: 1.55;
  }

  .webinar-payment-method__radio {
    display: inline-flex;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    color: transparent;
  }

  .webinar-payment-method.is-selected .webinar-payment-method__radio {
    border-color: #d4b568;
    color: #d4b568;
  }

  .webinar-payment-method__radio svg {
    width: 9px;
    height: 9px;
    fill: currentColor;
  }

  .webinar-payment__secure {
    display: flex;
    margin-top: 27px;
    gap: 8px;
    align-items: center;
    color: rgba(255, 255, 255, 0.36);
    font-size: 10px;
    letter-spacing: 0.12em;
  }

  .webinar-payment__secure svg {
    width: 14px;
    height: 14px;
  }

  .webinar-payment__registration-warning {
    margin: 18px 0 0;
    padding: 12px 14px;
    border: 1px solid rgba(212, 181, 104, 0.2);
    border-radius: 9px;
    color: rgba(255, 255, 255, 0.63);
    background: rgba(212, 181, 104, 0.055);
    font-size: 10px;
    line-height: 1.55;
  }

  .webinar-payment__registration-warning a {
    color: #dfc376;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .webinar-payment__sidebar {
    min-width: 0;
    opacity: 0;
    transform: translateX(22px);
    animation: webinarPaymentEnterRight 760ms cubic-bezier(0.16, 1, 0.3, 1) 220ms both;
  }

  .webinar-payment-summary {
    padding: 24px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 20px;
    background:
      radial-gradient(circle at 100% 0%, rgba(212, 181, 104, 0.055), transparent 34%),
      linear-gradient(145deg, rgba(12, 12, 12, 0.99), rgba(5, 5, 5, 0.99));
    box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.52),
      inset 0 1px 0 rgba(255, 255, 255, 0.018);
  }

  .webinar-payment-summary__visual {
    position: relative;
    overflow: hidden;
    border-radius: 11px;
  }

  .webinar-payment-summary__visual::after {
    position: absolute;
    inset: 0;
    content: "";
    background: linear-gradient(180deg, transparent 54%, rgba(0, 0, 0, 0.46));
    pointer-events: none;
  }

  .webinar-payment-summary__image {
    display: block;
    width: 100%;
    aspect-ratio: 1.72;
    object-fit: cover;
    transition: transform 500ms ease;
  }

  .webinar-payment-summary:hover .webinar-payment-summary__image {
    transform: scale(1.025);
  }

  .webinar-payment-summary__badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    z-index: 1;
    display: inline-flex;
    min-height: 21px;
    padding: 4px 9px;
    align-items: center;
    border-radius: 999px;
    color: #2c210f;
    background: #d4b568;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .webinar-payment-summary__title {
    margin: 17px 0 0;
    color: rgba(255, 255, 255, 0.82);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.45;
  }

  .webinar-payment-summary__schedule {
    display: flex;
    margin-top: 12px;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
    color: rgba(255, 255, 255, 0.51);
    font-size: 11px;
  }

  .webinar-payment-summary__schedule span {
    display: inline-flex;
    gap: 5px;
    align-items: center;
  }

  .webinar-payment-summary__schedule svg {
    width: 12px;
    height: 12px;
  }

  .webinar-payment-summary__divider {
    height: 1px;
    margin: 19px 0;
    border: 0;
    background: rgba(255, 255, 255, 0.08);
  }

  .webinar-payment-summary__rows {
    display: grid;
    gap: 12px;
  }

  .webinar-payment-summary__row {
    display: flex;
    gap: 18px;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.57);
    font-size: 12px;
  }

  .webinar-payment-summary__row strong {
    color: rgba(255, 255, 255, 0.78);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .webinar-payment-summary__row.is-discount strong {
    color: #d4b568;
  }

  .webinar-payment-summary__total-label {
    display: block;
    color: rgba(255, 255, 255, 0.72);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .webinar-payment-summary__total {
    margin: 8px 0 0;
    color: #f0ebe4;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 25px;
    font-weight: 600;
  }

  .webinar-payment-summary__submit {
    display: inline-flex;
    width: 100%;
    min-height: 47px;
    margin-top: 18px;
    padding: 12px 18px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(236, 205, 132, 0.62);
    border-radius: 7px;
    color: #2e210e;
    background: linear-gradient(100deg, #cda95f 0%, #ddbd73 54%, #caa75e 100%);
    box-shadow: 0 14px 32px rgba(201, 165, 79, 0.14);
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      filter 180ms ease;
  }

  .webinar-payment-summary__submit:hover,
  .webinar-payment-summary__submit:focus-visible {
    outline: none;
    filter: brightness(1.06);
    box-shadow: 0 18px 40px rgba(214, 180, 103, 0.25);
    transform: translateY(-2px);
  }

  .webinar-payment-summary__submit svg {
    width: 15px;
    height: 15px;
  }

  .webinar-payment-summary__submit:disabled {
    cursor: not-allowed;
    opacity: 0.52;
    transform: none;
  }

  .webinar-payment-summary__spinner {
    animation: webinarPaymentSpin 760ms linear infinite;
  }

  .webinar-payment-summary__policy {
    margin: 13px auto 0;
    color: rgba(255, 255, 255, 0.32);
    font-size: 9.5px;
    line-height: 1.6;
    text-align: center;
  }

  .webinar-payment-summary__policy a {
    color: rgba(255, 255, 255, 0.48);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .webinar-payment-summary__notice {
    display: flex;
    margin: 14px 0 0;
    padding: 11px 12px;
    gap: 9px;
    align-items: flex-start;
    border: 1px solid rgba(122, 194, 143, 0.2);
    border-radius: 8px;
    color: rgba(224, 244, 229, 0.9);
    background: rgba(79, 142, 96, 0.09);
    font-size: 9px;
    line-height: 1.5;
    animation: webinarPaymentNotice 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-payment-summary__notice svg {
    width: 14px;
    height: 14px;
    margin-top: 1px;
    flex: 0 0 14px;
    color: #8ac59a;
  }

  .webinar-payment-help {
    display: flex;
    margin-top: 17px;
    padding: 15px 17px;
    gap: 12px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    background: linear-gradient(145deg, rgba(13, 13, 13, 0.98), rgba(7, 7, 7, 0.98));
  }

  .webinar-payment-help__icon {
    display: inline-flex;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #d4b568;
    background: rgba(212, 181, 104, 0.08);
  }

  .webinar-payment-help__icon svg {
    width: 16px;
    height: 16px;
  }

  .webinar-payment-help__copy {
    min-width: 0;
    flex: 1;
  }

  .webinar-payment-help__copy strong,
  .webinar-payment-help__copy span {
    display: block;
  }

  .webinar-payment-help__copy strong {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 600;
  }

  .webinar-payment-help__copy span {
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 10px;
  }

  .webinar-payment-help__link {
    color: #d4b568;
    font-size: 10px;
    white-space: nowrap;
  }

  .webinar-payment-bank-selector {
    margin-top: 16px;
    padding: 18px;
    border: 1px solid rgba(212, 181, 104, 0.22);
    border-radius: 12px;
    background: rgba(212, 181, 104, 0.045);
    animation: webinarPaymentNotice 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-payment-bank-selector__label {
    display: block;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .webinar-payment-bank-selector__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .webinar-payment-bank-option {
    display: flex;
    min-height: 72px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.025);
    cursor: pointer;
    transition:
      border-color 180ms ease,
      background 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .webinar-payment-bank-option:hover,
  .webinar-payment-bank-option:focus-visible,
  .webinar-payment-bank-option.is-selected {
    outline: none;
    border-color: #d4b568;
    background: rgba(212, 181, 104, 0.09);
    box-shadow: 0 0 22px rgba(212, 181, 104, 0.12);
    transform: translateY(-2px);
  }

  .webinar-payment-bank-option__logo {
    display: block;
    width: 100%;
    max-width: 118px;
    height: 42px;
    object-fit: contain;
    border-radius: 8px;
  }

  @keyframes webinarPaymentEnter {
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarPaymentEnterLeft {
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarPaymentEnterRight {
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarPaymentMethodEnter {
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarPaymentSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes webinarPaymentNotice {
    from { opacity: 0; transform: translateY(7px); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 900px) {
    .webinar-payment__layout {
      grid-template-columns: 1fr;
    }

    .webinar-payment__sidebar {
      width: min(100%, 480px);
      margin-inline: auto;
    }
  }

  @media (max-width: 560px) {
    .webinar-payment__header {
      padding-inline: 4px;
    }

    .webinar-payment__layout {
      gap: 34px;
    }

    .webinar-payment-method {
      min-height: 70px;
      padding: 13px;
      grid-template-columns: 39px minmax(0, 1fr) 19px;
      gap: 11px;
    }

    .webinar-payment-method__icon {
      width: 39px;
      height: 39px;
    }

    .webinar-payment-summary {
      padding: 15px;
      border-radius: 16px;
    }

    .webinar-payment-bank-selector__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .webinar-payment__header,
    .webinar-payment__content,
    .webinar-payment__sidebar,
    .webinar-payment-method,
    .webinar-payment-summary__notice {
      opacity: 1;
      animation: none !important;
      transform: none;
    }
  }
`;

type PaymentFormProps = {
  webinar: WebinarData;
};

const PaymentForm = ({ webinar }: PaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<WebinarPaymentMethod>(() =>
    readWebinarPaymentMethod(webinar.slug),
  );
  const [selectedBank, setSelectedBank] = useState<WebinarBank>(() =>
    readWebinarBank(webinar.slug),
  );
  const [registration] = useState<StoredWebinarRegistration | null>(() =>
    readWebinarRegistration(webinar.slug),
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const redirectTimerRef = useRef<number | null>(null);
  const breakdown = useMemo(() => calculateWebinarPayment(webinar), [webinar]);
  const registrationPath = getWebinarRegistrationPath(webinar.slug);

  useEffect(() => {
    saveWebinarPaymentMethod(webinar.slug, selectedMethod);
  }, [selectedMethod, webinar.slug]);

  useEffect(() => {
    saveWebinarBank(webinar.slug, selectedBank);
  }, [selectedBank, webinar.slug]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleMethodSelect = (method: WebinarPaymentMethod) => {
    if (isCompleting) return;
    setSelectedMethod(method);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!registration || isCompleting) return;

    setIsCompleting(true);
    await saveWebinarPayment(
      webinar,
      selectedMethod,
      registration,
      selectedMethod === "bank-transfer" ? selectedBank : null,
    );

    const paidMethod =
      selectedMethod === "free-registration" ? "qris" : selectedMethod;
    const instructionPath = getWebinarPaymentInstructionPath(
      webinar.slug,
      paidMethod,
    );

    redirectTimerRef.current = window.setTimeout(() => {
      navigateToHashRoute(instructionPath);
    }, 420);
  };

  return (
    <>
      <style>{styles}</style>

      <section className="webinar-payment" aria-labelledby="webinar-payment-title">
        <header className="webinar-payment__header">
          <span className="webinar-payment__step">Step 2 of 3</span>
          <h1 className="webinar-payment__title" id="webinar-payment-title">
            Secure Your Spot
          </h1>
          <p className="webinar-payment__subtitle">
            Complete your registration for the &quot;{webinar.title}&quot; webinar.
          </p>
        </header>

        <form className="webinar-payment__layout" onSubmit={handleSubmit}>
          <div className="webinar-payment__content">
            <p className="webinar-payment__lead">Secure Your Spot</p>
            <p className="webinar-payment__copy">
              You are moments away from unlocking premium access to the {webinar.title}.
              Complete your secure payment to finalize registration.
            </p>

            <span className="webinar-payment__eyebrow">Select Payment Method</span>

            <div className="webinar-payment__methods" role="radiogroup" aria-label="Payment method">
              {paymentMethods.map(({ id, title, description, icon: Icon }) => {
                const isSelected = selectedMethod === id;

                return (
                  <button
                    className={`webinar-payment-method${isSelected ? " is-selected" : ""}`}
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleMethodSelect(id)}
                  >
                    <span className="webinar-payment-method__icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span>
                      <span className="webinar-payment-method__title">{title}</span>
                      <span className="webinar-payment-method__description">
                        {description}
                      </span>
                    </span>
                    <span className="webinar-payment-method__radio" aria-hidden="true">
                      {isSelected ? <Circle /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedMethod === "bank-transfer" && (
              <section
                className="webinar-payment-bank-selector"
                aria-label="Pilih bank tujuan"
              >
                <span className="webinar-payment-bank-selector__label">
                  Pilih Bank Tujuan
                </span>
                <div className="webinar-payment-bank-selector__grid">
                  {bankOptions.map((bank) => {
                    const isSelected = selectedBank === bank.id;

                    return (
                      <button
                        className={`webinar-payment-bank-option${
                          isSelected ? " is-selected" : ""
                        }`}
                        key={bank.id}
                        type="button"
                        aria-pressed={isSelected}
                        title={bank.label}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <img decoding="async" loading="lazy"
                          className="webinar-payment-bank-option__logo"
                          src={bank.logo}
                          alt={bank.label}
                        />
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <p className="webinar-payment__secure">
              <LockKeyhole aria-hidden="true" />
              <span>SSL Encrypted Secure Transaction</span>
            </p>

            {!registration && (
              <p className="webinar-payment__registration-warning">
                Participant data has not been found in localStorage. Complete{" "}
                <a
                  href={getHashHref(registrationPath)}
                  onClick={(event) => handleHashRouteClick(event, registrationPath)}
                >
                  Step 1 registration
                </a>{" "}
                first to connect the payment simulation with participant data.
              </p>
            )}
          </div>

          <aside className="webinar-payment__sidebar" aria-label="Payment summary">
            <section className="webinar-payment-summary">
              <div className="webinar-payment-summary__visual">
                <img decoding="async" loading="lazy"
                  className="webinar-payment-summary__image"
                  src={webinar.heroImage}
                  alt={webinar.heroImageAlt}
                />
                <span className="webinar-payment-summary__badge">{webinar.category}</span>
              </div>

              <h2 className="webinar-payment-summary__title">{webinar.title}</h2>

              <div className="webinar-payment-summary__schedule">
                <span>
                  <CalendarDays aria-hidden="true" />
                  {webinar.scheduleDate}
                </span>
                <span>
                  <Clock3 aria-hidden="true" />
                  {webinar.scheduleTime}
                </span>
              </div>

              <hr className="webinar-payment-summary__divider" />

              <div className="webinar-payment-summary__rows">
                <div className="webinar-payment-summary__row">
                  <span>Harga Webinar</span>
                  <strong>{formatRupiah(breakdown.registrationFee)}</strong>
                </div>

                {breakdown.platformFee > 0 && (
                  <div className="webinar-payment-summary__row">
                    <span>Platform Fee</span>
                    <strong>{formatRupiah(breakdown.platformFee)}</strong>
                  </div>
                )}

                {breakdown.discount > 0 && (
                  <div className="webinar-payment-summary__row is-discount">
                    <span>Discount</span>
                    <strong>- {formatRupiah(breakdown.discount)}</strong>
                  </div>
                )}
              </div>

              <hr className="webinar-payment-summary__divider" />

              <span className="webinar-payment-summary__total-label">Total Amount</span>
              <p className="webinar-payment-summary__total">
                {formatRupiah(breakdown.total)}
              </p>

              <button
                className="webinar-payment-summary__submit"
                type="submit"
                disabled={!registration || isCompleting}
                aria-disabled={!registration || isCompleting}
              >
                {isCompleting ? (
                  <>
                    <LoaderCircle className="webinar-payment-summary__spinner" aria-hidden="true" />
                    Preparing Payment
                  </>
                ) : (
                  <>
                    Continue Payment
                    <Check aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="webinar-payment-summary__policy">
                By clicking &quot;Continue Payment&quot; you agree to Mahreen Learning&apos;s{" "}
                <a href="/syarat-ketentuan">Terms of Service</a> and Refund Policy.
              </p>


            </section>

            <section className="webinar-payment-help">
              <span className="webinar-payment-help__icon">
                <HelpCircle aria-hidden="true" />
              </span>
              <span className="webinar-payment-help__copy">
                <strong>Need assistance?</strong>
                <span>Our support team is online.</span>
              </span>
              <a className="webinar-payment-help__link" href="https://wa.me/6289652647385?text=Halo%20Mahreen%2C%20saya%20membutuhkan%20bantuan%20pembayaran%20webinar." target="_blank" rel="noreferrer">
                Chat Now
              </a>
            </section>
          </aside>
        </form>
      </section>
    </>
  );
};

export default PaymentForm;
