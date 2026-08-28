import { useEffect, useState, type FormEvent } from "react";
import { navigateToRoute } from "../../../../utils/hashNavigation";

import Navbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import meetingImage from "../../../../assets/TanyaMahreen/FreeKonsultasi/bgound-meeting.webp";
import avatarOne from "../../../../assets/Internship/maya-kania.jpg";
import avatarTwo from "../../../../assets/Internship/raka-pratama.jpg";
import avatarThree from "../../../../assets/Internship/dimas-andre.jpg";

import SteepProgres from "./Sections/SteepProgres";
import InformasiData from "./Sections/InformasiData";
import Layanan from "./Sections/Layanan";
import CeritakanKebutuhan from "./Sections/CeritakanKebutuhan";
import Budget from "./Sections/Budget";
import TargetPenyelesaian from "./Sections/TargetPenyelesaian";
import UploadReferensi from "./Sections/UploadReferensi";
import KurikulumTambahan from "./Sections/KurikulumTambahan";
import ButtunKirim from "./Sections/ButtunKirim";
import {
  getKonsultasiDraft,
  getKonsultasiFiles,
  saveKonsultasiDraft,
} from "../../../../services/konsultasiDraft";

const konsultasiStyles = `

  @keyframes konsultasiHeroReveal {
    0% { opacity: 0; transform: translateY(34px); filter: blur(9px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes konsultasiCardReveal {
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

  @keyframes konsultasiLineGrow {
    from { transform: scaleX(0); opacity: 0; }
    to { transform: scaleX(1); opacity: 1; }
  }

  @keyframes konsultasiGlowPulse {
    0%, 100% { box-shadow: 0 12px 34px rgba(242, 204, 130, 0.22), 0 0 0 rgba(242, 204, 130, 0); }
    50% { box-shadow: 0 16px 42px rgba(242, 204, 130, 0.34), 0 0 34px rgba(242, 204, 130, 0.22); }
  }

  @keyframes konsultasiFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .konsultasi-page,
  .konsultasi-page *,
  .konsultasi-page *::before,
  .konsultasi-page *::after {
    box-sizing: border-box;
  }

  .konsultasi-page {
    width: 100%;
    min-height: 100svh;
    margin: 0;
    overflow-x: hidden;
    background: #0d0d0d;
    color: #f7f2e8;
    font-family: "DM Sans", Arial, sans-serif;
  }

  .konsultasi-page button,
  .konsultasi-page input,
  .konsultasi-page textarea {
    font-family: inherit;
  }

  .konsultasi-hero {
    position: relative;
    isolation: isolate;
    min-height: 790px;
    padding: 124px clamp(28px, 4.6vw, 84px) 38px;
    overflow: hidden;
    background:
      radial-gradient(circle at 82% 24%, rgba(201, 154, 82, 0.075), transparent 31%),
      linear-gradient(180deg, #0b0b0b 0%, #0d0d0d 100%);
  }

  .konsultasi-hero::before {
    content: "";
    position: absolute;
    inset: 76px 0 auto;
    z-index: -1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, 0.08), transparent);
  }

  .konsultasi-hero::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(1540px, calc(100% - 48px));
    height: 1px;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    background: linear-gradient(90deg, transparent, rgba(238, 202, 134, 0.2), transparent);
    animation: konsultasiLineGrow 1100ms 760ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .konsultasi-hero__container {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(470px, 0.9fr);
    align-items: center;
    gap: clamp(58px, 7vw, 122px);
    width: min(1540px, 100%);
    margin: 0 auto;
  }

  .konsultasi-hero__content {
    position: relative;
    z-index: 2;
    max-width: 720px;
  }

  .konsultasi-hero__eyebrow {
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
    animation: konsultasiHeroReveal 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .konsultasi-hero__eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    flex: 0 0 6px;
    border-radius: 50%;
    background: #f2d28e;
    box-shadow: 0 0 14px rgba(242, 210, 142, 0.66);
  }

  .konsultasi-hero__title {
    max-width: 690px;
    margin: 0;
    color: #f1d08c;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(66px, 5.7vw, 104px);
    font-weight: 600;
    line-height: 0.94;
    letter-spacing: -0.052em;
    animation: konsultasiHeroReveal 850ms 90ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .konsultasi-hero__description {
    max-width: 620px;
    margin: 29px 0 0;
    color: rgba(245, 240, 231, 0.69);
    font-size: clamp(15px, 1.05vw, 18px);
    font-weight: 400;
    line-height: 1.68;
    animation: konsultasiHeroReveal 850ms 170ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .konsultasi-hero__proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 34px;
    animation: konsultasiHeroReveal 850ms 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .konsultasi-hero__avatars {
    display: flex;
    align-items: center;
    padding-left: 4px;
  }

  .konsultasi-hero__avatar {
    width: 39px;
    height: 39px;
    margin-left: -10px;
    overflow: hidden;
    border: 2px solid #0b0b0b;
    border-radius: 50%;
    background: #1b1b1b;
  }

  .konsultasi-hero__avatar:first-child { margin-left: 0; }

  .konsultasi-hero__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.75) contrast(1.05);
  }

  .konsultasi-hero__proof-text {
    margin: 0;
    color: rgba(247, 242, 234, 0.76);
    font-size: 14px;
    font-weight: 600;
  }

  .konsultasi-hero__proof-text strong {
    color: #efd083;
    font-weight: 700;
  }

  .konsultasi-hero__visual {
    position: relative;
    min-width: 0;
    perspective: 1100px;
    animation: konsultasiCardReveal 1050ms 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .konsultasi-hero__image-frame {
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

  .konsultasi-hero__image-frame::before {
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

  .konsultasi-hero__image {
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

  .konsultasi-hero__image-frame:hover .konsultasi-hero__image {
    transform: scale(1.018);
    filter: brightness(0.69) saturate(0.76) sepia(0.07) contrast(1.04);
  }

  .konsultasi-hero__quote {
    position: relative;
    z-index: 2;
    margin: 0;
    padding: 0 4px 2px;
    border: 0;
    background: transparent;
  }

  .konsultasi-hero__quote-icon { display: none; }

  .konsultasi-hero__quote-text {
    margin: 0;
    color: rgba(246, 241, 233, 0.8);
    font-size: 14px;
    line-height: 1.55;
  }

  .konsultasi-hero__quote-author {
    margin: 10px 0 0;
    color: #e6c67f;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.45;
  }

  .konsultasi-hero__stepper {
    width: min(1540px, 100%);
    margin: 50px auto 0;
    animation: konsultasiHeroReveal 900ms 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .consult-form-section {
    position: relative;
    padding: 0 clamp(24px, 4.4vw, 80px) 84px;
    background:
      radial-gradient(circle at 50% 100%, rgba(192, 143, 69, 0.028), transparent 32%),
      #0d0d0d;
  }

  .consult-form-container {
    width: min(1540px, 100%);
    margin: 0 auto;
  }

  .consult-form {
    display: grid;
    gap: 0;
  }

  .consult-form-reveal {
    opacity: 0;
    transform: translate3d(0, 54px, 0) scale(0.985);
    clip-path: inset(0 0 22% 0 round 18px);
    filter: blur(8px);
    transition:
      opacity 780ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 880ms cubic-bezier(0.16, 1, 0.3, 1),
      clip-path 980ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 720ms ease;
    transition-delay: var(--reveal-delay, 0ms);
    will-change: opacity, transform, clip-path, filter;
  }

  .consult-form-reveal.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    clip-path: inset(0 0 0 0 round 18px);
    filter: blur(0);
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
    animation: konsultasiFloat 3.4s ease-in-out infinite;
  }

  .consult-stepper__item.is-active .consult-stepper__label,
  .consult-stepper__item.is-complete .consult-stepper__label {
    color: #f0d18f;
  }

  .consult-card {
    position: relative;
    width: 100%;
    padding: 50px 0 54px;
    border: 0;
    border-bottom: 1px solid #191919;
    border-radius: 0;
    background: transparent;
  }

  .consult-card::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 1px;
    transform: scaleX(0);
    transform-origin: left;
    background: linear-gradient(90deg, rgba(239, 208, 140, 0.44), rgba(239, 208, 140, 0.04), transparent 82%);
    transition: transform 760ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .consult-card.is-visible::after { transform: scaleX(1); }

  .consult-section-title {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0;
    color: #efd08c;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(27px, 2.2vw, 35px);
    font-weight: 600;
    line-height: 1.2;
  }

  .consult-section-title svg {
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
    stroke-width: 1.8;
  }

  .consult-section-description {
    margin: 18px 0 30px;
    color: #c2bbb1;
    font-size: 17px;
    line-height: 1.6;
  }

  .consult-fields-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 34px;
    margin-top: 40px;
  }

  .consult-field {
    display: grid;
    gap: 12px;
    color: #d6cec3;
    font-size: 16px;
    font-weight: 500;
  }

  .consult-field--full { grid-column: 1 / -1; }

  .consult-field input,
  .consult-textarea {
    width: 100%;
    border: 1px solid #2d2d2d;
    outline: none;
    background: #121212;
    color: #f4f1eb;
    font: inherit;
    transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease, transform 200ms ease;
  }

  .consult-field input {
    height: 74px;
    padding: 0 29px;
    border-radius: 18px;
    font-size: 18px;
  }

  .consult-field input::placeholder,
  .consult-textarea::placeholder {
    color: #77797f;
    opacity: 1;
  }

  .consult-field input:hover,
  .consult-textarea:hover {
    border-color: #3d3d3d;
  }

  .consult-field input:focus,
  .consult-textarea:focus {
    transform: translateY(-1px);
    border-color: rgba(239, 208, 140, 0.78);
    background: #151515;
    box-shadow: 0 0 0 3px rgba(239, 208, 140, 0.075), 0 0 26px rgba(239, 208, 140, 0.1);
  }

  .consult-service-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  .consult-option-button,
  .consult-upload-zone,
  .consult-submit-button,
  .consult-file-chip button {
    cursor: pointer;
  }

  .consult-option-button {
    border: 1px solid #9a9a9a;
    background: #111111;
    color: #dedbd6;
    transition: transform 200ms ease, border-color 200ms ease, background 200ms ease, color 200ms ease, box-shadow 200ms ease;
  }

  .consult-option-button:hover,
  .consult-option-button:focus-visible,
  .consult-upload-zone:hover,
  .consult-upload-zone:focus-visible,
  .consult-radio-option:hover,
  .consult-radio-option:focus-within {
    transform: translateY(-3px);
    border-color: rgba(239, 208, 140, 0.84);
    box-shadow: 0 0 28px rgba(239, 208, 140, 0.13);
    outline: none;
  }

  .consult-option-button.is-selected {
    border-color: #efd08c;
    background: rgba(239, 208, 140, 0.1);
    color: #f6daa0;
    box-shadow: inset 0 0 30px rgba(239, 208, 140, 0.045), 0 0 26px rgba(239, 208, 140, 0.12);
  }

  .consult-service-option {
    display: grid;
    place-items: center;
    align-content: center;
    gap: 16px;
    min-height: 132px;
    padding: 23px 16px;
    border-radius: 17px;
    font-size: 17px;
    font-weight: 600;
  }

  .consult-service-option svg {
    width: 27px;
    height: 27px;
    color: #f0cf88;
    stroke-width: 1.8;
    transition: filter 200ms ease, transform 200ms ease;
  }

  .consult-service-option:hover svg,
  .consult-service-option.is-selected svg {
    transform: scale(1.08) rotate(-2deg);
    filter: drop-shadow(0 0 9px rgba(239, 208, 140, 0.58));
  }

  .consult-service-option--wide { grid-column: span 2; }

  .consult-needs-layout {
    display: contents;
  }

  .consult-card--needs,
  .consult-card--budget {
    min-height: 0;
  }

  .consult-textarea {
    display: block;
    resize: vertical;
    padding: 25px 29px;
    border-radius: 18px;
    font-size: 17px;
    line-height: 1.58;
  }

  .consult-textarea--large {
    min-height: 220px;
    margin-top: 34px;
  }

  .consult-budget-options {
    display: grid;
    gap: 15px;
    margin-top: 31px;
  }

  .consult-radio-option {
    display: flex;
    align-items: center;
    gap: 17px;
    min-height: 70px;
    padding: 0 24px;
    border: 1px solid #8f8f8f;
    border-radius: 14px;
    background: #1b1b1b;
    color: #e5dfd6;
    font-size: 17px;
    cursor: pointer;
    transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
  }

  .consult-radio-option input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .consult-radio-dot {
    width: 17px;
    height: 17px;
    flex: 0 0 17px;
    border: 1px solid #2a2a2a;
    border-radius: 50%;
    background: #070707;
    box-shadow: 0 0 0 1px #050505;
    transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .consult-radio-option.is-selected {
    border-color: #efd08c;
    background: rgba(239, 208, 140, 0.085);
    box-shadow: 0 0 24px rgba(239, 208, 140, 0.11);
  }

  .consult-radio-option.is-selected .consult-radio-dot {
    transform: scale(1.04);
    background: #f2d28d;
    box-shadow: 0 0 0 1px #f2d28d, 0 0 12px rgba(239, 208, 140, 0.68);
  }

  .consult-target-options {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 31px;
  }

  .consult-target-button {
    min-width: 168px;
    min-height: 56px;
    padding: 0 27px;
    border-radius: 999px;
    background: #1b1b1b;
    color: #d8cbb7;
    font-size: 16px;
  }

  .consult-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .consult-upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 260px;
    margin-top: 21px;
    padding: 30px;
    border: 1px solid transparent;
    border-radius: 22px;
    background: transparent;
    color: #d9d3ca;
    transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease, background 220ms ease;
  }

  .consult-upload-zone:hover,
  .consult-upload-zone:focus-visible,
  .consult-upload-zone.is-dragging {
    border-color: rgba(239, 208, 140, 0.24);
    background: rgba(239, 208, 140, 0.018);
  }

  .consult-upload-zone.is-dragging {
    transform: scale(1.006);
    box-shadow: inset 0 0 0 1px rgba(239, 208, 140, 0.24), 0 0 30px rgba(239, 208, 140, 0.12);
  }

  .consult-upload-zone__icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
    border-radius: 50%;
    background: #202020;
    color: #efd08c;
    transition: transform 220ms ease, box-shadow 220ms ease;
  }

  .consult-upload-zone:hover .consult-upload-zone__icon,
  .consult-upload-zone.is-dragging .consult-upload-zone__icon {
    transform: translateY(-4px) scale(1.055);
    box-shadow: 0 0 25px rgba(239, 208, 140, 0.22);
  }

  .consult-upload-zone__icon svg {
    width: 30px;
    height: 30px;
    stroke-width: 1.7;
  }

  .consult-upload-zone__title {
    color: #ddd6cc;
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
  }

  .consult-upload-zone__meta {
    margin-top: 7px;
    color: #cabca6;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-align: center;
  }

  .consult-file-error {
    margin: 12px 0 0;
    color: #f0a0a0;
    font-size: 14px;
  }

  .consult-file-list-wrap {
    margin-top: 2px;
  }

  .consult-file-list-label {
    margin: 0 0 10px;
    color: #e7d8be;
    font-size: 14px;
    font-weight: 600;
  }

  .consult-file-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .consult-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    max-width: 100%;
    padding: 8px 8px 8px 14px;
    border: 1px solid rgba(239, 208, 140, 0.22);
    border-radius: 999px;
    background: #1d1d1d;
    color: #dfd6c7;
    font-size: 14px;
  }

  .consult-file-chip__text {
    display: inline-flex;
    gap: 7px;
    min-width: 0;
  }

  .consult-file-chip__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .consult-file-chip__size {
    color: #77746f;
    white-space: nowrap;
  }

  .consult-file-chip button {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #d7c59f;
    transition: background 180ms ease, box-shadow 180ms ease;
  }

  .consult-file-chip button:hover,
  .consult-file-chip button:focus-visible {
    background: rgba(239, 208, 140, 0.12);
    box-shadow: 0 0 14px rgba(239, 208, 140, 0.25);
    outline: none;
  }

  .consult-file-chip svg { width: 14px; height: 14px; }

  .consult-textarea--notes {
    min-height: 150px;
    margin-top: 32px;
  }

  .consult-submit-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 62px 20px 10px;
  }

  .consult-privacy-copy {
    max-width: 650px;
    margin: 0 0 28px;
    color: #c9c1b6;
    font-size: 16px;
    line-height: 1.55;
    text-align: center;
  }

  .consult-privacy-copy a {
    color: inherit;
    text-decoration: none;
    transition: color 180ms ease;
  }

  .consult-privacy-copy a:hover { color: #efd08c; }

  .consult-privacy-copy strong {
    color: #f3efe7;
    font-weight: 700;
  }

  .consult-submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-width: min(420px, 100%);
    min-height: 72px;
    padding: 0 40px;
    border: 1px solid #f2d18d;
    border-radius: 999px;
    background: linear-gradient(90deg, #f4d28d, #ffdda0);
    color: #281d0b;
    font-size: 20px;
    font-weight: 500;
    box-shadow: 0 12px 34px rgba(239, 205, 138, 0.3), 0 0 28px rgba(239, 205, 138, 0.15);
    transition: transform 200ms ease, filter 200ms ease, box-shadow 200ms ease;
    animation: konsultasiGlowPulse 3s ease-in-out infinite;
  }

  .consult-submit-button svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
    transition: transform 200ms ease;
  }

  .consult-submit-button:hover,
  .consult-submit-button:focus-visible {
    transform: translateY(-4px) scale(1.015);
    filter: brightness(1.045);
    box-shadow: 0 18px 44px rgba(239, 205, 138, 0.42), 0 0 44px rgba(239, 205, 138, 0.27);
    outline: none;
  }

  .consult-submit-button:hover svg { transform: translateX(5px); }

  .consult-submit-button:disabled {
    cursor: wait;
    opacity: 0.72;
    transform: none;
  }

  @media (max-width: 1100px) {
    .konsultasi-hero {
      min-height: auto;
      padding-top: 126px;
    }

    .konsultasi-hero__container {
      grid-template-columns: 1fr;
      gap: 52px;
    }

    .konsultasi-hero__content { max-width: 780px; }
    .konsultasi-hero__visual { width: min(760px, 100%); }
    .konsultasi-hero__image-frame { max-width: none; }
    .konsultasi-hero__stepper { margin-top: 56px; }

    .consult-service-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .consult-service-option--wide { grid-column: span 2; }
  }

  @media (max-width: 720px) {
    .konsultasi-hero {
      padding: 108px 18px 34px;
    }

    .konsultasi-hero__title {
      max-width: 440px;
      font-size: clamp(53px, 15vw, 74px);
      line-height: 0.96;
    }

    .konsultasi-hero__description {
      font-size: 15px;
      line-height: 1.62;
    }

    .konsultasi-hero__image-frame {
      min-height: 0;
      padding: 16px 16px 17px 22px;
      border-radius: 18px;
    }

    .konsultasi-hero__image {
      min-height: 255px;
      border-radius: 8px;
    }

    .konsultasi-hero__stepper { margin-top: 42px; }

    .consult-form-section { padding: 0 16px 64px; }

    .consult-stepper__track {
      top: 18px;
      right: 10%;
      left: 10%;
    }

    .consult-stepper__number {
      width: 36px;
      height: 36px;
      font-size: 14px;
    }

    .consult-stepper__label {
      max-width: 80px;
      font-size: 14px;
      line-height: 1.3;
    }

    .consult-card { padding: 38px 0 42px; }
    .consult-section-title { font-size: 27px; }

    .consult-fields-grid {
      grid-template-columns: 1fr;
      gap: 24px;
      margin-top: 31px;
    }

    .consult-field--full { grid-column: auto; }
    .consult-field input { height: 64px; padding: 0 21px; font-size: 15px; }
    .consult-service-grid { gap: 13px; }
    .consult-service-option { min-height: 110px; font-size: 14px; }
    .consult-textarea { padding: 21px; font-size: 15px; }
    .consult-budget-options { gap: 12px; }
    .consult-radio-option { min-height: 60px; padding: 0 18px; font-size: 15px; }
    .consult-target-options { gap: 11px; }
    .consult-target-button { min-width: calc(50% - 6px); min-height: 50px; padding: 0 16px; font-size: 14px; }
    .consult-upload-zone { min-height: 225px; padding: 22px 12px; }
    .consult-upload-zone__title { font-size: 14px; }
    .consult-submit-area { padding: 48px 0 6px; }
    .consult-privacy-copy { font-size: 14px; }
    .consult-submit-button { min-height: 64px; padding: 0 28px; font-size: 17px; }
  }

  @media (max-width: 470px) {
    .konsultasi-hero__eyebrow { font-size: 14px; letter-spacing: 1.4px; }
    .konsultasi-hero__title { font-size: clamp(49px, 14.6vw, 64px); }
    .konsultasi-hero__proof-text { font-size: 14px; }
    .konsultasi-hero__image { min-height: 220px; }
    .konsultasi-hero__quote-text { font-size: 14px; }

    .consult-service-grid { grid-template-columns: 1fr; }
    .consult-service-option--wide { grid-column: auto; }
    .consult-target-button { min-width: 100%; }
    .consult-submit-button { min-width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .konsultasi-hero__eyebrow,
    .konsultasi-hero__title,
    .konsultasi-hero__description,
    .konsultasi-hero__proof,
    .konsultasi-hero__visual,
    .konsultasi-hero__stepper,
    .consult-form-reveal,
    .consult-stepper__item.is-active .consult-stepper__number,
    .consult-stepper__item.is-complete .consult-stepper__number,
    .consult-submit-button {
      animation: none;
      opacity: 1;
      transform: none;
      clip-path: none;
      filter: none;
    }

    .consult-form-reveal,
    .consult-option-button,
    .consult-radio-option,
    .consult-upload-zone,
    .consult-submit-button,
    .konsultasi-hero__image {
      transition: none;
    }
  }
`;

interface ClientInfo {
  nama: string;
  perusahaan: string;
  email: string;
  whatsapp: string;
  kota: string;
}

const initialClientInfo: ClientInfo = {
  nama: "",
  perusahaan: "",
  email: "",
  whatsapp: "",
  kota: "",
};

const Konsultasi = () => {
  const [initialDraft] = useState(() => getKonsultasiDraft());
  const [clientInfo, setClientInfo] = useState<ClientInfo>(
    initialDraft?.clientInfo ?? initialClientInfo,
  );
  const [services, setServices] = useState<string[]>(initialDraft?.services ?? []);
  const [kebutuhan, setKebutuhan] = useState(initialDraft?.kebutuhan ?? "");
  const [budget, setBudget] = useState(initialDraft?.budget ?? "");
  const [target, setTarget] = useState(initialDraft?.target ?? "");
  const [referenceFiles, setReferenceFiles] = useState<File[]>(() =>
    getKonsultasiFiles(),
  );
  const [notes, setNotes] = useState(initialDraft?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".consult-form-reveal"),
    );

    sections.forEach((section, index) => {
      section.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
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
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const updateClientInfo = (field: keyof ClientInfo, value: string) => {
    setClientInfo((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (services.length === 0) {
      window.alert("Pilih minimal satu jenis layanan yang Anda butuhkan.");
      return;
    }

    if (!budget) {
      window.alert("Pilih estimasi budget proyek Anda.");
      return;
    }

    if (!target) {
      window.alert("Pilih target penyelesaian proyek.");
      return;
    }

    setSubmitting(true);

    saveKonsultasiDraft(
      {
        clientInfo,
        services,
        kebutuhan,
        budget,
        target,
        notes,
        files: [],
      },
      referenceFiles,
    );

    window.setTimeout(() => {
      navigateToRoute("/tanya-mahreen/konsultasi/cek-data");
    }, 320);
  };

  return (
    <div className="konsultasi-page">
      <style data-component="konsultasi-gratis">{konsultasiStyles}</style>
      <Navbar />

      <main>
        <section className="konsultasi-hero" aria-labelledby="konsultasi-title">
          <div className="konsultasi-hero__container">
            <div className="konsultasi-hero__content">
              <p className="konsultasi-hero__eyebrow">Konsultasi Eksklusif</p>

              <h1 className="konsultasi-hero__title" id="konsultasi-title">
                Jadwalkan<br />Konsultasi<br />Gratis
              </h1>

              <p className="konsultasi-hero__description">
                Wujudkan visi bisnis Anda melalui strategi digital yang presisi.
                Kami siap mendengarkan kebutuhan unik Anda dan memberikan
                rekomendasi solusi kelas dunia.
              </p>

              <div className="konsultasi-hero__proof" aria-label="Rekam jejak proyek">
                <div className="konsultasi-hero__avatars" aria-hidden="true">
                  <span className="konsultasi-hero__avatar"><img width="720" height="830" decoding="async" src={avatarOne} alt="" /></span>
                  <span className="konsultasi-hero__avatar"><img width="720" height="830" decoding="async" src={avatarTwo} alt="" /></span>
                  <span className="konsultasi-hero__avatar"><img width="720" height="830" decoding="async" src={avatarThree} alt="" /></span>
                </div>
                <p className="konsultasi-hero__proof-text">
                  <strong>150+</strong> Proyek Berhasil
                </p>
              </div>
            </div>

            <div className="konsultasi-hero__visual">
              <div className="konsultasi-hero__image-frame">
                <img width="501" height="390" decoding="async"
                  className="konsultasi-hero__image"
                  src={meetingImage}
                  alt="Tim profesional sedang melakukan sesi konsultasi bisnis"
                />

                <blockquote className="konsultasi-hero__quote">
                  <p className="konsultasi-hero__quote-text">
                    “Kemitraan strategis yang mengubah cara kami menjangkau audiens global.”
                  </p>
                  <footer className="konsultasi-hero__quote-author">
                    — Founder, Mahreen Indonesia
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>

          <div className="konsultasi-hero__stepper">
            <SteepProgres currentStep={1} />
          </div>
        </section>

        <section className="consult-form-section" aria-label="Form konsultasi gratis">
          <div className="consult-form-container">
            <form className="consult-form" onSubmit={handleSubmit}>
              <InformasiData value={clientInfo} onChange={updateClientInfo} />
              <Layanan value={services} onChange={setServices} />
              <CeritakanKebutuhan
                kebutuhan={kebutuhan}
                onKebutuhanChange={setKebutuhan}
              />
              <Budget value={budget} onChange={setBudget} />
              <TargetPenyelesaian value={target} onChange={setTarget} />
              <UploadReferensi files={referenceFiles} onChange={setReferenceFiles} />
              <KurikulumTambahan value={notes} onChange={setNotes} />
              <ButtunKirim submitting={submitting} />
            </form>
          </div>
        </section>
      </main>

      <ClosingSection />
      <Footer />
    </div>
  );
};

export default Konsultasi;
