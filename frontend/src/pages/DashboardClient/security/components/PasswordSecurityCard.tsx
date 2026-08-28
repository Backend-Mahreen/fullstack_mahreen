import { Lock } from "lucide-react";

type PasswordSecurityCardProps = Readonly<{
  onChangePassword: () => void;
}>;

const PasswordSecurityCard = ({
  onChangePassword,
}: PasswordSecurityCardProps) => (
  <section className="client-security-card client-security-password">
    <div className="client-security-password__row">
      <div className="client-security-password__left">
        <span className="client-security-password__icon" aria-hidden="true">
          <Lock />
        </span>
        <span className="client-security-password__copy">
          <h2>Kata Sandi</h2>
          <span>Terakhir diubah 3 bulan lalu</span>
        </span>
      </div>
      <button type="button" onClick={onChangePassword}>Ganti Kata Sandi</button>
    </div>
    <p>
      Pastikan Anda menggunakan kombinasi karakter yang unik dan kuat untuk
      menjaga keamanan akses.
    </p>
  </section>
);

export default PasswordSecurityCard;
