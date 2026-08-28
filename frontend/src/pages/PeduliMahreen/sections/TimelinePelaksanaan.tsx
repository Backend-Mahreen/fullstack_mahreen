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

const timelinePelaksanaanStyles = `
  .peduli-timeline {
    width: 100%;
    background: #000000;
    padding: clamp(84px, 8vw, 126px) 28px clamp(90px, 8vw, 132px);
    color: var(--peduli-text, #f6f1e8);
  }

  .peduli-timeline,
  .peduli-timeline *,
  .peduli-timeline *::before,
  .peduli-timeline *::after {
    box-sizing: border-box;
  }

  .peduli-timeline__inner {
    width: min(100%, 1210px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(220px, 0.44fr) minmax(0, 1fr);
    column-gap: clamp(46px, 7vw, 118px);
    align-items: start;
  }

  .peduli-timeline__title {
    position: sticky;
    top: 118px;
    margin: 0;
    color: #f4efe8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 3.4vw, 52px);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.048em;
  }

  .peduli-timeline__list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: clamp(68px, 8vw, 112px);
  }

  .peduli-timeline__item {
    position: relative;
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    column-gap: 36px;
    min-height: 112px;
  }

  .peduli-timeline__marker-wrap {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .peduli-timeline__marker-wrap::after {
    content: "";
    position: absolute;
    top: 20px;
    bottom: calc(-1 * clamp(68px, 8vw, 112px) - 22px);
    left: 50%;
    width: 1px;
    transform: translateX(-50%);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.055)
    );
  }

  .peduli-timeline__item:last-child .peduli-timeline__marker-wrap::after {
    display: none;
  }

  .peduli-timeline__marker {
    position: relative;
    z-index: 1;
    width: 15px;
    height: 15px;
    margin-top: 0;
    border-radius: 999px;
    background: rgba(200, 206, 207, 0.82);
    box-shadow: 0 0 0 7px rgba(0, 0, 0, 1);
  }

  .peduli-timeline__item:first-child .peduli-timeline__marker {
    background: var(--peduli-gold, #d3ad6d);
    box-shadow:
      0 0 0 7px rgba(0, 0, 0, 1),
      0 0 26px rgba(211, 173, 109, 0.22);
  }

  .peduli-timeline__content {
    padding-top: 0;
  }

  .peduli-timeline__phase {
    margin: 0 0 12px;
    color: var(--peduli-gold, #d3ad6d);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 2.35px;
    text-transform: uppercase;
  }

  .peduli-timeline__item:not(:first-child) .peduli-timeline__phase {
    color: rgba(255, 255, 255, 0.62);
  }

  .peduli-timeline__heading {
    margin: 0;
    color: #f5efe3;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(22px, 2vw, 31px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.038em;
  }

  .peduli-timeline__description {
    max-width: 650px;
    margin: 18px 0 0;
    color: rgba(255, 255, 255, 0.68);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.72;
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
    .peduli-timeline__inner {
      grid-template-columns: 1fr;
      row-gap: 56px;
    }

    .peduli-timeline__title {
      position: static;
      max-width: 520px;
    }

    .peduli-timeline__item {
      column-gap: 24px;
    }
  }

  @media (max-width: 560px) {
    .peduli-timeline {
      padding-inline: 20px;
    }

    .peduli-timeline__inner {
      row-gap: 42px;
    }

    .peduli-timeline__list {
      gap: 56px;
    }

    .peduli-timeline__item {
      grid-template-columns: 26px minmax(0, 1fr);
      column-gap: 18px;
      min-height: auto;
    }

    .peduli-timeline__marker {
      width: 12px;
      height: 12px;
      box-shadow: 0 0 0 6px rgba(0, 0, 0, 1);
    }

    .peduli-timeline__item:first-child .peduli-timeline__marker {
      box-shadow:
        0 0 0 6px rgba(0, 0, 0, 1),
        0 0 22px rgba(211, 173, 109, 0.2);
    }

    .peduli-timeline__marker-wrap::after {
      top: 17px;
      bottom: -60px;
    }

    .peduli-timeline__phase {
      font-size: 14px;
      letter-spacing: 2px;
    }

    .peduli-timeline__description {
      font-size: 14px;
      line-height: 1.7;
    }
  }
`;

const timelineItems = [
  {
    phase: "Tahap 01",
    title: "Pemetaan & Kurikulum",
    description:
      "Survei kebutuhan sekolah target dan penyusunan modul pembelajaran yang adaptif namun tetap memiliki standar kualitas tinggi.",
  },
  {
    phase: "Tahap 02",
    title: "Rekrutmen Mentor",
    description:
      "Seleksi terbuka bagi karyawan Mahreen Studio dan mitra profesional untuk menjadi pengajar tamu di Kelas Inspirasi.",
  },
  {
    phase: "Tahap 03",
    title: "Renovasi Library Hub",
    description:
      "Transformasi ruang kelas menjadi perpustakaan modern dengan standar estetika Mahreen untuk menciptakan suasana belajar yang prestisius.",
  },
  {
    phase: "Tahap 04",
    title: "Pelaksanaan Kelas",
    description:
      "Sesi pembelajaran interaktif dilakukan setiap akhir pekan selama 3 bulan intensif.",
  },
  {
    phase: "Tahap 05",
    title: "Evaluasi & Showcase",
    description:
      "Pameran karya siswa dan pengukuran indeks dampak literasi pasca-program.",
  },
];

const TimelinePelaksanaan = () => {
  useLiteReveal(".peduli-timeline [data-lite-reveal]");

  return (
    <section className="peduli-timeline" aria-labelledby="peduli-timeline-title">
      <style data-component="timeline-pelaksanaan-program">
        {timelinePelaksanaanStyles}
      </style>

      <div className="peduli-timeline__inner">
        <h2 className="peduli-timeline__title" id="peduli-timeline-title" data-lite-reveal="left">
          Timeline
          <br />
          Pelaksanaan
          <br />
          Program 2024
        </h2>

        <div className="peduli-timeline__list">
          {timelineItems.map((item, index) => (
            <article
              className="peduli-timeline__item"
              key={item.phase}
              data-lite-reveal
              style={{ transitionDelay: `${Math.min(index * 70, 280)}ms` }}
            >
              <div className="peduli-timeline__marker-wrap" aria-hidden="true">
                <span className="peduli-timeline__marker" />
              </div>

              <div className="peduli-timeline__content">
                <p className="peduli-timeline__phase">{item.phase}</p>
                <h3 className="peduli-timeline__heading">{item.title}</h3>
                <p className="peduli-timeline__description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelinePelaksanaan;
