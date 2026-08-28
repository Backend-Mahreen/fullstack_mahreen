import { useEffect, useMemo, useRef, useState } from "react";

import brandingImage from "../../../assets/TanyaMahreen/Home/our-work-branding.webp";
import websiteImage from "../../../assets/TanyaMahreen/Home/our-work-website.webp";
import contentImage from "../../../assets/TanyaMahreen/Home/our-work-content.webp";

type WorkCategory = "All" | "Website" | "Branding" | "Social";

type WorkItem = {
  id: number;
  category: Exclude<WorkCategory, "All">;
  label: string;
  title: string;
  image: string;
};

const filters: WorkCategory[] = [
  "All",
  "Website",
  "Branding",
  "Social",
];

const workItems: WorkItem[] = [
  {
    id: 1,
    category: "Branding",
    label: "Branding",
    title: "Luxury Real Estate",
    image: brandingImage,
  },
  {
    id: 2,
    category: "Website",
    label: "Website",
    title: "Fintech Dashboard",
    image: websiteImage,
  },
  {
    id: 3,
    category: "Social",
    label: "Content",
    title: "Product Showcase",
    image: contentImage,
  },

  /*
  TAMBAHKAN PROYEK BARU DI SINI.

  Contoh:

  {
    id: 4,
    category: "Website",
    label: "Website",
    title: "Corporate Website",
    image: websiteImage,
  },
  {
    id: 5,
    category: "Branding",
    label: "Branding",
    title: "Premium Brand Identity",
    image: brandingImage,
  },
  {
    id: 6,
    category: "Social",
    label: "Content",
    title: "Social Media Campaign",
    image: contentImage,
  },
  */
];

const ourWorkStyles = `
  .our-work-section,
  .our-work-section *,
  .our-work-section *::before,
  .our-work-section *::after {
    box-sizing: border-box;
  }

  .our-work-section {
    position: relative;
    isolation: isolate;
    width: 100%;
    overflow: hidden;
    padding: 72px 24px 78px;
    background:
      radial-gradient(
        circle at 50% 55%,
        rgba(217, 176, 87, 0.025) 0%,
        transparent 42%
      ),
      #0b0b0b;
    color: #ffffff;
  }

  .our-work-section::before {
    content: "";
    position: absolute;
    top: 15%;
    left: 50%;
    z-index: -1;
    width: 620px;
    height: 420px;
    border-radius: 50%;
    background: rgba(218, 178, 88, 0.022);
    filter: blur(120px);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .our-work-container {
    width: 100%;
    max-width: 1118px;
    margin: 0 auto;
  }

  /* =========================
     HEADER
     ========================= */

  .our-work-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
  }

  .our-work-heading {
    min-width: 0;
  }

  .our-work-eyebrow {
    margin: 0 0 16px;
    color: #d8b15e;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .our-work-title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(39px, 4vw, 48px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -1.2px;
  }

  /* =========================
     FILTER
     ========================= */

  .our-work-filters {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;
    flex-wrap: wrap;
  }

  .our-work-filter {
    position: relative;
    min-width: 64px;
    padding: 10px 17px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: rgba(255, 255, 255, 0.58);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    cursor: pointer;

    transition:
      color 280ms ease,
      border-color 280ms ease,
      background 280ms ease,
      box-shadow 280ms ease,
      transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .our-work-filter:hover {
    color: rgba(255, 255, 255, 0.92);
    transform: translateY(-1px);
  }

  .our-work-filter.is-active {
    border-color: rgba(216, 177, 92, 0.28);

    background:
      linear-gradient(
        145deg,
        rgba(211, 170, 80, 0.12),
        rgba(211, 170, 80, 0.035)
      ),
      #17150f;

    color: #d9b566;

    box-shadow:
      0 0 20px rgba(216, 177, 92, 0.04),
      inset 0 0 18px rgba(216, 177, 92, 0.025);
  }

  /* =========================
     PROJECT GRID
     Desktop = selalu 3 kolom
     ========================= */

  .our-work-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 29px;
    margin-top: 63px;
  }

  /* =========================
     PROJECT CARD
     ========================= */

  .our-work-card {
    position: relative;
    isolation: isolate;
    min-width: 0;
    height: 410px;
    overflow: hidden;

    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 17px;

    background: #101010;

    cursor: pointer;

    transition:
      transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 400ms ease,
      box-shadow 400ms ease;
  }

  .our-work-card::before {
    content: "";
    position: absolute;
    inset: -1px;
    z-index: 4;

    border-radius: inherit;
    border: 1px solid transparent;

    background:
      linear-gradient(
        145deg,
        rgba(235, 197, 112, 0.25),
        transparent 36%,
        transparent 70%,
        rgba(213, 171, 78, 0.09)
      )
      border-box;

    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);

    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);

    mask-composite: exclude;
    -webkit-mask-composite: xor;

    opacity: 0;

    transition: opacity 400ms ease;

    pointer-events: none;
  }

  .our-work-card:hover {
    transform: translateY(-8px);

    border-color: rgba(220, 180, 91, 0.22);

    box-shadow:
      0 24px 60px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(218, 176, 84, 0.065);
  }

  .our-work-card:hover::before {
    opacity: 1;
  }

  .our-work-card__image {
    display: block;
    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    filter:
      brightness(0.74)
      saturate(0.82)
      contrast(1.03);

    transform: scale(1.01);

    transition:
      transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 700ms ease;
  }

  .our-work-card:hover .our-work-card__image {
    transform: scale(1.065);

    filter:
      brightness(0.83)
      saturate(0.94)
      contrast(1.04);
  }

  .our-work-card__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;

    background:
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.03) 0%,
        rgba(0, 0, 0, 0.02) 42%,
        rgba(0, 0, 0, 0.48) 76%,
        rgba(0, 0, 0, 0.82) 100%
      );

    pointer-events: none;
  }

  .our-work-card__glow {
    position: absolute;
    right: -40px;
    bottom: -70px;
    z-index: 1;

    width: 180px;
    height: 180px;

    border-radius: 50%;

    background: rgba(218, 177, 88, 0.08);

    filter: blur(70px);

    opacity: 0;

    transition: opacity 450ms ease;

    pointer-events: none;
  }

  .our-work-card:hover .our-work-card__glow {
    opacity: 1;
  }

  .our-work-card__content {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3;

    padding: 0 29px 32px;
  }

  .our-work-card__label {
    margin: 0 0 11px;

    color: #d7af59;

    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 1.7px;

    text-transform: uppercase;
  }

  .our-work-card__title {
    margin: 0;

    color: rgba(255, 255, 255, 0.92);

    font-family: "Playfair Display", Georgia, serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.35;

    transition:
      color 300ms ease,
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
      text-shadow 300ms ease;
  }

  .our-work-card:hover .our-work-card__title {
    color: #ffffff;

    transform: translateX(3px);

    text-shadow:
      0 0 18px rgba(255, 255, 255, 0.08);
  }

  /* =========================
     VIEW ALL BUTTON
     ========================= */

  .our-work-view-all-wrapper {
    display: flex;
    justify-content: center;

    width: 100%;

    margin-top: 38px;
  }

  .our-work-view-all {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 166px;

    padding: 13px 27px;

    overflow: hidden;

    border:
      1px solid
      rgba(255, 255, 255, 0.1);

    border-radius: 999px;

    background:
      rgba(255, 255, 255, 0.012);

    color:
      rgba(255, 255, 255, 0.92);

    font-family:
      "DM Sans",
      Arial,
      sans-serif;

    font-size: 14px;
    font-weight: 600;
    line-height: 1;

    cursor: pointer;

    transition:
      transform 300ms
        cubic-bezier(0.16, 1, 0.3, 1),
      border-color 300ms ease,
      background 300ms ease,
      color 300ms ease,
      box-shadow 300ms ease;
  }

  .our-work-view-all::before {
    content: "";

    position: absolute;
    top: 50%;
    left: 50%;

    width: 110px;
    height: 45px;

    border-radius: 50%;

    background:
      rgba(218, 177, 88, 0.12);

    filter: blur(28px);

    opacity: 0;

    transform:
      translate(-50%, -50%);

    transition:
      opacity 300ms ease;

    pointer-events: none;
  }

  .our-work-view-all span {
    position: relative;
    z-index: 2;
  }

  .our-work-view-all:hover {
    transform: translateY(-3px);

    border-color:
      rgba(218, 177, 88, 0.28);

    background:
      rgba(218, 177, 88, 0.045);

    color: #ffffff;

    box-shadow:
      0 10px 30px
        rgba(0, 0, 0, 0.25),
      0 0 20px
        rgba(218, 177, 88, 0.05);
  }

  .our-work-view-all:hover::before {
    opacity: 1;
  }

  .our-work-view-all:active {
    transform: translateY(-1px);
  }

  /* =========================
     EMPTY STATE
     ========================= */

  .our-work-empty {
    grid-column: 1 / -1;

    display: flex;
    min-height: 260px;

    align-items: center;
    justify-content: center;

    color: rgba(255, 255, 255, 0.5);

    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
  }

  /* =========================
     SCROLL REVEAL
     ========================= */

  .our-work-reveal {
    opacity: 0;

    filter: blur(7px);

    transform: translateY(28px);

    transition:
      opacity 800ms
        cubic-bezier(0.16, 1, 0.3, 1),
      transform 800ms
        cubic-bezier(0.16, 1, 0.3, 1),
      filter 800ms
        cubic-bezier(0.16, 1, 0.3, 1);
  }

  .our-work-reveal.is-visible {
    opacity: 1;

    filter: blur(0);

    transform: translateY(0);
  }

  .our-work-filter-reveal {
    opacity: 0;

    filter: blur(5px);

    transform: translateX(20px);

    transition:
      opacity 700ms
        cubic-bezier(0.16, 1, 0.3, 1),
      transform 700ms
        cubic-bezier(0.16, 1, 0.3, 1),
      filter 700ms
        cubic-bezier(0.16, 1, 0.3, 1);
  }

  .our-work-filter-reveal.is-visible {
    opacity: 1;

    filter: blur(0);

    transform: translateX(0);
  }

  .our-work-card-reveal {
    opacity: 0;

    filter: blur(7px);

    transform:
      translateY(36px)
      scale(0.975);

    transition:
      opacity 780ms
        cubic-bezier(0.16, 1, 0.3, 1),
      transform 780ms
        cubic-bezier(0.16, 1, 0.3, 1),
      filter 780ms
        cubic-bezier(0.16, 1, 0.3, 1),
      border-color 400ms ease,
      box-shadow 400ms ease;
  }

  .our-work-card-reveal.is-visible {
    opacity: 1;

    filter: blur(0);

    transform:
      translateY(0)
      scale(1);
  }

  .our-work-card-reveal.is-visible:hover {
    transform:
      translateY(-8px)
      scale(1);
  }

  /* =========================
     FILTER / SHOW ALL ANIMATION
     ========================= */

  @keyframes ourWorkCardIn {
    from {
      opacity: 0;

      transform:
        translateY(20px)
        scale(0.98);

      filter: blur(5px);
    }

    to {
      opacity: 1;

      transform:
        translateY(0)
        scale(1);

      filter: blur(0);
    }
  }

  .our-work-card-filtered {
    animation:
      ourWorkCardIn
      520ms
      cubic-bezier(0.16, 1, 0.3, 1)
      both;
  }

  /* =========================
     TABLET
     ========================= */

  @media (max-width: 900px) {
    .our-work-section {
      padding:
        72px
        28px;
    }

    .our-work-header {
      align-items:
        flex-start;

      flex-direction:
        column;

      gap: 30px;
    }

    .our-work-filters {
      justify-content:
        flex-start;
    }

    .our-work-grid {
      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 22px;

      margin-top:
        50px;
    }

    .our-work-card {
      height:
        430px;
    }
  }

  /* =========================
     MOBILE
     ========================= */

  @media (max-width: 640px) {
    .our-work-section {
      padding:
        64px
        20px;
    }

    .our-work-header {
      gap: 26px;
    }

    .our-work-eyebrow {
      margin-bottom:
        14px;

      font-size:
        14px;

      letter-spacing:
        2.7px;
    }

    .our-work-title {
      font-size:
        clamp(
          38px,
          11vw,
          46px
        );

      line-height:
        1.08;
    }

    .our-work-filters {
      width:
        100%;

      gap:
        8px;

      overflow-x:
        auto;

      flex-wrap:
        nowrap;

      padding-bottom:
        4px;

      scrollbar-width:
        none;
    }

    .our-work-filters::-webkit-scrollbar {
      display:
        none;
    }

    .our-work-filter {
      flex:
        0 0 auto;

      min-width:
        auto;

      padding:
        10px
        15px;
    }

    .our-work-grid {
      grid-template-columns:
        1fr;

      gap:
        20px;

      margin-top:
        42px;
    }

    .our-work-card {
      height:
        470px;
    }

    .our-work-card__content {
      padding:
        0
        24px
        27px;
    }

    .our-work-view-all-wrapper {
      margin-top:
        32px;
    }
  }

  @media (max-width: 420px) {
    .our-work-card {
      height:
        420px;
    }
  }

  /* =========================
     REDUCED MOTION
     ========================= */

  @media (
    prefers-reduced-motion:
    reduce
  ) {
    .our-work-reveal,
    .our-work-filter-reveal,
    .our-work-card-reveal {
      opacity: 1;

      filter: none;

      transform: none;

      transition: none;
    }

    .our-work-card-filtered {
      animation: none;
    }

    .our-work-card,
    .our-work-card__image,
    .our-work-card__title,
    .our-work-filter,
    .our-work-view-all {
      transition: none;
    }
  }
`;

const OurWork = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState<WorkCategory>("All");

  const [showAll, setShowAll] =
    useState(false);

  /*
   * Animasi section ketika
   * masuk viewport.
   */
  useEffect(() => {
    const currentSection =
      sectionRef.current;

    if (!currentSection) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            observer.unobserve(
              currentSection
            );
          }
        },
        {
          threshold: 0.14,
          rootMargin:
            "0px 0px -60px 0px",
        }
      );

    observer.observe(
      currentSection
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Filter berdasarkan kategori.
   */
  const filteredWorks =
    useMemo(() => {
      if (
        activeFilter === "All"
      ) {
        return workItems;
      }

      return workItems.filter(
        (work) =>
          work.category ===
          activeFilter
      );
    }, [activeFilter]);

  /*
   * Saat showAll false:
   * maksimal hanya 3 proyek.
   *
   * Saat showAll true:
   * tampilkan semua proyek.
   */
  const displayedWorks =
    showAll
      ? filteredWorks
      : filteredWorks.slice(
          0,
          3
        );

  /*
   * Tombol hanya muncul
   * jika total proyek
   * lebih dari 3.
   */
  const hasMoreWorks =
    filteredWorks.length > 3;

  const handleFilterChange = (
    filter: WorkCategory
  ) => {
    setActiveFilter(filter);

    /*
     * Setiap pindah kategori,
     * kembali tampil hanya
     * maksimal 3 proyek.
     */
    setShowAll(false);
  };

  return (
    <section
      ref={sectionRef}
      className="our-work-section"
      aria-labelledby="our-work-title"
    >
      <style
        data-component="our-work"
      >
        {ourWorkStyles}
      </style>

      <div className="our-work-container">
        {/* =====================
            HEADER
            ===================== */}

        <div className="our-work-header">
          <div className="our-work-heading">
            <p
              className={`
                our-work-eyebrow
                our-work-reveal
                ${
                  isVisible
                    ? "is-visible"
                    : ""
                }
              `}
              style={{
                transitionDelay:
                  isVisible
                    ? "50ms"
                    : "0ms",
              }}
            >
              Our Work
            </p>

            <h2
              id="our-work-title"
              className={`
                our-work-title
                our-work-reveal
                ${
                  isVisible
                    ? "is-visible"
                    : ""
                }
              `}
              style={{
                transitionDelay:
                  isVisible
                    ? "140ms"
                    : "0ms",
              }}
            >
              Terpilih &amp;
              Terpercaya
            </h2>
          </div>

          {/* =====================
              FILTER BUTTON
              ===================== */}

          <div
            className={`
              our-work-filters
              our-work-filter-reveal
              ${
                isVisible
                  ? "is-visible"
                  : ""
              }
            `}
            style={{
              transitionDelay:
                isVisible
                  ? "220ms"
                  : "0ms",
            }}
            role="group"
            aria-label="Filter portofolio"
          >
            {filters.map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`
                    our-work-filter
                    ${
                      activeFilter ===
                      filter
                        ? "is-active"
                        : ""
                    }
                  `}
                  onClick={() =>
                    handleFilterChange(
                      filter
                    )
                  }
                  aria-pressed={
                    activeFilter ===
                    filter
                  }
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* =====================
            PROJECT GRID
            ===================== */}

        <div className="our-work-grid">
          {displayedWorks.length >
          0 ? (
            displayedWorks.map(
              (
                work,
                index
              ) => (
                <article
                  key={`${activeFilter}-${work.id}`}
                  className={[
                    "our-work-card",
                    "our-work-card-reveal",
                    "our-work-card-filtered",
                    isVisible
                      ? "is-visible"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    transitionDelay:
                      isVisible
                        ? `${
                            340 +
                            index *
                              130
                          }ms`
                        : "0ms",

                    animationDelay: `${
                      index * 70
                    }ms`,
                  }}
                >
                  <img width="1200" height="800" decoding="async"
                    src={
                      work.image
                    }
                    alt={
                      work.title
                    }
                    className="our-work-card__image"
                    loading="lazy"
                  />

                  <div
                    className="our-work-card__overlay"
                    aria-hidden="true"
                  />

                  <div
                    className="our-work-card__glow"
                    aria-hidden="true"
                  />

                  <div className="our-work-card__content">
                    <p className="our-work-card__label">
                      {
                        work.label
                      }
                    </p>

                    <h3 className="our-work-card__title">
                      {
                        work.title
                      }
                    </h3>
                  </div>
                </article>
              )
            )
          ) : (
            <div className="our-work-empty">
              Belum ada proyek
              pada kategori ini.
            </div>
          )}
        </div>

        {/* =====================
            LIHAT SEMUA PROYEK
            Hanya muncul jika
            proyek > 3
            ===================== */}

        {hasMoreWorks &&
          !showAll && (
            <div
              className={`
                our-work-view-all-wrapper
                our-work-reveal
                ${
                  isVisible
                    ? "is-visible"
                    : ""
                }
              `}
              style={{
                transitionDelay:
                  isVisible
                    ? "650ms"
                    : "0ms",
              }}
            >
              <button
                type="button"
                className="our-work-view-all"
                onClick={() =>
                  setShowAll(true)
                }
              >
                <span>
                  Lihat Semua Proyek
                </span>
              </button>
            </div>
          )}
      </div>
    </section>
  );
};

export default OurWork;