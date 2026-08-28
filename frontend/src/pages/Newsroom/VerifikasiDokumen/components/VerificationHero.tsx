import { QrCode, Search } from "lucide-react";

type VerificationHeroProps = Readonly<{
  documentNumber: string;
  onDocumentNumberChange: (value: string) => void;
  onVerify: () => void;
  onOpenScanner: () => void;
  error?: string;
}>;

const VerificationHero = ({ documentNumber, onDocumentNumberChange, onVerify, onOpenScanner, error }: VerificationHeroProps) => (
  <section className="mvc-hero">
    <div className="mvc-hero__grid" aria-hidden="true" />
    <div className="mvc-hero__particles" aria-hidden="true" />
    <div className="mvc-container mvc-hero__content">
      <div className="mvc-hero__intro" data-mvc-reveal>
        <span className="mvc-pill">Sistem Verifikasi Terpadu</span>
        <h1>Mahreen Verification Center</h1>
        <p>Verifikasi seluruh dokumen resmi Mahreen Indonesia secara cepat, aman, dan terpercaya melalui QR Code atau Nomor Dokumen.</p>
      </div>
      <div className="mvc-search-grid">
        <form className="mvc-search-card" data-mvc-reveal style={{ "--mvc-delay": "100ms" } as React.CSSProperties} onSubmit={(event) => { event.preventDefault(); onVerify(); }}>
          <label className="mvc-card-label" htmlFor="mvc-document-number"><Search size={19} aria-hidden="true" />Cek Keaslian Dokumen</label>
          <div className="mvc-search-card__row">
            <input id="mvc-document-number" value={documentNumber} onChange={(event) => onDocumentNumberChange(event.target.value)} placeholder="Masukkan Nomor Dokumen (Contoh: 044/WBR/FND/MRN/VII/2026)" autoComplete="off" />
            <button type="submit">Verifikasi Dokumen</button>
          </div>
          {error && <p className="mvc-form-error" role="alert">{error}</p>}
        </form>
        <article className="mvc-scanner-card" data-mvc-reveal style={{ "--mvc-delay": "180ms" } as React.CSSProperties}>
          <span className="mvc-scanner-card__icon" aria-hidden="true"><QrCode size={32} strokeWidth={1.7} /></span>
          <h2>Scan QR Code</h2>
          <p>Gunakan kamera untuk verifikasi instan.</p>
          <button type="button" onClick={onOpenScanner}>Buka Scanner</button>
        </article>
      </div>
    </div>
  </section>
);
export default VerificationHero;
