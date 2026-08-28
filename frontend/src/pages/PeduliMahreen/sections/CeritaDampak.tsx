import { useEffect } from "react";
import ceritaDampakImage from "../../../assets/PeduliMahreen/ceritadampak.webp";


const useLiteReveal = (selector: string) => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector]);
};

const ceritaDampakStyles = `
  .peduli-story-section {
    width: 100%;
    background: #1d201f;
    color: #f5efe7;
    padding: clamp(82px, 9vw, 126px) 28px;
  }

  .peduli-story-section,
  .peduli-story-section *,
  .peduli-story-section *::before,
  .peduli-story-section *::after {
    box-sizing: border-box;
  }

  .peduli-story__inner {
    width: min(100%, 1210px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(360px, 0.88fr) minmax(420px, 1fr);
    align-items: center;
    gap: clamp(62px, 8vw, 112px);
  }

  .peduli-story__visual {
    position: relative;
    width: min(100%, 560px);
    min-height: clamp(510px, 48vw, 640px);
  }

  .peduli-story__image-wrap {
    position: absolute;
    inset: 0 0 0 0;
    overflow: hidden;
    background: #111312;
    box-shadow: 0 32px 70px rgba(0, 0, 0, 0.28);
  }

  .peduli-story__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: grayscale(1) contrast(1.03) brightness(0.9);
    transform: scale(1.01);
  }

  .peduli-story__quote-mark {
    position: absolute;
    right: -28px;
    bottom: -28px;
    width: 78px;
    height: 78px;
    display: grid;
    place-items: center;
    background: #d0ad70;
    color: #111111;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 34px;
    font-weight: 900;
    line-height: 1;
    box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
  }

  .peduli-story__quote-mark span {
    transform: translateY(7px);
  }

  .peduli-story__content {
    max-width: 560px;
    padding-top: 4px;
  }

  .peduli-story__eyebrow {
    margin: 0 0 20px;
    color: #d0ad70;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 2.4px;
    text-transform: uppercase;
  }

  .peduli-story__title {
    margin: 0;
    max-width: 560px;
    color: #f6f0e8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(38px, 3.85vw, 58px);
    font-weight: 800;
    line-height: 0.96;
    letter-spacing: -0.052em;
  }

  .peduli-story__quote {
    margin: 30px 0 0;
    max-width: 565px;
    color: rgba(255, 255, 255, 0.8);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: clamp(15px, 1.25vw, 17px);
    font-style: italic;
    font-weight: 500;
    line-height: 1.72;
    letter-spacing: -0.015em;
  }

  .peduli-story__author {
    margin-top: 34px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .peduli-story__avatar {
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    overflow: hidden;
    border-radius: 12px;
    border: 2px solid #d0ad70;
    background: #111312;
  }

  .peduli-story__avatar img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: saturate(0.9) contrast(1.02);
  }

  .peduli-story__name {
    margin: 0;
    color: #f6f0e8;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .peduli-story__role {
    margin: 4px 0 0;
    color: rgba(255, 255, 255, 0.67);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.35;
  }



  [data-lite-reveal] {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
    transition:
      opacity 560ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }

  [data-lite-reveal="left"] {
    transform: translate3d(-22px, 0, 0);
  }

  [data-lite-reveal="right"] {
    transform: translate3d(22px, 0, 0);
  }

  [data-lite-reveal="fade"] {
    transform: none;
  }

  [data-lite-reveal].is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    will-change: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-lite-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
      will-change: auto;
    }
  }

  @media (max-width: 1080px) {
    .peduli-story__inner {
      grid-template-columns: 1fr;
      gap: 58px;
    }

    .peduli-story__visual {
      width: min(100%, 620px);
      min-height: 540px;
    }

    .peduli-story__content {
      max-width: 680px;
    }
  }

  @media (max-width: 720px) {
    .peduli-story-section {
      padding: 74px 20px 92px;
    }

    .peduli-story__inner {
      gap: 48px;
    }

    .peduli-story__visual {
      min-height: 430px;
    }

    .peduli-story__quote-mark {
      right: 18px;
      bottom: -28px;
      width: 68px;
      height: 68px;
      font-size: 30px;
    }

    .peduli-story__title {
      font-size: clamp(36px, 10.5vw, 48px);
    }

    .peduli-story__quote {
      font-size: 14px;
      line-height: 1.7;
    }
  }

  @media (max-width: 430px) {
    .peduli-story__visual {
      min-height: 360px;
    }
  }
`;

const CeritaDampak = () => {
  useLiteReveal(".peduli-story-section [data-lite-reveal]");

  return (
    <section className="peduli-story-section" aria-labelledby="peduli-story-title">
      <style data-component="peduli-cerita-dampak-section">{ceritaDampakStyles}</style>

      <div className="peduli-story__inner">
        <div className="peduli-story__visual" data-lite-reveal="left">
          <div className="peduli-story__image-wrap">
            <img width="527" height="615"
              className="peduli-story__image"
              src={ceritaDampakImage}
              alt="Siswa penerima manfaat Kelas Inspirasi Mahreen"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="peduli-story__quote-mark" aria-hidden="true">
            <span>”</span>
          </div>
        </div>

        <div className="peduli-story__content">
          <p className="peduli-story__eyebrow" data-lite-reveal style={{ transitionDelay: "80ms" }}>Cerita Dampak</p>

          <h2 className="peduli-story__title" id="peduli-story-title" data-lite-reveal style={{ transitionDelay: "150ms" }}>
            &quot;Kini Saya Tahu, Menjadi Arsitek Bukan Hanya Mimpi.&quot;
          </h2>

          <p className="peduli-story__quote" data-lite-reveal style={{ transitionDelay: "220ms" }}>
            &quot;Dulu saya pikir perpustakaan hanyalah tempat yang membosankan dengan
            buku-buku tua. Tapi di Kelas Inspirasi Mahreen, saya melihat dunia lewat
            tablet dan bertemu Kak Aris yang mengajari saya cara mendesain rumah.
            Sekarang saya rajin menggambar setiap hari.&quot;
          </p>

          <div className="peduli-story__author" aria-label="Profil penerima manfaat" data-lite-reveal style={{ transitionDelay: "290ms" }}>
            <div className="peduli-story__avatar">
              <img width="527" height="615" src={ceritaDampakImage} alt="Adi, penerima manfaat" loading="lazy" decoding="async" />
            </div>

            <div>
              <p className="peduli-story__name">Adi (10 Thn)</p>
              <p className="peduli-story__role">Siswa Kelas 4 SD, Penerima Manfaat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeritaDampak;
