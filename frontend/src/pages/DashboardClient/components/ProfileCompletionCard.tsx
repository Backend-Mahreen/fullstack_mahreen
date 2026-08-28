import { ArrowRight, Check } from "lucide-react";
import type { CompletionItem } from "../types";

type ProfileCompletionCardProps = {
  items: CompletionItem[];
  percentage: number;
};


const ProfileCompletionCard = ({
  items,
  percentage,
}: ProfileCompletionCardProps) => (
  <>
<article className="client-dashboard__profile-card dashboard-card">
      <div className="client-dashboard__profile-heading">
        <span>Lengkapi Profil Anda</span>
        <strong>{percentage}%</strong>
      </div>
      <div
        className="client-dashboard__profile-progress"
        aria-label={`Kelengkapan profil ${percentage} persen`}
      >
        <span style={{ width: `${percentage}%` }} />
      </div>
      <ul className="client-dashboard__checklist">
        {items.map((item) => (
          <li key={item.label} className={item.complete ? "is-complete" : ""}>
            <span className="client-dashboard__check-icon" aria-hidden="true">
              {item.complete ? <Check /> : null}
            </span>
            <span>{item.label}</span>
            {item.pending ? <small>Pending</small> : null}
          </li>
        ))}
      </ul>
      <a className="client-dashboard__complete" href="/akun/edit">
        {percentage === 100 ? "Lihat Profil" : "Lengkapi Sekarang"}{" "}
        <ArrowRight aria-hidden="true" />
      </a>
    </article>
  </>
);

export default ProfileCompletionCard;
