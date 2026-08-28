import { History, Info, MonitorCheck, ShieldCheck } from "lucide-react";

type PasswordSecurityAsideProps = Readonly<{
  activeSessions: number;
}>;

const PasswordSecurityAside = ({ activeSessions }: PasswordSecurityAsideProps) => (
  <aside className="password-security-aside" aria-label="Informasi keamanan akun">
    <section className="password-security-summary password-change-reveal" style={{ "--password-delay": "90ms" } as React.CSSProperties}>
      <header>
        <span><ShieldCheck aria-hidden="true" /></span>
        <h2>Keamanan Akun</h2>
      </header>
      <p>
        Keamanan Akun Prioritas Kami. Kami menyarankan pembaruan kata sandi
        secara berkala setiap 3–6 bulan.
      </p>
      <div className="password-security-summary__meta">
        <article>
          <History aria-hidden="true" />
          <span><strong>Terakhir diubah</strong><small>3 bulan lalu</small></span>
        </article>
        <article>
          <MonitorCheck aria-hidden="true" />
          <span><strong>Perangkat aktif</strong><small>{activeSessions} Sesi aktif saat ini</small></span>
        </article>
      </div>
    </section>

    <section className="password-security-note password-change-reveal" style={{ "--password-delay": "160ms" } as React.CSSProperties}>
      <Info aria-hidden="true" />
      <p>
        Semua aktivitas perubahan keamanan akan dikirimkan notifikasinya ke
        email terdaftar Anda sebagai langkah pencegahan akses ilegal.
      </p>
    </section>
  </aside>
);

export default PasswordSecurityAside;
