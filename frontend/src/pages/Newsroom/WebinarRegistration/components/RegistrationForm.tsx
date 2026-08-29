import { ArrowRight, ChevronDown, CircleAlert } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  getWebinarPaymentPath,
  getWebinarSuccessPath,
  type WebinarData,
} from "../../../../data/webinars";
import InternationalPhoneInput from "../../../../components/Form/InternationalPhoneInput";
import {
  readWebinarRegistrationDraft,
  saveWebinarRegistrationDraft,
  type WebinarRegistrationFormData,
} from "../../../../services/webinarRegistrationStorage";
import { saveWebinarPayment } from "../../../../services/webinarPaymentStorage";
import { saveWebinarSuccess } from "../../../../services/webinarSuccessStorage";
import { navigateToHashRoute } from "../../../../utils/hashNavigation";
import { webinarService } from "../../../../services/webinar/webinarService";

type FieldErrors = Partial<Record<keyof WebinarRegistrationFormData, string>>;

const professionOptions = [
  "Student",
  "UI/UX Designer",
  "Graphic Designer",
  "Product Designer",
  "Frontend Developer",
  "Digital Marketer",
  "Entrepreneur",
  "Other",
] as const;

const fieldLabels: Record<keyof WebinarRegistrationFormData, string> = {
  fullName: "Full Name",
  email: "Email Address",
  whatsapp: "WhatsApp Number",
  institution: "Institution",
  profession: "Profession",
  city: "Domicile (City)",
};

const validateForm = (data: WebinarRegistrationFormData): FieldErrors => {
  const errors: FieldErrors = {};

  (Object.keys(fieldLabels) as Array<keyof WebinarRegistrationFormData>).forEach(
    (key) => {
      if (!data[key].trim()) {
        errors[key] = `${fieldLabels[key]} is required.`;
      }
    },
  );

  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.whatsapp && !/^[+\d][\d\s()-]{8,}$/.test(data.whatsapp)) {
    errors.whatsapp = "Enter a valid WhatsApp number.";
  }

  return errors;
};

const styles = `
  .webinar-registration-card {
    position: relative;
    isolation: isolate;
    width: min(100%, 650px);
    padding: clamp(36px, 4vw, 42px) clamp(24px, 4vw, 40px) clamp(34px, 4vw, 38px);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 22px;
    background:
      radial-gradient(circle at 95% 4%, rgba(213, 180, 104, 0.055), transparent 33%),
      linear-gradient(145deg, rgba(12, 12, 12, 0.98), rgba(5, 5, 5, 0.99));
    box-shadow:
      0 34px 90px rgba(0, 0, 0, 0.56),
      inset 0 1px 0 rgba(255, 255, 255, 0.018);
    animation: webinarRegistrationCardEnter 760ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
  }

  .webinar-registration-card::before {
    position: absolute;
    top: -38%;
    left: 50%;
    z-index: -1;
    width: 72%;
    aspect-ratio: 1;
    content: "";
    border-radius: 50%;
    background: rgba(210, 176, 96, 0.035);
    filter: blur(52px);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .webinar-registration-card__header {
    text-align: center;
  }

  .webinar-registration-card__step {
    display: inline-flex;
    min-height: 25px;
    padding: 5px 15px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(214, 180, 103, 0.06);
    border-radius: 999px;
    color: #d4b568;
    background: rgba(201, 165, 78, 0.08);
    box-shadow: 0 0 22px rgba(205, 168, 80, 0.04);
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.08em;
  }

  .webinar-registration-card__title {
    margin: 17px 0 0;
    color: #f2ede7;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(29px, 4vw, 36px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .webinar-registration-card__description {
    margin: 13px auto 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 13px;
    font-weight: 400;
    line-height: 1.65;
    text-wrap: balance;
  }

  .webinar-registration-form {
    margin-top: clamp(30px, 4vw, 36px);
  }

  .webinar-registration-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 20px;
  }

  .webinar-registration-field {
    min-width: 0;
    opacity: 0;
    transform: translateY(14px);
    animation: webinarRegistrationFieldEnter 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-registration-field:nth-child(1) { animation-delay: 270ms; }
  .webinar-registration-field:nth-child(2) { animation-delay: 320ms; }
  .webinar-registration-field:nth-child(3) { animation-delay: 370ms; }
  .webinar-registration-field:nth-child(4) { animation-delay: 420ms; }
  .webinar-registration-field:nth-child(5) { animation-delay: 470ms; }
  .webinar-registration-field:nth-child(6) { animation-delay: 520ms; }

  .webinar-registration-field__label {
    display: block;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.14em;
  }

  .webinar-registration-field__control-wrap {
    position: relative;
  }

  .webinar-registration-field__control {
    width: 100%;
    height: 44px;
    padding: 0 17px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 9px;
    outline: 0;
    color: #f3eee7;
    background: rgba(10, 10, 10, 0.88);
    font-size: 13px;
    line-height: 1;
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .webinar-registration-field__control::placeholder {
    color: #6c6f78;
    opacity: 1;
  }

  .webinar-registration-field__control:hover {
    border-color: rgba(214, 180, 103, 0.32);
  }

  .webinar-registration-field__control:focus {
    border-color: rgba(214, 180, 103, 0.72);
    background: rgba(13, 13, 13, 0.98);
    box-shadow:
      0 0 0 3px rgba(214, 180, 103, 0.08),
      0 9px 26px rgba(0, 0, 0, 0.22);
    transform: translateY(-1px);
  }

  .webinar-registration-field__control[aria-invalid="true"] {
    border-color: rgba(235, 117, 104, 0.78);
    box-shadow: 0 0 0 3px rgba(235, 117, 104, 0.07);
  }

  .webinar-registration-field__select {
    padding-right: 44px;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }

  .webinar-registration-field__select.is-placeholder {
    color: #aaa6a0;
  }

  .webinar-registration-field__select option {
    color: #f3eee7;
    background: #111111;
  }

  .webinar-registration-field__chevron {
    position: absolute;
    top: 50%;
    right: 15px;
    width: 16px;
    height: 16px;
    color: #777c86;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .webinar-registration-field__error {
    display: flex;
    margin-top: 7px;
    align-items: center;
    gap: 6px;
    color: #df857b;
    font-size: 10px;
    line-height: 1.35;
  }

  .webinar-registration-field__error svg {
    width: 12px;
    height: 12px;
    flex: 0 0 12px;
  }

  .webinar-registration-form__submit {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    width: 100%;
    min-height: 48px;
    margin-top: 23px;
    padding: 13px 24px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid rgba(236, 205, 132, 0.65);
    border-radius: 999px;
    color: #39280e;
    background: linear-gradient(100deg, #cda95f 0%, #ddbd73 54%, #caa75e 100%);
    box-shadow:
      0 15px 34px rgba(201, 165, 79, 0.19),
      inset 0 1px 0 rgba(255, 255, 255, 0.38);
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.07em;
    cursor: pointer;
    opacity: 0;
    transform: translateY(14px);
    animation: webinarRegistrationFieldEnter 560ms cubic-bezier(0.16, 1, 0.3, 1) 590ms both;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      filter 180ms ease;
  }

  .webinar-registration-form__submit::before {
    position: absolute;
    top: -40%;
    bottom: -40%;
    left: -32%;
    z-index: -1;
    width: 24%;
    content: "";
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
    filter: blur(2px);
    transform: skewX(-18deg);
    animation: webinarRegistrationShimmer 4.8s ease-in-out 1.5s infinite;
  }

  .webinar-registration-form__submit:hover:not(:disabled),
  .webinar-registration-form__submit:focus-visible:not(:disabled) {
    filter: brightness(1.06);
    box-shadow:
      0 18px 44px rgba(214, 180, 103, 0.28),
      0 0 0 4px rgba(214, 180, 103, 0.08);
    transform: translateY(-2px);
  }

  .webinar-registration-form__submit:disabled {
    cursor: wait;
    opacity: 0.66;
  }

  .webinar-registration-form__submit:active {
    transform: translateY(0);
  }

  .webinar-registration-form__submit svg {
    width: 16px;
    height: 16px;
    transition: transform 180ms ease;
  }

  .webinar-registration-form__submit:hover svg {
    transform: translateX(3px);
  }

  .webinar-registration-form__notice {
    display: flex;
    margin: 18px 0 0;
    padding: 13px 15px;
    align-items: flex-start;
    gap: 10px;
    border: 1px solid rgba(122, 194, 143, 0.2);
    border-radius: 10px;
    color: rgba(224, 244, 229, 0.9);
    background: rgba(79, 142, 96, 0.09);
    font-size: 11px;
    line-height: 1.55;
    animation: webinarRegistrationNoticeEnter 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-registration-form__notice svg {
    width: 17px;
    height: 17px;
    margin-top: 1px;
    flex: 0 0 17px;
    color: #8ac59a;
  }

  @keyframes webinarRegistrationCardEnter {
    from {
      opacity: 0;
      transform: translateY(34px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes webinarRegistrationFieldEnter {
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes webinarRegistrationNoticeEnter {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes webinarRegistrationShimmer {
    0%, 56% {
      left: -32%;
      opacity: 0;
    }
    62% {
      opacity: 0.8;
    }
    78% {
      left: 112%;
      opacity: 0;
    }
    100% {
      left: 112%;
      opacity: 0;
    }
  }

  @media (max-width: 680px) {
    .webinar-registration-card {
      padding: 31px 20px 28px;
      border-radius: 18px;
    }

    .webinar-registration-form {
      margin-top: 32px;
    }

    .webinar-registration-form__grid {
      grid-template-columns: 1fr;
      gap: 19px;
    }

    .webinar-registration-card__description {
      font-size: 12px;
    }

    .webinar-registration-form__submit {
      margin-top: 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .webinar-registration-card,
    .webinar-registration-field,
    .webinar-registration-form__submit,
    .webinar-registration-form__notice,
    .webinar-registration-form__submit::before {
      opacity: 1;
      animation: none !important;
      transform: none;
    }
  }
`;

type RegistrationFormProps = {
  webinar: WebinarData;
};

const RegistrationForm = ({ webinar }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<WebinarRegistrationFormData>(() =>
    readWebinarRegistrationDraft(webinar.slug),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const hasDraft = useMemo(
    () => Object.values(formData).some((value) => value.trim().length > 0),
    [formData],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveWebinarRegistrationDraft(webinar.slug, formData);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [formData, webinar.slug]);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof WebinarRegistrationFormData;

    setFormData((current) => ({ ...current, [fieldName]: value }));

    if (errors[fieldName]) {
      setErrors((current) => ({ ...current, [fieldName]: undefined }));
    }
  };

  const updateWhatsapp = (value: string) => {
    setFormData((current) => ({ ...current, whatsapp: value }));
    if (errors.whatsapp) {
      setErrors((current) => ({ ...current, whatsapp: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0] as
      | keyof WebinarRegistrationFormData
      | undefined;

    if (firstError) {
      document.getElementById(`webinar-registration-${firstError}`)?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const registration = await webinarService.register(webinar, formData);

      if (webinar.isFree) {
        const confirmation = await saveWebinarPayment(
          webinar,
          "free-registration",
          registration,
        );

        saveWebinarSuccess(webinar, registration, confirmation);
        navigateToHashRoute(getWebinarSuccessPath(webinar.slug));
        return;
      }

      navigateToHashRoute(getWebinarPaymentPath(webinar.slug));
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Registration could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className="webinar-registration-card"
        aria-labelledby="webinar-registration-title"
      >
        <header className="webinar-registration-card__header">
          <span className="webinar-registration-card__step">
            {webinar.isFree ? "Free Registration" : "Step 1 of 3"}
          </span>
          <h1
            className="webinar-registration-card__title"
            id="webinar-registration-title"
          >
            Secure Your Spot
          </h1>
          <p className="webinar-registration-card__description">
            Complete your registration for the &quot;{webinar.title}&quot; webinar.
          </p>
        </header>

        <form
          className="webinar-registration-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="webinar-registration-form__grid">
            <div className="webinar-registration-field">
              <label
                className="webinar-registration-field__label"
                htmlFor="webinar-registration-fullName"
              >
                Full Name
              </label>
              <input
                className="webinar-registration-field__control"
                id="webinar-registration-fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Mahreen Anis"
                value={formData.fullName}
                onChange={updateField}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName
                    ? "webinar-registration-fullName-error"
                    : undefined
                }
              />
              {errors.fullName && (
                <div
                  className="webinar-registration-field__error"
                  id="webinar-registration-fullName-error"
                >
                  <CircleAlert aria-hidden="true" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            <div className="webinar-registration-field">
              <label
                className="webinar-registration-field__label"
                htmlFor="webinar-registration-email"
              >
                Email Address
              </label>
              <input
                className="webinar-registration-field__control"
                id="webinar-registration-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="mahreen@example.com"
                value={formData.email}
                onChange={updateField}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "webinar-registration-email-error" : undefined
                }
              />
              {errors.email && (
                <div
                  className="webinar-registration-field__error"
                  id="webinar-registration-email-error"
                >
                  <CircleAlert aria-hidden="true" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="webinar-registration-field">
              <label
                className="webinar-registration-field__label"
                htmlFor="webinar-registration-whatsapp"
              >
                WhatsApp Number
              </label>
              <InternationalPhoneInput
                className="webinar-registration-field__control"
                id="webinar-registration-whatsapp"
                name="whatsapp"
                placeholder="812 3456 7890"
                value={formData.whatsapp}
                onChange={updateWhatsapp}
                invalid={Boolean(errors.whatsapp)}
                describedBy={
                  errors.whatsapp
                    ? "webinar-registration-whatsapp-error"
                    : undefined
                }
              />
              {errors.whatsapp && (
                <div
                  className="webinar-registration-field__error"
                  id="webinar-registration-whatsapp-error"
                >
                  <CircleAlert aria-hidden="true" />
                  <span>{errors.whatsapp}</span>
                </div>
              )}
            </div>

            <div className="webinar-registration-field">
              <label
                className="webinar-registration-field__label"
                htmlFor="webinar-registration-institution"
              >
                Institution
              </label>
              <input
                className="webinar-registration-field__control"
                id="webinar-registration-institution"
                name="institution"
                type="text"
                autoComplete="organization"
                placeholder="University or Company"
                value={formData.institution}
                onChange={updateField}
                aria-invalid={Boolean(errors.institution)}
                aria-describedby={
                  errors.institution
                    ? "webinar-registration-institution-error"
                    : undefined
                }
              />
              {errors.institution && (
                <div
                  className="webinar-registration-field__error"
                  id="webinar-registration-institution-error"
                >
                  <CircleAlert aria-hidden="true" />
                  <span>{errors.institution}</span>
                </div>
              )}
            </div>

            <div className="webinar-registration-field">
              <label
                className="webinar-registration-field__label"
                htmlFor="webinar-registration-profession"
              >
                Profession
              </label>
              <div className="webinar-registration-field__control-wrap">
                <select
                  className={`webinar-registration-field__control webinar-registration-field__select${
                    formData.profession ? "" : " is-placeholder"
                  }`}
                  id="webinar-registration-profession"
                  name="profession"
                  value={formData.profession}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.profession)}
                  aria-describedby={
                    errors.profession
                      ? "webinar-registration-profession-error"
                      : undefined
                  }
                >
                  <option value="" disabled>
                    Select Profession
                  </option>
                  {professionOptions.map((profession) => (
                    <option value={profession} key={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="webinar-registration-field__chevron"
                  aria-hidden="true"
                />
              </div>
              {errors.profession && (
                <div
                  className="webinar-registration-field__error"
                  id="webinar-registration-profession-error"
                >
                  <CircleAlert aria-hidden="true" />
                  <span>{errors.profession}</span>
                </div>
              )}
            </div>

            <div className="webinar-registration-field">
              <label
                className="webinar-registration-field__label"
                htmlFor="webinar-registration-city"
              >
                Domicile (City)
              </label>
              <input
                className="webinar-registration-field__control"
                id="webinar-registration-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="Jakarta"
                value={formData.city}
                onChange={updateField}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={
                  errors.city ? "webinar-registration-city-error" : undefined
                }
              />
              {errors.city && (
                <div
                  className="webinar-registration-field__error"
                  id="webinar-registration-city-error"
                >
                  <CircleAlert aria-hidden="true" />
                  <span>{errors.city}</span>
                </div>
              )}
            </div>
          </div>

          {submitError && (
            <div className="webinar-registration-form__notice" role="alert">
              <CircleAlert aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}

          <button className="webinar-registration-form__submit" type="submit" disabled={submitting}>
            <span>
              {submitting
                ? "Processing..."
                : webinar.isFree
                  ? "Daftar Gratis"
                  : "Proceed to Payment"}
            </span>
            {!submitting && <ArrowRight aria-hidden="true" />}
          </button>

          {hasDraft && (
            <span className="sr-only" aria-live="polite">
              Your draft is saved automatically in this browser.
            </span>
          )}
        </form>
      </section>
    </>
  );
};

export default RegistrationForm;
