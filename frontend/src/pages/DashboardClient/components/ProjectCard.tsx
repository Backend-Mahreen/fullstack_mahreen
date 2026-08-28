import type { Project } from "../types";

type ProjectCardProps = {
  project: Project;
  index?: number;
};

const PROJECT_CARD_STYLES = `
  .client-dashboard__project-card {
    position: relative;
    isolation: isolate;
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 340px;
    padding: 38px 36px 34px;
    flex-direction: column;
    border-color: #28251f;
    border-radius: 24px;
    background: linear-gradient(145deg, #171717 0%, #131313 72%);
    box-shadow: 0 22px 54px -42px rgba(232, 199, 121, .8);
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    animation: dashboard-project-in 620ms cubic-bezier(.22,1,.36,1) both;
    animation-delay: calc(260ms + (var(--project-index, 0) * 90ms));
    color: inherit;
    text-decoration: none;
    transition: transform 280ms cubic-bezier(.22,1,.36,1), border-color 280ms ease, box-shadow 280ms ease;
  }

  .client-dashboard__project-card::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: -1px;
    border-radius: inherit;
    background: radial-gradient(circle at 12% 0, rgba(232, 199, 121, .12), transparent 38%);
    opacity: .55;
    pointer-events: none;
    transition: opacity 280ms ease;
  }

  .client-dashboard__project-card:hover,
  .client-dashboard__project-card:focus-visible {
    border-color: rgba(232, 199, 121, .46);
    box-shadow: 0 0 0 1px rgba(232, 199, 121, .08), 0 24px 62px -30px rgba(217, 183, 101, .46);
    transform: translateY(-5px);
  }

  .client-dashboard__project-card:hover::before,
  .client-dashboard__project-card:focus-visible::before {
    opacity: 1;
  }

  .client-dashboard__status {
    position: absolute;
    top: 24px;
    right: 22px;
    max-width: 52%;
    padding: 9px 12px;
    border: 1px solid rgba(217, 183, 101, .12);
    border-radius: 8px;
    overflow: hidden;
    background: rgba(217, 183, 101, .12);
    color: #e8c779;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .client-dashboard__project-card h3 {
    max-width: 72%;
    margin: 0;
    overflow-wrap: anywhere;
    color: #f0ede8;
    font-size: clamp(26px, 2.1vw, 32px);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -.03em;
  }

  .client-dashboard__project-card > p {
    display: -webkit-box;
    max-width: 100%;
    margin: 18px 0 0;
    overflow: hidden;
    color: #b2aba2;
    font-size: 18px;
    line-height: 1.52;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .client-dashboard__project-progress-area {
    margin-top: auto;
    padding-top: 42px;
  }

  .client-dashboard__project-progress-copy {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: #c1bab2;
    font-size: 22px;
    font-weight: 500;
  }

  .client-dashboard__project-progress-copy strong {
    color: #ebca78;
    font-size: 24px;
  }

  .client-dashboard__project-progress {
    height: 10px;
    margin-top: 14px;
    overflow: hidden;
    border-radius: 99px;
    background: #242321;
  }

  .client-dashboard__project-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #d4ad56, #f0cf7d);
    box-shadow: 0 0 13px rgba(232, 199, 121, .35);
    transform-origin: left center;
    animation: dashboard-project-progress 900ms 500ms cubic-bezier(.22,1,.36,1) both;
  }

  .client-dashboard__avatars {
    display: flex;
    min-height: 40px;
    margin-top: 32px;
    align-items: center;
  }

  .client-dashboard__avatars > span,
  .client-dashboard__avatars > strong {
    display: grid;
    width: 38px;
    height: 38px;
    margin-left: -8px;
    place-items: center;
    border: 2px solid #141414;
    border-radius: 50%;
    background: #242424;
    color: #d3cec6;
    font-size: 14px;
    font-weight: 800;
  }

  .client-dashboard__avatars > span:nth-child(even) {
    background: #2d2b27;
    color: #e8c779;
  }

  .client-dashboard__avatars > span:first-child {
    margin-left: 0;
  }

  .client-dashboard__avatars > strong {
    background: #e8c779;
    color: #21190a;
    font-size: 14px;
  }

  @keyframes dashboard-project-in {
    from { opacity: 0; transform: translate3d(0,18px,0); }
    to { opacity: 1; transform: none; }
  }

  @keyframes dashboard-project-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  @media (max-width: 680px) {
    .client-dashboard__project-card {
      min-height: 290px;
      padding: 32px 28px 28px;
    }

    .client-dashboard__project-card > p {
      font-size: 16px;
    }

    .client-dashboard__project-progress-copy {
      font-size: 18px;
    }

    .client-dashboard__project-progress-copy strong {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    .client-dashboard__project-card h3 {
      max-width: 100%;
      padding-right: 0;
      font-size: 24px;
    }

    .client-dashboard__status {
      position: static;
      align-self: flex-start;
      max-width: 100%;
      margin-bottom: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .client-dashboard__project-card,
    .client-dashboard__project-progress span {
      opacity: 1;
      transform: none;
      animation: none;
      transition: none;
    }
  }
`;

export const ProjectCardStyles = () => <style>{PROJECT_CARD_STYLES}</style>;

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const progress = Math.max(0, Math.min(100, project.progress));
  const members = (project.memberNames ?? []).filter(Boolean).slice(0, 2);

  return (
    <a
      className="dashboard-card client-dashboard__project-card"
      href={project.href}
      style={{ "--project-index": index } as React.CSSProperties}
      aria-label={`Buka ${project.title}`}
    >
      <span className="client-dashboard__status">{project.status}</span>
      <h3>{project.title}</h3>
      <p>{project.description}</p>

      <div className="client-dashboard__project-progress-area">
        <div className="client-dashboard__project-progress-copy">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div
          className="client-dashboard__project-progress"
          role="progressbar"
          aria-label={`Progress ${project.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="client-dashboard__avatars" aria-label="Anggota proyek">
        {members.map((member) => (
          <span aria-label={member} key={member}>{getInitials(member)}</span>
        ))}
        {project.extraMembers > 0 ? <strong>+{project.extraMembers}</strong> : null}
      </div>
    </a>
  );
};

export default ProjectCard;
