import type { ChangeEvent } from "react";
import InternationalPhoneInput from "../../../../components/Form/InternationalPhoneInput";
import type { StudioShippingDetails } from "../types";

type CheckoutDetailsFieldsProps = {
  value: StudioShippingDetails;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPhoneChange: (value: string) => void;
};

const CheckoutDetailsFields = ({ value, onChange, onPhoneChange }: CheckoutDetailsFieldsProps) => (
  <div className="checkout-forms__fields">
    <section className="form-section">
      <h2 className="form-section__title">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2.5 14a5.5 5.5 0 0111 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Informasi Pribadi
      </h2>
      <div className="card">
        <div className="field-row">
          <div className="field">
            <label htmlFor="fullName">Nama Lengkap</label>
            <input type="text" id="fullName" placeholder="Masukkan nama lengkap" value={value.fullName} onChange={onChange} autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">Nomor WhatsApp</label>
            <InternationalPhoneInput
              className="studio-checkout-phone"
              id="whatsapp"
              value={value.whatsapp}
              onChange={onPhoneChange}
              placeholder="812 3456 7890"
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="email">Alamat Email</label>
          <input type="email" id="email" placeholder="nama@contoh.com" value={value.email} onChange={onChange} autoComplete="email" required />
        </div>
      </div>
    </section>

    <section className="form-section">
      <h2 className="form-section__title">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
          <path d="M1 4l10-3 10 3v8l-10 3-10-3V4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M11 1v14" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        Tujuan Pengiriman
      </h2>
      <div className="card">
        <div className="field">
          <label htmlFor="street">Alamat Jalan</label>
          <textarea id="street" rows={3} placeholder="Nama jalan, nomor rumah, gedung, lantai, atau unit" value={value.street} onChange={onChange} autoComplete="street-address" required />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="province">Provinsi</label>
            <input
              type="text"
              id="province"
              placeholder="Nama provinsi"
              value={value.province}
              onChange={onChange}
              autoComplete="address-level1"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="city">Kota / Kabupaten</label>
            <input
              type="text"
              id="city"
              placeholder="Nama kota atau kabupaten"
              value={value.city}
              onChange={onChange}
              autoComplete="address-level2"
              required
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="subdistrict">Kecamatan</label>
            <input type="text" id="subdistrict" placeholder="Nama kecamatan" value={value.subdistrict} onChange={onChange} autoComplete="address-level3" required />
          </div>
          <div className="field">
            <label htmlFor="postal">Kode Pos</label>
            <input type="text" id="postal" inputMode="numeric" placeholder="12345" value={value.postal} onChange={onChange} autoComplete="postal-code" pattern="[0-9]{5}" required />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default CheckoutDetailsFields;
