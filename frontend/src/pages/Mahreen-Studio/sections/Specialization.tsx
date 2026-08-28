import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { apiClient } from "../../../api/apiClient";

type SpecializationItem = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type ApiSpecialization = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const iconComponents: Record<string, () => ReactNode> = {
  shirt: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8.5 4 12 6l3.5-2 4 2.7-2.1 4-2.2-.9V20H8.8V9.8l-2.2.9-2.1-4L8.5 4Z" />
    </svg>
  ),
  fingerprint: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 12.5a5.5 5.5 0 0 1 11 0" />
      <path d="M4 12.5a8 8 0 0 1 16 0" />
      <path d="M8.8 12.5a3.2 3.2 0 0 1 6.4 0" />
      <path d="M12 12.5c0 3.2 1.2 5.7 3.7 7.5" />
      <path d="M9.3 14.2c.4 2.6 1.4 4.5 3 5.8" />
      <path d="M7.3 16.5c.4 1.3 1 2.5 1.9 3.5" />
    </svg>
  ),
  eye: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  sliders: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 4v16" />
      <path d="M12 4v16" />
      <path d="M18 4v16" />
      <path d="M4.5 8h3" />
      <path d="M10.5 14h3" />
      <path d="M16.5 10h3" />
    </svg>
  ),
  megaphone: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 13h4l8 4V7l-8 4H4v2Z" />
      <path d="M8 13v5" />
      <path d="M19 9.5 21 8" />
      <path d="M19 14.5l2 1.5" />
    </svg>
  ),
  diamond: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.5 8.5 7 4h10l3.5 4.5L12 20 3.5 8.5Z" />
      <path d="M3.5 8.5h17" />
      <path d="M8 4l4 16 4-16" />
    </svg>
  ),
};

const fallbackIconKeys = ["shirt", "fingerprint", "eye", "sliders", "megaphone", "diamond"];

const fallbackItems: SpecializationItem[] = [
  {
    id: "apparel",
    title: "Apparel",
    description:
      "Crafting high-quality garments that balance structural silhouette with unmatched comfort and durability.",
    icon: iconComponents.shirt(),
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    description:
      "Establishing a cohesive visual language that speaks of luxury, restraint, and timeless artistic value.",
    icon: iconComponents.fingerprint(),
  },
  {
    id: "visual-branding",
    title: "Visual Branding",
    description:
      "Executing high-end graphic solutions that enhance the perception of exclusivity across all touchpoints.",
    icon: iconComponents.eye(),
  },
  {
    id: "product-development",
    title: "Product Development",
    description:
      "Meticulous R&D processes focused on textile innovation and precision engineering in every item.",
    icon: iconComponents.sliders(),
  },
  {
    id: "lifestyle-campaign",
    title: "Lifestyle Campaign",
    description:
      "Storytelling through high-concept photography and cinematic visual narratives that define a mood.",
    icon: iconComponents.megaphone(),
  },
  {
    id: "signature-collection",
    title: "Signature Collection",
    description:
      "Limited release pieces that push the boundaries of artistic expression and manufacturing excellence.",
    icon: iconComponents.diamond(),
  },
];

const specializationStyles = `

  .studio-specialization {
    width: 100%;
    background: #000000;
    color: #ffffff;
    padding: 72px 24px 88px;
    overflow: hidden;
  }

  .studio-specialization,
  .studio-specialization *,
  .studio-specialization *::before,
  .studio-specialization *::after {
    box-sizing: border-box;
  }

  .studio-specialization__inner {
    width: 100%;
    max-width: 1260px;
    margin: 0 auto;
  }

  .studio-specialization__header {
    max-width: 820px;
    margin: 0 auto 72px;
    text-align: center;
  }

  .studio-specialization__eyebrow {
    margin: 0 0 16px;
    color: #d7b777;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 5px;
    text-transform: uppercase;
  }

  .studio-specialization__title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(42px, 4.4vw, 68px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .studio-specialization__description {
    max-width: 780px;
    margin: 26px auto 0;
    color: rgba(255, 255, 255, 0.55);
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(15px, 1.2vw, 18px);
    font-weight: 400;
    line-height: 1.75;
  }

  .studio-specialization__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px;
  }

  .studio-specialization-card {
    min-height: 260px;
    padding: 42px 42px 38px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015)),
      #0b0b0b;
    border: 1px solid rgba(255, 255, 255, 0.09);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .studio-specialization-card:hover {
    transform: translateY(-3px);
    border-color: rgba(215, 183, 119, 0.26);
    background-color: #101010;
  }

  .studio-specialization-card__icon {
    width: 32px;
    height: 32px;
    color: #d7b777;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .studio-specialization-card__icon svg {
    width: 100%;
    height: 100%;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .studio-specialization-card__title {
    margin: 34px 0 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(25px, 2vw, 34px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.018em;
  }

  .studio-specialization-card__description {
    margin: 22px 0 0;
    color: rgba(255, 255, 255, 0.55);
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(14px, 1.05vw, 17px);
    font-weight: 400;
    line-height: 1.75;
  }

  .studio-specialization [data-specialization-reveal] {
    opacity: 1;
    transform: translateY(0);
  }

  .studio-specialization.is-reveal-ready [data-specialization-reveal] {
    transition:
      opacity 620ms ease,
      transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
      border-color 180ms ease,
      background-color 180ms ease;
  }

  .studio-specialization.is-reveal-ready
    [data-specialization-reveal]:not(.is-visible) {
    opacity: 0;
    transform: translateY(24px);
  }

  .studio-specialization-card[data-specialization-reveal] {
    transition-delay: var(--reveal-delay, 0ms);
  }

  @media (max-width: 1080px) {
    .studio-specialization {
      padding: 64px 22px 78px;
    }

    .studio-specialization__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px;
    }
  }

  @media (max-width: 640px) {
    .studio-specialization {
      padding: 54px 16px 64px;
    }

    .studio-specialization__header {
      margin-bottom: 44px;
      text-align: left;
    }

    .studio-specialization__eyebrow {
      font-size: 14px;
      letter-spacing: 3.4px;
    }

    .studio-specialization__description {
      margin-top: 20px;
    }

    .studio-specialization__grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .studio-specialization-card {
      min-height: auto;
      padding: 34px 26px 32px;
    }

    .studio-specialization-card__title {
      margin-top: 28px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .studio-specialization-card,
    .studio-specialization-card:hover,
    .studio-specialization [data-specialization-reveal] {
      transform: none;
      transition: none;
    }

    .studio-specialization [data-specialization-reveal] {
      opacity: 1;
    }
  }
`;

const Specialization = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState<SpecializationItem[]>(fallbackItems);

  useEffect(() => {
    let active = true;
    apiClient<{ data: ApiSpecialization[] }>("/collections/specializations")
      .then((res) => {
        if (!active) return;
        const apiItems = (res.data || []).map((item, index) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          icon: iconComponents[item.icon]?.() ?? iconComponents[fallbackIconKeys[index % fallbackIconKeys.length]](),
        }));
        if (apiItems.length > 0) setItems(apiItems);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const revealElements = section.querySelectorAll<HTMLElement>(
      "[data-specialization-reveal]"
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
        threshold: 0.16,
        rootMargin: "0px 0px -70px 0px",
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
      <style data-component="studio-specialization">{specializationStyles}</style>

      <section
        className="studio-specialization"
        id="specializations"
        ref={sectionRef}
        aria-labelledby="studio-specialization-title"
      >
        <div className="studio-specialization__inner">
          <header
            className="studio-specialization__header"
            data-specialization-reveal
          >
            <p className="studio-specialization__eyebrow">Specializations</p>
            <h2
              className="studio-specialization__title"
              id="studio-specialization-title"
            >
              Our Design Focus
            </h2>
            <p className="studio-specialization__description">
              We focus on six core pillars of creativity to deliver an
              unparalleled lifestyle experience, blending Indonesian craftsmanship
              with global modernism.
            </p>
          </header>

          <div className="studio-specialization__grid">
            {items.map((item, index) => (
              <article
                className="studio-specialization-card"
                key={item.id}
                data-specialization-reveal
                style={
                  { "--reveal-delay": `${index * 70}ms` } as CSSProperties
                }
              >
                <div className="studio-specialization-card__icon">
                  {item.icon}
                </div>
                <h3 className="studio-specialization-card__title">
                  {item.title}
                </h3>
                <p className="studio-specialization-card__description">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Specialization;
