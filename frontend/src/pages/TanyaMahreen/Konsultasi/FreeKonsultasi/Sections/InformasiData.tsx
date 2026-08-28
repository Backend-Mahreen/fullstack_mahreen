import { UserRound } from "lucide-react";
import InternationalPhoneInput from "../../../../../components/Form/InternationalPhoneInput";

interface InformasiDataValue {
  nama: string;
  perusahaan: string;
  email: string;
  whatsapp: string;
  kota: string;
}

interface InformasiDataProps {
  value: InformasiDataValue;
  onChange: (field: keyof InformasiDataValue, value: string) => void;
}

const InformasiData = ({ value, onChange }: InformasiDataProps) => {
  return (
    <section className="consult-card consult-form-reveal" aria-labelledby="informasi-klien-title">
      <h2 className="consult-section-title" id="informasi-klien-title">
        <UserRound aria-hidden="true" />
        <span>1. Informasi Klien</span>
      </h2>

      <div className="consult-fields-grid">
        <label className="consult-field">
          <span>Nama Lengkap</span>
          <input
            type="text"
            name="nama"
            value={value.nama}
            onChange={(event) => onChange("nama", event.target.value)}
            placeholder="Masukkan nama Anda"
            autoComplete="name"
            required
          />
        </label>

        <label className="consult-field">
          <span>Perusahaan / Brand</span>
          <input
            type="text"
            name="perusahaan"
            value={value.perusahaan}
            onChange={(event) => onChange("perusahaan", event.target.value)}
            placeholder="Nama entitas bisnis"
            autoComplete="organization"
          />
        </label>

        <label className="consult-field">
          <span>Alamat Email</span>
          <input
            type="email"
            name="email"
            value={value.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="email@bisnisanda.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="consult-field">
          <span>Nomor WhatsApp</span>
          <InternationalPhoneInput
            className="consult-phone-input"
            name="whatsapp"
            value={value.whatsapp}
            onChange={(phone) => onChange("whatsapp", phone)}
            placeholder="812 3456 7890"
            required
          />
        </label>

        <label className="consult-field consult-field--full">
          <span>Domisili Kota</span>
          <input
            type="text"
            name="kota"
            value={value.kota}
            onChange={(event) => onChange("kota", event.target.value)}
            placeholder="Contoh: Jakarta Selatan"
            autoComplete="address-level2"
          />
        </label>
      </div>
    </section>
  );
};

export default InformasiData;
