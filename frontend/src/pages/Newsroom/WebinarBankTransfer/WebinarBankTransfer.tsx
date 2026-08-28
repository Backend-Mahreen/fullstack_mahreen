import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Headphones,
  HelpCircle,
  Info,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import bcaLogo from "../../../assets/Newsroom/payment-banks/bca.svg";
import bniLogo from "../../../assets/Newsroom/payment-banks/bni.svg";
import briLogo from "../../../assets/Newsroom/payment-banks/bri.svg";
import mandiriLogo from "../../../assets/Newsroom/payment-banks/mandiri.svg";
import {
  formatRupiah,
  getWebinarPaymentPath,
  getWebinarSuccessPath,
  type WebinarData,
} from "../../../data/webinars";
import {
  calculateWebinarPayment,
  getWebinarBankLabel,
  readWebinarBank,
  readWebinarPayment,
  type StoredWebinarPayment,
  type WebinarBank,
} from "../../../services/webinarPaymentStorage";
import {
  readWebinarRegistration,
  type StoredWebinarRegistration,
} from "../../../services/webinarRegistrationStorage";
import { saveWebinarSuccess } from "../../../services/webinarSuccessStorage";
import { webinarPaymentService } from "../../../services/webinar/webinarPaymentService";
import {
  getHashHref,
  handleHashRouteClick,
  navigateToHashRoute,
} from "../../../utils/hashNavigation";
import NewsroomLayout from "../layout/NewsroomLayout";

const bankAccounts: Record<
  WebinarBank,
  { accountNumber: string; accountName: string; logo: string }
> = {
  bca: {
    accountNumber: "1234567890",
    accountName: "Mahreen Indonesia Group",
    logo: bcaLogo,
  },
  mandiri: {
    accountNumber: "1390012345678",
    accountName: "Mahreen Indonesia Group",
    logo: mandiriLogo,
  },
  bni: {
    accountNumber: "988001234567",
    accountName: "Mahreen Indonesia Group",
    logo: bniLogo,
  },
  bri: {
    accountNumber: "5376595018806500",
    accountName: "Mahreen Indonesia Group",
    logo: briLogo,
  },
};

const formatCountdown = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${remainingSeconds}`;
};

const styles = `

  .webinar-bank-page {
    min-height: 100dvh;
    overflow-x: clip;
    color: #fff;
    background: #000;
    font-family: "DM Sans", Arial, sans-serif;
  }

  .webinar-bank-page,
  .webinar-bank-page *,
  .webinar-bank-page *::before,
  .webinar-bank-page *::after {
    box-sizing: border-box;
  }

  .webinar-bank-page__main {
    padding-top: var(--navbar-height, 74px);
  }

  .webinar-bank-page__section {
    min-height: 760px;
    padding: clamp(46px, 6vw, 80px) clamp(16px, 4vw, 48px) clamp(78px, 8vw, 108px);
    background:
      radial-gradient(circle at 50% 5%, rgba(214, 181, 104, 0.06), transparent 28%),
      #000;
  }

  .webinar-bank {
    width: min(100%, 980px);
    margin-inline: auto;
  }

  .webinar-bank__intro {
    text-align: center;
    opacity: 0;
    transform: translateY(22px);
    animation: bankRise 680ms cubic-bezier(0.16, 1, 0.3, 1) 70ms both;
  }

  .webinar-bank__step {
    display: inline-flex;
    min-height: 31px;
    padding: 7px 16px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(214, 181, 104, 0.14);
    border-radius: 999px;
    color: #dfbd68;
    background: rgba(214, 181, 104, 0.09);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
  }

  .webinar-bank__title {
    margin: 19px 0 0;
    color: #f0ece5;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 5vw, 48px);
    font-weight: 600;
    letter-spacing: -0.035em;
  }

  .webinar-bank__subtitle {
    margin: 12px auto 0;
    color: rgba(255, 255, 255, 0.63);
    font-size: 14px;
    line-height: 1.7;
  }

  .webinar-bank__grid {
    display: grid;
    margin-top: 42px;
    grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.82fr);
    gap: 28px;
    align-items: start;
  }

  .webinar-bank__column {
    display: grid;
    gap: 18px;
  }

  .webinar-bank-card {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 17px;
    background:
      radial-gradient(circle at 90% 2%, rgba(214, 181, 104, 0.055), transparent 31%),
      linear-gradient(145deg, #131311, #090909 64%);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.46);
    opacity: 0;
    transform: translateY(24px);
    animation: bankCard 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .webinar-bank-card--details {
    padding: 27px 29px;
    animation-delay: 190ms;
  }

  .webinar-bank-card--timer {
    padding: 28px;
    text-align: center;
    animation-delay: 260ms;
  }

  .webinar-bank-card--notice {
    padding: 20px 22px;
    animation-delay: 320ms;
  }

  .webinar-bank-card--support {
    padding: 18px;
    animation-delay: 380ms;
  }

  .webinar-bank__summary {
    display: flex;
    padding-bottom: 22px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .webinar-bank__eyebrow {
    display: block;
    color: rgba(255, 255, 255, 0.58);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .webinar-bank__amount {
    margin: 7px 0 0;
    color: #e1be6d;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(27px, 4vw, 39px);
    font-weight: 600;
  }

  .webinar-bank__order {
    text-align: right;
  }

  .webinar-bank__order strong {
    display: block;
    margin-top: 7px;
    color: rgba(255, 255, 255, 0.78);
    font-size: 11px;
    font-weight: 500;
  }

  .webinar-bank__account {
    display: grid;
    margin-top: 22px;
    padding: 17px;
    grid-template-columns: 58px minmax(0, 1fr) auto;
    gap: 15px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.045);
  }

  .webinar-bank__logo {
    display: flex;
    width: 58px;
    height: 46px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    background: #ffffff;
  }

  .webinar-bank__logo img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .webinar-bank__account-copy span,
  .webinar-bank__account-copy strong,
  .webinar-bank__account-copy small {
    display: block;
  }

  .webinar-bank__account-copy span {
    color: rgba(255, 255, 255, 0.58);
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .webinar-bank__account-copy strong {
    margin-top: 4px;
    color: #f2eee7;
    font-size: 18px;
    letter-spacing: 0.04em;
  }

  .webinar-bank__account-copy small {
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.48);
    font-size: 10px;
  }

  .webinar-bank__copy-button {
    display: inline-flex;
    min-height: 39px;
    padding: 8px 12px;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 7px;
    color: #dfbd68;
    background: rgba(255, 255, 255, 0.04);
    font-size: 10px;
    cursor: pointer;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .webinar-bank__copy-button:hover,
  .webinar-bank__copy-button:focus-visible {
    outline: none;
    border-color: rgba(223, 189, 104, 0.62);
    box-shadow: 0 0 22px rgba(223, 189, 104, 0.11);
    transform: translateY(-1px);
  }

  .webinar-bank__notice {
    display: flex;
    gap: 13px;
    align-items: flex-start;
  }

  .webinar-bank__notice-icon {
    display: inline-flex;
    width: 27px;
    height: 27px;
    flex: 0 0 27px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #dfbd68;
    background: rgba(214, 181, 104, 0.08);
  }

  .webinar-bank__notice-icon svg {
    width: 15px;
    height: 15px;
  }

  .webinar-bank__notice strong {
    display: block;
    color: rgba(255, 255, 255, 0.83);
    font-size: 12px;
  }

  .webinar-bank__notice p {
    margin: 6px 0 0;
    color: rgba(255, 255, 255, 0.58);
    font-size: 11px;
    line-height: 1.65;
  }

  .webinar-bank__timer-label {
    color: rgba(255, 255, 255, 0.62);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .webinar-bank__timer {
    margin: 13px 0 0;
    color: #e5c474;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 5vw, 48px);
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .webinar-bank__timer-line {
    width: 80%;
    height: 3px;
    margin: 17px auto 0;
    border-radius: 99px;
    background: linear-gradient(90deg, #c79f4e, #e1c275);
    box-shadow: 0 0 18px rgba(214, 181, 104, 0.18);
  }

  .webinar-bank__confirm {
    display: inline-flex;
    width: 100%;
    min-height: 54px;
    margin-top: 25px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(239, 207, 130, 0.72);
    border-radius: 7px;
    color: #30230f;
    background: linear-gradient(100deg, #cda95f, #dfbf75 54%, #c8a35a);
    box-shadow: 0 16px 38px rgba(212, 181, 104, 0.17);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
  }

  .webinar-bank__confirm:hover,
  .webinar-bank__confirm:focus-visible {
    outline: none;
    filter: brightness(1.08);
    transform: translateY(-2px);
    box-shadow:
      0 0 24px rgba(224, 192, 117, 0.28),
      0 20px 44px rgba(212, 181, 104, 0.24);
  }

  .webinar-bank__confirm svg {
    width: 15px;
    height: 15px;
  }

  .webinar-bank__help-link {
    display: inline-flex;
    margin-top: 13px;
    gap: 6px;
    align-items: center;
    color: rgba(255, 255, 255, 0.62);
    font-size: 10px;
  }

  .webinar-bank__security {
    display: grid;
    margin-top: 17px;
    gap: 8px;
    color: rgba(255, 255, 255, 0.48);
    font-size: 10px;
  }

  .webinar-bank__security span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .webinar-bank__security svg {
    width: 14px;
    height: 14px;
    color: #d8b86a;
  }

  .webinar-bank__support {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
  }

  .webinar-bank__support-icon {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    color: #dfbd68;
    background: rgba(214, 181, 104, 0.08);
  }

  .webinar-bank__support strong,
  .webinar-bank__support span {
    display: block;
  }

  .webinar-bank__support strong {
    color: rgba(255, 255, 255, 0.84);
    font-size: 11px;
  }

  .webinar-bank__support span {
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.46);
    font-size: 9px;
  }

  .webinar-bank__support a {
    color: #dfbd68;
    font-size: 9px;
  }

  .webinar-bank__missing {
    margin-top: 38px;
    padding: 25px;
    border: 1px solid rgba(214, 181, 104, 0.2);
    border-radius: 14px;
    color: rgba(255, 255, 255, 0.68);
    background: rgba(214, 181, 104, 0.05);
    text-align: center;
  }

  .webinar-bank__missing a {
    display: inline-flex;
    margin-top: 15px;
    gap: 7px;
    align-items: center;
    color: #e1c273;
  }

  @keyframes bankRise {
    to { opacity: 1; transform: none; }
  }

  @keyframes bankCard {
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 780px) {
    .webinar-bank__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .webinar-bank-card--details,
    .webinar-bank-card--timer {
      padding: 21px 18px;
    }

    .webinar-bank__summary {
      flex-direction: column;
    }

    .webinar-bank__order {
      text-align: left;
    }

    .webinar-bank__account {
      grid-template-columns: 48px minmax(0, 1fr);
    }

    .webinar-bank__logo {
      width: 48px;
    }

    .webinar-bank__copy-button {
      grid-column: 1 / -1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .webinar-bank__intro,
    .webinar-bank-card {
      opacity: 1;
      animation: none;
      transform: none;
    }
  }
`;

type WebinarBankTransferProps = {
  webinar: WebinarData;
};

const WebinarBankTransfer = ({ webinar }: WebinarBankTransferProps) => {
  const [secondsLeft, setSecondsLeft] = useState(24 * 60 * 60 - 3);
  const [copied, setCopied] = useState(false);
  const [payment] = useState<StoredWebinarPayment | null>(() =>
    readWebinarPayment(webinar.slug),
  );
  const [registration] = useState<StoredWebinarRegistration | null>(() =>
    readWebinarRegistration(webinar.slug),
  );
  const breakdown = useMemo(() => calculateWebinarPayment(webinar), [webinar]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const selectedBank = useMemo<WebinarBank>(
    () => payment?.bank ?? readWebinarBank(webinar.slug),
    [payment?.bank, webinar.slug],
  );
  const bank = bankAccounts[selectedBank];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bank.accountNumber);
    } catch {
      // Clipboard may be unavailable on an insecure local origin.
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleConfirm = async () => {
    if (!payment || !registration || isConfirming) return;
    setIsConfirming(true);
    setPaymentError("");

    try {
      const confirmedPayment = await webinarPaymentService.confirm(payment, registration);
      saveWebinarSuccess(webinar, registration, confirmedPayment);
      navigateToHashRoute(getWebinarSuccessPath(webinar.slug));
    } catch (caughtError) {
      setPaymentError(
        caughtError instanceof Error
          ? caughtError.message
          : "Pembayaran tidak dapat dikonfirmasi.",
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const paymentPath = getWebinarPaymentPath(webinar.slug);

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="webinar-bank-page">
          <main className="webinar-bank-page__main">
          <section className="webinar-bank-page__section" aria-label="Transfer bank webinar">
            <div className="webinar-bank">
              <header className="webinar-bank__intro">
                <span className="webinar-bank__step">Step 3 of 3</span>
                <h1 className="webinar-bank__title">Transfer Bank</h1>
                <p className="webinar-bank__subtitle">
                  Silakan lakukan transfer ke rekening resmi {getWebinarBankLabel(selectedBank)}
                  di bawah ini.
                </p>
              </header>

              {!payment || !registration ? (
                <div className="webinar-bank__missing">
                  Data pembayaran belum tersedia. Silakan pilih metode dan bank tujuan
                  terlebih dahulu.
                  <br />
                  <a
                    href={getHashHref(paymentPath)}
                    onClick={(event) => handleHashRouteClick(event, paymentPath)}
                  >
                    Kembali ke Step 2 <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              ) : (
                <div className="webinar-bank__grid">
                  <div className="webinar-bank__column">
                    <section className="webinar-bank-card webinar-bank-card--details">
                      <div className="webinar-bank__summary">
                        <div>
                          <span className="webinar-bank__eyebrow">Total Pembayaran</span>
                          <p className="webinar-bank__amount">
                            {formatRupiah(breakdown.total)}
                          </p>
                        </div>
                        <div className="webinar-bank__order">
                          <span className="webinar-bank__eyebrow">Order ID</span>
                          <strong>#{payment.id.replace("PAY-", "MVX-")}</strong>
                        </div>
                      </div>

                      <div className="webinar-bank__account">
                        <span className="webinar-bank__logo"><img decoding="async" loading="lazy" src={bank.logo} alt={getWebinarBankLabel(selectedBank)} /></span>
                        <span className="webinar-bank__account-copy">
                          <span>{getWebinarBankLabel(selectedBank)}</span>
                          <strong>{bank.accountNumber}</strong>
                          <small>a/n PT {bank.accountName}</small>
                        </span>
                        <button
                          className="webinar-bank__copy-button"
                          type="button"
                          onClick={handleCopy}
                        >
                          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                          {copied ? "Tersalin" : "Salin"}
                        </button>
                      </div>
                    </section>

                    <section className="webinar-bank-card webinar-bank-card--notice">
                      <div className="webinar-bank__notice">
                        <span className="webinar-bank__notice-icon">
                          <Info aria-hidden="true" />
                        </span>
                        <div>
                          <strong>Verifikasi Otomatis</strong>
                          <p>
                            Sistem akan memverifikasi pembayaran secara otomatis dalam 5–10
                            menit setelah transfer. Anda tidak perlu mengunggah bukti bayar,
                            kecuali terjadi kendala.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="webinar-bank__column">
                    <section className="webinar-bank-card webinar-bank-card--timer">
                      <span className="webinar-bank__timer-label">Batas Waktu Pembayaran</span>
                      <p className="webinar-bank__timer">{formatCountdown(secondsLeft)}</p>
                      <div className="webinar-bank__timer-line" aria-hidden="true" />

                      {paymentError && (
                        <p className="webinar-bank__help-link" role="alert">
                          <HelpCircle aria-hidden="true" />
                          {paymentError}
                        </p>
                      )}

                      <button
                        className="webinar-bank__confirm"
                        type="button"
                        onClick={handleConfirm} disabled={isConfirming}
                      >
                        {isConfirming ? "Memproses..." : "Sudah Melakukan Transfer"}
                        <CheckCircle2 aria-hidden="true" />
                      </button>

                      <a
                        className="webinar-bank__help-link"
                        href="https://wa.me/6289652647385?text=Halo%20Mahreen%2C%20saya%20membutuhkan%20bantuan%20pembayaran%20webinar."
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HelpCircle aria-hidden="true" />
                        Butuh bantuan? Hubungi CS
                      </a>
                    </section>

                    <div className="webinar-bank__security">
                      <span>
                        <LockKeyhole aria-hidden="true" />
                        Status pembayaran diverifikasi oleh server
                      </span>
                      <span>
                        <ShieldCheck aria-hidden="true" />
                        Jangan pernah membagikan PIN atau OTP
                      </span>
                    </div>

                    <section className="webinar-bank-card webinar-bank-card--support">
                      <div className="webinar-bank__support">
                        <span className="webinar-bank__support-icon">
                          <Headphones aria-hidden="true" />
                        </span>
                        <span>
                          <strong>Need assistance?</strong>
                          <span>Our support team is online.</span>
                        </span>
                        <a href="https://wa.me/6289652647385?text=Halo%20Mahreen%2C%20saya%20membutuhkan%20bantuan%20pembayaran%20webinar." target="_blank" rel="noreferrer">
                          Chat Now
                        </a>
                      </div>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </section>

          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default WebinarBankTransfer;
