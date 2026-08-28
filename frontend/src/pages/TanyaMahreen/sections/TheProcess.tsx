import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import processMeetingImage from "../../../assets/TanyaMahreen/Home/process-meeting.webp";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Diskusi & Konsultasi",
    description:
      "Memahami tantangan, target audiens, dan tujuan jangka panjang bisnis Anda secara mendalam.",
  },
  {
    number: "02",
    title: "Perencanaan Strategis",
    description:
      "Menyusun blueprint, desain, dan roadmap teknis yang selaras dengan visi brand Anda.",
  },
  {
    number: "03",
    title: "Produksi & Eksekusi",
    description:
      "Tim ahli kami merealisasikan konsep menjadi produk digital berkualitas tinggi secara iteratif.",
  },
  {
    number: "04",
    title: "Evaluasi & Serah Terima",
    description:
      "Finalisasi proyek, testing menyeluruh, dan pendampingan pasca-produksi untuk hasil optimal.",
  },
];

const theProcessStyles = `
  .the-process-section,
  .the-process-section *,
  .the-process-section *::before,
  .the-process-section *::after {
    box-sizing: border-box;
  }

  .the-process-section {
    position: relative;
    isolation: isolate;
    width: 100%;
    overflow: hidden;
    padding: 72px 24px 70px;
    background:
      radial-gradient(
        circle at 78% 42%,
        rgba(221, 180, 96, 0.035) 0%,
        transparent 34%
      ),
      #0b0b0b;
    color: #ffffff;
  }

  .the-process-section::before {
    content: "";
    position: absolute;
    top: 18%;
    right: 7%;
    z-index: -1;
    width: 460px;
    height: 460px;
    border-radius: 50%;
    background: rgba(220, 180, 95, 0.025);
    filter: blur(120px);
    pointer-events: none;
  }

  .the-process-container {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(420px, 0.98fr);
    gap: 82px;
    width: 100%;
    max-width: 1118px;
    margin: 0 auto;
    align-items: center;
  }

  /* ==========================
     LEFT CONTENT
     ========================== */

  .the-process-content {
    min-width: 0;
  }

  .the-process-eyebrow {
    margin: 0 0 17px;
    color: #d8b15e;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 3.3px;
    text-transform: uppercase;
  }

  .the-process-title {
    max-width: 520px;
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(40px, 4vw, 51px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -1.4px;
  }

  .the-process-description {
    max-width: 610px;
    margin: 27px 0 0;
    color: rgba(255, 255, 255, 0.58);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.75;
  }

  /* ==========================
     TIMELINE
     ========================== */

  .the-process-timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 28px;
    margin-top: 43px;
  }

  .the-process-timeline::before {
    content: "";
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 21px;
    width: 1px;
    background:
      linear-gradient(
        to bottom,
        rgba(218, 178, 92, 0.3),
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.08)
      );
  }

  .the-process-step {
    position: relative;
    display: grid;
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 17px;
    align-items: start;
  }

  .the-process-step__number {
    position: relative;
    z-index: 2;
    display: flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 50%;
    background: #202020;
    color: rgba(255, 255, 255, 0.72);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    transition:
      border-color 320ms ease,
      background 320ms ease,
      color 320ms ease,
      box-shadow 320ms ease,
      transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .the-process-step:first-child .the-process-step__number {
    border-color: rgba(214, 171, 77, 0.58);
    background:
      linear-gradient(
        145deg,
        rgba(218, 175, 83, 0.13),
        rgba(218, 175, 83, 0.03)
      ),
      #171717;
    color: #e3bd6c;
    box-shadow:
      0 0 18px rgba(213, 169, 77, 0.06),
      inset 0 0 14px rgba(213, 169, 77, 0.025);
  }

  .the-process-step:hover .the-process-step__number {
    border-color: rgba(229, 188, 98, 0.55);
    background:
      linear-gradient(
        145deg,
        rgba(226, 183, 89, 0.14),
        rgba(226, 183, 89, 0.03)
      ),
      #1a1a1a;
    color: #efc875;
    transform: scale(1.06);
    box-shadow:
      0 0 22px rgba(222, 177, 81, 0.12),
      inset 0 0 16px rgba(222, 177, 81, 0.04);
  }

  .the-process-step__body {
    padding-top: 3px;
  }

  .the-process-step__title {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.45;
    transition:
      color 300ms ease,
      text-shadow 300ms ease;
  }

  .the-process-step__description {
    max-width: 530px;
    margin: 8px 0 0;
    color: rgba(255, 255, 255, 0.56);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.6;
  }

  .the-process-step:hover .the-process-step__title {
    color: #ffffff;
    text-shadow: 0 0 18px rgba(255, 255, 255, 0.06);
  }

  /* ==========================
     RIGHT VISUAL
     ========================== */

  .the-process-visual {
    position: relative;
    min-width: 0;
    padding: 25px 22px 26px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 19px;
    background:
      linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.018),
        rgba(255, 255, 255, 0.006)
      ),
      #101010;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 0 30px rgba(255, 255, 255, 0.006);
    transition:
      border-color 400ms ease,
      box-shadow 400ms ease,
      transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .the-process-visual::before {
    content: "";
    position: absolute;
    inset: -1px;
    z-index: -1;
    border-radius: inherit;
    background:
      radial-gradient(
        circle at 50% 0%,
        rgba(225, 183, 95, 0.09),
        transparent 44%
      );
    opacity: 0;
    filter: blur(18px);
    transition: opacity 400ms ease;
    pointer-events: none;
  }

  .the-process-visual:hover {
    transform: translateY(-4px);
    border-color: rgba(218, 175, 82, 0.2);
    box-shadow:
      0 30px 75px rgba(0, 0, 0, 0.32),
      0 0 30px rgba(216, 173, 80, 0.045),
      inset 0 0 30px rgba(255, 255, 255, 0.008);
  }

  .the-process-visual:hover::before {
    opacity: 1;
  }

  .the-process-image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1.12 / 1;
    overflow: hidden;
    border-radius: 11px;
    background: #151515;
  }

  .the-process-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.68) saturate(0.8);
    transform: scale(1.01);
    transition:
      transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 700ms ease;
  }

  .the-process-image-wrapper::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.04) 0%,
        rgba(0, 0, 0, 0.02) 45%,
        rgba(0, 0, 0, 0.2) 100%
      );
    pointer-events: none;
  }

  .the-process-visual:hover .the-process-image {
    transform: scale(1.045);
    filter: brightness(0.75) saturate(0.88);
  }

  /* ==========================
     FLOATING STAT CARD
     ========================== */

  .the-process-stat-card {
    position: absolute;
    bottom: -27px;
    left: -27px;
    z-index: 4;
    width: 196px;
    min-height: 100px;
    padding: 19px 19px 16px;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 12px;
    background:
      linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.028),
        rgba(255, 255, 255, 0.008)
      ),
      rgba(17, 17, 17, 0.96);
    box-shadow:
      0 18px 45px rgba(0, 0, 0, 0.42),
      0 0 24px rgba(213, 171, 81, 0.025);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition:
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 350ms ease,
      box-shadow 350ms ease;
  }

  .the-process-stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(224, 184, 96, 0.26);
    box-shadow:
      0 22px 52px rgba(0, 0, 0, 0.48),
      0 0 28px rgba(218, 176, 88, 0.08);
  }

  .the-process-stat-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .the-process-stat-icon {
    position: relative;
    display: flex;
    width: 31px;
    height: 31px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(218, 178, 92, 0.24);
    border-radius: 50%;
    background: rgba(212, 170, 78, 0.09);
    color: #d9b15d;
    box-shadow:
      0 0 15px rgba(218, 178, 92, 0.07),
      inset 0 0 12px rgba(218, 178, 92, 0.03);
  }

  .the-process-stat-icon svg {
    width: 17px;
    height: 17px;
    stroke-width: 2;
    filter: drop-shadow(0 0 6px rgba(218, 178, 92, 0.16));
  }

  .the-process-stat-value {
    margin: 0;
    color: #ffffff;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
  }

  .the-process-stat-description {
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.5);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.45;
  }

  /* ==========================
     REVEAL ANIMATIONS
     ========================== */

  .the-process-reveal {
    opacity: 0;
    filter: blur(7px);
    transform: translateY(28px);
    transition:
      opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .the-process-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }

  .the-process-step-reveal {
    opacity: 0;
    filter: blur(5px);
    transform: translateX(-22px);
    transition:
      opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .the-process-step-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateX(0);
  }

  .the-process-visual-reveal {
    opacity: 0;
    filter: blur(8px);
    transform: translateX(35px) scale(0.97);
    transition:
      opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 900ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .the-process-visual-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateX(0) scale(1);
  }

  .the-process-visual-reveal.is-visible:hover {
    transform: translateY(-4px) scale(1);
  }

  .the-process-stat-reveal {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(18px) scale(0.94);
    transition:
      opacity 750ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 750ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .the-process-stat-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }

  .the-process-stat-reveal.is-visible:hover {
    transform: translateY(-5px) scale(1);
  }

  /* ==========================
     RESPONSIVE TABLET
     ========================== */

  @media (max-width: 1000px) {
    .the-process-section {
      padding: 76px 30px 90px;
    }

    .the-process-container {
      grid-template-columns: 1fr;
      gap: 64px;
      max-width: 760px;
    }

    .the-process-content {
      max-width: 680px;
    }

    .the-process-title {
      max-width: 600px;
    }

    .the-process-visual {
      width: calc(100% - 30px);
      max-width: 620px;
      margin: 0 auto;
    }

    .the-process-stat-card {
      left: -22px;
    }
  }

  /* ==========================
     RESPONSIVE MOBILE
     ========================== */

  @media (max-width: 640px) {
    .the-process-section {
      padding: 64px 20px 92px;
    }

    .the-process-container {
      gap: 54px;
    }

    .the-process-eyebrow {
      margin-bottom: 15px;
      font-size: 14px;
      letter-spacing: 2.8px;
    }

    .the-process-title {
      font-size: clamp(38px, 11vw, 48px);
      line-height: 1.06;
      letter-spacing: -1px;
    }

    .the-process-description {
      margin-top: 22px;
      font-size: 14px;
      line-height: 1.7;
    }

    .the-process-timeline {
      gap: 27px;
      margin-top: 38px;
    }

    .the-process-step {
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 14px;
    }

    .the-process-timeline::before {
      left: 19px;
    }

    .the-process-step__number {
      width: 39px;
      height: 39px;
      font-size: 14px;
    }

    .the-process-step__title {
      font-size: 15px;
    }

    .the-process-step__description {
      margin-top: 6px;
      font-size: 14px;
      line-height: 1.55;
    }

    .the-process-visual {
      width: 100%;
      padding: 15px;
      border-radius: 16px;
    }

    .the-process-image-wrapper {
      aspect-ratio: 0.95 / 1;
    }

    .the-process-stat-card {
      bottom: -48px;
      left: 14px;
      width: calc(100% - 28px);
      min-height: auto;
      padding: 16px 17px;
    }

    .the-process-stat-description {
      max-width: 300px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .the-process-reveal,
    .the-process-step-reveal,
    .the-process-visual-reveal,
    .the-process-stat-reveal {
      opacity: 1;
      filter: none;
      transform: none;
      transition: none;
    }

    .the-process-step__number,
    .the-process-visual,
    .the-process-image,
    .the-process-stat-card {
      transition: none;
    }
  }
`;

const TheProcess = () => {
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
        threshold: 0.16,
        rootMargin: "0px 0px -70px 0px",
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
      className="the-process-section"
      aria-labelledby="the-process-title"
    >
      <style data-component="the-process">{theProcessStyles}</style>

      <div className="the-process-container">
        {/* LEFT CONTENT */}
        <div className="the-process-content">
          <p
            className={`the-process-eyebrow the-process-reveal ${
              isVisible ? "is-visible" : ""
            }`}
            style={{
              transitionDelay: isVisible ? "50ms" : "0ms",
            }}
          >
            The Process
          </p>

          <h2
            id="the-process-title"
            className={`the-process-title the-process-reveal ${
              isVisible ? "is-visible" : ""
            }`}
            style={{
              transitionDelay: isVisible ? "130ms" : "0ms",
            }}
          >
            Bagaimana Kami
            <br />
            Membangun Bisnis Anda
          </h2>

          <p
            className={`the-process-description the-process-reveal ${
              isVisible ? "is-visible" : ""
            }`}
            style={{
              transitionDelay: isVisible ? "220ms" : "0ms",
            }}
          >
            Workflow transparan yang memastikan setiap detail kebutuhan bisnis
            Anda terpenuhi melalui standar kualitas Tanya Mahreen.
          </p>

          <div className="the-process-timeline">
            {processSteps.map((step, index) => (
              <article
                key={step.number}
                className={`the-process-step the-process-step-reveal ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{
                  transitionDelay: isVisible
                    ? `${330 + index * 115}ms`
                    : "0ms",
                }}
              >
                <div className="the-process-step__number">
                  {step.number}
                </div>

                <div className="the-process-step__body">
                  <h3 className="the-process-step__title">
                    {step.title}
                  </h3>

                  <p className="the-process-step__description">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div
          className={`the-process-visual the-process-visual-reveal ${
            isVisible ? "is-visible" : ""
          }`}
          style={{
            transitionDelay: isVisible ? "260ms" : "0ms",
          }}
        >
          <img width="476" height="412" decoding="async"
             src={processMeetingImage}
             alt="Tim Tanya Mahreen sedang berdiskusi dan merencanakan proyek bisnis"
             className="the-process-image"
             loading="lazy"
         />

          <div
            className={`the-process-stat-card the-process-stat-reveal ${
              isVisible ? "is-visible" : ""
            }`}
            style={{
              transitionDelay: isVisible ? "720ms" : "0ms",
            }}
          >
            <div className="the-process-stat-header">
              <span
                className="the-process-stat-icon"
                aria-hidden="true"
              >
                <BadgeCheck />
              </span>

              <p className="the-process-stat-value">
                100+ Proyek
              </p>
            </div>

            <p className="the-process-stat-description">
              Telah berhasil diselesaikan dengan tingkat kepuasan mitra yang
              tinggi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheProcess;