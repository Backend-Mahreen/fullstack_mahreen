import partnershipIcon from "../../../assets/CSR/csr-partnership.svg";
import communityDevelopmentIcon from "../../../assets/CSR/csr-community-development.svg";
import sustainabilityProgramIcon from "../../../assets/CSR/csr-sustainability-program.svg";
import socialCampaignIcon from "../../../assets/CSR/csr-social-campaign.svg";
import collaborativeImpactIcon from "../../../assets/CSR/csr-collaborative-impact-project.svg";

const pillars = [
  {
    title: "CSR Partnership",
    description:
      "Kolaborasi strategis antar entitas untuk memperluas jangkauan dampak sosial.",
    icon: partnershipIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
  {
    title: "Community Development",
    description:
      "Program penguatan kapasitas komunitas lokal secara berkelanjutan.",
    icon: communityDevelopmentIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
  {
    title: "Sustainability Program",
    description:
      "Inisiatif ramah lingkungan yang berfokus pada konservasi masa depan.",
    icon: sustainabilityProgramIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
  {
    title: "Social Campaign",
    description:
      "Advokasi isu-isu sosial melalui kampanye kreatif yang menggugah.",
    icon: socialCampaignIcon,
    iconWidth: 30,
    iconHeight: 24,
  },
  {
    title: "Collaborative Impact Project",
    description:
      "Proyek lintas sektor untuk menyelesaikan masalah kompleks masyarakat.",
    icon: collaborativeImpactIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
];

const programPillarsStyles = `

  .csr-pillars {
    width: 100%;
    background: #0e0e0e;
    color: #e5e2e1;
  }

  .csr-pillars__outer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 40px;
    box-sizing: border-box;
  }

  .csr-pillars__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 64px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .csr-pillars__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .csr-pillars__eyebrow {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 1.6px;
    text-align: center;
    color: #E5C483;
  }

  .csr-pillars__title {
    margin: 0;
    max-width: 520px;
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 48px;
    letter-spacing: -0.4px;
    text-align: center;
    color: #E5E2E1;
  }

  .csr-pillars__grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 24px;
    width: 100%;
  }

  .csr-pillars__card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    min-height: 274px;
    padding: 32px;
    background: #111111;
    border: 1px solid #1a1a1a;
  }

  .csr-pillars__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 34px;
    width: 100%;
    color: #E5C483;
  }

  .csr-pillars__icon {
    display: block;
    object-fit: contain;
    flex: 0 0 auto;
  }

  .csr-pillars__card-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    color: #E5E2E1;
  }

  .csr-pillars__card-description {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #D0C5B5;
  }

  @media (max-width: 1180px) {
    .csr-pillars__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .csr-pillars__outer {
      padding: 40px 24px;
    }

    .csr-pillars__container {
      gap: 40px;
    }

    .csr-pillars__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .csr-pillars__title {
      font-size: 34px;
      line-height: 42px;
    }
  }

  @media (max-width: 640px) {
    .csr-pillars__outer {
      padding: 32px 18px;
    }

    .csr-pillars__container {
      gap: 28px;
    }

    .csr-pillars__eyebrow {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 1.3px;
    }

    .csr-pillars__title {
      font-size: 28px;
      line-height: 34px;
    }

    .csr-pillars__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .csr-pillars__card {
      min-height: 0;
      padding: 24px;
      gap: 18px;
    }

    .csr-pillars__card-title {
      font-size: 18px;
      line-height: 24px;
    }
  }
`;

const ProgramPillarsSection = () => {
  return (
    <section className="csr-pillars" aria-labelledby="csr-pillars-title">
      <style data-component="csr-pillars">{programPillarsStyles}</style>

      <div className="csr-pillars__outer">
        <div className="csr-pillars__container">
          <header className="csr-pillars__header">
            <p className="csr-pillars__eyebrow">STRATEGIC FOCUS</p>
            <h2 className="csr-pillars__title" id="csr-pillars-title">
              Pilar Program Mahreen
            </h2>
          </header>

          <div className="csr-pillars__grid">
            {pillars.map((pillar) => (
              <article className="csr-pillars__card" key={pillar.title}>
                <div className="csr-pillars__icon-wrap">
                  <img decoding="async" loading="lazy"
                    className="csr-pillars__icon"
                    src={pillar.icon}
                    alt=""
                    aria-hidden="true"
                    width={pillar.iconWidth}
                    height={pillar.iconHeight}
                  />
                </div>
                <h3 className="csr-pillars__card-title">{pillar.title}</h3>
                <p className="csr-pillars__card-description">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramPillarsSection;
