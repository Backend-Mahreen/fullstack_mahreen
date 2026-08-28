import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";

type Statistic = {
  value: string;
  label: string;
  accessibleLabel: string;
};

const statistics: Statistic[] = [
  {
    value: "1.2K+",
    label: "Interns",
    accessibleLabel: "Lebih dari seribu dua ratus peserta internship",
  },
  {
    value: "45+",
    label: "Partners",
    accessibleLabel: "Lebih dari empat puluh lima mitra",
  },
  {
    value: "300+",
    label: "Projects",
    accessibleLabel: "Lebih dari tiga ratus proyek",
  },
  {
    value: "28",
    label: "Mentors",
    accessibleLabel: "Dua puluh delapan mentor",
  },
  {
    value: "12",
    label: "Batches",
    accessibleLabel: "Dua belas batch",
  },
  {
    value: "95%",
    label: "Alumni Hired",
    accessibleLabel: "Sembilan puluh lima persen alumni diterima bekerja",
  },
];

type StatisticStyle = CSSProperties & {
  "--stat-delay": string;
};

const numberStyles = `
  .internship-number {
    width: 100%;
    overflow: hidden;
    background:
      linear-gradient(
        180deg,
        #030303 0%,
        #030303 14%,
        #080c0a 30%,
        #080c0a 100%
      );
    color: #ffffff;
  }

  .internship-number,
  .internship-number *,
  .internship-number *::before,
  .internship-number *::after {
    box-sizing: border-box;
  }

  .internship-number__inner {
    width: min(100%, 1180px);
    min-height: 80px;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    align-items: center;
    margin: 0 auto;
    padding: 0 14px;
  }

  .internship-number__item {
    position: relative;
    min-width: 0;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 10px 9px;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.98);
    will-change: opacity, transform;
  }

  .internship-number.is-visible .internship-number__item {
    animation: internshipStatReveal 520ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--stat-delay) both;
  }

  .internship-number__value {
    display: block;
    margin: 0;
    color: #e8c777;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(30px, 2.65vw, 35px);
    font-weight: 700;
    line-height: 0.82;
    letter-spacing: -0.035em;
    white-space: nowrap;
    transform-origin: center;
    text-shadow: 0 0 0 rgba(232, 199, 119, 0);
    transition:
      color 180ms ease,
      text-shadow 180ms ease,
      filter 180ms ease;
  }

  .internship-number__label {
    display: block;
    margin: 0;
    color: rgba(255, 255, 255, 0.82);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 2.2px;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    text-shadow: 0 0 0 rgba(255, 255, 255, 0);
    transition:
      color 180ms ease,
      text-shadow 180ms ease;
  }

  .internship-number__item:hover .internship-number__value,
  .internship-number__item:focus-visible .internship-number__value {
    color: #f4d991;
    text-shadow:
      0 0 8px rgba(232, 199, 119, 0.42),
      0 0 20px rgba(232, 199, 119, 0.24);
    filter: brightness(1.06);
  }

  .internship-number__item:hover .internship-number__label,
  .internship-number__item:focus-visible .internship-number__label {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.22);
  }

  @keyframes internshipStatReveal {
    from {
      opacity: 0;
      transform: translate3d(0, 12px, 0) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (max-width: 900px) {
    .internship-number__inner {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      padding: 0;
    }

    .internship-number__item {
      min-height: 82px;
    }
  }

  @media (max-width: 520px) {
    .internship-number__inner {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .internship-number__item {
      min-height: 80px;
      padding-inline: 8px;
    }

    .internship-number__value {
      font-size: 31px;
    }

    .internship-number__label {
      font-size: 14px;
      letter-spacing: 1.7px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .internship-number__item,
    .internship-number.is-visible .internship-number__item {
      opacity: 1;
      transform: none;
      animation: none;
      will-change: auto;
    }

    .internship-number__value,
    .internship-number__label {
      transition: none;
    }
  }
`;

const Number = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
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
        threshold: 0.22,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleZoom = (event: MouseEvent<HTMLButtonElement>) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof event.currentTarget.animate !== "function"
    ) {
      return;
    }

    event.currentTarget.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.065)", offset: 0.48 },
        { transform: "scale(1)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );
  };

  return (
    <section
      ref={sectionRef}
      className="internship-number"
      aria-label="Pencapaian program Mahreen Indonesia Internship"
    >
      <style data-component="internship-number">{numberStyles}</style>

      <div className="internship-number__inner">
        {statistics.map((statistic, index) => (
          <button
            key={statistic.label}
            type="button"
            className="internship-number__item"
            style={
              {
                "--stat-delay": `${90 + index * 75}ms`,
              } as StatisticStyle
            }
            aria-label={statistic.accessibleLabel}
            onClick={handleZoom}
          >
            <strong className="internship-number__value">
              {statistic.value}
            </strong>
            <span className="internship-number__label">
              {statistic.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Number;
