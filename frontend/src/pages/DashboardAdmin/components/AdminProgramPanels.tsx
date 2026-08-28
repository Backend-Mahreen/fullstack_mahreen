import type { CSSProperties } from "react";
import { ArrowUpRight, BriefcaseBusiness, HandHeart, MessageCircleMore } from "lucide-react";
import type { AdminProgramSnapshot } from "../../../services/admin/adminWorkspaceRepository";
import type { AdminModuleKey } from "../types";

type AdminProgramPanelsProps = Readonly<{
  onSelect: (module: AdminModuleKey) => void;
  programs: AdminProgramSnapshot;
}>;

const AdminProgramPanels = ({ onSelect, programs }: AdminProgramPanelsProps) => (
  <section className="admin-program-grid" aria-label="Program utama Mahreen">
    <article className="admin-panel admin-program-card admin-animate" style={{ "--admin-delay": "310ms" } as CSSProperties}>
      <div className="admin-panel__heading">
        <div>
          <span className="admin-eyebrow"><BriefcaseBusiness size={12} aria-hidden="true" /> Internship Program</span>
          <h2>Talent Pipeline</h2>
        </div>
        <button className="admin-link-button" type="button" onClick={() => onSelect("internship")}>
          View <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </div>
      <dl className="admin-stat-list">
        <div><dt>Total Pendaftar</dt><dd>{programs.internship.totalApplicants}</dd></div>
        <div><dt>Interview Scheduled</dt><dd>{programs.internship.interviews}</dd></div>
        <div><dt>Peserta Aktif</dt><dd>{programs.internship.activeParticipants}</dd></div>
      </dl>
      <div className="admin-program-card__watermark" aria-hidden="true" />
    </article>

    <article className="admin-panel admin-donation-card admin-animate" style={{ "--admin-delay": "365ms" } as CSSProperties}>
      <div className="admin-panel__heading">
        <div>
          <span className="admin-eyebrow"><HandHeart size={12} aria-hidden="true" /> Peduli Mahreen</span>
          <h2>Donation Overview</h2>
        </div>
        <span className="admin-chip">{programs.donation.targetProgress}% target</span>
      </div>
      <div className="admin-donation-card__values">
        <div><span>Donation</span><strong>{programs.donation.donors}</strong></div>
        <div><span>Terkumpul</span><strong>{programs.donation.collected}</strong></div>
      </div>
      <span className="admin-progress admin-progress--large" aria-label="82% target donasi tercapai">
        <span style={{ "--admin-progress": `${programs.donation.targetProgress}%` } as CSSProperties} />
      </span>
      <div className="admin-donation-card__footer">
        <span>Dana tersalurkan</span>
        <button type="button" onClick={() => onSelect("peduli-mahreen")}>{programs.donation.distributed} <ArrowUpRight size={12} /></button>
      </div>
    </article>

    <article className="admin-panel admin-csr-card admin-animate" style={{ "--admin-delay": "420ms" } as CSSProperties}>
      <div className="admin-panel__heading">
        <div>
          <span className="admin-eyebrow"><MessageCircleMore size={12} aria-hidden="true" /> Mahreen CSR</span>
          <h2>Program Status</h2>
        </div>
      </div>
      <div className="admin-csr-card__counts">
        <div><strong>{String(programs.csr.activePartners).padStart(2, "0")}</strong><span>Mitra Aktif</span></div>
        <div><strong>{String(programs.csr.runningPrograms).padStart(2, "0")}</strong><span>Program Berjalan</span></div>
      </div>
      <button className="admin-primary-button" type="button" onClick={() => onSelect("mahreen-csr")}>
        Review Proposal <span>({programs.csr.pendingProposals})</span>
      </button>
    </article>
  </section>
);

export default AdminProgramPanels;
