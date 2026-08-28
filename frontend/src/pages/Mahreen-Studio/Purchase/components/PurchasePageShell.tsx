import { useEffect, useState, type ReactNode } from "react";
import StudioNavbar from "../../../../components/Navbar/StudioNavbar";
import ClosingSection from "../../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../../components/Footer/Footer";

type PurchasePageShellProps = {
  pageClassName: string;
  styleName: string;
  styles: string;
  children: ReactNode;
  showClosing?: boolean;
  showFooter?: boolean;
};

const sharedPurchaseMotionStyles = `
  .studio-purchase-page {
    position: relative;
    overflow-x: clip;
    isolation: isolate;
  }

  .studio-purchase-page::before,
  .studio-purchase-page::after {
    content: "";
    position: fixed;
    pointer-events: none;
    z-index: -1;
    opacity: 0;
    filter: blur(2px);
    transform: translate3d(0, -22px, 0) scale(0.94);
    transition:
      opacity 1050ms ease,
      transform 1250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .studio-purchase-page::before {
    inset: 76px auto auto -12vw;
    width: 54vw;
    height: 520px;
    background: radial-gradient(circle, rgba(229, 196, 131, 0.14), transparent 67%);
  }

  .studio-purchase-page::after {
    inset: 118px -18vw auto auto;
    width: 48vw;
    height: 460px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.055), transparent 69%);
    transition-delay: 90ms;
  }

  .studio-purchase-page.is-entered::before,
  .studio-purchase-page.is-entered::after {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  .studio-purchase-page main > * {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
  }

  .studio-purchase-page.is-entered main > * {
    animation: studioPurchaseReveal 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .studio-purchase-page.is-entered main > *:nth-child(2) { animation-delay: 70ms; }
  .studio-purchase-page.is-entered main > *:nth-child(3) { animation-delay: 130ms; }
  .studio-purchase-page.is-entered main > *:nth-child(4) { animation-delay: 190ms; }

  .studio-purchase-page .card,
  .studio-purchase-page .summary-card,
  .studio-purchase-page .confirmation-card,
  .studio-purchase-page .search-card,
  .studio-purchase-page .shipment-card,
  .studio-purchase-page .timer-banner {
    transition:
      transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 320ms ease,
      box-shadow 320ms ease,
      background-color 320ms ease;
  }

  @media (hover: hover) and (pointer: fine) {
    .studio-purchase-page .card:hover,
    .studio-purchase-page .summary-card:hover,
    .studio-purchase-page .search-card:hover,
    .studio-purchase-page .shipment-card:hover {
      transform: translateY(-4px);
      border-color: rgba(229, 196, 131, 0.23);
      box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.48),
        0 0 30px rgba(229, 196, 131, 0.055);
    }
  }

  .studio-purchase-page button,
  .studio-purchase-page [role="button"] {
    -webkit-tap-highlight-color: transparent;
  }

  .studio-purchase-page button[class*="btn-"] {
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }

  .studio-purchase-page button[class*="btn-"]::after {
    content: "";
    position: absolute;
    inset: -90% auto -90% -38%;
    width: 24%;
    z-index: -1;
    opacity: 0;
    transform: rotate(16deg) translateX(-220%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.34), transparent);
    transition: transform 640ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease;
  }

  .studio-purchase-page button[class*="btn-"]:hover::after,
  .studio-purchase-page button[class*="btn-"]:focus-visible::after {
    opacity: 1;
    transform: rotate(16deg) translateX(720%);
  }

  .checkout-forms__fields {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .studio-purchase-page button:focus-visible,
  .studio-purchase-page a:focus-visible,
  .studio-purchase-page input:focus-visible,
  .studio-purchase-page textarea:focus-visible,
  .studio-purchase-page select:focus-visible {
    outline: 2px solid rgba(229, 196, 131, 0.78);
    outline-offset: 3px;
  }

  .purchase-empty {
    min-height: 100svh;
    padding: 132px 24px 72px;
    display: grid;
    place-items: center;
    position: relative;
    overflow: hidden;
  }

  .purchase-empty__orb {
    position: absolute;
    width: min(70vw, 680px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(229, 196, 131, 0.12), transparent 68%);
    animation: purchaseEmptyFloat 7s ease-in-out infinite alternate;
  }

  .purchase-empty__card {
    position: relative;
    width: min(100%, 620px);
    padding: clamp(36px, 6vw, 64px);
    text-align: center;
    border: 1px solid rgba(229, 196, 131, 0.2);
    border-radius: 28px;
    background: rgba(14, 14, 14, 0.88);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(22px);
  }

  .purchase-empty__eyebrow {
    margin: 0 0 15px;
    color: #e5c483;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .purchase-empty__title {
    margin: 0;
    color: #f4efe6;
    font-family: "Playfair Display", serif;
    font-size: clamp(30px, 5vw, 48px);
    font-weight: 500;
    line-height: 1.08;
  }

  .purchase-empty__description {
    max-width: 480px;
    margin: 20px auto 30px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 15px;
    line-height: 1.75;
  }

  .purchase-empty__action {
    min-height: 52px;
    padding: 0 24px;
    border: 1px solid #e5c483;
    border-radius: 999px;
    background: #e5c483;
    color: #171105;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
  }

  .purchase-empty__action:hover {
    transform: translateY(-2px);
    background: #f1d79f;
    box-shadow: 0 14px 34px rgba(229, 196, 131, 0.24);
  }

  @keyframes studioPurchaseReveal {
    from { opacity: 0; transform: translate3d(0, 22px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }

  @keyframes purchaseEmptyFloat {
    from { transform: translate3d(-3%, -2%, 0) scale(0.94); }
    to { transform: translate3d(4%, 3%, 0) scale(1.05); }
  }

  @media (prefers-reduced-motion: reduce) {
    .studio-purchase-page::before,
    .studio-purchase-page::after,
    .studio-purchase-page main > *,
    .purchase-empty__orb {
      opacity: 1 !important;
      transform: none !important;
      animation: none !important;
      transition: none !important;
    }
  }
`;

const PurchasePageShell = ({
  pageClassName,
  styleName,
  styles,
  children,
  showClosing = true,
  showFooter = true,
}: PurchasePageShellProps) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`${pageClassName} studio-purchase-page ${entered ? "is-entered" : ""}`}>
      <style data-component={styleName}>{`${styles}\n${sharedPurchaseMotionStyles}`}</style>
      <StudioNavbar />
      {children}
      {showClosing ? <ClosingSection /> : null}
      {showFooter ? <Footer /> : null}
    </div>
  );
};

export default PurchasePageShell;
