import {
  Globe2,
  Lightbulb,
  MessageSquare,
  Paintbrush,
  PlaySquare,
  Share2,
  Shapes,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { serviceManagementRepository } from "../../../../../services/serviceManagement/serviceManagementRepository";

interface LayananProps {
  value: string[];
  onChange: (services: string[]) => void;
}

type ServiceOption = {
  label: string;
  icon: LucideIcon;
  wide?: boolean;
};

const serviceOptions: ServiceOption[] = [
  { label: "Website", icon: Globe2 },
  { label: "Branding", icon: Paintbrush },
  { label: "Social Media", icon: Share2 },
  { label: "Marketing", icon: Target },
  { label: "Content", icon: PlaySquare },
  { label: "Consultation", icon: MessageSquare },
  { label: "Recommendation", icon: Lightbulb, wide: true },
];

const Layanan = ({ value, onChange }: LayananProps) => {
  const [localServices, setLocalServices] = useState(() =>
    serviceManagementRepository.getSnapshot().services,
  );

  useEffect(() => serviceManagementRepository.subscribe(() => {
    setLocalServices(serviceManagementRepository.getSnapshot().services);
  }), []);

  const visibleServiceOptions = useMemo<ServiceOption[]>(() => {
    const options: ServiceOption[] = [
      ...serviceOptions,
      ...localServices
        .filter((service) => service.source === "admin" && service.status === "Active" && service.visibility === "Public")
        .map((service) => ({ label: service.name, icon: Shapes })),
    ];
    return options.filter(
      (option, index, collection) =>
        collection.findIndex((item) => item.label.toLowerCase() === option.label.toLowerCase()) === index,
    );
  }, [localServices]);

  const toggleService = (service: string) => {
    onChange(
      value.includes(service)
        ? value.filter((item) => item !== service)
        : [...value, service],
    );
  };

  return (
    <section className="consult-card consult-form-reveal" aria-labelledby="layanan-title">
      <h2 className="consult-section-title" id="layanan-title">
        <Shapes aria-hidden="true" />
        <span>2. Jenis Layanan</span>
      </h2>
      <p className="consult-section-description">
        Pilih satu atau beberapa layanan yang Anda butuhkan.
      </p>

      <div className="consult-service-grid">
        {visibleServiceOptions.map(({ label, icon: Icon, wide }) => {
          const selected = value.includes(label);

          return (
            <button
              className={`consult-option-button consult-service-option${
                wide ? " consult-service-option--wide" : ""
              }${selected ? " is-selected" : ""}`}
              type="button"
              key={label}
              aria-pressed={selected}
              onClick={() => toggleService(label)}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Layanan;
