import { BadgeCheck, ShieldCheck } from "lucide-react";

type RecoverySecurityCardProps = Readonly<{ variant: "forgot" | "reset" }>;

const RecoverySecurityCard = ({ variant }: RecoverySecurityCardProps) => {
  if (variant === "reset") {
    return (
      <article className="recovery-security-card">
        <div className="recovery-security-card__shield" aria-hidden="true"><ShieldCheck size={23} strokeWidth={1.7} /></div>
        <h2 className="recovery-security-card__title">Keamanan Akun Prioritas Kami.</h2>
        <p className="recovery-security-card__description">Kami menggunakan enkripsi tingkat tinggi untuk memastikan setiap perubahan kredensial Anda dilakukan dalam lingkungan yang aman dan terproteksi.</p>
        <hr className="recovery-security-card__divider" />
        <p className="recovery-security-card__encryption">End-to-End Encryption</p>
      </article>
    );
  }
  return (
    <article className="recovery-security-card">
      <p className="recovery-security-card__eyebrow"><span className="recovery-security-card__icon" aria-hidden="true"><ShieldCheck size={17} strokeWidth={1.9} /></span>Enterprise Grade</p>
      <h2 className="recovery-security-card__title">Security First.<br />Always.</h2>
      <p className="recovery-security-card__description">Proses pemulihan akun kami dienkripsi secara enterprise untuk melindungi data Anda di seluruh ekosistem Mahreen. Kami menggunakan protokol MFA tercanggih untuk memastikan akses tetap berada di tangan yang tepat.</p>
      <hr className="recovery-security-card__divider" />
      <div className="recovery-security-card__trust">
        <span className="recovery-security-card__avatars" aria-hidden="true">
          <span className="recovery-security-card__avatar"><BadgeCheck size={11} /></span>
          <span className="recovery-security-card__avatar">M</span>
          <span className="recovery-security-card__avatar">I</span>
        </span>
        <span>Trusted by 500+ Corporations</span>
      </div>
    </article>
  );
};
export default RecoverySecurityCard;
