import { Check, Circle, Star } from "lucide-react";
import sitiMahreen from "../../../../assets/Internship/siti-mahreen.jpg";
import rakaPratama from "../../../../assets/Internship/raka-pratama.jpg";
import dimasAndre from "../../../../assets/Internship/dimas-andre.jpg";
import type { ProjectManager } from "../../../../services/serviceManagement/serviceManagementRepository";

type ProjectManagerPickerProps = {
  managers: ProjectManager[];
  selectedId: string;
  onSelect: (managerId: string) => void;
  compact?: boolean;
};

const managerImages: Record<ProjectManager["avatarKey"], string> = {
  sarah: sitiMahreen,
  aditya: rakaPratama,
  ilham: dimasAndre,
};

const ProjectManagerPicker = ({
  managers,
  selectedId,
  onSelect,
  compact = false,
}: ProjectManagerPickerProps) => (
  <div className={`ba-manager-list${compact ? " is-compact" : ""}`}>
    {managers.map((manager, index) => {
      const selected = manager.id === selectedId;
      const percentage = Math.min(
        100,
        Math.round((manager.activeLoad / Math.max(manager.maxLoad, 1)) * 100),
      );
      return (
        <button
          className={`ba-manager${selected ? " is-selected" : ""}`}
          type="button"
          onClick={() => onSelect(manager.id)}
          style={{ "--ba-row-delay": `${index * 55}ms` } as React.CSSProperties}
          aria-pressed={selected}
          key={manager.id}
        >
          <img src={managerImages[manager.avatarKey]} alt="" />
          <span className="ba-manager__body">
            <span className="ba-manager__name">
              {manager.name}
              {selected ? <b>{manager.role}</b> : null}
            </span>
            <span className="ba-manager__specialization">
              Specialization: {manager.specialization}
            </span>
            <span className="ba-manager__meta">
              <span><Star aria-hidden="true" />{manager.rating} ({manager.reviewCount})</span>
              <span className="ba-manager__load-bars" aria-label={`${percentage}% workload`}>
                <i className={percentage >= 20 ? "is-filled" : ""} />
                <i className={percentage >= 40 ? "is-filled" : ""} />
                <i className={percentage >= 60 ? "is-filled" : ""} />
                <i className={percentage >= 80 ? "is-filled" : ""} />
              </span>
              <span>{manager.activeLoad}/{manager.maxLoad} Load</span>
            </span>
          </span>
          <span className="ba-manager__selector" aria-hidden="true">
            {selected ? <Check /> : <Circle />}
          </span>
          {selected && !compact ? <small>Selected Lead</small> : null}
        </button>
      );
    })}
  </div>
);

export default ProjectManagerPicker;
