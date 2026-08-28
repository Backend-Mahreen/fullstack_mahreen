// src/pages/KebijakanPrivasi/KebijakanPrivasi.tsx
import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeaderPrivasi from './sections/HeaderPrivasi';
import KontenPrivasi from './sections/KontenPrivasi';
import CTAPrivasi from './sections/CTAPrivasi';
import ClosingSection from '../../components/Cloasing-section/cloasing-section';
import Footer from '../../components/Footer/Footer';

const KebijakanPrivasi: React.FC = () => {
  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>(
      '.kp-header, .kp-toc-box, .kp-section, .kp-card, .kp-list-item, .kp-cta-box'
    );
    revealTargets.forEach((element) => element.classList.add('kp-reveal'));

    const sections = document.querySelectorAll<HTMLElement>('.kp-reveal');
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
      section.style.transitionDelay = `${(index % 6) * 75}ms`;
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <style>
        {`
          .kp-container {
            background-color: #050505;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            padding: calc(var(--navbar-height, 78px) + 60px) 5% 60px;
            line-height: 1.6;
          }

          /* --- HEADER SECTION --- */
          .kp-header {
            text-align: center;
            max-width: 800px;
            margin: 0 auto 80px auto;
          }

          .kp-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background-color: rgba(200, 169, 126, 0.1);
            color: #C8A97E;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 24px;
            border: 1px solid rgba(200, 169, 126, 0.3);
          }

          .kp-dot {
            width: 6px;
            height: 6px;
            background-color: #C8A97E;
            border-radius: 50%;
          }

          .kp-title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 16px;
          }

          .kp-subtitle {
            color: #A0A0A0;
            font-size: 16px;
          }

          /* --- MAIN CONTENT & SIDEBAR --- */
          .kp-main-layout {
            display: flex;
            gap: 60px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .kp-sidebar {
            width: 280px;
            flex-shrink: 0;
          }

          .kp-toc-box {
            background-color: #0A0A0A;
            border: 1px solid #1A1A1A;
            border-radius: 12px;
            padding: 24px;
            position: sticky;
            top: calc(var(--navbar-height, 78px) + 22px);
          }

          .kp-toc-box h3 {
            color: #C8A97E;
            font-size: 15px;
            margin-bottom: 4px;
          }

          .kp-toc-box p {
            color: #666666;
            font-size: 14px;
            margin-bottom: 20px;
          }

          .kp-toc-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .kp-toc-menu a {
            color: #A0A0A0;
            text-decoration: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: 0.3s;
          }

          .kp-toc-icon {
            width: 16px;
            height: 16px;
            filter: grayscale(100%) opacity(0.6);
            transition: filter 0.3s;
          }

          .kp-toc-menu a:hover,
          .kp-toc-menu a.active {
            color: #ffffff;
          }
          
          .kp-toc-menu a:hover .kp-toc-icon,
          .kp-toc-menu a.active .kp-toc-icon {
            filter: invert(85%) sepia(13%) saturate(1203%) hue-rotate(345deg) brightness(84%) contrast(87%);
          }

          /* --- CONTENT SECTIONS --- */
          .kp-content {
            flex-grow: 1;
          }

          .kp-section {
            margin-bottom: 60px;
            scroll-margin-top: calc(var(--navbar-height, 78px) + 24px);
          }

          .kp-section-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 15px;
            color: #C8A97E;
            margin-bottom: 24px;
            font-weight: 400;
          }

          .kp-section-title::before {
            content: "";
            display: block;
            width: 32px;
            height: 1px;
            background-color: #333333;
          }

          .kp-text {
            color: #A0A0A0;
            font-size: 14px;
            margin-bottom: 16px;
          }

          /* --- GRIDS & CARDS --- */
          .kp-grid-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .kp-grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .kp-card {
            background-color: #0A0A0A;
            border: 1px solid #1A1A1A;
            border-radius: 12px;
            padding: 24px;
            transition: border-color 0.3s;
            text-align: left;
          }

          .kp-card:hover {
            border-color: #333333;
          }

          /* Card Data Koleksi */
          .kp-grid-2 .kp-card {
            display: flex;
            align-items: flex-start;
            gap: 20px; /* Jarak antara ikon dan teks diperlebar sedikit */
            padding: 24px;
          }

          .kp-icon {
            display: inline-flex;
            margin-bottom: 16px;
          }
          
          .kp-grid-2 .kp-icon {
            margin-bottom: 0;
            margin-top: 2px; /* Penyesuaian sejajar dengan teks */
          }

          /* --- REVISI UKURAN IKON --- */
          .kp-icon img {
            width: 36px;  /* Ikon diperbesar dari 24px menjadi 36px */
            height: 36px; 
            object-fit: contain;
          }
          
          .kp-icon-contact img {
            width: 24px;  /* Ikon hubungi kami sedikit diperbesar proporsional */
            height: 24px;
            object-fit: contain;
          }

          .kp-card h4 {
            font-size: 15px;
            color: #ffffff;
            margin: 0 0 8px 0;
            font-weight: 600;
          }

          .kp-card p {
            font-size: 14px;
            color: #888888;
            margin: 0;
            line-height: 1.5;
          }

          /* --- LIST ACCORDION STYLE --- */
          .kp-rights-accordion {
            display: grid;
            gap: 12px;
          }

          .kp-list-item {
            position: relative;
            margin: 0;
            overflow: hidden;
            border: 1px solid #1A1A1A;
            border-radius: 8px;
            color: #A0A0A0;
            background-color: transparent;
            transition:
              border-color 280ms ease,
              background-color 280ms ease,
              box-shadow 280ms ease;
          }

          .kp-list-item:hover,
          .kp-list-item.is-open {
            border-color: rgba(200, 169, 126, 0.48);
            background: linear-gradient(135deg, #0d0c0a, #12100d);
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
          }

          .kp-list-trigger {
            display: flex;
            width: 100%;
            min-height: 76px;
            padding: 16px 20px;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            border: 0;
            color: inherit;
            background: transparent;
            font: inherit;
            text-align: left;
            cursor: pointer;
            transition: color 240ms ease;
          }

          .kp-list-trigger:hover,
          .kp-list-trigger:focus-visible,
          .kp-list-item.is-open .kp-list-trigger {
            color: #ffffff;
          }

          .kp-list-trigger:focus-visible {
            outline: 1px solid #C8A97E;
            outline-offset: -4px;
          }

          .kp-list-panel {
            display: grid;
            grid-template-rows: 0fr;
            opacity: 0;
            transition:
              grid-template-rows 420ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 280ms ease;
          }

          .kp-list-panel.is-open {
            grid-template-rows: 1fr;
            opacity: 1;
          }

          .kp-list-panel-inner {
            min-height: 0;
            overflow: hidden;
          }

          .kp-list-panel p {
            margin: 0;
            padding: 0 52px 22px 20px;
            color: #8f8f8f;
            font-size: 14px;
            line-height: 1.75;
          }
          
          .kp-chevron {
            display: inline-flex;
            flex: 0 0 auto;
            color: #C8A97E;
            font-size: 22px;
            font-weight: bold;
            line-height: 1;
            transform: rotate(0deg);
            transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          .kp-list-item.is-open .kp-chevron {
            transform: rotate(90deg);
          }

          /* --- CTA SECTION --- */
          .kp-cta-section {
            max-width: 800px;
            margin: 80px auto 40px auto;
          }

          .kp-cta-box {
            background-color: #0A0A0A;
            border: 1px solid #1A1A1A;
            border-radius: 16px;
            padding: 48px;
            text-align: center;
          }

          .kp-cta-box h2 {
            font-size: 26px;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .kp-cta-box p {
            color: #A0A0A0;
            font-size: 14px;
            margin-bottom: 32px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .kp-btn-group {
            display: flex;
            justify-content: center;
            gap: 16px;
          }

          .kp-btn-primary {
            background-color: #C8A97E;
            color: #000000;
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: opacity 0.3s;
          }

          .kp-btn-primary:hover { opacity: 0.8; }

          .kp-btn-outline {
            background-color: transparent;
            color: #ffffff;
            padding: 14px 28px;
            border: 1px solid #333333;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: 0.3s;
          }

          .kp-btn-outline:hover {
            border-color: #ffffff;
          }

          /* --- PROFESSIONAL INTERACTIONS --- */
          .kp-card,
          .kp-list-item,
          .kp-toc-box,
          .kp-cta-box {
            position: relative;
            overflow: hidden;
            transition: transform 240ms ease, border-color 240ms ease, background 240ms ease, box-shadow 240ms ease;
          }
          .kp-card::before,
          .kp-cta-box::before {
            content: "";
            position: absolute;
            inset: 0 auto 0 0;
            width: 2px;
            background: linear-gradient(180deg, transparent, #C8A97E, transparent);
            opacity: 0;
            transform: scaleY(0.35);
            transition: opacity 240ms ease, transform 240ms ease;
          }
          .kp-card:hover {
            border-color: rgba(200, 169, 126, 0.55);
            background: linear-gradient(135deg, #0d0c0a, #15120d);
            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.3);
            transform: translateY(-4px);
          }
          .kp-card:hover::before,
          .kp-cta-box:hover::before {
            opacity: 1;
            transform: scaleY(1);
          }
          .kp-toc-menu a {
            padding: 8px 10px;
            border-radius: 8px;
          }
          .kp-toc-menu a:hover,
          .kp-toc-menu a.active {
            color: #090704;
            background: #C8A97E;
            transform: translateX(3px);
          }
          .kp-cta-box:hover {
            border-color: rgba(200, 169, 126, 0.45);
            box-shadow: 0 24px 55px rgba(0, 0, 0, 0.34), 0 0 35px rgba(200, 169, 126, 0.08);
          }

          /* --- ANIMATION --- */
          .kp-reveal {
            opacity: 0;
            filter: blur(4px);
            transform: translateY(30px) scale(0.99);
            transition:
              opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 720ms cubic-bezier(0.16, 1, 0.3, 1),
              filter 720ms cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform, filter;
          }
          .kp-reveal.is-visible {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
          @media (prefers-reduced-motion: reduce) {
            .kp-reveal { opacity: 1; filter: none; transform: none; transition: none; }
            .kp-list-item,
            .kp-list-panel,
            .kp-chevron { transition: none; }
          }

          /* --- RESPONSIVE --- */
          @media (max-width: 992px) {
            .kp-main-layout { flex-direction: column; gap: 40px; }
            .kp-sidebar { width: 100%; }
            .kp-toc-box { position: static; }
            .kp-grid-3 { grid-template-columns: repeat(2, 1fr); }
          }

          @media (max-width: 768px) {
            .kp-title { font-size: 32px; }
            .kp-grid-2, .kp-grid-3 { grid-template-columns: 1fr; }
            .kp-btn-group { flex-direction: column; }
            .kp-grid-2 .kp-card { flex-direction: column; }
            .kp-grid-2 .kp-icon { margin-bottom: 12px; }
          }
        `}
      </style>

      <main>
        <div className="kp-container">
          <div className="kp-reveal"><HeaderPrivasi /></div>
          <div className="kp-reveal"><KontenPrivasi /></div>
          <div className="kp-reveal"><CTAPrivasi/></div>
        </div>
      </main>
      <ClosingSection />
      <Footer />
    </>
  );
};

export default KebijakanPrivasi;