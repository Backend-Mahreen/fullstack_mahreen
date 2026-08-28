import { useState, type FormEvent } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth/authService";
import { navigateToRoute } from "../../utils/hashNavigation";
import PersonalInformationCard from "./components/PersonalInformationCard";
import ProfessionalProfileCard from "./components/ProfessionalProfileCard";
import ProfileFormActions from "./components/ProfileFormActions";
import ProfileIdentityHeader from "./components/ProfileIdentityHeader";
import ProfileImageCropper from "./components/ProfileImageCropper";
import ResidentialAddressCard from "./components/ResidentialAddressCard";
import ClientAccountLayout from "./components/ClientAccountLayout";
import type { ProfileEditForm, ProfileFieldChange } from "./components/profileFormTypes";

const styles = `
  body.profile-editor-body-legacy {
    --profile-sidebar-width: 260px;
    --profile-sidebar-gap: 0px;
    --profile-gold: #d4b45f;
    --profile-gold-bright: #edcd7d;
    min-height: 100%;
    overflow-x: hidden !important;
    background: #000 !important;
    transition: padding 260ms cubic-bezier(.22,1,.36,1);
  }

  body.profile-editor-body-legacy.profile-sidebar-collapsed-legacy {
    --profile-sidebar-width: 78px;
  }

  body.profile-editor-body-legacy .site-header {
    left: var(--profile-sidebar-width) !important;
    width: calc(100% - var(--profile-sidebar-width)) !important;
    max-width: calc(100% - var(--profile-sidebar-width)) !important;
    transition: left 260ms cubic-bezier(.22,1,.36,1), width 260ms cubic-bezier(.22,1,.36,1), max-width 260ms cubic-bezier(.22,1,.36,1);
  }

  body.profile-editor-body-legacy .navbar {
    padding-inline: 28px;
  }

  .profile-editor-page,
  .profile-editor-page *,
  .profile-editor-page *::before,
  .profile-editor-page *::after {
    box-sizing: border-box;
  }

  .profile-editor-page {
    --profile-gold: #d4b45f;
    --profile-gold-bright: #edcd7d;
    --profile-card: #141414;
    --profile-border: #292929;
    --profile-muted: #8d8983;
    width: calc(100% - var(--profile-sidebar-width, 260px));
    min-width: 0;
    min-height: 100svh;
    margin-left: var(--profile-sidebar-width, 260px);
    padding: 112px 32px 78px;
    overflow-x: hidden;
    color: #eeeae4;
    background: #000;
    font-family: Inter, "Segoe UI", Arial, sans-serif;
    transition: width 260ms cubic-bezier(.22,1,.36,1), margin-left 260ms cubic-bezier(.22,1,.36,1);
  }

  .profile-editor-main {
    width: min(100%, 900px);
    margin: 0 auto;
  }

  .profile-editor-form {
    display: grid;
    gap: 24px;
  }

  .profile-editor-sidebar-legacy {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 1200;
    display: flex;
    width: var(--profile-sidebar-width, 260px);
    max-width: var(--profile-sidebar-width, 260px);
    min-width: var(--profile-sidebar-width, 260px);
    height: 100dvh;
    min-height: 100dvh;
    overflow: hidden;
    color: #ddd5cb;
    background: #24211e;
    border-right: 1px solid rgba(255,255,255,.05);
    box-shadow: 18px 0 42px rgba(0,0,0,.22);
    transition: width 260ms cubic-bezier(.22,1,.36,1), min-width 260ms cubic-bezier(.22,1,.36,1), max-width 260ms cubic-bezier(.22,1,.36,1), transform 280ms cubic-bezier(.22,1,.36,1);
  }

  .profile-editor-sidebar-legacy__panel {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 0;
    flex-direction: column;
    overflow: hidden;
    touch-action: auto;
  }

  .profile-editor-sidebar-legacy__panel::-webkit-scrollbar { width: 5px; }
  .profile-editor-sidebar-legacy__panel::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(237,205,125,.28);
  }

  .profile-editor-sidebar-legacy__brand {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 0 0 auto;
    min-height: 94px;
    padding: 20px 18px 17px 22px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    background: #24211e;
    border-bottom: 1px solid rgba(255,255,255,.05);
    box-shadow: 0 10px 24px rgba(0,0,0,.12);
  }

  .profile-editor-sidebar-legacy__brand-copy {
    display: grid;
    min-width: 0;
    gap: 5px;
    overflow: hidden;
    transition: opacity 180ms ease, width 220ms ease, transform 220ms ease;
  }

  .profile-editor-sidebar-legacy__brand strong {
    color: var(--profile-gold-bright);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.05;
    white-space: nowrap;
  }

  .profile-editor-sidebar-legacy__brand span {
    color: #a9a097;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 14px;
    line-height: 1.1;
    white-space: nowrap;
  }

  .profile-editor-sidebar-legacy__toggle {
    display: grid;
    place-items: center;
    border: 1px solid rgba(237,205,125,.25);
    color: var(--profile-gold-bright);
    background: rgba(10,10,10,.28);
    cursor: pointer;
    transition: background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
  }

  .profile-editor-sidebar-legacy__toggle {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 9px;
  }

  .profile-editor-sidebar-legacy__toggle:hover,
  .profile-editor-sidebar-legacy__toggle:focus-visible {
    border-color: rgba(237,205,125,.7);
    background: rgba(237,205,125,.1);
    transform: translateY(-1px);
    outline: none;
  }

  .profile-editor-sidebar-legacy__toggle svg {
    width: 18px;
    height: 18px;
  }

  .profile-editor-sidebar-legacy__toggle-mobile,
  .profile-editor-sidebar-legacy__backdrop {
    display: none;
  }

  .profile-editor-sidebar-legacy__nav {
    display: grid;
    flex: 1 1 auto;
    min-height: 0;
    padding-top: 5px;
    align-content: start;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    scrollbar-color: rgba(237,205,125,.32) transparent;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }

  .profile-editor-sidebar-legacy__link,
  .profile-editor-sidebar-legacy__logout {
    display: flex;
    width: 100%;
    min-height: 54px;
    padding: 0 22px;
    align-items: center;
    gap: 13px;
    border: 0;
    border-left: 2px solid transparent;
    color: #c9c1b8;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    white-space: nowrap;
    transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
  }

  .profile-editor-sidebar-legacy__link svg,
  .profile-editor-sidebar-legacy__logout svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    stroke-width: 1.8;
  }

  .profile-editor-sidebar-legacy__link:hover,
  .profile-editor-sidebar-legacy__link:focus-visible,
  .profile-editor-sidebar-legacy__logout:hover,
  .profile-editor-sidebar-legacy__logout:focus-visible {
    color: var(--profile-gold-bright);
    background: rgba(255,255,255,.035);
    border-left-color: rgba(237,205,125,.6);
  }

  .profile-editor-sidebar-legacy__link.is-active {
    color: var(--profile-gold-bright);
    background: rgba(255,255,255,.045);
    border-left-color: var(--profile-gold-bright);
  }

  .profile-editor-sidebar-legacy__link {
    opacity: 0;
    transform: translate3d(-8px,0,0);
    animation: profile-sidebar-link-in 420ms cubic-bezier(.22,1,.36,1) both;
  }

  .profile-editor-sidebar-legacy__link:nth-child(1) { animation-delay: 170ms; }
  .profile-editor-sidebar-legacy__link:nth-child(2) { animation-delay: 220ms; }
  .profile-editor-sidebar-legacy__link:nth-child(3) { animation-delay: 270ms; }
  .profile-editor-sidebar-legacy__link:nth-child(4) { animation-delay: 320ms; }
  .profile-editor-sidebar-legacy__link:nth-child(5) { animation-delay: 370ms; }
  .profile-editor-sidebar-legacy__link:nth-child(6) { animation-delay: 420ms; }
  .profile-editor-sidebar-legacy__link:nth-child(7) { animation-delay: 470ms; }
  .profile-editor-sidebar-legacy__link:nth-child(8) { animation-delay: 520ms; }

  .profile-editor-sidebar-legacy__link:hover svg,
  .profile-editor-sidebar-legacy__link:focus-visible svg {
    transform: translateX(2px) scale(1.06);
    color: var(--profile-gold-bright);
  }

  .profile-editor-sidebar-legacy__link svg { transition: transform 180ms ease, color 180ms ease; }

  .profile-editor-sidebar-legacy__bottom {
    display: grid;
    flex: 0 0 auto;
    margin-top: 0;
    padding: 20px 20px max(20px, env(safe-area-inset-bottom));
    gap: 14px;
    background: #24211e;
    border-top: 1px solid rgba(255,255,255,.045);
  }

  .profile-editor-sidebar-legacy__logout {
    min-height: 46px;
    padding: 0 6px;
    color: #d8a69d;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }

  .profile-editor-sidebar-legacy__account {
    display: flex;
    min-width: 0;
    padding: 10px 9px;
    align-items: center;
    gap: 12px;
    border: 1px solid rgba(255,255,255,.055);
    border-radius: 12px;
    background: rgba(255,255,255,.025);
    transition: padding 220ms ease, background-color 180ms ease, border-color 180ms ease;
  }

  .profile-editor-sidebar-legacy__account:hover {
    border-color: rgba(237,205,125,.2);
    background: rgba(237,205,125,.045);
  }

  .profile-editor-sidebar-legacy__account-avatar {
    display: grid;
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgba(212,180,95,.52);
    border-radius: 50%;
    color: var(--profile-gold-bright);
    background: rgba(212,180,95,.08);
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .04em;
    transition: width 220ms ease, height 220ms ease, flex-basis 220ms ease;
  }

  .profile-editor-sidebar-legacy__account-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-editor-sidebar-legacy__account-copy {
    display: grid;
    min-width: 0;
    transition: opacity 160ms ease, width 220ms ease;
  }

  .profile-editor-sidebar-legacy__account strong,
  .profile-editor-sidebar-legacy__account small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .profile-editor-sidebar-legacy__account strong {
    color: #e8e2da;
    font-size: 14px;
    font-weight: 700;
  }

  .profile-editor-sidebar-legacy__account small {
    margin-top: 5px;
    color: #8b847c;
    font-size: 14px;
    letter-spacing: .04em;
  }

  @media (min-width: 901px) {
    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__brand {
      padding-inline: 21px;
      justify-content: center;
    }

    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__brand-copy,
    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__link span,
    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__logout span,
    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__account-copy {
      width: 0;
      opacity: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__link,
    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__logout {
      justify-content: center;
      padding-inline: 0;
      gap: 0;
    }

    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__link svg,
    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__logout svg {
      width: 20px;
      height: 20px;
    }

    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__bottom {
      padding-inline: 10px;
    }

    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__account {
      justify-content: center;
      padding: 8px 5px;
      border-color: transparent;
      background: transparent;
    }

    .profile-editor-sidebar-legacy.is-collapsed .profile-editor-sidebar-legacy__account-avatar {
      width: 42px;
      height: 42px;
      flex-basis: 42px;
    }
  }

  .profile-editor-identity {
    display: flex;
    min-width: 0;
    margin: 0 0 34px;
    padding-left: 2px;
    align-items: center;
    gap: 22px;
  }

  .profile-editor-identity__avatar-wrap {
    position: relative;
    width: 108px;
    height: 108px;
    flex: 0 0 108px;
    padding: 5px;
    border: 1px solid rgba(212,180,95,.44);
    border-radius: 50%;
    background: rgba(212,180,95,.035);
    box-shadow: 0 0 0 0 rgba(212,180,95,.22);
    animation: profile-avatar-glow 920ms 320ms ease-out both;
  }

  .profile-editor-identity__avatar {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-editor-identity__avatar--fallback {
    display: grid;
    place-items: center;
    color: var(--profile-gold-bright);
    background:
      radial-gradient(circle at 34% 28%, rgba(237,205,125,.16), transparent 44%),
      #15130f;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: .06em;
    user-select: none;
  }

  .profile-editor-identity__photo-button {
    position: absolute;
    right: -1px;
    bottom: 7px;
    display: grid;
    width: 27px;
    height: 27px;
    place-items: center;
    border: 1px solid #59491f;
    border-radius: 50%;
    color: #392b0e;
    background: var(--profile-gold-bright);
    cursor: pointer;
  }

  .profile-editor-identity__photo-button svg {
    width: 12px;
    height: 12px;
  }

  .profile-editor-identity__photo-button input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .profile-editor-identity__copy {
    min-width: 0;
  }

  .profile-editor-identity__name-row {
    display: flex;
    min-width: 0;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .profile-editor-identity h1 {
    margin: 0;
    overflow-wrap: anywhere;
    color: #e9e5de;
    font-size: 24px;
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  .profile-editor-verified {
    display: inline-flex;
    min-height: 20px;
    padding: 0 8px;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(212,180,95,.27);
    border-radius: 999px;
    color: var(--profile-gold-bright);
    background: rgba(212,180,95,.09);
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  .profile-editor-verified svg {
    width: 10px;
    height: 10px;
  }

  .profile-editor-id {
    margin: 8px 0 0;
    color: #b59a55;
    font-family: "Courier New", monospace;
    font-size: 14px;
    letter-spacing: .07em;
  }

  .profile-editor-member {
    margin: 7px 0 0;
    color: #8a8680;
    font-size: 14px;
  }

  .profile-editor-card {
    position: relative;
    width: 100%;
    padding: 28px 30px 30px;
    overflow: hidden;
    border: 1px solid var(--profile-border);
    border-radius: 18px;
    background: var(--profile-card);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.012);
    transition: transform 260ms cubic-bezier(.22,1,.36,1), border-color 260ms ease, box-shadow 260ms ease;
  }

  .profile-editor-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(112deg, transparent 0 43%, rgba(255,255,255,.04) 50%, transparent 57%);
    background-size: 230% 100%;
    background-position: 120% 0;
    opacity: 0;
    animation: profile-card-sheen 920ms calc(250ms + (var(--profile-card-index, 0) * 90ms)) ease-out both;
  }

  .profile-editor-card[data-profile-reveal="2"] { --profile-card-index: 1; }
  .profile-editor-card[data-profile-reveal="3"] { --profile-card-index: 2; }
  .profile-editor-card[data-profile-reveal="4"] { --profile-card-index: 3; }

  .profile-editor-card:hover {
    border-color: rgba(212,180,95,.26);
    box-shadow: 0 18px 44px -30px rgba(212,180,95,.32), inset 0 1px 0 rgba(255,255,255,.02);
    transform: translateY(-3px);
  }

  .profile-editor-card__title {
    display: flex;
    margin: 0 0 25px;
    align-items: center;
    gap: 9px;
    color: #bcb7b0;
    font-size: 14px;
    font-weight: 500;
  }

  .profile-editor-card__title svg {
    width: 17px;
    height: 17px;
    color: var(--profile-gold);
    stroke-width: 1.8;
  }

  .profile-editor-grid {
    display: grid;
    min-width: 0;
    gap: 17px 18px;
  }

  .profile-editor-card .profile-editor-field {
    opacity: 0;
    transform: translate3d(0,10px,0);
    animation: profile-field-in 500ms cubic-bezier(.22,1,.36,1) both;
  }

  .profile-editor-card .profile-editor-field:nth-child(1) { animation-delay: 360ms; }
  .profile-editor-card .profile-editor-field:nth-child(2) { animation-delay: 410ms; }
  .profile-editor-card .profile-editor-field:nth-child(3) { animation-delay: 460ms; }
  .profile-editor-card .profile-editor-field:nth-child(4) { animation-delay: 510ms; }
  .profile-editor-card .profile-editor-field:nth-child(5) { animation-delay: 560ms; }

  .profile-editor-grid--two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-editor-field {
    display: grid;
    min-width: 0;
    gap: 8px;
  }

  .profile-editor-field--wide {
    grid-column: 1 / -1;
  }

  .profile-editor-field--half {
    grid-column: span 1;
  }

  .profile-editor-field > span:first-child {
    color: #89847e;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .025em;
    text-transform: uppercase;
  }

  .profile-editor-field input,
  .profile-editor-field select,
  .profile-editor-field textarea {
    width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: 0 15px;
    border: 1px solid #d6d6d6;
    border-radius: 9px;
    outline: 0;
    color: #242424;
    background: #f5f5f5;
    font: inherit;
    font-size: 14px;
    transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
  }

  .profile-editor-field input::placeholder,
  .profile-editor-field textarea::placeholder {
    color: #c3c3c3;
  }

  .profile-editor-field input:focus,
  .profile-editor-field select:focus,
  .profile-editor-field textarea:focus {
    border-color: var(--profile-gold-bright);
    box-shadow: 0 0 0 3px rgba(212,180,95,.09);
    background: #fff;
  }

  .profile-editor-field input:disabled {
    color: #c8c8c8;
    background: #fbfbfb;
    cursor: not-allowed;
  }

  .profile-editor-field select {
    border-color: #262626;
    color: #d3cec7;
    background: #0d0d0d;
  }

  .profile-editor-field textarea {
    min-height: 82px;
    padding-top: 13px;
    padding-bottom: 13px;
    resize: vertical;
    border-color: #272727;
    color: #c9c5bf;
    background: #0e0e0e;
    line-height: 1.55;
  }

  .profile-editor-input-with-badge,
  .profile-editor-phone,
  .profile-editor-link-input {
    position: relative;
    display: flex;
    min-width: 0;
    align-items: center;
  }

  .profile-editor-input-with-badge small {
    position: absolute;
    right: 11px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    color: #c9ad64;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .profile-editor-input-with-badge small svg {
    width: 9px;
    height: 9px;
  }

  .profile-editor-input-with-badge input {
    padding-right: 72px;
  }

  .profile-editor-phone {
    --phone-accent: #e2bf67;
    --phone-dropdown-bg: #11100e;
    --phone-dropdown-border: rgba(226,191,103,.48);
    min-height: 46px;
    overflow: visible;
    border: 1px solid #38342c;
    border-radius: 9px;
    color: #f0ebe3;
    background: #0d0d0d;
    font-size: 14px;
  }

  .profile-editor-phone.international-phone-input:hover {
    border-color: rgba(226,191,103,.54);
    background: #11100e;
  }

  .profile-editor-phone.international-phone-input.PhoneInput--focus {
    background: #12110e;
  }

  .profile-editor-phone .international-phone-input__country-trigger {
    border-right-color: rgba(226,191,103,.24);
    color: #f2d17b;
    background: rgba(226,191,103,.105);
  }

  .profile-editor-phone .international-phone-input__country-code {
    color: #f0cf79;
    font-weight: 750;
  }

  .profile-editor-phone .international-phone-input__country-chevron {
    color: #d7c18a;
    opacity: .9;
  }

  .profile-editor-phone .PhoneInputInput {
    color: #f4f0e9 !important;
    caret-color: #e7c877;
  }

  .profile-editor-phone .PhoneInputInput::placeholder {
    color: #918b83 !important;
    opacity: 1;
  }

  .profile-editor-link-input > svg {
    position: absolute;
    left: 13px;
    z-index: 1;
    width: 13px;
    height: 13px;
    color: #bebebe;
  }

  .profile-editor-link-input input {
    padding-left: 37px;
  }

  .profile-editor-actions {
    display: flex;
    margin-top: -1px;
    justify-content: flex-end;
    gap: 14px;
  }

  .profile-editor-button {
    display: inline-flex;
    min-width: 112px;
    min-height: 46px;
    padding: 0 22px;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid #252525;
    border-radius: 9px;
    color: #aaa59e;
    background: #050505;
    font-size: 14px;
    font-weight: 600;
    transition: transform 160ms ease, border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
  }

  .profile-editor-button svg {
    width: 13px;
    height: 13px;
  }

  .profile-editor-button:hover:not(:disabled),
  .profile-editor-button:focus-visible:not(:disabled) {
    transform: translateY(-2px);
  }

  .profile-editor-button--primary {
    min-width: 164px;
    border-color: #e7c877;
    color: #2b220f;
    background: linear-gradient(135deg,#efd184,#dbb966);
    box-shadow: 0 8px 20px rgba(212,180,95,.12);
  }

  .profile-editor-button:disabled {
    opacity: .55;
    cursor: wait;
  }

  .profile-editor-feedback {
    display: flex;
    margin: 0;
    padding: 13px 15px;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(212,180,95,.23);
    border-radius: 10px;
    color: #d7c18c;
    background: rgba(212,180,95,.07);
    font-size: 14px;
    animation: profile-feedback-in 320ms ease both;
  }

  .profile-editor-feedback.is-error {
    border-color: rgba(222,94,94,.28);
    color: #e3a0a0;
    background: rgba(222,94,94,.06);
  }

  .profile-editor-feedback svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  .profile-editor-page [data-profile-reveal] {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    animation: profile-component-in 690ms cubic-bezier(.22,1,.36,1) both;
  }

  .profile-editor-page [data-profile-reveal="1"] { animation-delay: 90ms; }
  .profile-editor-page [data-profile-reveal="2"] { animation-delay: 160ms; }
  .profile-editor-page [data-profile-reveal="3"] { animation-delay: 230ms; }
  .profile-editor-page [data-profile-reveal="4"] { animation-delay: 300ms; }
  .profile-editor-page [data-profile-reveal="5"] { animation-delay: 370ms; }

  .profile-editor-sidebar-legacy[data-profile-reveal="sidebar"] {
    opacity: 0;
    transform: translate3d(-18px,0,0);
    animation: profile-sidebar-in 620ms cubic-bezier(.22,1,.36,1) 40ms both;
  }

  @keyframes profile-component-in {
    from { opacity: 0; transform: translate3d(0,18px,0); }
    to { opacity: 1; transform: none; }
  }

  @keyframes profile-sidebar-in {
    from { opacity: 0; transform: translate3d(-18px,0,0); }
    to { opacity: 1; transform: none; }
  }

  @keyframes profile-feedback-in {
    from { opacity: 0; transform: translate3d(0,8px,0); }
    to { opacity: 1; transform: none; }
  }

  @keyframes profile-card-sheen {
    0% { opacity: 0; background-position: 120% 0; }
    18% { opacity: 1; }
    100% { opacity: 0; background-position: -120% 0; }
  }

  @keyframes profile-sidebar-link-in {
    from { opacity: 0; transform: translate3d(-8px,0,0); }
    to { opacity: 1; transform: none; }
  }

  @keyframes profile-avatar-glow {
    0% { box-shadow: 0 0 0 0 rgba(212,180,95,.26); transform: scale(.94); }
    65% { box-shadow: 0 0 0 12px rgba(212,180,95,0); transform: scale(1.025); }
    100% { box-shadow: 0 0 0 0 rgba(212,180,95,0); transform: scale(1); }
  }

  @keyframes profile-field-in {
    from { opacity: 0; transform: translate3d(0,10px,0); }
    to { opacity: 1; transform: none; }
  }


  .profile-cropper {
    position: fixed;
    inset: 0;
    z-index: 2600;
    display: grid;
    place-items: center;
    padding: 22px;
    background: rgba(0,0,0,.78);
    backdrop-filter: blur(12px);
    animation: profile-cropper-backdrop-in 240ms ease both;
  }

  .profile-cropper__dialog {
    width: min(100%, 520px);
    padding: 24px;
    border: 1px solid rgba(237,205,125,.22);
    border-radius: 22px;
    color: #eeeae4;
    background: linear-gradient(165deg,#1c1a19,#0e0e0e 72%);
    box-shadow: 0 30px 90px rgba(0,0,0,.65);
    animation: profile-cropper-dialog-in 420ms cubic-bezier(.22,1,.36,1) both;
  }

  .profile-cropper__header { display:flex; justify-content:space-between; gap:18px; margin-bottom:20px; }
  .profile-cropper__header span { color:var(--profile-gold-bright); font-size:14px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
  .profile-cropper__header h2 { margin:5px 0 0; font-size:22px; }
  .profile-cropper__header p { max-width:330px; margin:6px 0 0; overflow:hidden; color:#77736d; font-size:14px; text-overflow:ellipsis; white-space:nowrap; }
  .profile-cropper__header button { display:grid; width:34px; height:34px; place-items:center; border:1px solid rgba(255,255,255,.1); border-radius:50%; color:#ddd7cf; background:#151515; cursor:pointer; }
  .profile-cropper__header svg { width:15px; }

  .profile-cropper__stage {
    position:relative;
    width:min(100%, 360px);
    aspect-ratio:1;
    margin:0 auto;
    overflow:hidden;
    border-radius:16px;
    background:#070707;
    touch-action:none;
    user-select:none;
  }
  .profile-cropper__canvas { display:block; width:100%; height:100%; cursor:grab; touch-action:none; }
  .profile-cropper__canvas:active { cursor:grabbing; }
  .profile-cropper__mask { position:absolute; inset:0; pointer-events:none; border-radius:16px; background:radial-gradient(circle at center, transparent 0 49.2%, rgba(0,0,0,.58) 50% 100%); }
  .profile-cropper__guide { position:absolute; inset:1.4%; pointer-events:none; border:1px solid rgba(255,255,255,.52); border-radius:50%; box-shadow:0 0 0 1px rgba(0,0,0,.35); }

  .profile-cropper__controls { display:flex; margin-top:20px; align-items:end; gap:14px; }
  .profile-cropper__controls label { display:grid; flex:1; gap:8px; color:#9d9891; font-size:14px; }
  .profile-cropper__controls input { width:100%; accent-color:var(--profile-gold-bright); }
  .profile-cropper__reset { display:inline-flex; min-height:34px; padding:0 12px; align-items:center; gap:7px; border:1px solid rgba(255,255,255,.1); border-radius:9px; color:#c9c3bb; background:#151515; cursor:pointer; }
  .profile-cropper__reset svg { width:13px; }
  .profile-cropper__actions { display:flex; justify-content:flex-end; gap:10px; margin-top:22px; }
  .profile-cropper__actions button { min-height:42px; padding:0 18px; border-radius:10px; font-weight:700; cursor:pointer; }
  .profile-cropper__cancel { border:1px solid rgba(255,255,255,.12); color:#d5d0c8; background:transparent; }
  .profile-cropper__apply { display:inline-flex; align-items:center; gap:8px; border:1px solid #e7c877; color:#2b220f; background:linear-gradient(135deg,#efd184,#dbb966); }
  .profile-cropper__apply svg { width:15px; }

  @keyframes profile-cropper-backdrop-in { from { opacity:0; } to { opacity:1; } }
  @keyframes profile-cropper-dialog-in { from { opacity:0; transform:translate3d(0,24px,0) scale(.96); } to { opacity:1; transform:none; } }

  @media (max-width: 900px) {
    body.profile-editor-body-legacy,
    body.profile-editor-body-legacy.profile-sidebar-collapsed-legacy {
      --profile-sidebar-width: 0px;
    }

    html.profile-mobile-sidebar-open-legacy,
    body.profile-editor-body-legacy.profile-mobile-sidebar-open-legacy {
      height: 100%;
      overflow: hidden !important;
      overscroll-behavior: none;
    }

    body.profile-editor-body-legacy .site-header {
      left: 0 !important;
      z-index: 1800 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    body.profile-editor-body-legacy .navbar {
      padding-inline: 14px;
    }

    .profile-editor-sidebar-legacy,
    .profile-editor-sidebar-legacy[data-profile-reveal="sidebar"] {
      inset: var(--navbar-height, 74px) auto 0 0;
      z-index: 1700;
      width: min(86vw, 320px);
      min-width: min(86vw, 320px);
      max-width: min(86vw, 320px);
      height: calc(100dvh - var(--navbar-height, 74px));
      min-height: 0;
      overflow: hidden;
      opacity: 1;
      visibility: hidden;
      transform: translate3d(-104%,0,0);
      pointer-events: none;
      animation: none;
      box-shadow: 22px 0 60px rgba(0,0,0,.52);
    }

    .profile-editor-sidebar-legacy__panel {
      height: 100%;
      max-height: 100%;
      padding-bottom: 0;
      overflow: hidden;
    }

    .profile-editor-sidebar-legacy.is-mobile-open,
    .profile-editor-sidebar-legacy[data-profile-reveal="sidebar"].is-mobile-open {
      visibility: visible;
      transform: translate3d(0,0,0);
      pointer-events: auto;
    }

    .profile-editor-sidebar-legacy__brand {
      min-height: 94px;
      padding: 20px 18px 17px 22px;
    }

    .profile-editor-sidebar-legacy__brand-copy,
    .profile-editor-sidebar-legacy__link span,
    .profile-editor-sidebar-legacy__logout span,
    .profile-editor-sidebar-legacy__account-copy {
      width: auto;
      opacity: 1;
      overflow: visible;
      pointer-events: auto;
    }

    .profile-editor-sidebar-legacy__toggle-desktop {
      display: none;
    }

    .profile-editor-sidebar-legacy__toggle-mobile {
      display: block;
    }


    .profile-editor-sidebar-legacy__backdrop {
      position: fixed;
      inset: var(--navbar-height, 74px) 0 0;
      z-index: 1650;
      display: block;
      border: 0;
      opacity: 0;
      visibility: hidden;
      background: rgba(0,0,0,.46);
      cursor: pointer;
      touch-action: manipulation;
      transition: opacity 220ms ease, visibility 220ms ease;
    }

    .profile-editor-sidebar-legacy__backdrop.is-open {
      opacity: 1;
      visibility: visible;
    }

    .profile-editor-page {
      width: 100%;
      margin-left: 0;
      padding: 132px 22px 68px;
    }
  }

  @media (max-width: 700px) {
    .profile-editor-sidebar-legacy {
      width: min(90vw, 318px);
      min-width: min(90vw, 318px);
      max-width: min(90vw, 318px);
    }


    .profile-editor-page {
      padding: 122px 14px 60px;
    }

    .profile-editor-main {
      width: 100%;
    }

    .profile-editor-identity {
      align-items: flex-start;
      gap: 16px;
    }

    .profile-editor-identity__avatar-wrap {
      width: 82px;
      height: 82px;
      flex-basis: 82px;
    }

    .profile-editor-identity h1 {
      font-size: 21px;
    }

    .profile-editor-card {
      padding: 24px 18px 25px;
      border-radius: 15px;
    }

    .profile-editor-grid--two {
      grid-template-columns: 1fr;
    }

    .profile-editor-field--wide,
    .profile-editor-field--half {
      grid-column: auto;
    }

    .profile-editor-actions {
      display: grid;
      grid-template-columns: 1fr;
    }

    .profile-editor-button,
    .profile-editor-button--primary {
      width: 100%;
    }
  }

  @container client-account (max-width: 700px) {
    .profile-editor-page {
      padding: 122px 14px 60px;
    }

    .profile-editor-main { width: 100%; }
    .profile-editor-identity { align-items: flex-start; gap: 16px; }
    .profile-editor-identity__avatar-wrap {
      width: 82px;
      height: 82px;
      flex-basis: 82px;
    }
    .profile-editor-identity h1 { font-size: 21px; }
    .profile-editor-card { padding: 24px 18px 25px; border-radius: 15px; }
    .profile-editor-grid--two { grid-template-columns: 1fr; }
    .profile-editor-field--wide,
    .profile-editor-field--half { grid-column: auto; }
    .profile-editor-actions { display: grid; grid-template-columns: 1fr; }
    .profile-editor-button,
    .profile-editor-button--primary { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .profile-editor-page [data-profile-reveal],
    .profile-editor-sidebar-legacy[data-profile-reveal="sidebar"],
    .profile-editor-sidebar-legacy__link,
    .profile-editor-identity__avatar-wrap,
    .profile-editor-card::before,
    .profile-editor-card .profile-editor-field,
    .profile-cropper,
    .profile-cropper__dialog {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
`;

const EditProfile = () => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState<ProfileEditForm>(() => ({
    profilePhoto: user?.profilePhoto ?? "",
    fullName: user?.fullName ?? "",
    nickname: user?.nickname ?? "",
    email: user?.email ?? "",
    whatsapp: user?.whatsapp ?? "",
    birthDate: user?.birthDate ?? "",
    country: user?.country ?? "Indonesia",
    province: user?.province ?? "",
    city: user?.city ?? "",
    address: user?.address ?? "",
    jobTitle: user?.jobTitle ?? "",
    institution: user?.institution ?? "",
    linkedin: user?.linkedin ?? "",
  }));
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cropCandidate, setCropCandidate] = useState<{ source: string; fileName: string } | null>(null);

  const memberDate = user?.createdAt ? new Date(user.createdAt) : null;
  const memberSince = memberDate && !Number.isNaN(memberDate.getTime())
    ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(memberDate)
    : "Oct 2023";

  const avatarSrc = form.profilePhoto || user?.profilePhoto || "";

  const handleChange: ProfileFieldChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setStatus("");
  };

  const handlePhotoSelected = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File foto harus berupa gambar.");
      return;
    }
    if (file.size > 2_500_000) {
      setError("Ukuran foto maksimal 2,5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Foto profil gagal dibaca.");
        return;
      }
      setCropCandidate({ source: reader.result, fileName: file.name });
      setError("");
    };
    reader.onerror = () => setError("Foto profil gagal dibaca.");
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setStatus("");
    try {
      await authService.updateProfile(user.id, form);
      await refresh();
      setStatus("Profil berhasil diperbarui.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Profil gagal diperbarui.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <style data-component="client-profile-editor">{styles}</style>
      <ClientAccountLayout activeItem="personal" className="profile-editor-page">
        <div className="profile-editor-main">
          <ProfileIdentityHeader
            user={{ ...user, fullName: form.fullName || user.fullName, nickname: form.nickname || user.nickname, province: form.province || user.province }}
            avatarSrc={avatarSrc}
            memberSince={memberSince}
            onPhotoSelected={handlePhotoSelected}
          />

          <form className="profile-editor-form" onSubmit={handleSubmit}>
            <PersonalInformationCard form={form} onChange={handleChange} />
            <ResidentialAddressCard form={form} onChange={handleChange} />
            <ProfessionalProfileCard form={form} onChange={handleChange} />

            {error ? <p className="profile-editor-feedback is-error" role="alert"><TriangleAlert aria-hidden="true" />{error}</p> : null}
            {status ? <p className="profile-editor-feedback" role="status"><CheckCircle2 aria-hidden="true" />{status}</p> : null}

            <ProfileFormActions saving={saving} onCancel={() => navigateToRoute("/akun")} />
          </form>
        </div>
      </ClientAccountLayout>

      {cropCandidate ? (
        <ProfileImageCropper
          source={cropCandidate.source}
          fileName={cropCandidate.fileName}
          onCancel={() => setCropCandidate(null)}
          onApply={(imageDataUrl) => {
            handleChange("profilePhoto", imageDataUrl);
            setCropCandidate(null);
            setStatus("Foto sudah dipotong. Klik Save Changes untuk menyimpan.");
          }}
        />
      ) : null}
    </>
  );
};

export default EditProfile;
