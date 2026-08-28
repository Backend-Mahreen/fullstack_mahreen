import { useEffect, useState, type CSSProperties } from "react";
import Navbar from "../../components/Navbar/Peduli-MahreenNavbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import TargetPenerimaManfaat from "./sections/TargetPenerimaManfaat";
import TimelinePelaksanaan from "./sections/TimelinePelaksanaan";
import JejakLangkah from "./sections/JejakLangkah";
import CeritaDampak from "./sections/CeritaDampak";
import Kontribusi from "./sections/Kontribusi";
import heroBackground from "../../assets/PeduliMahreen/bground-hero.webp";
import { campaignRepository } from "../../services/campaign/campaignRepository";

const peduliMahreenStyles = `
  #peduli-context,
  #peduli-benefit-title,
  #peduli-timeline-title,
  #peduli-story-title,
  #peduli-contribution-title {
    scroll-margin-top: 104px;
  }

  .peduli-page {
    --peduli-black: #000000;
    --peduli-panel: #202322;
    --peduli-panel-deep: #171a19;
    --peduli-gold: #d3ad6d;
    --peduli-gold-soft: rgba(211, 173, 109, 0.16);
    --peduli-text: #f6f1e8;
    --peduli-muted: rgba(255, 255, 255, 0.73);
    --peduli-soft: rgba(255, 255, 255, 0.52);

    width: 100%;
    min-height: 100vh;
    background: var(--peduli-black);
    color: var(--peduli-text);
  }

  .peduli-page,
  .peduli-page *,
  .peduli-page *::before,
  .peduli-page *::after {
    box-sizing: border-box;
  }

  .peduli-page a {
    color: inherit;
    text-decoration: none;
  }

  @keyframes peduliHeroImageEnter {
    from {
      opacity: 0;
      transform: scale(1.04);
    }

    to {
      opacity: 1;
      transform: scale(1.01);
    }
  }

  @keyframes peduliContentEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .peduli-hero {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-height: 820px;
    overflow: visible;
    display: flex;
    align-items: stretch;
    padding-bottom: clamp(86px, 8vw, 122px);
    background: #050505;
  }

  .peduli-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -4;
    background-image: var(--peduli-hero-image, url("${heroBackground}"));
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
    opacity: 0;
    transform: scale(1.04);
    filter: brightness(0.72) saturate(0.96) contrast(1.04);
    animation: peduliHeroImageEnter 900ms ease-out 80ms both;
  }

  .peduli-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -3;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.46) 0%, rgba(0, 0, 0, 0.22) 38%, rgba(0, 0, 0, 0.78) 100%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.74) 0%, rgba(0, 0, 0, 0.28) 43%, rgba(0, 0, 0, 0.2) 100%);
  }

  .peduli-hero__vignette {
    position: absolute;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background:
      radial-gradient(circle at 52% 28%, rgba(211, 173, 109, 0.15), transparent 24%),
      radial-gradient(circle at 85% 88%, rgba(211, 173, 109, 0.08), transparent 24%);
  }

  .peduli-hero__inner {
    width: min(100%, 1210px);
    min-height: inherit;
    margin: 0 auto;
    padding: 140px 28px 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
  }

  .peduli-hero__content {
    width: min(100%, 560px);
    padding-top: clamp(20px, 5.2vw, 70px);
    opacity: 0;
    animation: peduliContentEnter 680ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
  }

  .peduli-hero__eyebrow {
    margin: 0 0 14px;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: var(--peduli-gold);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 2.6px;
    text-transform: uppercase;
  }

  .peduli-hero__eyebrow::before {
    content: "";
    width: 42px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--peduli-gold));
  }

  .peduli-hero__title {
    max-width: 640px;
    margin: 0;
    color: var(--peduli-text);
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(47px, 5.1vw, 72px);
    font-weight: 800;
    line-height: 0.93;
    letter-spacing: -0.055em;
    text-shadow: 0 12px 30px rgba(0, 0, 0, 0.44);
  }

  .peduli-hero__title span {
    display: block;
  }

  .peduli-hero__description {
    max-width: 620px;
    margin: 28px 0 0;
    color: rgba(255, 255, 255, 0.78);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: clamp(14px, 1.1vw, 16px);
    font-weight: 400;
    line-height: 1.8;
    letter-spacing: -0.01em;
    text-shadow: 0 8px 18px rgba(0, 0, 0, 0.42);
  }

  .peduli-hero__button {
    width: fit-content;
    min-width: 228px;
    min-height: 52px;
    margin-top: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 0 28px;
    border: 1px solid rgba(230, 194, 132, 0.82);
    background: #d4ae70;
    color: #111111;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 1.8px;
    line-height: 1;
    text-transform: uppercase;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.34), 0 0 30px rgba(211, 173, 109, 0.16);
    transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
  }

  .peduli-hero__button svg {
    width: 14px;
    height: 14px;
    transition: transform 180ms ease;
  }

  .peduli-hero__button:hover,
  .peduli-hero__button:focus-visible {
    background: #e0bf85;
    transform: translateY(-2px);
    box-shadow: 0 22px 46px rgba(0, 0, 0, 0.42), 0 0 34px rgba(211, 173, 109, 0.22);
  }

  .peduli-hero__button:hover svg,
  .peduli-hero__button:focus-visible svg {
    transform: translateX(4px);
  }

  .peduli-hero__button:focus-visible {
    outline: 2px solid rgba(224, 191, 133, 0.72);
    outline-offset: 5px;
  }

  .peduli-hero__cards {
    position: relative;
    width: min(100%, 960px);
    margin: 42px 0 0;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.82fr);
    gap: 24px;
    align-items: stretch;
    opacity: 0;
    animation: peduliContentEnter 700ms cubic-bezier(0.22, 1, 0.36, 1) 320ms both;
  }

  .peduli-info-card {
    position: relative;
    overflow: hidden;
    min-height: 220px;
    padding: 42px 46px 44px;
    background: rgba(31, 34, 33, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.36);
  }

  .peduli-info-card--mission {
    min-height: 202px;
    padding: 42px 42px 40px;
  }

  .peduli-info-card::after {
    content: "";
    position: absolute;
    right: -46px;
    bottom: -58px;
    width: 118px;
    height: 118px;
    border-radius: 50%;
    border: 14px solid rgba(211, 173, 109, 0.08);
    pointer-events: none;
  }

  .peduli-info-card__meta {
    margin: 0 0 20px;
    color: var(--peduli-gold);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 2.3px;
    text-transform: uppercase;
  }

  .peduli-info-card__title {
    margin: 0;
    color: #f5efe3;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(31px, 3.2vw, 42px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .peduli-info-card__text {
    margin: 26px 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.75;
  }

  .peduli-info-card__text p {
    margin: 0;
  }

  .peduli-info-card__text p + p {
    margin-top: 20px;
  }

  .peduli-mission-list {
    margin: 28px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .peduli-mission-list li {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
    color: rgba(255, 255, 255, 0.74);
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }

  .peduli-mission-list svg {
    width: 15px;
    height: 15px;
    margin-top: 2px;
    color: var(--peduli-gold);
  }

  .peduli-contact-anchor {
    scroll-margin-top: 96px;
  }

  @media (max-width: 1024px) {
    .peduli-hero {
      min-height: auto;
      padding-bottom: 96px;
    }

    .peduli-hero__inner {
      padding: 126px 24px 0;
    }

    .peduli-hero__cards {
      width: 100%;
      grid-template-columns: 1fr;
      margin-bottom: 0;
    }

    .peduli-info-card,
    .peduli-info-card--mission {
      min-height: auto;
      padding: 36px;
    }
  }

  @media (max-width: 720px) {
    .peduli-hero::before {
      background-position: center center;
    }

    .peduli-hero::after {
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.54) 0%, rgba(0, 0, 0, 0.32) 36%, rgba(0, 0, 0, 0.82) 100%),
        linear-gradient(90deg, rgba(0, 0, 0, 0.76) 0%, rgba(0, 0, 0, 0.32) 70%, rgba(0, 0, 0, 0.2) 100%);
    }

    .peduli-hero__inner {
      padding: 112px 20px 0;
    }

    .peduli-hero__content {
      padding-top: 34px;
    }

    .peduli-hero__eyebrow {
      font-size: 14px;
      letter-spacing: 2.1px;
    }

    .peduli-hero__eyebrow::before {
      width: 30px;
    }

    .peduli-hero__title {
      font-size: clamp(42px, 13vw, 58px);
    }

    .peduli-hero__description {
      max-width: 520px;
      font-size: 14px;
      line-height: 1.7;
    }

    .peduli-hero__button {
      width: 100%;
      max-width: 270px;
      min-width: 0;
    }

    .peduli-hero__cards {
      margin-top: 58px;
      margin-bottom: 0;
      gap: 16px;
    }

    .peduli-info-card,
    .peduli-info-card--mission {
      padding: 30px 26px;
    }

    .peduli-info-card__title {
      font-size: 34px;
    }

    .peduli-info-card__text,
    .peduli-mission-list li {
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .peduli-hero::before,
    .peduli-hero__content,
    .peduli-hero__cards {
      opacity: 1;
      animation: none;
      transform: none;
    }

    .peduli-hero__button,
    .peduli-hero__button svg {
      transition: none;
    }
  }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5.7 9.2L7.8 11.3L12.4 6.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PeduliMahreen = () => {
  const getFeaturedCampaign = () => campaignRepository
    .getSnapshot()
    .campaigns
    .find((campaign) => campaign.status === "Published" && campaign.visibility === "Public");
  const [featuredCampaign, setFeaturedCampaign] = useState(getFeaturedCampaign);

  useEffect(() => campaignRepository.subscribe(() => {
    setFeaturedCampaign(getFeaturedCampaign());
  }), []);

  const heroStyle = featuredCampaign?.thumbnail
    ? ({ "--peduli-hero-image": `url("${featuredCampaign.thumbnail}")` } as CSSProperties)
    : undefined;

  return (
    <>
      
      <style data-component="peduli-mahreen-page">{peduliMahreenStyles}</style>
      <Navbar />

      <main className="peduli-page">
        <section className="peduli-hero" aria-labelledby="peduli-hero-title" style={heroStyle}>
          <span className="peduli-hero__vignette" aria-hidden="true" />

          <div className="peduli-hero__inner">
            <div className="peduli-hero__content">
              <p className="peduli-hero__eyebrow">{featuredCampaign?.category ?? "Program Pendidikan"}</p>

              <h1 className="peduli-hero__title" id="peduli-hero-title">
                <span>{featuredCampaign?.title ?? "Kelas Inspirasi: Menyemai Mimpi"}</span>
              </h1>

              <p className="peduli-hero__description">
                {featuredCampaign?.story ?? "Inisiatif pemberdayaan generasi muda melalui akses literasi berkualitas dan bimbingan mentor profesional di lingkungan belajar yang hangat, inklusif, dan menguatkan masa depan."}
              </p>

              <a
                className="peduli-hero__button"
                href={featuredCampaign ? `/peduli-mahreen/donasi?campaign=${encodeURIComponent(featuredCampaign.id)}` : "/peduli-mahreen/donasi"}
              >
                Ikut Berkontribusi
                <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 9H14.5M14.5 9L10.5 5M14.5 9L10.5 13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className="peduli-hero__cards" id="peduli-context">
              <article className="peduli-info-card">
                <p className="peduli-info-card__meta">01 / Konteks</p>
                <h2 className="peduli-info-card__title">Latar Belakang</h2>
                <div className="peduli-info-card__text">
                  <p>
                    Kami percaya bahwa kesenjangan akses pendidikan bukan sekadar
                    masalah sarana, melainkan inspirasi. Peduli Mahreen hadir untuk
                    membuka cakrawala siswa dari daerah prasejahtera melalui ruang
                    belajar yang bermakna.
                  </p>
                  <p>
                    Melalui Kelas Inspirasi, kami menghadirkan lingkungan belajar yang
                    memadai serta sosok teladan yang mampu memotivasi mereka untuk
                    berani bermimpi lebih besar.
                  </p>
                </div>
              </article>

              <article className="peduli-info-card peduli-info-card--mission">
                <p className="peduli-info-card__meta">02 / Misi</p>
                <h2 className="peduli-info-card__title">Tujuan Program</h2>
                <ul className="peduli-mission-list">
                  <li>
                    <CheckIcon />
                    <span>Meningkatkan minat baca dan literasi digital secara inklusif.</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>Membangun karakter dan kepercayaan diri melalui mentoring.</span>
                  </li>
                  <li>
                    <CheckIcon />
                    <span>Menyediakan fasilitas belajar modern yang nyaman dan inspiratif.</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <TargetPenerimaManfaat />
        <TimelinePelaksanaan />
        <JejakLangkah />
        <CeritaDampak />
        <Kontribusi />
        <section id="hubungi-kami" className="peduli-contact-anchor">
          <ClosingSection />
        </section>
        <Footer />
      </main>
    </>
  );
};

export default PeduliMahreen;
