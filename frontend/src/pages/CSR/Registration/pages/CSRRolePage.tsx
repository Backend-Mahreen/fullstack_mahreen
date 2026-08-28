import { ArrowRight, Building2, Check, CheckCircle2, HandHeart } from "lucide-react";

import CSRRegistrationLayout from "../components/CSRRegistrationLayout";
import PageHeading from "../components/PageHeading";
import useCSRRegistration from "../../../../hooks/useCSRRegistration";
import type { CSRRegistrationData } from "../../../../types/csrRegistration";
import { navigateToStep } from "../../../../utils/csrRegistration";

const RoleStep = ({
  data,
  onChange,
}: Readonly<{
  data: CSRRegistrationData;
  onChange: (updates: Partial<CSRRegistrationData>) => void;
}>) => {
  const roles = [
    {
      id: "volunteer" as const,
      icon: HandHeart,
      title: "Join as Volunteer",
      description:
        "Berikan kontribusi langsung melalui keterampilan, waktu, dan tenaga Anda untuk mendukung program-program pemberdayaan masyarakat di seluruh pelosok negeri.",
      benefits: [
        "Akses ke pelatihan pengembangan diri eksklusif.",
        "Sertifikat kontribusi resmi dari Mahreen CSR.",
      ],
    },
    {
      id: "community-partner" as const,
      icon: Building2,
      title: "Join as Community Partner",
      description:
        "Kolaborasi strategis bagi institusi, komunitas, atau organisasi untuk bersama-sama merancang dan menjalankan inisiatif sosial berskala besar.",
      benefits: [
        "Dukungan pendanaan dan ekosistem infrastruktur.",
        "Networking dengan stakeholder industri & pemerintahan.",
      ],
    },
  ];

  return (
    <div className="csr-registration-stage" key="role-step">
      <PageHeading />

      <div className="csr-registration-role-grid">
        {roles.map((role) => {
          const RoleIcon = role.icon;
          const isSelected = data.role === role.id;

          return (
            <button
              className={`csr-registration-role-card${isSelected ? " is-selected" : ""}`}
              type="button"
              key={role.id}
              onClick={() => onChange({ role: role.id })}
              aria-pressed={isSelected}
            >
              <span className="csr-registration-role-card__selected" aria-hidden="true">
                <Check size={16} strokeWidth={2.5} />
              </span>
              <span className="csr-registration-role-card__icon" aria-hidden="true">
                <RoleIcon size={27} strokeWidth={1.65} />
              </span>
              <h2 className="csr-registration-role-card__title">{role.title}</h2>
              <p className="csr-registration-role-card__description">{role.description}</p>
              <ul className="csr-registration-benefits">
                {role.benefits.map((benefit) => (
                  <li key={benefit}>
                    <CheckCircle2 size={14} strokeWidth={1.7} aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="csr-registration-step-actions">
        <button
          className="csr-registration-button csr-registration-button--wide"
          type="button"
          disabled={!data.role}
          onClick={() => navigateToStep(2)}
        >
          Next Step
          <ArrowRight size={15} />
        </button>
        <p className="csr-registration-step-counter">Langkah 1 dari 4</p>
      </div>
    </div>
  );
};

const CSRRolePage = () => {
  const { data, updateData } = useCSRRegistration(1);

  return (
    <CSRRegistrationLayout currentStep={1}>
      <RoleStep data={data} onChange={updateData} />
    </CSRRegistrationLayout>
  );
};

export default CSRRolePage;
