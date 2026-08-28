import type { CSSProperties, ReactNode } from "react";

const authStyles = `

  :root {
    --auth-bg: #050505;
    --auth-panel: #111111;
    --auth-panel-soft: #171717;
    --auth-border: rgba(255,255,255,.09);
    --auth-border-gold: rgba(222,188,116,.55);
    --auth-text: #f5f2ec;
    --auth-muted: #99948d;
    --auth-gold: #d8b66f;
    --auth-gold-soft: #efcc80;
    --auth-danger: #ff8b83;
    --auth-success: #56d991;
  }

  @keyframes authPageReveal {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes authItemReveal {
    from { opacity: 0; transform: translateY(18px) scale(.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes authGoldPulse {
    0%, 100% { box-shadow: 0 0 0 rgba(216,182,111,0); }
    50% { box-shadow: 0 0 28px rgba(216,182,111,.22); }
  }

  @keyframes authOrbFloat {
    0%, 100% { transform: translate3d(0,0,0); }
    50% { transform: translate3d(0,-12px,0); }
  }

  .auth-global-page,
  .auth-global-page *,
  .auth-global-page *::before,
  .auth-global-page *::after { box-sizing: border-box; }

  .auth-global-page {
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    padding-top: var(--navbar-height, 74px);
    background:
      radial-gradient(circle at 12% 12%, rgba(216,182,111,.07), transparent 24%),
      radial-gradient(circle at 86% 18%, rgba(216,182,111,.045), transparent 30%),
      var(--auth-bg);
    color: var(--auth-text);
    font-family: "DM Sans", Arial, sans-serif;
    overflow-x: clip;
    overflow-y: visible;
  }

  .auth-stage {
    width: min(100%, 1460px);
    max-width: 100%;
    min-width: 0;
    min-height: 720px;
    margin: 0 auto;
    padding: clamp(42px, 6vw, 88px) clamp(20px, 5vw, 74px);
    animation: authPageReveal .72s cubic-bezier(.22,1,.36,1) both;
  }

  .auth-stage--compact { width: min(100%, 1240px); }
  .auth-stage--full { width: min(100%, 1540px); padding-inline: clamp(20px, 4vw, 64px); }
  .auth-stage--review {
    width: min(100%, 1320px);
    overflow-x: hidden;
  }

  .auth-two-column {
    display: grid;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr);
    gap: clamp(48px, 8vw, 120px);
    align-items: start;
  }
  .auth-two-column > * { min-width: 0; max-width: 100%; }
  .auth-two-column--profile {
    grid-template-columns: minmax(270px, .62fr) minmax(0, 1.38fr);
  }

  .auth-split-stage {
    display: grid;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    grid-template-columns: minmax(300px, .78fr) minmax(0, 1.22fr);
    min-height: 760px;
    border: 1px solid var(--auth-border);
    background: #0d0d0d;
    overflow: hidden;
  }

  .auth-split-aside {
    position: relative;
    padding: clamp(34px, 5vw, 60px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--auth-border);
    background: linear-gradient(145deg, #111 0%, #0a0a0a 100%);
    overflow: hidden;
  }

  .auth-split-aside::after {
    content: "";
    position: absolute;
    width: 260px;
    height: 260px;
    right: -120px;
    bottom: -80px;
    border-radius: 50%;
    border: 1px solid rgba(216,182,111,.16);
    box-shadow: 0 0 80px rgba(216,182,111,.06);
    animation: authOrbFloat 5s ease-in-out infinite;
  }

  .auth-split-main { min-width: 0; padding: clamp(34px, 5vw, 62px); background: #060606; }

  .auth-split-stage--flat {
    min-height: calc(100vh - var(--navbar-height, 74px) - 130px);
    border: 0;
    background: transparent;
    overflow: visible;
    gap: clamp(44px, 6vw, 96px);
  }
  .auth-split-stage--flat .auth-split-aside {
    border: 0;
    border-radius: 0;
    background: transparent;
    padding: clamp(18px, 3vw, 42px) 0;
  }
  .auth-split-stage--flat .auth-split-main {
    border: 0;
    border-radius: 0;
    background: transparent;
    padding: clamp(18px, 3vw, 42px) 0;
  }

  /* Register step 2 — dedicated full-page layout */
  .auth-global-page.auth-step2-page {
    min-height: 100svh;
    padding-top: 0;
    background: #050505;
    overflow-x: hidden;
  }

  .auth-step2-shell {
    display: grid;
    grid-template-columns: minmax(340px, 45.2%) minmax(0, 54.8%);
    width: 100%;
    min-height: 100svh;
    background: #050505;
  }

  .auth-step2-aside {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 100svh;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(34px, 4.2vw, 58px) clamp(28px, 4.7vw, 68px) clamp(26px, 3.4vw, 46px);
    border-right: 1px solid rgba(255,255,255,.035);
    background: #111111;
  }

  .auth-step2-brand-block {
    position: relative;
    z-index: 1;
  }

  .auth-step2-brand-block .auth-brand {
    font-size: clamp(17px, 1.35vw, 21px);
    letter-spacing: -.015em;
  }

  .auth-step2-brand-block .auth-brand-copy {
    max-width: 360px;
    margin-top: 8px;
    font-size: clamp(14px, .92vw, 14px);
    line-height: 1.48;
  }

  .auth-step2-feature-list {
    width: 100%;
    max-width: 390px;
    margin: auto 0;
    gap: 20px;
    transform: translateY(18px);
  }

  .auth-step2-feature-box {
    gap: 15px;
    padding: 0;
    border: 0;
    background: transparent;
  }

  .auth-step2-feature-box .auth-feature-icon {
    width: 39px;
    height: 39px;
    border-color: rgba(216,182,111,.17);
    background: transparent;
  }

  .auth-step2-feature-box strong {
    margin-top: 2px;
    color: #ded8cf;
    font-size: 14px;
    letter-spacing: .055em;
    text-transform: uppercase;
  }

  .auth-step2-feature-box span:not(.auth-feature-icon) {
    display: block;
    margin-top: 3px;
    color: #8d8880;
    font-size: 14px;
    line-height: 1.5;
  }

  .auth-step2-copyright {
    margin: 0;
    color: #aca69d;
    font-size: 14px;
    line-height: 1.45;
  }

  .auth-step2-main {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 100svh;
    flex-direction: column;
    padding: clamp(34px, 4.4vw, 62px) clamp(34px, 5.8vw, 86px) clamp(24px, 3vw, 42px);
    background: #050505;
  }

  .auth-step2-content {
    width: min(100%, 620px);
    margin: 0 auto;
  }

  .auth-step2-main .auth-progress-header {
    flex-direction: row-reverse;
    align-items: flex-end;
    margin-bottom: 11px;
  }

  .auth-step2-main .auth-progress-header span:first-child {
    color: #9c978f;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
  }

  .auth-step2-main .auth-progress-header span:last-child {
    color: var(--auth-gold-soft);
    font-size: clamp(18px, 1.7vw, 23px);
    font-weight: 600;
    letter-spacing: -.02em;
  }

  .auth-step2-main .auth-progress-track {
    gap: 7px;
    margin-bottom: clamp(38px, 4.7vw, 62px);
  }

  .auth-step2-main .auth-progress-segment {
    height: 3px;
    background: #252525;
  }

  .auth-step2-main .auth-progress-segment.is-active {
    background: linear-gradient(90deg, #e0be73, #c69e4e);
    box-shadow: 0 0 10px rgba(216,182,111,.2);
  }

  .auth-step2-upload-block {
    display: grid;
    justify-items: center;
    margin-bottom: clamp(38px, 4.7vw, 58px);
    text-align: center;
  }

  .auth-step2-upload {
    width: 104px;
    height: 104px;
    margin: 0;
    border-radius: 13px;
    background: linear-gradient(145deg, rgba(216,182,111,.045), rgba(255,255,255,.012));
  }

  .auth-step2-upload-block p {
    margin: 11px 0 0;
    color: #a49f96;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.45;
  }

  .auth-step2-form {
    width: 100%;
  }

  .auth-step2-form-grid {
    gap: 20px 18px;
  }

  .auth-step2-form-grid .auth-field {
    gap: 7px;
  }

  .auth-step2-form-grid .auth-label {
    color: #a9a39b;
    font-size: 14px;
    font-weight: 500;
  }

  .auth-step2-form-grid .auth-input,
  .auth-step2-form-grid .auth-select {
    min-height: 44px;
    border-color: rgba(255,255,255,.065);
    border-radius: 7px;
    background: #1e1e1e;
    font-size: 14px;
  }

  .auth-step2-form-grid .auth-helper {
    font-size: 14px;
  }

  .auth-step2-actions {
    margin-top: 34px;
    padding-top: 0;
    border-top: 0;
  }

  .auth-step2-actions .auth-button {
    min-height: 43px;
    min-width: 98px;
    padding-inline: 23px;
    border-color: rgba(255,255,255,.105);
    border-radius: 7px;
    font-size: 14px;
  }

  .auth-step2-actions .auth-button--primary {
    min-width: 185px;
  }

  .auth-step2-help {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: auto 0 0;
    padding-top: 28px;
    color: #8b867e;
    font-size: 14px;
  }

  .auth-step2-help a {
    color: #b9b2a8;
    text-decoration: none;
  }

  .auth-step2-help a:hover {
    color: var(--auth-gold-soft);
  }

  .auth-brand {
    color: var(--auth-gold-soft);
    font-size: 18px;
    font-weight: 700;
  }

  .auth-brand-copy {
    max-width: 290px;
    margin: 8px 0 0;
    color: var(--auth-muted);
    font-size: 14px;
    line-height: 1.55;
  }

  .auth-kicker {
    margin: 0 0 10px;
    color: var(--auth-gold);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .auth-title,
  .auth-display-title {
    margin: 0;
    font-family: "Playfair Display", Georgia, serif;
    color: var(--auth-text);
    font-weight: 600;
  }

  .auth-title { font-size: clamp(34px, 4vw, 62px); line-height: 1.02; }
  .auth-title--sans { font-family: "DM Sans", Arial, sans-serif; font-weight: 600; }
  .auth-display-title { font-size: clamp(50px, 6vw, 92px); line-height: .94; letter-spacing: -.04em; }
  .auth-display-title strong { display: block; color: var(--auth-gold-soft); font-weight: 600; }

  .auth-lead {
    max-width: 670px;
    margin: 14px 0 0;
    color: var(--auth-muted);
    font-size: 15px;
    line-height: 1.65;
  }

  .auth-login-link {
    color: var(--auth-gold-soft);
    text-decoration: none;
    border-bottom: 1px solid rgba(216,182,111,.55);
  }

  .auth-progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 12px;
    color: #aaa49a;
    font-size: 14px;
  }

  .auth-progress-track {
    display: grid;
    grid-template-columns: repeat(var(--auth-total-steps, 4), 1fr);
    gap: 8px;
    margin-bottom: clamp(34px, 5vw, 64px);
  }

  .auth-progress-segment {
    height: 4px;
    border-radius: 99px;
    background: rgba(255,255,255,.1);
    overflow: hidden;
  }

  .auth-progress-segment.is-active { background: var(--auth-gold); }

  .auth-choice-card {
    min-height: 210px;
    padding: 24px;
    border: 1px solid var(--auth-border);
    border-radius: 8px;
    background: #151515;
    color: var(--auth-text);
    text-align: left;
    cursor: pointer;
    transition: transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease;
    opacity: 0;
    animation: authItemReveal .6s cubic-bezier(.22,1,.36,1) forwards;
  }

  .auth-choice-card:nth-child(2) { animation-delay: .08s; }
  .auth-choice-card:nth-child(3) { animation-delay: .16s; }
  .auth-choice-card:hover { transform: translateY(-6px); border-color: rgba(216,182,111,.45); }
  .auth-choice-card.is-selected {
    border-color: var(--auth-gold);
    background: linear-gradient(145deg, rgba(216,182,111,.12), #151515 45%);
    box-shadow: 0 18px 45px rgba(0,0,0,.32), 0 0 24px rgba(216,182,111,.08);
  }

  .auth-choice-icon,
  .auth-feature-icon,
  .auth-section-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--auth-gold);
    background: rgba(216,182,111,.1);
    border: 1px solid rgba(216,182,111,.12);
  }

  .auth-choice-icon { width: 44px; height: 44px; border-radius: 7px; margin-bottom: 20px; }
  .auth-choice-card h3 { margin: 0 0 6px; font-size: 19px; }
  .auth-choice-card p { margin: 0; color: var(--auth-muted); font-size: 14px; line-height: 1.6; }

  .auth-feature-list { display: grid; gap: 12px; margin-top: 38px; }
  .auth-feature-box {
    display: flex;
    gap: 14px;
    padding: 17px;
    border: 1px solid var(--auth-border);
    background: rgba(255,255,255,.035);
    opacity: 0;
    animation: authItemReveal .62s cubic-bezier(.22,1,.36,1) forwards;
  }
  .auth-feature-box:nth-child(2) { animation-delay: .1s; }
  .auth-feature-icon { width: 38px; height: 38px; border-radius: 50%; flex: 0 0 auto; }
  .auth-feature-box strong { display: block; font-size: 14px; }
  .auth-feature-box span { color: var(--auth-muted); font-size: 14px; }

  .auth-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 22px 18px; }
  .auth-field { display: grid; gap: 8px; min-width: 0; }
  .auth-field--wide { grid-column: 1 / -1; }
  .auth-label { color: #c8c2b8; font-size: 14px; }

  .auth-input,
  .auth-select {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid var(--auth-border);
    border-radius: 7px;
    background: #202020;
    color: var(--auth-text);
    font: inherit;
    font-size: 14px;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
  }

  .auth-input::placeholder { color: #6e6a65; }
  .auth-input:focus,
  .auth-select:focus { border-color: var(--auth-gold); box-shadow: 0 0 0 4px rgba(216,182,111,.09); transform: translateY(-1px); }

  .auth-password-wrap { position: relative; }
  .auth-password-wrap .auth-input { padding-right: 48px; }
  .auth-icon-button {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    display: inline-flex;
    border: 0;
    background: transparent;
    color: #bcb7af;
    cursor: pointer;
  }

  .auth-helper { color: #77726b; font-size: 14px; line-height: 1.5; }
  .auth-error { margin: 14px 0 0; color: var(--auth-danger); font-size: 14px; }
  .auth-success { margin: 14px 0 0; color: var(--auth-success); font-size: 14px; }

  .auth-upload {
    width: 104px;
    height: 104px;
    margin: 0 0 28px auto;
    border: 1px dashed rgba(216,182,111,.46);
    border-radius: 14px;
    display: grid;
    place-items: center;
    position: relative;
    overflow: hidden;
    color: var(--auth-gold);
    background: rgba(216,182,111,.04);
    cursor: pointer;
    transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  }
  .auth-upload:hover { transform: translateY(-4px); border-color: var(--auth-gold); box-shadow: 0 0 24px rgba(216,182,111,.12); }
  .auth-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .auth-upload img { width: 100%; height: 100%; object-fit: cover; }
  .auth-upload-label { display: grid; justify-items: center; gap: 6px; font-size: 14px; text-transform: uppercase; }

  .auth-card {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border: 1px solid var(--auth-border);
    border-radius: 14px;
    background: linear-gradient(145deg, #151515, #0e0e0e);
    padding: clamp(26px, 4vw, 48px);
    opacity: 0;
    animation: authItemReveal .7s .08s cubic-bezier(.22,1,.36,1) forwards;
  }

  .auth-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
  .auth-section-icon { width: 40px; height: 40px; border-radius: 50%; }
  .auth-card-header h2 { margin: 0; font-size: 20px; }
  .auth-card-header p { margin: 3px 0 0; color: var(--auth-muted); font-size: 14px; }

  .auth-divider { height: 1px; margin: 28px 0; background: var(--auth-border); }
  .auth-interest-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .auth-interest {
    min-height: 58px;
    padding: 12px;
    border: 1px solid var(--auth-border);
    border-radius: 9px;
    background: #202020;
    color: #ded9d1;
    font: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    transition: transform .2s ease, border-color .2s ease, background .2s ease;
  }
  .auth-interest:hover { transform: translateY(-3px); }
  .auth-interest.is-selected { border-color: var(--auth-gold); background: rgba(216,182,111,.12); color: var(--auth-gold-soft); }

  .auth-note {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid rgba(216,182,111,.14);
    border-radius: 8px;
    background: rgba(216,182,111,.055);
    color: #a9a39a;
    font-size: 14px;
    line-height: 1.55;
  }

  .auth-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--auth-border);
  }

  .auth-button {
    min-height: 48px;
    padding: 0 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid var(--auth-border);
    border-radius: 8px;
    background: transparent;
    color: #d3cec7;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease, background .22s ease;
  }
  .auth-button:hover { transform: translateY(-3px); border-color: rgba(216,182,111,.48); }
  .auth-button--primary {
    min-width: 220px;
    border-color: var(--auth-gold-soft);
    background: linear-gradient(135deg, var(--auth-gold-soft), #caa65d);
    color: #15110a;
    box-shadow: 0 14px 34px rgba(216,182,111,.14);
  }
  .auth-button--primary:hover { box-shadow: 0 0 24px rgba(216,182,111,.28), 0 18px 42px rgba(0,0,0,.32); }
  .auth-button--primary:not(:disabled) { animation: authGoldPulse 3.4s ease-in-out infinite; }
  .auth-button:disabled { opacity: .38; cursor: not-allowed; animation: none; transform: none; }

  .auth-review-top {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding-left: 0;
    margin-bottom: 18px;
  }
  .auth-review-progress-wrap {
    width: min(100%, 920px);
    max-width: 100%;
    min-width: 0;
    margin: 0 auto;
    padding: 8px 10px 0;
  }
  .auth-review-content {
    display: grid;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    grid-template-columns: minmax(280px, .72fr) minmax(0, 1.28fr);
    gap: 24px;
    align-items: start;
  }
  .auth-review-content > *,
  .auth-review-form,
  .auth-review-form > * {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
  .auth-review-intro-stack {
    position: relative;
    width: 100%;
    min-width: 0;
    padding-top: 106px;
  }
  .auth-card.auth-review-intro {
    min-height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 188px clamp(34px, 4.4vw, 54px) clamp(38px, 4.4vw, 52px);
    overflow: hidden;
  }
  .auth-review-title {
    max-width: 11ch;
    font-size: clamp(38px, 3.55vw, 55px);
    line-height: 1.01;
    letter-spacing: -.035em;
    overflow-wrap: normal;
    word-break: normal;
    text-wrap: balance;
  }
  .auth-review-intro .auth-lead {
    max-width: 35ch;
    font-size: 14px;
    line-height: 1.7;
  }
  .auth-consent-card { margin-top: 18px; }
  .auth-legal-nav {
    border: 1px solid var(--auth-border);
    border-radius: 10px;
    padding: 15px;
    background: linear-gradient(155deg, #171717, #131313);
  }
  .auth-review-intro-stack .auth-legal-nav {
    position: absolute;
    top: 42px;
    left: -14px;
    width: min(188px, calc(100% - 18px));
    z-index: 3;
    box-shadow: 0 20px 48px rgba(0,0,0,.42);
  }
  .auth-legal-nav h3 { margin: 0 0 3px; color: var(--auth-gold-soft); font-size: 15px; }
  .auth-legal-nav p { margin: 0 0 13px; color: var(--auth-muted); font-size: 14px; }
  .auth-legal-nav span { display: block; padding: 7px 8px; color: #aaa49b; font-size: 14px; border-left: 2px solid transparent; }
  .auth-legal-nav span.is-active { color: var(--auth-gold-soft); background: rgba(216,182,111,.08); border-left-color: var(--auth-gold); }

  .auth-summary-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 26px; }
  .auth-summary-item { min-width: 0; max-width: 100%; }
  .auth-summary-item span { display: block; color: var(--auth-gold); font-size: 14px; letter-spacing: .12em; text-transform: uppercase; }
  .auth-summary-item strong { display: block; max-width: 100%; margin-top: 8px; color: #eeeae3; font-size: 14px; line-height: 1.45; overflow-wrap: anywhere; word-break: break-word; }
  .auth-chip-row { display: flex; max-width: 100%; flex-wrap: wrap; gap: 7px; margin-top: 8px; }
  .auth-chip { max-width: 100%; padding: 6px 10px; border: 1px solid rgba(216,182,111,.25); border-radius: 999px; background: rgba(216,182,111,.08); color: var(--auth-gold-soft); font-size: 14px; overflow-wrap: anywhere; }

  .auth-check-list { display: grid; min-width: 0; gap: 15px; }
  .auth-check { display: flex; min-width: 0; max-width: 100%; gap: 12px; align-items: flex-start; color: #b4aea5; font-size: 14px; line-height: 1.55; }
  .auth-check > span { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
  .auth-check input { width: 17px; height: 17px; margin-top: 2px; flex: 0 0 17px; accent-color: var(--auth-gold); }
  .auth-check a { color: var(--auth-gold-soft); }

  .auth-login-shell {
    display: grid;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    grid-template-columns: minmax(330px, .68fr) minmax(0, 1.32fr);
    min-height: 720px;
    border: 1px solid var(--auth-border);
    background: #101010;
    overflow: hidden;
  }
  .auth-login-panel { padding: clamp(38px, 5vw, 64px); display: flex; flex-direction: column; }
  .auth-login-shell--flat {
    min-height: calc(100vh - var(--navbar-height, 74px) - 130px);
    border: 0;
    background: transparent;
    overflow: visible;
    gap: clamp(44px, 6vw, 96px);
  }
  .auth-login-shell--flat .auth-login-panel {
    padding: clamp(18px, 3vw, 42px) 0;
    background: transparent;
  }
  .auth-login-shell--flat .auth-login-visual {
    min-height: 680px;
    border-radius: 18px;
    border: 1px solid var(--auth-border);
    box-shadow: 0 28px 70px rgba(0,0,0,.34);
  }
  .auth-login-visual { position: relative; min-height: 620px; background: #080808; overflow: hidden; }
  .auth-login-visual img { width: 100%; height: 100%; object-fit: cover; opacity: .58; filter: saturate(.72) contrast(1.05); }
  .auth-login-visual::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5,5,5,.74), transparent 42%), linear-gradient(0deg, rgba(5,5,5,.55), transparent 48%); }
  .auth-login-copy { position: absolute; z-index: 1; inset: 18% 8% auto 14%; }
  .auth-login-benefits { position: absolute; z-index: 1; left: 14%; right: 10%; bottom: 18%; display: grid; gap: 14px; }
  .auth-login-benefit { padding: 18px; display: flex; gap: 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; background: rgba(8,8,8,.68); backdrop-filter: blur(12px); }
  .auth-login-benefit strong { display: block; font-size: 15px; }
  .auth-login-benefit span { color: #b2aca3; font-size: 14px; }
  .auth-login-spacer { flex: 1; }
  .auth-inline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .auth-remember { display: flex; align-items: center; gap: 8px; color: #aaa49c; font-size: 14px; }
  .auth-remember input { accent-color: var(--auth-gold); }
  .auth-demo { margin-top: 18px; color: #77716a; font-size: 14px; line-height: 1.6; }
  .auth-demo button { padding: 0; border: 0; background: transparent; color: var(--auth-gold-soft); cursor: pointer; }

  .auth-login-success-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 22px;
    padding: 14px 15px;
    border: 1px solid rgba(86,217,145,.25);
    border-radius: 9px;
    background: rgba(86,217,145,.075);
    color: var(--auth-success);
    animation: authItemReveal .55s cubic-bezier(.22,1,.36,1) both;
  }
  .auth-login-success-banner svg { flex: 0 0 auto; margin-top: 1px; }
  .auth-login-success-banner strong { display: block; font-size: 14px; }
  .auth-login-success-banner span { display: block; margin-top: 3px; color: #b7b2aa; font-size: 14px; line-height: 1.5; }

  .auth-login-required-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 22px;
    padding: 14px 15px;
    border: 1px solid rgba(216,182,111,.3);
    border-radius: 9px;
    background: rgba(216,182,111,.08);
    color: var(--auth-gold-soft);
    animation: authItemReveal .55s cubic-bezier(.22,1,.36,1) both;
  }
  .auth-login-required-banner svg { flex: 0 0 auto; margin-top: 1px; }
  .auth-login-required-banner strong { display: block; font-size: 14px; }
  .auth-login-required-banner span { display: block; margin-top: 3px; color: #b7b2aa; font-size: 14px; line-height: 1.5; }

  @keyframes authModalBackdropReveal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes authModalCardReveal {
    from { opacity: 0; transform: translateY(24px) scale(.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .auth-success-modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: 20px;
  }
  .auth-success-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,.82);
    backdrop-filter: blur(12px);
    animation: authModalBackdropReveal .35s ease both;
  }
  .auth-success-modal__card {
    position: relative;
    width: min(100%, 470px);
    padding: clamp(30px, 6vw, 48px);
    border: 1px solid rgba(216,182,111,.34);
    border-radius: 18px;
    background: linear-gradient(145deg, #171717 0%, #0d0d0d 100%);
    box-shadow: 0 28px 90px rgba(0,0,0,.62), 0 0 55px rgba(216,182,111,.1);
    text-align: center;
    animation: authModalCardReveal .58s cubic-bezier(.22,1,.36,1) both;
  }
  .auth-success-modal__icon {
    width: 76px;
    height: 76px;
    margin: 0 auto 22px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(86,217,145,.32);
    border-radius: 50%;
    background: rgba(86,217,145,.1);
    color: var(--auth-success);
    box-shadow: 0 0 28px rgba(86,217,145,.13);
  }
  .auth-success-modal__card h2 {
    margin: 0;
    color: var(--auth-text);
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(30px, 6vw, 42px);
    line-height: 1.08;
  }
  .auth-success-modal__card > p:not(.auth-kicker) {
    margin: 14px auto 0;
    max-width: 40ch;
    color: var(--auth-muted);
    font-size: 14px;
    line-height: 1.7;
  }
  .auth-success-modal__email {
    margin: 22px 0;
    padding: 12px 14px;
    border: 1px solid var(--auth-border);
    border-radius: 8px;
    background: rgba(255,255,255,.035);
    color: var(--auth-gold-soft);
    font-size: 14px;
    overflow-wrap: anywhere;
  }
  .auth-success-modal__button { width: 100%; }
  .auth-success-modal__card small {
    display: block;
    margin-top: 14px;
    color: #77716a;
    font-size: 14px;
  }

  .auth-account-card { max-width: 980px; margin: 0 auto; }
  .auth-account-hero { text-align: center; margin-bottom: 28px; }
  .auth-account-avatar { width: 86px; height: 86px; margin: 0 auto 18px; border-radius: 50%; display: grid; place-items: center; overflow: hidden; background: rgba(216,182,111,.13); border: 1px solid rgba(216,182,111,.32); color: var(--auth-gold); font-size: 26px; }
  .auth-account-avatar img { width: 100%; height: 100%; object-fit: cover; }

  @media (max-width: 1240px) {
    .auth-stage--review { width: min(100%, 1180px); }
    .auth-review-top { padding-left: 0; }
    .auth-review-progress-wrap { width: min(100%, 860px); }
    .auth-review-content { grid-template-columns: minmax(250px, .7fr) minmax(0, 1.3fr); }
    .auth-review-intro-stack .auth-legal-nav { left: -10px; width: 180px; }
  }

  @media (max-width: 1024px) {
    .auth-global-page { overflow-x: clip; }
    .auth-stage { width: 100%; max-width: 100%; }
    .auth-two-column,
    .auth-two-column--profile,
    .auth-split-stage,
    .auth-login-shell {
      grid-template-columns: minmax(0, 1fr) !important;
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }
    .auth-two-column { gap: 40px; }
    .auth-two-column > *,
    .auth-split-stage > *,
    .auth-login-shell > * { min-width: 0; max-width: 100%; }
    .auth-split-stage,
    .auth-login-shell { min-height: auto; }
    .auth-split-stage--flat,
    .auth-login-shell--flat { gap: 36px; }
    .auth-split-aside { min-height: auto; border-right: 0; border-bottom: 1px solid var(--auth-border); }
    .auth-split-stage--flat .auth-split-aside { border-bottom: 0; padding-bottom: 10px; }
    .auth-login-visual { min-height: 540px; }
    .auth-review-top { padding-left: 0; }
    .auth-review-progress-wrap { width: min(100%, 760px); padding-inline: 0; }
    .auth-review-content { grid-template-columns: minmax(235px, .72fr) minmax(0, 1.28fr); width: 100%; min-width: 0; }
    .auth-review-intro-stack { padding-top: 94px; }
    .auth-review-intro-stack .auth-legal-nav {
      top: 34px;
      left: -8px;
      width: 170px;
      padding: 14px;
    }
    .auth-card.auth-review-intro {
      min-height: 400px;
      padding: 166px clamp(28px, 5vw, 44px) 38px;
    }
    .auth-review-title { max-width: 15ch; }
  }

  @media (max-width: 860px) {
    .auth-review-top {
      padding-left: 0;
      margin-bottom: 24px;
    }
    .auth-review-progress-wrap { padding: 0; }
    .auth-review-content { grid-template-columns: minmax(0, 1fr); }
    .auth-review-intro-stack {
      padding-top: 84px;
      margin-bottom: 2px;
    }
    .auth-review-intro-stack .auth-legal-nav {
      top: 22px;
      left: 22px;
      width: 178px;
    }
    .auth-card.auth-review-intro {
      min-height: 350px;
      padding: 150px 30px 36px;
    }
  }

  @media (max-width: 720px) {
    .auth-global-page {
      padding-top: var(--navbar-height, 74px);
      overflow-x: clip;
    }
    .auth-stage,
    .auth-stage--compact,
    .auth-stage--review,
    .auth-stage--full {
      width: 100%;
      max-width: 100%;
      min-height: auto;
      padding: 30px 14px 48px;
    }
    .auth-two-column { gap: 30px; }
    .auth-title {
      max-width: 100%;
      font-size: clamp(32px, 10.5vw, 44px);
      line-height: 1.04;
      overflow-wrap: anywhere;
    }
    .auth-lead { max-width: 100%; font-size: 14px; line-height: 1.65; }
    .auth-progress-header {
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
      line-height: 1.45;
    }
    .auth-progress-header span:last-child { max-width: 52%; text-align: right; overflow-wrap: anywhere; }
    .auth-progress-track { gap: 6px; margin-bottom: 28px; }
    .auth-review-intro-stack { padding-top: 0; }
    .auth-review-intro-stack .auth-legal-nav { display: none; }
    .auth-review-top { padding-left: 0; margin-bottom: 24px; }
    .auth-identity-grid,
    .auth-interest-grid,
    .auth-form-grid,
    .auth-summary-grid { grid-template-columns: minmax(0, 1fr); }
    .auth-field,
    .auth-field--wide { grid-column: auto; min-width: 0; }
    .auth-choice-card { min-height: auto; padding: 20px; }
    .auth-feature-list { margin-top: 26px; }
    .auth-feature-box { width: 100%; padding: 15px; }
    .auth-feature-box > div { min-width: 0; }
    .auth-feature-box strong,
    .auth-feature-box span { overflow-wrap: anywhere; }
    .auth-card { padding: 22px 16px; border-radius: 12px; }
    .auth-card-header { align-items: flex-start; }
    .auth-card-header > div { min-width: 0; }
    .auth-card-header h2 { font-size: 19px; overflow-wrap: anywhere; }
    .auth-card-header p { font-size: 14px; line-height: 1.5; }
    .auth-input,
    .auth-select { min-height: 50px; font-size: 14px; }
    .auth-interest-grid { gap: 9px; }
    .auth-interest { min-height: 54px; font-size: 14px; }
    .auth-actions {
      align-items: stretch;
      flex-direction: column-reverse;
      gap: 12px;
      margin-top: 28px;
      padding-top: 20px;
    }
    .auth-button,
    .auth-button--primary { width: 100%; min-width: 0; }
    .auth-upload { margin: 0 auto 26px; }
    .auth-split-main,
    .auth-split-aside,
    .auth-login-panel { padding: 26px 16px; }
    .auth-split-aside { gap: 28px; }
    .auth-inline { flex-wrap: wrap; }
    .auth-login-panel > .auth-inline { flex-wrap: nowrap; }
    .auth-login-visual { min-height: 500px; }
    .auth-login-shell--flat .auth-login-visual { min-height: 500px; border-radius: 14px; }
    .auth-login-copy { inset: 10% 7% auto; }
    .auth-login-benefits { left: 7%; right: 7%; bottom: 8%; gap: 10px; }
    .auth-login-benefit { padding: 14px; }
    .auth-display-title { font-size: clamp(38px, 12vw, 58px); line-height: .98; }
    .auth-card.auth-review-intro { padding: 30px 24px; }
    .auth-review-title { max-width: 100%; font-size: clamp(34px, 10vw, 46px); }
    .auth-review-intro .auth-lead { max-width: 100%; }
    .auth-stage--review .auth-card { overflow: hidden; }
    .auth-summary-grid { gap: 18px; }
    .auth-check { font-size: 14px; }
    .auth-success-modal { padding: 12px; }
    .auth-success-modal__card { width: 100%; padding: 28px 18px; }
    .auth-account-card { width: 100%; }
  }

  @media (max-width: 480px) {
    .auth-stage,
    .auth-stage--compact,
    .auth-stage--review { padding: 24px 12px 42px; }
    .auth-kicker { font-size: 14px; }
    .auth-title { font-size: clamp(29px, 10vw, 38px); }
    .auth-lead { font-size: 14px; }
    .auth-progress-header { font-size: 14px; }
    .auth-progress-track { margin-bottom: 24px; }
    .auth-card { padding: 20px 14px; }
    .auth-card.auth-review-intro { padding: 26px 20px; }
    .auth-card-header { gap: 10px; }
    .auth-section-icon { width: 36px; height: 36px; }
    .auth-card-header h2 { font-size: 18px; }
    .auth-form-grid { gap: 18px; }
    .auth-feature-box { gap: 12px; padding: 14px; }
    .auth-feature-icon { width: 36px; height: 36px; }
    .auth-summary-item strong { font-size: 14px; }
    .auth-chip { max-width: 100%; overflow-wrap: anywhere; }
    .auth-login-visual { min-height: 470px; }
    .auth-login-copy { inset: 9% 6% auto; }
    .auth-login-benefits { left: 6%; right: 6%; bottom: 6%; }
    .auth-login-benefit strong { font-size: 14px; }
    .auth-login-benefit span { font-size: 14px; }
    .auth-success-modal__card h2 { font-size: 30px; }
  }

  @media (max-width: 1120px) {
    .auth-step2-shell {
      grid-template-columns: minmax(310px, 40%) minmax(0, 60%);
    }

    .auth-step2-aside {
      padding-inline: 38px;
    }

    .auth-step2-main {
      padding-inline: clamp(28px, 4.8vw, 58px);
    }
  }

  @media (max-width: 820px) {
    .auth-step2-shell {
      grid-template-columns: minmax(0, 1fr);
      min-height: 100svh;
    }

    .auth-step2-aside {
      min-height: auto;
      padding: 30px 24px 26px;
      border-right: 0;
      border-bottom: 1px solid rgba(255,255,255,.055);
    }

    .auth-step2-brand-block .auth-brand-copy br {
      display: none;
    }

    .auth-step2-feature-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-width: none;
      margin: 30px 0 0;
      transform: none;
      gap: 16px;
    }

    .auth-step2-feature-box {
      padding: 14px;
      border: 1px solid rgba(255,255,255,.055);
      border-radius: 9px;
      background: rgba(255,255,255,.018);
    }

    .auth-step2-copyright {
      display: none;
    }

    .auth-step2-main {
      min-height: auto;
      padding: 34px 24px 30px;
    }

    .auth-step2-content {
      width: min(100%, 660px);
    }

    .auth-step2-help {
      margin-top: 34px;
    }
  }

  @media (max-width: 560px) {
    .auth-step2-aside {
      padding: 25px 18px 22px;
    }

    .auth-step2-feature-list {
      grid-template-columns: minmax(0, 1fr);
      margin-top: 24px;
      gap: 10px;
    }

    .auth-step2-feature-box {
      padding: 12px;
    }

    .auth-step2-main {
      padding: 28px 16px 26px;
    }

    .auth-step2-main .auth-progress-header {
      align-items: flex-end;
    }

    .auth-step2-main .auth-progress-header span:last-child {
      max-width: none;
      font-size: 18px;
      text-align: left;
    }

    .auth-step2-main .auth-progress-track {
      margin-bottom: 34px;
    }

    .auth-step2-upload-block {
      margin-bottom: 34px;
    }

    .auth-step2-form-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
    }

    .auth-step2-form-grid .auth-field,
    .auth-step2-form-grid .auth-field--wide {
      grid-column: auto;
    }

    .auth-step2-actions {
      flex-direction: column-reverse;
      align-items: stretch;
      margin-top: 28px;
    }

    .auth-step2-actions .auth-button,
    .auth-step2-actions .auth-button--primary {
      width: 100%;
      min-width: 0;
    }

    .auth-step2-help {
      flex-wrap: wrap;
      text-align: center;
      line-height: 1.5;
    }
  }


  /* Login — full-width reference layout */
  .auth-global-page.auth-login-reference-page {
    min-height: 0;
    padding-top: var(--navbar-height, 74px);
    background: #0a0a0a;
    overflow: visible;
  }

  .auth-login-reference-shell {
    display: grid;
    grid-template-columns: minmax(360px, 40.6%) minmax(0, 59.4%);
    width: 100%;
    min-height: calc(100svh - var(--navbar-height, 74px));
    background: #0a0a0a;
    overflow: hidden;
  }

  .auth-login-reference-panel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    min-width: 0;
    padding: clamp(30px, 3.5vw, 54px) clamp(28px, 4.1vw, 62px) clamp(24px, 3vw, 42px);
    background: #111111;
  }

  .auth-login-reference-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .auth-login-reference-header .auth-brand {
    font-size: clamp(17px, 1.35vw, 22px);
    letter-spacing: -.02em;
  }

  .auth-login-close {
    width: 38px;
    height: 38px;
    display: inline-grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #b8b2aa;
    cursor: pointer;
    transition: color .2s ease, background .2s ease, transform .2s ease;
  }

  .auth-login-close:hover,
  .auth-login-close:focus-visible {
    color: var(--auth-gold-soft);
    background: rgba(216,182,111,.08);
    transform: rotate(4deg);
    outline: none;
  }

  .auth-login-reference-form-wrap {
    width: min(100%, 420px);
    margin: auto;
    padding-block: clamp(38px, 6vh, 74px);
  }

  .auth-login-reference-heading h1 {
    margin: 0;
    color: #f4f1ec;
    font-size: clamp(34px, 3.2vw, 48px);
    font-weight: 600;
    letter-spacing: -.045em;
    line-height: 1.05;
  }

  .auth-login-reference-heading p {
    margin: 11px 0 0;
    color: #aaa49c;
    font-size: 14px;
    line-height: 1.55;
  }

  .auth-login-reference-form {
    display: grid;
    gap: 20px;
    margin-top: 34px;
  }

  .auth-login-reference-form .auth-field {
    gap: 9px;
  }

  .auth-login-reference-form .auth-label {
    color: #a39d94;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .auth-login-reference-form .auth-input {
    min-height: 54px;
    border-color: rgba(255,255,255,.055);
    border-radius: 7px;
    background: #202020;
    font-size: 14px;
  }

  .auth-login-reference-form .auth-login-link {
    color: var(--auth-gold-soft);
    font-size: 14px;
    letter-spacing: 0;
    text-transform: none;
  }

  .auth-login-reference-form .auth-remember {
    margin-top: -1px;
  }

  .auth-login-reference-submit {
    width: 100%;
    min-width: 0;
    margin-top: 2px;
    min-height: 55px;
    border-radius: 7px;
    text-transform: uppercase;
    letter-spacing: .13em;
  }

  .auth-login-reference-demo {
    margin: 15px 0 0;
    text-align: center;
  }

  .auth-login-reference-footer {
    text-align: center;
  }

  .auth-login-reference-footer p {
    margin: 0;
    color: #aaa49c;
    font-size: 14px;
  }

  .auth-login-reference-footer > div {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 20px;
  }

  .auth-login-reference-footer > div a {
    color: #5f5b55;
    font-size: 14px;
    text-decoration: none;
    transition: color .2s ease;
  }

  .auth-login-reference-footer > div a:hover {
    color: var(--auth-gold-soft);
  }

  .auth-login-reference-visual {
    position: relative;
    min-width: 0;
    min-height: calc(100svh - var(--navbar-height, 74px));
    overflow: hidden;
    background: #090806;
  }

  .auth-login-reference-visual > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: .82;
    filter: saturate(.78) contrast(1.05) brightness(.72);
    transform: scale(1.015);
  }

  .auth-login-reference-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(8,8,8,.58) 0%, rgba(8,8,8,.13) 46%, rgba(8,8,8,.15) 100%),
      linear-gradient(0deg, rgba(5,5,5,.64) 0%, transparent 48%, rgba(5,5,5,.12) 100%);
  }

  .auth-login-reference-copy {
    position: absolute;
    z-index: 1;
    top: clamp(74px, 15vh, 145px);
    left: clamp(52px, 10.5%, 118px);
    width: min(76%, 620px);
  }

  .auth-login-reference-copy h2 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(46px, 5vw, 76px);
    font-weight: 600;
    letter-spacing: -.055em;
    line-height: 1.03;
  }

  .auth-login-reference-copy h2 strong {
    display: block;
    margin-top: 4px;
    color: var(--auth-gold-soft);
    font-weight: 600;
  }

  .auth-login-reference-benefits {
    display: grid;
    gap: 18px;
    width: min(100%, 600px);
    margin-top: clamp(40px, 7vh, 72px);
  }

  .auth-login-reference-benefit {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    padding: 20px 22px;
    border: 1px solid rgba(255,255,255,.11);
    border-radius: 12px;
    background: rgba(10,10,10,.8);
    box-shadow: 0 18px 42px rgba(0,0,0,.22);
  }

  .auth-login-reference-benefit .auth-feature-icon {
    width: 42px;
    height: 42px;
    border-radius: 8px;
  }

  .auth-login-reference-benefit > div {
    min-width: 0;
  }

  .auth-login-reference-benefit strong {
    display: block;
    color: #f0ede8;
    font-size: clamp(16px, 1.45vw, 21px);
    line-height: 1.25;
  }

  .auth-login-reference-benefit span:not(.auth-feature-icon) {
    display: block;
    margin-top: 4px;
    color: #aaa49b;
    font-size: clamp(14px, .92vw, 14px);
    line-height: 1.45;
  }

  .auth-login-reference-signature {
    position: absolute;
    z-index: 1;
    right: clamp(26px, 5vw, 72px);
    bottom: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: #d0c9bf;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .2em;
    text-transform: uppercase;
  }

  .auth-login-reference-signature span {
    width: 42px;
    height: 1px;
    background: rgba(216,182,111,.58);
  }

  /* Register step 2 — one viewport, upload centered above the form fields */
  .auth-global-page.auth-step2-page {
    min-height: 0;
    padding-top: var(--navbar-height, 74px);
    overflow: visible;
  }

  .auth-step2-shell {
    grid-template-columns: minmax(340px, 40.5%) minmax(0, 59.5%);
    height: calc(100svh - var(--navbar-height, 74px));
    min-height: 650px;
    overflow: hidden;
  }

  .auth-step2-aside,
  .auth-step2-main {
    height: 100%;
    min-height: 0;
  }

  .auth-step2-aside {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    gap: clamp(12px, 1.8vh, 20px);
    padding: clamp(27px, 3vw, 44px) clamp(28px, 4vw, 58px) clamp(22px, 2.5vw, 34px);
  }

  .auth-step2-feature-list {
    width: min(100%, 390px);
    max-width: 390px;
    margin: 0 auto;
    align-self: center;
    transform: none;
    gap: 14px;
  }

  .auth-step2-main {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    align-items: center;
    padding: clamp(24px, 3.4vw, 46px) clamp(34px, 5.4vw, 80px) clamp(20px, 2.6vw, 36px);
  }

  .auth-step2-content {
    display: flex;
    width: min(100%, 650px);
    min-height: 0;
    margin: 0 auto;
    flex-direction: column;
    justify-content: center;
  }

  .auth-step2-main .auth-progress-track {
    margin-bottom: clamp(14px, 2.2vh, 22px);
  }

  .auth-step2-upload-block--form {
    width: min(100%, 300px);
    margin: 0 auto clamp(16px, 2.4vh, 24px);
    padding-top: 1px;
    transform: none;
  }

  .auth-step2-upload-block--form .auth-step2-upload {
    width: 88px;
    height: 88px;
    margin: 0 auto;
  }

  .auth-step2-upload-block--form p {
    margin-top: 8px;
    font-size: 14px;
  }

  .auth-step2-form-grid {
    gap: 15px 18px;
  }

  .auth-step2-form-grid .auth-input,
  .auth-step2-form-grid .auth-select {
    min-height: 43px;
  }

  .auth-step2-actions {
    margin-top: 24px;
  }

  .auth-step2-help {
    margin: 0;
    padding-top: 16px;
  }

  @media (max-width: 1024px) {
    .auth-login-reference-shell {
      grid-template-columns: minmax(340px, 44%) minmax(0, 56%);
    }

    .auth-login-reference-copy {
      left: 8%;
      width: 84%;
    }

    .auth-login-reference-copy h2 {
      font-size: clamp(42px, 5.7vw, 62px);
    }
  }

  @media (max-width: 860px) {
    .auth-login-reference-shell {
      grid-template-columns: minmax(0, 1fr);
      min-height: auto;
      overflow: visible;
    }

    .auth-login-reference-panel {
      min-height: calc(100svh - var(--navbar-height, 74px));
      padding: 30px 24px 28px;
    }

    .auth-login-reference-form-wrap {
      width: min(100%, 520px);
    }

    .auth-login-reference-visual {
      min-height: 620px;
    }

    .auth-login-reference-copy {
      top: 70px;
      left: 7%;
      width: 86%;
    }

    .auth-step2-shell {
      height: auto;
      min-height: 0;
      overflow: visible;
    }

    .auth-step2-aside,
    .auth-step2-main {
      height: auto;
    }

    .auth-step2-aside-center {
      padding-block: 26px 12px;
    }

    .auth-step2-feature-list {
      width: 100%;
      max-width: none;
    }
  }

  @media (max-width: 560px) {
    .auth-login-reference-panel {
      min-height: calc(100svh - var(--navbar-height, 74px));
      padding: 24px 18px 24px;
    }

    .auth-login-reference-form-wrap {
      padding-top: clamp(58px, 10vh, 82px);
      padding-bottom: 34px;
    }

    .auth-login-reference-heading h1 {
      font-size: 34px;
    }

    .auth-login-reference-form {
      margin-top: clamp(46px, 7.5vh, 62px);
    }

    .auth-login-reference-footer > div {
      gap: 18px;
    }

    .auth-login-reference-visual {
      min-height: 570px;
    }

    .auth-login-reference-copy {
      top: 54px;
      left: 20px;
      width: calc(100% - 40px);
    }

    .auth-login-reference-copy h2 {
      font-size: clamp(38px, 12vw, 52px);
    }

    .auth-login-reference-benefits {
      gap: 12px;
      margin-top: 34px;
    }

    .auth-login-reference-benefit {
      padding: 15px;
    }

    .auth-login-reference-signature {
      right: 20px;
      bottom: 20px;
    }

    .auth-step2-upload-block--form .auth-step2-upload {
      width: 86px;
      height: 86px;
    }
  }

  @media (min-width: 861px) and (max-height: 760px) {
    .auth-step2-shell {
      min-height: 610px;
    }

    .auth-step2-aside {
      padding-top: 22px;
      padding-bottom: 18px;
    }

    .auth-step2-upload-block--form {
      margin-bottom: 12px;
    }

    .auth-step2-upload-block--form .auth-step2-upload {
      width: 72px;
      height: 72px;
    }

    .auth-step2-upload-block--form p {
      margin-top: 5px;
      font-size: 14px;
    }

    .auth-step2-feature-list {
      gap: 8px;
    }

    .auth-step2-main {
      padding-top: 20px;
      padding-bottom: 16px;
    }

    .auth-step2-main .auth-progress-track {
      margin-bottom: 10px;
    }

    .auth-step2-form-grid {
      gap: 10px 16px;
    }

    .auth-step2-form-grid .auth-input,
    .auth-step2-form-grid .auth-select {
      min-height: 40px;
    }

    .auth-step2-actions {
      margin-top: 16px;
    }

    .auth-step2-help {
      padding-top: 8px;
    }
  }


  /* Register step 2 — final responsive rules (kept after desktop rules to avoid cascade conflicts) */
  @media (max-width: 860px) {
    .auth-global-page.auth-step2-page {
      min-height: 0;
      padding-top: var(--navbar-height, 74px);
      overflow-x: clip;
      overflow-y: visible;
    }

    .auth-step2-shell {
      display: block;
      width: 100%;
      height: auto;
      min-height: 0;
      overflow: visible;
    }

    .auth-step2-aside {
      display: block;
      width: 100%;
      height: auto;
      min-height: 0;
      padding: 24px 20px;
      border-right: 0;
      border-bottom: 1px solid rgba(255,255,255,.055);
    }

    .auth-step2-brand-block {
      text-align: center;
    }

    .auth-step2-brand-block .auth-brand-copy {
      max-width: 520px;
      margin-inline: auto;
    }

    .auth-step2-feature-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: min(100%, 680px);
      max-width: 680px;
      margin: 22px auto 0;
      transform: none;
      gap: 12px;
    }

    .auth-step2-feature-box {
      min-width: 0;
      padding: 13px;
      border: 1px solid rgba(255,255,255,.055);
      border-radius: 9px;
      background: rgba(255,255,255,.018);
    }

    .auth-step2-feature-box > div {
      min-width: 0;
    }

    .auth-step2-feature-box strong,
    .auth-step2-feature-box span:not(.auth-feature-icon) {
      overflow-wrap: anywhere;
    }

    .auth-step2-copyright {
      display: none;
    }

    .auth-step2-main {
      display: block;
      width: 100%;
      height: auto;
      min-height: 0;
      padding: 30px 20px 34px;
    }

    .auth-step2-content {
      width: 100%;
      max-width: 680px;
      min-height: 0;
      margin: 0 auto;
    }

    .auth-step2-main .auth-progress-header {
      align-items: flex-end;
      margin-bottom: 10px;
    }

    .auth-step2-main .auth-progress-header span:last-child {
      max-width: 72%;
      text-align: left;
    }

    .auth-step2-main .auth-progress-track {
      margin-bottom: 26px;
    }

    .auth-step2-upload-block--form {
      margin-bottom: 24px;
    }

    .auth-step2-form-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .auth-step2-form-grid .auth-field,
    .auth-step2-form-grid .auth-field--wide,
    .auth-step2-form-grid .auth-password-wrap,
    .auth-step2-form-grid .auth-input,
    .auth-step2-form-grid .auth-select {
      min-width: 0;
      max-width: 100%;
    }

    .auth-step2-help {
      margin: 28px 0 0;
      padding: 0;
    }
  }

  @media (max-width: 620px) {
    .auth-step2-aside {
      padding: 21px 16px 18px;
    }

    .auth-step2-brand-block .auth-brand {
      font-size: 18px;
    }

    .auth-step2-brand-block .auth-brand-copy {
      font-size: 14px;
    }

    .auth-step2-feature-list {
      grid-template-columns: minmax(0, 1fr);
      margin-top: 18px;
      gap: 8px;
    }

    .auth-step2-feature-box {
      align-items: center;
      padding: 11px 12px;
    }

    .auth-step2-feature-box .auth-feature-icon {
      width: 35px;
      height: 35px;
    }

    .auth-step2-main {
      padding: 24px 14px 30px;
    }

    .auth-step2-main .auth-progress-header {
      flex-direction: row-reverse;
      align-items: flex-end;
      gap: 12px;
    }

    .auth-step2-main .auth-progress-header span:first-child {
      flex: 0 0 auto;
      white-space: nowrap;
      font-size: 14px;
    }

    .auth-step2-main .auth-progress-header span:last-child {
      min-width: 0;
      max-width: none;
      font-size: clamp(19px, 6vw, 23px);
      line-height: 1.15;
    }

    .auth-step2-main .auth-progress-track {
      gap: 5px;
      margin-bottom: 22px;
    }

    .auth-step2-upload-block--form {
      width: 100%;
      margin: 0 auto 22px;
    }

    .auth-step2-upload-block--form .auth-step2-upload {
      width: 84px;
      height: 84px;
    }

    .auth-step2-upload-block--form p {
      max-width: 260px;
      margin-inline: auto;
      font-size: 14px;
    }

    .auth-step2-form-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 15px;
    }

    .auth-step2-form-grid .auth-field,
    .auth-step2-form-grid .auth-field--wide {
      grid-column: auto;
      width: 100%;
    }

    .auth-step2-form-grid .auth-input,
    .auth-step2-form-grid .auth-select {
      width: 100%;
      min-height: 48px;
      padding-inline: 13px;
      font-size: 16px;
    }

    .auth-step2-form-grid input[type="date"] {
      min-width: 0;
      width: 100%;
      color-scheme: dark;
    }

    .auth-step2-actions {
      display: flex;
      width: 100%;
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 11px;
      margin-top: 24px;
    }

    .auth-step2-actions .auth-button,
    .auth-step2-actions .auth-button--primary {
      width: 100%;
      min-width: 0;
      min-height: 48px;
    }

    .auth-step2-help {
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 24px;
      text-align: center;
      line-height: 1.5;
    }
  }

  @media (max-width: 380px) {
    .auth-step2-aside {
      padding-inline: 13px;
    }

    .auth-step2-main {
      padding-inline: 12px;
    }

    .auth-step2-main .auth-progress-header span:last-child {
      font-size: 18px;
    }

    .auth-step2-main .auth-progress-header span:first-child {
      font-size: 14px;
    }

    .auth-step2-feature-box {
      gap: 10px;
    }

    .auth-step2-form-grid .auth-input,
    .auth-step2-form-grid .auth-select {
      padding-inline: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .auth-global-page *,
    .auth-global-page *::before,
    .auth-global-page *::after { animation: none !important; transition-duration: .01ms !important; }
  }
`;

type AuthThemeProps = Readonly<{ children: ReactNode }>;

const AuthTheme = ({ children }: AuthThemeProps) => (
  <>
    <style>{authStyles}</style>
    {children}
  </>
);

type AuthProgressProps = Readonly<{
  current: number;
  total?: number;
  label: string;
}>;

export const AuthProgress = ({
  current,
  total = 4,
  label,
}: AuthProgressProps) => {
  return (
    <>
      <div className="auth-progress-header">
        <span>STEP {String(current).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
        <span>{label}</span>
      </div>
      <div
        className="auth-progress-track"
        style={{ "--auth-total-steps": total } as CSSProperties}
        aria-label={`Langkah ${current} dari ${total}`}
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            className={`auth-progress-segment ${index < current ? "is-active" : ""}`}
            key={`auth-progress-${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default AuthTheme;
