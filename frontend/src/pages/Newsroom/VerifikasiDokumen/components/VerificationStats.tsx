import { verificationStats } from "../verificationData";
const VerificationStats = () => (
  <section className="mvc-stats" aria-label="Statistik verifikasi Mahreen">
    <div className="mvc-container mvc-stats__grid">
      {verificationStats.map((stat, index) => (
        <div className="mvc-stat" data-mvc-reveal style={{ "--mvc-delay": `${index * 70}ms` } as React.CSSProperties} key={stat.label}>
          <strong>{stat.value}</strong><span>{stat.label}</span>
        </div>
      ))}
    </div>
  </section>
);
export default VerificationStats;
