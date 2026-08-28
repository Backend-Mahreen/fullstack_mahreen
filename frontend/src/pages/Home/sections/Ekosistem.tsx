import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { Sparkles, Briefcase, Palette, Users, Globe } from "lucide-react";

import logoStudio from "../../../assets/Ekosistem-Mahreen/mahreen-studio.webp";
import logoTanya from "../../../assets/Ekosistem-Mahreen/tanya-mahreen.webp";
import logoPeduli from "../../../assets/Ekosistem-Mahreen/peduli-mahreen.webp";
import logoCsr from "../../../assets/Ekosistem-Mahreen/mahreen-csr.webp";
import logoInternship from "../../../assets/Ekosistem-Mahreen/mahreen-internship.webp";

interface EcosystemItem {
  id: string;
  logo: string;
  icon: ReactNode;
  category: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

const ecosystemItems: EcosystemItem[] = [
  {
    id: "internship",
    logo: logoInternship,
    icon: <Users size={14} />,
    category: "PENGEMBANGAN TALENTA",
    title: "Mahreen Indonesia Internship",
    description:
      "Program pengembangan talenta kreatif dan digital berbasis proyek nyata yang membekali peserta dengan pengalaman profesional dan portofolio.",
    linkLabel: "Pelajari Lebih Lanjut",
    linkHref: "/internship",
  },
  {
    id: "tanya",
    logo: logoTanya,
    icon: <Briefcase size={14} />,
    category: "SOLUSI BISNIS",
    title: "Tanya Mahreen",
    description:
      "Solusi digital dan kreatif untuk membantu UMKM, brand, dan perusahaan bertumbuh melalui teknologi dan inovasi.",
    linkLabel: "Eksplorasi Solusi",
    linkHref: "/tanya-mahreen",
  },
  {
    id: "studio",
    logo: logoStudio,
    icon: <Palette size={14} />,
    category: "STUDIO KREATIF",
    title: "Mahreen Studio",
    description:
      "Creative lifestyle yang berfokus pada pengembangan apparel, visual branding, dan identitas kreatif modern.",
    linkLabel: "Lihat Karya",
    linkHref: "/mahreen-studio",
  },
  {
    id: "peduli",
    logo: logoPeduli,
    icon: <Sparkles size={14} />,
    category: "CREATIVE AGENCY",
    title: "Peduli Mahreen",
    description:
      "Mendorong perubahan melalui pendidikan, pemberdayaan, dan aksi sosial yang berdampak bagi masyarakat.",
    linkLabel: "Lihat Program",
    linkHref: "/peduli-mahreen",
  },
  {
    id: "csr",
    logo: logoCsr,
    icon: <Globe size={14} />,
    category: "SOCIAL IMPACT",
    title: "Mahreen CSR",
    description:
      "Membangun kolaborasi CSR yang berkelanjutan bersama perusahaan dan berbagai mitra strategis.",
    linkLabel: "Lihat Mitra",
    linkHref: "/mahreen-csr",
  },
];

const ekosistemStyles = `
  .ekosistem {
    width: 100%;
    background-color: #0d0d0d;
    padding: 60px 22px;
    box-sizing: border-box;
  }

  .ekosistem .ekosistem__container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
  }

  .ekosistem .ekosistem__header {
    max-width: 720px;
    margin-bottom: 32px;
  }

  .ekosistem .ekosistem__title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 36px;
    font-weight: 700;
    color: #d6a35c;
    margin: 0 0 12px;
    text-align: left;
  }

  .ekosistem .ekosistem__subtitle {
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #b8b8b8;
    margin: 0;
    text-align: left;
  }

  .ekosistem .ekosistem__slider {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: stretch;
    gap: 20px;
    padding: 1px 3px 24px 1px;
    scroll-padding-inline: 1px 3px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .ekosistem .ekosistem__slider::-webkit-scrollbar {
    display: none;
  }

  .ekosistem .ekosistem__card {
    background-color: #161616;
    border: 1px solid #232323;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 480px;
    flex: 0 0 calc(25% - 15px);
    scroll-snap-align: start;
    transition: border-color 0.2s ease;
  }

  .ekosistem .ekosistem__card:hover {
    border-color: #d6a35c;
  }

  .ekosistem [data-scroll-reveal] {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  .ekosistem.is-reveal-ready [data-scroll-reveal] {
    transition: opacity 0.75s ease,
      transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
      filter 0.75s ease,
      border-color 0.2s ease;
    will-change: opacity, transform, filter;
  }

  .ekosistem.is-reveal-ready [data-scroll-reveal]:not(.is-visible) {
    opacity: 0;
    transform: translateY(34px);
    filter: blur(8px);
  }

  .ekosistem .ekosistem__header[data-scroll-reveal] {
    transition-delay: 80ms;
  }

  .ekosistem .ekosistem__card[data-scroll-reveal] {
    transition-delay: var(--reveal-delay, 0ms);
  }

  .ekosistem .ekosistem__logo-wrapper {
    width: 100%;
    height: 250px;
    background-color: #1d1d1d;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .ekosistem .ekosistem__logo {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .ekosistem .ekosistem__card-body {
    padding: 20px 24px 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .ekosistem .ekosistem__category {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #d6a35c;
    margin-bottom: 12px;
  }

  .ekosistem .ekosistem__card-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 10px;
    line-height: 1.3;
  }

  .ekosistem .ekosistem__card-description {
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #999999;
    margin: 0 0 16px;
    flex: 1;
  }

  .ekosistem .ekosistem__card-link {
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #d6a35c;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
    padding: 6px 12px;
    margin-left: -12px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .ekosistem .ekosistem__card-link:hover {
    gap: 8px;
    background-color: rgba(214, 163, 92, 0.15);
    text-decoration: none;
  }

  .ekosistem .ekosistem__dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    margin-top: 4px;
  }

  .ekosistem .ekosistem__dot {
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    display: grid;
    place-items: center;
    flex: 0 0 48px;
    background: transparent;
    cursor: pointer;
    touch-action: manipulation;
  }

  .ekosistem .ekosistem__dot::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background-color: rgba(214, 163, 92, 0.35);
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .ekosistem .ekosistem__dot:hover::before {
    background-color: rgba(214, 163, 92, 0.7);
  }

  .ekosistem .ekosistem__dot.is-active::before {
    background-color: #d6a35c;
    transform: scaleX(2.75);
  }

  .ekosistem .ekosistem__dot:focus-visible {
    outline: 2px solid #d6a35c;
    outline-offset: 4px;
  }

  @media (max-width: 1100px) {
    .ekosistem .ekosistem__card {
      flex: 0 0 calc(50% - 10px);
    }
  }

  @media (max-width: 600px) {
    .ekosistem {
      padding: 50px 0;
    }

    .ekosistem .ekosistem__container {
      max-width: 100%;
    }

    .ekosistem .ekosistem__header {
      padding: 0 22px;
      margin-bottom: 28px;
    }

    .ekosistem .ekosistem__slider {
      gap: 16px;
      padding: 1px calc((100vw - min(86vw, 320px)) / 2) 18px;
      scroll-padding-inline: calc((100vw - min(86vw, 320px)) / 2);
      scroll-snap-type: x mandatory;
    }

    .ekosistem .ekosistem__card {
      flex: 0 0 min(86vw, 320px);
      max-width: 320px;
      scroll-snap-align: center;
    }

    .ekosistem .ekosistem__title {
      font-size: 32px;
    }

    .ekosistem .ekosistem__dots {
      margin-top: 0;
      padding-bottom: 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ekosistem .ekosistem__card,
    .ekosistem .ekosistem__card-link,
    .ekosistem .ekosistem__dot,
    .ekosistem [data-scroll-reveal] {
      transition: none;
    }

    .ekosistem [data-scroll-reveal] {
      opacity: 1;
      transform: none;
      filter: none;
    }
  }
`;

const Ekosistem = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDotClick = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelectorAll<HTMLElement>(".ekosistem__card")[index];
    if (!card) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    setActiveIndex(index);
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    section.classList.add("is-reveal-ready");

    const revealElements = section.querySelectorAll<HTMLElement>(
      "[data-scroll-reveal]"
    );

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

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cards = Array.from(
      slider.querySelectorAll<HTMLElement>(".ekosistem__card")
    );
    const visibility = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target, entry.intersectionRatio);
        });

        let nextIndex = 0;
        let highestRatio = -1;
        cards.forEach((card, index) => {
          const ratio = visibility.get(card) ?? 0;
          if (ratio > highestRatio) {
            highestRatio = ratio;
            nextIndex = index;
          }
        });

        setActiveIndex((currentIndex) =>
          currentIndex === nextIndex ? currentIndex : nextIndex
        );
      },
      {
        root: slider,
        threshold: [0.35, 0.5, 0.65, 0.8],
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style data-component="ekosistem">{ekosistemStyles}</style>

      <section className="ekosistem" id="ecosystem" ref={sectionRef}>
        <div className="ekosistem__container">
          <div className="ekosistem__header" data-scroll-reveal>
            <h2 className="ekosistem__title">Ekosistem Kami</h2>
            <p className="ekosistem__subtitle">
              Membangun bisnis, mengembangkan talenta, mendorong kreativitas,
              serta menciptakan dampak sosial melalui ekosistem Mahreen
              Indonesia.
            </p>
          </div>

          <div
            className="ekosistem__slider"
            ref={sliderRef}
          >
            {ecosystemItems.map((item, index) => (
              <a
                className="ekosistem__card"
                key={item.id}
                href={item.linkHref}
                aria-label={`${item.title} - ${item.linkLabel}`}
                data-scroll-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <div className="ekosistem__logo-wrapper">
                  <img width="96" height="96"
                    src={item.logo}
                    alt={`Logo ${item.title}`}
                    className="ekosistem__logo"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="ekosistem__card-body">
                  <span className="ekosistem__category">
                    {item.icon}
                    {item.category}
                  </span>

                  <h3 className="ekosistem__card-title">{item.title}</h3>

                  <p className="ekosistem__card-description">
                    {item.description}
                  </p>

                  <span className="ekosistem__card-link">
                    {item.linkLabel} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="ekosistem__dots" aria-label="Navigasi slide ekosistem">
            {ecosystemItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`ekosistem__dot${activeIndex === index ? " is-active" : ""}`}
                aria-label={`Tampilkan slide ${index + 1}: ${item.title}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Ekosistem;
