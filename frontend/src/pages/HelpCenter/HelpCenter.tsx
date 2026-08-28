import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import SearchHeader from "./sections/SearchHeader";
import LayananUtama from "./sections/LayananUtama";
import ArtikelStatus from "./sections/ArtikelStatus";
import KategoriVideo from "./sections/KategoriVideo";
import FAQDownload from "./sections/FAQDownload";
import HubungiLapor from "./sections/HubungiLapor";

const hcStyles = `

  .hc-page {
    background-color: #050505;
    color: #ffffff;
    font-family: "Inter", sans-serif;
    min-height: 100vh;
    padding: calc(var(--navbar-height, 78px) + 40px) 24px 80px;
    box-sizing: border-box;
  }

  .hc-page *, .hc-page *::before, .hc-page *::after {
    box-sizing: border-box;
  }

  .hc-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 80px; /* Jarak antar section besar */
  }

  /* --- Global Typography & Colors --- */
  .text-gold { color: #d8b66f; }
  .text-muted { color: rgba(255, 255, 255, 0.6); }
  .text-white { color: #ffffff; }
  .bg-card { background-color: #111111; }
  .border-card { border: 1px solid rgba(255, 255, 255, 0.05); }

  .hc-section-title {
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  .hc-section-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 32px 0;
  }

  /* --- Search Header --- */
  .hc-hero { text-align: center; margin-bottom: 24px; }
  .hc-hero h1 {
    font-size: clamp(36px, 5vw, 48px);
    font-weight: 700;
    margin: 0 0 16px 0;
  }
  .hc-hero p { font-size: 15px; margin: 0 0 40px 0; }
  
  .hc-search-box {
    max-width: 700px;
    margin: 0 auto 24px auto;
    position: relative;
  }
  .hc-search-box input {
    width: 100%;
    background: #151515;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 99px;
    padding: 18px 24px 18px 56px;
    color: #fff;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
  }
  .hc-search-box input:focus { border-color: #d8b66f; }
  .hc-search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.4);
  }
  .hc-popular-tags {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 7px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }
  .hc-popular-item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: 100%;
  }
  .hc-popular-item i {
    color: rgba(255, 255, 255, 0.8);
    font-style: normal;
  }
  .hc-popular-tags a {
    max-width: 100%;
    padding: 6px 10px;
    border: 1px solid rgba(216, 182, 111, 0.2);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.82);
    background: rgba(216, 182, 111, 0.04);
    font: inherit;
    line-height: 1.35;
    text-align: center;
    cursor: pointer;
    transition: color 220ms ease, background 220ms ease, border-color 220ms ease, transform 220ms ease;
  }
  .hc-popular-tags a:hover,
  .hc-popular-tags a:focus-visible {
    color: #080603;
    background: #d8b66f;
    border-color: #e6c883;
    transform: translateY(-2px);
  }
  .hc-search-result {
    min-height: 20px;
    margin: 14px 0 0;
    color: #d8b66f;
    font-size: 14px;
  }
  #help-services,
  #help-articles,
  #help-categories,
  #help-downloads,
  #help-contact { scroll-margin-top: calc(var(--navbar-height, 74px) + 22px); }

  /* --- Layanan Utama (8 Cards) --- */
  .hc-grid-8 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (min-width: 768px) { .hc-grid-8 { grid-template-columns: repeat(4, 1fr); } }
  
  .hc-service-card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background: linear-gradient(145deg, #111111, #0b0b0b);
    border: 1px solid rgba(216, 182, 111, 0.1);
    border-radius: 14px;
    padding: 32px 20px;
    text-align: center;
    transition: transform 260ms ease, background 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }
  .hc-service-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(115deg, transparent 25%, rgba(216, 182, 111, 0.13) 48%, transparent 72%);
    transform: translateX(-120%);
    transition: transform 650ms ease;
  }
  .hc-service-card:hover {
    background: #15130f;
    border-color: rgba(216, 182, 111, 0.5);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34), 0 0 30px rgba(216, 182, 111, 0.08);
    transform: translateY(-7px);
  }
  .hc-service-card:hover::after { transform: translateX(120%); }
  .hc-service-card:hover .hc-service-icon { transform: translateY(-3px) scale(1.08); }
  .hc-service-icon {
    color: #d8b66f;
    margin-bottom: 16px;
    display: inline-block;
    transition: transform 260ms ease, filter 260ms ease;
  }
  .hc-service-card h3 { font-size: 15px; font-weight: 600; margin: 0 0 6px 0; }
  .hc-service-card p { font-size: 14px; color: rgba(255, 255, 255, 0.5); margin: 0; }

  /* --- Artikel & Status --- */
  .hc-grid-split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
  }
  @media (min-width: 960px) { .hc-grid-split { grid-template-columns: 1.5fr 1fr; gap: 64px; } }

  .hc-article-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .hc-article-item:hover {
    border-color: rgba(216, 182, 111, 0.55);
    background: linear-gradient(100deg, #0d0d0d, #15120d);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
    transform: translateX(6px);
  }
  .hc-article-num { font-size: 28px; font-weight: 300; color: rgba(255, 255, 255, 0.2); }
  .hc-article-content { flex: 1; }
  .hc-article-content h4 { font-size: 15px; margin: 0 0 4px 0; }
  .hc-article-content p { font-size: 14px; color: rgba(255, 255, 255, 0.5); margin: 0; }
  
  .hc-status-card {
    background: #0a0a0a;
    border-radius: 12px;
    padding: 32px;
  }
  .hc-status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 14px;
  }
  .hc-status-item:last-child { border-bottom: none; padding-bottom: 0; }
  .status-badge { display: flex; align-items: center; gap: 8px; font-size: 14px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot.green { background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); }
  .dot.yellow { background: #eab308; box-shadow: 0 0 8px rgba(234, 179, 8, 0.4); }

  /* --- Kategori & Video --- */
  .hc-grid-3 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 768px) { .hc-grid-3 { grid-template-columns: repeat(3, 1fr); } }

  .hc-cat-card {
    position: relative;
    overflow: hidden;
    padding: 32px;
    background: linear-gradient(145deg, #111111, #0b0b0b);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease;
  }
  .hc-cat-card:hover {
    border-color: #d8b66f;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }
  .hc-cat-card h3 { font-size: 18px; margin: 16px 0 8px; }
  .hc-cat-card p { font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; margin-bottom: 24px; }
  .hc-cat-link { font-size: 14px; color: #d8b66f; text-decoration: none; display: flex; align-items: center; gap: 4px; }
  .hc-cat-card--empty:hover {
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: none;
    transform: none;
  }
  .hc-cat-link--disabled {
    color: rgba(216, 182, 111, 0.62);
    cursor: default;
  }

  .hc-empty-state {
    margin-top: 20px;
    padding: 24px;
    border: 1px dashed rgba(216, 182, 111, 0.28);
    border-radius: 12px;
    background: linear-gradient(145deg, rgba(216, 182, 111, 0.055), rgba(255, 255, 255, 0.018));
  }
  .hc-empty-state p {
    margin: 0 0 6px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 14px;
    font-weight: 600;
  }
  .hc-empty-state span {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    line-height: 1.6;
  }

  /* --- FAQ & Downloads --- */
  .hc-faq-container { max-width: 800px; margin: 0 auto; width: 100%; }
  .hc-faq-item {
    background: #0f0f0f; border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 20px 24px; border-radius: 8px; margin-bottom: 12px;
    display: flex; justify-content: space-between; align-items: center; cursor: pointer;
    transition: background 220ms ease, border-color 220ms ease, transform 220ms ease;
  }
  .hc-faq-item:hover {
    background: #17130d;
    border-color: rgba(216, 182, 111, 0.5);
    transform: translateX(5px);
  }
  .hc-faq-item h4 { font-size: 15px; font-weight: 400; margin: 0; }

  /* --- Contact & Report Box --- */
  .hc-contact-box {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
    overflow: hidden;
    padding: clamp(30px, 5vw, 64px);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 18px;
    background: linear-gradient(145deg, #111111, #0d0d0d);
  }

  .hc-contact-box > div {
    min-width: 0;
  }

  @media (min-width: 960px) {
    .hc-contact-box {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: clamp(54px, 6vw, 80px);
    }
  }

  .hc-contact-intro {
    max-width: 540px;
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.7;
  }

  .hc-contact-form-title {
    margin: 0 0 24px;
    font-size: 18px;
    font-weight: 600;
  }

  .hc-contact-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 28px;
  }

  .hc-c-item {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    background: #181818;
    color: inherit;
    text-decoration: none;
    transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }

  .hc-c-item:hover,
  .hc-c-item:focus-visible {
    border-color: rgba(216, 182, 111, 0.54);
    background: #1d1913;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24), 0 0 22px rgba(216, 182, 111, 0.07);
    transform: translateY(-3px);
    outline: none;
  }

  .hc-c-icon {
    width: 26px;
    height: 26px;
    flex: 0 0 auto;
    object-fit: contain;
  }

  .hc-c-text {
    min-width: 0;
  }

  .hc-c-text h5 {
    margin: 0 0 4px;
    overflow-wrap: anywhere;
    font-size: 14px;
    font-weight: 600;
  }

  .hc-c-text p {
    margin: 0;
    overflow-wrap: anywhere;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    line-height: 1.45;
  }

  .hc-form-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .hc-form-group {
    min-width: 0;
    position: relative;
    margin-bottom: 16px;
  }

  .hc-form-group label {
    display: block;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
  }

  .hc-form-input {
    width: 100%;
    min-width: 0;
    padding: 13px 15px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9px;
    outline: none;
    background: #191919;
    color: #fff;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  }

  .hc-form-input:focus {
    border-color: #d8b66f;
    background: #1c1a17;
    box-shadow: 0 0 0 3px rgba(216, 182, 111, 0.08);
  }

  .hc-form-input.is-invalid { border-color: #e57373; }
  .hc-form-input.is-invalid:focus { border-color: #ef5350; }

  .hc-form-error {
    display: block;
    margin-top: 6px;
    color: #ffcdd2;
    font-size: 14px;
  }

  .hc-form-success {
    margin-bottom: 16px;
    padding: 12px 16px;
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    background-color: rgba(34, 197, 94, 0.1);
    color: #a7f3d0;
    font-size: 14px;
  }

  textarea.hc-form-input {
    min-height: 120px;
    resize: vertical;
  }

  .hc-btn-submit {
    width: 100%;
    min-height: 48px;
    padding: 14px;
    border: 1px solid #d8b66f;
    border-radius: 9px;
    background: #d8b66f;
    color: #000;
    cursor: pointer;
    font-weight: 700;
    transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }

  .hc-btn-submit:hover:not(:disabled),
  .hc-btn-submit:focus-visible:not(:disabled) {
    border-color: #edcf88 !important;
    background: #e6c883 !important;
    color: #090704 !important;
    box-shadow: 0 10px 28px rgba(216, 182, 111, 0.2) !important;
    transform: translateY(-1px);
  }

  .hc-btn-submit:disabled {
    border-color: #555;
    background: #555;
    color: #999;
    cursor: not-allowed;
  }

  @media (max-width: 720px) {
    .hc-page {
      padding-right: 16px;
      padding-left: 16px;
    }

    .hc-container {
      gap: 58px;
    }

    .hc-contact-box {
      gap: 38px;
      padding: 28px 20px;
      border-radius: 15px;
    }

    .hc-contact-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-top: 24px;
    }

    .hc-c-item {
      width: 100%;
      min-height: 72px;
      padding: 15px;
    }

    .hc-form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .hc-contact-form-title {
      margin-bottom: 20px;
    }
  }

  @media (max-width: 420px) {
    .hc-contact-box {
      padding: 24px 16px;
    }

    .hc-c-item {
      gap: 12px;
      padding: 14px;
    }

    .hc-c-icon {
      width: 24px;
      height: 24px;
    }

    .hc-c-text h5 { font-size: 14px; }
    .hc-c-text p { font-size: 14px; }
  }

  /* --- Section Wrapper for multi-part sections --- */
  .hc-section-wrapper {
    display: flex;
    flex-direction: column;
    gap: 40px; /* Jarak antar sub-section */
  }

  /* --- Animation --- */
  .hc-section-reveal {
    opacity: 0;
    filter: blur(5px);
    transform: translateY(38px) scale(0.985);
    transition:
      opacity 760ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 760ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 760ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform, filter;
  }
  .hc-section-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
  @media (prefers-reduced-motion: reduce) {
    .hc-section-reveal {
      opacity: 1;
      filter: none;
      transform: none;
      transition: none;
    }
  }
`;

const HelpCenter: React.FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.hc-section-reveal');
    if (!sections.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    sections.forEach((section, index) => {
      section.style.transitionDelay = `${index * 120}ms`;
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className="hc-page">
        <style>{hcStyles}</style>

        <div className="hc-container">
          <div className="hc-section-reveal"><SearchHeader /></div>
          <div className="hc-section-reveal" id="help-services"><LayananUtama /></div>
          <div className="hc-section-reveal" id="help-articles"><ArtikelStatus /></div>
          <div className="hc-section-reveal" id="help-categories"><KategoriVideo /></div>
          <div className="hc-section-reveal" id="help-downloads"><FAQDownload /></div>
          <div className="hc-section-reveal" id="help-contact"><HubungiLapor /></div>
        </div>
      </main>
      <ClosingSection />
      <Footer />
    </>
  );
};

export default HelpCenter;
