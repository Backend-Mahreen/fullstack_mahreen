import type { ReactNode } from "react";

import CSRNavbar from "../../../../components/Navbar/CSRNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import type { RegistrationStep } from "../../../../types/csrRegistration";
import ProgressIndicator from "./ProgressIndicator";

const CSR_REGISTRATION_STYLES = String.raw`

  @keyframes csrRegistrationReveal {
    from {
      opacity: 0;
      transform: translate3d(0, 26px, 0) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes csrRegistrationItemReveal {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes csrRegistrationSuccessPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(229, 196, 131, 0.2);
    }
    50% {
      transform: scale(1.035);
      box-shadow: 0 0 0 24px rgba(229, 196, 131, 0);
    }
  }

  @keyframes csrRegistrationLineFill {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  .csr-registration-page {
    --csr-reg-gold: #e5c483;
    --csr-reg-gold-strong: #d8b363;
    --csr-reg-paper: #f1eee8;
    --csr-reg-muted: #a59d91;
    --csr-reg-card: #111111;
    --csr-reg-card-soft: #151515;
    --csr-reg-line: rgba(255, 255, 255, 0.11);
    min-height: 100vh;
    background: #000000;
    color: #f1eee8;
    overflow-x: clip;
  }

  .csr-registration-page,
  .csr-registration-page *,
  .csr-registration-page *::before,
  .csr-registration-page *::after {
    box-sizing: border-box;
  }

  .csr-registration-main {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-height: 760px;
    padding: 112px 30px 88px;
    background:
      radial-gradient(circle at 50% -18%, rgba(229, 196, 131, 0.085), transparent 34%),
      linear-gradient(180deg, #000000 0%, #030303 52%, #000000 100%);
  }

  .csr-registration-main::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0.19;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(to bottom, black, transparent 80%);
  }

  .csr-registration-container {
    width: min(100%, 1180px);
    margin: 0 auto;
  }

  .csr-registration-progress {
    position: relative;
    left: 96px;
    width: min(100%, 860px);
    margin: 0 auto 70px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    opacity: 0;
    animation: csrRegistrationReveal 620ms cubic-bezier(0.22, 1, 0.36, 1) 60ms forwards;
  }

  .csr-registration-progress__step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }

  .csr-registration-progress__step:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 17px;
    left: 45px;
    right: 15px;
    height: 1px;
    background: rgba(255, 255, 255, 0.13);
  }

  .csr-registration-progress__step.is-complete:not(:last-child)::before,
  .csr-registration-progress__step.is-active:not(:last-child)::before {
    content: "";
    position: absolute;
    z-index: 1;
    top: 17px;
    left: 45px;
    right: 15px;
    height: 1px;
    background: linear-gradient(90deg, var(--csr-reg-gold), rgba(229, 196, 131, 0.24));
    transform-origin: left center;
    animation: csrRegistrationLineFill 650ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .csr-registration-progress__button {
    position: relative;
    z-index: 2;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 36px;
    padding: 0;
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.26);
    cursor: default;
    font-family: "Inter", Arial, sans-serif;
  }

  .csr-registration-progress__button.can-return {
    cursor: pointer;
  }

  .csr-registration-progress__circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(255, 255, 255, 0.045);
    border-radius: 50%;
    background: #111111;
    color: rgba(255, 255, 255, 0.32);
    font-size: 14px;
    font-weight: 600;
    transition: transform 220ms ease, background-color 220ms ease, color 220ms ease, box-shadow 220ms ease;
  }

  .csr-registration-progress__label {
    margin-left: 0;
    color: currentColor;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .csr-registration-progress__step.is-active .csr-registration-progress__button,
  .csr-registration-progress__step.is-complete .csr-registration-progress__button {
    color: var(--csr-reg-gold);
  }

  .csr-registration-progress__step.is-active .csr-registration-progress__circle {
    background: var(--csr-reg-gold);
    color: #3b2e12;
    box-shadow: 0 0 0 7px rgba(229, 196, 131, 0.055), 0 8px 20px rgba(0, 0, 0, 0.38);
  }

  .csr-registration-progress__step.is-complete .csr-registration-progress__circle {
    border-color: rgba(229, 196, 131, 0.55);
    background: rgba(229, 196, 131, 0.12);
    color: var(--csr-reg-gold);
  }

  .csr-registration-stage {
    opacity: 0;
    animation: csrRegistrationReveal 720ms cubic-bezier(0.22, 1, 0.36, 1) 130ms forwards;
  }

  .csr-registration-heading {
    width: min(100%, 760px);
    margin: 0 auto 72px;
    text-align: center;
  }

  .csr-registration-title {
    margin: 0;
    color: #f4f2ee;
    font-family: "Manrope", Arial, sans-serif;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -2.4px;
  }

  .csr-registration-subtitle {
    max-width: 610px;
    margin: 19px auto 0;
    color: #9f968a;
    font-family: "Inter", Arial, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.62;
  }

  .csr-registration-role-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    width: min(100%, 1080px);
    margin: 0 auto;
  }

  .csr-registration-role-card {
    position: relative;
    min-height: 322px;
    padding: 36px 34px 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    background: #111111;
    color: inherit;
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    opacity: 0;
    animation: csrRegistrationItemReveal 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    transition: transform 240ms ease, border-color 240ms ease, background-color 240ms ease, box-shadow 240ms ease;
  }

  .csr-registration-role-card:nth-child(1) { animation-delay: 220ms; }
  .csr-registration-role-card:nth-child(2) { animation-delay: 310ms; }

  .csr-registration-role-card::after {
    content: "";
    position: absolute;
    inset: auto -70px -100px auto;
    width: 230px;
    height: 230px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(229, 196, 131, 0.12), transparent 68%);
    opacity: 0;
    transition: opacity 240ms ease, transform 340ms ease;
  }

  .csr-registration-role-card.is-selected {
    border-color: rgba(229, 196, 131, 0.72);
    background: linear-gradient(145deg, rgba(229, 196, 131, 0.075), #111111 46%);
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.38), inset 0 0 0 1px rgba(229, 196, 131, 0.09);
  }

  .csr-registration-role-card.is-selected::after {
    opacity: 1;
    transform: scale(1.08);
  }

  .csr-registration-role-card__selected {
    position: absolute;
    top: 24px;
    right: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: var(--csr-reg-gold);
    color: #35290e;
    opacity: 0;
    transform: scale(0.75);
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .csr-registration-role-card.is-selected .csr-registration-role-card__selected {
    opacity: 1;
    transform: scale(1);
  }

  .csr-registration-role-card__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border-radius: 14px;
    background: rgba(229, 196, 131, 0.1);
    color: var(--csr-reg-gold);
  }

  .csr-registration-role-card__title {
    margin: 37px 0 8px;
    color: #eeeae5;
    font-family: "Manrope", Arial, sans-serif;
    font-size: 21px;
    font-weight: 500;
    letter-spacing: -0.4px;
  }

  .csr-registration-role-card__description {
    margin: 0;
    max-width: 465px;
    color: #a79e93;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.58;
  }

  .csr-registration-benefits {
    margin: 24px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .csr-registration-benefits li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #9f978b;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  .csr-registration-benefits svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: var(--csr-reg-gold);
  }

  .csr-registration-step-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    margin-top: 54px;
  }

  .csr-registration-step-counter {
    margin: 0;
    color: rgba(255, 255, 255, 0.45);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .csr-registration-button {
    min-height: 54px;
    padding: 14px 30px;
    border: 1px solid transparent;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: var(--csr-reg-gold);
    color: #4a3915;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 9px 28px rgba(0, 0, 0, 0.32);
    transition: transform 190ms ease, background-color 190ms ease, box-shadow 190ms ease, opacity 190ms ease;
  }

  .csr-registration-button--wide {
    min-width: 170px;
  }

  .csr-registration-button--square {
    min-width: 230px;
    border-radius: 8px;
  }

  .csr-registration-button--ghost {
    border-color: rgba(255, 255, 255, 0.11);
    background: transparent;
    color: #c7c0b6;
    box-shadow: none;
  }

  .csr-registration-button:disabled {
    opacity: 0.42;
    cursor: not-allowed;
    box-shadow: none;
  }

  .csr-registration-form-intro {
    width: min(100%, 1100px);
    margin: -28px auto 50px;
  }

  .csr-registration-form-intro__title {
    margin: 0 0 7px;
    color: #d8d2ca;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
  }

  .csr-registration-form-intro__text {
    margin: 0;
    color: #888176;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.55;
  }

  .csr-registration-details-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 0.88fr);
    gap: 22px;
    width: min(100%, 1100px);
    margin: 0 auto;
    align-items: start;
  }

  .csr-registration-form-card,
  .csr-registration-aside-card,
  .csr-registration-motivation-card,
  .csr-registration-success-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(17, 17, 17, 0.96);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
  }

  .csr-registration-form-card {
    padding: 40px 38px 30px;
    border-radius: 15px;
  }

  .csr-registration-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 24px;
  }

  .csr-registration-field {
    display: flex;
    flex-direction: column;
    gap: 9px;
    min-width: 0;
  }

  .csr-registration-field--full {
    grid-column: 1 / -1;
  }

  .csr-registration-label {
    color: #a79f94;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
  }

  .csr-registration-input,
  .csr-registration-select,
  .csr-registration-textarea {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    outline: none;
    background: #070707;
    color: #f2eee8;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease, transform 180ms ease;
  }

  .csr-registration-input,
  .csr-registration-select {
    height: 48px;
    padding: 0 14px;
  }

  .csr-registration-textarea {
    min-height: 112px;
    padding: 14px;
    resize: vertical;
    line-height: 1.55;
  }

  .csr-registration-input::placeholder,
  .csr-registration-textarea::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  .csr-registration-input:focus,
  .csr-registration-select:focus,
  .csr-registration-textarea:focus {
    border-color: rgba(229, 196, 131, 0.75);
    background: #0b0b0b;
    box-shadow: 0 0 0 3px rgba(229, 196, 131, 0.095);
    transform: translateY(-1px);
  }

  .csr-registration-input[data-error="true"],
  .csr-registration-select[data-error="true"],
  .csr-registration-textarea[data-error="true"] {
    border-color: #b85e55;
  }

  .csr-registration-error {
    margin: 0;
    color: #d98980;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }

  .csr-registration-form-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .csr-registration-form-actions .csr-registration-button {
    min-height: 46px;
    padding: 13px 28px;
    border-radius: 999px;
    font-size: 14px;
  }

  .csr-registration-form-actions .csr-registration-button--ghost {
    min-width: 108px;
  }

  .csr-registration-form-actions .csr-registration-button:not(.csr-registration-button--ghost) {
    min-width: 190px;
  }

  .csr-registration-aside {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .csr-registration-aside-card {
    padding: 30px 28px;
    border-radius: 15px;
    background:
      radial-gradient(circle at 100% 0%, rgba(229, 196, 131, 0.12), transparent 44%),
      #12110f;
  }

  .csr-registration-aside-card__title {
    margin: 0;
    color: var(--csr-reg-gold);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
  }

  .csr-registration-aside-card__description {
    margin: 17px 0 24px;
    color: #a49b8e;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.62;
  }

  .csr-registration-aside-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 21px;
  }

  .csr-registration-aside-list li {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 11px;
    align-items: start;
  }

  .csr-registration-aside-list__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(229, 196, 131, 0.1);
    color: var(--csr-reg-gold);
  }

  .csr-registration-aside-list strong {
    display: block;
    margin-bottom: 4px;
    color: #d9d3ca;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
  }

  .csr-registration-aside-list p {
    margin: 0;
    color: #948c80;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  .csr-registration-values-card {
    position: relative;
    min-height: 236px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    background: #0e0e0e;
  }

  .csr-registration-values-card img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .csr-registration-values-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 28%, rgba(0, 0, 0, 0.94) 100%);
  }

  .csr-registration-values-card__content {
    position: absolute;
    z-index: 2;
    inset: auto 22px 22px;
  }

  .csr-registration-values-card__eyebrow {
    margin: 0 0 4px;
    color: var(--csr-reg-gold);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .csr-registration-values-card__quote {
    margin: 0;
    color: #f3f0eb;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-style: italic;
    line-height: 1.55;
  }

  .csr-registration-motivation-card {
    width: min(100%, 900px);
    margin: 0 auto;
    padding: 42px 40px 34px;
    border-radius: 14px;
  }

  .csr-registration-section-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    color: #d8d2cb;
    font-family: "Inter", Arial, sans-serif;
    font-size: 18px;
    font-weight: 500;
  }

  .csr-registration-section-heading svg {
    color: var(--csr-reg-gold);
  }

  .csr-registration-section-helper {
    margin: 0 0 20px;
    color: #8b8378;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  .csr-registration-motivation-wrap {
    position: relative;
  }

  .csr-registration-motivation-wrap .csr-registration-textarea {
    min-height: 170px;
    padding-bottom: 38px;
  }

  .csr-registration-word-count {
    position: absolute;
    right: 12px;
    bottom: 10px;
    margin: 0;
    padding: 3px 7px;
    border-radius: 4px;
    background: #1a1a1a;
    color: #81796f;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
  }

  .csr-registration-document-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 34px;
  }

  .csr-registration-file-types {
    flex: 0 0 auto;
    padding: 5px 9px;
    border-radius: 999px;
    background: #1a1a1a;
    color: #8d857b;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    text-transform: uppercase;
  }

  .csr-registration-dropzone {
    position: relative;
    min-height: 146px;
    margin-top: 16px;
    border: 1px dashed rgba(255, 255, 255, 0.17);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #0b0b0b;
    text-align: center;
    cursor: pointer;
    transition: border-color 200ms ease, background-color 200ms ease, transform 200ms ease;
  }

  .csr-registration-dropzone.is-dragging {
    border-color: var(--csr-reg-gold);
    background: rgba(229, 196, 131, 0.05);
    transform: scale(1.006);
  }

  .csr-registration-dropzone input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .csr-registration-dropzone__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    color: #aca499;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
  }

  .csr-registration-dropzone__content svg {
    color: #ded8cf;
  }

  .csr-registration-dropzone__content strong {
    color: var(--csr-reg-gold);
    font-weight: 500;
  }

  .csr-registration-uploaded-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: min(100%, 520px);
    padding: 14px 16px;
    border: 1px solid rgba(229, 196, 131, 0.2);
    border-radius: 9px;
    background: rgba(229, 196, 131, 0.055);
    text-align: left;
  }

  .csr-registration-uploaded-file__info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .csr-registration-uploaded-file__info svg {
    flex: 0 0 auto;
    color: var(--csr-reg-gold);
  }

  .csr-registration-uploaded-file__name {
    margin: 0;
    color: #ddd7ce;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .csr-registration-uploaded-file__size {
    margin: 3px 0 0;
    color: #817a70;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
  }

  .csr-registration-uploaded-file__remove {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    background: transparent;
    color: #b7afa5;
    cursor: pointer;
  }

  .csr-registration-consent {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    color: #8e877d;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    cursor: pointer;
  }

  .csr-registration-consent input {
    flex: 0 0 auto;
    width: 17px;
    height: 17px;
    margin: 1px 0 0;
    accent-color: var(--csr-reg-gold);
  }

  .csr-registration-consent a {
    color: var(--csr-reg-gold);
    text-decoration: none;
  }

  .csr-registration-motivation-actions {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 2px;
    margin-top: 27px;
  }

  .csr-registration-motivation-actions .csr-registration-button {
    min-height: 52px;
    border-radius: 7px;
  }

  .csr-registration-success-wrap {
    width: min(100%, 760px);
    margin: 0 auto;
    padding-top: 38px;
  }

  .csr-registration-success-card {
    position: relative;
    padding: 66px 58px 54px;
    border-radius: 14px;
    text-align: center;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 5%, rgba(229, 196, 131, 0.075), transparent 35%),
      rgba(13, 13, 13, 0.97);
  }

  .csr-registration-success-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(115deg, transparent 15%, rgba(255, 255, 255, 0.018) 50%, transparent 85%);
  }

  .csr-registration-success-icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 126px;
    height: 126px;
    margin-bottom: 34px;
    border: 1px solid rgba(229, 196, 131, 0.08);
    border-radius: 50%;
  }

  .csr-registration-success-icon-wrap::before,
  .csr-registration-success-icon-wrap::after {
    content: "";
    position: absolute;
    border: 1px solid rgba(229, 196, 131, 0.065);
    border-radius: 50%;
  }

  .csr-registration-success-icon-wrap::before { inset: 12px; }
  .csr-registration-success-icon-wrap::after { inset: 24px; }

  .csr-registration-success-icon {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: var(--csr-reg-gold);
    color: #382b0f;
    animation: csrRegistrationSuccessPulse 2.8s ease-in-out infinite;
  }

  .csr-registration-success-title {
    margin: 0;
    color: #eeeae5;
    font-family: "Manrope", Arial, sans-serif;
    font-size: clamp(32px, 4vw, 47px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -1.5px;
  }

  .csr-registration-success-description {
    max-width: 590px;
    margin: 16px auto 0;
    color: #9e968b;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.65;
  }

  .csr-registration-success-steps {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 38px;
    text-align: left;
  }

  .csr-registration-success-step {
    padding: 16px 18px;
    border-radius: 7px;
    background: #1b1b1b;
  }

  .csr-registration-success-step:last-child {
    grid-column: 1 / -1;
  }

  .csr-registration-success-step__eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 5px;
    color: var(--csr-reg-gold);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .csr-registration-success-step__title {
    margin: 0 0 4px;
    color: #dcd6cd;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
  }

  .csr-registration-success-step__text {
    margin: 0;
    color: #8f887e;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.48;
  }

  .csr-registration-application-meta {
    margin: 20px auto 0;
    color: rgba(255, 255, 255, 0.33);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .csr-registration-success-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 38px;
  }

  .csr-registration-success-actions .csr-registration-button {
    min-width: 190px;
    min-height: 48px;
    border-radius: 7px;
    font-size: 14px;
  }

  .csr-registration-screen-reader {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (hover: hover) and (pointer: fine) {
    .csr-registration-role-card:hover {
      transform: translateY(-5px);
      border-color: rgba(229, 196, 131, 0.43);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
    }

    .csr-registration-role-card:hover::after {
      opacity: 0.8;
      transform: scale(1.08);
    }

    .csr-registration-button:not(:disabled):hover {
      transform: translateY(-2px);
      background: #f0cf8f;
      box-shadow: 0 15px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(229, 196, 131, 0.12);
    }

    .csr-registration-button--ghost:not(:disabled):hover {
      background: rgba(229, 196, 131, 0.055);
      border-color: rgba(229, 196, 131, 0.42);
      color: #f0d49b;
    }

    .csr-registration-values-card:hover img {
      transform: scale(1.045);
    }

    .csr-registration-dropzone:hover {
      border-color: rgba(229, 196, 131, 0.54);
      background: rgba(229, 196, 131, 0.025);
    }

    .csr-registration-progress__button.can-return:hover .csr-registration-progress__circle {
      transform: translateY(-2px);
      border-color: rgba(229, 196, 131, 0.4);
    }
  }

  .csr-registration-role-card:focus-visible,
  .csr-registration-button:focus-visible,
  .csr-registration-progress__button:focus-visible,
  .csr-registration-dropzone:focus-visible,
  .csr-registration-uploaded-file__remove:focus-visible {
    outline: 2px solid var(--csr-reg-gold);
    outline-offset: 4px;
  }

  @media (max-width: 900px) {
    .csr-registration-main {
      padding-inline: 22px;
    }

    .csr-registration-progress {
      left: 48px;
      margin-bottom: 56px;
    }

    .csr-registration-role-grid,
    .csr-registration-details-layout {
      grid-template-columns: 1fr;
    }

    .csr-registration-role-card {
      min-height: 0;
    }

    .csr-registration-aside {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .csr-registration-main {
      min-height: 0;
      padding: 100px 16px 64px;
    }

    .csr-registration-progress {
      left: 0;
      width: 100%;
      margin-bottom: 46px;
    }

    .csr-registration-progress__step:not(:last-child)::after,
    .csr-registration-progress__step.is-complete:not(:last-child)::before,
    .csr-registration-progress__step.is-active:not(:last-child)::before {
      left: 40px;
      right: 8px;
    }

    .csr-registration-progress__circle {
      width: 31px;
      height: 31px;
      font-size: 14px;
    }

    .csr-registration-progress__label {
      font-size: 14px;
    }

    .csr-registration-heading {
      margin-bottom: 44px;
    }

    .csr-registration-title {
      font-size: clamp(36px, 11vw, 48px);
      letter-spacing: -1.8px;
    }

    .csr-registration-subtitle {
      font-size: 14px;
    }

    .csr-registration-role-grid {
      gap: 16px;
    }

    .csr-registration-role-card {
      padding: 28px 24px;
      border-radius: 13px;
    }

    .csr-registration-role-card__title {
      margin-top: 28px;
    }

    .csr-registration-form-intro {
      margin-top: -12px;
    }

    .csr-registration-form-card,
    .csr-registration-motivation-card,
    .csr-registration-success-card {
      padding: 28px 20px 24px;
    }

    .csr-registration-form-grid {
      grid-template-columns: 1fr;
      gap: 19px;
    }

    .csr-registration-field--full {
      grid-column: auto;
    }

    .csr-registration-form-actions,
    .csr-registration-success-actions {
      flex-direction: column-reverse;
      align-items: stretch;
    }

    .csr-registration-form-actions .csr-registration-button,
    .csr-registration-success-actions .csr-registration-button {
      width: 100%;
    }

    .csr-registration-aside {
      grid-template-columns: 1fr;
    }

    .csr-registration-document-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }

    .csr-registration-motivation-actions {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .csr-registration-success-wrap {
      padding-top: 0;
    }

    .csr-registration-success-steps {
      grid-template-columns: 1fr;
    }

    .csr-registration-success-step:last-child {
      grid-column: auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .csr-registration-progress,
    .csr-registration-stage,
    .csr-registration-role-card {
      opacity: 1;
      animation: none !important;
      transform: none !important;
    }

    .csr-registration-progress__step::before,
    .csr-registration-success-icon {
      animation: none !important;
    }

    .csr-registration-role-card,
    .csr-registration-button,
    .csr-registration-input,
    .csr-registration-select,
    .csr-registration-textarea,
    .csr-registration-dropzone,
    .csr-registration-values-card img {
      transition: none !important;
    }
  }
`;

type CSRRegistrationLayoutProps = Readonly<{
  currentStep: RegistrationStep;
  children: ReactNode;
}>;

const CSRRegistrationLayout = ({
  currentStep,
  children,
}: CSRRegistrationLayoutProps) => (
  <div className="csr-registration-page">
    <style>{CSR_REGISTRATION_STYLES}</style>
    <CSRNavbar />

    <main className="csr-registration-main">
      <div className="csr-registration-container">
        <ProgressIndicator currentStep={currentStep} />
        {children}
      </div>
    </main>

    <ClosingSection />
    <Footer />
  </div>
);

export default CSRRegistrationLayout;
