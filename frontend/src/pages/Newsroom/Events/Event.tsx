import React, { useState, useEffect } from 'react';
import NewsroomNavbar from '../Home/components/NewsroomNavbar';
import CTA from "../Home/components/CTA";
import SideBar from '../Home/components/NewsroomSidebar';
import ClosingSection from '../Home/components/ClosingSection';
import Footer from '../Home/components/Footer';

import HeroSection from './sections/HeroSection';
import FilterSection, { type EventAccessFilter, type EventSort } from './sections/FilterSection';
import EventGridSection from './sections/EventGridSection';
import SpeakerSection from './sections/SpeakerSection';
import NewsletterSection from './sections/NewsletterSection';
import useEventStream from '../../../hooks/useEventStream';

const newsroomLayoutStyles = `
  html.newsroom-document,
  body.newsroom-document-body {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: clip !important;
    scroll-behavior: auto !important;
  }

  html.newsroom-sidebar-open,
  body.newsroom-sidebar-open {
    height: 100%;
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  .newsroom-page {
    --newsroom-sidebar-width: 220px;
    --newsroom-navbar-height: 64px;
    --newsroom-gold: #e5c477;
    --newsroom-gold-light: #f0d58f;
    --newsroom-black: #050505;
    --newsroom-panel: #0d0c0b;
    --newsroom-brown: #24211e;
    --newsroom-brown-soft: #302c27;
    --newsroom-border: rgba(229, 196, 119, 0.24);
    --newsroom-muted: #aaa39a;

    position: relative;
    display: flex;
    width: 100%;
    padding-top: 0;
    align-items: flex-start;
    background: var(--newsroom-black, #050505);
    color: #f4efe8;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .newsroom-main {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    background: #000;
  }

  .newsroom-content-section {
    width: min(100%, 1220px);
    max-width: 100%;
    margin-inline: auto;
    padding-inline: clamp(28px, 4.5vw, 70px);
  }

  .newsroom-main-column {
    position: relative;
    flex: 1 1 0;
    width: calc(100% - var(--newsroom-sidebar-width));
    max-width: calc(100% - var(--newsroom-sidebar-width));
    margin-left: var(--newsroom-sidebar-width);
    min-width: 0;
    min-height: 100dvh;
    background: #050505;
  }

  @media (max-width: 1024px) {
    .newsroom-page {
      display: block;
      padding-top: var(--newsroom-navbar-height);
    }
    .newsroom-main-column {
      width: 100%;
      max-width: 100%;
      margin-left: 0;
    }
  }
`;

const readEventFilters = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const rawAccess = searchParams.get("access");
  const rawSort = searchParams.get("sort");

  return {
    query: searchParams.get("query") ?? "",
    access: rawAccess === "FREE" || rawAccess === "PAID" ? rawAccess : "ALL" as EventAccessFilter,
    sort: rawSort === "OLDEST" ? "OLDEST" : "NEWEST" as EventSort,
  };
};

const EventPage: React.FC = () => {
  const initialFilters = readEventFilters();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [eventQuery, setEventQuery] = useState(initialFilters.query);
  const [eventAccess, setEventAccess] = useState<EventAccessFilter>(initialFilters.access);
  const [eventSort, setEventSort] = useState<EventSort>(initialFilters.sort);

  useEventStream();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("newsroom-document");
    body.classList.add("newsroom-document-body");

    return () => {
      html.classList.remove("newsroom-document");
      body.classList.remove("newsroom-document-body", "newsroom-sidebar-open");
    };
  }, []);

  useEffect(() => {
    const syncFiltersFromHash = () => {
      const filters = readEventFilters();
      setEventQuery(filters.query);
      setEventAccess(filters.access);
      setEventSort(filters.sort);
    };
    window.addEventListener("hashchange", syncFiltersFromHash);
    return () => window.removeEventListener("hashchange", syncFiltersFromHash);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const shouldLockPage = isSidebarOpen && window.matchMedia("(max-width: 1024px)").matches;

    html.classList.toggle("newsroom-sidebar-open", shouldLockPage);
    body.classList.toggle("newsroom-sidebar-open", shouldLockPage);

    return () => {
      html.classList.remove("newsroom-sidebar-open");
      body.classList.remove("newsroom-sidebar-open");
    };
  }, [isSidebarOpen]);

  return (
    <>
      <NewsroomNavbar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />
      
      <style>
        {`
          ${newsroomLayoutStyles}

          /* --- ANIMATION STYLES --- */
          [data-newsroom-reveal] {
            opacity: 1;
            transform: none;
            animation: newsroom-event-reveal-in 220ms ease-out both;
          }
          @keyframes newsroom-event-reveal-in {
            from { opacity: 0.75; transform: translate3d(0, 8px, 0); }
            to { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-newsroom-reveal] { animation: none; opacity: 1; transform: none; }
          }

          .event-page-container {
            font-family: Arial, Helvetica, sans-serif;
            color: #ffffff;
          }
          .event-title-serif {
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 400;
          }
          .event-page-container a.btn-primary,
          .event-page-container a.btn-outline,
          .event-page-container a.btn-detail-event {
            text-decoration: none;
          }
          .newsroom-empty-state {
            padding: 40px 24px;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            color: #aaa39a;
            text-align: center;
            background: #0a0a0a;
          }

          /* HERO */
          .event-hero-wrapper {
            background: radial-gradient(circle at 50% 0%, #3a3a3a 0%, #050505 70%);
            padding-top: 80px;
            padding-bottom: 60px;
          }
          .event-archive-text {
            color: var(--newsroom-gold);
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 700;
            display: block;
            margin-bottom: 16px;
          }
          .event-hero-title {
            font-size: clamp(48px, 6vw, 84px);
            margin: 0 0 16px 0;
            line-height: 1.1;
            color: #fff;
          }
          .event-hero-subtitle {
            color: #aaa39a;
            font-size: 15px;
            line-height: 1.6;
            max-width: 650px;
            margin-bottom: 40px;
          }
          .event-hero-actions {
            display: flex;
            gap: 16px;
          }

          /* TICKER */
          .ticker-banner {
            background-color: var(--newsroom-gold);
            color: #050505;
            padding: 12px 0;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            align-items: center;
            border-top: 1px solid rgba(0,0,0,0.1);
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          .ticker-track {
            display: inline-flex;
            gap: 60px;
            padding-left: 60px;
            animation: ticker-scroll 20s linear infinite;
          }
          .ticker-banner:hover .ticker-track { animation-play-state: paused; }
          .ticker-item {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
          }
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* FILTER */
          .event-filter-section {
            padding-top: 40px;
            padding-bottom: 40px;
          }
          .event-grid-section { margin-bottom: 60px; }
          .speaker-section { margin-bottom: 80px; }
          .event-newsletter-section { margin-bottom: 80px; }

          .filter-bar-container {
            display: flex;
            gap: 16px;
            align-items: center;
            background: #0A0A0A;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 8px;
          }
          .search-input-wrapper {
            flex-grow: 1;
            display: flex;
            align-items: center;
            padding: 0 16px;
            gap: 12px;
            color: #666;
          }
          .search-input-wrapper input {
            background: transparent;
            border: none;
            color: #fff;
            width: 100%;
            height: 40px;
            outline: none;
            font-size: 14px;
          }
          .filter-buttons { display: flex; gap: 8px; }
          .btn-filter {
            background: #111;
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            padding: 0 20px;
            height: 40px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            cursor: pointer;
          }

          /* EVENT GRID CARDS (4 Kolom) */
          .event-grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .event-card {
            background: #0A0A0A;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: 0.3s;
          }
          .event-card:hover { border-color: rgba(229, 196, 119, 0.4); transform: translateY(-3px); }
          .event-card-image-box {
            position: relative;
            height: 160px;
            width: 100%;
          }
          .event-card-image-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .event-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 4px;
            letter-spacing: 0.5px;
          }
          .event-badge.free { background-color: #e5c477; color: #000; }
          .event-badge.paid { background-color: #24211e; color: #e5c477; border: 1px solid #e5c477; }
          
          .event-card-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }
          .event-meta-info {
            display: flex;
            gap: 8px;
            font-size: 10px;
            color: var(--newsroom-gold);
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .event-title {
            font-size: 15px;
            color: #fff;
            margin: 0 0 16px 0;
            line-height: 1.4;
          }
          .event-time {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #aaa39a;
            margin-bottom: 20px;
            margin-top: auto;
          }
          .btn-detail-event {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
          }
          .btn-detail-event:hover {
            background: #fff;
            color: #000;
            border-color: #fff;
          }

          /* SPEAKERS */
          .speaker-section-title {
            font-size: 22px;
            color: #fff;
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding-bottom: 12px;
          }
          .speakers-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
          .speaker-card {
            background: #0A0A0A;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .speaker-img-wrapper {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 16px;
            border: 2px solid var(--newsroom-gold);
          }
          .speaker-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .speaker-card h4 {
            font-size: 16px;
            margin: 0 0 4px 0;
            color: #fff;
            font-family: Georgia, serif;
          }
          .speaker-role {
            font-size: 12px;
            color: #aaa39a;
            margin: 0 0 12px 0;
          }
          .speaker-desc {
            font-size: 9px;
            color: var(--newsroom-gold);
            background: rgba(229, 196, 119, 0.1);
            padding: 4px 10px;
            border-radius: 10px;
            letter-spacing: 0.5px;
            margin-top: auto;
          }

          /* NEWSLETTER */
          .event-newsletter-box {
            background: #0D0C0B;
            border: 1px solid rgba(229, 196, 119, 0.2);
            border-radius: 16px;
            padding: 48px;
            text-align: center;
            max-width: 850px;
            margin: 0 auto;
          }
          .event-newsletter-box h3 {
            font-family: Georgia, serif;
            font-size: 24px;
            color: #fff;
            margin: 0 0 12px 0;
          }
          .event-newsletter-box p {
            color: #aaa39a;
            font-size: 14px;
            margin-bottom: 28px;
          }
          .newsletter-form {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .newsletter-form input {
            background: #050505;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 12px 16px;
            color: #fff;
            outline: none;
            width: 250px;
            font-size: 13px;
          }
          .btn-subscribe {
            background: var(--newsroom-gold);
            color: #050505;
            border: none;
            padding: 0 24px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
          }

          /* GLOBAL BUTTONS */
          .btn-primary {
            background-color: var(--newsroom-gold);
            color: #050505;
            border: none;
            padding: 12px 28px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .btn-outline {
            background-color: transparent;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 12px 28px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
          }

          @media (max-width: 992px) {
            .event-grid-4, .speakers-grid { grid-template-columns: repeat(2, 1fr); }
            .newsletter-form { flex-direction: column; align-items: center; }
            .newsletter-form input { width: 100%; }
          }
          @media (max-width: 768px) {
            .event-grid-4, .speakers-grid { grid-template-columns: 1fr; }
            .event-hero-title { font-size: 36px; }
            .event-hero-actions { flex-direction: column; }
            .ticker-track { animation: none; transform: none; }
          }
        `}
      </style>

      <div className="newsroom-page">
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="newsroom-main-column">
          <main className="newsroom-main event-page-container">
            <HeroSection />
            <div data-newsroom-reveal>
              <FilterSection
                query={eventQuery}
                access={eventAccess}
                sort={eventSort}
                onQueryChange={setEventQuery}
                onAccessChange={setEventAccess}
                onSortChange={setEventSort}
              />
            </div>
            <EventGridSection query={eventQuery} access={eventAccess} sort={eventSort} />
            <SpeakerSection />
            <div data-newsroom-reveal>
              <NewsletterSection />
            </div>
            <div data-newsroom-reveal>
              <CTA />
            </div>
            <div data-newsroom-reveal>
              <ClosingSection />
            </div>
            <div data-newsroom-reveal>
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default EventPage;
