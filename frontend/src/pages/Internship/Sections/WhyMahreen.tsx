import {
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  CircleCheck,
  Network,
  Rocket,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

type BenefitItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type HighlightCard = {
  title: string;
  icon: LucideIcon;
};

type AnimatedStyle = CSSProperties & {
  "--reveal-delay": string;
};

const benefits: BenefitItem[] = [
  {
    title: "Real Project Experience",
    description:
      "Terlibat langsung dalam penanganan proyek klien nyata yang memberikan wawasan industri sesungguhnya.",
    icon: CircleCheck,
  },
  {
    title: "Professional Mentors",
    description:
      "Dibimbing oleh praktisi ahli yang telah berpengalaman bertahun-tahun di bidangnya masing-masing.",
    icon: UsersRound,
  },
  {
    title: "Industry Portfolio",
    description:
      "Bangun portofolio yang mengesankan untuk menarik perhatian rekruter di perusahaan ternama.",
    icon: BriefcaseBusiness,
  },
];

const highlightCards: HighlightCard[] = [
  {
    title: "Official Certificate",
    icon: Award,
  },
  {
    title: "Elite Networking",
    icon: Network,
  },
  {
    title: "Career Prep",
    icon: Rocket,
  },
  {
    title: "Growth Mindset",
    icon: BrainCircuit,
  },
];

const mengapaMahreenStyles = `
  .mengapa-mahreen {
    width: 100%;
    overflow: hidden;
    padding: 58px 34px 74px;
    background: #050505;
    color: #ffffff;
  }

  .mengapa-mahreen,
  .mengapa-mahreen *,
  .mengapa-mahreen *::before,
  .mengapa-mahreen *::after {
    box-sizing: border-box;
  }

  .mengapa-mahreen__inner {
    width: min(100%, 1300px);
    display: grid;
    grid-template-columns: minmax(0, 650px) minmax(0, 520px);
    align-items: start;
    justify-content: space-between;
    gap: 100px;
    margin: 0 auto;
  }

  .mengapa-mahreen__left {
    min-width: 0;
    padding-top: 3px;
  }

  .mengapa-mahreen__title {
    margin: 0;
    color: #f4efe7;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(44px, 3.7vw, 52px);
    font-weight: 700;
    line-height: 1.03;
    letter-spacing: -0.04em;
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  .mengapa-mahreen.is-visible .mengapa-mahreen__title {
    animation: mengapaMahreenFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1)
      70ms both;
  }

  .mengapa-mahreen__benefits {
    display: grid;
    gap: 39px;
    margin-top: 34px;
  }

  .mengapa-mahreen__benefit {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    align-items: start;
    gap: 24px;
    opacity: 0;
    transform: translate3d(0, 16px, 0);
  }

  .mengapa-mahreen.is-visible .mengapa-mahreen__benefit {
    animation: mengapaMahreenFadeUp 560ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--reveal-delay) both;
  }

  .mengapa-mahreen__benefit-icon-box {
    width: 52px;
    height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #19170f;
    color: #e6c574;
  }

  .mengapa-mahreen__benefit-icon {
    width: 21px;
    height: 21px;
    stroke-width: 1.9;
  }

  .mengapa-mahreen__benefit-content {
    min-width: 0;
    padding-top: 1px;
  }

  .mengapa-mahreen__benefit-title {
    margin: 0;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 23px;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .mengapa-mahreen__benefit-description {
    max-width: 540px;
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.58);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.52;
  }

  .mengapa-mahreen__cards {
    width: 520px;
    display: grid;
    grid-template-columns: repeat(2, 248px);
    justify-content: space-between;
    gap: 24px;
  }

  .mengapa-mahreen__card-column {
    display: grid;
    align-content: start;
    gap: 28px;
  }

  .mengapa-mahreen__card-column--offset {
    gap: 58px;
    padding-top: 32px;
  }

  .mengapa-mahreen__card {
    min-height: 194px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 28px 22px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 13px;
    background: #141414;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
    text-align: center;
    opacity: 0;
    transform: translate3d(0, 18px, 0) scale(0.985);
    transition:
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  .mengapa-mahreen__card-column--offset .mengapa-mahreen__card {
    min-height: 164px;
  }

  .mengapa-mahreen.is-visible .mengapa-mahreen__card {
    animation: mengapaMahreenCardEnter 600ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--reveal-delay) both;
  }

  .mengapa-mahreen__card:hover,
  .mengapa-mahreen__card:focus-within {
    background: #161616;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.025),
      0 0 28px rgba(229, 196, 117, 0.06);
  }

  .mengapa-mahreen__card-icon {
    width: 48px;
    height: 48px;
    color: #e7c879;
    stroke-width: 1.75;
    filter: drop-shadow(0 0 0 rgba(231, 200, 121, 0));
    transition:
      color 180ms ease,
      filter 180ms ease;
  }

  .mengapa-mahreen__card:hover .mengapa-mahreen__card-icon {
    color: #f0d58e;
    filter: drop-shadow(0 0 11px rgba(231, 200, 121, 0.24));
  }

  .mengapa-mahreen__card-title {
    margin: 0;
    color: rgba(255, 255, 255, 0.96);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.22;
  }

  @keyframes mengapaMahreenFadeUp {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes mengapaMahreenCardEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0) scale(0.985);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (max-width: 1180px) {
    .mengapa-mahreen {
      padding-inline: 28px;
    }

    .mengapa-mahreen__inner {
      grid-template-columns: minmax(0, 1fr) minmax(460px, 0.9fr);
      gap: 56px;
    }

    .mengapa-mahreen__cards {
      width: 100%;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }
  }

  @media (max-width: 960px) {
    .mengapa-mahreen {
      padding: 54px 28px 60px;
    }

    .mengapa-mahreen__inner {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .mengapa-mahreen__benefit-description {
      max-width: 690px;
    }

    .mengapa-mahreen__cards {
      width: min(100%, 650px);
      margin: 0 auto;
    }
  }

  @media (max-width: 620px) {
    .mengapa-mahreen {
      padding: 44px 16px 50px;
    }

    .mengapa-mahreen__title {
      font-size: 36px;
    }

    .mengapa-mahreen__benefits {
      gap: 28px;
      margin-top: 28px;
    }

    .mengapa-mahreen__benefit {
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 16px;
    }

    .mengapa-mahreen__benefit-icon-box {
      width: 42px;
      height: 42px;
    }

    .mengapa-mahreen__benefit-icon {
      width: 18px;
      height: 18px;
    }

    .mengapa-mahreen__benefit-title {
      font-size: 18px;
    }

    .mengapa-mahreen__benefit-description {
      font-size: 14px;
    }

    .mengapa-mahreen__cards {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .mengapa-mahreen__card-column,
    .mengapa-mahreen__card-column--offset {
      gap: 16px;
      padding-top: 0;
    }

    .mengapa-mahreen__card,
    .mengapa-mahreen__card-column--offset .mengapa-mahreen__card {
      min-height: 158px;
    }

    .mengapa-mahreen__card-icon {
      width: 42px;
      height: 42px;
    }

    .mengapa-mahreen__card-title {
      font-size: 17px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mengapa-mahreen__title,
    .mengapa-mahreen__benefit,
    .mengapa-mahreen__card,
    .mengapa-mahreen.is-visible .mengapa-mahreen__title,
    .mengapa-mahreen.is-visible .mengapa-mahreen__benefit,
    .mengapa-mahreen.is-visible .mengapa-mahreen__card {
      opacity: 1;
      transform: none;
      animation: none;
    }

    .mengapa-mahreen__card,
    .mengapa-mahreen__card-icon {
      transition: none;
    }
  }
`;

const MengapaMahreen = () => {
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
        threshold: 0.16,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const leftCards = highlightCards.filter((_, index) => index % 2 === 0);
  const rightCards = highlightCards.filter((_, index) => index % 2 !== 0);

  return (
    <section
      id="mengapa-mahreen"
      ref={sectionRef}
      className="mengapa-mahreen"
      aria-labelledby="mengapa-mahreen-title"
    >
      <style data-component="mengapa-mahreen">
        {mengapaMahreenStyles}
      </style>

      <div className="mengapa-mahreen__inner">
        <div className="mengapa-mahreen__left">
          <h2
            className="mengapa-mahreen__title"
            id="mengapa-mahreen-title"
          >
            Mengapa Mahreen?
          </h2>

          <div className="mengapa-mahreen__benefits">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <article
                  className="mengapa-mahreen__benefit"
                  key={benefit.title}
                  style={
                    {
                      "--reveal-delay": `${150 + index * 90}ms`,
                    } as AnimatedStyle
                  }
                >
                  <span
                    className="mengapa-mahreen__benefit-icon-box"
                    aria-hidden="true"
                  >
                    <Icon className="mengapa-mahreen__benefit-icon" />
                  </span>

                  <div className="mengapa-mahreen__benefit-content">
                    <h3 className="mengapa-mahreen__benefit-title">
                      {benefit.title}
                    </h3>
                    <p className="mengapa-mahreen__benefit-description">
                      {benefit.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="mengapa-mahreen__cards"
          aria-label="Keunggulan program Mahreen"
        >
          <div className="mengapa-mahreen__card-column">
            {leftCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <article
                  className="mengapa-mahreen__card"
                  key={card.title}
                  style={
                    {
                      "--reveal-delay": `${170 + index * 150}ms`,
                    } as AnimatedStyle
                  }
                >
                  <Icon
                    className="mengapa-mahreen__card-icon"
                    aria-hidden="true"
                  />
                  <h3 className="mengapa-mahreen__card-title">
                    {card.title}
                  </h3>
                </article>
              );
            })}
          </div>

          <div className="mengapa-mahreen__card-column mengapa-mahreen__card-column--offset">
            {rightCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <article
                  className="mengapa-mahreen__card"
                  key={card.title}
                  style={
                    {
                      "--reveal-delay": `${245 + index * 150}ms`,
                    } as AnimatedStyle
                  }
                >
                  <Icon
                    className="mengapa-mahreen__card-icon"
                    aria-hidden="true"
                  />
                  <h3 className="mengapa-mahreen__card-title">
                    {card.title}
                  </h3>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MengapaMahreen;
