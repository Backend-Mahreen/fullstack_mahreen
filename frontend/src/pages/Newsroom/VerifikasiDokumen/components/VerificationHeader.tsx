type VerificationHeaderProps = Readonly<{
  onPreview: () => void;
}>;

const VerificationHeader = ({ onPreview }: VerificationHeaderProps) => (
  <div
    className="verifikasi__header"
    data-verifikasi-reveal
    style={{ "--verifikasi-delay": "80ms" } as React.CSSProperties}
  >
    <div className="verifikasi__header-left">
      <div className="verifikasi__header-icon" aria-hidden="true">⊙</div>
      <div>
        <p className="verifikasi__header-title">Official Document Verification</p>
        <p className="verifikasi__header-subtitle">
          Mahreen Indonesia • Secure Digital Certificate Preview
        </p>
      </div>
    </div>

    <div className="verifikasi__header-actions">
      <div className="verifikasi__verified-badge" role="status">
        <div className="verifikasi__verified-dot" />
        VERIFIED
      </div>
      <button type="button" className="verifikasi__preview-btn" onClick={onPreview}>
        ↗ Preview Public Link
      </button>
    </div>
  </div>
);

export default VerificationHeader;
