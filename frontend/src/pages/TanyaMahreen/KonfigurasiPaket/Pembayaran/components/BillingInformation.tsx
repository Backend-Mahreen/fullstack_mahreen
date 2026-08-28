import type { ChangeEvent } from "react";
import type { BillingInformationValue } from "../paymentTypes";

type BillingInformationProps = {
  value: BillingInformationValue;
  errors: Partial<Record<keyof BillingInformationValue, string>>;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const BillingInformation = ({
  value,
  errors,
  onChange,
}: BillingInformationProps) => (
  <section className="tp-section" aria-labelledby="billing-information-title">
    <div className="tp-section__heading">
      <span className="tp-section__number">01</span>
      <h2 id="billing-information-title">Informasi Penagihan</h2>
    </div>

    <div className="tp-billing-grid">
      <label className="tp-field" htmlFor="billing-full-name">
        <span className="tp-field__label">Nama Lengkap</span>
        <input
          id="billing-full-name"
          name="fullName"
          type="text"
          value={value.fullName}
          onChange={onChange}
          placeholder="Masukkan nama sesuai identitas"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "billing-full-name-error" : undefined}
        />
        {errors.fullName && (
          <span id="billing-full-name-error" className="tp-field__error">
            {errors.fullName}
          </span>
        )}
      </label>

      <label className="tp-field" htmlFor="billing-company-name">
        <span className="tp-field__label">Nama Perusahaan (Opsional)</span>
        <input
          id="billing-company-name"
          name="companyName"
          type="text"
          value={value.companyName}
          onChange={onChange}
          placeholder="Contoh: Luxury Group Ltd."
          autoComplete="organization"
        />
      </label>

      <label
        className="tp-field tp-field--full"
        htmlFor="billing-invoice-address"
      >
        <span className="tp-field__label">Alamat Penerimaan Invoice</span>
        <textarea
          id="billing-invoice-address"
          name="invoiceAddress"
          value={value.invoiceAddress}
          onChange={onChange}
          placeholder="Alamat lengkap kantor atau rumah"
          rows={2}
          autoComplete="street-address"
          aria-invalid={Boolean(errors.invoiceAddress)}
          aria-describedby={
            errors.invoiceAddress ? "billing-invoice-address-error" : undefined
          }
        />
        {errors.invoiceAddress && (
          <span id="billing-invoice-address-error" className="tp-field__error">
            {errors.invoiceAddress}
          </span>
        )}
      </label>
    </div>
  </section>
);

export default BillingInformation;
