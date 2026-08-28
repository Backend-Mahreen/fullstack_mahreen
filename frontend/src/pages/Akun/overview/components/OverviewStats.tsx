import { BriefcaseBusiness, CalendarDays, ReceiptText, Star } from "lucide-react";

type OverviewStatsProps = Readonly<{
  projectCount: number;
  pendingInvoiceCount: number;
  scheduleCount: number;
  packageName: string;
}>;

const OverviewStats = ({
  projectCount,
  pendingInvoiceCount,
  scheduleCount,
  packageName,
}: OverviewStatsProps) => {
  const stats = [
    {
      label: "Project Berjalan",
      value: String(projectCount),
      badge: "AKTIF",
      tone: "active",
      icon: BriefcaseBusiness,
    },
    {
      label: "Invoice Pending",
      value: String(pendingInvoiceCount),
      badge: "PENDING",
      tone: "pending",
      icon: ReceiptText,
    },
    {
      label: "Jadwal Mendatang",
      value: String(scheduleCount),
      badge: "TERJADWAL",
      tone: "neutral",
      icon: CalendarDays,
    },
    {
      label: "Paket Saat Ini",
      value: packageName,
      badge: "PROFESSIONAL",
      tone: "gold",
      icon: Star,
    },
  ] as const;

  return (
    <section className="account-overview__stats" aria-label="Statistik akun">
      {stats.map(({ label, value, badge, tone, icon: Icon }) => (
        <article className={`account-overview__stat account-overview__stat--${tone}`} key={label}>
          <div className="account-overview__stat-top">
            <Icon aria-hidden="true" />
            <span>{badge}</span>
          </div>
          <strong>{value}</strong>
          <p>{label}</p>
        </article>
      ))}
    </section>
  );
};

export default OverviewStats;
