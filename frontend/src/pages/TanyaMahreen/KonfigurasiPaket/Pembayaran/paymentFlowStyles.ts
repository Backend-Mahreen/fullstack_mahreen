export const PAYMENT_FLOW_STYLES = String.raw`

.spf-page,
.spf-page *,
.spf-page *::before,
.spf-page *::after { box-sizing: border-box; }

.spf-page {
  --spf-bg: #090909;
  --spf-panel: #0d0e0d;
  --spf-panel-soft: #111210;
  --spf-border: rgba(255, 255, 255, 0.09);
  --spf-gold: #cbaa6e;
  --spf-gold-light: #e2c88e;
  --spf-text: #eee9df;
  --spf-muted: #858078;
  --spf-green: #32d77d;
  min-height: 100vh;
  padding-top: var(--navbar-height, 78px);
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 4%, rgba(203, 170, 110, 0.06), transparent 23%),
    linear-gradient(180deg, #090909 0%, #070707 100%);
  color: var(--spf-text);
  font-family: "Inter", sans-serif;
}

.spf-shell {
  width: min(880px, calc(100% - 48px));
  margin: 0 auto;
  padding: 68px 0 96px;
}

.spf-shell--wide { width: min(980px, calc(100% - 48px)); }

.spf-header {
  display: flex;
  margin-bottom: 36px;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.spf-header__icon {
  position: relative;
  display: inline-flex;
  width: 76px;
  height: 76px;
  margin-bottom: 23px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(203, 170, 110, 0.24);
  border-radius: 999px;
  background: rgba(203, 170, 110, 0.055);
  color: var(--spf-gold-light);
  box-shadow: 0 0 40px rgba(203, 170, 110, 0.08);
}

.spf-header__icon svg { width: 31px; height: 31px; stroke-width: 1.7; }
.spf-header__icon.is-success {
  border-color: rgba(50, 215, 125, 0.28);
  background: rgba(50, 215, 125, 0.12);
  color: var(--spf-green);
  box-shadow: 0 0 42px rgba(50, 215, 125, 0.1);
}

.spf-header__spinner {
  width: 31px;
  height: 31px;
  border: 4px solid rgba(203, 170, 110, 0.21);
  border-top-color: var(--spf-gold-light);
  border-radius: 999px;
  animation: spf-spin 1.15s linear infinite;
}

@keyframes spf-spin { to { transform: rotate(360deg); } }

.spf-progress {
  display: flex;
  margin-bottom: 13px;
  align-items: center;
  gap: 8px;
  color: var(--spf-gold);
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.spf-progress__dots { display: inline-flex; gap: 5px; }
.spf-progress__dots i {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #494641;
}
.spf-progress__dots i.is-active { background: var(--spf-gold); }

.spf-header h1 {
  margin: 0;
  color: var(--spf-text);
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(37px, 5vw, 51px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.025em;
}

.spf-header h1.is-success { color: var(--spf-green); }
.spf-header > p {
  max-width: 610px;
  margin: 14px auto 0;
  color: var(--spf-muted);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.7;
}
.spf-header > p strong { color: var(--spf-gold-light); font-weight: 500; }

.spf-card {
  padding: 34px;
  border: 1px solid var(--spf-border);
  border-radius: 9px;
  background:
    linear-gradient(145deg, rgba(203, 170, 110, 0.025), transparent 42%),
    rgba(13, 14, 13, 0.97);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

.spf-card__status {
  display: flex;
  padding-bottom: 21px;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--spf-border);
  color: #d6d0c7;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.spf-card__status::before {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--spf-gold);
  content: "";
  box-shadow: 0 0 14px rgba(203, 170, 110, 0.32);
}
.spf-card__status.is-success { color: var(--spf-green); }
.spf-card__status.is-success::before { background: var(--spf-green); box-shadow: 0 0 15px rgba(50, 215, 125, 0.32); }

.spf-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 21px;
  gap: 12px;
}

.spf-stat {
  min-width: 0;
  padding: 17px;
  border: 1px solid rgba(255, 255, 255, 0.025);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.17);
}
.spf-stat span,
.spf-detail-block__label {
  display: block;
  color: #67635e;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.spf-stat strong {
  display: block;
  margin-top: 9px;
  color: #e1dcd3;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.spf-stat strong.is-gold { color: var(--spf-gold-light); }
.spf-stat strong.is-success { color: var(--spf-green); }

.spf-detail-block {
  position: relative;
  margin-top: 12px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.035);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.19);
}
.spf-detail-block__value {
  display: flex;
  margin-top: 9px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.spf-detail-block__value strong {
  min-width: 0;
  color: var(--spf-gold-light);
  font-family: "DM Mono", monospace;
  font-size: 14px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.spf-copy {
  display: inline-flex;
  min-height: 31px;
  padding: 6px 10px;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--spf-border);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.045);
  color: #c7c0b5;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
}
.spf-copy:hover { border-color: var(--spf-gold); transform: translateY(-2px); box-shadow: 0 0 18px rgba(203, 170, 110, 0.12); }
.spf-copy svg { width: 12px; height: 12px; }

.spf-bank-line {
  display: flex;
  align-items: center;
  gap: 14px;
}
.spf-bank-line__logo {
  display: inline-flex;
  width: 58px;
  height: 48px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #f4f2ed;
}
.spf-bank-line__logo img { width: 47px; max-height: 26px; object-fit: contain; }
.spf-bank-line p { margin: 0; color: #77716a; font-size: 14px; }
.spf-bank-line strong { display: block; margin-top: 4px; color: var(--spf-gold-light); font-family: "DM Mono", monospace; font-size: 14px; }

.spf-note {
  display: flex;
  margin-top: 18px;
  padding: 15px 16px;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid rgba(203, 170, 110, 0.18);
  border-radius: 4px;
  background: rgba(203, 170, 110, 0.035);
  color: #77716a;
  font-size: 14px;
  line-height: 1.65;
}
.spf-note svg { width: 14px; height: 14px; margin-top: 2px; flex: 0 0 auto; color: var(--spf-gold); }
.spf-note.is-success { border-color: rgba(50, 215, 125, 0.2); background: rgba(50, 215, 125, 0.055); color: #8da999; }
.spf-note.is-success svg, .spf-note.is-success strong { color: var(--spf-green); }

.spf-qr-wrap {
  display: flex;
  margin-top: 13px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
}
.spf-qr {
  display: grid;
  width: 148px;
  height: 148px;
  padding: 15px;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(11, 1fr);
  gap: 2px;
  border-radius: 8px;
  background: #f8f8f5;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.3);
}
.spf-qr i { background: transparent; }
.spf-qr i.is-dark { background: #090909; }
.spf-qr-caption {
  display: flex;
  margin: 0;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #68635d;
  font-size: 14px;
  text-align: left;
}
.spf-qr-caption__brand {
  width: 70px;
  height: 30px;
  flex: 0 0 70px;
  object-fit: contain;
  border-radius: 5px;
}

.spf-actions {
  display: flex;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 13px;
}
.spf-primary {
  display: inline-flex;
  width: min(100%, 420px);
  min-height: 58px;
  padding: 13px 20px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid var(--spf-gold-light);
  border-radius: 2px;
  background: linear-gradient(90deg, #c6a465, #d5ba80, #c6a465);
  color: #16120b;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 24px rgba(203, 170, 110, 0.16);
  transition: transform 230ms ease, box-shadow 230ms ease, filter 230ms ease;
}
.spf-primary:hover { transform: translateY(-3px); box-shadow: 0 0 38px rgba(225, 198, 143, 0.38), 0 17px 36px rgba(0,0,0,.32); filter: brightness(1.04); }
.spf-primary svg { width: 16px; height: 16px; }
.spf-primary:disabled { opacity: .35; cursor: not-allowed; transform: none; box-shadow: none; }
.spf-secondary { color: #6f6b65; font-size: 14px; text-decoration: none; }
.spf-secondary:hover { color: var(--spf-gold-light); }

.spf-dev-action {
  display: inline-flex;
  min-height: 32px;
  padding: 7px 13px;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(203, 170, 110, 0.18);
  border-radius: 999px;
  background: rgba(203, 170, 110, 0.045);
  color: #9e895f;
  font-size: 14px;
  cursor: pointer;
}

.spf-benefits { margin-top: 27px; }
.spf-benefits h2,
.spf-schedule-card h2 {
  margin: 0 0 17px;
  color: #d8d2c8;
  font-family: "DM Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.spf-benefits ul { display: grid; margin: 0; padding: 0; gap: 13px; list-style: none; }
.spf-benefits li { display: flex; align-items: flex-start; gap: 10px; color: #77716a; font-size: 14px; line-height: 1.55; }
.spf-benefits li svg { width: 13px; height: 13px; margin-top: 1px; flex: 0 0 auto; color: var(--spf-gold); }

.spf-email-card {
  display: flex;
  padding: 17px;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255,255,255,.03);
  border-radius: 4px;
  background: rgba(0,0,0,.17);
}
.spf-email-card svg { width: 18px; height: 18px; color: var(--spf-gold); }
.spf-email-card strong { display: block; color: #ddd7ce; font-size: 14px; }
.spf-email-card span { display: block; margin-top: 3px; color: #67635e; font-size: 14px; }

.spf-schedule-card { padding: 34px; }
.spf-date-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
.spf-time-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.spf-schedule-label { margin: 22px 0 10px; color: #716c65; font-family: "DM Mono", monospace; font-size: 14px; letter-spacing: .1em; text-transform: uppercase; }
.spf-slot {
  min-height: 54px;
  padding: 8px;
  border: 1px solid var(--spf-border);
  border-radius: 4px;
  background: #101110;
  color: #b5afa7;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
}
.spf-slot span { display: block; color: #77716a; font-size: 14px; text-transform: uppercase; }
.spf-slot strong { display: block; margin-top: 4px; font-size: 14px; }
.spf-slot:hover, .spf-slot.is-selected { border-color: var(--spf-gold); background: rgba(203,170,110,.07); transform: translateY(-2px); box-shadow: 0 0 18px rgba(203,170,110,.08); }
.spf-meeting-method { display: flex; min-height: 65px; padding: 14px; align-items: center; gap: 12px; border: 1px solid var(--spf-border); border-radius: 4px; background: #101110; color: #c9c3ba; }
.spf-meeting-method::before { width: 9px; height: 9px; border-radius: 999px; background: var(--spf-gold-light); content: ""; }
.spf-meeting-method strong { display: block; font-size: 14px; }
.spf-meeting-method span { display: block; margin-top: 3px; color: #69645e; font-size: 14px; }

.spf-reveal {
  opacity: 0;
  transform: translateY(25px);
  filter: blur(6px);
  animation: spf-reveal 760ms cubic-bezier(.2,.72,.22,1) forwards;
  animation-delay: var(--spf-delay, 0ms);
}
@keyframes spf-reveal { to { opacity: 1; transform: translateY(0); filter: blur(0); } }

@media (max-width: 720px) {
  .spf-shell, .spf-shell--wide { width: min(100%, calc(100% - 28px)); padding: 52px 0 72px; }
  .spf-card, .spf-schedule-card { padding: 24px 18px; }
  .spf-stats { grid-template-columns: 1fr; }
  .spf-date-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .spf-time-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .spf-detail-block__value { align-items: flex-start; flex-direction: column; }
}

@media (max-width: 420px) {
  .spf-shell, .spf-shell--wide { width: min(100%, calc(100% - 22px)); }
  .spf-header h1 { font-size: 34px; }
  .spf-header > p { font-size: 14px; }
  .spf-date-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (prefers-reduced-motion: reduce) {
  .spf-reveal { opacity: 1; transform: none; filter: none; animation: none; }
  .spf-header__spinner { animation-duration: 4s; }
  .spf-primary, .spf-slot, .spf-copy { transition: none; }
}
`;
