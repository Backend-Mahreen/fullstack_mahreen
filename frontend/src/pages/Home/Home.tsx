import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

const HomeSections = lazy(() => import("./HomeSections"));
const Footer = lazy(() => import("../../components/Footer/Footer"));

const statistics = [
  {
    value: "50+",
    lines: ["MITRA KAMPUS"],
  },
  {
    value: "10+",
    lines: ["PROYEK SELESAI"],
  },
  {
    value: "15+",
    lines: ["KOLABORASI"],
  },
  {
    value: "20+",
    lines: ["EVENTS PROGRAM"],
  },
  {
    value: "10+",
    lines: ["PEDULI MAHREEN"],
  },
  {
    value: "4",
    lines: ["BUSINESS PILLAR"],
  },
];

const getRequestedHomeSection = () => {
  if (typeof window === "undefined") return "";

  return new URLSearchParams(window.location.search).get("section") ||
    (window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "");
};

const Home = () => {
  const [showBelowFold, setShowBelowFold] = useState(
    () => Boolean(getRequestedHomeSection()),
  );
  const belowFoldSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showBelowFold) return;
    const targetId = getRequestedHomeSection();
    if (!targetId) return;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return true;
    };

    if (scrollToTarget()) return;
    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect();
    });
    observer.observe(document.querySelector(".home-content") ?? document.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [showBelowFold]);

  useEffect(() => {
    const revealBelowFold = () => setShowBelowFold(true);
    const interactionEvents = ["scroll", "touchmove", "wheel"] as const;
    const sentinel = belowFoldSentinelRef.current;
    const observer = sentinel && "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              revealBelowFold();
            }
          },
          {
            threshold: 0.01,
            rootMargin: "0px 0px -1px 0px",
          },
        )
      : null;

    if (sentinel && observer) {
      observer.observe(sentinel);
    }

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, revealBelowFold, {
        once: true,
        passive: true,
      });
    });
    window.addEventListener("keydown", revealBelowFold, { once: true });

    return () => {
      observer?.disconnect();
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, revealBelowFold);
      });
      window.removeEventListener("keydown", revealBelowFold);
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="home-content" id="home">
        <section className="home-page" aria-labelledby="home-hero-title">
          <div className="home-hero" aria-label="Hero Mahreen Indonesia">
            <picture className="home-hero__media" aria-hidden="true">
              <source
                media="(max-width: 768px)"
                srcSet="/hero-home-mobile.webp"
                type="image/webp"
              />
              <img
                className="home-hero__background"
                src="/hero-home.webp"
                alt=""
                width="1440"
                height="773"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </picture>

            <div className="home-hero__content">
              <h1 className="home-hero__title" id="home-hero-title">
                <span className="home-hero__title-line">
                  Membangun Generasi
                </span>
                <span className="home-hero__title-line home-hero__title-line--gold">
                  Ekosistem Kreatif
                </span>
                <span className="home-hero__title-line home-hero__title-line--italic">
                  Masa Depan Indonesia
                </span>
              </h1>

              <p className="home-hero__description">
                <span className="home-hero__description-line">
                  Memberdayakan bisnis, mahasiswa, komunitas, dan organisasi melalui
                </span>
                <span className="home-hero__description-line">
                  kreativitas, teknologi, pendidikan, dan kolaborasi yang bermakna.
                </span>
              </p>

              <nav
                className="home-hero__actions"
                aria-label="Navigasi utama halaman beranda"
              >
                <a
                  className="home-hero__button home-hero__button--primary"
                  href="/?section=ecosystem"
                  aria-label="Jelajahi ekosistem Mahreen Indonesia"
                  onClick={() => setShowBelowFold(true)}
                >
                  Jelajahi Ekosistem
                </a>
                <a
                  className="home-hero__button home-hero__button--outline"
                  href="/?section=learning"
                  aria-label="Mulai belajar melalui program Mahreen Indonesia"
                  onClick={() => setShowBelowFold(true)}
                >
                  Mulai Belajar
                </a>
              </nav>
            </div>

            <dl
              className="home-hero__statistics"
              aria-label="Statistik Ekosistem Mahreen Indonesia"
            >
              {statistics.map((statistic) => (
                <div
                  className="home-hero__statistic"
                  key={statistic.lines.join("-")}
                >
                  <dt className="home-hero__statistic-label">
                    {statistic.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </dt>
                  <dd className="home-hero__statistic-value">
                    {statistic.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {showBelowFold ? (
          <Suspense fallback={<div className="home-below-fold-placeholder" aria-hidden="true" />}>
            <HomeSections />
          </Suspense>
        ) : (
          <div
            className="home-below-fold-placeholder"
            ref={belowFoldSentinelRef}
            aria-hidden="true"
          />
        )}
      </main>

      {showBelowFold ? (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      ) : null}
    </>
  );
};

export default Home;
