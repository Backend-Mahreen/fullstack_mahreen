import { BadgeCheck } from "lucide-react";

type DashboardHeaderProps = {
  displayName: string;
  memberId: string;
  memberYear: number;
};


const DashboardHeader = ({ displayName, memberId, memberYear }: DashboardHeaderProps) => (
  <>
<header className="client-dashboard__hero" data-dashboard-reveal data-dashboard-step="1">
      <div className="client-dashboard__identity">
        <div className="client-dashboard__welcome-row">
          <h1>
            Selamat Datang, <span>{displayName}</span>
          </h1>
          <span className="client-dashboard__verified">
            <BadgeCheck aria-hidden="true" /> Verified
          </span>
        </div>
        <p>
          Mahreen ID: {memberId} <span aria-hidden="true">•</span> Member Since {memberYear}
        </p>
      </div>

      <a className="client-dashboard__edit" href="/akun/edit">
        Edit<br />Profile
      </a>
    </header>
  </>
);

export default DashboardHeader;
