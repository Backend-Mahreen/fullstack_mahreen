import { Grid3X3, Smartphone } from "lucide-react";

const ChangePhoneCard = ({ onChangePhone }: Readonly<{ onChangePhone: () => void }>) => (
  <section className="twofa-card twofa-change-phone twofa-reveal" style={{ "--twofa-delay": "160ms" } as React.CSSProperties}>
    <div className="twofa-change-phone__icon"><Grid3X3 aria-hidden="true" /></div>
    <div>
      <strong>Ubah Nomor Telepon</strong>
      <p>Update nomor yang terdaftar untuk menerima kode via SMS atau WhatsApp.</p>
    </div>
    <button type="button" onClick={onChangePhone}><Smartphone aria-hidden="true" />Ubah<br />Nomor</button>
  </section>
);

export default ChangePhoneCard;

