import { ShieldCheck, Smartphone } from "lucide-react";

type TwoFactorCardProps = Readonly<{
  enabled: boolean;
  method: string;
  onConfigure: () => void;
}>;

const TwoFactorCard = ({ enabled, method, onConfigure }: TwoFactorCardProps) => (
  <section className="client-security-side-card is-accent">
    <div className="client-security-two-factor__header">
      <h2>Autentikasi 2 Faktor</h2>
      <span className={enabled ? "is-enabled" : ""}>
        {enabled ? "ENABLED" : "DISABLED"}
      </span>
    </div>
    <p>Amankan akun Anda dengan verifikasi tambahan.</p>
    <div className="client-security-two-factor__option">
      <span><Smartphone aria-hidden="true" />{method}</span>
      {enabled ? <ShieldCheck aria-label="Aktif" /> : null}
    </div>
    <button type="button" onClick={onConfigure}>
      {enabled ? "Konfigurasi Ulang" : "Konfigurasi 2FA"}
    </button>
  </section>
);

export default TwoFactorCard;
