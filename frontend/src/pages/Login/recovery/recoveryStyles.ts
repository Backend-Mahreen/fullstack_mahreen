const recoveryStyles = `
  html.mahreen-recovery-document,
  body.mahreen-recovery-body {
    min-height: 100%;
    overflow-x: hidden !important;
    background: #050505 !important;
  }

  .recovery-page {
    --recovery-gold: #d4b56f;
    --recovery-gold-soft: #ebcc83;
    --recovery-muted: #aaa7a2;
    --recovery-page-height: calc(100svh - var(--navbar-height, 74px));
    position: relative;
    display: grid;
    grid-template-columns: minmax(520px, 46%) minmax(0, 1fr);
    width: 100%;
    min-height: var(--recovery-page-height);
    margin-top: var(--navbar-height, 74px);
    overflow: hidden;
    color: #f5f3ef;
    background: #050505;
    font-family: "Inter", Arial, sans-serif;
    isolation: isolate;
  }

  .recovery-page--reset {
    grid-template-columns: minmax(540px, 50%) minmax(0, 1fr);
  }


  .recovery-tail {
    width: 100%;
    min-width: 0;
    overflow: hidden;
    background: #000;
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    animation: recovery-tail-in 720ms cubic-bezier(.22,1,.36,1) both;
  }

  .recovery-tail--closing { animation-delay: 300ms; }
  .recovery-tail--footer { animation-delay: 380ms; }

  .recovery-page,
  .recovery-page *,
  .recovery-page *::before,
  .recovery-page *::after { box-sizing: border-box; }

  .recovery-panel {
    position: relative;
    z-index: 4;
    display: flex;
    min-width: 0;
    min-height: var(--recovery-page-height);
    padding: clamp(42px, 5vw, 72px) clamp(34px, 5.4vw, 78px);
    flex-direction: column;
    justify-content: center;
    background: radial-gradient(circle at 70% 42%, rgba(213,182,112,.035), transparent 32%), #050505;
  }

  .recovery-page--forgot .recovery-panel {
    padding-left: clamp(34px, 4.4vw, 64px);
    padding-right: clamp(34px, 5.2vw, 74px);
  }

  .recovery-brand {
    position: absolute;
    top: clamp(28px, 4.8vh, 42px);
    left: clamp(34px, 4.4vw, 64px);
    color: var(--recovery-gold-soft);
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -.04em;
    text-shadow: 0 0 18px rgba(212,181,111,.18);
    animation: recovery-fade-down 700ms cubic-bezier(.22,1,.36,1) both;
  }

  .recovery-form { width: min(100%, 470px); margin: 0; }
  .recovery-page--forgot .recovery-form { width: min(100%, 480px); }
  .recovery-page--reset .recovery-form { width: min(100%, 480px); margin-left: clamp(0px, 1vw, 14px); }

  .recovery-reveal {
    opacity: 0;
    transform: translate3d(0,16px,0);
    animation: recovery-rise 720ms cubic-bezier(.22,1,.36,1) forwards;
    animation-delay: var(--recovery-delay,0ms);
  }

  .recovery-title {
    margin: 0 0 10px;
    color: #f2f1ee;
    font-size: clamp(36px,3.6vw,50px);
    font-weight: 500;
    line-height: 1.14;
    letter-spacing: -.045em;
  }

  .recovery-subtitle {
    max-width: 470px;
    margin: 0 0 36px;
    color: #a5a29d;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.7;
  }

  .recovery-field { display: grid; margin-bottom: 24px; gap: 10px; }
  .recovery-field--compact { margin-bottom: 18px; }
  .recovery-label { color: #d5d2cd; font-size: 13px; font-weight: 500; line-height: 1.2; }

  .recovery-input-shell {
    display: flex;
    width: 100%;
    height: 58px;
    padding: 0 16px;
    gap: 13px;
    align-items: center;
    border: 1px solid #262626;
    border-radius: 9px;
    color: #fff;
    background: #191919;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.015);
    transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  }

  .recovery-page--reset .recovery-input-shell { background: #090909; border-color: #3c3427; }
  .recovery-input-shell:focus-within {
    border-color: rgba(212,181,111,.72);
    background: #171612;
    box-shadow: 0 0 0 3px rgba(212,181,111,.07), 0 0 26px rgba(212,181,111,.06);
  }

  .recovery-input-icon { display: grid; width: 20px; flex: 0 0 20px; place-items: center; color: #aaa59d; }
  .recovery-input { width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; color: #eeeae3; background: transparent; font-size: 14px; }
  .recovery-input::placeholder { color: #55524f; }

  .recovery-password-toggle {
    display: grid;
    width: 36px;
    height: 36px;
    padding: 0;
    flex: 0 0 36px;
    place-items: center;
    border: 0;
    color: #c5bda8;
    background: transparent;
    transition: color 160ms ease, transform 160ms ease;
  }
  .recovery-password-toggle:hover,
  .recovery-password-toggle:focus-visible { color: var(--recovery-gold-soft); transform: scale(1.06); }

  .recovery-hint { margin: -4px 0 26px; color: #85817a; font-size: 11px; font-style: italic; line-height: 1.5; }

  .recovery-button {
    position: relative;
    display: inline-flex;
    width: 100%;
    min-height: 58px;
    padding: 0 22px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid rgba(255,227,160,.16);
    border-radius: 9px;
    color: #15120d;
    background: linear-gradient(100deg,#c8a965,#dfc17d 54%,#c8a965);
    background-size: 180% 100%;
    box-shadow: 0 9px 24px rgba(0,0,0,.3), 0 0 20px rgba(212,181,111,.08);
    font-size: 16px;
    font-weight: 600;
    transition: transform 180ms ease, box-shadow 180ms ease, background-position 320ms ease;
  }
  .recovery-button::after {
    position: absolute;
    inset: -120% auto -120% -35%;
    width: 22%;
    content: "";
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.48),transparent);
    transform: rotate(16deg) translateX(-180%);
    transition: transform 540ms ease;
  }
  .recovery-button:hover:not(:disabled),
  .recovery-button:focus-visible:not(:disabled) {
    background-position: 100% 0;
    box-shadow: 0 12px 30px rgba(0,0,0,.38), 0 0 30px rgba(212,181,111,.18);
    transform: translateY(-2px);
  }
  .recovery-button:hover:not(:disabled)::after { transform: rotate(16deg) translateX(720%); }
  .recovery-button:disabled { opacity: .58; cursor: wait; }

  .recovery-back {
    display: inline-flex;
    width: fit-content;
    margin-top: 26px;
    gap: 7px;
    align-items: center;
    border: 0;
    color: #9a9791;
    background: transparent;
    font-size: 12px;
    transition: color 160ms ease, transform 160ms ease;
  }
  .recovery-page--forgot .recovery-back { margin-top: 22px; }
  .recovery-back:hover,
  .recovery-back:focus-visible { color: var(--recovery-gold-soft); transform: translateX(-2px); }

  .recovery-feedback {
    display: flex;
    margin: 0 0 16px;
    padding: 14px 16px;
    gap: 9px;
    align-items: flex-start;
    border: 1px solid rgba(212,181,111,.25);
    border-radius: 9px;
    color: #d9c89f;
    background: rgba(212,181,111,.07);
    font-size: 12px;
    line-height: 1.55;
    animation: recovery-rise 360ms ease both;
  }
  .recovery-feedback--error { border-color: rgba(222,94,94,.3); color: #e7a3a3; background: rgba(222,94,94,.07); }

  .recovery-visual { position: relative; min-width: 0; min-height: var(--recovery-page-height); overflow: hidden; background: #101010; }
  .recovery-visual__image,
  .recovery-visual__mosaic {
    position: absolute;
    inset: 0;
    background-image: var(--recovery-image);
    background-position: center;
    background-size: cover;
    animation: recovery-visual-in 1400ms cubic-bezier(.22,1,.36,1) both;
  }
  .recovery-page--forgot .recovery-visual__image { background-position: 52% center; filter: saturate(.72) contrast(1.06) brightness(.62); }
  .recovery-visual__mosaic { inset: -3%; background-size: 51% 51%; background-repeat: repeat; filter: saturate(.65) contrast(1.08) brightness(.54); transform: scale(1.04); }
  .recovery-visual__mosaic-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(0,0,0,.84) 1px,transparent 1px), linear-gradient(90deg,rgba(0,0,0,.84) 1px,transparent 1px);
    background-size: 33.333% 50%;
    opacity: .52;
  }
  .recovery-visual__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,rgba(0,0,0,.78) 0%,rgba(0,0,0,.22) 36%,rgba(0,0,0,.3) 100%), linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.42));
  }
  .recovery-page--reset .recovery-visual__overlay { background: radial-gradient(circle at 50% 48%,rgba(0,0,0,.18),rgba(0,0,0,.64) 72%), linear-gradient(90deg,rgba(0,0,0,.48),rgba(0,0,0,.3)); }

  .recovery-visual__brand {
    position: absolute;
    top: clamp(28px,7.2vh,44px);
    left: 50%;
    z-index: 4;
    color: var(--recovery-gold-soft);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -.04em;
    transform: translateX(-50%);
    text-shadow: 0 0 22px rgba(212,181,111,.26);
    animation: recovery-fade-down 850ms 150ms cubic-bezier(.22,1,.36,1) both;
  }

  .recovery-visual__content {
    position: relative;
    z-index: 3;
    display: grid;
    width: 100%;
    min-height: var(--recovery-page-height);
    padding: 52px clamp(40px,7vw,104px);
    place-items: center;
  }
  .recovery-page--forgot .recovery-visual__content { justify-items: start; padding-left: clamp(58px,9vw,118px); }

  .recovery-security-card {
    position: relative;
    width: min(100%,380px);
    padding: 38px 40px 35px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 18px;
    background: linear-gradient(145deg,rgba(22,24,25,.92),rgba(14,15,16,.88));
    box-shadow: 0 22px 70px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.025);
    backdrop-filter: blur(12px);
    animation: recovery-card-in 900ms 240ms cubic-bezier(.22,1,.36,1) both;
  }
  .recovery-page--reset .recovery-security-card { width: min(100%,360px); padding: 42px 40px 38px; text-align: left; }
  .recovery-security-card::after { position: absolute; inset: auto -20% -45% 12%; height: 90px; content: ""; opacity: .28; background: radial-gradient(ellipse,rgba(212,181,111,.15),transparent 68%); pointer-events: none; }

  .recovery-security-card__eyebrow { display: inline-flex; margin: 0 0 13px; gap: 7px; align-items: center; color: #bfa466; font-size: 11px; font-weight: 600; line-height: 1; letter-spacing: 1.25px; text-transform: uppercase; }
  .recovery-security-card__icon { display: grid; width: 20px; height: 20px; place-items: center; color: var(--recovery-gold); }
  .recovery-security-card__shield { display: grid; width: 50px; height: 50px; margin: 0 0 28px; place-items: center; border: 1px solid rgba(212,181,111,.24); border-radius: 50%; color: var(--recovery-gold); background: rgba(212,181,111,.08); box-shadow: 0 0 24px rgba(212,181,111,.07); }
  .recovery-security-card__title { margin: 0 0 12px; color: #f3f2ef; font-size: 32px; font-weight: 500; line-height: 1.18; letter-spacing: -.045em; }
  .recovery-page--reset .recovery-security-card__title { color: var(--recovery-gold-soft); font-size: 23px; font-weight: 600; line-height: 1.3; letter-spacing: -.025em; }
  .recovery-security-card__description { margin: 0 0 19px; color: #9b9995; font-size: 13px; font-weight: 300; line-height: 1.7; }
  .recovery-page--reset .recovery-security-card__description { font-size: 13px; line-height: 1.72; }
  .recovery-security-card__divider { height: 1px; margin: 0 0 14px; border: 0; background: linear-gradient(90deg,rgba(212,181,111,.42),rgba(255,255,255,.035) 46%,transparent); }
  .recovery-security-card__trust { display: flex; gap: 9px; align-items: center; color: #8f8c87; font-size: 11px; }
  .recovery-security-card__avatars { display: flex; }
  .recovery-security-card__avatar { display: grid; width: 24px; height: 24px; margin-left: -3px; place-items: center; border: 1px solid #161616; border-radius: 50%; color: #d2cdc3; background: #55534f; font-size: 8px; }
  .recovery-security-card__avatar:first-child { margin-left: 0; }
  .recovery-security-card__encryption { margin: 0; color: #bb9b50; font-size: 10px; font-weight: 600; line-height: 1; letter-spacing: 1px; text-align: center; text-transform: uppercase; }

  @keyframes recovery-tail-in { from { opacity: 0; transform: translate3d(0,18px,0); } to { opacity: 1; transform: none; } }
  @keyframes recovery-rise { from { opacity: 0; transform: translate3d(0,16px,0); } to { opacity: 1; transform: none; } }
  @keyframes recovery-fade-down { from { opacity: 0; transform: translate3d(0,-10px,0); } to { opacity: 1; transform: none; } }
  @keyframes recovery-card-in { from { opacity: 0; transform: translate3d(22px,0,0) scale(.985); } to { opacity: 1; transform: none; } }
  @keyframes recovery-visual-in { from { opacity: 0; transform: scale(1.045); } to { opacity: 1; transform: scale(1); } }

  @media (max-width: 900px) {
    .recovery-page,
    .recovery-page--reset { grid-template-columns: 1fr; }
    .recovery-panel { min-height: var(--recovery-page-height); padding: 104px 28px 56px; justify-content: center; }
    .recovery-page--reset .recovery-form,
    .recovery-page--forgot .recovery-form { width: min(100%,480px); margin-inline: auto; }
    .recovery-brand { left: 28px; }
    .recovery-visual { display: none; }
  }

  @media (max-height: 620px) and (min-width: 901px) {
    .recovery-panel { padding-top: 62px; padding-bottom: 28px; }
    .recovery-subtitle { margin-bottom: 18px; }
    .recovery-field { margin-bottom: 12px; }
    .recovery-back { margin-top: 12px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .recovery-page *,
    .recovery-page *::before,
    .recovery-page *::after,
    .recovery-tail { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
`;
export default recoveryStyles;
