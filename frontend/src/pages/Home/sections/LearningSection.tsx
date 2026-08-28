import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import bootcampIcon from "../../../assets/LearningSection/Bootcamp.svg";
import workshopIcon from "../../../assets/LearningSection/Workshop.svg";
import certificationIcon from "../../../assets/LearningSection/Certification.svg";
import tickIcon from "../../../assets/LearningSection/tick-icon.svg";

type FeatureItem = {
  label: string;
};

type LearningCard = {
  id: string;
  title: string;
  description: string;
  features: FeatureItem[];
  buttonLabel: string;
  icon: string;
  iconAlt: string;
};

const learningCards: LearningCard[] = [
  {
    id: "bootcamp",
    title: "Bootcamp",
    description:
      "Program intensif 12 minggu yang dirancang untuk mengubah pemula menjadi profesional yang siap kerja.",
    features: [
      { label: "Kurikulum Berbasis Industri" },
      { label: "Proyek Dunia Nyata" },
    ],
    buttonLabel: "Daftar Sekarang",
    icon: bootcampIcon,
    iconAlt: "Ikon Bootcamp",
  },
  {
    id: "workshop",
    title: "Workshop",
    description:
      "Sesi berbasis keterampilan praktis yang fokus pada penguasaan alat dan metodologi spesifik.",
    features: [
      { label: "Sesi Intensif 1-2 Hari" },
      { label: "Latihan Langsung (Hands-on)" },
    ],
    buttonLabel: "Lihat Jadwal",
    icon: workshopIcon,
    iconAlt: "Ikon Workshop",
  },
  {
    id: "certification",
    title: "Certification",
    description:
      "Validasi keahlian Anda dengan sertifikasi yang diakui dari jaringan mitra strategis kami.",
    features: [
      { label: "Standar Global" },
      { label: "Kredensial Terverifikasi" },
    ],
    buttonLabel: "Pelajari Lebih Lanjut",
    icon: certificationIcon,
    iconAlt: "Ikon Certification",
  },
];

const learningStyles = `
  .learning-section {
    width: 100%;
    background: #050505;
    padding: 40px 24px 64px;
  }

  .learning-section,
  .learning-section *,
  .learning-section *::before,
  .learning-section *::after {
    box-sizing: border-box;
  }

  .learning-section__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .learning-section__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 28px;
    margin: 0 0 82px;
  }

  .learning-section__intro {
    max-width: 590px;
  }

  .learning-section__title {
    margin: 0 0 10px;
    color: #d7b777;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(36px, 3.5vw, 52px);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.01em;
  }

  .learning-section__subtitle {
    max-width: 570px;
    margin: 0;
    color: rgba(255, 255, 255, 0.62);
    font-family: "Inter", Arial, sans-serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.45;
  }

  .learning-section__catalog-button {
    min-width: 220px;
    margin-top: 58px;
    padding: 18px 30px;
    border: 1px solid #f0cb82;
    border-radius: 999px;
    background: #f0cb82;
    color: #080808;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    text-decoration: none;
    white-space: nowrap;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease;
  }

  .learning-section__catalog-button:hover,
  .learning-section__catalog-button:focus-visible {
    background: #f6d793;
    border-color: #f6d793;
    transform: translateY(-1px);
  }

  .learning-section__catalog-button:focus-visible {
    outline: 3px solid rgba(240, 203, 130, 0.35);
    outline-offset: 4px;
  }

  .learning-section__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 30px;
  }

  .learning-card {
    min-height: 388px;
    padding: 36px 36px 30px;
    background: #101010;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #ffffff;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .learning-card:hover {
    background-color: #121212;
    border-color: rgba(240, 203, 130, 0.18);
    transform: translateY(-2px);
  }

  .learning-card__icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: rgba(240, 203, 130, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .learning-card__icon {
    width: 28px;
    height: 28px;
    display: block;
    object-fit: contain;
  }

  .learning-card__title {
    margin: 36px 0 0;
    color: #f4f2ed;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 30px;
    font-weight: 400;
    line-height: 1.16;
  }

  .learning-card__description {
    min-height: 86px;
    margin: 24px 0 0;
    color: rgba(255, 255, 255, 0.56);
    font-family: "Inter", Arial, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.65;
  }

  .learning-card__features {
    width: 100%;
    margin: 28px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    list-style: none;
  }

  .learning-card__feature {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.68);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.45;
  }

  .learning-card__tick {
    width: 18px;
    height: 18px;
    display: block;
    flex: 0 0 auto;
  }

  .learning-card__button {
    width: 100%;
    margin-top: auto;
    padding: 17px 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    background: transparent;
    color: rgba(255, 255, 255, 0.82);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    text-decoration: none;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .learning-card__button:hover,
  .learning-card__button:focus-visible {
    background-color: #f0cb82;
    border-color: #f0cb82;
    color: #050505;
    transform: translateY(-1px);
  }

  .learning-card__button:focus-visible {
    outline: 3px solid rgba(240, 203, 130, 0.35);
    outline-offset: 4px;
  }

  .learning-section [data-scroll-reveal] {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  .learning-section.is-reveal-ready [data-scroll-reveal] {
    transition:
      opacity 0.6s ease,
      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .learning-section.is-reveal-ready [data-scroll-reveal]:not(.is-visible) {
    opacity: 0;
    transform: translateY(22px);
  }

  .learning-section__header[data-scroll-reveal] {
    transition-delay: 80ms;
  }

  .learning-card[data-scroll-reveal] {
    transition-delay: var(--reveal-delay, 0ms);
  }

  @media (max-width: 980px) {
    .learning-section {
      padding: 48px 20px 64px;
    }

    .learning-section__container {
      max-width: 760px;
    }

    .learning-section__header {
      margin-bottom: 42px;
    }

    .learning-section__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .learning-card {
      min-height: 360px;
      padding: 32px 30px 28px;
    }

    .learning-card__title {
      font-size: 27px;
    }

    .learning-card__description {
      font-size: 14px;
    }
  }

  @media (max-width: 560px) {
    .learning-section {
      padding: 42px 16px 58px;
    }

    .learning-section__header {
      flex-direction: column;
      gap: 22px;
      margin-bottom: 34px;
    }

    .learning-section__catalog-button {
      width: 100%;
      margin-top: 0;
    }

    .learning-section__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .learning-card {
      min-height: auto;
      padding: 24px 20px 20px;
    }

    .learning-card__title {
      font-size: 21px;
    }

    .learning-card__description {
      min-height: 0;
    }

    .learning-card__button {
      margin-top: 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .learning-card,
    .learning-card:hover,
    .learning-card__button,
    .learning-card__button:hover,
    .learning-card__button:focus-visible,
    .learning-section [data-scroll-reveal] {
      transform: none;
      transition: none;
    }

    .learning-section [data-scroll-reveal] {
      opacity: 1;
    }
  }
`;

const LearningSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const revealElements = section.querySelectorAll<HTMLElement>(
      "[data-scroll-reveal]"
    );

    if (typeof IntersectionObserver === "undefined") {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    section.classList.add("is-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      section.classList.remove("is-reveal-ready");
    };
  }, []);

  return (
    <>
      <style data-component="learning-section">{learningStyles}</style>

      <section
        className="learning-section"
        id="learning"
        ref={sectionRef}
        aria-labelledby="learning-title"
      >
        <div className="learning-section__container">
          <div className="learning-section__header" data-scroll-reveal>
            <div className="learning-section__intro">
              <h2 className="learning-section__title" id="learning-title">
                Mahreen Learning
              </h2>
              <p className="learning-section__subtitle">
                Akselerasi karier Anda melalui platform pendidikan dan bimbingan
                terstruktur kami yang berstandar profesional.
              </p>
            </div>

            <a className="learning-section__catalog-button" href="/internship">
              Lihat Katalog Kelas
            </a>
          </div>

          <div className="learning-section__grid">
            {learningCards.map((item, index) => (
              <article
                className="learning-card"
                key={item.id}
                data-scroll-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <div className="learning-card__icon-wrapper">
                  <img width="96" height="96"
                    className="learning-card__icon"
                    src={item.icon}
                    alt={item.iconAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <h3 className="learning-card__title">{item.title}</h3>
                <p className="learning-card__description">{item.description}</p>

                <ul className="learning-card__features">
                  {item.features.map((feature) => (
                    <li className="learning-card__feature" key={feature.label}>
                      <img width="20" height="20"
                        className="learning-card__tick"
                        src={tickIcon}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                      />
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <a className="learning-card__button" href={`/internship?program=${item.id}`}>
                  {item.buttonLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LearningSection;
