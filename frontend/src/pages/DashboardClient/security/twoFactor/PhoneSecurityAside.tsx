import { CircleCheck, Shield } from "lucide-react";

const PhoneSecurityAside = () => (
  <aside className="phone-security-aside">
    <section className="phone-security-card twofa-reveal" style={{ "--twofa-delay": "150ms" } as React.CSSProperties}>
      <h2><Shield aria-hidden="true" /> Keamanan<br />Akun</h2>
      <p>Nomor telepon Anda adalah pilar utama sistem keamanan <strong>Two-Factor Authentication (2FA)</strong> Mahreen Indonesia.</p>
      <ul>
        <li><CircleCheck aria-hidden="true" />Digunakan untuk pemulihan akun jika Anda lupa kata sandi.</li>
        <li><CircleCheck aria-hidden="true" />Notifikasi transaksi real-time untuk aset global Anda.</li>
        <li><CircleCheck aria-hidden="true" />Otorisasi login dari perangkat baru yang tidak dikenal.</li>
      </ul>
      <small>Sistem enkripsi end-to-end kami memastikan data Anda selalu terlindungi.</small>
    </section>
    <section className="phone-security-tip twofa-reveal" style={{ "--twofa-delay": "230ms" } as React.CSSProperties}>
      <strong>ⓘ Tips Keamanan</strong>
      <p>Jangan pernah membagikan kode verifikasi OTP kepada siapapun, termasuk staf resmi Mahreen Indonesia. Kami tidak akan pernah meminta kode rahasia Anda.</p>
    </section>
  </aside>
);

export default PhoneSecurityAside;

