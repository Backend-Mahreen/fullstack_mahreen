import { useEffect, useRef, type CSSProperties } from "react";

type AdmissionStatus = "open" | "soon" | "closed";

type AdmissionBatch = {
  status: AdmissionStatus;
  statusLabel: string;
  title: string;
  dateLabel: string;
  description: string;
  buttonLabel: string;
  href?: string;
};

type AdmissionStyle = CSSProperties & {
  "--admission-delay": string;
};

const admissionBatches: AdmissionBatch[] = [
  {
    status: "soon",
    statusLabel: "Jadwal sedang dikonfirmasi",
    title: "Batch Internship Berikutnya",
    dateLabel: "Periode pendaftaran akan diumumkan",
    description:
      "Our most ambitious batch yet, focusing on sustainable digital solutions and high-fashion branding.",
    buttonLabel: "Belum Dibuka",
  },
  {
    status: "soon",
    statusLabel: "Coming Soon",
    title: "Program Pengembangan Berikutnya",
    dateLabel: "Jadwal akan diumumkan",
    description:
      "Exploring the intersection of AI and Luxury Brand Management. Early interest list is open.",
    buttonLabel: "Belum Dibuka",
  },
  {
    status: "closed",
    statusLabel: "Closed",
    title: "Batch 12: Horizon",
    dateLabel: "Finished: Aug 2024",
    description:
      "A successful journey of 85 graduates now making an impact in Indonesia's tech ecosystem.",
    buttonLabel: "Closed",
  },
];

const admissionStyles = `
  .admission-window {
    width: 100%;
    overflow: hidden;
    padding: 82px 40px 96px;
    background: #050505;
    color: #ffffff;
  }

  .admission-window,
  .admission-window *,
  .admission-window *::before,
  .admission-window *::after {
    box-sizing: border-box;
  }

  .admission-window__inner {
    width: min(100%, 1220px);
    margin: 0 auto;
  }

  .admission-window__title {
    margin: 0;
    color: #f2eee7;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(48px, 4.8vw, 66px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
    text-align: center;
    opacity: 0;
    transform: translate3d(0, 26px, 0) scale(0.97);
    will-change: opacity, transform;
  }

  .admission-window.is-visible .admission-window__title {
    animation: admissionTitleEnter 760ms cubic-bezier(0.22, 1, 0.36, 1)
      70ms both;
  }

  .admission-window__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
    margin-top: 86px;
  }

  .admission-card {
    position: relative;
    min-height: 390px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.085);
    background: #0d0d0d;
    opacity: 0;
    transform: translate3d(0, 32px, 0) scale(0.965);
    transform-origin: center bottom;
    will-change: opacity, transform;
    box-shadow: 0 0 0 rgba(230, 197, 126, 0);
    transition:
      transform 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .admission-window.is-visible .admission-card {
    animation: admissionCardEnter 720ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--admission-delay) both;
  }

  .admission-card:hover,
  .admission-card:focus-within {
    transform: translateY(-5px);
    border-color: rgba(230, 197, 126, 0.23);
    box-shadow: 0 18px 46px rgba(0, 0, 0, 0.28);
  }

  .admission-card__status {
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px 7px;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 2.7px;
    text-align: center;
    text-transform: uppercase;
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }

  .admission-window.is-visible .admission-card__status {
    animation: admissionStatusEnter 520ms cubic-bezier(0.22, 1, 0.36, 1)
      calc(var(--admission-delay) + 170ms) both;
  }

  .admission-card--open .admission-card__status {
    background: #e6c57e;
    color: #17120a;
  }

  .admission-card--soon .admission-card__status {
    background: #181818;
    color: rgba(255, 255, 255, 0.64);
  }

  .admission-card--closed .admission-card__status {
    background: #2a0c0c;
    color: rgba(255, 255, 255, 0.42);
  }

  .admission-card__body {
    min-height: 356px;
    display: flex;
    flex-direction: column;
    padding: 47px 40px 39px;
  }

  .admission-card__title,
  .admission-card__date,
  .admission-card__description,
  .admission-card__button {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
  }

  .admission-window.is-visible .admission-card__title {
    animation: admissionContentEnter 520ms cubic-bezier(0.22, 1, 0.36, 1)
      calc(var(--admission-delay) + 220ms) both;
  }

  .admission-window.is-visible .admission-card__date {
    animation: admissionContentEnter 520ms cubic-bezier(0.22, 1, 0.36, 1)
      calc(var(--admission-delay) + 285ms) both;
  }

  .admission-window.is-visible .admission-card__description {
    animation: admissionContentEnter 560ms cubic-bezier(0.22, 1, 0.36, 1)
      calc(var(--admission-delay) + 350ms) both;
  }

  .admission-window.is-visible .admission-card__button {
    animation: admissionContentEnter 560ms cubic-bezier(0.22, 1, 0.36, 1)
      calc(var(--admission-delay) + 420ms) both;
  }

  .admission-card__title {
    margin: 0;
    color: rgba(255, 255, 255, 0.94);
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(24px, 2vw, 30px);
    font-weight: 400;
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .admission-card__date {
    margin: 12px 0 0;
    color: #e0bc6c;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 2px;
  }

  .admission-card__description {
    margin: 31px 0 0;
    color: rgba(255, 255, 255, 0.69);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.65;
  }

  .admission-card__button {
    width: 100%;
    min-height: 49px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    padding: 0 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: transparent;
    color: rgba(255, 255, 255, 0.68);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 2.5px;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      background-color 180ms ease,
      color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .admission-card__button:hover,
  .admission-card__button:focus-visible {
    transform: translateY(-2px);
  }

  .admission-card--open .admission-card__button {
    border-color: #e6c57e;
    background: #e6c57e;
    color: #15120b;
  }

  .admission-card--open .admission-card__button:hover,
  .admission-card--open .admission-card__button:focus-visible {
    background: #efd48f;
    color: #100d08;
    box-shadow: 0 0 24px rgba(230, 197, 126, 0.18);
    outline: none;
  }

  .admission-card--soon .admission-card__button:hover,
  .admission-card--soon .admission-card__button:focus-visible {
    border-color: rgba(230, 197, 126, 0.34);
    color: #e6c57e;
    box-shadow: 0 0 20px rgba(230, 197, 126, 0.08);
    outline: none;
  }

  .admission-card--closed .admission-card__title,
  .admission-card--closed .admission-card__date,
  .admission-card--closed .admission-card__description,
  .admission-card--closed .admission-card__button {
    color: rgba(255, 255, 255, 0.24);
  }

  .admission-card--closed .admission-card__date {
    color: rgba(255, 255, 255, 0.22);
  }

  .admission-card--closed .admission-card__button {
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.04);
    background: rgba(255, 255, 255, 0.005);
  }

  @keyframes admissionTitleEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 26px, 0) scale(0.97);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes admissionCardEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 32px, 0) scale(0.965);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes admissionStatusEnter {
    from {
      opacity: 0;
      transform: translate3d(0, -10px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes admissionContentEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 14px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 1020px) {
    .admission-window {
      padding-inline: 28px;
    }

    .admission-window__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .admission-card:last-child {
      grid-column: 1 / -1;
      width: min(100%, 560px);
      justify-self: center;
    }
  }

  @media (max-width: 680px) {
    .admission-window {
      padding: 56px 16px 62px;
    }

    .admission-window__title {
      font-size: 43px;
    }

    .admission-window__grid {
      grid-template-columns: 1fr;
      gap: 18px;
      margin-top: 52px;
    }

    .admission-card,
    .admission-card:last-child {
      width: 100%;
      min-height: 350px;
      grid-column: auto;
    }

    .admission-card__body {
      min-height: 316px;
      padding: 38px 27px 30px;
    }

    .admission-card__description {
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .admission-window__title,
    .admission-card,
    .admission-card__status,
    .admission-card__title,
    .admission-card__date,
    .admission-card__description,
    .admission-card__button,
    .admission-window.is-visible .admission-window__title,
    .admission-window.is-visible .admission-card,
    .admission-window.is-visible .admission-card__status,
    .admission-window.is-visible .admission-card__title,
    .admission-window.is-visible .admission-card__date,
    .admission-window.is-visible .admission-card__description,
    .admission-window.is-visible .admission-card__button {
      opacity: 1;
      transform: none;
      animation: none;
      will-change: auto;
    }

    .admission-card,
    .admission-card__button {
      transition: none;
    }
  }
`;

const AdmissionWindow = () => {
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

  return (
    <section
      id="admission-window"
      ref={sectionRef}
      className="admission-window"
      aria-labelledby="admission-window-title"
    >
      <style data-component="admission-window">{admissionStyles}</style>

      <div className="admission-window__inner">
        <h2
          className="admission-window__title"
          id="admission-window-title"
        >
          Admission Window
        </h2>

        <div className="admission-window__grid">
          {admissionBatches.map((batch, index) => {
            const cardClassName = `admission-card admission-card--${batch.status}`;
            const cardStyle = {
              "--admission-delay": `${150 + index * 90}ms`,
            } as AdmissionStyle;

            return (
              <article
                className={cardClassName}
                key={batch.title}
                style={cardStyle}
              >
                <div className="admission-card__status">
                  {batch.statusLabel}
                </div>

                <div className="admission-card__body">
                  <h3 className="admission-card__title">{batch.title}</h3>
                  <p className="admission-card__date">{batch.dateLabel}</p>
                  <p className="admission-card__description">
                    {batch.description}
                  </p>

                  {batch.href ? (
                    <a
                      className="admission-card__button"
                      href={batch.href}
                    >
                      {batch.buttonLabel}
                    </a>
                  ) : (
                    <span
                      className="admission-card__button"
                      aria-disabled="true"
                    >
                      {batch.buttonLabel}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdmissionWindow;
