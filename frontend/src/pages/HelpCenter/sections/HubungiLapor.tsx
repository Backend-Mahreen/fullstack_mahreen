import React, { useState, type FormEvent } from "react";
import iconWhatsapp from "../../../assets/HelpCenter/HubungiLapor/Whatsapp.png"; 
import iconEmail from "../../../assets/HelpCenter/HubungiLapor/Email.png";
import iconTelegram from "../../../assets/HelpCenter/HubungiLapor/Telegram.png";
import iconDiscord from "../../../assets/HelpCenter/HubungiLapor/Discord.png";
import { publicEngagementService } from "../../../services/engagement/publicEngagementService";

const HubungiLapor: React.FC = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [tipe, setTipe] = useState("");
  const [pesan, setPesan] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!nama.trim()) newErrors.nama = "Nama lengkap wajib diisi.";
    if (!email.trim()) newErrors.email = "Email wajib diisi.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Format email tidak valid.";
    if (!tipe) newErrors.tipe = "Tipe masalah wajib dipilih.";
    if (!pesan.trim()) newErrors.pesan = "Pesan atau deskripsi wajib diisi.";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");
    setSubmitError("");
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await publicEngagementService.submitSupportTicket({
          name: nama.trim(),
          email: email.trim().toLowerCase(),
          category: tipe,
          message: pesan.trim(),
        });
        setSubmitStatus("success");
        setNama("");
        setEmail("");
        setTipe("");
        setPesan("");
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Laporan belum dapat dikirim. Silakan coba kembali.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="hc-contact-box">
      {/* Kiri: Hubungi Kami */}
      <div>
        <h2 className="hc-section-title">Hubungi Kami</h2>
        <p className="text-muted hc-contact-intro">
          Tim kami siap membantu Anda kapan saja melalui berbagai saluran komunikasi resmi.
        </p>

        <div className="hc-contact-grid">
          {/* Item 1: WhatsApp */}
          <a href="https://wa.me/6289652647385" target="_blank" rel="noopener noreferrer" className="hc-c-item">
            {/* 2. Ubah <span> emoji menjadi <img decoding="async" loading="lazy"> file PNG */}
            <img width="20" height="20" decoding="async" loading="lazy" src={iconWhatsapp} alt="Icon WhatsApp" className="hc-c-icon" />
            <div className="hc-c-text">
              <h5>WhatsApp</h5>
              <p>Balasan Cepat</p>
            </div>
          </a>

          {/* Item 2: Email */}
          <a href="mailto:info@mahreenindonesia.com" className="hc-c-item">
            <img width="20" height="20" decoding="async" loading="lazy" src={iconEmail} alt="Icon Email" className="hc-c-icon" />
            <div className="hc-c-text">
              <h5>Email Support</h5>
              <p>info@mahreenindonesia.com</p>
            </div>
          </a>

          {/* Item 3: Telegram */}
          <a href="https://t.me/MahreenSupport" target="_blank" rel="noopener noreferrer" className="hc-c-item">
            <img width="19" height="16" decoding="async" loading="lazy" src={iconTelegram} alt="Icon Telegram" className="hc-c-icon" />
            <div className="hc-c-text">
              <h5>Telegram</h5>
              <p>@MahreenSupport</p>
            </div>
          </a>

          {/* Item 4: Dukungan komunitas */}
          <a href="/contact?pillar=general" className="hc-c-item">
            <img width="24" height="12" decoding="async" loading="lazy" src={iconDiscord} alt="Icon dukungan komunitas" className="hc-c-icon" />
            <div className="hc-c-text">
              <h5>Community Support</h5>
              <p>Hubungi Tim Mahreen</p>
            </div>
          </a>
        </div>
      </div>

      {/* Kanan: Form Laporkan Masalah */}
      <div>
        <h3 className="hc-contact-form-title">Laporkan Masalah</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="hc-form-row">
            <div className="hc-form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                className={`hc-form-input ${errors.nama ? 'is-invalid' : ''}`}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
              {errors.nama && <span className="hc-form-error">{errors.nama}</span>}
            </div>
            <div className="hc-form-group">
              <label>Email</label>
              <input
                type="email"
                className={`hc-form-input ${errors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="hc-form-error">{errors.email}</span>}
            </div>
          </div>
          
          <div className="hc-form-group">
            <label>Tipe Masalah</label>
            <select
              className={`hc-form-input ${errors.tipe ? 'is-invalid' : ''}`}
              style={{ appearance: "none" }}
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
            >
              <option value="">Pilih tipe masalah...</option>
              <option value="akun">Akun & Login</option>
              <option value="transaksi">Transaksi</option>
              <option value="error">Error Teknis</option>
              <option value="lainnya">Lainnya</option>
            </select>
            {errors.tipe && <span className="hc-form-error">{errors.tipe}</span>}
          </div>

          <div className="hc-form-group">
            <label>Pesan / Deskripsi</label>
            <textarea
              className={`hc-form-input ${errors.pesan ? 'is-invalid' : ''}`}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
            ></textarea>
            {errors.pesan && <span className="hc-form-error">{errors.pesan}</span>}
          </div>

          {submitStatus === 'success' && <div className="hc-form-success">Laporan Anda telah berhasil dikirim.</div>}
          {submitError && <div className="hc-form-error" role="alert">{submitError}</div>}
          <button type="submit" className="hc-btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}</button>
        </form>
      </div>
    </section>
  );
};

export default HubungiLapor;
