import { qrPattern } from "../verificationData";

type DocumentQrCardProps = Readonly<{
  onDownload: (format: string) => void;
}>;

const DocumentQrCard = ({ onDownload }: DocumentQrCardProps) => (
  <div
    className="verifikasi__qr-card"
    data-verifikasi-reveal
    style={{ "--verifikasi-delay": "160ms" } as React.CSSProperties}
  >
    <div className="verifikasi__qr-box" aria-label="Kode verifikasi dokumen">
      <div className="verifikasi__qr-placeholder" aria-hidden="true">
        {qrPattern.map((filled, index) => (
          <div
            key={index}
            className="verifikasi__qr-cell"
            style={{ background: filled ? "#d6a35c" : "transparent" }}
          />
        ))}
      </div>
    </div>

    <h2 className="verifikasi__qr-title">Scan to Verify</h2>
    <p className="verifikasi__qr-desc">
      This code is unique to Document #ID-2024-X99
    </p>

    <div className="verifikasi__qr-downloads">
      {["PNG", "SVG", "PDF"].map((format) => (
        <button
          key={format}
          type="button"
          className="verifikasi__qr-dl-btn"
          onClick={() => onDownload(format)}
          aria-label={`Unduh kode verifikasi dalam format ${format}`}
        >
          <span className="verifikasi__qr-dl-icon" aria-hidden="true">⬇</span>
          <span className="verifikasi__qr-dl-label">{format}</span>
        </button>
      ))}
    </div>
  </div>
);

export default DocumentQrCard;
