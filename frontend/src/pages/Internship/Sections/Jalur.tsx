import {
  BadgeHelp,
  DraftingCompass,
  GraduationCap,
  MonitorPlay,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

type ProgramItem = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

type ProgramStyle = CSSProperties & {
  "--program-delay": string;
};

const programs: ProgramItem[] = [
  {
    number: "01",
    title: "Internship",
    description:
      "Program magang intensif selama 3 bulan dengan penugasan pada proyek klien nyata.",
    icon: GraduationCap,
    href: "/internship/form?program=internship",
  },
  {
    number: "02",
    title: "Bootcamp",
    description:
      "Pelatihan intensif teknis untuk menguasai skill digital dari nol hingga mahir.",
    icon: MonitorPlay,
    href: "/internship/form?program=bootcamp",
  },
  {
    number: "03",
    title: "Workshop",
    description:
      "Sesi praktik langsung satu hari bersama pakar industri untuk skill spesifik.",
    icon: DraftingCompass,
    href: "/internship/form?program=workshop",
  },
  {
    number: "04",
    title: "Seminar",
    description:
      "Sesi inspiratif membahas tren industri dan masa depan ekonomi kreatif.",
    icon: UsersRound,
    href: "/internship/form?program=seminar",
  },
  {
    number: "05",
    title: "Webinar",
    description:
      "Sesi diskusi online interaktif yang dapat diakses dari mana saja.",
    icon: Video,
    href: "/internship/form?program=webinar",
  },
  {
    number: "06",
    title: "Mentoring",
    description:
      "Pendampingan 1-on-1 bersama profesional untuk bimbingan karir personal.",
    icon: BadgeHelp,
    href: "/internship/form?program=mentoring",
  },
];

const jalurStyles = `
  .jalur-section {
    width: 100%;
    overflow: hidden;
    padding: 42px 56px 58px;
    background: #050505;
    color: #ffffff;
  }

  .jalur-section,
  .jalur-section *,
  .jalur-section *::before,
  .jalur-section *::after {
    box-sizing: border-box;
  }

  .jalur-section__inner {
    width: min(100%, 1320px);
    margin: 0 auto;
  }

  .jalur-section__header {
    position: relative;
    min-height: 132px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 30px;
  }

  .jalur-section__heading {
    position: relative;
    z-index: 1;
    max-width: 680px;
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  .jalur-section.is-visible .jalur-section__heading {
    animation: jalurFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
  }

  .jalur-section__title {
    margin: 0;
    color: #f4efe7;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(38px, 3.2vw, 50px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: -0.04em;
  }

  .jalur-section__description {
    max-width: 650px;
    margin: 14px 0 0;
    color: rgba(255, 255, 255, 0.62);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: clamp(14px, 1.05vw, 16px);
    font-weight: 400;
    line-height: 1.55;
  }

  .jalur-section__watermark {
    position: absolute;
    top: 25px;
    right: 0;
    margin: 0;
    color: rgba(230, 194, 119, 0.085);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: clamp(70px, 7vw, 108px);
    font-weight: 300;
    line-height: 0.88;
    letter-spacing: -0.055em;
    text-transform: uppercase;
    user-select: none;
    pointer-events: none;
    opacity: 0;
  }

  .jalur-section.is-visible .jalur-section__watermark {
    animation: jalurWatermarkEnter 760ms ease-out 140ms both;
  }

  .jalur-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }

  .jalur-card {
    position: relative;
    min-height: 276px;
    display: flex;
    flex-direction: column;
    padding: 32px 32px 28px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    background: #131313;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
    opacity: 0;
    transform: translate3d(0, 16px, 0) scale(0.988);
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  .jalur-section.is-visible .jalur-card {
    animation: jalurCardEnter 540ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--program-delay) both;
  }

  .jalur-card:hover,
  .jalur-card:focus-within {
    transform: translateY(-3px);
    border-color: rgba(231, 198, 127, 0.31);
    background: #151515;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
  }

  .jalur-card:active {
    transform: scale(0.989);
  }

  .jalur-card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  .jalur-card__number {
    margin: 0;
    color: rgba(231, 198, 127, 0.62);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 30px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.025em;
  }

  .jalur-card__icon {
    width: 30px;
    height: 30px;
    color: #e6c276;
    stroke-width: 1.9;
    transition: transform 180ms ease;
  }

  .jalur-card:hover .jalur-card__icon,
  .jalur-card:focus-within .jalur-card__icon {
    transform: scale(1.08);
  }

  .jalur-card__title {
    margin: 32px 0 0;
    color: rgba(255, 255, 255, 0.92);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.2;
  }

  .jalur-card__description {
    min-height: 66px;
    margin: 15px 0 0;
    color: rgba(255, 255, 255, 0.57);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.52;
  }

  .jalur-card__link {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    padding-top: 18px;
    color: #d9b870;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    text-decoration: none;
    transition:
      color 180ms ease,
      transform 180ms ease;
  }

  .jalur-card__link-arrow {
    display: inline-block;
    transition: transform 180ms ease;
  }

  .jalur-card__link:hover,
  .jalur-card__link:focus-visible {
    color: #f0d391;
    outline: none;
  }

  .jalur-card__link:hover .jalur-card__link-arrow,
  .jalur-card__link:focus-visible .jalur-card__link-arrow {
    transform: translateX(4px);
  }

  @keyframes jalurFadeUp {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes jalurWatermarkEnter {
    from {
      opacity: 0;
      transform: translate3d(22px, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes jalurCardEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 16px, 0) scale(0.988);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (max-width: 1100px) {
    .jalur-section {
      padding-inline: 36px;
    }

    .jalur-section__watermark {
      font-size: 76px;
    }

    .jalur-grid {
      gap: 20px;
    }

    .jalur-card {
      min-height: 260px;
      padding: 28px 26px 25px;
    }
  }

  @media (max-width: 900px) {
    .jalur-section {
      padding: 44px 28px 52px;
    }

    .jalur-section__header {
      min-height: 118px;
    }

    .jalur-section__watermark {
      top: 20px;
      font-size: 62px;
    }

    .jalur-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .jalur-section {
      padding: 40px 16px 48px;
    }

    .jalur-section__header {
      min-height: auto;
      margin-bottom: 28px;
    }

    .jalur-section__title {
      font-size: 34px;
    }

    .jalur-section__description {
      font-size: 14px;
    }

    .jalur-section__watermark {
      display: none;
    }

    .jalur-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .jalur-card {
      min-height: 248px;
      padding: 28px 24px 24px;
    }

    .jalur-card__number {
      font-size: 28px;
    }

    .jalur-card__icon {
      width: 28px;
      height: 28px;
    }

    .jalur-card__title {
      margin-top: 28px;
      font-size: 16px;
    }

    .jalur-card__description {
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .jalur-section__heading,
    .jalur-section__watermark,
    .jalur-card,
    .jalur-section.is-visible .jalur-section__heading,
    .jalur-section.is-visible .jalur-section__watermark,
    .jalur-section.is-visible .jalur-card {
      opacity: 1;
      transform: none;
      animation: none;
    }

    .jalur-card,
    .jalur-card__icon,
    .jalur-card__link,
    .jalur-card__link-arrow {
      transition: none;
    }
  }
`;

const Jalur = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        section.classList.add("is-visible");
        observer.disconnect();
      },
      {
        threshold: 0.13,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="jalur-program"
      ref={sectionRef}
      className="jalur-section"
      aria-labelledby="jalur-title"
    >
      <style data-component="jalur-section">{jalurStyles}</style>

      <div className="jalur-section__inner">
        <header className="jalur-section__header">
          <div className="jalur-section__heading">
            <h2 className="jalur-section__title" id="jalur-title">
              Pilih Jalur Akselerasimu
            </h2>

            <p className="jalur-section__description">
              Kurikulum yang dirancang untuk menjembatani kesenjangan antara
              pendidikan akademis dan kebutuhan industri kreatif saat ini.
            </p>
          </div>

          <p className="jalur-section__watermark" aria-hidden="true">
            Programs
          </p>
        </header>

        <div className="jalur-grid">
          {programs.map((program, index) => {
            const Icon = program.icon;

            return (
              <article
                className="jalur-card"
                key={program.number}
                style={
                  {
                    "--program-delay": `${140 + index * 65}ms`,
                  } as ProgramStyle
                }
              >
                <div className="jalur-card__top">
                  <p className="jalur-card__number">{program.number}</p>
                  <Icon className="jalur-card__icon" aria-hidden="true" />
                </div>

                <h3 className="jalur-card__title">{program.title}</h3>
                <p className="jalur-card__description">
                  {program.description}
                </p>

                <a className="jalur-card__link" href={program.href}>
                  Pelajari Lebih Lanjut
                  <span className="jalur-card__link-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Jalur;
