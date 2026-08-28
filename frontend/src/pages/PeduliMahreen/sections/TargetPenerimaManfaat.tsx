import { useEffect } from "react";


const useLiteReveal = (selector: string) => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector]);
};

const targetPenerimaManfaatStyles = `
  .peduli-benefit {
    width: 100%;
    background: #060909;
    padding: clamp(76px, 8vw, 112px) 28px clamp(72px, 7vw, 104px);
    color: var(--peduli-text, #f6f1e8);
  }

  .peduli-benefit,
  .peduli-benefit *,
  .peduli-benefit *::before,
  .peduli-benefit *::after {
    box-sizing: border-box;
  }

  .peduli-benefit__inner {
    width: min(100%, 1210px);
    margin: 0 auto;
  }

  .peduli-benefit__header {
    text-align: center;
  }

  .peduli-benefit__eyebrow {
    margin: 0 0 18px;
    color: var(--peduli-gold, #d3ad6d);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 2.7px;
    text-transform: uppercase;
  }

  .peduli-benefit__title {
    margin: 0;
    color: #f4efe8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 3.9vw, 54px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.052em;
  }

  .peduli-benefit__grid {
    margin-top: clamp(58px, 6.8vw, 92px);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(26px, 6vw, 92px);
    align-items: start;
  }

  .peduli-benefit__item {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .peduli-benefit__icon-box {
    width: 86px;
    height: 86px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.055);
    border: 1px solid rgba(255, 255, 255, 0.085);
    box-shadow: inset 0 0 0 1px rgba(211, 173, 109, 0.025);
  }

  .peduli-benefit__icon-box svg {
    width: 28px;
    height: 28px;
    color: var(--peduli-gold, #d3ad6d);
  }

  .peduli-benefit__number {
    margin: 44px 0 0;
    color: #f5efe3;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(24px, 2vw, 32px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.036em;
  }

  .peduli-benefit__description {
    max-width: 326px;
    margin: 24px auto 0;
    color: rgba(255, 255, 255, 0.72);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.74;
    letter-spacing: -0.01em;
  }



  [data-lite-reveal] {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
    transition:
      opacity 560ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }

  [data-lite-reveal="left"] {
    transform: translate3d(-22px, 0, 0);
  }

  [data-lite-reveal="right"] {
    transform: translate3d(22px, 0, 0);
  }

  [data-lite-reveal="fade"] {
    transform: none;
  }

  [data-lite-reveal].is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    will-change: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-lite-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
      will-change: auto;
    }
  }

  @media (max-width: 920px) {
    .peduli-benefit__grid {
      grid-template-columns: 1fr;
      gap: 58px;
    }

    .peduli-benefit__description {
      max-width: 420px;
    }

    .peduli-benefit__number {
      margin-top: 28px;
    }
  }

  @media (max-width: 560px) {
    .peduli-benefit {
      padding-inline: 20px;
    }

    .peduli-benefit__eyebrow {
      font-size: 14px;
      letter-spacing: 2.2px;
    }

    .peduli-benefit__icon-box {
      width: 72px;
      height: 72px;
    }

    .peduli-benefit__icon-box svg {
      width: 24px;
      height: 24px;
    }

    .peduli-benefit__description {
      font-size: 14px;
      line-height: 1.7;
    }
  }
`;

type BenefitIcon = "student" | "school" | "mentor";

const benefits: Array<{
  icon: BenefitIcon;
  number: string;
  description: string;
}> = [
  {
    icon: "student",
    number: "500+ Siswa",
    description:
      "Anak-anak usia sekolah dasar dari keluarga dengan latar belakang ekonomi rendah.",
  },
  {
    icon: "school",
    number: "15 Sekolah",
    description:
      "Sekolah dasar negeri dan madrasah di wilayah penyangga operasional Mahreen.",
  },
  {
    icon: "mentor",
    number: "50 Mentor",
    description:
      "Tenaga profesional yang berkomitmen meluangkan waktu untuk berbagi pengalaman.",
  },
];

const BenefitIcon = ({ icon }: { icon: BenefitIcon }) => {
  if (icon === "school") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M4.5 12.4L16 6.7L27.5 12.4L16 18.1L4.5 12.4Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 15.2V21.1C9.5 21.1 12 24 16 24C20 24 22.5 21.1 22.5 21.1V15.2"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27.5 12.5V20.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "mentor") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="8.5" cy="13.2" r="2.8" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="23.5" cy="13.2" r="2.8" stroke="currentColor" strokeWidth="1.9" />
        <path
          d="M10.4 24.5C11.3 21.8 13.2 20.4 16 20.4C18.8 20.4 20.7 21.8 21.6 24.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M4.4 23.2C5.1 20.9 6.6 19.7 8.8 19.7C10 19.7 11 20.1 11.8 20.8"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M27.6 23.2C26.9 20.9 25.4 19.7 23.2 19.7C22 19.7 21 20.1 20.2 20.8"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="9.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12.5" cy="13.8" r="1.25" fill="currentColor" />
      <circle cx="19.5" cy="13.8" r="1.25" fill="currentColor" />
      <path
        d="M11.6 18.1C12.7 20.2 14 21.1 16 21.1C18 21.1 19.3 20.2 20.4 18.1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
};

const TargetPenerimaManfaat = () => {
  useLiteReveal(".peduli-benefit [data-lite-reveal]");

  return (
    <section className="peduli-benefit" aria-labelledby="peduli-benefit-title">
      <style data-component="target-penerima-manfaat">
        {targetPenerimaManfaatStyles}
      </style>

      <div className="peduli-benefit__inner">
        <header className="peduli-benefit__header" data-lite-reveal>
          <p className="peduli-benefit__eyebrow">Impak Sosial</p>
          <h2 className="peduli-benefit__title" id="peduli-benefit-title">
            Target Penerima Manfaat
          </h2>
        </header>

        <div className="peduli-benefit__grid">
          {benefits.map((benefit, index) => (
            <article
              className="peduli-benefit__item"
              key={benefit.number}
              data-lite-reveal
              style={{ transitionDelay: `${Math.min(index * 90, 240)}ms` }}
            >
              <div className="peduli-benefit__icon-box">
                <BenefitIcon icon={benefit.icon} />
              </div>

              <h3 className="peduli-benefit__number">{benefit.number}</h3>
              <p className="peduli-benefit__description">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetPenerimaManfaat;
