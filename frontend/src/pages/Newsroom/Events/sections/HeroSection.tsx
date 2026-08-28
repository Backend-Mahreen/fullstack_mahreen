const HeroSection = () => {
  return (
    <>
      <section className="event-hero-wrapper">
        <div className="newsroom-content-section">
          <div data-newsroom-reveal>
            <span className="event-archive-text">EVENT DIRECTORY 2026</span>
            <h1 className="event-hero-title event-title-serif">Explore Events</h1>
            <p className="event-hero-subtitle">
              Temukan webinar, seminar, workshop, bootcamp, networking, dan kegiatan resmi Mahreen Indonesia untuk meningkatkan kompetensi serta membangun kolaborasi.
            </p>
            <div className="event-hero-actions">
              <a className="btn-primary" href="/newsroom/berita">
                JELAJAHI ARTIKEL
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a className="btn-outline" href="/newsroom/events?section=event-list">LIHAT EVENT</a>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-banner" data-newsroom-reveal>
        <div className="ticker-track">
          <div className="ticker-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            MAHREEN INDONESIA INTERNSHIP BATCH 2 RESMI DIBUKA.
          </div>
          <div className="ticker-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            SEMINAR FUTURE OF AI IN INDONESIA SEGERA HADIR.
          </div>
          <div className="ticker-item" aria-hidden="true">
            MAHREEN INDONESIA INTERNSHIP BATCH 2 RESMI DIBUKA.
          </div>
          <div className="ticker-item" aria-hidden="true">
            SEMINAR FUTURE OF AI IN INDONESIA SEGERA HADIR.
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
