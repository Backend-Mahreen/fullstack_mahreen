import { useEffect, useRef, type CSSProperties } from "react";
import websiteDevelopmentImage from "../../../assets/Internship/website-development.jpg";
import graphicDesignImage from "../../../assets/Internship/graphic-design.jpg";
import videoEditingImage from "../../../assets/Internship/video-editing.jpg";
import socialMediaImage from "../../../assets/Internship/social-media.jpg";

type Specialization = {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
};

type SpecializationStyle = CSSProperties & {
  "--specialization-delay": string;
};

const specializations: Specialization[] = [
  {
    eyebrow: "Tech Stack",
    title: "Website Development",
    image: websiteDevelopmentImage,
    imageAlt: "Monitor yang menampilkan kode pengembangan website",
    href: "/internship/form?program=website-development",
  },
  {
    eyebrow: "Visual Arts",
    title: "Graphic Design",
    image: graphicDesignImage,
    imageAlt: "Monitor yang menampilkan proses desain grafis",
    href: "/internship/form?program=graphic-design",
  },
  {
    eyebrow: "Motion Media",
    title: "Video Editing",
    image: videoEditingImage,
    imageAlt: "Studio penyuntingan video dengan beberapa layar",
    href: "/internship/form?program=video-editing",
  },
  {
    eyebrow: "Marketing",
    title: "Social Media",
    image: socialMediaImage,
    imageAlt: "Tampilan aplikasi media sosial pada perangkat seluler",
    href: "/internship/form?program=social-media",
  },
];

const specializationStyles = `
  .specialization-section {
    width: 100%;
    overflow: hidden;
    background: #050505;
    color: #ffffff;
  }

  .specialization-section,
  .specialization-section *,
  .specialization-section *::before,
  .specialization-section *::after {
    box-sizing: border-box;
  }

  .specialization-section__header {
    width: min(100%, 1180px);
    margin: 0 auto;
    padding: 34px 24px 35px;
    text-align: center;
  }

  .specialization-section__title,
  .specialization-section__description {
    opacity: 0;
    transform: translate3d(0, 15px, 0);
  }

  .specialization-section.is-visible .specialization-section__title {
    animation: specializationFadeUp 560ms cubic-bezier(0.22, 1, 0.36, 1)
      70ms both;
  }

  .specialization-section.is-visible .specialization-section__description {
    animation: specializationFadeUp 560ms cubic-bezier(0.22, 1, 0.36, 1)
      150ms both;
  }

  .specialization-section__title {
    margin: 0;
    color: #f6f1e9;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(32px, 3.15vw, 42px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.035em;
  }

  .specialization-section__description {
    max-width: 850px;
    margin: 22px auto 0;
    color: rgba(255, 255, 255, 0.88);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: clamp(14px, 1.25vw, 17px);
    font-weight: 400;
    line-height: 1.55;
  }

  .specialization-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    background: #050505;
  }

  .specialization-card {
    position: relative;
    min-width: 0;
    height: clamp(390px, 35vw, 500px);
    display: block;
    overflow: hidden;
    color: #ffffff;
    text-decoration: none;
    isolation: isolate;
    opacity: 0;
    transform: translate3d(0, 16px, 0);
  }

  .specialization-section.is-visible .specialization-card {
    animation: specializationCardEnter 620ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--specialization-delay) both;
  }

  .specialization-card + .specialization-card {
    border-left: 1px solid rgba(255, 255, 255, 0.055);
  }

  .specialization-card__image {
    position: absolute;
    inset: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center top;
    transform: scale(1.002);
    filter: saturate(0.88) brightness(0.78) contrast(1.05);
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 260ms ease;
  }

  .specialization-card::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.02) 0%,
        rgba(0, 0, 0, 0.04) 47%,
        rgba(0, 0, 0, 0.58) 75%,
        rgba(0, 0, 0, 0.97) 100%
      ),
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.12) 0%,
        transparent 45%,
        rgba(0, 0, 0, 0.09) 100%
      );
    pointer-events: none;
  }

  .specialization-card::after {
    content: "";
    position: absolute;
    right: 22px;
    bottom: 22px;
    left: 22px;
    z-index: -1;
    height: 54px;
    border-radius: 50%;
    background: rgba(224, 190, 112, 0);
    filter: blur(26px);
    transition: background-color 220ms ease;
    pointer-events: none;
  }

  .specialization-card:hover .specialization-card__image,
  .specialization-card:focus-visible .specialization-card__image {
    transform: scale(1.035);
    filter: saturate(0.94) brightness(0.84) contrast(1.04);
  }

  .specialization-card:hover::after,
  .specialization-card:focus-visible::after {
    background: rgba(224, 190, 112, 0.12);
  }

  .specialization-card:focus-visible {
    outline: 1px solid rgba(229, 197, 126, 0.58);
    outline-offset: -1px;
  }

  .specialization-card__content {
    position: absolute;
    right: 24px;
    bottom: 29px;
    left: 24px;
    z-index: 1;
  }

  .specialization-card__eyebrow {
    margin: 0 0 10px;
    color: #e0bd6d;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 3.1px;
    text-transform: uppercase;
  }

  .specialization-card__title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(20px, 2vw, 27px);
    font-weight: 400;
    line-height: 1.13;
    letter-spacing: -0.025em;
  }

  @keyframes specializationFadeUp {
    from {
      opacity: 0;
      transform: translate3d(0, 15px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes specializationCardEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 16px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 900px) {
    .specialization-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .specialization-card {
      height: 440px;
    }

    .specialization-card:nth-child(3) {
      border-left: 0;
    }

    .specialization-card:nth-child(n + 3) {
      border-top: 1px solid rgba(255, 255, 255, 0.055);
    }
  }

  @media (max-width: 560px) {
    .specialization-section__header {
      padding: 38px 20px 32px;
    }

    .specialization-section__description {
      margin-top: 16px;
      font-size: 14px;
    }

    .specialization-grid {
      grid-template-columns: 1fr;
    }

    .specialization-card {
      height: 420px;
      border-left: 0 !important;
    }

    .specialization-card + .specialization-card {
      border-top: 1px solid rgba(255, 255, 255, 0.055);
    }

    .specialization-card__content {
      right: 22px;
      bottom: 27px;
      left: 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .specialization-section__title,
    .specialization-section__description,
    .specialization-card,
    .specialization-section.is-visible .specialization-section__title,
    .specialization-section.is-visible .specialization-section__description,
    .specialization-section.is-visible .specialization-card {
      opacity: 1;
      transform: none;
      animation: none;
    }

    .specialization-card__image,
    .specialization-card::after {
      transition: none;
    }
  }
`;

const Spesialisasi = () => {
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
      { threshold: 0.12 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="spesialisasi-unggulan"
      ref={sectionRef}
      className="specialization-section"
      aria-labelledby="specialization-title"
    >
      <style data-component="specialization-section">
        {specializationStyles}
      </style>

      <header className="specialization-section__header">
        <h2
          className="specialization-section__title"
          id="specialization-title"
        >
          Spesialisasi Unggulan
        </h2>

        <p className="specialization-section__description">
          Fokus pada keahlian yang paling dibutuhkan oleh industri saat ini
          dengan kurikulum berbasis portofolio.
        </p>
      </header>

      <div className="specialization-grid">
        {specializations.map((specialization, index) => (
          <a
            key={specialization.title}
            className="specialization-card"
            href={specialization.href}
            style={
              {
                "--specialization-delay": `${160 + index * 80}ms`,
              } as SpecializationStyle
            }
            aria-label={`Pelajari ${specialization.title}`}
          >
            <img width="800" height="1000"
              className="specialization-card__image"
              src={specialization.image}
              alt={specialization.imageAlt}
              loading="lazy"
              decoding="async"
            />

            <div className="specialization-card__content">
              <p className="specialization-card__eyebrow">
                {specialization.eyebrow}
              </p>
              <h3 className="specialization-card__title">
                {specialization.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Spesialisasi;
