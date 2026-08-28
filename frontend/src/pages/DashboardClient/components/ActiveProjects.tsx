import { FolderKanban } from "lucide-react";
import type { Project } from "../types";
import { handleRouteClick } from "../../../utils/hashNavigation";
import ProjectCard, { ProjectCardStyles } from "./ProjectCard";
import SectionHeader from "./SectionHeader";

type ActiveProjectsProps = {
  projects: Project[];
};

const ACTIVE_PROJECTS_STYLES = `
  .client-dashboard__work-grid {
    grid-template-columns: minmax(0, 1.82fr) minmax(390px, .88fr);
    gap: 42px;
  }

  .client-dashboard__projects-block {
    min-width: 0;
  }

  .client-dashboard__projects-block .client-dashboard__section-heading {
    min-height: 38px;
    margin-bottom: 24px;
  }

  .client-dashboard__projects-block .client-dashboard__section-heading h2 {
    color: #d4cec6;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -.018em;
  }

  .client-dashboard__project-grid {
    display: grid;
    width: 100%;
    max-width: none;
    min-width: 0;
    margin: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    align-items: stretch;
  }

  .client-dashboard__projects-action {
    display: inline-flex;
    min-height: 50px;
    padding: 0 18px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(232, 199, 121, .22);
    border-radius: 999px;
    background: rgba(217, 183, 101, .07);
    color: #f0ce7e;
    cursor: pointer;
    font: inherit;
    font-size: 15px;
    font-weight: 800;
    line-height: 1;
    text-decoration: none;
    transition: transform 220ms ease, color 220ms ease, border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
  }

  .client-dashboard__projects-action:hover {
    border-color: rgba(232, 199, 121, .58);
    background: rgba(217, 183, 101, .13);
    color: #ffe19a;
    box-shadow: 0 0 22px rgba(217, 183, 101, .16);
    transform: translateY(-2px);
  }

  .client-dashboard__projects-empty {
    display: grid;
    width: 100%;
    min-height: 340px;
    padding: 42px;
    place-items: center;
    align-content: center;
    border: 1px solid rgba(217, 183, 101, .18);
    border-radius: 24px;
    background: radial-gradient(circle at 50% 0, rgba(217, 183, 101, .08), transparent 44%), #141414;
    box-shadow: 0 18px 48px -38px rgba(217, 183, 101, .55);
    text-align: center;
  }

  .client-dashboard__projects-empty svg {
    width: 36px;
    height: 36px;
    color: #d9b765;
  }

  .client-dashboard__projects-empty h3 {
    margin: 18px 0 0;
    color: #eee9e1;
    font-size: 24px;
  }

  .client-dashboard__projects-empty p {
    max-width: 460px;
    margin: 10px 0 0;
    color: #8f8a83;
    font-size: 15px;
    line-height: 1.65;
  }

  .client-dashboard__projects-empty a {
    margin-top: 22px;
    padding: 12px 18px;
    border: 1px solid rgba(217, 183, 101, .34);
    border-radius: 11px;
    color: #e8c779;
    font-size: 14px;
    font-weight: 700;
  }

  @media (max-width: 1280px) {
    .client-dashboard__work-grid {
      grid-template-columns: minmax(0, 1fr) minmax(360px, 400px);
      gap: 30px;
    }
  }

  @media (max-width: 1040px) {
    .client-dashboard__work-grid {
      grid-template-columns: 1fr;
      gap: 34px;
    }

    .client-dashboard__project-grid,
    .client-dashboard__projects-empty {
      max-width: none;
      margin-inline: 0;
    }
  }

  @media (max-width: 680px) {
    .client-dashboard__project-grid {
      grid-template-columns: 1fr;
    }

    .client-dashboard__projects-empty {
      min-height: 260px;
      padding: 30px 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .client-dashboard__projects-action {
      transition: none;
    }
  }
`;

const ActiveProjects = ({ projects }: ActiveProjectsProps) => {
  const visibleProjects = projects.slice(0, 2);

  return (
    <>
      <style>{ACTIVE_PROJECTS_STYLES}</style>
      <ProjectCardStyles />
      <section className="client-dashboard__projects-block">
        <SectionHeader title="Active Projects">
          {projects.length > 0 ? (
            <a
              href="/akun/projects"
              className="client-dashboard__projects-action"
              onClick={(event) => handleRouteClick(event, "/akun/projects")}
            >
              View All
            </a>
          ) : null}
        </SectionHeader>

        {visibleProjects.length > 0 ? (
          <div className="client-dashboard__project-grid">
            {visibleProjects.map((project, index) => (
              <ProjectCard project={project} index={index} key={project.id} />
            ))}
          </div>
        ) : (
          <div className="client-dashboard__projects-empty" role="status">
            <FolderKanban aria-hidden="true" />
            <h3>Belum ada proyek aktif</h3>
            <p>
              Proyek akan muncul otomatis setelah Anda mengirim konsultasi atau
              memulai layanan Mahreen.
            </p>
            <a href="/tanya-mahreen">Mulai proyek</a>
          </div>
        )}
      </section>
    </>
  );
};

export default ActiveProjects;
