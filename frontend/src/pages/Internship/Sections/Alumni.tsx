import { useEffect, useRef, useState, type CSSProperties } from "react";
import rakaPratamaImage from "../../../assets/Internship/raka-pratama.jpg";
import sitiMahreenImage from "../../../assets/Internship/siti-mahreen.jpg";
import dimasAndreImage from "../../../assets/Internship/dimas-andre.jpg";
import mayaKaniaImage from "../../../assets/Internship/maya-kania.jpg";

type AlumniItem = {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  linkedin: string;
};

type AlumniStyle = CSSProperties & {
  "--alumni-delay": string;
};

const alumniList: AlumniItem[] = [
  {
    name: "Raka Pratama",
    role: "Chief Design Officer",
    image: rakaPratamaImage,
    imageAlt: "Potret profesional Raka Pratama",
    linkedin: "#",
  },
  {
    name: "Siti Mahreen",
    role: "Lead Developer",
    image: sitiMahreenImage,
    imageAlt: "Potret profesional Siti Mahreen",
    linkedin: "#",
  },
  {
    name: "Dimas Andre",
    role: "Growth Strategist",
    image: dimasAndreImage,
    imageAlt: "Potret profesional Dimas Andre",
    linkedin: "#",
  },
  {
    name: "Maya Kania",
    role: "Multimedia Lead",
    image: mayaKaniaImage,
    imageAlt: "Potret profesional Maya Kania",
    linkedin: "#",
  },
];

const alumniStyles = `
  .alumni-section {
    width: 100%;
    overflow: hidden;
    padding: 52px 64px 72px;
    background: #0a0f0d;
    color: #ffffff;
  }

  .alumni-section,
  .alumni-section *,
  .alumni-section *::before,
  .alumni-section *::after {
    box-sizing: border-box;
  }

  .alumni-section__inner {
    width: min(100%, 1440px);
    margin: 0 auto;
  }

  .alumni-section__header {
    position: relative;
    min-height: 150px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 48px;
  }

  .alumni-section__heading {
    text-align: center;
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  .alumni-section.is-visible .alumni-section__heading {
    animation: alumniHeaderEnter 620ms cubic-bezier(0.22, 1, 0.36, 1)
      70ms both;
  }

  .alumni-section__eyebrow {
    margin: 0 0 22px;
    color: #d8b65f;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .alumni-section__title {
    margin: 0;
    color: #f3efe8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(48px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: -0.038em;
  }

  .alumni-section__view-all {
    position: absolute;
    right: 8px;
    top: 78px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #dfbe69;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 2.2px;
    text-decoration: none;
    cursor: pointer;
    transition:
      color 180ms ease,
      text-shadow 180ms ease;
    opacity: 0;
    transform: translate3d(14px, 0, 0);
  }

  .alumni-section.is-visible .alumni-section__view-all {
    animation: alumniViewAllEnter 560ms cubic-bezier(0.22, 1, 0.36, 1)
      160ms both;
  }

  .alumni-section__view-all:hover,
  .alumni-section__view-all:focus-visible {
    color: #f0d38a;
    text-shadow: 0 0 10px rgba(223, 190, 105, 0.2);
    outline: none;
  }

  .alumni-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px;
  }

  .alumni-grid--slider {
    display: flex;
    grid-template-columns: none;
    gap: 28px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .alumni-grid--slider::-webkit-scrollbar {
    display: none;
  }

  .alumni-grid--slider .alumni-card {
    flex: 0 0 min(24vw, 330px);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .alumni-card {
    min-width: 0;
    opacity: 0;
    transform: translate3d(0, 22px, 0) scale(0.985);
    will-change: opacity, transform;
  }

  .alumni-section.is-visible .alumni-card {
    animation: alumniCardEnter 640ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--alumni-delay) both;
  }

  .alumni-card__media {
    position: relative;
    height: 430px;
    overflow: hidden;
    background: #111614;
  }

  .alumni-card__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center 26%;
    filter: grayscale(1) brightness(0.76) contrast(1.08);
    transform: scale(1.002);
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 240ms ease;
  }

  .alumni-card:hover .alumni-card__image,
  .alumni-card:focus-within .alumni-card__image {
    transform: scale(1.035);
    filter: grayscale(1) brightness(0.84) contrast(1.06);
  }

  .alumni-card__content {
    padding-top: 24px;
  }

  .alumni-card__name {
    margin: 0;
    color: #f5f1ea;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 27px;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.025em;
  }

  .alumni-card__role {
    margin: 9px 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 1.9px;
  }

  .alumni-card__linkedin {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 18px;
    color: #d9b75f;
    font-family: "DM Sans", "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 1.8px;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      color 180ms ease,
      text-shadow 180ms ease;
  }

  .alumni-card__linkedin-arrow {
    display: inline-block;
    transition: transform 180ms ease;
  }

  .alumni-card__linkedin:hover,
  .alumni-card__linkedin:focus-visible {
    color: #efd083;
    text-shadow: 0 0 10px rgba(217, 183, 95, 0.2);
    outline: none;
  }

  .alumni-card__linkedin:hover .alumni-card__linkedin-arrow,
  .alumni-card__linkedin:focus-visible .alumni-card__linkedin-arrow {
    transform: translate(3px, -2px);
  }

  @keyframes alumniHeaderEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes alumniViewAllEnter {
    from {
      opacity: 0;
      transform: translate3d(14px, 0, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes alumniCardEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 22px, 0) scale(0.985);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (max-width: 1100px) {
    .alumni-section {
      padding: 48px 32px 60px;
    }

    .alumni-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 20px;
    }

    .alumni-card__media {
      height: 480px;
    }
  }

  @media (max-width: 620px) {
    .alumni-section {
      padding: 40px 0 48px;
      overflow: hidden;
    }

    .alumni-section__inner {
      width: 100%;
    }

    .alumni-section__header {
      min-height: auto;
      display: block;
      margin-bottom: 30px;
      padding: 0 16px;
    }

    .alumni-section__heading {
      text-align: left;
    }

    .alumni-section__view-all {
      position: static;
      margin-top: 18px;
    }

    .alumni-grid,
    .alumni-grid--slider {
      display: flex;
      grid-template-columns: none;
      gap: 18px;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 16px 6px;
      scroll-snap-type: x mandatory;
      scroll-padding-left: 16px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .alumni-grid::-webkit-scrollbar,
    .alumni-grid--slider::-webkit-scrollbar {
      display: none;
    }

    .alumni-card,
    .alumni-grid--slider .alumni-card {
      flex: 0 0 min(82vw, 340px);
      scroll-snap-align: start;
      scroll-snap-stop: always;
    }

    .alumni-card__media {
      height: clamp(390px, 112vw, 500px);
    }

    .alumni-card__content {
      padding-top: 20px;
    }

    .alumni-card__name {
      font-size: 30px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .alumni-section__heading,
    .alumni-section__view-all,
    .alumni-card,
    .alumni-section.is-visible .alumni-section__heading,
    .alumni-section.is-visible .alumni-section__view-all,
    .alumni-section.is-visible .alumni-card {
      opacity: 1;
      transform: none;
      animation: none;
      will-change: auto;
    }

    .alumni-card__image,
    .alumni-card__linkedin,
    .alumni-card__linkedin-arrow {
      transition: none;
    }
  }
`;

const Alumni = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showAllAlumni, setShowAllAlumni] = useState(false);
  const hasMoreThanFourAlumni = alumniList.length > 4;
  const displayedAlumni = showAllAlumni ? alumniList : alumniList.slice(0, 4);

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
        threshold: 0.14,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="alumni"
      ref={sectionRef}
      className="alumni-section"
      aria-labelledby="alumni-title"
    >
      <style data-component="alumni-section">{alumniStyles}</style>

      <div className="alumni-section__inner">
        <header className="alumni-section__header">
          <div className="alumni-section__heading">
            <p className="alumni-section__eyebrow">Ikatan Alumni</p>
            <h2 className="alumni-section__title" id="alumni-title">
              Mahreen Indonesia Internship
            </h2>
          </div>

          {hasMoreThanFourAlumni && !showAllAlumni && (
            <button
              className="alumni-section__view-all"
              type="button"
              aria-controls="alumni-list"
              aria-expanded={showAllAlumni}
              onClick={() => setShowAllAlumni(true)}
            >
              View All Alumni
            </button>
          )}
        </header>

        <div
          id="alumni-list"
          className={`alumni-grid${showAllAlumni ? " alumni-grid--slider" : ""}`}
        >
          {displayedAlumni.map((alumni, index) => (
            <article
              className="alumni-card"
              key={alumni.name}
              style={
                {
                  "--alumni-delay": `${170 + index * 85}ms`,
                } as AlumniStyle
              }
            >
              <div className="alumni-card__media">
                <img width="800" height="1000"
                  className="alumni-card__image"
                  src={alumni.image}
                  alt={alumni.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="alumni-card__content">
                <h3 className="alumni-card__name">{alumni.name}</h3>
                <p className="alumni-card__role">{alumni.role}</p>

                <a
                  className="alumni-card__linkedin"
                  href={alumni.linkedin}
                  aria-label={`LinkedIn ${alumni.name}`}
                >
                  Linkedin
                  <span
                    className="alumni-card__linkedin-arrow"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Alumni;
