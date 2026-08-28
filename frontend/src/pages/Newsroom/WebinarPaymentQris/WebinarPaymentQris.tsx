import {
  ArrowRight,
  Clock3,
  HelpCircle,
  LockKeyhole,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatRupiah,
  getWebinarPaymentPath,
  getWebinarSuccessPath,
  type WebinarData,
} from "../../../data/webinars";
import {
  calculateWebinarPayment,
  readWebinarPayment,
  type StoredWebinarPayment,
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

const QR_SIZE = 25;

const isFinderCell = (row: number, column: number) => {
  const finderOrigins = [
    [0, 0],
    [0, QR_SIZE - 7],
    [QR_SIZE - 7, 0],
  ];

  return finderOrigins.some(([startRow, startColumn]) => {
    const localRow = row - startRow;
    const localColumn = column - startColumn;

    if (localRow < 0 || localRow > 6 || localColumn < 0 || localColumn > 6) {
      return false;
    }

    const border =
      localRow === 0 || localRow === 6 || localColumn === 0 || localColumn === 6;
    const center =
      localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4;

    return border || center;
  });
};

const createQrPattern = (seed: string) => {
  const seedValue = [...seed].reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 7),
    131,
  );

  return Array.from({ length: QR_SIZE * QR_SIZE }, (_, index) => {
    const row = Math.floor(index / QR_SIZE);
    const column = index % QR_SIZE;

    if (isFinderCell(row, column)) return true;

    const value =
      (row * 47 + column * 71 + seedValue + ((row + 3) * (column + 5)) ** 2) %
      17;

    return value < 8;
  });
};

const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const styles = `

  .webinar-qris-page {
    min-height: 100dvh;
    overflow-x: clip;
    color: #fff;
    background: #000;
    font-family: "DM Sans", Arial, sans-serif;
  }

  .webinar-qris-page,
  .webinar-qris-page *,
  .webinar-qris-page *::before,
  .webinar-qris-page *::after {
    box-sizing: border-box;
  }

  .webinar-qris-page__main {
    padding-top: var(--navbar-height, 74px);
  }

  .webinar-qris-page__section {
    position: relative;
    display: grid;
    min-height: 820px;
    padding: clamp(46px, 6vw, 82px) 18px clamp(78px, 8vw, 112px);
    place-items: start center;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 4%, rgba(214, 181, 104, 0.07), transparent 28%),
      #000;
  }

  .webinar-qris {
    width: min(100%, 560px);
    text-align: center;
  }

  .webinar-qris__intro {
    opacity: 0;
    transform: translateY(22px);
    animation: qrisRise 680ms cubic-bezier(0.16, 1, 0.3, 1) 70ms both;
  }

  .webinar-qris__step {
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

  .webinar-qris__title {
    margin: 20px 0 0;
    color: #f1ece5;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(34px, 5vw, 48px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.035em;
  }

  .webinar-qris__subtitle {
    max-width: 650px;
    margin: 13px auto 0;
    color: rgba(255, 255, 255, 0.64);
    font-size: 14px;
    line-height: 1.7;
  }

  .webinar-qris__card {
    width: min(100%, 410px);
    margin: 38px auto 0;
    padding: 29px 27px 25px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 20px;
    background:
      radial-gradient(circle at 90% 4%, rgba(214, 181, 104, 0.07), transparent 31%),
      linear-gradient(145deg, #14130f, #090909 62%);
    box-shadow: 0 32px 95px rgba(0, 0, 0, 0.58);
    opacity: 0;
    transform: translateY(30px) scale(0.985);
    animation: qrisCard 740ms cubic-bezier(0.16, 1, 0.3, 1) 210ms both;
  }

  .webinar-qris__qr-shell {
    position: relative;
    width: min(100%, 260px);
    margin-inline: auto;
    padding: 17px;
    border-radius: 13px;
    background: #fff;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.36);
  }

  .webinar-qris__qr {
    display: grid;
    width: 100%;
    aspect-ratio: 1;
    padding: 7px;
    grid-template-columns: repeat(${QR_SIZE}, 1fr);
    grid-template-rows: repeat(${QR_SIZE}, 1fr);
    gap: 1px;
    background: #fff;
  }

  .webinar-qris__qr-cell {
    background: transparent;
  }

  .webinar-qris__qr-cell.is-filled {
    background: #0c0c0c;
  }

  .webinar-qris__qr-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    display: inline-flex;
    width: 46px;
    height: 46px;
    align-items: center;
    justify-content: center;
    border: 5px solid #fff;
    border-radius: 11px;
    color: #0d0d0d;
    background: #d9b96d;
    transform: translate(-50%, -50%);
  }

  .webinar-qris__qr-logo svg {
    width: 22px;
    height: 22px;
  }

  .webinar-qris__countdown {
    display: inline-flex;
    margin-top: 16px;
    gap: 7px;
    align-items: center;
    color: #dfbd68;
    font-size: 12px;
    font-weight: 600;
  }

  .webinar-qris__countdown svg {
    width: 15px;
    height: 15px;
  }

  .webinar-qris__invoice {
    display: grid;
    margin-top: 22px;
    padding: 17px 19px;
    grid-template-columns: 1fr auto;
    gap: 8px 18px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.035);
    text-align: left;
  }

  .webinar-qris__invoice span {
    color: rgba(255, 255, 255, 0.62);
    font-size: 11px;
  }

  .webinar-qris__invoice strong {
    color: #e5c475;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 24px;
    font-weight: 600;
  }

  .webinar-qris__invoice small {
    color: rgba(255, 255, 255, 0.43);
    font-size: 9px;
    text-align: right;
  }

  .webinar-qris__instruction {
    max-width: 310px;
    margin: 22px auto 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 11px;
    line-height: 1.7;
  }

  .webinar-qris__button {
    display: inline-flex;
    width: 100%;
    min-height: 55px;
    margin-top: 22px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border: 1px solid rgba(238, 205, 128, 0.7);
    border-radius: 7px;
    color: #30230f;
    background: linear-gradient(100deg, #cda95f, #dfbf75 54%, #c8a35a);
    box-shadow: 0 16px 38px rgba(212, 181, 104, 0.18);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
  }

  .webinar-qris__button:hover,
  .webinar-qris__button:focus-visible {
    outline: none;
    filter: brightness(1.08);
    transform: translateY(-2px);
    box-shadow:
      0 0 24px rgba(224, 192, 117, 0.28),
      0 20px 44px rgba(212, 181, 104, 0.24);
  }

  .webinar-qris__button svg {
    width: 16px;
    height: 16px;
  }

  .webinar-qris__help {
    display: flex;
    margin-top: 15px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
  }

  .webinar-qris__help a {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    color: #dfbd68;
  }

  .webinar-qris__security {
    display: flex;
    margin-top: 34px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 9px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    opacity: 0;
    animation: qrisRise 620ms ease 520ms both;
  }

  .webinar-qris__security svg {
    width: 14px;
    height: 14px;
  }

  .webinar-qris__missing {
    margin: 40px auto 0;
    padding: 25px;
    border: 1px solid rgba(214, 181, 104, 0.2);
    border-radius: 14px;
    color: rgba(255, 255, 255, 0.68);
    background: rgba(214, 181, 104, 0.05);
  }

  .webinar-qris__missing a {
    display: inline-flex;
    margin-top: 15px;
    gap: 7px;
    align-items: center;
    color: #e1c273;
  }

  @keyframes qrisRise {
    to { opacity: 1; transform: none; }
  }

  @keyframes qrisCard {
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 520px) {
    .webinar-qris__card {
      padding: 22px 18px;
    }

    .webinar-qris__invoice strong {
      font-size: 21px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .webinar-qris__intro,
    .webinar-qris__card,
    .webinar-qris__security {
      opacity: 1;
      animation: none;
      transform: none;
    }
  }
`;

type WebinarPaymentQrisProps = {
  webinar: WebinarData;
};

const WebinarPaymentQris = ({ webinar }: WebinarPaymentQrisProps) => {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [payment] = useState<StoredWebinarPayment | null>(() =>
    readWebinarPayment(webinar.slug),
  );
  const [registration] = useState<StoredWebinarRegistration | null>(() =>
    readWebinarRegistration(webinar.slug),
  );
  const breakdown = useMemo(() => calculateWebinarPayment(webinar), [webinar]);
  const [isChecking, setIsChecking] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const qrPattern = useMemo(
    () => createQrPattern(payment?.id ?? webinar.slug),
    [payment?.id, webinar.slug],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleCheckStatus = async () => {
    if (!payment || !registration || isChecking) return;
    setIsChecking(true);
    setPaymentError("");

    try {
      const confirmedPayment = await webinarPaymentService.confirm(payment, registration);
      saveWebinarSuccess(webinar, registration, confirmedPayment);
      navigateToHashRoute(getWebinarSuccessPath(webinar.slug));
    } catch (caughtError) {
      setPaymentError(
        caughtError instanceof Error
          ? caughtError.message
          : "Status pembayaran tidak dapat diperiksa.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  const paymentPath = getWebinarPaymentPath(webinar.slug);
  const isWallet = payment?.method === "e-wallet";

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="webinar-qris-page">
          <main className="webinar-qris-page__main">
          <section className="webinar-qris-page__section" aria-label="Pembayaran QRIS webinar">
            <div className="webinar-qris">
              <header className="webinar-qris__intro">
                <span className="webinar-qris__step">Step 3 of 3</span>
                <h1 className="webinar-qris__title">
                  {isWallet ? "Bayar dengan E-Wallet" : "Bayar dengan QRIS"}
                </h1>
                <p className="webinar-qris__subtitle">
                  Pindai kode pembayaran menggunakan aplikasi pilihan Anda. Sistem akan
                  memverifikasi pembayaran secara otomatis setelah simulasi dikonfirmasi.
                </p>
              </header>

              {!payment || !registration ? (
                <div className="webinar-qris__missing">
                  Data pembayaran belum tersedia. Silakan pilih metode pembayaran terlebih
                  dahulu.
                  <br />
                  <a
                    href={getHashHref(paymentPath)}
                    onClick={(event) => handleHashRouteClick(event, paymentPath)}
                  >
                    Kembali ke Step 2 <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              ) : (
                <>
                  <section className="webinar-qris__card">
                    <div className="webinar-qris__qr-shell" aria-label="Simulasi kode QRIS">
                      <div className="webinar-qris__qr" aria-hidden="true">
                        {qrPattern.map((filled, index) => (
                          <span
                            className={`webinar-qris__qr-cell${filled ? " is-filled" : ""}`}
                            key={index}
                          />
                        ))}
                      </div>
                      <span className="webinar-qris__qr-logo">
                        <QrCode aria-hidden="true" />
                      </span>
                    </div>

                    <span className="webinar-qris__countdown">
                      <Clock3 aria-hidden="true" />
                      Berlaku dalam {formatCountdown(secondsLeft)}
                    </span>

                    <div className="webinar-qris__invoice">
                      <span>Total Tagihan</span>
                      <strong>{formatRupiah(breakdown.total)}</strong>
                      <span>ID Transaksi</span>
                      <small>#{payment.id.replace("PAY-", "MVX-")}</small>
                    </div>

                    <p className="webinar-qris__instruction">
                      Pindai kode QR di atas menggunakan GoPay, OVO, DANA, LinkAja,
                      atau aplikasi mobile banking yang mendukung QRIS.
                    </p>

                    {paymentError && (
                      <p className="webinar-qris__help" role="alert">
                        <HelpCircle aria-hidden="true" />
                        {paymentError}
                      </p>
                    )}

                    <button
                      className="webinar-qris__button"
                      type="button"
                      onClick={handleCheckStatus} disabled={isChecking}
                    >
                      {isChecking ? "Memeriksa..." : "Cek Status Pembayaran"}
                      <RefreshCw aria-hidden="true" />
                    </button>

                    <p className="webinar-qris__help">
                      <HelpCircle aria-hidden="true" />
                      Butuh bantuan?
                      <a href="https://wa.me/6289652647385?text=Halo%20Mahreen%2C%20saya%20membutuhkan%20bantuan%20pembayaran%20webinar." target="_blank" rel="noreferrer">
                        Hubungi CS <ArrowRight aria-hidden="true" />
                      </a>
                    </p>
                  </section>

                  <p className="webinar-qris__security">
                    <LockKeyhole aria-hidden="true" />
                    SSL Encrypted Secure Transaction
                    <ShieldCheck aria-hidden="true" />
                  </p>
                </>
              )}
            </div>
          </section>

          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default WebinarPaymentQris;
