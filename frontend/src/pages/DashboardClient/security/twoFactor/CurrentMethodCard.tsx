import { MessageSquareText, ShieldCheck } from "lucide-react";
import { maskSecurityPhone } from "../../../../services/security/clientTwoFactorService";

type CurrentMethodCardProps = Readonly<{
  phoneNumber: string;
}>;

const CurrentMethodCard = ({ phoneNumber }: CurrentMethodCardProps) => (
  <section className="twofa-card twofa-current twofa-reveal" style={{ "--twofa-delay": "90ms" } as React.CSSProperties}>
    <div className="twofa-current__icon"><MessageSquareText aria-hidden="true" /></div>
    <div className="twofa-current__copy">
      <span>Metode Aktif Saat Ini</span>
      <strong>SMS / WhatsApp OTP</strong>
      <small><ShieldCheck aria-hidden="true" /> Terhubung ke nomor {maskSecurityPhone(phoneNumber)}</small>
    </div>
    <span className="twofa-pill">AKTIF</span>
  </section>
);

export default CurrentMethodCard;

