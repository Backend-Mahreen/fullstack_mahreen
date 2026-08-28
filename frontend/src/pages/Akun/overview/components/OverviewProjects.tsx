import { ArrowRight } from "lucide-react";
import type { Project } from "../../../DashboardClient/types";
import { formatInvoiceCurrency, formatInvoiceDate } from "../../invoice/invoiceFormatters";

const getProjectTone = (status: string) =>
  /review|waiting|awaiting/i.test(status) ? "review" : "active";

const getProjectCode = (project: Project) => {
  const value = project.sourceRequestId ?? project.id;
  return value.replace(/^[^:]+:/, "").slice(0, 18).toUpperCase();
};

const OverviewProjects = ({ projects }: Readonly<{ projects: Project[] }>) => (
  <section className="account-overview__section" aria-labelledby="overview-project-title">
    <header className="account-overview__section-header">
      <div>
        <span>PROJECT</span>
        <h2 id="overview-project-title">Project Aktif</h2>
      </div>
      <a href="/akun/projects">Lihat semua <ArrowRight aria-hidden="true" /></a>
    </header>

    <div className="account-overview__projects">
      {projects.length ? projects.slice(0, 3).map((project) => (
        <article className="account-overview__project" key={project.id}>
          <div className="account-overview__project-top">
            <div>
              <span className={`account-overview__project-status account-overview__project-status--${getProjectTone(project.status)}`}>
                {project.status.toUpperCase()}
              </span>
              <code>{getProjectCode(project)}</code>
            </div>
            {typeof project.budget === "number" && (
              <strong>{formatInvoiceCurrency(project.budget)}</strong>
            )}
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="account-overview__progress-copy">
            <span>Progress</span>
            <b>{project.progress}%</b>
          </div>
          <div
            className="account-overview__progress"
            role="progressbar"
            aria-label={`Progress ${project.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={project.progress}
          >
            <span style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }} />
          </div>
          <footer>
            <span>Diperbarui <strong>{formatInvoiceDate(project.updatedAt)}</strong></span>
            <a href={project.href}>Detail <ArrowRight aria-hidden="true" /></a>
          </footer>
        </article>
      )) : (
        <p className="account-overview__empty">Belum ada project aktif. Project dari konsultasi dan pembayaran lokal akan muncul di sini.</p>
      )}
    </div>
  </section>
);

export default OverviewProjects;
