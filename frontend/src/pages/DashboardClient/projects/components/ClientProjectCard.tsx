import { CalendarDays, ChevronDown, ChevronUp, Clock3 } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { ClientProjectView } from "../projectViewModel";
import ProjectMilestones from "./ProjectMilestones";

type ClientProjectCardProps = Readonly<{
  project: ClientProjectView;
  index: number;
}>;

const ClientProjectCard = ({ project, index }: ClientProjectCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const progressStyle = {
    "--client-project-progress": `${project.progress}%`,
  } as CSSProperties;
  const cardStyle = {
    "--client-project-index": index,
  } as CSSProperties;

  return (
    <article className="client-project-card" style={cardStyle}>
      <div className="client-project-card__header">
        <div className="client-project-card__meta">
          <span
            className={`client-project-card__status is-${project.status.toLowerCase()}`}
          >
            {project.status}
          </span>
          <span>{project.id}</span>
          <span aria-hidden="true">•</span>
          <span>{project.category}</span>
        </div>
        <div className="client-project-card__progress-copy">
          <strong>{project.progress}%</strong>
          <span>progress</span>
        </div>
      </div>

      <h2>{project.title}</h2>
      <p className="client-project-card__manager">
        Project Manager: {project.projectManager} • Budget: {project.budget}
      </p>

      <div
        className="client-project-card__progress-track"
        role="progressbar"
        aria-label={`Progress ${project.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={project.progress}
      >
        <span style={progressStyle} />
      </div>

      <div className="client-project-card__dates">
        <span><CalendarDays aria-hidden="true" />Mulai: {project.startDate}</span>
        <span><Clock3 aria-hidden="true" />Deadline: {project.deadline}</span>
      </div>

      <ProjectMilestones milestones={project.milestones} expanded={expanded} />

      <button
        className="client-project-card__toggle"
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
        {expanded ? "Sembunyikan" : "Tampilkan Milestones"}
      </button>
    </article>
  );
};

export default ClientProjectCard;
