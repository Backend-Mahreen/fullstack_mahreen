import { useEffect, useRef, useState, type ReactNode } from "react";

const GlobeIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <path d="M4 12h16" />
    <path d="M12 4a11 11 0 0 1 0 16" />
    <path d="M12 4a11 11 0 0 0 0 16" />
  </svg>
);

const GraphicIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 15.5 15.5 5l3.5 3.5L8.5 19H5v-3.5Z" />
    <path d="m13.5 7 3.5 3.5" />
    <path d="M4.5 7.5 8 4" />
    <path d="M16 20h4" />
  </svg>
);

const BrandingIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="6" width="16" height="12" rx="1.6" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </svg>
);

const UiUxIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.5 6.5h11v8h-11z" />
    <path d="M7 18h7" />
    <path d="M10.5 14.5V18" />
    <rect x="16" y="10" width="4.5" height="8" rx="1" />
  </svg>
);

const MarketingIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 13h3l8 4V7l-8 4H5v2Z" />
    <path d="M8 13.5 9.5 18" />
    <path d="M19 9.5 21 8" />
    <path d="M19.5 12h2" />
    <path d="M19 14.5 21 16" />
  </svg>
);

const CameraIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 8h3l1.4-2h5.2L16 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 8Z" />
    <circle cx="12" cy="13.5" r="3" />
  </svg>
);

const VideoIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="7" width="16" height="12" rx="1.6" />
    <path d="M4 11h16" />
    <path d="M8 7 6.5 11" />
    <path d="M13 7 11.5 11" />
    <path d="M18 7 16.5 11" />
  </svg>
);

const BusinessIcon = () => (
  <svg className="layanan__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 18.5v-2.2A6.2 6.2 0 1 1 17 10.8v2l2 2h-2.8v3.7H13" />
    <circle cx="12" cy="10.8" r="1.4" />
    <path d="M12 7.6v1.2" />
    <path d="M12 12.8V14" />
    <path d="M8.8 10.8H10" />
    <path d="M14 10.8h1.2" />
  </svg>
);

type LayananItem = {
  id: string;
  icon: ReactNode;
  label: string;
  href: string;
};

const layananItems: LayananItem[] = [
  {
    id: "web",
    icon: <GlobeIcon />,
    label: "Website\nDevelopment",
    href: "/tanya-mahreen?service=website-development",
  },
  {
    id: "graphic",
    icon: <GraphicIcon />,
    label: "Graphic Design",
    href: "/tanya-mahreen?service=graphic-design",
  },
  {
    id: "branding",
    icon: <BrandingIcon />,
    label: "Branding & Identity",
    href: "/tanya-mahreen?service=branding-identity",
  },
  {
    id: "uiux",
    icon: <UiUxIcon />,
    label: "UI/UX Design",
    href: "/tanya-mahreen?service=ui-ux-design",
  },
  {
    id: "digital",
    icon: <MarketingIcon />,
    label: "Digital Marketing",
    href: "/tanya-mahreen?service=digital-marketing",
  },
  {
    id: "photo",
    icon: <CameraIcon />,
    label: "Photography",
    href: "/tanya-mahreen?service=photography",
  },
  {
    id: "video",
    icon: <VideoIcon />,
    label: "Videography",
    href: "/tanya-mahreen?service=videography",
  },
  {
    id: "business",
    icon: <BusinessIcon />,
    label: "Business Strategy",
    href: "/tanya-mahreen?service=business-strategy",
  },
];

const layananStyles = `
  .layanan {
    width: 100%;
    background-color: #050505;
    padding: 74px 24px 96px;
  }

  .layanan .layanan__container {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
  }

  .layanan .layanan__header {
    max-width: 660px;
    margin: 0 auto 48px;
    text-align: center;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 460ms ease, transform 460ms ease;
    will-change: opacity, transform;
  }

  .layanan.is-visible .layanan__header {
    opacity: 1;
    transform: translateY(0);
  }

  .layanan .layanan__title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(36px, 3.2vw, 48px);
    line-height: 1.12;
    font-weight: 700;
    color: #d6a35c;
    margin: 0 0 14px;
    letter-spacing: -0.02em;
  }

  .layanan .layanan__subtitle {
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(16px, 1.25vw, 18px);
    line-height: 1.45;
    font-weight: 400;
    color: #c4c1bc;
    margin: 0 auto;
    max-width: 580px;
  }

  .layanan .layanan__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }

  .layanan .layanan__card {
    min-height: 222px;
    padding: 40px 22px 36px;
    background: #0d0d0e;
    border: 1px solid #222222;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    color: #d8af61;
    text-decoration: none;
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(18px) scale(0.985);
    transition:
      opacity 480ms ease,
      transform 480ms ease,
      border-color 180ms ease,
      background-color 180ms ease;
    will-change: opacity, transform;
  }

  .layanan.is-visible .layanan__card {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .layanan.is-visible .layanan__card:hover {
    background-color: #101010;
    border-color: #2f2f2f;
    transform: translateY(-2px) scale(1);
  }

  .layanan .layanan__icon-wrapper {
    width: 62px;
    height: 62px;
    border-radius: 999px;
    background: #211f18;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .layanan .layanan__icon {
    width: 25px;
    height: 25px;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .layanan .layanan__label {
    font-family: "Inter", Arial, sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #f4f2ed;
    text-align: center;
    line-height: 1.28;
    letter-spacing: -0.035em;
    margin: 0;
    white-space: pre-line;
  }

  @media (max-width: 980px) {
    .layanan {
      padding: 64px 20px 84px;
    }

    .layanan .layanan__container {
      max-width: 760px;
    }

    .layanan .layanan__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }
  }

  @media (max-width: 560px) {
    .layanan {
      padding: 54px 16px 70px;
    }

    .layanan .layanan__header {
      margin-bottom: 34px;
    }

    .layanan .layanan__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .layanan .layanan__card {
      min-height: 188px;
      padding: 32px 18px 30px;
      gap: 24px;
    }

    .layanan .layanan__icon-wrapper {
      width: 56px;
      height: 56px;
    }

    .layanan .layanan__label {
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .layanan .layanan__header,
    .layanan .layanan__card,
    .layanan.is-visible .layanan__header,
    .layanan.is-visible .layanan__card,
    .layanan.is-visible .layanan__card:hover {
      opacity: 1;
      transform: none;
      transition: none;
      will-change: auto;
    }
  }
`;

const LayananProfesional = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.16,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style data-component="layanan-profesional">{layananStyles}</style>

      <section
        className={`layanan${isVisible ? " is-visible" : ""}`}
        id="layanan"
        ref={sectionRef}
        aria-labelledby="layanan-title"
      >
        <div className="layanan__container">
          <div className="layanan__header">
            <h2 className="layanan__title" id="layanan-title">
              Layanan Profesional
            </h2>
            <p className="layanan__subtitle">
              Solusi digital dan kreatif elit yang dibuat dengan presisi dan
              tujuan strategis.
            </p>
          </div>

          <div className="layanan__grid">
            {layananItems.map((item, index) => (
              <a
                className="layanan__card"
                key={item.id}
                href={item.href}
                aria-label={`Lihat layanan ${item.label.replace("\n", " ")} di Tanya Mahreen`}
                style={{ transitionDelay: isVisible ? `${index * 55}ms` : "0ms" }}
              >
                <div className="layanan__icon-wrapper">{item.icon}</div>
                <p className="layanan__label">{item.label}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LayananProfesional;
