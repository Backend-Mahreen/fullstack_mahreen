import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import TanyaMahreenNavbar from "../../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";
import BillingInformation from "./components/BillingInformation";
import NextStepsInfo from "./components/NextStepsInfo";
import OrderSummary from "./components/OrderSummary";
import PaymentMethods from "./components/PaymentMethods";
import Reveal from "./components/Reveal";
import { DEFAULT_PAYMENT_DETAILS } from "./paymentData";
import { createAndSavePaymentDraft } from "./paymentStorage";
import { navigateToRoute } from "../../../../utils/hashNavigation";
import type {
  BillingInformationValue,
  PaymentDetailsValue,
  PaymentMethodId,
  WebsitePackageSelection,
} from "./paymentTypes";

const PEMBAYARAN_STYLES = String.raw`

:root {
  --tp-bg: #0a0a0a;
  --tp-panel: #111210;
  --tp-panel-soft: #151714;
  --tp-border: rgba(255, 255, 255, 0.1);
  --tp-border-soft: rgba(255, 255, 255, 0.07);
  --tp-gold: #cbaa6e;
  --tp-gold-light: #e1c68f;
  --tp-text: #eee9df;
  --tp-muted: #89857e;
  --tp-danger: #d09078;
}

.tp-payment-page,
.tp-payment-page *,
.tp-payment-page *::before,
.tp-payment-page *::after {
  box-sizing: border-box;
}

.tp-payment-page {
  min-height: 100vh;
  padding-top: var(--navbar-height, 78px);
  overflow: hidden;
  background:
    radial-gradient(circle at 73% 12%, rgba(203, 170, 110, 0.055), transparent 24%),
    linear-gradient(180deg, #0b0b0b 0%, #090909 100%);
  color: var(--tp-text);
  font-family: "Inter", sans-serif;
}

.tp-payment-shell {
  width: min(1280px, calc(100% - 72px));
  margin: 0 auto;
  padding: 74px 0 96px;
}

.tp-payment-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 356px;
  align-items: start;
  gap: clamp(48px, 7vw, 104px);
}

.tp-payment-main {
  min-width: 0;
}

.tp-mobile-summary {
  display: none;
}

.tp-payment-header {
  max-width: 650px;
  margin-bottom: 58px;
}

.tp-payment-header p {
  margin: 0 0 14px;
  color: var(--tp-gold);
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.tp-payment-header h1 {
  margin: 0;
  color: var(--tp-text);
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(44px, 5.2vw, 64px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.tp-payment-header > span {
  display: block;
  max-width: 610px;
  margin-top: 14px;
  color: var(--tp-muted);
  font-size: 16px;
  font-weight: 300;
  line-height: 1.78;
}

.tp-section {
  margin-top: 0;
}

.tp-section--payment {
  margin-top: 64px;
}

.tp-section__heading {
  display: flex;
  margin-bottom: 30px;
  align-items: center;
  gap: 13px;
}

.tp-section__number {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(203, 170, 110, 0.75);
  border-radius: 8px;
  color: var(--tp-gold-light);
  font-family: "DM Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.07em;
  box-shadow: 0 0 18px rgba(203, 170, 110, 0.08);
}

.tp-section__heading h2 {
  margin: 0;
  color: #dcd7cf;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(27px, 2.45vw, 35px);
  font-weight: 500;
}

.tp-billing-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px 38px;
}

.tp-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.tp-field--full {
  grid-column: 1 / -1;
}

.tp-field__label {
  margin-bottom: 10px;
  color: #9c9892;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.tp-field input,
.tp-field textarea {
  width: 100%;
  min-height: 48px;
  padding: 12px 12px 10px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0;
  outline: 0;
  background: transparent;
  color: var(--tp-text);
  font: inherit;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.58;
  resize: vertical;
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease,
    background-color 220ms ease;
}

.tp-field textarea {
  min-height: 66px;
}

.tp-field input::placeholder,
.tp-field textarea::placeholder {
  color: #4f4d49;
}

.tp-field input:hover,
.tp-field textarea:hover {
  border-bottom-color: rgba(203, 170, 110, 0.45);
}

.tp-field input:focus,
.tp-field textarea:focus {
  border-bottom-color: var(--tp-gold);
  background: linear-gradient(180deg, transparent, rgba(203, 170, 110, 0.025));
  box-shadow: 0 10px 20px -18px rgba(224, 194, 142, 0.8);
}

.tp-field input[aria-invalid="true"],
.tp-field textarea[aria-invalid="true"] {
  border-bottom-color: var(--tp-danger);
}

.tp-field__error {
  margin-top: 7px;
  color: var(--tp-danger);
  font-size: 14px;
}

.tp-method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.tp-glow-button {
  position: relative;
  isolation: isolate;
}

.tp-glow-button::before {
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(120deg, transparent 15%, rgba(225, 198, 143, 0.85), transparent 85%);
  content: "";
  opacity: 0;
  filter: blur(9px);
  transition: opacity 260ms ease;
  pointer-events: none;
}

.tp-glow-button:hover::before,
.tp-glow-button:focus-visible::before,
.tp-glow-button.is-selected::before {
  opacity: 0.52;
}

.tp-method-card {
  position: relative;
  display: flex;
  min-height: 142px;
  padding: 20px 22px;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid var(--tp-border);
  border-radius: 3px;
  outline: 0;
  background:
    linear-gradient(145deg, rgba(203, 170, 110, 0.025), transparent 45%),
    #0e0f0e;
  color: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(203, 170, 110, 0);
  transition:
    transform 240ms ease,
    border-color 240ms ease,
    background-color 240ms ease,
    box-shadow 240ms ease;
}

.tp-method-card:hover,
.tp-method-card:focus-visible {
  border-color: rgba(203, 170, 110, 0.58);
  transform: translateY(-4px);
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.35),
    0 0 22px rgba(203, 170, 110, 0.12);
}

.tp-method-card.is-selected {
  border-color: var(--tp-gold);
  background:
    linear-gradient(145deg, rgba(203, 170, 110, 0.09), transparent 55%),
    #12120f;
  box-shadow:
    inset 0 0 0 1px rgba(225, 198, 143, 0.06),
    0 0 26px rgba(203, 170, 110, 0.12);
}

.tp-method-card__topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.tp-method-card__title {
  color: #d7d2ca;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.09em;
}

.tp-method-card__topline > svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: #77736d;
  stroke-width: 1.5;
}

.tp-method-card.is-selected .tp-method-card__topline > svg {
  color: var(--tp-gold);
}

.tp-method-card__options {
  display: flex;
  margin-top: 25px;
  flex-wrap: wrap;
  gap: 11px;
}

.tp-method-card__options span {
  color: #908c85;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.tp-method-card__bank-logos {
  display: flex;
  margin-top: 22px;
  align-items: center;
  gap: 8px;
}

.tp-method-card__bank-logos img {
  width: 38px;
  height: 22px;
  padding: 4px 5px;
  border-radius: 3px;
  background: #efede8;
  object-fit: contain;
}

.tp-method-card__description {
  margin-top: 13px;
  color: #77736d;
  font-size: 14px;
  font-style: italic;
  font-weight: 300;
  line-height: 1.5;
}



.tp-method-detail {
  margin-top: 22px;
  padding: 27px 28px;
  border: 1px solid var(--tp-border);
  border-radius: 7px;
  background:
    linear-gradient(145deg, rgba(203, 170, 110, 0.035), transparent 46%),
    #0d0e0d;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
  animation: tp-detail-enter 520ms cubic-bezier(0.2, 0.72, 0.22, 1) both;
}

@keyframes tp-detail-enter {
  from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.tp-method-detail__heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tp-method-detail__icon {
  display: inline-flex;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(203, 170, 110, 0.28);
  border-radius: 999px;
  background: rgba(203, 170, 110, 0.08);
  color: var(--tp-gold);
}

.tp-method-detail__icon svg {
  width: 17px;
  height: 17px;
}

.tp-method-detail__icon--brand {
  width: 54px;
  padding: 4px;
  overflow: hidden;
  border-radius: 7px;
  background: #fff;
}

.tp-method-detail__icon--brand img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tp-method-detail__heading strong {
  display: block;
  color: #ddd7ce;
  font-size: 14px;
  font-weight: 500;
}

.tp-method-detail__heading p {
  margin: 4px 0 0;
  color: #77736d;
  font-size: 14px;
  line-height: 1.5;
}

.tp-method-detail__divider {
  height: 1px;
  margin: 20px 0 17px;
  background: var(--tp-border-soft);
}

.tp-method-detail__label {
  margin: 0 0 13px;
  color: #8f8a82;
  font-size: 14px;
  line-height: 1.6;
}

.tp-bank-picker,
.tp-wallet-picker {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.tp-bank-logo-button,
.tp-wallet-button {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 62px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--tp-border-soft);
  border-radius: 5px;
  outline: 0;
  background: #111211;
  color: #aaa59e;
  cursor: pointer;
  transition: border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
}

.tp-bank-logo-button:hover,
.tp-bank-logo-button:focus-visible,
.tp-wallet-button:hover,
.tp-wallet-button:focus-visible,
.tp-bank-logo-button.is-selected,
.tp-wallet-button.is-selected {
  border-color: rgba(203, 170, 110, 0.78);
  background: rgba(203, 170, 110, 0.065);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(203, 170, 110, 0.11);
}

.tp-bank-logo-button img {
  display: block;
  width: min(72px, 72%);
  height: 28px;
  object-fit: contain;
  filter: saturate(0.92) brightness(1.08);
}

.tp-bank-account-card {
  position: relative;
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  margin-top: 15px;
  padding: 17px;
  align-items: center;
  gap: 15px;
  border: 1px solid var(--tp-border-soft);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.015);
}

.tp-bank-account-card__logo {
  display: flex;
  width: 54px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #f2f0eb;
}

.tp-bank-account-card__logo img {
  width: 44px;
  max-height: 25px;
  object-fit: contain;
}

.tp-bank-account-card dl,
.tp-bank-account-card dl div {
  margin: 0;
}

.tp-bank-account-card dl {
  display: grid;
  gap: 6px;
}

.tp-bank-account-card dl div {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 12px;
}

.tp-bank-account-card dt {
  color: #6f6b65;
  font-size: 14px;
}

.tp-bank-account-card dd {
  margin: 0;
  color: #d3cec6;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
}

.tp-bank-account-card dd.is-gold {
  color: var(--tp-gold-light);
  font-family: "DM Mono", monospace;
}

.tp-copy-button {
  display: inline-flex;
  min-height: 33px;
  padding: 7px 10px;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(203, 170, 110, 0.23);
  border-radius: 4px;
  background: rgba(203, 170, 110, 0.08);
  color: #cdb98e;
  font-size: 14px;
  cursor: pointer;
}

.tp-copy-button svg {
  width: 12px;
  height: 12px;
}

.tp-method-detail__note {
  display: flex;
  margin-top: 16px;
  padding: 13px 14px;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid rgba(203, 170, 110, 0.19);
  border-radius: 4px;
  background: rgba(203, 170, 110, 0.035);
  color: #817b72;
  font-size: 14px;
  line-height: 1.6;
}

.tp-method-detail__note svg {
  width: 13px;
  height: 13px;
  margin-top: 2px;
  flex: 0 0 auto;
  color: var(--tp-gold);
}

.tp-method-detail__note strong {
  color: #bba273;
  font-weight: 500;
}

.tp-card-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.tp-card-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.tp-card-field--full {
  grid-column: 1 / -1;
}

.tp-card-field span {
  color: #77716a;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tp-card-field input {
  width: 100%;
  min-height: 45px;
  padding: 11px 13px;
  border: 1px solid var(--tp-border-soft);
  border-radius: 4px;
  outline: 0;
  background: #0b0c0b;
  color: #ddd7ce;
  font: inherit;
  font-size: 14px;
  transition: border-color 220ms ease, box-shadow 220ms ease;
}

.tp-card-field input:focus {
  border-color: rgba(203, 170, 110, 0.72);
  box-shadow: 0 0 18px rgba(203, 170, 110, 0.08);
}

.tp-card-brands {
  display: flex;
  margin-top: 14px;
  gap: 16px;
  color: #7a756e;
  font-family: "DM Mono", monospace;
  font-size: 14px;
}

.tp-wallet-picker {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.tp-wallet-button {
  min-height: 76px;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.tp-wallet-button img {
  width: min(72px, 82%);
  height: 28px;
  padding: 3px 5px;
  border-radius: 4px;
  background: #fff;
  object-fit: contain;
}

.tp-qr-preview {
  display: flex;
  min-height: 92px;
  margin-top: 14px;
  padding: 17px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--tp-border-soft);
  border-radius: 4px;
  color: #6f6b65;
  text-align: center;
}

.tp-qr-preview__brand {
  width: min(180px, 72%);
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
}

.tp-qr-preview p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 720px) {
  .tp-method-detail { padding: 22px 19px; }
  .tp-bank-picker { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tp-bank-account-card { grid-template-columns: 48px minmax(0, 1fr); }
  .tp-bank-account-card__logo { width: 48px; }
  .tp-copy-button { grid-column: 1 / -1; justify-content: center; }
  .tp-bank-account-card dl div { grid-template-columns: 1fr; gap: 2px; }
  .tp-bank-account-card dd { text-align: left; }
}

@media (max-width: 420px) {
  .tp-card-form { grid-template-columns: 1fr; }
  .tp-card-field--full { grid-column: auto; }
  .tp-wallet-picker { grid-template-columns: 1fr; }
}

.tp-payment-hints {
  display: flex;
  margin: 20px 0 0;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 28px;
  color: #54514d;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.tp-payment-hints span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.tp-payment-hints svg {
  width: 11px;
  height: 11px;
}

.tp-pay-button {
  display: flex;
  width: 100%;
  min-height: 62px;
  margin-top: 45px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid var(--tp-gold-light);
  border-radius: 2px;
  outline: 0;
  background: linear-gradient(90deg, #c7a565, #d1b477, #c7a565);
  background-size: 200% 100%;
  color: #14110b;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 0 22px rgba(203, 170, 110, 0.15),
    0 14px 36px rgba(0, 0, 0, 0.28);
  transition:
    transform 240ms ease,
    box-shadow 240ms ease,
    background-position 420ms ease;
}

.tp-pay-button:hover,
.tp-pay-button:focus-visible {
  background-position: 100% 0;
  transform: translateY(-3px);
  box-shadow:
    0 0 34px rgba(225, 198, 143, 0.42),
    0 18px 42px rgba(0, 0, 0, 0.36);
}

.tp-pay-button:active {
  transform: translateY(0) scale(0.995);
}

.tp-pay-button svg {
  width: 18px;
  height: 18px;
  transition: transform 220ms ease;
}

.tp-pay-button:hover svg {
  transform: translateX(5px);
}

.tp-pay-button__security {
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #55514d;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tp-pay-button__security svg {
  width: 11px;
  height: 11px;
}

.tp-submit-message {
  margin: 18px 0 0;
  padding: 13px 16px;
  border: 1px solid rgba(203, 170, 110, 0.25);
  background: rgba(203, 170, 110, 0.045);
  color: #c7c0b5;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

.tp-payment-aside {
  position: sticky;
  top: calc(var(--navbar-height, 78px) + 34px);
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 42px;
}

.tp-summary-card {
  padding: 31px 27px 25px;
  border: 1px solid rgba(203, 170, 110, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(203, 170, 110, 0.025), transparent 44%),
    #10110f;
  box-shadow:
    0 22px 60px rgba(0, 0, 0, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.015);
}

.tp-summary-card h2 {
  margin: 0 0 27px;
  color: #dfdad1;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 33px;
  font-weight: 500;
}

.tp-summary-card__items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tp-summary-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.tp-summary-item > div {
  min-width: 0;
}

.tp-summary-item strong,
.tp-summary-item span {
  display: block;
}

.tp-summary-item strong {
  color: #c9c3ba;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
}

.tp-summary-item span {
  margin-top: 3px;
  color: #77716a;
  font-size: 14px;
  line-height: 1.5;
}

.tp-summary-item p {
  margin: 0;
  flex: 0 0 auto;
  color: #b9b2a8;
  font-size: 14px;
  white-space: nowrap;
}

.tp-summary-card__calculation {
  display: flex;
  margin-top: 29px;
  padding: 21px 0;
  flex-direction: column;
  gap: 13px;
  border-top: 1px solid var(--tp-border-soft);
  border-bottom: 1px solid var(--tp-border-soft);
}

.tp-summary-card__calculation > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.tp-summary-card__calculation span,
.tp-summary-card__calculation strong {
  color: #918b83;
  font-size: 14px;
  font-weight: 400;
}

.tp-summary-card__calculation strong.is-gold {
  color: var(--tp-gold);
  font-family: "DM Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.07em;
}

.tp-summary-card__total {
  display: flex;
  margin-top: 22px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.tp-summary-card__total > span {
  color: #d8d2c8;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.tp-summary-card__total > div {
  text-align: right;
}

.tp-summary-card__total strong,
.tp-summary-card__total small {
  display: block;
}

.tp-summary-card__total strong {
  color: var(--tp-gold);
  font-family: "Playfair Display", Georgia, serif;
  font-size: 31px;
  font-weight: 500;
  white-space: nowrap;
}

.tp-summary-card__total small {
  margin-top: 4px;
  color: #716c65;
  font-size: 14px;
}

.tp-next-steps {
  padding: 28px 26px;
  border: 1px solid var(--tp-border-soft);
  border-radius: 8px;
  background: #171916;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
}

.tp-next-steps__eyebrow {
  margin: 0 0 27px;
  color: #b2ada5;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.tp-next-steps__list {
  position: relative;
  display: flex;
  margin: 0;
  padding: 0;
  flex-direction: column;
  gap: 23px;
  list-style: none;
}

.tp-next-steps__list::before {
  position: absolute;
  top: 15px;
  bottom: 15px;
  left: 10px;
  width: 1px;
  background: rgba(255, 255, 255, 0.12);
  content: "";
}

.tp-next-steps__list li {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 21px minmax(0, 1fr);
  align-items: flex-start;
  gap: 13px;
}

.tp-next-steps__marker {
  display: inline-flex;
  width: 21px;
  height: 21px;
  align-items: center;
  justify-content: center;
  border: 1px solid #41413d;
  border-radius: 999px;
  background: #171916;
  color: #77736d;
}

.tp-next-steps__marker svg {
  width: 10px;
  height: 10px;
}

.tp-next-steps__list li.is-active .tp-next-steps__marker {
  border-color: var(--tp-gold);
  background: var(--tp-gold);
  color: #17130c;
  box-shadow: 0 0 20px rgba(203, 170, 110, 0.22);
}

.tp-next-steps__list strong {
  display: block;
  color: #cbc5bb;
  font-size: 14px;
  font-weight: 500;
}

.tp-next-steps__list p {
  margin: 4px 0 0;
  color: #858078;
  font-size: 14px;
  line-height: 1.6;
}

.tp-payment-quote {
  max-width: 315px;
  margin: 0 auto;
  color: #77736d;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 15px;
  font-style: normal;
  line-height: 1.6;
  text-align: center;
}

.tp-reveal {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(7px);
  transition:
    opacity 760ms cubic-bezier(0.2, 0.72, 0.22, 1),
    transform 760ms cubic-bezier(0.2, 0.72, 0.22, 1),
    filter 760ms cubic-bezier(0.2, 0.72, 0.22, 1);
  transition-delay: var(--tp-reveal-delay, 0ms);
}

.tp-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

@media (max-width: 1080px) {
  .tp-payment-shell {
    width: min(860px, calc(100% - 48px));
  }

  .tp-payment-layout {
    grid-template-columns: 1fr;
    gap: 64px;
  }

  .tp-payment-aside {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 24px;
  }

  .tp-mobile-summary {
    display: block;
    margin-top: 42px;
  }

  .tp-desktop-summary {
    display: none;
  }

  .tp-payment-quote {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .tp-payment-shell {
    width: min(100%, calc(100% - 32px));
    padding: 54px 0 72px;
  }

  .tp-payment-header {
    margin-bottom: 48px;
  }

  .tp-billing-grid,
  .tp-method-grid,
  .tp-payment-aside {
    grid-template-columns: 1fr;
  }

  .tp-field--full,
  .tp-payment-quote {
    grid-column: auto;
  }

  .tp-method-card {
    min-height: 132px;
  }

  .tp-payment-hints {
    gap: 14px;
  }

  .tp-summary-card__total {
    align-items: flex-start;
    flex-direction: column;
  }

  .tp-summary-card__total > div {
    text-align: left;
  }
}

@media (max-width: 420px) {
  .tp-payment-shell {
    width: min(100%, calc(100% - 24px));
  }

  .tp-payment-header h1 {
    font-size: 42px;
  }

  .tp-section__heading h2 {
    font-size: 25px;
  }

  .tp-method-card,
  .tp-summary-card,
  .tp-next-steps {
    padding-right: 19px;
    padding-left: 19px;
  }

  .tp-pay-button {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tp-reveal,
  .tp-glow-button,
  .tp-pay-button,
  .tp-method-card,
  .tp-pay-button svg {
    transition: none !important;
  }

  .tp-reveal {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
`;

const STORAGE_KEY = "mahreen:service-package-selection";
const LEGACY_STORAGE_KEY = "mahreen:website-package-selection";

const fallbackSelection: WebsitePackageSelection = {
  category: "Website Solutions",
  tier: {
    id: "business",
    tier: "Tier 02",
    name: "Good Package",
    price: 2_500_000,
  },
  addOns: [],
  total: 2_500_000,
};

const getStoredSelection = (): WebsitePackageSelection => {
  if (typeof window === "undefined") return fallbackSelection;

  try {
    const rawSelection =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (!rawSelection) return fallbackSelection;

    const parsed = JSON.parse(rawSelection) as Partial<WebsitePackageSelection>;
    const tier = parsed.tier;

    if (
      !tier ||
      typeof tier.name !== "string" ||
      typeof tier.price !== "number"
    ) {
      return fallbackSelection;
    }

    const addOns = Array.isArray(parsed.addOns)
      ? parsed.addOns.filter(
          (addOn): addOn is WebsitePackageSelection["addOns"][number] =>
            Boolean(
              addOn &&
                typeof addOn.title === "string" &&
                typeof addOn.priceValue === "number",
            ),
        )
      : [];

    const calculatedTotal =
      tier.price + addOns.reduce((sum, addOn) => sum + addOn.priceValue, 0);

    return {
      category:
        typeof parsed.category === "string"
          ? parsed.category
          : fallbackSelection.category,
      tier,
      addOns,
      total:
        typeof parsed.total === "number" && Number.isFinite(parsed.total)
          ? parsed.total
          : calculatedTotal,
      updatedAt:
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
    };
  } catch {
    return fallbackSelection;
  }
};

const Pembayaran = () => {
  const [selection] = useState<WebsitePackageSelection>(getStoredSelection);
  const [billingInformation, setBillingInformation] =
    useState<BillingInformationValue>({
      fullName: "",
      companyName: "",
      invoiceAddress: "",
    });
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodId>("bank-transfer");
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentDetailsValue>(DEFAULT_PAYMENT_DETAILS);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BillingInformationValue, string>>
  >({});
  const [submitMessage, setSubmitMessage] = useState("");

  const total = useMemo(
    () =>
      selection.total ||
      selection.tier.price +
        selection.addOns.reduce((sum, addOn) => sum + addOn.priceValue, 0),
    [selection],
  );

  const handleBillingChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.target.name as keyof BillingInformationValue;
    const nextValue = event.target.value;

    setBillingInformation((current) => ({
      ...current,
      [fieldName]: nextValue,
    }));
    setErrors((current) => ({ ...current, [fieldName]: undefined }));
    setSubmitMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<
      Record<keyof BillingInformationValue, string>
    > = {};

    if (!billingInformation.fullName.trim()) {
      nextErrors.fullName = "Nama lengkap wajib diisi.";
    }

    if (!billingInformation.invoiceAddress.trim()) {
      nextErrors.invoiceAddress = "Alamat penerimaan invoice wajib diisi.";
    }

    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0] as
      | keyof BillingInformationValue
      | undefined;

    if (firstError) {
      const fieldId =
        firstError === "fullName"
          ? "billing-full-name"
          : "billing-invoice-address";
      document.getElementById(fieldId)?.focus();
      return;
    }

    createAndSavePaymentDraft({
      selection,
      billingInformation,
      selectedMethod,
      paymentDetails,
      total,
    });

    navigateToRoute("/tanya-mahreen/pembayaran/konfirmasi");
  };

  return (
    <>
      <style>{PEMBAYARAN_STYLES}</style>
      <TanyaMahreenNavbar />

      <main className="tp-payment-page">
        <div className="tp-payment-shell">
          <div className="tp-payment-layout">
            <form className="tp-payment-main" onSubmit={handleSubmit} noValidate>
              <Reveal>
                <header className="tp-payment-header">
                  <p>Proses Checkout</p>
                  <h1>Pembayaran Aman</h1>
                  <span>
                    Lengkapi informasi Anda untuk melanjutkan pemesanan layanan
                    {` ${selection.category ?? "Website Solutions"}`} bersama Tanya Mahreen.
                  </span>
                </header>
              </Reveal>

              <Reveal delay={90}>
                <BillingInformation
                  value={billingInformation}
                  errors={errors}
                  onChange={handleBillingChange}
                />
              </Reveal>

              <Reveal delay={130}>
                <PaymentMethods
                  selectedMethod={selectedMethod}
                  details={paymentDetails}
                  onSelect={(method) => {
                    setSelectedMethod(method);
                    setSubmitMessage("");
                  }}
                  onDetailsChange={(details) => {
                    setPaymentDetails(details);
                    setSubmitMessage("");
                  }}
                />
              </Reveal>

              <div className="tp-mobile-summary">
                <OrderSummary selection={selection} />
              </div>

              <Reveal delay={170}>
                <button
                  type="submit"
                  className="tp-pay-button tp-glow-button"
                >
                  <span>Bayar Sekarang</span>
                  <ArrowRight aria-hidden="true" />
                </button>

                <div className="tp-pay-button__security">
                  <LockKeyhole aria-hidden="true" />
                  <span>Transaksi tersimpan secara aman</span>
                </div>

                {submitMessage && (
                  <p className="tp-submit-message" role="status">
                    {submitMessage}
                  </p>
                )}
              </Reveal>
            </form>

            <div className="tp-payment-aside">
              <div className="tp-desktop-summary">
                <Reveal delay={100}>
                  <OrderSummary selection={selection} />
                </Reveal>
              </div>

              <Reveal delay={180}>
                <NextStepsInfo />
              </Reveal>

              <Reveal delay={220}>
                <blockquote className="tp-payment-quote">
                  “Tanya Mahreen memberikan standar baru dalam eksekusi visual
                  untuk brand kami.”
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <ClosingSection />
      <Footer />
    </>
  );
};

export default Pembayaran;
