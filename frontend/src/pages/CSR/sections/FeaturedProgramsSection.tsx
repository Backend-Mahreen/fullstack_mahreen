import reboisasiImage from "../../../assets/CSR/gambar-reboisasi-mahreen.webp";
import learningCenterImage from "../../../assets/CSR/gambar-mahreen-learning-center.webp";

type ProgramCard = {
  status: string;
  region: string;
  title: string;
  description: string;
  image: string;
  progressLabel: string;
  progressValue: string;
  progressPercent: number;
  contributors: string;
  contributorTags: string[];
};

const programs: ProgramCard[] = [
  {
    status: "ON PROGRESS",
    region: "JAWA BARAT",
    title: "Reboisasi Mahreen 2024",
    description:
      "Restorasi ekosistem hutan lindung melalui penanaman 10,000 pohon endemik bersama komunitas lokal.",
    image: reboisasiImage,
    progressLabel: "TARGET CAPAIAN",
    progressValue: "75%",
    progressPercent: 75,
    contributors: "520 Kontributor",
    contributorTags: ["AG", "MS", "+12"],
  },
  {
    status: "ACTIVE",
    region: "JAKARTA",
    title: "Mahreen Learning Center",
    description:
      "Pusat pelatihan literasi digital dan kreatif bagi anak-anak di wilayah rural untuk kesetaraan peluang.",
    image: learningCenterImage,
    progressLabel: "TARGET CAPAIAN",
    progressValue: "90%",
    progressPercent: 90,
    contributors: "1,200 Siswa Terdaftar",
    contributorTags: ["LC", "KT", "+4"],
  },
];

const featuredProgramsStyles = `

  .csr-featured-programs {
    width: 100%;
    background: #000000;
    color: #e5e2e1;
  }

  .csr-featured-programs__outer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 40px 56px;
    box-sizing: border-box;
  }

  .csr-featured-programs__container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .csr-featured-programs__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  .csr-featured-programs__heading {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .csr-featured-programs__eyebrow {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 1.6px;
    color: #E5C483;
  }

  .csr-featured-programs__title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 48px;
    letter-spacing: -0.4px;
    color: #E5E2E1;
  }

  .csr-featured-programs__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 36px;
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #E5C483;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }

  .csr-featured-programs__link:hover {
    opacity: 0.85;
  }

  .csr-featured-programs__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .csr-featured-programs__card {
    overflow: hidden;
    border-radius: 6px;
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
    display: block;
    text-decoration: none;
    transition: transform 0.3s ease;
  }

  .csr-featured-programs__card:hover {
    transform: translateY(-4px);
  }

  .csr-featured-programs__media {
    position: relative;
    aspect-ratio: 1.707 / 1;
    overflow: hidden;
    background: #1a1a1a;
  }

  .csr-featured-programs__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  .csr-featured-programs__chips {
    position: absolute;
    top: 14px;
    left: 14px;
    display: flex;
    gap: 8px;
    z-index: 1;
  }

  .csr-featured-programs__chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 21px;
    padding: 0 12px;
    border-radius: 999px;
    background: rgba(82, 78, 72, 0.82);
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.4px;
    color: #d7ccb9;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
  }

  .csr-featured-programs__content {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 32px 32px 28px;
  }

  .csr-featured-programs__card-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    color: #E5C483;
  }

  .csr-featured-programs__card-description {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 29px;
    color: #D0C5B5;
  }

  .csr-featured-programs__progress {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .csr-featured-programs__progress-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .csr-featured-programs__progress-label,
  .csr-featured-programs__progress-value {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.8px;
    color: #9f9484;
    text-transform: uppercase;
  }

  .csr-featured-programs__progress-track {
    position: relative;
    width: 100%;
    height: 4px;
    background: #232323;
    border-radius: 999px;
    overflow: hidden;
  }

  .csr-featured-programs__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d7be89 0%, #ecd39c 100%);
    border-radius: inherit;
  }

  .csr-featured-programs__footer {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .csr-featured-programs__avatar-group {
    display: flex;
    align-items: center;
  }

  .csr-featured-programs__avatar,
  .csr-featured-programs__avatar-more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-left: -6px;
    border-radius: 999px;
    background: #313131;
    border: 1px solid rgba(255, 255, 255, 0.03);
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    color: #d6d6d6;
  }

  .csr-featured-programs__avatar:first-child {
    margin-left: 0;
  }

  .csr-featured-programs__contributors {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    color: #b2a899;
  }

  @media (max-width: 1024px) {
    .csr-featured-programs__outer {
      padding: 40px 24px 48px;
    }

    .csr-featured-programs__title {
      font-size: 34px;
      line-height: 42px;
    }

    .csr-featured-programs__card-description {
      font-size: 16px;
      line-height: 26px;
    }
  }

  @media (max-width: 820px) {
    .csr-featured-programs__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .csr-featured-programs__link {
      margin-top: 0;
    }

    .csr-featured-programs__cards {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .csr-featured-programs__outer {
      padding: 32px 18px 40px;
    }

    .csr-featured-programs__container {
      gap: 24px;
    }

    .csr-featured-programs__eyebrow {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 1.3px;
    }

    .csr-featured-programs__title {
      font-size: 28px;
      line-height: 34px;
    }

    .csr-featured-programs__link {
      font-size: 14px;
      line-height: 20px;
    }

    .csr-featured-programs__content {
      padding: 24px 18px 20px;
      gap: 14px;
    }

    .csr-featured-programs__card-title {
      font-size: 18px;
      line-height: 24px;
    }

    .csr-featured-programs__card-description {
      font-size: 15px;
      line-height: 24px;
    }

    .csr-featured-programs__chips {
      top: 12px;
      left: 12px;
    }
  }
`;

const FeaturedProgramsSection = () => {
  return (
    <section
      className="csr-featured-programs"
      aria-labelledby="csr-featured-programs-title"
    >
      <style data-component="csr-featured-programs">
        {featuredProgramsStyles}
      </style>

      <div className="csr-featured-programs__outer">
        <div className="csr-featured-programs__container">
          <header className="csr-featured-programs__header">
            <div className="csr-featured-programs__heading">
              <p className="csr-featured-programs__eyebrow">
                FEATURED INITIATIVE
              </p>
              <h2
                className="csr-featured-programs__title"
                id="csr-featured-programs-title"
              >
                Program Unggulan
              </h2>
            </div>

          </header>

          <div className="csr-featured-programs__cards" id="program-unggulan">
            {programs.map((program) => (
              <a
                href="/mahreen-csr/program-objective"
                className="csr-featured-programs__card"
                key={program.title}
              >
                <div className="csr-featured-programs__media">
                  <div
                    className="csr-featured-programs__chips"
                    aria-hidden="true"
                  >
                    <span className="csr-featured-programs__chip">
                      {program.status}
                    </span>
                    <span className="csr-featured-programs__chip">
                      {program.region}
                    </span>
                  </div>

                  <img width="1200" height="800" decoding="async" loading="lazy"
                    className="csr-featured-programs__image"
                    src={program.image}
                    alt={program.title}
                  />
                </div>

                <div className="csr-featured-programs__content">
                  <h3 className="csr-featured-programs__card-title">
                    {program.title}
                  </h3>
                  <p className="csr-featured-programs__card-description">
                    {program.description}
                  </p>

                  <div className="csr-featured-programs__progress">
                    <div className="csr-featured-programs__progress-head">
                      <p className="csr-featured-programs__progress-label">
                        {program.progressLabel}
                      </p>
                      <p className="csr-featured-programs__progress-value">
                        {program.progressValue}
                      </p>
                    </div>

                    <div
                      className="csr-featured-programs__progress-track"
                      aria-hidden="true"
                    >
                      <div
                        className="csr-featured-programs__progress-fill"
                        style={{ width: `${program.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="csr-featured-programs__footer">
                    <div
                      className="csr-featured-programs__avatar-group"
                      aria-hidden="true"
                    >
                      {program.contributorTags.map((tag) => (
                        <span
                          className="csr-featured-programs__avatar"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="csr-featured-programs__contributors">
                      {program.contributors}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProgramsSection;
