import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import DonationLayout from "./DonationLayout";
import DonationStepper from "./DonationStepper";
import { saveDonationAmount } from "./donationStorage";
import { formatRupiah } from "./donationUtils";
import { navigateToHashRoute } from "../../../utils/hashNavigation";

const amountOptions = [
  { label: "Donasi Ringan", value: 50_000 },
  { label: "Donasi Harapan", value: 100_000 },
  { label: "Donasi Peduli", value: 250_000 },
  { label: "Donasi Inspirasi", value: 500_000 },
] as const;

const getImpactCopy = (amount: number) => {
  if (amount >= 500_000) return "Donasi Anda membantu pendidikan 5 anak.";
  if (amount >= 250_000) return "Donasi Anda membantu pendidikan 3 anak.";
  if (amount >= 100_000) return "Donasi Anda membantu pendidikan dan mentoring 1 anak.";
  return "Donasi Anda membantu menyediakan materi belajar untuk anak-anak.";
};

const PilihNominal = () => {
  const [selectedAmount, setSelectedAmount] = useState(100_000);
  const [customAmount, setCustomAmount] = useState("100000");
  const [error, setError] = useState("");

  const effectiveAmount = useMemo(() => {
    const parsed = Number(customAmount.replace(/\D/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : selectedAmount;
  }, [customAmount, selectedAmount]);

  const handleOptionClick = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount(String(value));
    setError("");
  };

  const handleContinue = () => {
    if (effectiveAmount < 10_000) {
      setError("Nominal minimum donasi adalah Rp10.000.");
      return;
    }

    const campaignId = typeof window === "undefined"
      ? undefined
      : new URLSearchParams(window.location.search).get("campaign") || undefined;
    saveDonationAmount(effectiveAmount, campaignId);
    navigateToHashRoute("/peduli-mahreen/donasi/data-diri");
  };

  return (
    <DonationLayout>
      <section className="donation-shell donation-shell--compact" aria-labelledby="donation-nominal-title">
        <DonationStepper activeStep={1} />

        <article className="donation-card donation-card--nominal" data-donation-reveal>
          <header className="donation-heading">
            <h1 id="donation-nominal-title">Pilih Nominal Donasi</h1>
            <p>Langkah kecil Anda membawa perubahan besar bagi mereka.</p>
          </header>

          <div className="donation-amount-grid">
            {amountOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`donation-amount-option${selectedAmount === option.value ? " is-active" : ""}`}
                onClick={() => handleOptionClick(option.value)}
              >
                <small>{option.label}</small>
                <strong>{formatRupiah(option.value)}</strong>
              </button>
            ))}
          </div>

          <label className="donation-field-label" htmlFor="custom-donation-amount">
            Atau masukkan nominal lainnya
          </label>
          <input
            id="custom-donation-amount"
            className="donation-input"
            inputMode="numeric"
            value={customAmount}
            onChange={(event) => {
              const nextValue = event.target.value.replace(/\D/g, "");
              setCustomAmount(nextValue);
              setSelectedAmount(0);
              setError("");
            }}
            aria-describedby={error ? "donation-amount-error" : undefined}
            placeholder="Rp 100000"
          />
          {error && (
            <p className="donation-error" id="donation-amount-error">
              {error}
            </p>
          )}

          <div className="donation-impact-note">
            <span className="donation-impact-note__icon">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{getImpactCopy(effectiveAmount)}</strong>
              <span>Membantu sarana literasi dan bimbingan mentor.</span>
            </span>
          </div>

          <button type="button" className="donation-primary-button" onClick={handleContinue}>
            Lanjut ke Data Diri
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <p className="donation-card__footnote">
            Pembayaran aman didukung oleh gerbang pembayaran terpercaya.
          </p>
        </article>
      </section>
    </DonationLayout>
  );
};

export default PilihNominal;
