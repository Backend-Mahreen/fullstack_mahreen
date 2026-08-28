import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheckBig,
  Clock3,
  ExternalLink,
  LayoutDashboard,
  QrCode,
  ShieldCheck,
  TicketCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatRupiah,
  getWebinarDetailPath,
  getWebinarPaymentPath,
  getWebinarRegistrationPath,
  type WebinarData,
} from "../../../../data/webinars";
import {
  getWebinarPaymentMethodLabel,
  readWebinarPayment,
} from "../../../../services/webinarPaymentStorage";
import { readWebinarRegistration } from "../../../../services/webinarRegistrationStorage";
import {
  readWebinarSuccess,
  saveWebinarSuccess,
  type StoredWebinarSuccess,
} from "../../../../services/webinarSuccessStorage";
import {
  getHashHref,
  handleHashRouteClick,
  navigateToHashRoute,
} from "../../../../utils/hashNavigation";

const styles = `
  .webinar-success {
    width: min(100%, 820px);
    margin-inline: auto;
    text-align: center;
  }

  .webinar-success__intro {
    opacity: 0;
    transform: translateY(20px);
    animation: webinarSuccessRise 720ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
  }

  .webinar-success__seal {
    position: relative;
    display: inline-flex;
    width: 74px;
    height: 74px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(211, 178, 100, 0.48);
    border-radius: 50%;
    color: #dfbf71;
    background:
      radial-gradient(circle, rgba(212, 181, 104, 0.2), rgba(212, 181, 104, 0.05) 54%, transparent 55%),
      #090805;
    box-shadow:
      0 0 0 13px rgba(212, 181, 104, 0.035),
      0 20px 46px rgba(0, 0, 0, 0.5);
    animation: webinarSuccessSeal 720ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both;
  }

  .webinar-success__seal svg {
    width: 28px;
    height: 28px;
    stroke-width: 2.3;
  }

  .webinar-success__particle {
    position: absolute;
    display: inline-flex;
    width: 17px;
    height: 17px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #30240e;
    background: #d8b766;
    box-shadow: 0 6px 16px rgba(212, 181, 104, 0.22);
    animation: webinarSuccessFloat 3.4s ease-in-out infinite;
  }

  .webinar-success__particle svg {
    width: 8px;
    height: 8px;
  }

  .webinar-success__particle--one {
    top: -8px;
    right: -8px;
  }

  .webinar-success__particle--two {
    top: 11px;
    right: -24px;
    width: 9px;
    height: 9px;
    animation-delay: 420ms;
  }

  .webinar-success__title {
    margin: 32px 0 0;
    color: #d9b766;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(38px, 6vw, 58px);
    font-weight: 600;
    line-height: 1.04;
    letter-spacing: -0.045em;
  }

  .webinar-success__subtitle {
    max-width: 560px;
    margin: 12px auto 0;
    color: rgba(255, 255, 255, 0.63);
    font-size: 12px;
    line-height: 1.65;
  }

  .webinar-success__ticket {
    position: relative;
    width: min(100%, 400px);
    margin: 38px auto 0;
    padding: 27px 27px 23px;
    overflow: visible;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    background:
      radial-gradient(circle at 90% 6%, rgba(212, 181, 104, 0.055), transparent 31%),
      linear-gradient(145deg, #11110f 0%, #080808 58%, #0b0b0a 100%);
    box-shadow:
      0 30px 90px rgba(0, 0, 0, 0.52),
      inset 0 1px 0 rgba(255, 255, 255, 0.02);
    text-align: left;
    opacity: 0;
    transform: translateY(26px) scale(0.985);
    animation: webinarSuccessTicket 760ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both;
  }

  .webinar-success__ticket::before,
  .webinar-success__ticket::after {
    position: absolute;
    top: 155px;
    width: 19px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    content: "";
    background: #000;
  }

  .webinar-success__ticket::before {
    left: -10px;
    border-left: 0;
    border-radius: 0 22px 22px 0;
  }

  .webinar-success__ticket::after {
    right: -10px;
    border-right: 0;
    border-radius: 22px 0 0 22px;
  }

  .webinar-success-ticket__header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 38px;
    gap: 18px;
    align-items: start;
  }

  .webinar-success-ticket__eyebrow {
    display: block;
    color: #d4b568;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .webinar-success-ticket__title {
    margin: 8px 0 0;
    color: rgba(255, 255, 255, 0.91);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
  }

  .webinar-success-ticket__award {
    display: inline-flex;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #d5b76d;
    background: rgba(255, 255, 255, 0.055);
  }

  .webinar-success-ticket__award svg {
    width: 17px;
    height: 17px;
  }

  .webinar-success-ticket__schedule {
    display: grid;
    margin-top: 21px;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .webinar-success-ticket__schedule span {
    display: block;
    color: rgba(255, 255, 255, 0.45);
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .webinar-success-ticket__schedule strong {
    display: flex;
    margin-top: 7px;
    gap: 6px;
    align-items: center;
    color: rgba(255, 255, 255, 0.82);
    font-size: 10px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
  }

  .webinar-success-ticket__schedule svg {
    width: 12px;
    height: 12px;
    color: #d2b36a;
  }

  .webinar-success-ticket__separator {
    position: relative;
    height: 1px;
    margin: 25px -27px 0;
    border: 0;
    background: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.11) 0 7px,
      transparent 7px 13px
    );
  }

  .webinar-success-ticket__visual {
    position: relative;
    width: 132px;
    margin: 30px auto 0;
    padding: 7px;
    overflow: hidden;
    border: 6px solid #f7f7f3;
    border-radius: 13px;
    background: #fff;
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.34);
  }

  .webinar-success-ticket__image {
    display: block;
    width: 100%;
    aspect-ratio: 0.94;
    border-radius: 4px;
    object-fit: cover;
    filter: brightness(0.72) saturate(0.85);
  }

  .webinar-success-ticket__qr {
    position: absolute;
    right: 13px;
    bottom: 13px;
    display: grid;
    width: 49px;
    height: 49px;
    padding: 4px;
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: repeat(11, 1fr);
    gap: 1px;
    background: #f7f7f3;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.28);
  }

  .webinar-success-ticket__qr-cell {
    background: transparent;
  }

  .webinar-success-ticket__qr-cell.is-filled {
    background: #111;
  }

  .webinar-success-ticket__number-label {
    display: block;
    margin-top: 24px;
    color: rgba(255, 255, 255, 0.47);
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-align: center;
    text-transform: uppercase;
  }

  .webinar-success-ticket__number {
    margin: 8px 0 0;
    color: #d8b96d;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 25px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-align: center;
  }

  .webinar-success-ticket__member {
    display: flex;
    margin-top: 22px;
    padding-top: 18px;
    gap: 11px;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.09);
  }

  .webinar-success-ticket__avatar {
    display: inline-flex;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 181, 104, 0.3);
    border-radius: 50%;
    color: #f2dec0;
    background:
      radial-gradient(circle at 35% 30%, rgba(212, 181, 104, 0.32), transparent 36%),
      #171512;
    font-size: 10px;
    font-weight: 700;
  }

  .webinar-success-ticket__member-copy {
    min-width: 0;
    flex: 1;
  }

  .webinar-success-ticket__member-copy strong,
  .webinar-success-ticket__member-copy span {
    display: block;
  }

  .webinar-success-ticket__member-copy strong {
    overflow: hidden;
    color: rgba(255, 255, 255, 0.85);
    font-size: 10px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .webinar-success-ticket__member-copy span {
    margin-top: 2px;
    color: #d4b568;
    font-size: 9px;
  }

  .webinar-success-ticket__verified {
    display: inline-flex;
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #d4b568;
  }

  .webinar-success-ticket__verified svg {
    width: 17px;
    height: 17px;
  }

  .webinar-success__actions {
    display: grid;
    width: min(100%, 400px);
    margin: 24px auto 0;
    grid-template-columns: 1.05fr 1fr;
    gap: 13px;
    opacity: 0;
    transform: translateY(18px);
    animation: webinarSuccessRise 660ms cubic-bezier(0.16, 1, 0.3, 1) 510ms both;
  }

  .webinar-success__action {
    display: inline-flex;
    min-height: 55px;
    padding: 13px 18px;
    gap: 9px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 181, 104, 0.23);
    border-radius: 9px;
    color: rgba(255, 255, 255, 0.8);
    background: linear-gradient(145deg, #0d0d0d, #070707);
    font: inherit;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-decoration: none;
    cursor: pointer;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      background-color 180ms ease;
  }

  .webinar-success__action:hover,
  .webinar-success__action:focus-visible {
    border-color: rgba(214, 183, 105, 0.56);
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }

  .webinar-success__action--primary {
    border-color: #d9b968;
    color: #171208;
    background: #d8b767;
    box-shadow: 0 13px 28px rgba(212, 181, 104, 0.12);
  }

  .webinar-success__action--primary:hover,
  .webinar-success__action--primary:focus-visible {
    border-color: #e5ca84;
    background: #e1c378;
  }

  .webinar-success__action svg {
    width: 16px;
    height: 16px;
  }

  .webinar-success__help {
    margin: 24px 0 0;
    color: rgba(255, 255, 255, 0.47);
    font-size: 9px;
    opacity: 0;
    animation: webinarSuccessFade 520ms ease 720ms both;
  }

  .webinar-success__help a {
    color: #d4b568;
    text-decoration: none;
  }

  .webinar-success-empty {
    width: min(100%, 560px);
    margin-inline: auto;
    padding: 38px;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 18px;
    background: linear-gradient(145deg, rgba(15, 15, 15, 0.98), rgba(6, 6, 6, 0.98));
    text-align: center;
    opacity: 0;
    transform: translateY(18px);
    animation: webinarSuccessRise 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-success-empty__icon {
    display: inline-flex;
    width: 54px;
    height: 54px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #d4b568;
    background: rgba(212, 181, 104, 0.08);
  }

  .webinar-success-empty__icon svg {
    width: 24px;
    height: 24px;
  }

  .webinar-success-empty h1 {
    margin: 21px 0 0;
    color: #f0eae1;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 31px;
    font-weight: 500;
  }

  .webinar-success-empty p {
    margin: 11px auto 0;
    color: rgba(255, 255, 255, 0.58);
    font-size: 12px;
    line-height: 1.65;
  }

  .webinar-success-empty__actions {
    display: flex;
    margin-top: 24px;
    gap: 11px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .webinar-dashboard-modal {
    position: fixed;
    z-index: 2000;
    inset: 0;
    display: grid;
    padding: 20px;
    place-items: center;
    background: rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(11px);
    animation: webinarSuccessFade 220ms ease both;
  }

  .webinar-dashboard-modal__panel {
    position: relative;
    width: min(100%, 610px);
    max-height: min(780px, calc(100dvh - 40px));
    padding: 29px;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 20px;
    background:
      radial-gradient(circle at 90% 4%, rgba(212, 181, 104, 0.08), transparent 31%),
      #0a0a09;
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.72);
    text-align: left;
    transform-origin: center;
    animation: webinarSuccessModal 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-dashboard-modal__close {
    position: absolute;
    top: 18px;
    right: 18px;
    display: inline-flex;
    width: 35px;
    height: 35px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.65);
    background: rgba(255, 255, 255, 0.035);
    cursor: pointer;
  }

  .webinar-dashboard-modal__close svg {
    width: 17px;
    height: 17px;
  }

  .webinar-dashboard-modal__eyebrow {
    display: flex;
    gap: 8px;
    align-items: center;
    color: #d4b568;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .webinar-dashboard-modal__eyebrow svg {
    width: 15px;
    height: 15px;
  }

  .webinar-dashboard-modal h2 {
    margin: 14px 42px 0 0;
    color: #f2ede7;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 32px;
    font-weight: 500;
  }

  .webinar-dashboard-modal__status {
    display: inline-flex;
    margin-top: 16px;
    padding: 7px 11px;
    gap: 7px;
    align-items: center;
    border: 1px solid rgba(112, 191, 126, 0.24);
    border-radius: 999px;
    color: #a7ddb0;
    background: rgba(112, 191, 126, 0.08);
    font-size: 9px;
    font-weight: 600;
  }

  .webinar-dashboard-modal__status svg {
    width: 13px;
    height: 13px;
  }

  .webinar-dashboard-modal__grid {
    display: grid;
    margin-top: 25px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .webinar-dashboard-modal__item {
    min-width: 0;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.025);
  }

  .webinar-dashboard-modal__item span,
  .webinar-dashboard-modal__item strong {
    display: block;
  }

  .webinar-dashboard-modal__item span {
    color: rgba(255, 255, 255, 0.38);
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .webinar-dashboard-modal__item strong {
    margin-top: 7px;
    overflow-wrap: anywhere;
    color: rgba(255, 255, 255, 0.81);
    font-size: 11px;
    font-weight: 500;
    line-height: 1.45;
  }

  .webinar-dashboard-modal__footer {
    display: flex;
    margin-top: 23px;
    gap: 11px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  @keyframes webinarSuccessRise {
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarSuccessSeal {
    from { opacity: 0; transform: scale(0.48) rotate(-18deg); }
    70% { opacity: 1; transform: scale(1.07) rotate(2deg); }
    to { opacity: 1; transform: scale(1) rotate(0); }
  }

  @keyframes webinarSuccessTicket {
    to { opacity: 1; transform: none; }
  }

  @keyframes webinarSuccessFloat {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-5px) rotate(10deg); }
  }

  @keyframes webinarSuccessFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes webinarSuccessModal {
    from { opacity: 0; transform: translateY(18px) scale(0.97); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 560px) {
    .webinar-success__ticket {
      padding: 23px 21px 20px;
      border-radius: 17px;
    }

    .webinar-success-ticket__separator {
      margin-inline: -21px;
    }

    .webinar-success__actions {
      grid-template-columns: 1fr;
    }

    .webinar-dashboard-modal__panel {
      padding: 24px 18px;
    }

    .webinar-dashboard-modal__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .webinar-success__intro,
    .webinar-success__seal,
    .webinar-success__ticket,
    .webinar-success__actions,
    .webinar-success__help,
    .webinar-success-empty,
    .webinar-dashboard-modal,
    .webinar-dashboard-modal__panel,
    .webinar-success__particle {
      opacity: 1;
      animation: none !important;
      transform: none;
    }
  }
`;

type SuccessContentProps = {
  webinar: WebinarData;
};

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "MI";
};

const createQrPattern = (value: string) => {
  let seed = Array.from(value).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 11),
    0,
  );

  return Array.from({ length: 121 }, (_, index) => {
    const row = Math.floor(index / 11);
    const column = index % 11;
    const inTopLeft = row < 4 && column < 4;
    const inTopRight = row < 4 && column > 6;
    const inBottomLeft = row > 6 && column < 4;

    if (inTopLeft || inTopRight || inBottomLeft) {
      const localRow = row > 6 ? row - 7 : row;
      const localColumn = column > 6 ? column - 7 : column;
      return (
        localRow === 0 ||
        localRow === 3 ||
        localColumn === 0 ||
        localColumn === 3 ||
        (localRow === 1 && localColumn === 1) ||
        (localRow === 2 && localColumn === 2)
      );
    }

    seed = (seed * 9301 + 49297 + index * 17) % 233280;
    return seed / 233280 > 0.54;
  });
};

const SuccessContent = ({ webinar }: SuccessContentProps) => {
  const [success] = useState<StoredWebinarSuccess | null>(() => {
    const storedSuccess = readWebinarSuccess(webinar.slug);

    if (storedSuccess) return storedSuccess;

    const registration = readWebinarRegistration(webinar.slug);
    const payment = readWebinarPayment(webinar.slug);

    if (!registration || !payment) return null;

    return saveWebinarSuccess(webinar, registration, payment);
  });
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const qrPattern = useMemo(
    () => createQrPattern(success?.registrationNumber ?? webinar.slug),
    [success?.registrationNumber, webinar.slug],
  );

  useEffect(() => {
    if (!dashboardOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDashboardOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dashboardOpen]);

  if (!success) {
    const registrationPath = getWebinarRegistrationPath(webinar.slug);
    const paymentPath = getWebinarPaymentPath(webinar.slug);

    return (
      <>
        <style>{styles}</style>
        <section className="webinar-success-empty" aria-labelledby="webinar-success-empty-title">
          <span className="webinar-success-empty__icon">
            <TicketCheck aria-hidden="true" />
          </span>
          <h1 id="webinar-success-empty-title">Tiket Belum Tersedia</h1>
          <p>
            {webinar.isFree
              ? "Tiket gratis akan tersedia setelah Anda melengkapi dan mengirim formulir pendaftaran."
              : "Halaman ini membutuhkan data pendaftaran dan simulasi pembayaran yang tersimpan di browser. Selesaikan Step 1 dan Step 2 terlebih dahulu."}
          </p>
          <div className="webinar-success-empty__actions">
            <a
              className="webinar-success__action webinar-success__action--primary"
              href={getHashHref(registrationPath)}
              onClick={(event) => handleHashRouteClick(event, registrationPath)}
            >
              {webinar.isFree ? "Isi Data Pendaftaran" : "Mulai dari Step 1"}
              <ArrowRight aria-hidden="true" />
            </a>
            {!webinar.isFree && (
              <a
                className="webinar-success__action"
                href={getHashHref(paymentPath)}
                onClick={(event) => handleHashRouteClick(event, paymentPath)}
              >
                Buka Step 2
              </a>
            )}
          </div>
        </section>
      </>
    );
  }

  const whatsappMessage = [
    "Pendaftaran Webinar Mahreen Indonesia Berhasil",
    `Nama: ${success.participantName}`,
    `Program: ${success.webinarTitle}`,
    `Nomor Registrasi: ${success.registrationNumber}`,
    `Jadwal: ${success.scheduleDate}, ${success.scheduleTime}`,
    `Status: Aktif`,
  ].join("\n");
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  const supportHref = `https://wa.me/6289652647385?text=${encodeURIComponent(
    `Halo Mahreen, saya membutuhkan bantuan untuk registrasi ${success.registrationNumber}.`,
  )}`;
  const detailPath = getWebinarDetailPath(webinar.slug);

  return (
    <>
      <style>{styles}</style>

      <section className="webinar-success" aria-labelledby="webinar-success-title">
        <header className="webinar-success__intro">
          <span className="webinar-success__seal" aria-hidden="true">
            <Check />
            <span className="webinar-success__particle webinar-success__particle--one">
              <CircleCheckBig />
            </span>
            <span className="webinar-success__particle webinar-success__particle--two" />
          </span>

          <h1 className="webinar-success__title" id="webinar-success-title">
            Pendaftaran Berhasil
          </h1>
          <p className="webinar-success__subtitle">
            Selamat! Anda telah resmi terdaftar untuk program eksklusif kami. Simpan tiket
            digital Anda di bawah ini untuk akses masuk.
          </p>
        </header>

        <article className="webinar-success__ticket" aria-label="Digital webinar ticket">
          <div className="webinar-success-ticket__header">
            <div>
              <span className="webinar-success-ticket__eyebrow">Program Webinar</span>
              <h2 className="webinar-success-ticket__title">{success.webinarTitle}</h2>
            </div>
            <span className="webinar-success-ticket__award" aria-hidden="true">
              <TicketCheck />
            </span>
          </div>

          <div className="webinar-success-ticket__schedule">
            <div>
              <span>Date</span>
              <strong>
                <CalendarDays aria-hidden="true" />
                {success.scheduleDate}
              </strong>
            </div>
            <div>
              <span>Time</span>
              <strong>
                <Clock3 aria-hidden="true" />
                {success.scheduleTime}
              </strong>
            </div>
          </div>

          <hr className="webinar-success-ticket__separator" />

          <div className="webinar-success-ticket__visual" aria-label="Digital access code">
            <img decoding="async"
              className="webinar-success-ticket__image"
              src={webinar.heroImage}
              alt={webinar.heroImageAlt}
            />
            <span className="webinar-success-ticket__qr" aria-hidden="true">
              {qrPattern.map((filled, index) => (
                <span
                  className={`webinar-success-ticket__qr-cell${filled ? " is-filled" : ""}`}
                  key={`${success.registrationNumber}-${index}`}
                />
              ))}
            </span>
          </div>

          <span className="webinar-success-ticket__number-label">Registration Number</span>
          <p className="webinar-success-ticket__number">{success.registrationNumber}</p>

          <div className="webinar-success-ticket__member">
            <span className="webinar-success-ticket__avatar" aria-hidden="true">
              {getInitials(success.participantName)}
            </span>
            <span className="webinar-success-ticket__member-copy">
              <strong>{success.participantName}</strong>
              <span>{webinar.isFree ? "Free Member" : "VIP Member"}</span>
            </span>
            <span className="webinar-success-ticket__verified" title="Verified registration">
              <ShieldCheck aria-hidden="true" />
            </span>
          </div>
        </article>

        <div className="webinar-success__actions">
          <button
            className="webinar-success__action webinar-success__action--primary"
            type="button"
            onClick={() => setDashboardOpen(true)}
          >
            <LayoutDashboard aria-hidden="true" />
            Enter Dashboard
          </button>
          <a
            className="webinar-success__action"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            <QrCode aria-hidden="true" />
            Sync with WhatsApp
          </a>
        </div>

        <p className="webinar-success__help">
          Butuh bantuan? <a href={supportHref} target="_blank" rel="noreferrer">Hubungi Support Mahreen</a>
        </p>
      </section>

      {dashboardOpen && (
        <div
          className="webinar-dashboard-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setDashboardOpen(false);
          }}
        >
          <section
            className="webinar-dashboard-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="webinar-dashboard-title"
          >
            <button
              className="webinar-dashboard-modal__close"
              type="button"
              aria-label="Tutup dashboard"
              onClick={() => setDashboardOpen(false)}
            >
              <X aria-hidden="true" />
            </button>

            <span className="webinar-dashboard-modal__eyebrow">
              <LayoutDashboard aria-hidden="true" />
              Simulated Webinar Dashboard
            </span>
            <h2 id="webinar-dashboard-title">Akses Webinar Anda</h2>
            <span className="webinar-dashboard-modal__status">
              <CircleCheckBig aria-hidden="true" />
              Registration Active
            </span>

            <div className="webinar-dashboard-modal__grid">
              <div className="webinar-dashboard-modal__item">
                <span>Participant</span>
                <strong>{success.participantName}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>Registration Number</span>
                <strong>{success.registrationNumber}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>Program</span>
                <strong>{success.webinarTitle}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>Schedule</span>
                <strong>{success.scheduleDate}, {success.scheduleTime}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>{webinar.isFree ? "Registration Type" : "Payment Method"}</span>
                <strong>{getWebinarPaymentMethodLabel(success.paymentMethod)}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>{webinar.isFree ? "Access Fee" : "Total Paid"}</span>
                <strong>{webinar.isFree ? "Gratis" : formatRupiah(success.totalPaid)}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>Email</span>
                <strong>{success.participantEmail}</strong>
              </div>
              <div className="webinar-dashboard-modal__item">
                <span>Institution</span>
                <strong>{success.participantInstitution || "Not provided"}</strong>
              </div>
            </div>

            <div className="webinar-dashboard-modal__footer">
              <button
                className="webinar-success__action"
                type="button"
                onClick={() => setDashboardOpen(false)}
              >
                Tutup
              </button>
              <button
                className="webinar-success__action webinar-success__action--primary"
                type="button"
                onClick={() => navigateToHashRoute(detailPath)}
              >
                Lihat Detail Webinar
                <ExternalLink aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default SuccessContent;
