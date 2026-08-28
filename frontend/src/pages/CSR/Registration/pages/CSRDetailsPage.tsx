import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Lightbulb, Network, ShieldCheck } from "lucide-react";

import registrationImage from "../../../../assets/CSR/background-daftar-sekarang.webp";
import InternationalPhoneInput from "../../../../components/Form/InternationalPhoneInput";
import CSRRegistrationLayout from "../components/CSRRegistrationLayout";
import PageHeading from "../components/PageHeading";
import useCSRRegistration from "../../../../hooks/useCSRRegistration";
import type { CSRRegistrationData, FieldErrors } from "../../../../types/csrRegistration";
import { isEmailValid, navigateToStep } from "../../../../utils/csrRegistration";

const DetailsStep = ({
  data,
  onChange,
}: Readonly<{
  data: CSRRegistrationData;
  onChange: (updates: Partial<CSRRegistrationData>) => void;
}>) => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const isCommunityPartner = data.role === "community-partner";

  const updateField = (field: keyof CSRRegistrationData, value: string) => {
    onChange({ [field]: value });
    if (errors[field]) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateDetails = () => {
    const nextErrors: FieldErrors = {};

    if (!data.fullName.trim()) {
      nextErrors.fullName = isCommunityPartner
        ? "Nama organisasi wajib diisi."
        : "Nama lengkap wajib diisi.";
    }
    if (!data.focusArea) nextErrors.focusArea = "Pilih area fokus utama.";
    if (!isEmailValid(data.email.trim())) nextErrors.email = "Masukkan alamat email yang valid.";
    if (data.whatsapp.replace(/\D/g, "").length < 9) {
      nextErrors.whatsapp = "Masukkan nomor WhatsApp yang aktif.";
    }
    if (!data.province.trim()) nextErrors.province = "Provinsi wajib diisi.";
    if (!data.city.trim()) nextErrors.city = "Kota atau kabupaten wajib diisi.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateDetails()) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[data-error="true"]')?.focus();
      });
      return;
    }
    navigateToStep(3);
  };

  return (
    <div className="csr-registration-stage" key="details-step">
      <PageHeading />

      <div className="csr-registration-form-intro">
        <p className="csr-registration-form-intro__title">Registrasi Relawan &amp; Mitra</p>
        <p className="csr-registration-form-intro__text">
          Lengkapi detail Anda untuk memulai perjalanan bermakna bersama kami.
        </p>
      </div>

      <div className="csr-registration-details-layout">
        <form className="csr-registration-form-card" onSubmit={handleSubmit} noValidate>
          <div className="csr-registration-form-grid">
            <label className="csr-registration-field">
              <span className="csr-registration-label">
                {isCommunityPartner ? "Nama Organisasi" : "Nama Lengkap"}
              </span>
              <input
                className="csr-registration-input"
                data-error={Boolean(errors.fullName)}
                type="text"
                autoComplete="name"
                value={data.fullName}
                placeholder={isCommunityPartner ? "Masukkan nama organisasi" : "Masukkan nama resmi anda"}
                onChange={(event) => updateField("fullName", event.target.value)}
              />
              {errors.fullName && <p className="csr-registration-error">{errors.fullName}</p>}
            </label>

            <label className="csr-registration-field">
              <span className="csr-registration-label">Area Fokus Utama</span>
              <select
                className="csr-registration-select"
                data-error={Boolean(errors.focusArea)}
                value={data.focusArea}
                onChange={(event) => updateField("focusArea", event.target.value)}
              >
                <option value="">Pilih bidang dampak</option>
                <option value="community-development">Pemberdayaan Masyarakat</option>
                <option value="education">Pendidikan &amp; Literasi</option>
                <option value="environment">Lingkungan &amp; Keberlanjutan</option>
                <option value="creative-economy">Ekonomi Kreatif &amp; UMKM</option>
                <option value="social-campaign">Kampanye Sosial</option>
              </select>
              {errors.focusArea && <p className="csr-registration-error">{errors.focusArea}</p>}
            </label>

            <label className="csr-registration-field">
              <span className="csr-registration-label">Alamat Email Aktif</span>
              <input
                className="csr-registration-input"
                data-error={Boolean(errors.email)}
                type="email"
                autoComplete="email"
                value={data.email}
                placeholder="example@mahreen.id"
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && <p className="csr-registration-error">{errors.email}</p>}
            </label>

            <label className="csr-registration-field">
              <span className="csr-registration-label">Nomor WhatsApp</span>
              <InternationalPhoneInput
                className="csr-registration-input"
                value={data.whatsapp}
                placeholder="812 3456 7890"
                invalid={Boolean(errors.whatsapp)}
                onChange={(value) => updateField("whatsapp", value)}
              />
              {errors.whatsapp && <p className="csr-registration-error">{errors.whatsapp}</p>}
            </label>

            <label className="csr-registration-field">
              <span className="csr-registration-label">Provinsi</span>
              <input
                className="csr-registration-input"
                data-error={Boolean(errors.province)}
                type="text"
                autoComplete="address-level1"
                value={data.province}
                placeholder="Cari provinsi..."
                onChange={(event) => updateField("province", event.target.value)}
              />
              {errors.province && <p className="csr-registration-error">{errors.province}</p>}
            </label>

            <label className="csr-registration-field">
              <span className="csr-registration-label">Kota / Kabupaten</span>
              <input
                className="csr-registration-input"
                data-error={Boolean(errors.city)}
                type="text"
                autoComplete="address-level2"
                value={data.city}
                placeholder="Cari kota..."
                onChange={(event) => updateField("city", event.target.value)}
              />
              {errors.city && <p className="csr-registration-error">{errors.city}</p>}
            </label>

            <label className="csr-registration-field csr-registration-field--full">
              <span className="csr-registration-label">Visi Bergabung (Opsional)</span>
              <textarea
                className="csr-registration-textarea"
                value={data.vision}
                placeholder="Ceritakan singkat mengapa anda tertarik berkontribusi..."
                onChange={(event) => updateField("vision", event.target.value)}
              />
            </label>
          </div>

          <div className="csr-registration-form-actions">
            <button
              className="csr-registration-button csr-registration-button--ghost"
              type="button"
              onClick={() => navigateToStep(1)}
            >
              <ArrowLeft size={14} />
              Kembali
            </button>
            <button className="csr-registration-button" type="submit">
              Langkah Selanjutnya
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        <aside className="csr-registration-aside" aria-label="Manfaat bergabung">
          <div className="csr-registration-aside-card">
            <h2 className="csr-registration-aside-card__title">Mengapa Bergabung?</h2>
            <p className="csr-registration-aside-card__description">
              Jadilah bagian dari ekosistem yang percaya bahwa setiap kontribusi kecil mampu menciptakan riak perubahan yang besar.
            </p>
            <ul className="csr-registration-aside-list">
              <li>
                <span className="csr-registration-aside-list__icon"><Network size={14} /></span>
                <div>
                  <strong>Network Access</strong>
                  <p>Terhubung dengan 500+ mitra industri dan komunitas strategis.</p>
                </div>
              </li>
              <li>
                <span className="csr-registration-aside-list__icon"><Lightbulb size={14} /></span>
                <div>
                  <strong>Resource Support</strong>
                  <p>Dukungan infrastruktur digital dan pendanaan program berkelanjutan.</p>
                </div>
              </li>
              <li>
                <span className="csr-registration-aside-list__icon"><ShieldCheck size={14} /></span>
                <div>
                  <strong>Social Impact Certificate</strong>
                  <p>Pengakuan resmi atas kontribusi anda dalam pembangunan nasional.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="csr-registration-values-card">
            <img width="1280" height="480" decoding="async" src={registrationImage} alt="Kolaborasi dalam program lingkungan Mahreen CSR" />
            <div className="csr-registration-values-card__content">
              <p className="csr-registration-values-card__eyebrow">Our Values</p>
              <p className="csr-registration-values-card__quote">
                “Bersama membangun kemandirian bangsa melalui kolaborasi nyata.”
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const CSRDetailsPage = () => {
  const { data, updateData } = useCSRRegistration(2);

  return (
    <CSRRegistrationLayout currentStep={2}>
      <DetailsStep data={data} onChange={updateData} />
    </CSRRegistrationLayout>
  );
};

export default CSRDetailsPage;
