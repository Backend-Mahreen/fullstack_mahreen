import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { navigateToRoute } from "../../../../utils/hashNavigation";

import Navbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import meetingImage from "../../../../assets/TanyaMahreen/FreeKonsultasi/bgound-meeting.webp";
import avatarOne from "../../../../assets/Internship/maya-kania.jpg";
import avatarTwo from "../../../../assets/Internship/raka-pratama.jpg";
import avatarThree from "../../../../assets/Internship/dimas-andre.jpg";
import {
  getKonsultasiDraft,
  getKonsultasiFiles,
  markKonsultasiReviewed,
} from "../../../../services/konsultasiDraft";
import { consultationService } from "../../../../services/consultation/consultationService";
import SteepProgres from "./SteepProgres";
import InformasiAnda from "./Sections/InformasiAnda";
import RingkasanBrief from "./Sections/RingkasanBrief";
import LampiranDokumen from "./Sections/LampiranDokumen";
import CatatanTambahan from "./Sections/CatatanTambahan";
import Button from "./Sections/Button";

const cekDataStyles = `

  @keyframes consultationHeroReveal {
    0% { opacity: 0; transform: translateY(34px); filter: blur(9px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes consultationCardReveal {
    0% {
      opacity: 0;
      transform: translate3d(52px, 18px, 0) scale(0.965) rotateY(-5deg);
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

  @keyframes reviewGlowPulse {
    0%, 100% { box-shadow: 0 12px 34px rgba(242, 204, 130, 0.22), 0 0 0 rgba(242, 204, 130, 0); }
    50% { box-shadow: 0 16px 42px rgba(242, 204, 130, 0.34), 0 0 34px rgba(242, 204, 130, 0.22); }
  }

  @keyframes consultationFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes reviewEmptyIn {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .review-page,
  .review-page *,
  .review-page *::before,
  .review-page *::after {
    box-sizing: border-box;
  }

  .review-page {
    width: 100%;
    min-height: 100svh;
    margin: 0;
    overflow-x: hidden;
    background: #0d0d0d;
    color: #f7f2e8;
    font-family: "DM Sans", Arial, sans-serif;
  }

  .review-page button {
    font-family: inherit;
  }

  .review-hero {
    position: relative;
    isolation: isolate;
    min-height: 790px;
    padding: 124px clamp(28px, 4.6vw, 84px) 38px;
    overflow: hidden;
    background:
      radial-gradient(circle at 82% 24%, rgba(201, 154, 82, 0.075), transparent 31%),
      linear-gradient(180deg, #0b0b0b 0%, #0d0d0d 100%);
  }

  .review-hero::before {
    content: "";
    position: absolute;
    inset: 76px 0 auto;
    z-index: -1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, 0.08), transparent);
  }

  .review-hero::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(1540px, calc(100% - 48px));
    height: 1px;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, 0.2), transparent);
    animation: consultationLineGrow 1100ms 760ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .review-hero__container {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(470px, 0.9fr);
    align-items: center;
    gap: clamp(58px, 7vw, 122px);
    width: min(1540px, 100%);
    margin: 0 auto;
  }

  .review-hero__content {
    position: relative;
    z-index: 2;
    max-width: 720px;
  }

  .review-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    min-height: 28px;
    margin: 0 0 28px;
    padding: 7px 14px;
    border: 1px solid rgba(231, 195, 127, 0.42);
    border-radius: 999px;
    background: rgba(113, 83, 40, 0.16);
    color: #e9c87f;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 2px;
    text-transform: uppercase;
    animation: consultationHeroReveal 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .review-hero__eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    flex: 0 0 6px;
    border-radius: 50%;
    background: #f2d28e;
    box-shadow: 0 0 14px rgba(242, 210, 142, 0.66);
  }

  .review-hero__title {
    max-width: 690px;
    margin: 0;
    color: #f1d08c;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(66px, 5.7vw, 104px);
    font-weight: 600;
    line-height: 0.94;
    letter-spacing: -0.052em;
    animation: consultationHeroReveal 850ms 90ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .review-hero__description {
    max-width: 620px;
    margin: 29px 0 0;
    color: rgba(245, 240, 231, 0.69);
    font-size: clamp(15px, 1.05vw, 18px);
    font-weight: 400;
    line-height: 1.68;
    animation: consultationHeroReveal 850ms 170ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .review-hero__proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 34px;
    animation: consultationHeroReveal 850ms 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .review-hero__avatars {
    display: flex;
    align-items: center;
    padding-left: 4px;
  }

  .review-hero__avatar {
    width: 39px;
    height: 39px;
    margin-left: -10px;
    overflow: hidden;
    border: 2px solid #0b0b0b;
    border-radius: 50%;
    background: #1b1b1b;
  }

  .review-hero__avatar:first-child { margin-left: 0; }

  .review-hero__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.75) contrast(1.05);
  }

  .review-hero__proof-text {
    margin: 0;
    color: rgba(247, 242, 234, 0.76);
    font-size: 14px;
    font-weight: 600;
  }

  .review-hero__proof-text strong {
    color: #efd083;
    font-weight: 700;
  }

  .review-hero__visual {
    position: relative;
    min-width: 0;
    perspective: 1100px;
    animation: consultationCardReveal 1050ms 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .review-hero__image-frame {
    position: relative;
    display: grid;
    gap: 20px;
    width: 100%;
    max-width: 650px;
    min-height: 470px;
    margin-left: auto;
    padding: 22px 22px 20px 28px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-left-color: rgba(239, 204, 135, 0.88);
    border-radius: 24px;
    background: rgba(18, 18, 18, 0.9);
    box-shadow: 0 34px 86px rgba(0, 0, 0, 0.34);
  }

  .review-hero__image-frame::before {
    content: "";
    position: absolute;
    top: 18px;
    bottom: 18px;
    left: 12px;
    width: 1px;
    border-radius: 999px;
    background: linear-gradient(180deg, #f0cc81, rgba(240, 204, 129, 0.08));
    box-shadow: 0 0 16px rgba(240, 204, 129, 0.24);
  }

  .review-hero__image {
    display: block;
    width: 100%;
    min-height: 315px;
    aspect-ratio: 1.62 / 1;
    object-fit: cover;
    object-position: center;
    border-radius: 10px;
    filter: brightness(0.62) saturate(0.72) sepia(0.08) contrast(1.04);
    transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms ease;
  }

  .review-hero__image-frame:hover .review-hero__image {
    transform: scale(1.018);
    filter: brightness(0.69) saturate(0.76) sepia(0.07) contrast(1.04);
  }

  .review-hero__quote {
    position: relative;
    z-index: 2;
    margin: 0;
    padding: 0 4px 2px;
    border: 0;
    background: transparent;
  }

  .review-hero__quote-text {
    margin: 0;
    color: rgba(246, 241, 233, 0.8);
    font-size: 14px;
    line-height: 1.55;
  }

  .review-hero__quote-author {
    margin: 10px 0 0;
    color: #e6c67f;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.45;
  }

  .review-hero__stepper {
    width: min(1540px, 100%);
    margin: 50px auto 0;
    animation: consultationHeroReveal 900ms 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
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
    box-shadow: 0 0 14px rgba(239, 208, 140, 0.52);
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
    letter-spacing: 0.01em;
    text-align: center;
  }

  .consult-stepper__item.is-active .consult-stepper__number,
  .consult-stepper__item.is-complete .consult-stepper__number {
    border-color: #f1d18d;
    background: #f3d48f;
    color: #21180a;
    box-shadow: 0 0 25px rgba(242, 207, 137, 0.54);
    animation: consultationFloat 3.4s ease-in-out infinite;
  }

  .consult-stepper__item.is-active .consult-stepper__label,
  .consult-stepper__item.is-complete .consult-stepper__label {
    color: #f0d18f;
  }

  .review-section {
    position: relative;
    padding: 66px clamp(24px, 4.4vw, 80px) 110px;
    background:
      radial-gradient(circle at 78% 8%, rgba(192, 143, 69, 0.035), transparent 26%),
      #0d0d0d;
  }

  .review-container {
    width: min(1420px, 100%);
    margin: 0 auto;
  }

  .review-reveal {
    opacity: 0;
    transform: translate3d(0, 48px, 0) scale(0.986);
    clip-path: inset(0 0 17% 0 round 12px);
    filter: blur(7px);
    transition:
      opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 820ms cubic-bezier(0.16, 1, 0.3, 1),
      clip-path 900ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 660ms ease;
    transition-delay: var(--review-delay, 0ms);
    will-change: opacity, transform, clip-path, filter;
  }

  .review-reveal.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    clip-path: inset(0 0 0 0 round 12px);
    filter: blur(0);
  }

  .review-heading {
    max-width: 760px;
    margin-bottom: 44px;
  }

  .review-heading h1 {
    margin: 0;
    color: #f1cf8b;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 3.35vw, 50px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.035em;
  }

  .review-heading p {
    max-width: 720px;
    margin: 15px 0 0;
    color: #aaa39a;
    font-size: 14px;
    line-height: 1.62;
  }

  .review-content {
    display: grid;
    gap: 28px;
  }

  .review-card {
    border: 1px solid #666666;
    border-radius: 10px;
    background: rgba(16, 16, 16, 0.94);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.018);
    transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
  }

  .review-card:hover {
    border-color: rgba(232, 196, 128, 0.56);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2), 0 0 28px rgba(226, 187, 111, 0.05);
  }

  .review-summary-grid {
    display: grid;
    grid-template-columns: minmax(0, 2.02fr) minmax(270px, 0.92fr);
    gap: 28px;
  }

  .review-card--identity {
    min-height: 420px;
    padding: 36px 38px 34px;
  }

  .review-section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    color: #e9c77f;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(20px, 1.8vw, 27px);
    font-weight: 600;
    line-height: 1.25;
  }

  .review-section-title svg {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    stroke-width: 1.65;
  }

  .review-identity-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 27px 48px;
    margin-top: 31px;
  }

  .review-data-block {
    display: grid;
    min-width: 0;
    gap: 7px;
  }

  .review-data-label,
  .review-metric-label {
    color: #78736c;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.11em;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .review-data-block strong {
    overflow-wrap: anywhere;
    color: #ddd5ca;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(16px, 1.45vw, 21px);
    font-weight: 500;
    line-height: 1.25;
  }

  .review-divider {
    height: 1px;
    margin: 32px 0 27px;
    background: #252525;
  }

  .review-service-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .review-service-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 31px;
    padding: 0 13px;
    border: 1px solid rgba(213, 175, 99, 0.4);
    border-radius: 999px;
    background: rgba(194, 151, 70, 0.11);
    color: #d9bb7d;
    font-size: 14px;
    box-shadow: 0 0 16px rgba(227, 190, 116, 0.04);
  }

  .review-side-stack {
    display: grid;
    align-content: start;
    gap: 28px;
  }

  .review-metric-card {
    min-height: 154px;
    padding: 34px 32px;
    background: #1d1d1d;
  }

  .review-metric-value {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
  }

  .review-metric-value svg {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    color: #e8c77f;
    stroke-width: 1.65;
  }

  .review-metric-value strong {
    color: #ead4aa;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(19px, 1.8vw, 25px);
    font-weight: 500;
    line-height: 1.2;
  }

  .review-card--section {
    padding: 32px 36px 34px;
  }

  .review-text-box {
    min-height: 82px;
    margin-top: 26px;
    padding: 21px 24px;
    border: 1px solid #767676;
    border-radius: 5px;
    background: #0b0b0b;
  }

  .review-text-box--note {
    min-height: 76px;
  }

  .review-text-box p {
    margin: 0;
    color: #bbb4aa;
    font-size: 14px;
    line-height: 1.7;
    white-space: pre-line;
  }

  .review-attachment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 25px;
  }

  .review-file-card {
    display: flex;
    align-items: center;
    gap: 12px;
    width: min(290px, 100%);
    min-height: 72px;
    padding: 12px 14px;
    border: 1px solid #777777;
    border-radius: 6px;
    background: #282828;
    color: #e5dfd6;
    text-align: left;
    cursor: pointer;
    transition: transform 190ms ease, border-color 190ms ease, box-shadow 190ms ease, background 190ms ease;
  }

  .review-file-card:hover:not(:disabled),
  .review-file-card:focus-visible:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(236, 201, 133, 0.78);
    background: #303030;
    box-shadow: 0 0 25px rgba(233, 197, 128, 0.16);
    outline: none;
  }

  .review-file-card:disabled {
    cursor: default;
    opacity: 0.9;
  }

  .review-file-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 4px;
    background: #0b0b0b;
    color: #e7c77f;
  }

  .review-file-icon svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.7;
  }

  .review-file-copy {
    display: grid;
    min-width: 0;
    gap: 3px;
  }

  .review-file-copy strong {
    overflow: hidden;
    color: #ddd7ce;
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .review-file-copy small {
    color: #8f8a83;
    font-size: 14px;
  }

  .review-empty-copy {
    color: #817b73;
    font-size: 14px;
  }

  .review-empty-copy--attachment {
    margin: 25px 0 0;
  }

  .review-actions {
    padding: 8px 0 0;
  }

  .review-action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 18px;
  }

  .review-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 53px;
    padding: 0 28px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 190ms ease, border-color 190ms ease, box-shadow 190ms ease, filter 190ms ease, background 190ms ease;
  }

  .review-button svg {
    width: 15px;
    height: 15px;
    stroke-width: 1.8;
    transition: transform 190ms ease;
  }

  .review-button--secondary {
    min-width: 147px;
    border: 1px solid #454545;
    background: transparent;
    color: #d8d1c8;
  }

  .review-button--secondary:hover,
  .review-button--secondary:focus-visible {
    transform: translateY(-2px);
    border-color: rgba(237, 202, 134, 0.67);
    background: rgba(231, 193, 119, 0.05);
    box-shadow: 0 0 26px rgba(230, 194, 125, 0.15);
    outline: none;
  }

  .review-button--secondary:hover svg {
    transform: translateX(-3px);
  }

  .review-button--primary {
    min-width: 186px;
    border: 1px solid #dfbd77;
    background: linear-gradient(90deg, #efd08c, #f4d99f);
    color: #241a0b;
    box-shadow: 0 10px 28px rgba(225, 184, 102, 0.24), 0 0 22px rgba(225, 184, 102, 0.13);
    animation: reviewGlowPulse 2.8s ease-in-out infinite;
  }

  .review-button--primary:hover,
  .review-button--primary:focus-visible {
    transform: translateY(-3px) scale(1.01);
    filter: brightness(1.06);
    box-shadow: 0 14px 38px rgba(225, 184, 102, 0.39), 0 0 38px rgba(225, 184, 102, 0.3);
    outline: none;
  }

  .review-button--primary:hover svg {
    transform: translateX(4px);
  }

  .review-security-copy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 65px 0 0;
    color: #5f5a53;
    font-size: 14px;
    text-align: center;
  }

  .review-security-copy svg {
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    color: #777168;
    stroke-width: 1.35;
  }

  .review-empty-state {
    display: grid;
    place-items: center;
    min-height: 68svh;
    padding: 130px 24px 80px;
    text-align: center;
    animation: reviewEmptyIn 600ms ease both;
  }

  .review-empty-state__card {
    width: min(520px, 100%);
    padding: 48px 38px;
    border: 1px solid #3f3f3f;
    border-radius: 18px;
    background: #111111;
  }

  .review-empty-state svg {
    width: 44px;
    height: 44px;
    color: #e7c77f;
    stroke-width: 1.5;
  }

  .review-empty-state h1 {
    margin: 20px 0 10px;
    color: #efd08d;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 34px;
  }

  .review-empty-state p {
    margin: 0 auto 28px;
    color: #9d968d;
    line-height: 1.65;
  }

  @media (max-width: 1050px) {
    .review-hero {
      min-height: auto;
      padding-top: 116px;
    }

    .review-hero__container {
      grid-template-columns: 1fr 0.85fr;
      gap: 44px;
    }

    .review-hero__title {
      font-size: clamp(60px, 7.6vw, 84px);
    }

    .review-hero__image-frame {
      min-height: 400px;
    }

    .review-summary-grid {
      grid-template-columns: minmax(0, 1.6fr) minmax(240px, 0.8fr);
    }
  }

  @media (max-width: 860px) {
    .review-hero__container {
      grid-template-columns: 1fr;
    }

    .review-hero__content {
      max-width: 760px;
    }

    .review-hero__visual {
      width: min(650px, 100%);
      margin: 0 auto;
    }

    .review-hero__image-frame {
      min-height: 420px;
      margin: 0;
    }

    .review-summary-grid {
      grid-template-columns: 1fr;
    }

    .review-side-stack {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .review-hero {
      padding: 102px 20px 31px;
    }

    .review-hero__title {
      font-size: clamp(53px, 16.5vw, 72px);
    }

    .review-hero__description {
      font-size: 14px;
    }

    .review-hero__image-frame {
      min-height: auto;
      padding: 16px 16px 16px 22px;
      border-radius: 18px;
    }

    .review-hero__image {
      min-height: 215px;
    }

    .review-hero__stepper {
      margin-top: 38px;
    }

    .consult-stepper__track {
      top: 18px;
    }

    .consult-stepper__number {
      width: 36px;
      height: 36px;
      font-size: 14px;
    }

    .consult-stepper__label {
      font-size: 14px;
    }

    .review-section {
      padding: 52px 15px 76px;
    }

    .review-heading {
      margin-bottom: 32px;
    }

    .review-heading h1 {
      font-size: 32px;
    }

    .review-heading p {
      font-size: 14px;
    }

    .review-card--identity,
    .review-card--section {
      padding: 27px 22px 29px;
    }

    .review-identity-grid {
      grid-template-columns: 1fr;
      gap: 22px;
      margin-top: 27px;
    }

    .review-side-stack {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .review-metric-card {
      min-height: auto;
      padding: 27px 23px;
    }

    .review-attachment-list {
      display: grid;
    }

    .review-file-card {
      width: 100%;
    }

    .review-action-buttons {
      display: grid;
      grid-template-columns: 1fr;
    }

    .review-button {
      width: 100%;
    }

    .review-button--primary {
      grid-row: 1;
    }

    .review-security-copy {
      align-items: center;
      margin-top: 45px;
      line-height: 1.55;
    }
  }

  @media (max-width: 440px) {
    .review-hero__proof {
      align-items: flex-start;
      flex-direction: column;
    }

    .consult-stepper__label {
      max-width: 68px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .review-reveal,
    .review-button--primary,
    .review-empty-state,
    .review-hero__eyebrow,
    .review-hero__title,
    .review-hero__description,
    .review-hero__proof,
    .review-hero__visual,
    .review-hero__stepper,
    .consult-stepper__item.is-active .consult-stepper__number,
    .consult-stepper__item.is-complete .consult-stepper__number {
      animation: none;
      opacity: 1;
      transform: none;
      filter: none;
      clip-path: none;
    }

    .review-reveal,
    .review-button,
    .review-file-card,
    .review-card,
    .review-hero__image {
      transition: none;
    }
  }
`;

const CekData = () => {
  const draft = useMemo(() => getKonsultasiDraft(), []);
  const actualFiles = useMemo(() => getKonsultasiFiles(), []);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(".review-reveal"),
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--review-delay", `${Math.min(index * 80, 420)}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const handleEdit = () => {
    navigateToRoute("/tanya-mahreen/konsultasi");
  };

  const handleContinue = async () => {
    if (!draft || submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      await consultationService.submit(draft, actualFiles);
      markKonsultasiReviewed();
      navigateToRoute("/tanya-mahreen/konsultasi/selesai");
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Permintaan konsultasi tidak dapat dikirim.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-page">
      <style data-component="cek-data-konsultasi">{cekDataStyles}</style>
      <Navbar />

      <main>
        {!draft ? (
          <section className="review-empty-state">
            <div className="review-empty-state__card">
              <ShieldCheck aria-hidden="true" />
              <h1>Belum Ada Data</h1>
              <p>
                Isi form konsultasi terlebih dahulu agar informasi proyek dapat
                diperiksa pada halaman ini.
              </p>
              <button className="review-button review-button--primary" type="button" onClick={handleEdit}>
                <ArrowLeft aria-hidden="true" />
                <span>Kembali ke Form</span>
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="review-hero" aria-labelledby="review-consultation-title">
              <div className="review-hero__container">
                <div className="review-hero__content">
                  <p className="review-hero__eyebrow">Konsultasi Eksklusif</p>

                  <h1 className="review-hero__title" id="review-consultation-title">
                    Jadwalkan<br />Konsultasi<br />Gratis
                  </h1>

                  <p className="review-hero__description">
                    Wujudkan visi bisnis Anda melalui strategi digital yang presisi.
                    Kami siap mendengarkan kebutuhan unik Anda dan memberikan
                    rekomendasi solusi kelas dunia.
                  </p>

                  <div className="review-hero__proof" aria-label="Rekam jejak proyek">
                    <div className="review-hero__avatars" aria-hidden="true">
                      <span className="review-hero__avatar"><img width="720" height="830" decoding="async" src={avatarOne} alt="" /></span>
                      <span className="review-hero__avatar"><img width="720" height="830" decoding="async" src={avatarTwo} alt="" /></span>
                      <span className="review-hero__avatar"><img width="720" height="830" decoding="async" src={avatarThree} alt="" /></span>
                    </div>
                    <p className="review-hero__proof-text">
                      <strong>150+</strong> Proyek Berhasil
                    </p>
                  </div>
                </div>

                <div className="review-hero__visual">
                  <div className="review-hero__image-frame">
                    <img width="501" height="390" decoding="async"
                      className="review-hero__image"
                      src={meetingImage}
                      alt="Tim profesional sedang melakukan sesi konsultasi bisnis"
                    />

                    <blockquote className="review-hero__quote">
                      <p className="review-hero__quote-text">
                        “Kemitraan strategis yang mengubah cara kami menjangkau audiens global.”
                      </p>
                      <footer className="review-hero__quote-author">
                        — Founder, Mahreen Indonesia
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>

              <div className="review-hero__stepper">
                <SteepProgres currentStep={2} />
              </div>
            </section>

            <section className="review-section" aria-label="Periksa kembali data konsultasi">
              <div className="review-container">
                <header className="review-heading review-reveal">
                  <h1>Periksa Kembali Informasi Anda</h1>
                  <p>
                    Pastikan semua detail proyek yang Anda sampaikan sudah akurat sebelum kami
                    memproses permintaan Anda ke tahap selanjutnya.
                  </p>
                </header>

                <div className="review-content">
                  <InformasiAnda draft={draft} />
                  <RingkasanBrief kebutuhan={draft.kebutuhan} />
                  <LampiranDokumen files={draft.files} actualFiles={actualFiles} />
                  <CatatanTambahan notes={draft.notes} />
                  <Button onEdit={handleEdit} onContinue={handleContinue} submitting={submitting} error={submitError} />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <ClosingSection />
      <Footer />
    </div>
  );
};

export default CekData;
