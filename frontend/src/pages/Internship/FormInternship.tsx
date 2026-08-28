import { useState, type FormEvent } from "react";
import InternshipNavbar from "../../components/Navbar/InternshipNavbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import InternationalPhoneInput from "../../components/Form/InternationalPhoneInput";
import { internshipService } from "../../services/internship/internshipService";

const internshipPrograms = [
  ["internship", "Internship"],
  ["bootcamp", "Bootcamp"],
  ["workshop", "Workshop"],
  ["seminar", "Seminar"],
  ["webinar", "Webinar"],
  ["mentoring", "Mentoring"],
  ["website-development", "Website Development"],
  ["graphic-design", "Graphic Design"],
  ["video-editing", "Video Editing"],
  ["social-media", "Social Media"],
] as const;

const getRequestedProgram = () => {
  if (typeof window === "undefined") return "";
  const value = new URLSearchParams(window.location.search).get("program") ?? "";
  return internshipPrograms.some(([id]) => id === value) ? value : "";
};

const isPdf = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

const isAllowedPortfolio = (file: File) =>
  isPdf(file) ||
  ["image/jpeg", "image/png"].includes(file.type) ||
  /\.(?:jpe?g|png)$/i.test(file.name);

const formInternshipStyles = `

  @keyframes internshipPageReveal {
    from {
      opacity: 0;
      transform: translateY(34px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes internshipItemReveal {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .internship-form-page {
    min-height: 100vh;
    background: #030303;
    color: #ffffff;
    overflow-x: hidden;
  }

  .internship-form-main {
    width: 100%;
    padding: 128px 24px 78px;
    background:
      radial-gradient(circle at 50% 0%, rgba(229, 196, 131, 0.1), transparent 30%),
      linear-gradient(180deg, #030303 0%, #090909 54%, #030303 100%);
  }

  .internship-form-container {
    width: min(100%, 1120px);
    margin: 0 auto;
    opacity: 0;
    animation: internshipPageReveal 760ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .internship-form-hero {
    max-width: 960px;
    margin: 0 auto 64px;
    text-align: center;
  }

  .internship-form-eyebrow {
    margin: 0 0 18px;
    color: #e5c483;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
  }

  .internship-form-title {
    margin: 0;
    color: #ffffff;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(48px, 7.5vw, 96px);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -1px;
    text-transform: uppercase;
  }

  .internship-form-subtitle {
    max-width: 720px;
    margin: 24px auto 0;
    color: rgba(255, 255, 255, 0.58);
    font-family: "Inter", Arial, sans-serif;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.8;
  }

  .internship-registration-card {
    width: min(100%, 980px);
    margin: 0 auto;
    padding: 58px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(16, 16, 16, 0.92);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
  }

  .internship-registration-form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 58px;
  }

  .internship-form-group {
    opacity: 0;
    animation: internshipItemReveal 640ms ease forwards;
  }

  .internship-form-group:nth-child(1) {
    animation-delay: 160ms;
  }

  .internship-form-group:nth-child(2) {
    animation-delay: 260ms;
  }

  .internship-form-section-title {
    margin: 0 0 28px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    color: #e5c483;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 25px;
    font-weight: 500;
  }

  .internship-field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 26px;
  }

  .internship-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .internship-label {
    color: rgba(255, 255, 255, 0.68);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  .internship-input,
  .internship-select {
    width: 100%;
    height: 58px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    background: #f4f4f1;
    color: #111111;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    outline: none;
    padding: 0 18px;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .internship-input::placeholder {
    color: rgba(17, 17, 17, 0.45);
  }

  .internship-input--dark {
    background: #151515;
    color: #f4f4f1;
    border-color: rgba(255, 255, 255, 0.12);
  }

  .internship-input--dark::placeholder {
    color: rgba(255, 255, 255, 0.46);
  }

  .internship-input--dark:focus {
    background: #181818;
    border-color: #e5c483;
    box-shadow: 0 0 0 3px rgba(229, 196, 131, 0.18);
  }

  .internship-input:focus,
  .internship-select:focus {
    border-color: #e5c483;
    box-shadow: 0 0 0 3px rgba(229, 196, 131, 0.18);
    transform: translateY(-1px);
  }

  .internship-credentials-title {
    margin: 30px 0 18px;
    color: #e5c483;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  .internship-upload-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .internship-upload {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    min-height: 58px;
    padding: 0 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.18);
    color: rgba(255, 255, 255, 0.74);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
  }

  .internship-upload:hover,
  .internship-upload:focus-within {
    border-color: rgba(229, 196, 131, 0.7);
    background: rgba(229, 196, 131, 0.08);
    transform: translateY(-2px);
  }

  .internship-upload input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .internship-upload-text {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .internship-upload-icon {
    color: #e5c483;
    font-size: 15px;
  }

  .internship-upload-action {
    color: rgba(255, 255, 255, 0.48);
    font-size: 16px;
  }

  .internship-submit-area {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    opacity: 0;
    animation: internshipItemReveal 640ms ease 360ms forwards;
  }

  .internship-submit-button {
    width: min(100%, 360px);
    min-height: 70px;
    border: 0;
    background: #e5c483;
    color: #0b0b0b;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 4px;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
  }

  .internship-submit-button:hover:not(:disabled),
  .internship-submit-button:focus-visible:not(:disabled) {
    transform: translateY(-3px);
    filter: brightness(1.06);
    box-shadow: 0 16px 34px rgba(229, 196, 131, 0.22);
  }

  .internship-submit-button:disabled {
    cursor: wait;
    opacity: 0.68;
  }

  .internship-submit-status {
    max-width: 620px;
    margin: 18px auto 0;
    color: #e5c483;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
  }

  .internship-submit-status.is-error {
    color: #ef9a9a;
  }

  .internship-submit-note {
    max-width: 620px;
    margin: 22px auto 0;
    color: rgba(255, 255, 255, 0.38);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    text-align: center;
  }

  @media (max-width: 860px) {
    .internship-form-main {
      padding: 112px 18px 64px;
    }

    .internship-form-hero {
      margin-bottom: 42px;
    }

    .internship-registration-card {
      padding: 36px 24px;
    }

    .internship-registration-form {
      grid-template-columns: 1fr;
      gap: 36px;
    }

    .internship-field-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .internship-form-main {
      padding-inline: 14px;
    }

    .internship-form-title {
      font-size: clamp(38px, 13vw, 54px);
    }

    .internship-form-subtitle {
      font-size: 14px;
    }

    .internship-registration-card {
      padding: 30px 18px;
    }

    .internship-input,
    .internship-select,
    .internship-upload {
      height: 54px;
      font-size: 14px;
    }

    .internship-submit-button {
      min-height: 62px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .internship-form-container,
    .internship-form-group,
    .internship-submit-area {
      opacity: 1;
      animation: none;
      transform: none;
    }

    .internship-input,
    .internship-select,
    .internship-upload,
    .internship-submit-button {
      transition: none;
    }
  }
`;

const FormInternship = () => {
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const cv = formData.get("cv");
    const portfolio = formData.get("portfolio");
    const motivationLetter = formData.get("motivationLetter");

    if (!(cv instanceof File) || cv.size === 0) {
      setHasError(true);
      setStatusMessage("Curriculum Vitae wajib dilampirkan.");
      return;
    }
    if (!(motivationLetter instanceof File) || motivationLetter.size === 0) {
      setHasError(true);
      setStatusMessage("Motivation Letter wajib dilampirkan.");
      return;
    }
    if (!isPdf(cv) || cv.size > 5 * 1024 * 1024) {
      setHasError(true);
      setStatusMessage("Curriculum Vitae harus berupa PDF maksimal 5 MB.");
      return;
    }
    if (!isPdf(motivationLetter) || motivationLetter.size > 5 * 1024 * 1024) {
      setHasError(true);
      setStatusMessage("Motivation Letter harus berupa PDF maksimal 5 MB.");
      return;
    }
    if (
      portfolio instanceof File &&
      portfolio.size > 0 &&
      (!isAllowedPortfolio(portfolio) || portfolio.size > 10 * 1024 * 1024)
    ) {
      setHasError(true);
      setStatusMessage("Portfolio harus PDF/JPG/PNG maksimal 10 MB.");
      return;
    }

    setSubmitting(true);
    setHasError(false);
    setStatusMessage("");

    try {
      const result = await internshipService.submit({
        program: String(formData.get("program") ?? "").trim(),
        fullName: String(formData.get("fullName") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        whatsapp: String(formData.get("whatsapp") ?? "").trim(),
        linkedin: String(formData.get("linkedin") ?? "").trim(),
        university: String(formData.get("university") ?? "").trim(),
        major: String(formData.get("major") ?? "").trim(),
        semester: String(formData.get("semester") ?? "").trim(),
        cv,
        portfolio:
          portfolio instanceof File && portfolio.size > 0
            ? portfolio
            : undefined,
        motivationLetter,
      });
      setStatusMessage(`Pendaftaran berhasil diterima. ID: ${result.applicationId}`);
      form.reset();
      setWhatsapp("");
    } catch (caughtError) {
      setHasError(true);
      setStatusMessage(
        caughtError instanceof Error
          ? caughtError.message
          : "Pendaftaran tidak dapat dikirim.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="internship-form-page">
      <style data-component="form-internship">{formInternshipStyles}</style>
      <InternshipNavbar />

      <main className="internship-form-main">
        <div className="internship-form-container">
          <header className="internship-form-hero">
            <p className="internship-form-eyebrow">Internship Program</p>
            <h1 className="internship-form-title">Future Leaders Academy</h1>
            <p className="internship-form-subtitle">
              Join Indonesia's most exclusive creative collective. Shape the
              future of luxury brand strategy and digital excellence.
            </p>
          </header>

          <section
            className="internship-registration-card"
            aria-labelledby="internship-registration-title"
          >
            <form className="internship-registration-form" onSubmit={handleSubmit}>
              <div className="internship-form-group">
                <h2
                  className="internship-form-section-title"
                  id="internship-registration-title"
                >
                  Personal Identity
                </h2>

                <label className="internship-field">
                  <span className="internship-label">Nama Lengkap</span>
                  <input
                    className="internship-input"
                    type="text"
                    name="fullName"
                    required
                    placeholder="Your full name"
                  />
                </label>

                <label className="internship-field">
                  <span className="internship-label">Email Address</span>
                  <input
                    className="internship-input"
                    type="email"
                    name="email"
                    required
                    placeholder="email@university.ac.id"
                  />
                </label>

                <label className="internship-field">
                  <span className="internship-label">Whatsapp Number</span>
                  <InternationalPhoneInput
                    className="internship-input"
                    name="whatsapp"
                    value={whatsapp}
                    onChange={setWhatsapp}
                    required
                    placeholder="812 3456 7890"
                  />
                </label>

                <label className="internship-field">
                  <span className="internship-label">
                    Linkedin Profile (Optional)
                  </span>
                  <input
                    className="internship-input"
                    type="url"
                    name="linkedin"
                    placeholder="linkedin.com/in/yourname"
                  />
                </label>
              </div>

              <div className="internship-form-group">
                <h2 className="internship-form-section-title">
                  Academic Background
                </h2>

                <label className="internship-field">
                  <span className="internship-label">Program yang Dipilih</span>
                  <select
                    className="internship-select"
                    name="program"
                    defaultValue={getRequestedProgram()}
                    required
                  >
                    <option value="" disabled>Pilih program</option>
                    {internshipPrograms.map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </label>

                <label className="internship-field">
                  <span className="internship-label">Universitas</span>
                  <input
                    className="internship-input"
                    type="text"
                    name="university"
                    required
                    placeholder="Current university"
                  />
                </label>

                <div className="internship-field-row">
                  <label className="internship-field">
                    <span className="internship-label">Program Studi</span>
                    <input
                      className="internship-input"
                      type="text"
                      name="major"
                    required
                      placeholder="Major"
                    />
                  </label>

                  <label className="internship-field">
                    <span className="internship-label">Semester</span>
                    <input
                      className="internship-input internship-input--dark"
                      type="text"
                      name="semester"
                    required
                      placeholder="Contoh: Semester 1"
                    />
                  </label>
                </div>

                <p className="internship-credentials-title">
                  Required Credentials
                </p>

                <div className="internship-upload-list">
                  <label className="internship-upload">
                    <span className="internship-upload-text">
                      <span className="internship-upload-icon">[ ]</span>
                      Curriculum Vitae (PDF)
                    </span>
                    <span className="internship-upload-action">+</span>
                    <input type="file" name="cv" accept=".pdf" required />
                  </label>

                  <label className="internship-upload">
                    <span className="internship-upload-text">
                      <span className="internship-upload-icon">&lt;&gt;</span>
                      Portfolio Link/File
                    </span>
                    <span className="internship-upload-action">+</span>
                    <input
                      type="file"
                      name="portfolio"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>

                  <label className="internship-upload">
                    <span className="internship-upload-text">
                      <span className="internship-upload-icon">@</span>
                      Motivation Letter
                    </span>
                    <span className="internship-upload-action">+</span>
                    <input type="file" name="motivationLetter" accept=".pdf" required />
                  </label>
                </div>
              </div>

              <div className="internship-submit-area">
                <button className="internship-submit-button" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Registration"}
                </button>
                {statusMessage && (
                  <p className={`internship-submit-status${hasError ? " is-error" : ""}`} role={hasError ? "alert" : "status"}>
                    {statusMessage}
                  </p>
                )}
                <p className="internship-submit-note">
                  By clicking submit, you agree to our Terms of Professional
                  Engagement.
                </p>
              </div>
            </form>
          </section>
        </div>
      </main>

      <ClosingSection />
      <Footer />
    </div>
  );
};

export default FormInternship;
