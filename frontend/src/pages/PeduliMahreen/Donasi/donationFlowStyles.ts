export const donationFlowStyles = `

  :root {
    --donation-gold: #e7c679;
    --donation-gold-deep: #b6924e;
    --donation-ink: #090909;
    --donation-panel: #171717;
    --donation-panel-soft: #1e1e1e;
    --donation-border: rgba(255, 255, 255, 0.1);
    --donation-muted: #9c9c9c;
    --donation-text: #f5f1e9;
  }

  .donation-layout,
  .donation-layout *,
  .donation-layout *::before,
  .donation-layout *::after {
    box-sizing: border-box;
  }

  .donation-layout {
    width: 100%;
    min-height: 100vh;
    background:
      radial-gradient(circle at 50% 14%, rgba(231, 198, 121, 0.045), transparent 28%),
      #000;
    color: var(--donation-text);
    font-family: "DM Sans", Inter, Arial, sans-serif;
  }

  .donation-main {
    width: 100%;
    min-height: calc(100vh - 78px);
    padding: clamp(118px, 10vw, 150px) 24px 96px;
  }

  .donation-shell {
    width: min(100%, 1180px);
    margin: 0 auto;
  }

  .donation-shell--compact {
    width: min(100%, 510px);
  }

  .donation-shell--success {
    width: min(100%, 720px);
  }

  .donation-stepper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 0 auto 34px;
    color: #6f6f6f;
  }

  .donation-stepper__item {
    display: grid;
    width: 92px;
    justify-items: center;
    gap: 8px;
    position: relative;
  }

  .donation-stepper__item:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 15px;
    left: calc(50% + 25px);
    width: 42px;
    height: 1px;
    background: #252525;
  }

  .donation-stepper__number {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid #343434;
    border-radius: 999px;
    background: #191919;
    color: #a2a2a2;
    font-size: 14px;
    font-weight: 700;
    transition: all 240ms ease;
  }

  .donation-stepper__label {
    color: #6f6f6f;
    font-size: 14px;
    white-space: nowrap;
  }

  .donation-stepper__item.is-active .donation-stepper__number,
  .donation-stepper__item.is-complete .donation-stepper__number {
    border-color: var(--donation-gold);
    background: var(--donation-gold);
    color: #19140b;
    box-shadow: 0 0 24px rgba(231, 198, 121, 0.2);
  }

  .donation-stepper__item.is-active .donation-stepper__label,
  .donation-stepper__item.is-complete .donation-stepper__label {
    color: var(--donation-gold);
  }

  .donation-stepper__item.is-complete:not(:last-child)::after {
    background: linear-gradient(90deg, var(--donation-gold), #2a2a2a);
  }

  .donation-card {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--donation-border);
    border-radius: 18px;
    background:
      linear-gradient(150deg, rgba(255, 255, 255, 0.025), transparent 38%),
      #111;
    box-shadow: 0 26px 65px rgba(0, 0, 0, 0.44);
  }

  .donation-card::after {
    content: "";
    position: absolute;
    inset: auto -20% -55% 45%;
    width: 280px;
    height: 280px;
    border-radius: 999px;
    background: rgba(231, 198, 121, 0.035);
    filter: blur(12px);
    pointer-events: none;
  }

  .donation-card--nominal {
    padding: 36px 36px 30px;
  }

  .donation-heading {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .donation-heading h1,
  .donation-content-header h1,
  .donation-payment-title,
  .donation-success-title {
    margin: 0;
    color: #f7f3ec;
    font-family: "Playfair Display", Georgia, serif;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  .donation-heading h1 {
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .donation-heading p,
  .donation-content-header p,
  .donation-success-copy {
    margin: 8px auto 0;
    color: #bbb8b2;
    font-size: 14px;
    line-height: 1.65;
  }

  .donation-amount-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 22px;
  }

  .donation-amount-option {
    min-height: 64px;
    padding: 12px 14px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: #232323;
    color: #fff;
    text-align: left;
    cursor: pointer;
    transition: border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
  }

  .donation-amount-option:hover {
    transform: translateY(-2px);
    border-color: rgba(231, 198, 121, 0.45);
  }

  .donation-amount-option.is-active {
    border-color: var(--donation-gold);
    background: linear-gradient(135deg, rgba(231, 198, 121, 0.08), #232323);
    box-shadow: inset 0 0 0 1px rgba(231, 198, 121, 0.05), 0 0 22px rgba(231, 198, 121, 0.08);
  }

  .donation-amount-option small {
    display: block;
    margin-bottom: 4px;
    color: #c7c1b8;
    font-size: 14px;
  }

  .donation-amount-option strong {
    font-size: 17px;
    font-weight: 500;
  }

  .donation-field-label {
    display: block;
    margin: 18px 0 8px;
    color: #d2cdc5;
    font-size: 14px;
    font-weight: 500;
  }

  .donation-input,
  .donation-textarea {
    width: 100%;
    border: 1px solid #303030;
    border-radius: 7px;
    outline: 0;
    background: #202020;
    color: #fff;
    font: inherit;
    transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
  }

  .donation-input {
    height: 53px;
    padding: 0 15px;
  }

  .donation-textarea {
    min-height: 112px;
    resize: vertical;
    padding: 14px 15px;
  }

  .donation-input:focus,
  .donation-textarea:focus {
    border-color: var(--donation-gold);
    background: #222;
    box-shadow: 0 0 0 3px rgba(231, 198, 121, 0.08);
  }

  .donation-impact-note {
    display: flex;
    gap: 13px;
    align-items: center;
    margin-top: 15px;
    padding: 17px 18px;
    border: 1px solid rgba(231, 198, 121, 0.18);
    border-radius: 8px;
    background: rgba(231, 198, 121, 0.08);
  }

  .donation-impact-note__icon {
    display: grid;
    place-items: center;
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: rgba(231, 198, 121, 0.17);
    color: var(--donation-gold);
  }

  .donation-impact-note strong {
    display: block;
    color: var(--donation-gold);
    font-size: 14px;
  }

  .donation-impact-note span {
    display: block;
    margin-top: 3px;
    color: #aaa49b;
    font-size: 14px;
  }

  .donation-primary-button,
  .donation-secondary-button,
  .donation-outline-button {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 50px;
    border-radius: 8px;
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease, border-color 220ms ease;
  }

  .donation-primary-button {
    width: 100%;
    margin-top: 15px;
    border: 1px solid var(--donation-gold);
    background: var(--donation-gold);
    color: #171209;
    box-shadow: 0 12px 30px rgba(231, 198, 121, 0.12);
  }

  .donation-primary-button::before,
  .donation-secondary-button::before {
    content: "";
    position: absolute;
    inset: -2px;
    z-index: -1;
    border-radius: inherit;
    background: rgba(231, 198, 121, 0.28);
    filter: blur(12px);
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .donation-primary-button:hover,
  .donation-secondary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 38px rgba(231, 198, 121, 0.22);
  }

  .donation-primary-button:hover::before,
  .donation-secondary-button:hover::before {
    opacity: 1;
  }

  .donation-primary-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .donation-card__footnote {
    margin: 15px 0 0;
    color: #777;
    font-size: 14px;
    text-align: center;
  }

  .donation-two-column {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 36px;
    align-items: start;
  }

  .donation-content-header {
    margin-bottom: 28px;
  }

  .donation-content-header h1 {
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: clamp(31px, 3vw, 44px);
    font-weight: 600;
    letter-spacing: -0.04em;
  }

  .donation-content-header p {
    max-width: 650px;
    margin-left: 0;
    font-size: 14px;
  }

  .donation-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
  }

  .donation-form-grid__wide {
    grid-column: 1 / -1;
  }

  .donation-anonymous-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    min-height: 66px;
    margin-top: 12px;
    padding: 13px 18px;
    border: 1px solid #303030;
    border-radius: 8px;
    background: #181818;
  }

  .donation-anonymous-card__content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .donation-anonymous-card__icon {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    background: rgba(231, 198, 121, 0.12);
    color: var(--donation-gold);
  }

  .donation-anonymous-card strong {
    display: block;
    font-size: 14px;
  }

  .donation-anonymous-card span {
    display: block;
    margin-top: 3px;
    color: #777;
    font-size: 14px;
  }

  .donation-toggle {
    position: relative;
    width: 40px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: #373737;
    cursor: pointer;
    transition: background 200ms ease;
  }

  .donation-toggle::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #fff;
    transition: transform 200ms ease;
  }

  .donation-toggle.is-active {
    background: var(--donation-gold);
  }

  .donation-toggle.is-active::after {
    transform: translateX(18px);
  }

  .donation-campaign-card,
  .donation-summary-card {
    position: sticky;
    top: 104px;
    overflow: hidden;
    border: 1px solid var(--donation-border);
    border-radius: 14px;
    background: #151515;
    box-shadow: 0 28px 65px rgba(0, 0, 0, 0.42);
  }

  .donation-campaign-card__image {
    position: relative;
    height: 165px;
    overflow: hidden;
  }

  .donation-campaign-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .donation-campaign-card:hover img {
    transform: scale(1.045);
  }

  .donation-campaign-card__badge {
    position: absolute;
    left: 14px;
    bottom: 13px;
    padding: 5px 9px;
    border-radius: 999px;
    background: var(--donation-gold);
    color: #171209;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .donation-campaign-card__body {
    padding: 22px;
  }

  .donation-campaign-card h2 {
    margin: 0;
    color: #ece8e1;
    font-size: 17px;
    line-height: 1.35;
  }

  .donation-campaign-card__id {
    margin: 3px 0 22px;
    color: #777;
    font-size: 14px;
    letter-spacing: 0.08em;
  }

  .donation-summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin: 13px 0;
    color: #9c9c9c;
    font-size: 14px;
  }

  .donation-summary-row strong {
    color: #d8d3cb;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
  }

  .donation-summary-row--total {
    margin-top: 15px;
    padding-top: 16px;
    border-top: 1px solid #2a2a2a;
  }

  .donation-summary-row--total strong {
    color: var(--donation-gold);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 23px;
    font-weight: 600;
  }

  .donation-summary-note {
    margin-top: 20px;
    padding: 13px;
    border: 1px solid rgba(231, 198, 121, 0.12);
    border-radius: 8px;
    background: rgba(231, 198, 121, 0.04);
    color: #87827b;
    font-size: 14px;
    line-height: 1.55;
  }

  .donation-security-note {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    margin-top: 15px;
    color: #7d7d7d;
    font-size: 14px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .donation-payment-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 40px;
    width: min(100%, 960px);
    margin: 0 auto;
    align-items: start;
  }

  .donation-payment-title {
    font-family: "DM Sans", Inter, Arial, sans-serif;
    font-size: 34px;
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .donation-demo-badge {
    display: inline-flex;
    align-items: center;
    min-height: 25px;
    margin-bottom: 14px;
    padding: 5px 10px;
    border: 1px solid rgba(231, 198, 121, 0.28);
    border-radius: 999px;
    color: var(--donation-gold);
    background: rgba(231, 198, 121, 0.08);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .donation-payment-copy {
    max-width: 400px;
    margin: 11px 0 25px;
    color: #9a9a9a;
    font-size: 14px;
    line-height: 1.6;
  }

  .donation-payment-group + .donation-payment-group {
    margin-top: 22px;
  }

  .donation-payment-group__title {
    margin: 0 0 10px;
    color: var(--donation-gold);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.07em;
  }

  .donation-method-list {
    display: grid;
    gap: 9px;
  }

  .donation-method {
    display: grid;
    grid-template-columns: 58px minmax(0, 1fr) 22px;
    align-items: center;
    gap: 13px;
    min-height: 66px;
    padding: 11px 13px;
    border: 1px solid #292929;
    border-radius: 10px;
    background: #151515;
    color: #fff;
    text-align: left;
    cursor: pointer;
    transition: border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
  }

  .donation-method:hover {
    transform: translateX(3px);
    border-color: rgba(231, 198, 121, 0.45);
  }

  .donation-method.is-active {
    border-color: var(--donation-gold);
    background: linear-gradient(110deg, rgba(231, 198, 121, 0.07), #151515 70%);
    box-shadow: 0 0 26px rgba(231, 198, 121, 0.08);
  }

  .donation-method__icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 40px;
    padding: 4px;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }

  .donation-method__icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .donation-method strong {
    display: block;
    color: #dcd8d1;
    font-size: 14px;
  }

  .donation-method__description {
    display: block;
    margin-top: 3px;
    color: #777;
    font-size: 14px;
  }

  .donation-method__copy {
    min-width: 0;
  }

  .donation-method__radio {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border: 1px solid #585858;
    border-radius: 999px;
  }

  .donation-method.is-active .donation-method__radio {
    border-color: var(--donation-gold);
    background: var(--donation-gold);
    box-shadow: inset 0 0 0 5px #17120b;
  }

  .donation-summary-card {
    padding: 24px 23px;
  }

  .donation-summary-card h2 {
    margin: 0 0 21px;
    color: var(--donation-gold);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 22px;
    line-height: 1.2;
  }

  .donation-summary-card__amount {
    display: block;
    margin: 18px 0 4px;
    color: var(--donation-gold);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 35px;
    line-height: 1;
    text-align: right;
  }

  .donation-summary-card__caption {
    margin: 0 0 20px;
    color: #878787;
    font-size: 14px;
    text-align: right;
  }

  .donation-trust-list {
    display: grid;
    gap: 13px;
    margin-top: 23px;
    color: #858585;
    font-size: 14px;
  }

  .donation-trust-list span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .donation-success-header {
    display: grid;
    justify-items: center;
    gap: 14px;
    text-align: center;
  }

  .donation-success-icon {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin: 0 auto 5px;
    border: 1px solid rgba(231, 198, 121, 0.28);
    border-radius: 999px;
    background: rgba(231, 198, 121, 0.13);
    color: var(--donation-gold);
    box-shadow: 0 0 34px rgba(231, 198, 121, 0.1);
  }

  .donation-success-title {
    max-width: 680px;
    margin: 0;
    color: var(--donation-gold);
    font-size: clamp(38px, 6vw, 57px);
    line-height: 1.12;
    text-wrap: balance;
  }

  .donation-success-copy {
    max-width: 560px;
    margin: 0;
    font-size: 14px;
    line-height: 1.75;
    text-wrap: balance;
  }

  .donation-certificate {
    position: relative;
    overflow: hidden;
    width: min(100%, 520px);
    margin: 34px auto 0;
    padding: 32px 34px 26px;
    border: 1px solid rgba(231, 198, 121, 0.12);
    border-radius: 15px;
    background:
      radial-gradient(circle at 92% 10%, rgba(231, 198, 121, 0.08), transparent 22%),
      #151515;
    text-align: left;
  }

  .donation-certificate__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #292929;
  }

  .donation-certificate__eyebrow {
    margin: 0;
    color: var(--donation-gold);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.09em;
  }

  .donation-certificate__subtitle {
    margin: 4px 0 0;
    color: #b5b0a8;
    font-size: 14px;
  }

  .donation-certificate__badge {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: var(--donation-gold);
    color: #171209;
  }

  .donation-certificate__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px 28px;
    padding: 22px 0 20px;
    border-bottom: 1px solid #292929;
  }

  .donation-certificate__field span {
    display: block;
    color: #898989;
    font-size: 14px;
  }

  .donation-certificate__field strong {
    display: block;
    margin-top: 4px;
    color: #e8e3dc;
    font-size: 14px;
  }

  .donation-certificate__field strong.is-gold {
    color: var(--donation-gold);
  }

  .donation-certificate blockquote {
    margin: 19px 0 22px;
    color: #a6a19a;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 14px;
    font-style: italic;
    line-height: 1.6;
  }

  .donation-certificate__actions,
  .donation-success-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .donation-secondary-button,
  .donation-outline-button {
    min-height: 42px;
    padding: 0 15px;
  }

  .donation-secondary-button {
    border: 1px solid rgba(231, 198, 121, 0.35);
    background: rgba(231, 198, 121, 0.1);
    color: var(--donation-gold);
  }

  .donation-outline-button {
    border: 1px solid #333;
    background: #202020;
    color: #e0ddd7;
  }

  .donation-success-actions {
    justify-content: center;
    margin-top: 34px;
  }

  .donation-success-actions .donation-primary-button,
  .donation-success-actions .donation-outline-button {
    width: auto;
    min-width: 190px;
    margin: 0;
    padding: 0 20px;
  }

  .donation-error {
    margin: 8px 0 0;
    color: #ff8f8f;
    font-size: 14px;
  }

  [data-donation-reveal] {
    opacity: 0;
    transform: translate3d(0, 22px, 0) scale(0.985);
    animation: donationReveal 640ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes donationReveal {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes donationPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(231, 198, 121, 0.08); }
    50% { box-shadow: 0 0 0 12px rgba(231, 198, 121, 0); }
  }

  .donation-success-icon {
    animation: donationReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) both, donationPulse 2.5s ease-in-out 700ms infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-donation-reveal],
    .donation-success-icon {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }

  @media (max-width: 900px) {
    .donation-two-column,
    .donation-payment-layout {
      grid-template-columns: 1fr;
      width: min(100%, 650px);
      margin: 0 auto;
    }

    .donation-campaign-card,
    .donation-summary-card {
      position: static;
    }

    .donation-payment-options {
      order: 1;
    }

    .donation-payment-layout .donation-summary-card {
      order: 2;
      margin-top: 6px;
    }

    .donation-campaign-card {
      display: grid;
      grid-template-columns: minmax(180px, 0.75fr) 1fr;
    }

    .donation-campaign-card__image {
      height: 100%;
      min-height: 260px;
    }
  }

  @media (max-width: 640px) {
    .donation-main {
      padding: 104px 16px 72px;
    }

    .donation-stepper {
      margin-bottom: 26px;
    }

    .donation-stepper__item {
      width: 82px;
    }

    .donation-stepper__item:not(:last-child)::after {
      width: 30px;
      left: calc(50% + 25px);
    }

    .donation-card--nominal {
      padding: 28px 20px 24px;
    }

    .donation-heading h1 {
      font-size: 26px;
    }

    .donation-amount-grid,
    .donation-form-grid,
    .donation-certificate__grid {
      grid-template-columns: 1fr;
    }

    .donation-form-grid__wide {
      grid-column: auto;
    }

    .donation-campaign-card {
      display: block;
    }

    .donation-campaign-card__image {
      min-height: 190px;
      height: 190px;
    }

    .donation-content-header h1,
    .donation-payment-title {
      font-size: 30px;
    }

    .donation-success-title {
      font-size: clamp(34px, 10vw, 42px);
      line-height: 1.15;
    }

    .donation-success-copy {
      font-size: 14px;
      line-height: 1.7;
    }

    .donation-method {
      grid-template-columns: 54px minmax(0, 1fr) 20px;
      padding: 11px;
    }

    .donation-method__icon {
      width: 52px;
    }

    .donation-certificate {
      padding: 26px 22px 22px;
    }

    .donation-certificate__actions,
    .donation-success-actions {
      flex-direction: column;
    }

    .donation-certificate__actions > *,
    .donation-success-actions .donation-primary-button,
    .donation-success-actions .donation-outline-button {
      width: 100%;
    }
  }
`;
