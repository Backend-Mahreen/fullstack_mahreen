import Navbar from "../../components/Navbar/Tanya-MahreenNavbar";
import Footer from "../../components/Footer/Footer";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import tanyaMahreenBackground from "../../assets/TanyaMahreen/Home/bground-tanyamahreen.webp";

import Solution from "./sections/Solution";
import Workflow from "./sections/Workflow";
import Excellence from "./sections/Excellence";
import TheProcess from "./sections/TheProcess";
import OurWork from "./sections/OurWork";
import FAQ from "./sections/FAQ";

const tanyaMahreenStyles = `

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }

  .tanya-mahreen-page,
  .tanya-mahreen-page *,
  .tanya-mahreen-page *::before,
  .tanya-mahreen-page *::after {
    box-sizing: border-box;
  }

  .tanya-mahreen-page {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    overflow-x: hidden;
    background: #050505;
    color: #ffffff;
  }

  .tanya-mahreen-hero {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    padding: 132px clamp(28px, 6.7vw, 104px) 72px;
    background-image: url("${tanyaMahreenBackground}");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .tanya-mahreen-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(3, 3, 3, 0.9) 0%, rgba(3, 3, 3, 0.67) 47%, rgba(3, 3, 3, 0.18) 100%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 65%, rgba(0, 0, 0, 0.72) 100%);
  }

  .tanya-mahreen-hero::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    z-index: -1;
    height: 24%;
    background: linear-gradient(180deg, transparent 0%, #050505 100%);
    pointer-events: none;
  }

  .tanya-mahreen-hero__content {
    width: min(920px, 80vw);
  }

  .tanya-mahreen-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 29px;
    margin: 0 0 18px;
    padding: 6px 13px;
    border: 1px solid rgba(219, 177, 91, 0.44);
    border-radius: 999px;
    background: rgba(95, 66, 26, 0.24);
    color: #e0bd72;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.55px;
    text-transform: uppercase;
    backdrop-filter: blur(6px);
  }

  .tanya-mahreen-hero__eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    flex: 0 0 6px;
    border-radius: 50%;
    background: #e4bd69;
    box-shadow: 0 0 12px rgba(228, 189, 105, 0.72);
  }

  .tanya-mahreen-hero__title {
    max-width: 100%;
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(54px, 6.4vw, 96px);
    font-weight: 600;
    line-height: 0.96;
    letter-spacing: -3.2px;
  }

  .tanya-mahreen-hero__title span {
    display: block;
    white-space: nowrap;
  }

  .tanya-mahreen-hero__title-gold {
    color: #ddb66b;
  }

  .tanya-mahreen-hero__description {
    max-width: 670px;
    margin: 26px 0 0;
    color: rgba(255, 255, 255, 0.9);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: clamp(15px, 1.25vw, 19px);
    font-weight: 400;
    line-height: 1.55;
  }

  .tanya-mahreen-hero__actions {
    display: flex;
    align-items: center;
    gap: 22px;
    margin-top: 40px;
  }

  .tanya-mahreen-hero__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 168px;
    min-height: 49px;
    padding: 12px 25px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .tanya-mahreen-hero__button:hover,
  .tanya-mahreen-hero__button:focus-visible {
    transform: translateY(-2px);
  }

  .tanya-mahreen-hero__button:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 4px;
  }

  .tanya-mahreen-hero__button--primary {
    background: linear-gradient(135deg, #efd083 0%, #d5a94f 100%);
    border-color: rgba(255, 235, 177, 0.72);
    color: #2a2114;
    box-shadow: 0 8px 28px rgba(213, 169, 79, 0.22);
  }

  .tanya-mahreen-hero__button--primary:hover {
    box-shadow: 0 10px 34px rgba(213, 169, 79, 0.36);
  }

  .tanya-mahreen-hero__button--outline {
    background: rgba(8, 8, 8, 0.2);
    border-color: rgba(255, 255, 255, 0.34);
    color: #ffffff;
    backdrop-filter: blur(8px);
  }

  .tanya-mahreen-hero__button--outline:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.68);
  }

  @media (max-width: 920px) {
    .tanya-mahreen-hero {
      min-height: 760px;
      padding-top: 124px;
      background-position: 60% center;
    }

    .tanya-mahreen-hero__content {
      width: min(800px, 86vw);
    }

    .tanya-mahreen-hero__title {
      font-size: clamp(48px, 7.5vw, 76px);
      letter-spacing: -2.4px;
    }
  }

  @media (max-width: 640px) {
    .tanya-mahreen-hero {
      align-items: flex-end;
      min-height: 720px;
      padding: 110px 20px 62px;
      background-position: 64% center;
    }

    .tanya-mahreen-hero::before {
      background:
        linear-gradient(90deg, rgba(3, 3, 3, 0.7) 0%, rgba(3, 3, 3, 0.33) 100%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.32) 45%, rgba(0, 0, 0, 0.94) 100%);
    }

    .tanya-mahreen-hero__content {
      width: 100%;
    }

    .tanya-mahreen-hero__eyebrow {
      margin-bottom: 14px;
      font-size: 14px;
    }

    .tanya-mahreen-hero__title {
      font-size: clamp(34px, 10vw, 54px);
      line-height: 1;
      letter-spacing: -1.8px;
    }

    .tanya-mahreen-hero__description {
      margin-top: 20px;
      font-size: 14px;
      line-height: 1.6;
    }

    .tanya-mahreen-hero__actions {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      margin-top: 28px;
    }

    .tanya-mahreen-hero__button {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tanya-mahreen-hero__button,
    .animate-fade-in-up {
      transition: none;
      animation: none;
      opacity: 1;
    }
  }
`;

const TanyaMahreen = () => {
  return (
    <div className="tanya-mahreen-page">
      <style data-component="tanya-mahreen">{tanyaMahreenStyles}</style>
      <Navbar />

      <main>
        <section
          className="tanya-mahreen-hero"
          aria-labelledby="tanya-mahreen-title"
        >
          <div className="tanya-mahreen-hero__content">
            <p className="tanya-mahreen-hero__eyebrow animate-fade-in-up">
              Tanya Mahreen Solutions
            </p>

            <h1 className="tanya-mahreen-hero__title animate-fade-in-up delay-100" id="tanya-mahreen-title">
              <span>Professional Digital</span>
              <span>Solutions for</span>
              <span className="tanya-mahreen-hero__title-gold">
                Modern Business
              </span>
            </h1>

            <p className="tanya-mahreen-hero__description animate-fade-in-up delay-200">
              Tanya Mahreen membantu UMKM, startup, brand, organisasi, dan
              perusahaan berkembang melalui layanan digital terintegrasi
              untuk pertumbuhan dan dampak maksimal.
            </p>

            <div className="tanya-mahreen-hero__actions animate-fade-in-up delay-300">
              <a
                className="tanya-mahreen-hero__button tanya-mahreen-hero__button--primary"
                href="/tanya-mahreen/konsultasi"
              >
                Konsultasi Gratis
              </a>
              <a
                className="tanya-mahreen-hero__button tanya-mahreen-hero__button--outline"
                href="/portofolio"
              >
                Lihat Portofolio
              </a>
            </div>
          </div>
        </section>
        
        <Solution />
        <Workflow />
        <Excellence />
        <TheProcess />
        <OurWork />
        <FAQ />

        <ClosingSection />
      </main>

      <Footer />
    </div>
  );
};

export default TanyaMahreen;
