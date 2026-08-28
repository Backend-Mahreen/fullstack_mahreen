import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  ArrowRight,
  Check,
  CircleCheck,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import TanyaMahreenNavbar from "../../../components/Navbar/Tanya-MahreenNavbar";
import ClosingSection from "../../../components/Cloasing-section/cloasing-section";
import Footer from "../../../components/Footer/Footer";
import { getHashHref, navigateToHashRoute } from "../../../utils/hashNavigation";
import { useAuth } from "../../../hooks/useAuth";
import { getLoginRedirectRoute } from "../../../services/auth/authNavigation";
import FeatureComparison from "./sections/FeatureComparison";
import LayananTambahan from "./sections/LayananTambahan";
import {
  getPackageServiceConfig,
  packageCatalog,
  packageServiceOrder,
} from "./packageCatalog";
import type { PackageServiceKey, TierId } from "./packageTypes";

const PACKAGE_SELECTION_STORAGE_KEY = "mahreen:service-package-selection";
const LEGACY_PACKAGE_SELECTION_STORAGE_KEY =
  "mahreen:website-package-selection";

const formatRupiah = (value: number) =>
  `Rp ${Math.max(0, value).toLocaleString("id-ID")}`;

const packageStyles = `

  :root {
    --kp-bg: #090909;
    --kp-surface: #111111;
    --kp-border: #242424;
    --kp-gold: #c9a979;
    --kp-gold-light: #e0c28e;
    --kp-text: #f4f0e9;
  }

  .kp-page,
  .kp-page *,
  .kp-page *::before,
  .kp-page *::after {
    box-sizing: border-box;
  }

  .kp-page {
    min-height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% -18%, rgba(201,169,121,.075), transparent 31%),
      var(--kp-bg);
    color: var(--kp-text);
    font-family: "Inter", sans-serif;
  }

  .kp-shell {
    width: min(1500px, calc(100% - 48px));
    margin: 0 auto;
    padding: 142px 0 112px;
  }

  .kp-reveal {
    opacity: 0;
    transform: translateY(22px);
    filter: blur(8px);
    transition:
      opacity .82s cubic-bezier(.2,.75,.25,1),
      transform .82s cubic-bezier(.2,.75,.25,1),
      filter .82s cubic-bezier(.2,.75,.25,1);
  }

  .kp-page.is-ready .kp-reveal {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  .kp-delay-1 { transition-delay: .08s; }
  .kp-delay-2 { transition-delay: .16s; }
  .kp-delay-3 { transition-delay: .24s; }
  .kp-delay-4 { transition-delay: .32s; }

  .kp-header {
    max-width: 980px;
    margin: 0 auto 56px;
    text-align: center;
  }

  .kp-header__eyebrow {
    margin: 0 0 25px;
    color: var(--kp-gold-light);
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: .42em;
    text-transform: uppercase;
  }

  .kp-header__title {
    margin: 0;
    color: var(--kp-gold);
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(52px, 6.8vw, 88px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.035em;
  }

  .kp-header__subtitle {
    max-width: 760px;
    margin: 25px auto 0;
    color: #88847e;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.8;
  }

  .kp-tabs {
    display: flex;
    max-width: 930px;
    margin: 37px auto 0;
    flex-wrap: wrap;
    justify-content: center;
    gap: 9px;
  }

  .kp-tab {
    display: inline-flex;
    min-height: 38px;
    padding: 0 20px;
    align-items: center;
    justify-content: center;
    border: 1px solid #242424;
    border-radius: 999px;
    background: transparent;
    color: #8f8c88;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: .015em;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      color .25s ease,
      border-color .25s ease,
      background .25s ease,
      transform .25s ease,
      box-shadow .25s ease;
  }

  .kp-tab:hover {
    color: #d8d2c9;
    border-color: #6b5a3e;
    transform: translateY(-2px);
    box-shadow: 0 0 18px rgba(201,169,121,.09);
  }

  .kp-tab.is-active {
    border-color: var(--kp-gold-light);
    background: var(--kp-gold-light);
    color: #17120c;
    box-shadow: 0 0 20px rgba(201,169,121,.15);
  }

  .kp-main-grid {
    display: grid;
    width: min(100%, 1120px);
    margin: 78px auto 0;
    grid-template-columns: minmax(0, 1fr) 300px;
    align-items: start;
    gap: 24px;
  }

  .kp-tier-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .kp-card {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 620px;
    padding: 44px 22px 24px;
    flex-direction: column;
    border: 1px solid var(--kp-border);
    background: linear-gradient(180deg, #121212 0%, #101010 100%);
    color: inherit;
    text-align: left;
    cursor: pointer;
    isolation: isolate;
    transition:
      border-color .28s ease,
      transform .28s ease,
      box-shadow .28s ease;
  }

  .kp-card::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(135deg, rgba(201,169,121,.07), transparent 38%);
    content: "";
    opacity: 0;
    transition: opacity .28s ease;
  }

  .kp-card:hover {
    border-color: #5b4d38;
    transform: translateY(-7px);
    box-shadow: 0 22px 55px rgba(0,0,0,.32), 0 0 24px rgba(201,169,121,.07);
  }

  .kp-card:hover::after,
  .kp-card.is-selected::after {
    opacity: 1;
  }

  .kp-card.is-selected {
    border-color: var(--kp-gold);
    box-shadow:
      inset 0 0 0 1px rgba(201,169,121,.07),
      0 20px 55px rgba(0,0,0,.24),
      0 0 22px rgba(201,169,121,.08);
  }

  .kp-card__recommended {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 2;
    display: inline-flex;
    padding: 0 14px 2px;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    color: var(--kp-gold-light);
    font-family: "Inter", sans-serif;
    font-size: clamp(18px, 1.6vw, 24px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: .06em;
    white-space: nowrap;
    text-transform: uppercase;
    text-shadow: 0 0 24px rgba(201,169,121,.18);
    pointer-events: none;
  }

  .kp-card__tier {
    margin: 0 0 13px;
    color: #5f5c58;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    letter-spacing: .2em;
    text-transform: uppercase;
  }

  .kp-card__name {
    margin: 0 0 15px;
    color: #eee9e0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 20px;
    font-weight: 500;
  }

  .kp-card__price {
    display: flex;
    margin: 0 0 28px;
    flex-direction: column;
    color: var(--kp-gold);
    font-family: "Playfair Display", Georgia, serif;
    line-height: .95;
  }

  .kp-card__currency {
    margin-bottom: 8px;
    font-size: 27px;
  }

  .kp-card__amount {
    max-width: 100%;
    font-size: clamp(27px, 2vw, 36px);
    letter-spacing: .01em;
    overflow-wrap: anywhere;
  }

  .kp-card__price-note {
    margin-top: 10px;
    color: #77716a;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .kp-card__features {
    display: flex;
    margin: 0;
    padding: 0;
    flex: 1;
    flex-direction: column;
    gap: 14px;
    list-style: none;
  }

  .kp-card__feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #aaa59e;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.45;
  }

  .kp-card__feature svg {
    width: 13px;
    height: 13px;
    margin-top: 1px;
    flex: 0 0 auto;
    color: var(--kp-gold);
    stroke-width: 1.5;
  }

  .kp-card__footer {
    display: flex;
    min-height: 46px;
    margin-top: 24px;
    padding-top: 18px;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #282828;
    color: #62605e;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .kp-card.is-selected .kp-card__footer {
    color: var(--kp-gold-light);
  }

  .kp-card__footer svg {
    width: 16px;
    height: 16px;
  }

  .kp-summary {
    position: sticky;
    top: 30px;
    width: 100%;
    min-width: 0;
    padding: 34px 26px 30px;
    overflow: hidden;
    border: 1px solid var(--kp-border);
    background: linear-gradient(180deg, #121212 0%, #101010 100%);
  }

  .kp-summary__title {
    max-width: 100%;
    margin: 0 0 30px;
    color: #eee9e0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(27px, 2.3vw, 34px);
    font-weight: 500;
    line-height: 1.05;
    overflow-wrap: break-word;
  }

  .kp-summary__line {
    display: flex;
    width: 100%;
    margin-bottom: 18px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    color: #817e79;
    font-size: 14px;
    line-height: 1.5;
  }

  .kp-summary__line span {
    min-width: 0;
    overflow-wrap: break-word;
  }

  .kp-summary__line strong {
    flex: 0 1 auto;
    min-width: 0;
    color: #aaa59e;
    font-weight: 400;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .kp-summary__divider {
    width: 100%;
    height: 1px;
    margin: 28px 0;
    border: 0;
    background: #282828;
  }

  .kp-summary__total {
    display: flex;
    width: 100%;
    min-width: 0;
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .kp-summary__total-label {
    display: block;
    width: 100%;
    color: #65615c;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    line-height: 1.8;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .kp-summary__total-price {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 0;
    color: var(--kp-gold);
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(26px, 2vw, 33px);
    font-weight: 400;
    line-height: 1.08;
    text-align: right;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .kp-summary__tax {
    width: 100%;
    margin: 8px 0 28px;
    color: #5f5a54;
    font-size: 14px;
    line-height: 1.5;
    text-align: right;
  }

  .kp-summary__cta {
    display: flex;
    width: 100%;
    min-height: 58px;
    padding: 13px 16px;
    align-items: center;
    justify-content: center;
    gap: 11px;
    border: 1px solid var(--kp-gold-light);
    background: var(--kp-gold);
    color: #130f0a;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: .13em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
    transition:
      transform .25s ease,
      background-color .25s ease,
      box-shadow .25s ease;
  }

  .kp-summary__cta:hover {
    background: var(--kp-gold-light);
    transform: translateY(-2px);
    box-shadow:
      0 0 14px rgba(201,169,121,.35),
      0 12px 30px rgba(201,169,121,.18);
  }

  .kp-summary__cta svg {
    width: 15px;
    height: 15px;
    flex: 0 0 auto;
  }

  .kp-summary__secure {
    display: flex;
    width: 100%;
    margin-top: 21px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #66615b;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
  }

  .kp-summary__secure svg {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    color: #75716b;
  }

  .kp-section-space {
    width: min(100%, 1120px);
    margin: 78px auto 0;
  }

  @media (max-width: 1080px) {
    .kp-main-grid {
      width: min(100%, 760px);
      grid-template-columns: 1fr;
    }

    .kp-summary {
      position: static;
      width: min(100%, 480px);
      margin-left: auto;
    }

    .kp-summary__total-price {
      font-size: clamp(28px, 5vw, 34px);
    }
  }

  @media (max-width: 920px) {
    .kp-tier-grid {
      grid-template-columns: 1fr;
    }

    .kp-card {
      min-height: auto;
    }
  }

  @media (max-width: 640px) {
    .kp-shell {
      width: min(100% - 28px, 1500px);
      padding-top: 118px;
      padding-bottom: 82px;
    }

    .kp-header {
      margin-bottom: 45px;
    }

    .kp-header__title {
      font-size: clamp(43px, 13vw, 58px);
    }

    .kp-header__subtitle {
      font-size: 14px;
    }

    .kp-tab {
      min-height: 35px;
      padding: 0 14px;
      font-size: 14px;
    }

    .kp-main-grid {
      width: 100%;
      margin-top: 60px;
    }

    .kp-card,
    .kp-summary {
      padding-right: 22px;
      padding-left: 22px;
    }

    .kp-card__recommended {
      padding-right: 10px;
      padding-left: 10px;
      font-size: 17px;
      letter-spacing: .045em;
    }

    .kp-summary {
      width: 100%;
      padding: 30px 22px 26px;
    }

    .kp-summary__title {
      font-size: 29px;
    }

    .kp-summary__total-price,
    .kp-summary__tax {
      text-align: left;
    }

    .kp-summary__cta {
      min-height: 56px;
      padding: 12px 14px;
      font-size: 14px;
      letter-spacing: .1em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kp-reveal,
    .kp-card,
    .kp-tab,
    .kp-summary__cta {
      transition: none !important;
    }
  }
`;

type KonfigurasiPaketLayananProps = {
  serviceKey: PackageServiceKey;
};

const KonfigurasiPaketLayananContent = ({
  serviceKey,
}: KonfigurasiPaketLayananProps) => {
  const { isAuthenticated } = useAuth();
  const config = getPackageServiceConfig(serviceKey);
  const defaultTier =
    config.tiers.find((tier) => tier.recommended)?.id ??
    config.tiers[0]?.id ??
    "business";

  const [selectedTier, setSelectedTier] = useState<TierId>(defaultTier);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectedTierData = useMemo(
    () =>
      config.tiers.find((tier) => tier.id === selectedTier) ??
      config.tiers[0],
    [config.tiers, selectedTier],
  );

  const selectedAddOnData = useMemo(
    () => config.addOns.filter((item) => selectedAddOns.includes(item.id)),
    [config.addOns, selectedAddOns],
  );

  const total = useMemo(
    () =>
      (selectedTierData?.price ?? 0) +
      selectedAddOnData.reduce((sum, item) => sum + item.priceValue, 0),
    [selectedTierData, selectedAddOnData],
  );

  if (!selectedTierData) return null;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handlePayment = (event: MouseEvent<HTMLAnchorElement>) => {
    const packageSelection = {
      serviceKey: config.key,
      category: config.label,
      sourceRoute: config.route,
      tier: selectedTierData,
      addOns: selectedAddOnData,
      total,
      updatedAt: new Date().toISOString(),
    };

    try {
      const serializedSelection = JSON.stringify(packageSelection);
      window.localStorage.setItem(
        PACKAGE_SELECTION_STORAGE_KEY,
        serializedSelection,
      );
      window.localStorage.setItem(
        LEGACY_PACKAGE_SELECTION_STORAGE_KEY,
        serializedSelection,
      );
    } catch (error) {
      console.error("Pilihan paket tidak dapat disimpan.", error);
    }

    if (!isAuthenticated) {
      event.preventDefault();
      navigateToHashRoute(
        getLoginRedirectRoute("/tanya-mahreen/pembayaran"),
      );
    }
  };

  return (
    <>
      <TanyaMahreenNavbar />

      <main className={`kp-page ${isReady ? "is-ready" : ""}`}>
        <style data-component="konfigurasi-paket-layanan">{packageStyles}</style>

        <div className="kp-shell">
          <header className="kp-header kp-reveal">
            <p className="kp-header__eyebrow">{config.eyebrow}</p>
            <h1 className="kp-header__title">{config.title}</h1>
            <p className="kp-header__subtitle">{config.description}</p>

            <nav className="kp-tabs" aria-label="Kategori layanan Tanya Mahreen">
              {packageServiceOrder.map((tabKey) => {
                const tab = packageCatalog[tabKey];
                const isActive = tabKey === serviceKey;

                return (
                  <a
                    key={tab.key}
                    href={getHashHref(tab.route)}
                    className={`kp-tab ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>
          </header>

          <section
            className="kp-main-grid"
            aria-label={`Pilihan paket ${config.label}`}
          >
            <div className="kp-tier-grid">
              {config.tiers.map((tier, index) => {
                const selected = selectedTier === tier.id;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    className={`kp-card kp-reveal kp-delay-${Math.min(
                      index + 1,
                      4,
                    )} ${selected ? "is-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {tier.recommended && (
                      <span className="kp-card__recommended">Recommended</span>
                    )}

                    <span className="kp-card__tier">{tier.tier}</span>
                    <span className="kp-card__name">{tier.name}</span>
                    <span className="kp-card__price">
                      <span className="kp-card__currency">Rp</span>
                      <span className="kp-card__amount">
                        {tier.price.toLocaleString("id-ID")}
                      </span>
                      {tier.priceNote && (
                        <span className="kp-card__price-note">
                          {tier.priceNote}
                        </span>
                      )}
                    </span>

                    <span className="kp-card__features">
                      {tier.features.map((feature) => (
                        <span key={feature} className="kp-card__feature">
                          <Check aria-hidden="true" />
                          <span>{feature}</span>
                        </span>
                      ))}
                    </span>

                    <span className="kp-card__footer">
                      <span>{selected ? "Selected" : "Select"}</span>
                      {selected ? (
                        <CircleCheck aria-hidden="true" />
                      ) : (
                        <ArrowRight aria-hidden="true" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <aside className="kp-summary kp-reveal kp-delay-4">
              <h2 className="kp-summary__title">Ringkasan Pesanan</h2>

              <div className="kp-summary__line">
                <span>Tier: {selectedTierData.name}</span>
                <strong>{formatRupiah(selectedTierData.price)}</strong>
              </div>

              {selectedAddOnData.map((addOn) => (
                <div key={addOn.id} className="kp-summary__line">
                  <span>{addOn.title}</span>
                  <strong>{formatRupiah(addOn.priceValue)}</strong>
                </div>
              ))}

              <hr className="kp-summary__divider" />

              <div className="kp-summary__total">
                <span className="kp-summary__total-label">
                  Total Estimation
                </span>
                <p className="kp-summary__total-price">
                  {formatRupiah(total)}
                </p>
              </div>
              <p className="kp-summary__tax">
                {config.taxNote ?? "*Exclude VAT 11%"}
              </p>

              <a
                href={getHashHref("/tanya-mahreen/pembayaran")}
                className="kp-summary__cta"
                onClick={handlePayment}
              >
                Lanjut ke Pembayaran
                <LockKeyhole aria-hidden="true" />
              </a>

              <div className="kp-summary__secure">
                <ShieldCheck aria-hidden="true" />
                <span>Secure Transaction via Midtrans</span>
              </div>
            </aside>
          </section>

          <div className="kp-section-space kp-reveal kp-delay-2">
            <FeatureComparison
              selectedTier={selectedTier}
              rows={config.comparisonRows}
              title={config.comparisonTitle}
            />
          </div>

          <div className="kp-section-space kp-reveal kp-delay-3">
            <LayananTambahan
              addOns={config.addOns}
              selected={selectedAddOns}
              onToggle={toggleAddOn}
            />
          </div>
        </div>
      </main>

      <ClosingSection />
      <Footer />
    </>
  );
};

const KonfigurasiPaketLayanan = (props: KonfigurasiPaketLayananProps) => (
  <KonfigurasiPaketLayananContent
    key={props.serviceKey}
    {...props}
  />
);

export default KonfigurasiPaketLayanan;
