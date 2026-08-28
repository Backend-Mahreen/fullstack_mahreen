import { useEffect, useMemo, type CSSProperties } from "react";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { navigateToRoute } from "../../../../utils/hashNavigation";

import Navbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import meetingImage from "../../../../assets/TanyaMahreen/FreeKonsultasi/bgound-meeting.webp";
import avatarOne from "../../../../assets/Internship/maya-kania.jpg";
import avatarTwo from "../../../../assets/Internship/raka-pratama.jpg";
import avatarThree from "../../../../assets/Internship/dimas-andre.jpg";
import sarahPhoto from "../../../../assets/Internship/maya-kania.jpg";
import adityaPhoto from "../../../../assets/Internship/raka-pratama.jpg";
import {
  getKonsultasiDraft,
  isKonsultasiReviewed,
  type KonsultasiDraft,
} from "../../../../services/konsultasiDraft";
import SteepProgres from "../CekData/SteepProgres";

const projectManagers = [
  {
    name: "Sarah Amalia",
    role: "Leader Project Manager",
    photo: sarahPhoto,
    email: "info@mahreenindonesia.com",
    description:
      "Sarah berpengalaman selama 5+ tahun dalam memimpin proyek kreatif digital, branding korporat, dan kampanye sosial berskala besar.",
  },
  {
    name: "Aditya Beckham",
    role: "Tech Project Manager",
    photo: adityaPhoto,
    email: "info@mahreenindonesia.com",
    description:
      "Aditya spesialis dalam pengembangan teknologi digital, arsitektur website modern, dan integrasi sistem backend yang kompleks.",
  },
] as const;

const hubungiPmStyles = `

  @keyframes pmHeroReveal {
    0% { opacity: 0; transform: translateY(32px); filter: blur(8px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes pmCardReveal {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(.975);
      filter: blur(7px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes pmVisualReveal {
    0% {
      opacity: 0;
      transform: translate3d(46px, 16px, 0) scale(.97);
      clip-path: inset(0 100% 0 0 round 22px);
      filter: blur(7px);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      clip-path: inset(0 0 0 0 round 22px);
      filter: blur(0);
    }
  }

  @keyframes pmLineGrow {
    from { transform: scaleX(0); opacity: 0; }
    to { transform: scaleX(1); opacity: 1; }
  }

  @keyframes pmGlowPulse {
    0%, 100% { box-shadow: 0 8px 22px rgba(28, 215, 105, .14); }
    50% { box-shadow: 0 12px 32px rgba(28, 215, 105, .27); }
  }

  .contact-pm-page,
  .contact-pm-page *,
  .contact-pm-page *::before,
  .contact-pm-page *::after {
    box-sizing: border-box;
  }

  .contact-pm-page {
    width: 100%;
    min-height: 100svh;
    overflow-x: hidden;
    background: #0d0d0d;
    color: #f5f0e7;
    font-family: "DM Sans", Arial, sans-serif;
  }

  .contact-pm-main {
    background: #0d0d0d;
  }

  .contact-pm-hero {
    position: relative;
    isolation: isolate;
    min-height: 760px;
    padding: 116px clamp(28px, 4.6vw, 84px) 38px;
    overflow: hidden;
    background:
      radial-gradient(circle at 82% 23%, rgba(201, 154, 82, .065), transparent 31%),
      linear-gradient(180deg, #0b0b0b 0%, #0d0d0d 100%);
  }

  .contact-pm-hero::before {
    content: "";
    position: absolute;
    inset: 76px 0 auto;
    z-index: -1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, .08), transparent);
  }

  .contact-pm-hero::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(1540px, calc(100% - 48px));
    height: 1px;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, .17), transparent);
    animation: pmLineGrow 1050ms 680ms cubic-bezier(.16, 1, .3, 1) forwards;
  }

  .contact-pm-hero__container {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(470px, .9fr);
    align-items: center;
    gap: clamp(58px, 7vw, 122px);
    width: min(1540px, 100%);
    margin: 0 auto;
  }

  .contact-pm-hero__content {
    max-width: 720px;
  }

  .contact-pm-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    min-height: 28px;
    margin: 0 0 28px;
    padding: 7px 14px;
    border: 1px solid rgba(231, 195, 127, .42);
    border-radius: 999px;
    background: rgba(113, 83, 40, .16);
    color: #e9c87f;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 2px;
    text-transform: uppercase;
    animation: pmHeroReveal 720ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-hero__eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f2d28e;
    box-shadow: 0 0 14px rgba(242, 210, 142, .66);
  }

  .contact-pm-hero__title {
    max-width: 690px;
    margin: 0;
    color: #f1d08c;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(66px, 5.7vw, 104px);
    font-weight: 600;
    line-height: .94;
    letter-spacing: -.052em;
    animation: pmHeroReveal 820ms 80ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-hero__description {
    max-width: 620px;
    margin: 29px 0 0;
    color: rgba(245, 240, 231, .69);
    font-size: clamp(15px, 1.05vw, 18px);
    line-height: 1.68;
    animation: pmHeroReveal 820ms 155ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-hero__proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 34px;
    animation: pmHeroReveal 820ms 230ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-hero__avatars {
    display: flex;
    align-items: center;
    padding-left: 4px;
  }

  .contact-pm-hero__avatar {
    width: 39px;
    height: 39px;
    margin-left: -10px;
    overflow: hidden;
    border: 2px solid #0b0b0b;
    border-radius: 50%;
    background: #1b1b1b;
  }

  .contact-pm-hero__avatar:first-child { margin-left: 0; }

  .contact-pm-hero__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(.72) contrast(1.04);
  }

  .contact-pm-hero__proof-text {
    margin: 0;
    color: rgba(247, 242, 234, .76);
    font-size: 14px;
    font-weight: 600;
  }

  .contact-pm-hero__proof-text strong {
    color: #efd083;
  }

  .contact-pm-hero__visual {
    min-width: 0;
    perspective: 1100px;
    animation: pmVisualReveal 1000ms 160ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-hero__image-frame {
    position: relative;
    display: grid;
    gap: 20px;
    width: 100%;
    max-width: 650px;
    min-height: 450px;
    margin-left: auto;
    padding: 22px 22px 20px 28px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .075);
    border-left-color: rgba(239, 204, 135, .88);
    border-radius: 24px;
    background: rgba(18, 18, 18, .9);
    box-shadow: 0 34px 86px rgba(0, 0, 0, .34);
  }

  .contact-pm-hero__image-frame::before {
    content: "";
    position: absolute;
    top: 18px;
    bottom: 18px;
    left: 12px;
    width: 1px;
    border-radius: 999px;
    background: linear-gradient(180deg, #f0cc81, rgba(240, 204, 129, .08));
    box-shadow: 0 0 16px rgba(240, 204, 129, .24);
  }

  .contact-pm-hero__image {
    display: block;
    width: 100%;
    min-height: 305px;
    aspect-ratio: 1.62 / 1;
    object-fit: cover;
    border-radius: 10px;
    filter: brightness(.62) saturate(.72) sepia(.08) contrast(1.04);
    transition: transform 700ms cubic-bezier(.16, 1, .3, 1), filter 420ms ease;
  }

  .contact-pm-hero__image-frame:hover .contact-pm-hero__image {
    transform: scale(1.018);
    filter: brightness(.69) saturate(.76) sepia(.07) contrast(1.04);
  }

  .contact-pm-hero__quote {
    margin: 0;
    padding: 0 4px 2px;
  }

  .contact-pm-hero__quote-text {
    margin: 0;
    color: rgba(246, 241, 233, .8);
    font-size: 14px;
    line-height: 1.55;
  }

  .contact-pm-hero__quote-author {
    margin: 10px 0 0;
    color: #e6c67f;
    font-size: 14px;
    font-weight: 600;
  }

  .contact-pm-hero__stepper {
    width: min(1540px, 100%);
    margin: 48px auto 0;
    animation: pmHeroReveal 850ms 360ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .consult-stepper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: start;
    width: 100%;
    margin: 0;
  }

  .consult-stepper__track {
    position: absolute;
    top: 21px;
    right: 6.25%;
    left: 6.25%;
    height: 1px;
    overflow: hidden;
    background: #343434;
  }

  .consult-stepper__progress {
    display: block;
    height: 100%;
    background: #efd08c;
    box-shadow: 0 0 14px rgba(239, 208, 140, .52);
    transition: width 420ms ease;
  }

  .consult-stepper__item {
    position: relative;
    z-index: 1;
    display: flex;
    min-width: 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 11px;
    color: #bdb7ae;
    text-align: center;
  }

  .consult-stepper__number {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 1px solid #383838;
    border-radius: 50%;
    background: #232323;
    color: #d9d4cc;
    font-size: 14px;
    font-weight: 600;
  }

  .consult-stepper__label {
    font-size: 14px;
    font-weight: 500;
  }

  .consult-stepper__item.is-active .consult-stepper__number,
  .consult-stepper__item.is-complete .consult-stepper__number {
    border-color: #f1d18d;
    background: #f3d48f;
    color: #21180a;
    box-shadow: 0 0 25px rgba(242, 207, 137, .54);
  }

  .consult-stepper__item.is-active .consult-stepper__label,
  .consult-stepper__item.is-complete .consult-stepper__label {
    color: #f0d18f;
  }

  .contact-pm-section {
    position: relative;
    isolation: isolate;
    min-height: 720px;
    padding: 76px 24px 82px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 18%, rgba(205, 158, 76, .045), transparent 28%),
      #0d0d0d;
  }

  .contact-pm-section::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.008), transparent);
  }

  .contact-pm-section__container {
    width: min(930px, 100%);
    margin: 0 auto;
  }

  .contact-pm-section__header {
    max-width: 690px;
    margin: 0 auto;
    text-align: center;
    animation: pmCardReveal 760ms 90ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-section__title {
    margin: 0;
    color: #efcd88;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 3.2vw, 48px);
    font-weight: 600;
    line-height: 1.18;
    letter-spacing: -.025em;
  }

  .contact-pm-section__description {
    max-width: 625px;
    margin: 14px auto 0;
    color: #aaa39a;
    font-size: 14px;
    line-height: 1.65;
  }

  .contact-pm-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
    margin-top: 50px;
  }

  .contact-pm-card {
    position: relative;
    min-height: 365px;
    padding: 30px 30px 28px;
    overflow: hidden;
    border: 1px solid #67645f;
    border-radius: 18px;
    background:
      linear-gradient(145deg, rgba(22, 22, 22, .98), rgba(16, 16, 16, .98));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.018);
    animation: pmCardReveal 820ms var(--pm-delay, 160ms) cubic-bezier(.16, 1, .3, 1) both;
    transition: transform 240ms cubic-bezier(.16, 1, .3, 1), border-color 240ms ease, box-shadow 240ms ease;
  }

  .contact-pm-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 20% 8%, rgba(236, 199, 123, .065), transparent 31%);
    pointer-events: none;
  }

  .contact-pm-card:hover {
    transform: translateY(-6px);
    border-color: rgba(239, 205, 137, .62);
    box-shadow: 0 22px 52px rgba(0,0,0,.35), 0 0 26px rgba(231, 188, 104, .06);
  }

  .contact-pm-card__identity {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .contact-pm-card__photo-wrap {
    flex: 0 0 auto;
    width: 72px;
    height: 72px;
    overflow: hidden;
    border: 1px solid rgba(236, 204, 141, .28);
    border-radius: 50%;
    background: #222;
    box-shadow: 0 0 0 5px rgba(255,255,255,.018);
  }

  .contact-pm-card__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(.82) contrast(1.04) brightness(.82);
  }

  .contact-pm-card__name {
    margin: 0;
    color: #eee5d7;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  .contact-pm-card__role {
    margin: 5px 0 0;
    color: #e8c679;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  .contact-pm-card__description {
    position: relative;
    z-index: 1;
    min-height: 70px;
    margin: 27px 0 0;
    color: #aaa39a;
    font-size: 14px;
    line-height: 1.72;
  }

  .contact-pm-card__actions {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 11px;
    margin-top: 26px;
  }

  .contact-pm-card__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 100%;
    min-height: 48px;
    padding: 12px 18px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    text-transform: uppercase;
    transition: transform 200ms ease, filter 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
  }

  .contact-pm-card__button svg {
    width: 17px;
    height: 17px;
    stroke-width: 2;
  }

  .contact-pm-card__button--whatsapp {
    border: 1px solid #24d66f;
    background: #22d36d;
    color: #06190d;
    animation: pmGlowPulse 3s ease-in-out infinite;
  }

  .contact-pm-card__button--email {
    border: 1px solid #383838;
    background: transparent;
    color: #eee8df;
  }

  .contact-pm-card__button:hover,
  .contact-pm-card__button:focus-visible {
    transform: translateY(-2px);
    filter: brightness(1.05);
    outline: none;
  }

  .contact-pm-card__button--email:hover,
  .contact-pm-card__button--email:focus-visible {
    border-color: rgba(235, 201, 132, .52);
    background: rgba(235, 201, 132, .045);
    color: #f0ce89;
  }

  .contact-pm-back {
    display: flex;
    justify-content: center;
    margin-top: 55px;
    animation: pmHeroReveal 760ms 360ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .contact-pm-back__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #e6c67f;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: color 180ms ease, transform 180ms ease, text-shadow 180ms ease;
  }

  .contact-pm-back__link svg {
    width: 14px;
    height: 14px;
  }

  .contact-pm-back__link:hover,
  .contact-pm-back__link:focus-visible {
    color: #ffe1a5;
    transform: translateX(-3px);
    text-shadow: 0 0 14px rgba(239, 207, 139, .36);
    outline: none;
  }

  @media (max-width: 1050px) {
    .contact-pm-hero {
      min-height: auto;
      padding-top: 112px;
    }

    .contact-pm-hero__container {
      grid-template-columns: 1fr .85fr;
      gap: 44px;
    }

    .contact-pm-hero__title {
      font-size: clamp(60px, 7.6vw, 84px);
    }

    .contact-pm-hero__image-frame {
      min-height: 400px;
    }
  }

  @media (max-width: 860px) {
    .contact-pm-hero__container {
      grid-template-columns: 1fr;
    }

    .contact-pm-hero__visual {
      width: min(650px, 100%);
      margin: 0 auto;
    }

    .contact-pm-hero__image-frame {
      min-height: 420px;
      margin: 0;
    }
  }

  @media (max-width: 720px) {
    .contact-pm-grid {
      grid-template-columns: 1fr;
      width: min(440px, 100%);
      margin-right: auto;
      margin-left: auto;
    }

    .contact-pm-card__description {
      min-height: auto;
    }
  }

  @media (max-width: 680px) {
    .contact-pm-hero {
      padding: 102px 20px 31px;
    }

    .contact-pm-hero__title {
      font-size: clamp(53px, 16.5vw, 72px);
    }

    .contact-pm-hero__description {
      font-size: 14px;
    }

    .contact-pm-hero__image-frame {
      min-height: auto;
      padding: 16px 16px 16px 22px;
      border-radius: 18px;
    }

    .contact-pm-hero__image {
      min-height: 215px;
    }

    .contact-pm-hero__stepper {
      margin-top: 38px;
    }

    .consult-stepper__track { top: 18px; }

    .consult-stepper__number {
      width: 36px;
      height: 36px;
      font-size: 14px;
    }

    .consult-stepper__label {
      max-width: 72px;
      font-size: 14px;
    }

    .contact-pm-section {
      min-height: auto;
      padding: 64px 18px 72px;
    }

    .contact-pm-section__title {
      font-size: 32px;
    }

    .contact-pm-section__description {
      font-size: 14px;
    }

    .contact-pm-card {
      padding: 26px 22px 24px;
    }
  }

  @media (max-width: 440px) {
    .contact-pm-hero__proof {
      align-items: flex-start;
      flex-direction: column;
    }

    .contact-pm-card__identity {
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-pm-hero__eyebrow,
    .contact-pm-hero__title,
    .contact-pm-hero__description,
    .contact-pm-hero__proof,
    .contact-pm-hero__visual,
    .contact-pm-hero__stepper,
    .contact-pm-section__header,
    .contact-pm-card,
    .contact-pm-back,
    .contact-pm-card__button--whatsapp {
      animation: none;
      opacity: 1;
      transform: none;
      filter: none;
      clip-path: none;
    }

    .contact-pm-hero__image,
    .contact-pm-card,
    .contact-pm-card__button,
    .contact-pm-back__link {
      transition: none;
    }
  }
`;

const createRequestId = (draft: KonsultasiDraft | null) => {
  const year = new Date().getFullYear();
  const source = draft
    ? JSON.stringify({
        updatedAt: draft.updatedAt,
        email: draft.clientInfo.email,
        whatsapp: draft.clientInfo.whatsapp,
        services: draft.services,
      })
    : "mahreen-consultation";

  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }

  return `REQ-${year}-${1000 + (hash % 9000)}`;
};

const buildPmMessage = (
  draft: KonsultasiDraft,
  requestId: string,
  managerName: string,
) => {
  const services = draft.services.length
    ? draft.services.join(", ")
    : "Belum ditentukan";

  return [
    `Halo ${managerName}, saya ingin melanjutkan konsultasi Tanya Mahreen.`,
    "",
    `ID Permintaan: ${requestId}`,
    `Nama: ${draft.clientInfo.nama || "-"}`,
    `Perusahaan/Brand: ${draft.clientInfo.perusahaan || "-"}`,
    `Layanan: ${services}`,
    `Budget: ${draft.budget || "-"}`,
    `Target Penyelesaian: ${draft.target || "-"}`,
    "",
    `Ringkasan kebutuhan: ${draft.kebutuhan || "-"}`,
  ].join("\n");
};

const HubungiPM = () => {
  const draft = useMemo(() => getKonsultasiDraft(), []);
  const hasBeenReviewed = useMemo(() => isKonsultasiReviewed(), []);
  const requestId = useMemo(() => createRequestId(draft), [draft]);

  useEffect(() => {
    if (!draft) {
      navigateToRoute("/tanya-mahreen/konsultasi");
      return;
    }

    if (!hasBeenReviewed) {
      navigateToRoute("/tanya-mahreen/konsultasi/cek-data");
    }
  }, [draft, hasBeenReviewed]);

  if (!draft || !hasBeenReviewed) {
    return null;
  }

  return (
    <div className="contact-pm-page">
      <style data-component="hubungi-project-manager">{hubungiPmStyles}</style>
      <Navbar />

      <main className="contact-pm-main">
        <section
          className="contact-pm-hero"
          aria-labelledby="contact-pm-hero-title"
        >
          <div className="contact-pm-hero__container">
            <div className="contact-pm-hero__content">
              <p className="contact-pm-hero__eyebrow">Konsultasi Eksklusif</p>

              <h1 className="contact-pm-hero__title" id="contact-pm-hero-title">
                Jadwalkan<br />Konsultasi<br />Gratis
              </h1>

              <p className="contact-pm-hero__description">
                Wujudkan visi bisnis Anda melalui strategi digital yang presisi.
                Kami siap mendengarkan kebutuhan unik Anda dan memberikan
                rekomendasi solusi kelas dunia.
              </p>

              <div className="contact-pm-hero__proof" aria-label="Rekam jejak proyek">
                <div className="contact-pm-hero__avatars" aria-hidden="true">
                  <span className="contact-pm-hero__avatar"><img width="720" height="830" decoding="async" src={avatarOne} alt="" /></span>
                  <span className="contact-pm-hero__avatar"><img width="720" height="830" decoding="async" src={avatarTwo} alt="" /></span>
                  <span className="contact-pm-hero__avatar"><img width="720" height="830" decoding="async" src={avatarThree} alt="" /></span>
                </div>
                <p className="contact-pm-hero__proof-text">
                  <strong>150+</strong> Proyek Berhasil
                </p>
              </div>
            </div>

            <div className="contact-pm-hero__visual">
              <div className="contact-pm-hero__image-frame">
                <img width="501" height="390" decoding="async"
                  className="contact-pm-hero__image"
                  src={meetingImage}
                  alt="Tim profesional sedang melakukan sesi konsultasi bisnis"
                />

                <blockquote className="contact-pm-hero__quote">
                  <p className="contact-pm-hero__quote-text">
                    “Kemitraan strategis yang mengubah cara kami menjangkau audiens global.”
                  </p>
                  <footer className="contact-pm-hero__quote-author">
                    — Founder, Mahreen Indonesia
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>

          <div className="contact-pm-hero__stepper">
            <SteepProgres currentStep={4} />
          </div>
        </section>

        <section className="contact-pm-section" aria-labelledby="contact-pm-title">
          <div className="contact-pm-section__container">
            <header className="contact-pm-section__header">
              <h2 className="contact-pm-section__title" id="contact-pm-title">
                Hubungi Project Manager Kami
              </h2>
              <p className="contact-pm-section__description">
                Konsultasi Anda akan ditangani secara personal oleh Project Manager
                profesional kami. Silakan pilih PM untuk segera menjadwalkan sesi meeting.
              </p>
            </header>

            <div className="contact-pm-grid">
              {projectManagers.map((manager, index) => {
                const whatsappMessage = buildPmMessage(draft, requestId, manager.name);
                const whatsappUrl = `https://wa.me/6289652647385?text=${encodeURIComponent(whatsappMessage)}`;
                const emailSubject = encodeURIComponent(
                  `${requestId} - Konsultasi dengan ${manager.name}`,
                );
                const emailBody = encodeURIComponent(whatsappMessage);

                return (
                  <article
                    className="contact-pm-card"
                    key={manager.name}
                    style={{ "--pm-delay": `${160 + index * 120}ms` } as CSSProperties}
                  >
                    <div className="contact-pm-card__identity">
                      <div className="contact-pm-card__photo-wrap">
                        <img width="96" height="96" decoding="async"
                          className="contact-pm-card__photo"
                          src={manager.photo}
                          alt={`Foto ${manager.name}`}
                        />
                      </div>

                      <div>
                        <h3 className="contact-pm-card__name">{manager.name}</h3>
                        <p className="contact-pm-card__role">{manager.role}</p>
                      </div>
                    </div>

                    <p className="contact-pm-card__description">
                      {manager.description}
                    </p>

                    <div className="contact-pm-card__actions">
                      <a
                        className="contact-pm-card__button contact-pm-card__button--whatsapp"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle aria-hidden="true" />
                        <span>Chat WhatsApp</span>
                      </a>

                      <a
                        className="contact-pm-card__button contact-pm-card__button--email"
                        href={`mailto:${manager.email}?subject=${emailSubject}&body=${emailBody}`}
                      >
                        <Mail aria-hidden="true" />
                        <span>Kirim Email</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="contact-pm-back">
              <a className="contact-pm-back__link" href="/">
                <ArrowLeft aria-hidden="true" />
                <span>Kembali ke Beranda</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <ClosingSection />
      <Footer />
    </div>
  );
};

export default HubungiPM;
