import React, { useState, useEffect } from 'react';
import NewsroomNavbar from '../Home/components/NewsroomNavbar';
import CTA from "../Home/components/CTA";
import SideBar from '../Home/components/NewsroomSidebar';
import ClosingSection from '../Home/components/ClosingSection';
import HeroSection from './sections/HeroSection';
import FilterSection, { type TopicCategory, type TopicSort } from './sections/FilterSection';
import TopTopics from './sections/TopTopics';
import KnowledgeExplorer from './sections/KnowledgeExplorer';
import Footer from '../Home/components/Footer';

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

const readTopicQuery = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("topic") ?? searchParams.get("query") ?? "";
};

const TagPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topicQuery, setTopicQuery] = useState(readTopicQuery);
  const [topicCategory, setTopicCategory] = useState<TopicCategory>("ALL");
  const [topicSort, setTopicSort] = useState<TopicSort>("POPULAR");
  const [visibleTopicCount, setVisibleTopicCount] = useState(8);

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
    const syncQueryFromHash = () => setTopicQuery(readTopicQuery());
    window.addEventListener("hashchange", syncQueryFromHash);
    return () => window.removeEventListener("hashchange", syncQueryFromHash);
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
            animation: newsroom-tag-reveal-in 220ms ease-out both;
          }
          @keyframes newsroom-tag-reveal-in {
            from { opacity: 0.75; transform: translate3d(0, 8px, 0); }
            to { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-newsroom-reveal] { animation: none; opacity: 1; transform: none; }
          }

          /* --- GLOBAL TAG PAGE STYLES --- */
          .tag-page-container {
            font-family: Arial, Helvetica, sans-serif;
            color: #ffffff;
          }
          .tag-title-serif {
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 400;
          }
          .tag-page-container a.btn-primary,
          .tag-page-container a.btn-outline {
            text-decoration: none;
          }
          .visually-hidden {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
          }
          .newsroom-empty-state {
            padding: 40px 24px;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            color: #aaa39a;
            text-align: center;
            background: #0a0a0a;
            margin-bottom: 40px;
          }
          #knowledge-explorer { scroll-margin-top: 90px; }

          /* --- 1. HERO SECTION --- */
          .tag-hero-wrapper {
            background: radial-gradient(circle at 50% 0%, #3a3a3a 0%, #050505 70%);
            padding-top: 80px;
            padding-bottom: 60px;
          }
          .tag-archive-text {
            color: var(--newsroom-gold);
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 700;
            display: block;
            margin-bottom: 16px;
          }
          .tag-hero-title {
            font-size: clamp(48px, 6vw, 84px);
            margin: 0 0 16px 0;
            line-height: 1.1;
            color: #fff;
          }
          .tag-hero-subtitle {
            color: #aaa39a;
            font-size: 15px;
            line-height: 1.6;
            max-width: 650px;
            margin-bottom: 40px;
          }
          .tag-hero-actions {
            display: flex;
            gap: 16px;
          }

          /* --- RUNNING TEXT TICKER --- */
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
          .ticker-banner:hover .ticker-track {
            animation-play-state: paused;
          }
          .ticker-item {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* --- 2. FILTER SECTION --- */
          .tag-filter-section {
            padding-top: 40px;
            padding-bottom: 40px;
          }
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
          .filter-buttons {
            display: flex;
            gap: 8px;
          }
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
          .btn-filter {
            transition: background 220ms ease, border-color 220ms ease, color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
          }
          .btn-filter:hover {
            background: var(--newsroom-gold);
            border-color: var(--newsroom-gold-light);
            color: #090704;
            box-shadow: 0 10px 24px rgba(229, 196, 119, 0.2);
            transform: translateY(-2px);
          }

          /* --- 3. TOP TOPICS --- */
          .topics-grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 60px;
          }
          .topic-card-large {
            position: relative;
            overflow: hidden;
            isolation: isolate;
            background: linear-gradient(145deg, #0d0d0c, #080807);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px;
            padding: 32px;
            display: flex;
            flex-direction: column;
            transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          }
          .topic-card-large::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background: radial-gradient(circle at 18% 12%, rgba(229, 196, 119, 0.16), transparent 42%);
            opacity: 0;
            transition: opacity 0.3s;
          }
          .topic-card-large:hover {
            border-color: rgba(229, 196, 119, 0.55);
            box-shadow: 0 22px 50px rgba(0, 0, 0, 0.36), 0 0 34px rgba(229, 196, 119, 0.07);
            transform: translateY(-7px);
          }
          .topic-card-large:hover::before { opacity: 1; }
          .topic-card-large:hover .topic-icon-lg { transform: translateY(-3px) rotate(-3deg) scale(1.08); }
          .topic-icon-lg {
            color: var(--newsroom-gold);
            margin-bottom: 24px;
            transition: transform 260ms ease, filter 260ms ease;
          }
          .topic-card-large h3 {
            font-size: 20px;
            color: #fff;
            margin: 0 0 12px 0;
          }
          .topic-card-large p {
            color: #aaa39a;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 32px 0;
            flex-grow: 1;
          }
          .topic-stats {
            display: flex;
            gap: 32px;
            margin-bottom: 32px;
          }
          .stat-item h4 {
            font-size: 24px;
            margin: 0;
            color: #fff;
          }
          .stat-item span {
            font-size: 9px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          /* --- 4. KNOWLEDGE EXPLORER --- */
          .tag-knowledge-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .tag-knowledge-header h2 {
            font-size: 16px;
            color: var(--newsroom-gold);
            margin: 0 0 8px 0;
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 400;
          }
          .tag-knowledge-header p {
            color: #aaa39a;
            font-size: 14px;
            margin: 0;
          }
          .tag-topics-count {
            font-size: 10px;
            color: #666;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .tag-grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .tag-card-small {
            position: relative;
            overflow: hidden;
            background: linear-gradient(145deg, #0d0d0c, #080807);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 24px;
            transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s, background 0.3s;
          }
          .tag-card-small::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: linear-gradient(115deg, transparent 25%, rgba(229, 196, 119, 0.13) 48%, transparent 72%);
            transform: translateX(-125%);
            transition: transform 650ms ease;
          }
          .tag-card-small:hover {
            transform: translateY(-6px);
            border-color: rgba(229, 196, 119, 0.5);
            background: #12100c;
            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
          }
          .tag-card-small:hover::after { transform: translateX(125%); }
          .tag-card-small:hover .tag-card-icon-small { transform: scale(1.12) rotate(-4deg); }
          .tag-card-small-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          .tag-badge-article {
            background: #111;
            color: #888;
            font-size: 9px;
            padding: 4px 8px;
            border-radius: 12px;
            border: 1px solid #222;
            letter-spacing: 0.5px;
          }
          .tag-card-icon-small {
            color: var(--newsroom-gold, #e5c477);
            width: 20px;
            height: 20px;
            transition: transform 240ms ease;
          }
          .tag-card-small h4 {
            font-size: 15px;
            margin: 0 0 8px 0;
            color: #fff;
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 400;
          }
          .tag-card-small p {
            font-size: 12px;
            color: #aaa39a;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }
          .tag-explore-link {
            color: #fff;
            font-size: 12px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: gap 0.3s, color 0.3s;
          }
          .tag-explore-link:hover {
            gap: 10px;
            color: var(--newsroom-gold);
          }
          
          .tag-load-more {
            text-align: center;
            margin-bottom: 80px;
          }

          /* --- BUTTONS --- */
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
          .btn-pill-gold {
            background-color: var(--newsroom-gold);
            color: #000;
            border: none;
            padding: 10px 24px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
          }
          .btn-pill-outline {
            background-color: transparent;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 12px 32px;
            border-radius: 30px;
            font-weight: 400;
            font-size: 13px;
            cursor: pointer;
          }
          .btn-primary:hover,
          .btn-outline:hover,
          .btn-pill-gold:hover,
          .btn-pill-outline:hover {
            background: var(--newsroom-gold);
            color: #090704;
            border-color: var(--newsroom-gold-light);
            box-shadow: 0 12px 28px rgba(229, 196, 119, 0.22);
            transform: translateY(-2px);
          }

          @media (max-width: 992px) {
            .topics-grid-3, .tag-grid-4 { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .tag-hero-title { font-size: 40px; }
            .tag-hero-actions { flex-direction: column; }
            .topics-grid-3, .tag-grid-4 { grid-template-columns: 1fr; }
            .filter-bar-container { flex-direction: column; align-items: stretch; }
            .ticker-track { animation: none; transform: none; }
          }
        `}
      </style>

      <div className="newsroom-page">
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="newsroom-main-column">
          <main className="newsroom-main tag-page-container">
            <HeroSection />
            <div data-newsroom-reveal>
              <FilterSection
                query={topicQuery}
                category={topicCategory}
                sort={topicSort}
                onQueryChange={(value) => { setTopicQuery(value); setVisibleTopicCount(8); }}
                onCategoryChange={(value) => { setTopicCategory(value); setVisibleTopicCount(8); }}
                onSortChange={(value) => { setTopicSort(value); setVisibleTopicCount(8); }}
              />
            </div>
            <TopTopics
              onSelectTopic={(topic) => {
                setTopicQuery(topic);
                setVisibleTopicCount(8);
                window.setTimeout(() => document.getElementById("knowledge-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
              }}
            />
            <KnowledgeExplorer
              query={topicQuery}
              category={topicCategory}
              sort={topicSort}
              visibleCount={visibleTopicCount}
              onLoadMore={() => setVisibleTopicCount((count) => count + 8)}
            />
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

export default TagPage;
