import { type MouseEvent } from "react";
import Navbar from "../../components/Navbar/InternshipNavbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import internshipHeroBackground from "../../assets/Internship/bground-intern.webp";
import Number from "./Sections/Number";
import Jalur from "./Sections/Jalur";
import Spesialisasi from "./Sections/Spesialisasi";
import MengapaMahreen from "./Sections/WhyMahreen";
import AdmissionWindow from "./Sections/AdmissionWindow";
import Alumni from "./Sections/Alumni";
import Showcase from "./Sections/Showcase";
import Daftar from "./Sections/Daftar";

const studioStyles = `

  .studio-page {
    width: 100%;
    min-height: 100vh;
    background: #050505;
    color: #ffffff;
  }

  .studio-page,
  .studio-page *,
  .studio-page *::before,
  .studio-page *::after {
    box-sizing: border-box;
  }


  @keyframes internshipHeroBackgroundEnter {
    from {
      opacity: 0;
      transform: scale(1.035);
    }

    to {
      opacity: 1;
      transform: scale(1.01);
    }
  }

  @keyframes internshipHeroContentEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .studio-hero {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 118px 24px 68px;
    background: #0b0b0b;
  }

  .studio-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url("${internshipHeroBackground}");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 0;
    transform: scale(1.035);
    filter: brightness(1.34) saturate(1.08) contrast(1.01);
    animation: internshipHeroBackgroundEnter 900ms ease-out both;
  }

  .studio-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(180deg, rgba(5, 5, 5, 0.30) 0%, rgba(5, 5, 5, 0.16) 44%, rgba(5, 5, 5, 0.46) 100%),
      linear-gradient(90deg, rgba(5, 5, 5, 0.10) 0%, rgba(5, 5, 5, 0.00) 50%, rgba(5, 5, 5, 0.10) 100%);
  }

  .studio-hero__shade {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(
      circle at 50% 43%,
      rgba(255, 255, 255, 0.025) 0%,
      rgba(255, 255, 255, 0.008) 28%,
      transparent 58%
    );
    pointer-events: none;
  }

  .studio-hero__inner {
    width: min(100%, 820px);
    margin: 0 auto;
    text-align: center;
  }

  .studio-hero__title {
    margin: 0;
    opacity: 0;
    animation: internshipHeroContentEnter 560ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(54px, 6.5vw, 82px);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.045em;
    text-wrap: balance;
    text-shadow: 0 8px 30px rgba(0, 0, 0, 0.38);
  }

  .studio-hero__title-line {
    display: block;
  }

  .studio-hero__title-line--gold {
    margin-top: 4px;
    color: #f0c979;
  }

  .studio-hero__description {
    max-width: 700px;
    opacity: 0;
    animation: internshipHeroContentEnter 560ms cubic-bezier(0.22, 1, 0.36, 1) 210ms both;
    margin: 24px auto 0;
    color: rgba(255, 255, 255, 0.9);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: clamp(16px, 1.55vw, 20px);
    font-weight: 400;
    line-height: 1.48;
    letter-spacing: -0.015em;
    text-shadow: 0 5px 18px rgba(0, 0, 0, 0.46);
  }

  .studio-hero__actions {
    display: flex;
    opacity: 0;
    animation: internshipHeroContentEnter 560ms cubic-bezier(0.22, 1, 0.36, 1) 320ms both;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 72px;
  }

  .studio-hero__button {
    min-width: 176px;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border-radius: 999px;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease,
      box-shadow 180ms ease;
  }

  .studio-hero__button:hover,
  .studio-hero__button:focus-visible {
    transform: translateY(-2px);
  }

  .studio-hero__button:focus-visible {
    outline: 2px solid rgba(240, 201, 121, 0.8);
    outline-offset: 4px;
  }

  .studio-hero__button--primary {
    border: 1px solid #f0c979;
    background: #f0c979;
    color: #101010;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  }

  .studio-hero__button--primary:hover,
  .studio-hero__button--primary:focus-visible {
    border-color: #f6d58d;
    background: #f6d58d;
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.32);
  }

  .studio-hero__button--secondary {
    border: 1px solid rgba(240, 201, 121, 0.52);
    background: rgba(15, 15, 15, 0.2);
    color: #f0c979;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  .studio-hero__button--secondary:hover,
  .studio-hero__button--secondary:focus-visible {
    border-color: #f0c979;
    background: rgba(240, 201, 121, 0.09);
    color: #f6d58d;
  }


  @media (prefers-reduced-motion: reduce) {
    .studio-hero::before,
    .studio-hero__title,
    .studio-hero__description,
    .studio-hero__actions {
      opacity: 1;
      animation: none;
    }

    .studio-hero::before {
      transform: scale(1.01);
    }

    .studio-hero__title,
    .studio-hero__description,
    .studio-hero__actions {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    .studio-hero {
      min-height: 760px;
      padding: 112px 20px 70px;
    }

    .studio-hero::before {
      background-position: 55% center;
    }

    .studio-hero::after {
      background:
        linear-gradient(180deg, rgba(5, 5, 5, 0.34) 0%, rgba(5, 5, 5, 0.22) 44%, rgba(5, 5, 5, 0.52) 100%),
        linear-gradient(90deg, rgba(5, 5, 5, 0.10) 0%, rgba(5, 5, 5, 0.01) 50%, rgba(5, 5, 5, 0.10) 100%);
    }

    .studio-hero__title {
      font-size: clamp(48px, 12vw, 68px);
      line-height: 1;
    }

    .studio-hero__description {
      max-width: 590px;
      margin-top: 22px;
      font-size: 16px;
      line-height: 1.55;
    }

    .studio-hero__actions {
      margin-top: 52px;
    }
  }

  @media (max-width: 520px) {
    .studio-hero {
      min-height: 700px;
      padding: 104px 18px 58px;
    }

    .studio-hero::before {
      background-position: 58% center;
    }

    .studio-hero__title {
      font-size: clamp(42px, 13.5vw, 58px);
      line-height: 1.02;
    }

    .studio-hero__description {
      max-width: 360px;
      margin-top: 20px;
      font-size: 15px;
      line-height: 1.56;
    }

    .studio-hero__actions {
      flex-direction: column;
      gap: 12px;
      margin-top: 40px;
    }

    .studio-hero__button {
      width: min(100%, 220px);
      min-height: 47px;
    }
  }
`;

const Internship = () => {
  const scrollToProgram = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.replaceState(window.history.state, "", "#jalur-program");
    document.getElementById("jalur-program")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      
      <style data-component="studio-page">{studioStyles}</style>
      <Navbar />

      <main className="studio-page">
        <section className="studio-hero" aria-labelledby="studio-title">
          <span className="studio-hero__shade" aria-hidden="true" />

          <div className="studio-hero__inner">
            <h1 className="studio-hero__title" id="studio-title">
              <span className="studio-hero__title-line">Belajar. Berkarya.</span>
              <span className="studio-hero__title-line studio-hero__title-line--gold">
                Bertumbuh.
              </span>
            </h1>

            <p className="studio-hero__description">
              Mahreen Indonesia Internship menghadirkan pengalaman belajar berbasis
              proyek nyata yang mempersiapkan talenta muda untuk dunia profesional
              dengan standar industri global.
            </p>

            <div className="studio-hero__actions" aria-label="Aksi program internship">
              <a
                className="studio-hero__button studio-hero__button--primary"
                href="/internship/form"
              >
                Daftar Internship
              </a>

              <a
                className="studio-hero__button studio-hero__button--secondary"
                href="#jalur-program"
                onClick={scrollToProgram}
              >
                Lihat Program
              </a>
            </div>
          </div>
        </section>

       <Number />
        <Jalur />
        <Spesialisasi />
        <MengapaMahreen />
        <AdmissionWindow />
        <Alumni />
        <Showcase />
        <Daftar />

        <ClosingSection />
        <Footer />
      </main>
    </>
  );
};

export default Internship;
