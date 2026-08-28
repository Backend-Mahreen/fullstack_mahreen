import { useEffect, useRef, useState } from "react";
import {
  UsersRound,
  Wallet,
  BarChart3,
  RefreshCcw,
  Headphones,
  Timer,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

type ExcellenceItem = {
  title: string;
  icon: LucideIcon;
  featured?: boolean;
};

const excellenceItems: ExcellenceItem[] = [
  {
    title: "Professional Team",
    icon: UsersRound,
  },
  {
    title: "Harga Transparan",
    icon: Wallet,
  },
  {
    title: "Progress Tracking",
    icon: BarChart3,
  },
  {
    title: "Revisi Terstruktur",
    icon: RefreshCcw,
  },
  {
    title: "Pendampingan",
    icon: Headphones,
  },
  {
    title: "Tepat Waktu",
    icon: Timer,
  },
  {
    title: "Quality Assurance Guaranteed",
    icon: BadgeCheck,
    featured: true,
  },
];

const excellenceStyles = `
  .excellence-section,
  .excellence-section *,
  .excellence-section *::before,
  .excellence-section *::after {
    box-sizing: border-box;
  }

  .excellence-section {
    position: relative;
    isolation: isolate;
    width: 100%;
    overflow: hidden;
    padding: 62px 24px 48px;
    background:
      radial-gradient(
        circle at 50% 42%,
        rgba(223, 190, 122, 0.025) 0%,
        transparent 42%
      ),
      #0b0b0b;
    color: #ffffff;
  }

  .excellence-section::before {
    content: "";
    position: absolute;
    top: 20%;
    left: 50%;
    z-index: -1;
    width: 560px;
    height: 320px;
    border-radius: 50%;
    background: rgba(223, 190, 122, 0.025);
    filter: blur(110px);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .excellence-container {
    width: 100%;
    max-width: 1118px;
    margin: 0 auto;
  }

  .excellence-title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(36px, 4vw, 46px);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -1.1px;
    text-align: center;
  }

  .excellence-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 32px 24px;
    margin-top: 76px;
  }

  .excellence-card {
    position: relative;
    isolation: isolate;
    display: flex;
    min-width: 0;
    min-height: 108px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 22px 20px;
    border: 1px solid rgba(255, 255, 255, 0.105);
    border-radius: 15px;
    background:
      linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.018) 0%,
        rgba(255, 255, 255, 0.006) 100%
      );
    transition:
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 350ms ease,
      background 350ms ease,
      box-shadow 350ms ease;
  }

  .excellence-card::before {
    content: "";
    position: absolute;
    top: -80px;
    left: 50%;
    z-index: -2;
    width: 160px;
    height: 120px;
    border-radius: 50%;
    background: rgba(239, 203, 129, 0.12);
    filter: blur(50px);
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 350ms ease;
    pointer-events: none;
  }

  .excellence-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background:
      radial-gradient(
        circle at 50% 0%,
        rgba(238, 199, 117, 0.08),
        transparent 50%
      );
    opacity: 0;
    transition: opacity 350ms ease;
    pointer-events: none;
  }

  .excellence-card:hover {
    transform: translateY(-6px);
    border-color: rgba(231, 193, 113, 0.42);
    background:
      linear-gradient(
        145deg,
        rgba(224, 185, 105, 0.07) 0%,
        rgba(255, 255, 255, 0.015) 100%
      );
    box-shadow:
      0 14px 40px rgba(0, 0, 0, 0.3),
      0 0 22px rgba(223, 182, 103, 0.09),
      inset 0 0 28px rgba(223, 182, 103, 0.025);
  }

  .excellence-card:hover::before,
  .excellence-card:hover::after {
    opacity: 1;
  }

  .excellence-card--featured {
    grid-column: span 2;
  }

  .excellence-card__content {
    position: relative;
    z-index: 2;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .excellence-card__icon-wrapper {
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
  }

  .excellence-card__icon-wrapper::before {
    content: "";
    position: absolute;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(238, 203, 131, 0.18);
    filter: blur(18px);
    opacity: 0.55;
    transition:
      opacity 350ms ease,
      transform 350ms ease;
    pointer-events: none;
  }

  .excellence-card__icon {
    position: relative;
    z-index: 2;
    width: 31px;
    height: 31px;
    color: #f1cf87;
    stroke-width: 2.15;
    filter:
      drop-shadow(0 0 6px rgba(241, 207, 135, 0.18))
      drop-shadow(0 0 14px rgba(241, 207, 135, 0.06));
    transition:
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 350ms ease,
      color 350ms ease;
  }

  .excellence-card:hover .excellence-card__icon-wrapper::before {
    opacity: 1;
    transform: scale(1.25);
  }

  .excellence-card:hover .excellence-card__icon {
    color: #ffdd94;
    transform: translateY(-2px) scale(1.08);
    filter:
      drop-shadow(0 0 7px rgba(255, 217, 141, 0.5))
      drop-shadow(0 0 20px rgba(255, 217, 141, 0.25));
  }

  .excellence-card__title {
    margin: 0;
    color: rgba(255, 255, 255, 0.91);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.35;
    text-align: center;
    transition:
      color 300ms ease,
      text-shadow 300ms ease;
  }

  .excellence-card:hover .excellence-card__title {
    color: #ffffff;
    text-shadow: 0 0 18px rgba(255, 255, 255, 0.08);
  }

  /* ==========================
     SCROLL REVEAL ANIMATION
     ========================== */

  .excellence-reveal-title {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(30px);
    transition:
      opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .excellence-reveal-title.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }

  .excellence-reveal-card {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(34px) scale(0.97);
    transition:
      opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 720ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 720ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 350ms ease,
      background 350ms ease,
      box-shadow 350ms ease;
  }

  .excellence-reveal-card.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }

  .excellence-reveal-card.is-visible:hover {
    transform: translateY(-6px) scale(1);
  }

  /* ==========================
     RESPONSIVE
     ========================== */

  @media (max-width: 960px) {
    .excellence-section {
      padding: 72px 28px 64px;
    }

    .excellence-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
      margin-top: 58px;
    }

    .excellence-card--featured {
      grid-column: span 2;
    }
  }

  @media (max-width: 640px) {
    .excellence-section {
      padding: 64px 20px 54px;
    }

    .excellence-title {
      font-size: clamp(34px, 10vw, 42px);
      line-height: 1.12;
      letter-spacing: -0.7px;
    }

    .excellence-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 46px;
    }

    .excellence-card,
    .excellence-card--featured {
      grid-column: span 1;
      min-height: 102px;
    }

    .excellence-card__content {
      gap: 13px;
    }

    .excellence-card__icon {
      width: 29px;
      height: 29px;
    }

    .excellence-card__title {
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .excellence-reveal-title,
    .excellence-reveal-card {
      opacity: 1;
      filter: none;
      transform: none;
      transition: none;
    }

    .excellence-card,
    .excellence-card__icon,
    .excellence-card__icon-wrapper::before {
      transition: none;
    }
  }
`;

const Excellence = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentSection = sectionRef.current;

    if (!currentSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentSection);
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(currentSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="excellence-section"
      aria-labelledby="excellence-title"
    >
      <style data-component="excellence">{excellenceStyles}</style>

      <div className="excellence-container">
        <h2
          id="excellence-title"
          className={`excellence-title excellence-reveal-title ${
            isVisible ? "is-visible" : ""
          }`}
        >
          Standard of Excellence
        </h2>

        <div className="excellence-grid">
          {excellenceItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={[
                  "excellence-card",
                  "excellence-reveal-card",
                  item.featured ? "excellence-card--featured" : "",
                  isVisible ? "is-visible" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  transitionDelay: isVisible
                    ? `${160 + index * 90}ms`
                    : "0ms",
                }}
              >
                <div className="excellence-card__content">
                  <span
                    className="excellence-card__icon-wrapper"
                    aria-hidden="true"
                  >
                    <Icon className="excellence-card__icon" />
                  </span>

                  <h3 className="excellence-card__title">
                    {item.title}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Excellence;