import { useEffect, useMemo } from "react";
import { ArrowRight, Check } from "lucide-react";
import { navigateToRoute } from "../../../../utils/hashNavigation";

import Navbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import meetingImage from "../../../../assets/TanyaMahreen/FreeKonsultasi/bgound-meeting.webp";
import avatarOne from "../../../../assets/Internship/maya-kania.jpg";
import avatarTwo from "../../../../assets/Internship/raka-pratama.jpg";
import avatarThree from "../../../../assets/Internship/dimas-andre.jpg";
import {
  getKonsultasiDraft,
  isKonsultasiReviewed,
  type KonsultasiDraft,
} from "../../../../services/konsultasiDraft";
import SteepProgres from "../CekData/SteepProgres";

const selesaiStyles = `

  @keyframes consultationHeroReveal {
    0% { opacity: 0; transform: translateY(34px); filter: blur(9px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes consultationCardReveal {
    0% {
      opacity: 0;
      transform: translate3d(52px, 18px, 0) scale(.965) rotateY(-5deg);
      clip-path: inset(0 100% 0 0 round 24px);
      filter: blur(8px);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
      clip-path: inset(0 0 0 0 round 24px);
      filter: blur(0);
    }
  }

  @keyframes consultationLineGrow {
    from { transform: scaleX(0); opacity: 0; }
    to { transform: scaleX(1); opacity: 1; }
  }

  @keyframes consultationFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes successReveal {
    0% {
      opacity: 0;
      transform: translateY(38px) scale(.975);
      filter: blur(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes successIconReveal {
    0% { opacity: 0; transform: scale(.58) rotate(-12deg); }
    70% { opacity: 1; transform: scale(1.08) rotate(2deg); }
    100% { opacity: 1; transform: scale(1) rotate(0); }
  }

  @keyframes successGlowPulse {
    0%, 100% {
      box-shadow: 0 14px 34px rgba(239, 199, 119, .25), 0 0 0 rgba(239, 199, 119, 0);
    }
    50% {
      box-shadow: 0 18px 44px rgba(239, 199, 119, .4), 0 0 38px rgba(239, 199, 119, .24);
    }
  }

  @keyframes successRingPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(238, 204, 136, .02); }
    50% { box-shadow: 0 0 0 12px rgba(238, 204, 136, .025); }
  }

  .request-success-page,
  .request-success-page *,
  .request-success-page *::before,
  .request-success-page *::after {
    box-sizing: border-box;
  }

  .request-success-page {
    width: 100%;
    min-height: 100svh;
    margin: 0;
    overflow-x: hidden;
    background: #0d0d0d;
    color: #f7f2e8;
    font-family: "DM Sans", Arial, sans-serif;
  }

  .request-success-hero {
    position: relative;
    isolation: isolate;
    min-height: 790px;
    padding: 124px clamp(28px, 4.6vw, 84px) 38px;
    overflow: hidden;
    background:
      radial-gradient(circle at 82% 24%, rgba(201, 154, 82, .075), transparent 31%),
      linear-gradient(180deg, #0b0b0b 0%, #0d0d0d 100%);
  }

  .request-success-hero::before {
    content: "";
    position: absolute;
    inset: 76px 0 auto;
    z-index: -1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, .08), transparent);
  }

  .request-success-hero::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(1540px, calc(100% - 48px));
    height: 1px;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, .2), transparent);
    animation: consultationLineGrow 1100ms 760ms cubic-bezier(.16, 1, .3, 1) forwards;
  }

  .request-success-hero__container {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(470px, .9fr);
    align-items: center;
    gap: clamp(58px, 7vw, 122px);
    width: min(1540px, 100%);
    margin: 0 auto;
  }

  .request-success-hero__content {
    position: relative;
    z-index: 2;
    max-width: 720px;
  }

  .request-success-hero__eyebrow {
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
    animation: consultationHeroReveal 760ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .request-success-hero__eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    flex: 0 0 6px;
    border-radius: 50%;
    background: #f2d28e;
    box-shadow: 0 0 14px rgba(242, 210, 142, .66);
  }

  .request-success-hero__title {
    max-width: 690px;
    margin: 0;
    color: #f1d08c;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(66px, 5.7vw, 104px);
    font-weight: 600;
    line-height: .94;
    letter-spacing: -.052em;
    animation: consultationHeroReveal 850ms 90ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .request-success-hero__description {
    max-width: 620px;
    margin: 29px 0 0;
    color: rgba(245, 240, 231, .69);
    font-size: clamp(15px, 1.05vw, 18px);
    font-weight: 400;
    line-height: 1.68;
    animation: consultationHeroReveal 850ms 170ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .request-success-hero__proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 34px;
    animation: consultationHeroReveal 850ms 250ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .request-success-hero__avatars {
    display: flex;
    align-items: center;
    padding-left: 4px;
  }

  .request-success-hero__avatar {
    width: 39px;
    height: 39px;
    margin-left: -10px;
    overflow: hidden;
    border: 2px solid #0b0b0b;
    border-radius: 50%;
    background: #1b1b1b;
  }

  .request-success-hero__avatar:first-child { margin-left: 0; }

  .request-success-hero__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(.75) contrast(1.05);
  }

  .request-success-hero__proof-text {
    margin: 0;
    color: rgba(247, 242, 234, .76);
    font-size: 14px;
    font-weight: 600;
  }

  .request-success-hero__proof-text strong {
    color: #efd083;
    font-weight: 700;
  }

  .request-success-hero__visual {
    position: relative;
    min-width: 0;
    perspective: 1100px;
    animation: consultationCardReveal 1050ms 180ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .request-success-hero__image-frame {
    position: relative;
    display: grid;
    gap: 20px;
    width: 100%;
    max-width: 650px;
    min-height: 470px;
    margin-left: auto;
    padding: 22px 22px 20px 28px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .075);
    border-left-color: rgba(239, 204, 135, .88);
    border-radius: 24px;
    background: rgba(18, 18, 18, .9);
    box-shadow: 0 34px 86px rgba(0, 0, 0, .34);
  }

  .request-success-hero__image-frame::before {
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

  .request-success-hero__image {
    display: block;
    width: 100%;
    min-height: 315px;
    aspect-ratio: 1.62 / 1;
    object-fit: cover;
    object-position: center;
    border-radius: 10px;
    filter: brightness(.62) saturate(.72) sepia(.08) contrast(1.04);
    transition: transform 800ms cubic-bezier(.16, 1, .3, 1), filter 500ms ease;
  }

  .request-success-hero__image-frame:hover .request-success-hero__image {
    transform: scale(1.018);
    filter: brightness(.69) saturate(.76) sepia(.07) contrast(1.04);
  }

  .request-success-hero__quote {
    position: relative;
    z-index: 2;
    margin: 0;
    padding: 0 4px 2px;
    border: 0;
    background: transparent;
  }

  .request-success-hero__quote-text {
    margin: 0;
    color: rgba(246, 241, 233, .8);
    font-size: 14px;
    line-height: 1.55;
  }

  .request-success-hero__quote-author {
    margin: 10px 0 0;
    color: #e6c67f;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.45;
  }

  .request-success-hero__stepper {
    width: min(1540px, 100%);
    margin: 50px auto 0;
    animation: consultationHeroReveal 900ms 420ms cubic-bezier(.16, 1, .3, 1) both;
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
    transition: transform 220ms ease, border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
  }

  .consult-stepper__label {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: .01em;
    text-align: center;
  }

  .consult-stepper__item.is-active .consult-stepper__number,
  .consult-stepper__item.is-complete .consult-stepper__number {
    border-color: #f1d18d;
    background: #f3d48f;
    color: #21180a;
    box-shadow: 0 0 25px rgba(242, 207, 137, .54);
    animation: consultationFloat 3.4s ease-in-out infinite;
  }

  .consult-stepper__item.is-active .consult-stepper__label,
  .consult-stepper__item.is-complete .consult-stepper__label {
    color: #f0d18f;
  }

  .request-success-section {
    position: relative;
    isolation: isolate;
    display: grid;
    place-items: center;
    min-height: 660px;
    padding: 104px 24px 112px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 33%, rgba(207, 160, 82, .055), transparent 29%),
      #0d0d0d;
  }

  .request-success-section::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      linear-gradient(90deg, transparent 0 49.9%, rgba(255,255,255,.008) 50%, transparent 50.1%),
      linear-gradient(rgba(255,255,255,.005) 1px, transparent 1px);
    background-size: 100% 100%, 100% 92px;
    mask-image: linear-gradient(to bottom, transparent, #000 15%, #000 84%, transparent);
  }

  .request-success-content {
    display: grid;
    justify-items: center;
    width: min(650px, 100%);
    text-align: center;
    animation: successReveal 820ms 120ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .request-success-icon {
    position: relative;
    display: grid;
    place-items: center;
    width: 84px;
    height: 84px;
    border: 1px solid rgba(222, 187, 119, .34);
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(112, 82, 39, .28), rgba(28, 25, 20, .78));
    color: #f3d591;
    animation:
      successIconReveal 760ms 180ms cubic-bezier(.16, 1, .3, 1) both,
      successRingPulse 3.2s 1s ease-in-out infinite;
  }

  .request-success-icon::before {
    content: "";
    position: absolute;
    width: 39px;
    height: 39px;
    border: 3px solid currentColor;
    border-radius: 50%;
  }

  .request-success-icon svg {
    position: relative;
    z-index: 1;
    width: 21px;
    height: 21px;
    stroke-width: 3;
  }

  .request-success-title {
    margin: 39px 0 0;
    color: #edca83;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(31px, 3.2vw, 43px);
    font-weight: 600;
    line-height: 1.18;
    letter-spacing: -.025em;
  }

  .request-success-description {
    max-width: 520px;
    margin: 15px auto 0;
    color: #aaa39a;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.72;
  }

  .request-success-id-card {
    display: grid;
    gap: 8px;
    min-width: 286px;
    min-height: 86px;
    margin-top: 32px;
    padding: 20px 31px;
    border: 1px solid #77736d;
    border-radius: 13px;
    background: linear-gradient(145deg, rgba(30, 30, 30, .96), rgba(24, 24, 24, .96));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
  }

  .request-success-id-label {
    color: #777169;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .request-success-id-value {
    color: #e7e1d8;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: .05em;
  }

  .request-success-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    min-width: 305px;
    min-height: 60px;
    margin-top: 32px;
    padding: 16px 31px;
    border: 1px solid #edc77e;
    border-radius: 999px;
    background: linear-gradient(105deg, #f0ce8b 0%, #ffe3a9 54%, #efc878 100%);
    color: #2b1f0d;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    animation: successGlowPulse 2.8s ease-in-out infinite;
    transition: transform 210ms cubic-bezier(.16, 1, .3, 1), box-shadow 210ms ease, filter 210ms ease;
  }

  .request-success-button svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.8;
    transition: transform 200ms ease;
  }

  .request-success-button:hover,
  .request-success-button:focus-visible {
    transform: translateY(-3px) scale(1.015);
    filter: brightness(1.06);
    box-shadow: 0 18px 42px rgba(239, 199, 119, .42), 0 0 42px rgba(239, 199, 119, .28);
    outline: none;
  }

  .request-success-button:hover svg,
  .request-success-button:focus-visible svg {
    transform: translateX(4px);
  }

  @media (max-width: 1050px) {
    .request-success-hero {
      min-height: auto;
      padding-top: 116px;
    }

    .request-success-hero__container {
      grid-template-columns: 1fr .85fr;
      gap: 44px;
    }

    .request-success-hero__title {
      font-size: clamp(60px, 7.6vw, 84px);
    }

    .request-success-hero__image-frame {
      min-height: 400px;
    }
  }

  @media (max-width: 860px) {
    .request-success-hero__container {
      grid-template-columns: 1fr;
    }

    .request-success-hero__content {
      max-width: 760px;
    }

    .request-success-hero__visual {
      width: min(650px, 100%);
      margin: 0 auto;
    }

    .request-success-hero__image-frame {
      min-height: 420px;
      margin: 0;
    }
  }

  @media (max-width: 680px) {
    .request-success-hero {
      padding: 102px 20px 31px;
    }

    .request-success-hero__title {
      font-size: clamp(53px, 16.5vw, 72px);
    }

    .request-success-hero__description {
      font-size: 14px;
    }

    .request-success-hero__image-frame {
      min-height: auto;
      padding: 16px 16px 16px 22px;
      border-radius: 18px;
    }

    .request-success-hero__image {
      min-height: 215px;
    }

    .request-success-hero__stepper {
      margin-top: 38px;
    }

    .consult-stepper__track { top: 18px; }

    .consult-stepper__number {
      width: 36px;
      height: 36px;
      font-size: 14px;
    }

    .consult-stepper__label { font-size: 14px; }

    .request-success-section {
      min-height: 590px;
      padding: 84px 20px 94px;
    }

    .request-success-icon {
      width: 76px;
      height: 76px;
    }

    .request-success-title {
      margin-top: 32px;
      font-size: 31px;
    }

    .request-success-description {
      max-width: 390px;
      font-size: 14px;
    }

    .request-success-id-card,
    .request-success-button {
      width: min(320px, 100%);
      min-width: 0;
    }
  }

  @media (max-width: 440px) {
    .request-success-hero__proof {
      align-items: flex-start;
      flex-direction: column;
    }

    .consult-stepper__label {
      max-width: 68px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .request-success-hero__eyebrow,
    .request-success-hero__title,
    .request-success-hero__description,
    .request-success-hero__proof,
    .request-success-hero__visual,
    .request-success-hero__stepper,
    .request-success-content,
    .request-success-icon,
    .request-success-button,
    .consult-stepper__item.is-active .consult-stepper__number,
    .consult-stepper__item.is-complete .consult-stepper__number {
      animation: none;
      opacity: 1;
      transform: none;
      filter: none;
      clip-path: none;
    }

    .request-success-hero__image,
    .request-success-button {
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

  const numericCode = 1000 + (hash % 9000);
  return `REQ-${year}-${numericCode}`;
};

const KonsultasiSelesai = () => {
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
    <div className="request-success-page">
      <style data-component="konsultasi-selesai">{selesaiStyles}</style>
      <Navbar />

      <main>
        <section
          className="request-success-hero"
          aria-labelledby="request-success-hero-title"
        >
          <div className="request-success-hero__container">
            <div className="request-success-hero__content">
              <p className="request-success-hero__eyebrow">Konsultasi Eksklusif</p>

              <h1
                className="request-success-hero__title"
                id="request-success-hero-title"
              >
                Jadwalkan<br />Konsultasi<br />Gratis
              </h1>

              <p className="request-success-hero__description">
                Wujudkan visi bisnis Anda melalui strategi digital yang presisi.
                Kami siap mendengarkan kebutuhan unik Anda dan memberikan
                rekomendasi solusi kelas dunia.
              </p>

              <div
                className="request-success-hero__proof"
                aria-label="Rekam jejak proyek"
              >
                <div className="request-success-hero__avatars" aria-hidden="true">
                  <span className="request-success-hero__avatar">
                    <img width="720" height="830" decoding="async" src={avatarOne} alt="" />
                  </span>
                  <span className="request-success-hero__avatar">
                    <img width="720" height="830" decoding="async" src={avatarTwo} alt="" />
                  </span>
                  <span className="request-success-hero__avatar">
                    <img width="720" height="830" decoding="async" src={avatarThree} alt="" />
                  </span>
                </div>
                <p className="request-success-hero__proof-text">
                  <strong>150+</strong> Proyek Berhasil
                </p>
              </div>
            </div>

            <div className="request-success-hero__visual">
              <div className="request-success-hero__image-frame">
                <img width="501" height="390" decoding="async"
                  className="request-success-hero__image"
                  src={meetingImage}
                  alt="Tim profesional sedang melakukan sesi konsultasi bisnis"
                />

                <blockquote className="request-success-hero__quote">
                  <p className="request-success-hero__quote-text">
                    “Kemitraan strategis yang mengubah cara kami menjangkau audiens global.”
                  </p>
                  <footer className="request-success-hero__quote-author">
                    — Founder, Mahreen Indonesia
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>

          <div className="request-success-hero__stepper">
            <SteepProgres currentStep={3} />
          </div>
        </section>

        <section
          className="request-success-section"
          aria-labelledby="request-success-title"
        >
          <div className="request-success-content">
            <span className="request-success-icon" aria-hidden="true">
              <Check />
            </span>

            <h2 className="request-success-title" id="request-success-title">
              Permintaan Dikirim!
            </h2>

            <p className="request-success-description">
              Terima kasih telah mempercayakan rencana proyek Anda kepada
              Mahreen Indonesia. Permintaan Anda telah sukses terdaftar di
              sistem kami.
            </p>

            <div className="request-success-id-card" aria-label={`ID permintaan ${requestId}`}>
              <span className="request-success-id-label">ID Permintaan Anda</span>
              <strong className="request-success-id-value">{requestId}</strong>
            </div>

            <a
              className="request-success-button"
              href="/tanya-mahreen/konsultasi/hubungi-pm"
            >
              <span>Lanjutkan ke Hubungi PM</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default KonsultasiSelesai;
