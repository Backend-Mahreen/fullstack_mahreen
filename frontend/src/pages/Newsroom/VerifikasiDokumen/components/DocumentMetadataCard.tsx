import { verificationMetadata } from "../verificationData";

const DocumentMetadataCard = () => (
  <div
    className="verifikasi__meta-card"
    data-verifikasi-reveal
    style={{ "--verifikasi-delay": "240ms" } as React.CSSProperties}
  >
    <p className="verifikasi__meta-label">⊡ Document Metadata</p>
    <div className="verifikasi__meta-rows">
      {verificationMetadata.map((metadata) => (
        <div key={metadata.key} className="verifikasi__meta-row">
          <span className="verifikasi__meta-key">{metadata.key}</span>
          <span className={`verifikasi__meta-value${metadata.gold ? " is-gold" : ""}`}>
            {metadata.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentMetadataCard;
