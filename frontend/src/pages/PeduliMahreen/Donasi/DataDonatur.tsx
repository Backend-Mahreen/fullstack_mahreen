import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, EyeOff, LockKeyhole } from "lucide-react";
import InternationalPhoneInput from "../../../components/Form/InternationalPhoneInput";
import DonationLayout from "./DonationLayout";
import DonationStepper from "./DonationStepper";
import {
  getDonationDraft,
  saveDonorInformation,
} from "./donationStorage";
import { formatRupiah } from "./donationUtils";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import { campaignRepository } from "../../../services/campaign/campaignRepository";

const DataDonatur = () => {
  const [draft] = useState(() => getDonationDraft());
  const [fullName, setFullName] = useState(draft.donor.fullName);
  const [email, setEmail] = useState(draft.donor.email);
  const [whatsapp, setWhatsapp] = useState(draft.donor.whatsapp);
  const [anonymous, setAnonymous] = useState(draft.donor.anonymous);
  const [message, setMessage] = useState(draft.donor.message);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const campaign = campaignRepository
    .getSnapshot()
    .campaigns
    .find((item) => item.id === draft.campaignId);

  useEffect(() => {
    if (!draft.amount || draft.amount < 10_000) {
      navigateToHashRoute("/peduli-mahreen/donasi");
    }
  }, [draft.amount]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Nama lengkap wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) nextErrors.email = "Masukkan email yang valid.";
    if (whatsapp.replace(/\D/g, "").length < 9) nextErrors.whatsapp = "Masukkan nomor WhatsApp yang valid.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveDonorInformation({
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      anonymous,
      message: message.trim(),
    });
    navigateToHashRoute("/peduli-mahreen/donasi/pembayaran");
  };

  return (
    <DonationLayout>
      <section className="donation-shell" aria-labelledby="donation-donor-title">
        <div className="donation-two-column">
          <div data-donation-reveal>
            <DonationStepper activeStep={2} />

            <header className="donation-content-header">
              <h1 id="donation-donor-title">Informasi Donatur</h1>
              <p>
                Lengkapi data diri Anda untuk melanjutkan proses kontribusi. Data Anda terjamin keamanannya dan akan digunakan untuk laporan dampak program.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="donation-form-grid">
                <label>
                  <span className="donation-field-label">Nama Lengkap</span>
                  <input
                    className="donation-input"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Masukkan nama sesuai KTP"
                    autoComplete="name"
                  />
                  {errors.fullName && <span className="donation-error">{errors.fullName}</span>}
                </label>

                <label>
                  <span className="donation-field-label">Email</span>
                  <input
                    className="donation-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="donation-error">{errors.email}</span>}
                </label>

                <label className="donation-form-grid__wide">
                  <span className="donation-field-label">Nomor WhatsApp</span>
                  <InternationalPhoneInput
                    className="donation-input"
                    value={whatsapp}
                    onChange={setWhatsapp}
                    placeholder="812 3456 7890"
                    invalid={Boolean(errors.whatsapp)}
                  />
                  {errors.whatsapp && <span className="donation-error">{errors.whatsapp}</span>}
                </label>
              </div>

              <div className="donation-anonymous-card">
                <div className="donation-anonymous-card__content">
                  <span className="donation-anonymous-card__icon">
                    <EyeOff size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Donasi sebagai Anonim</strong>
                    <span>Nama Anda tidak akan ditampilkan di daftar donatur publik.</span>
                  </span>
                </div>
                <button
                  type="button"
                  className={`donation-toggle${anonymous ? " is-active" : ""}`}
                  onClick={() => setAnonymous((value) => !value)}
                  role="switch"
                  aria-checked={anonymous}
                  aria-label="Donasi sebagai anonim"
                />
              </div>

              <label>
                <span className="donation-field-label">Doa & Dukungan (Opsional)</span>
                <textarea
                  className="donation-textarea"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tuliskan pesan atau doa terbaik Anda untuk anak-anak di Kelas Inspirasi..."
                />
              </label>

              <button type="submit" className="donation-primary-button" style={{ width: "190px" }}>
                Lanjut ke Pembayaran
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          </div>

          <aside data-donation-reveal style={{ animationDelay: "120ms" }}>
            <article className="donation-campaign-card">
              <div className="donation-campaign-card__image">
                {campaign?.thumbnail ? <img width="1600" height="900" decoding="async" src={campaign.thumbnail} alt={campaign.title} /> : null}
                <span className="donation-campaign-card__badge">Sedang Berjalan</span>
              </div>
              <div className="donation-campaign-card__body">
                <h2>{campaign?.title ?? "Program Peduli Mahreen"}</h2>
                <p className="donation-campaign-card__id">CAMPAIGN ID: {draft.campaignId}</p>

                <div className="donation-summary-row">
                  <span>Nominal Kontribusi</span>
                  <strong>{formatRupiah(draft.amount)}</strong>
                </div>
                <div className="donation-summary-row">
                  <span>Biaya Layanan</span>
                  <strong>Rp 0</strong>
                </div>
                <div className="donation-summary-row donation-summary-row--total">
                  <span>Total Pembayaran</span>
                  <strong>{formatRupiah(draft.amount)}</strong>
                </div>

                <p className="donation-summary-note">
                  {campaign?.metaDescription || "Donasi Anda dialokasikan untuk program Peduli Mahreen yang dipilih."}
                </p>
              </div>
            </article>

            <p className="donation-security-note">
              <LockKeyhole size={12} aria-hidden="true" />
              Secure SSL Encryption
            </p>
          </aside>
        </div>
      </section>
    </DonationLayout>
  );
};

export default DataDonatur;
