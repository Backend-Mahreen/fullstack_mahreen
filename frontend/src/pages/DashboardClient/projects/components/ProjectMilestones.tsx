import { Check } from "lucide-react";
import type { ClientProjectMilestone } from "../projectViewModel";

type ProjectMilestonesProps = Readonly<{
  milestones: ClientProjectMilestone[];
  expanded: boolean;
}>;

const ProjectMilestones = ({
  milestones,
  expanded,
}: ProjectMilestonesProps) => (
  <div
    className={`client-project-card__milestones${
      expanded ? " is-expanded" : " is-collapsed"
    }`}
    aria-hidden={!expanded}
  >
    <h4>Milestones</h4>
    <div className="client-project-card__milestone-list">
      {milestones.map((milestone) => (
        <div className="client-project-milestone" key={milestone.label}>
          <div className="client-project-milestone__left">
            <span
              className={`client-project-milestone__icon${
                milestone.completed ? " is-completed" : ""
              }`}
              aria-hidden="true"
            >
              {milestone.completed ? <Check size={12} strokeWidth={3} /> : null}
            </span>
            <span
              className={`client-project-milestone__label${
                milestone.completed ? " is-completed" : ""
              }`}
            >
              {milestone.label}
            </span>
          </div>
          {milestone.completed ? (
            <span className="client-project-milestone__status">✓ Selesai</span>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

export default ProjectMilestones;
