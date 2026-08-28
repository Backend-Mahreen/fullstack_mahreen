const verificationStyles = `
  html.mvc-document,
  body.mvc-document-body {
    width: 100%;
    min-width: 0;
    overflow-x: hidden !important;
    background: #030303 !important;
    overscroll-behavior-y: auto;
    scroll-behavior: auto !important;
  }
  html.newsroom-sidebar-open,
  body.newsroom-sidebar-open {
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  .mvc-page {
    --newsroom-sidebar-width: 220px;
    --newsroom-navbar-height: 64px;
    --newsroom-gold: #e5c477;
    --newsroom-gold-light: #f0d58f;
    --newsroom-black: #050505;
    --newsroom-panel: #0d0c0b;
    --newsroom-brown: #24211e;
    --newsroom-brown-soft: #302c27;
    --newsroom-border: rgba(229,196,119,.24);
    --newsroom-muted: #aaa39a;
    --mvc-gold: #e4c272;
    position: relative;
    display: flex;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100svh;
    padding-top: 0;
    align-items: flex-start;
    overflow-x: clip;
    color: #e5e1da;
    background: #030303;
    font-family: "Inter", Arial, sans-serif;
  }
  .mvc-page,
  .mvc-page *,
  .mvc-page *::before,
  .mvc-page *::after { box-sizing: border-box; }
  .mvc-page a { color: inherit; text-decoration: none; }

  .mvc-main {
    position: relative;
    flex: 1 1 0;
    width: calc(100% - var(--newsroom-sidebar-width));
    max-width: calc(100% - var(--newsroom-sidebar-width));
    min-width: 0;
    margin: 0 0 0 var(--newsroom-sidebar-width);
    min-height: 100svh;
    overflow-x: clip;
    background: #020202;
  }

  .mvc-global-cta,
  .mvc-global-closing,
  .mvc-global-footer { width: 100%; min-width: 0; background: #000; }
  .mvc-hero,
  .mvc-stats,
  .mvc-result-section,
  .mvc-steps-section,
  .mvc-faq-section,
  .mvc-global-cta,
  .mvc-global-closing,
  .mvc-global-footer { contain: layout paint; }

  .mvc-container { width: min(100%,1160px); margin-inline: auto; padding-inline: clamp(30px,4vw,56px); }

  .mvc-page [data-mvc-reveal] {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    animation: mvc-reveal-in 680ms cubic-bezier(.22,1,.36,1) both;
    animation-delay: var(--mvc-delay, 0ms);
  }

  .mvc-global-cta {
    border-top: 1px solid rgba(229,196,119,.08);
  }

  .mvc-global-cta .section-final-cta__inner {
    padding-top: clamp(92px, 9vw, 132px);
    padding-bottom: clamp(92px, 9vw, 132px);
  }

  .mvc-hero {
    position: relative;
    min-height: 620px;
    overflow: hidden;
    border-bottom: 1px solid rgba(229,196,119,.08);
    background: radial-gradient(circle at 50% 8%,rgba(208,166,62,.11),transparent 30%), linear-gradient(180deg,#080704,#050505 66%,#070707);
    isolation: isolate;
  }
  .mvc-hero__grid,
  .mvc-hero__particles { position: absolute; inset: 0; pointer-events: none; }
  .mvc-hero__grid {
    opacity: .48;
    background-image: linear-gradient(rgba(196,156,57,.12) 1px,transparent 1px), linear-gradient(90deg,rgba(196,156,57,.12) 1px,transparent 1px), linear-gradient(rgba(196,156,57,.045) 1px,transparent 1px), linear-gradient(90deg,rgba(196,156,57,.045) 1px,transparent 1px);
    background-size: 82px 82px,82px 82px,20px 20px,20px 20px;
    -webkit-mask-image: none;
    mask-image: none;
  }
  .mvc-hero__particles {
    display: none;
    opacity: .42;
    background-image: radial-gradient(circle,rgba(228,194,114,.55) 0 .7px,transparent .9px), radial-gradient(circle,rgba(228,194,114,.28) 0 .55px,transparent .8px);
    background-position: 0 0,19px 13px;
    background-size: 23px 23px,31px 31px;
    /* Background-position animation memicu repaint besar saat scroll. */
    animation: none;
  }
  .mvc-hero::after { position: absolute; inset: 0; z-index: -1; content: ""; background: linear-gradient(90deg,rgba(0,0,0,.2),transparent 15%,transparent 85%,rgba(0,0,0,.2)), radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.47) 100%); }
  .mvc-hero__content { position: relative; z-index: 2; padding-top: 102px; padding-bottom: 78px; }
  .mvc-hero__intro { max-width: 780px; margin: 0 auto 58px; text-align: center; }
  .mvc-pill { display: inline-flex; min-height: 32px; margin-bottom: 18px; padding: 0 18px; align-items: center; justify-content: center; border: 1px solid rgba(228,194,114,.28); border-radius: 999px; color: #cfad5b; background: rgba(105,75,9,.14); font-size: 13px; }
  .mvc-hero__intro h1 { margin: 0 0 13px; color: #d9d6d0; font-size: clamp(34px,3.6vw,48px); font-weight: 400; line-height: 1.2; letter-spacing: -.035em; }
  .mvc-hero__intro p { max-width: 700px; margin: 0 auto; color: #aaa49a; font-size: 15px; font-weight: 300; line-height: 1.65; }

  .mvc-search-grid { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(300px,.85fr); gap: 24px; align-items: stretch; }
  .mvc-search-card,
  .mvc-scanner-card { min-height: 248px; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; background: linear-gradient(145deg,rgba(18,18,18,.96),rgba(15,15,15,.94)); box-shadow: none; }
  .mvc-search-card { padding: 36px 34px; }
  .mvc-card-label { display: inline-flex; margin-bottom: 20px; gap: 10px; align-items: center; color: #d8d3ca; font-size: 16px; font-weight: 600; }
  .mvc-card-label svg { color: var(--mvc-gold); }
  .mvc-search-card__row { display: grid; grid-template-columns: minmax(0,1fr) 190px; gap: 16px; }
  .mvc-search-card input { width: 100%; min-width: 0; min-height: 64px; padding: 0 20px; border: 1px solid rgba(255,255,255,.09); border-radius: 12px; outline: 0; color: #e8e4dd; background: #1d1d1d; font-size: 13px; line-height: 1.4; transition: border-color 180ms ease,box-shadow 180ms ease; }
  .mvc-search-card input::placeholder { color: #646777; }
  .mvc-search-card input:focus { border-color: rgba(228,194,114,.55); box-shadow: 0 0 0 3px rgba(228,194,114,.055); }

  .mvc-search-card__row button,
  .mvc-scanner-card button,
  .mvc-result-card__footer > button,
  .mvc-contact-card a,
  .mvc-modal__demo {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 0;
    border-radius: 11px;
    color: #1b160d;
    background: linear-gradient(105deg,#e8c97e,#f1d691 54%,#dfbb66);
    box-shadow: none;
    font-size: 13px;
    font-weight: 600;
    transition: transform 180ms ease,box-shadow 180ms ease,filter 180ms ease;
  }
  .mvc-search-card__row button:hover,
  .mvc-search-card__row button:focus-visible,
  .mvc-contact-card a:hover,
  .mvc-contact-card a:focus-visible,
  .mvc-modal__demo:hover,
  .mvc-modal__demo:focus-visible { filter: brightness(1.05); box-shadow: 0 14px 34px rgba(164,118,21,.19); transform: translateY(-2px); }
  .mvc-form-error { margin: 12px 0 0; color: #df8b8b; font-size: 12px; }

  .mvc-scanner-card { display: flex; padding: 30px 30px; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .mvc-scanner-card__icon { display: grid; width: 64px; height: 64px; margin-bottom: 16px; place-items: center; border-radius: 50%; color: var(--mvc-gold); background: rgba(228,194,114,.1); box-shadow: none; }
  .mvc-scanner-card h2 { margin: 0 0 9px; color: #dedbd5; font-size: 17px; font-weight: 500; }
  .mvc-scanner-card p { margin: 0 0 14px; color: #9b958d; font-size: 12px; line-height: 1.5; }
  .mvc-scanner-card button { width: 100%; min-height: 48px; border: 1px solid rgba(255,255,255,.16); color: #c9c5be; background: transparent; box-shadow: none; font-weight: 400; }
  .mvc-scanner-card button:hover,
  .mvc-scanner-card button:focus-visible { border-color: rgba(228,194,114,.56); color: var(--mvc-gold); background: rgba(228,194,114,.035); transform: translateY(-1px); }

  .mvc-stats { border-bottom: 1px solid rgba(255,255,255,.035); background: #101010; }
  .mvc-stats__grid { display: grid; min-height: 144px; grid-template-columns: repeat(4,minmax(0,1fr)); align-items: center; }
  .mvc-stat { display: grid; place-items: center; text-align: center; }
  .mvc-stat strong { color: #d7ba70; font-size: 19px; font-weight: 500; line-height: 1.2; }
  .mvc-stat span { color: #a6a097; font-size: 13px; font-weight: 300; }

  .mvc-result-section,
  .mvc-steps-section,
  .mvc-faq-section { background: #020202; }
  .mvc-result-section { padding: 88px 0 56px; scroll-margin-top: 82px; }
  .mvc-section-heading { margin-bottom: 52px; text-align: center; }
  .mvc-section-heading span { display: block; margin-bottom: 10px; color: #d2cec7; font-size: 22px; font-weight: 600; }
  .mvc-section-heading p { color: #99938a; font-size: 13px; font-weight: 300; }

  .mvc-result-card { width: min(100%,820px); margin-inline: auto; overflow: hidden; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; background: #101010; box-shadow: none; }
  .mvc-result-card.is-fresh { animation: none; }
  .mvc-result-card__top { display: flex; min-height: 54px; padding: 0 20px; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.06); background: #181712; }
  .mvc-result-card__top strong { display: inline-flex; gap: 6px; align-items: center; color: #d6b75f; font-size: 13px; font-weight: 600; text-transform: uppercase; }
  .mvc-result-card__top span { color: #a09b91; font-size: 11px; }
  .mvc-result-card__body { padding: 36px 34px 30px; }
  .mvc-result-card__details { display: grid; margin: 0; padding: 0 0 38px; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 24px 64px; border-bottom: 1px solid rgba(255,255,255,.05); }
  .mvc-result-card__details div { min-width: 0; }
  .mvc-result-card__details dt { margin: 0 0 3px; color: #8f8981; font-size: 11px; letter-spacing: .04em; text-transform: uppercase; }
  .mvc-result-card__details dd { margin: 0; overflow-wrap: anywhere; color: #c8c3bb; font-size: 14px; line-height: 1.5; }
  .mvc-result-card__footer { display: grid; padding-top: 28px; grid-template-columns: minmax(0,1fr) 184px; gap: 16px; }

  .mvc-signature { display: flex; min-height: 74px; padding: 0 18px; gap: 14px; align-items: center; border: 1px solid rgba(228,194,114,.12); border-radius: 12px; background: #12110d; }
  .mvc-signature__mark { display: grid; width: 40px; height: 40px; flex: 0 0 40px; place-items: center; border-radius: 50%; color: var(--mvc-gold); background: rgba(228,194,114,.08); }
  .mvc-signature > span:nth-child(2) { display: grid; gap: 2px; }
  .mvc-signature strong { color: #d6d2cb; font-size: 13px; font-weight: 600; }
  .mvc-signature small { color: #8f8980; font-size: 11px; }
  .mvc-signature__check { margin-left: auto; color: #d8b959; }
  .mvc-result-card__footer > button { gap: 7px; border-radius: 11px; color: #aaa59d; background: #202020; box-shadow: none; font-weight: 400; }
  .mvc-result-card__footer > button:hover,
  .mvc-result-card__footer > button:focus-visible { color: var(--mvc-gold); background: #28241b; transform: translateY(-1px); }

  .mvc-steps-section { padding: 78px 0 100px; }
  .mvc-steps { position: relative; display: grid; margin: 0; padding: 0; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 24px; list-style: none; }
  .mvc-steps::before { position: absolute; top: 24px; right: 4.5%; left: 4.5%; height: 1px; content: ""; background: linear-gradient(90deg,transparent,rgba(228,194,114,.16) 9%,rgba(255,255,255,.08) 50%,rgba(228,194,114,.16) 91%,transparent); }
  .mvc-steps li { position: relative; z-index: 2; text-align: center; }
  .mvc-step-number { display: grid; width: 49px; height: 49px; margin: 0 auto 18px; place-items: center; border: 1px solid rgba(255,255,255,.07); border-radius: 50%; color: #d8b65d; background: #1d1d1d; box-shadow: none; }
  .mvc-step-number svg { position: absolute; opacity: 0; transform: scale(.7); transition: opacity 180ms ease,transform 180ms ease; }
  .mvc-steps li:hover .mvc-step-number span { opacity: 0; }
  .mvc-steps li:hover .mvc-step-number svg { opacity: 1; transform: scale(1); }
  .mvc-steps li:first-child .mvc-step-number { color: #18130a; background: #e5c477; box-shadow: none; }
  .mvc-step-number span { font-size: 12px; transition: opacity 180ms ease; }
  .mvc-steps h3 { margin: 0 0 5px; color: #d6d2ca; font-size: 13px; font-weight: 600; line-height: 1.25; }
  .mvc-steps p { margin: 0; color: #99938a; font-size: 11px; font-weight: 300; line-height: 1.55; }

  .mvc-faq-section { padding: 82px 0 94px; }
  .mvc-faq-grid { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(340px,.95fr); gap: 56px; align-items: center; }
  .mvc-faq h2 { margin: 0 0 20px; color: #d0cbc3; font-size: 18px; font-weight: 600; line-height: 1.35; }
  .mvc-faq__items { display: grid; gap: 12px; }
  .mvc-faq-item { overflow: hidden; border: 1px solid rgba(255,255,255,.07); border-radius: 11px; background: #111; transition: border-color 180ms ease,background-color 180ms ease; }
  .mvc-faq-item.is-open { border-color: rgba(228,194,114,.22); background: #14130f; }
  .mvc-faq-item > button { display: flex; width: 100%; min-height: 56px; padding: 0 18px; align-items: center; justify-content: space-between; border: 0; color: #d2cec7; background: transparent; font-size: 12px; font-weight: 600; text-align: left; }
  .mvc-faq-item > button svg { flex: 0 0 auto; color: #c8c3ba; transition: transform 200ms ease,color 200ms ease; }
  .mvc-faq-item.is-open > button svg { color: var(--mvc-gold); transform: rotate(180deg); }
  .mvc-faq-item__answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 240ms cubic-bezier(.22,1,.36,1); }
  .mvc-faq-item.is-open .mvc-faq-item__answer { grid-template-rows: 1fr; }
  .mvc-faq-item__answer p { min-height: 0; margin: 0; padding: 0 18px; overflow: hidden; color: #969087; font-size: 11px; line-height: 1.65; transition: padding 240ms ease; }
  .mvc-faq-item.is-open .mvc-faq-item__answer p { padding-bottom: 17px; }

  .mvc-contact-card { min-height: 300px; padding: 56px 52px 46px; border-radius: 18px; color: #3e2d0d; background: radial-gradient(circle at 80% 20%,rgba(255,255,255,.16),transparent 36%), linear-gradient(135deg,#e0bb6e,#f0cf88); box-shadow: none; }
  .mvc-contact-card h2 { margin: 0 0 14px; font-size: 20px; font-weight: 600; line-height: 1.35; }
  .mvc-contact-card p { max-width: 420px; margin: 0 0 22px; font-size: 14px; line-height: 1.65; }
  .mvc-contact-card a { width: fit-content; min-height: 50px; padding: 0 22px; gap: 8px; color: #f2d99c; background: #513600; box-shadow: none; font-weight: 500; }

  .mvc-global-footer .footer__link::before,
  .mvc-global-footer .footer__social-link::before,
  .mvc-global-footer .footer__bottom-link::before { display: none !important; }
  .mvc-global-footer *,
  .mvc-global-closing * { transition: none !important; }

  .mvc-modal { position: fixed; inset: 0; z-index: 2200; display: grid; padding: 20px; place-items: center; }
  .mvc-modal__backdrop { position: absolute; inset: 0; border: 0; background: rgba(0,0,0,.82); backdrop-filter: blur(8px); animation: mvc-fade-in 220ms ease both; }
  .mvc-modal__panel { position: relative; z-index: 2; width: min(100%,520px); padding: 36px; border: 1px solid rgba(228,194,114,.23); border-radius: 14px; background: #121212; box-shadow: 0 30px 100px rgba(0,0,0,.65); text-align: center; animation: mvc-modal-in 360ms cubic-bezier(.22,1,.36,1) both; }
  .mvc-modal__close { position: absolute; top: 12px; right: 12px; display: grid; width: 40px; height: 40px; padding: 0; place-items: center; border: 0; border-radius: 50%; color: #9e9991; background: #1d1d1d; }
  .mvc-modal__icon { display: grid; width: 68px; height: 68px; margin: 0 auto 18px; place-items: center; border-radius: 50%; color: var(--mvc-gold); background: rgba(228,194,114,.08); }
  .mvc-modal__panel h2 { margin: 0 0 8px; color: #e0dcd4; font-size: 24px; font-weight: 600; }
  .mvc-modal__panel > p { margin: 0 0 18px; color: #969087; font-size: 13px; }
  .mvc-camera-frame { position: relative; aspect-ratio: 4/3; margin-bottom: 14px; overflow: hidden; border: 1px solid rgba(228,194,114,.2); border-radius: 12px; background: #080808; }
  .mvc-camera-frame video { width: 100%; height: 100%; object-fit: cover; }
  .mvc-camera-frame > span { position: absolute; inset: 18%; border: 1px solid rgba(228,194,114,.68); border-radius: 11px; box-shadow: 0 0 28px rgba(228,194,114,.11); }
  .mvc-camera-frame > span::after { position: absolute; top: 0; right: 5px; left: 5px; height: 1px; content: ""; background: var(--mvc-gold); box-shadow: 0 0 8px var(--mvc-gold); animation: mvc-scan-line 2.1s ease-in-out infinite alternate; }
  .mvc-camera-frame__error { position: absolute; inset: 0; display: grid; padding: 24px; place-items: center; align-content: center; gap: 10px; color: #a7a198; background: #0b0b0b; }
  .mvc-camera-frame__error svg { color: var(--mvc-gold); }
  .mvc-modal__demo { width: 100%; min-height: 52px; }

  .mvc-toast { position: fixed; right: 24px; bottom: 24px; z-index: 2300; display: flex; max-width: min(390px,calc(100vw - 40px)); min-height: 60px; padding: 14px 14px 14px 18px; gap: 12px; align-items: center; border: 1px solid rgba(228,194,114,.2); border-radius: 12px; color: #d7d2ca; background: rgba(18,18,18,.96); box-shadow: 0 18px 50px rgba(0,0,0,.48); font-size: 12px; animation: mvc-toast-in 380ms cubic-bezier(.22,1,.36,1) both; }
  .mvc-toast > svg { flex: 0 0 auto; color: var(--mvc-gold); }
  .mvc-toast button { display: grid; width: 34px; height: 34px; margin-left: auto; padding: 0; place-items: center; border: 0; color: #8d8880; background: transparent; }

  @keyframes mvc-reveal-in { from { opacity: 0; transform: translate3d(0,18px,0); } to { opacity: 1; transform: none; } }
  @keyframes mvc-result-pulse { 0% { box-shadow: 0 24px 70px rgba(0,0,0,.35); transform: scale(.99); } 40% { box-shadow: 0 24px 70px rgba(0,0,0,.35),0 0 45px rgba(228,194,114,.12); } 100% { box-shadow: none; transform: none; } }
  @keyframes mvc-modal-in { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }
  @keyframes mvc-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes mvc-scan-line { from { top: 2%; } to { top: calc(100% - 2px); } }
  @keyframes mvc-toast-in { from { opacity: 0; transform: translate3d(0,18px,0); } to { opacity: 1; transform: none; } }

  @media (max-width: 1024px) {
    .mvc-page {
      display: block;
      min-height: 100svh;
      padding-top: var(--newsroom-navbar-height);
    }
    .mvc-main {
      width: 100%;
      max-width: 100%;
      margin-left: 0;
    }

    .mvc-search-card,
    .mvc-scanner-card,
    .mvc-result-card,
    .mvc-contact-card { box-shadow: none; }
  }
  @media (max-width: 1180px) and (min-width: 761px) {
    .mvc-container { padding-inline: 36px; }
    .mvc-search-grid { grid-template-columns: minmax(0,1.4fr) minmax(270px,.85fr); }
    .mvc-steps { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 42px 28px; }
    .mvc-steps::before { display: none; }
  }
  @media (max-width: 760px) {
    .mvc-container { width: 100%; padding-inline: 20px; }
    .mvc-main,
    .mvc-main > * { max-width: 100%; }
    .mvc-hero__grid { opacity: .34; }
    .mvc-hero__particles { display: none; }
    .mvc-hero__content { padding-top: 68px; padding-bottom: 64px; }
    .mvc-search-grid,
    .mvc-faq-grid { grid-template-columns: 1fr; }
    .mvc-search-card__row { grid-template-columns: 1fr; }
    .mvc-search-card__row button { min-height: 54px; }
    .mvc-stats__grid { grid-template-columns: repeat(2,1fr); padding-block: 28px; gap: 30px 16px; }
    .mvc-result-card__details,
    .mvc-result-card__footer { grid-template-columns: 1fr; }
    .mvc-result-card__footer > button { min-height: 54px; }
    .mvc-steps { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 34px 22px; }
    .mvc-steps::before { display: none; }
    .mvc-contact-card { min-height: 250px; padding: 42px 34px; }
  }
  @media (max-width: 430px) {
    .mvc-hero__intro { margin-bottom: 30px; }
    .mvc-search-card,
   .mvc-scanner-card { border-radius: 12px; }
    .mvc-result-card__body { padding-inline: 16px; }
    .mvc-result-card__top { align-items: flex-start; padding-block: 12px; flex-direction: column; gap: 4px; }
    .mvc-steps { grid-template-columns: 1fr; }
    .mvc-steps li { display: grid; grid-template-columns: 60px 1fr; text-align: left; }
    .mvc-step-number { grid-row: span 2; margin: 0; }
  }

  @media (hover: none), (pointer: coarse) {
    .mvc-hero { background: #080704; }
    .mvc-hero__grid { display: none; }
    .mvc-search-card,
    .mvc-scanner-card,
    .mvc-result-card,
    .mvc-contact-card,
    .mvc-toast { box-shadow: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .mvc-page *,
    .mvc-page *::before,
    .mvc-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    .mvc-page [data-mvc-reveal] { opacity: 1; transform: none; }
  }
`;
export default verificationStyles;
