import { BadgeCheck, CircleAlert } from "lucide-react";

const SecurityScorePanel = () => (
  <aside className="twofa-score twofa-reveal" style={{ "--twofa-delay": "160ms" } as React.CSSProperties}>
    <div className="twofa-score__badge"><BadgeCheck aria-hidden="true" /></div>
    <span>Skor Keamanan</span>
    <strong>Tinggi</strong>
    <div className="twofa-score__activity">
      <h2>AKTIVITAS TERBARU</h2>
      <p><i />Login dari perangkat baru<br /><small>Jakarta, ID • 2 jam yang lalu</small></p>
      <p><i />Perubahan password<br /><small>3 hari yang lalu</small></p>
    </div>
    <div className="twofa-score__tip">
      <CircleAlert aria-hidden="true" />
      <p>Mengaktifkan 2FA mengurangi risiko pengambilalihan akun. Mahreen merekomendasikan penggunaan aplikasi autentikator.</p>
    </div>
  </aside>
);

export default SecurityScorePanel;

