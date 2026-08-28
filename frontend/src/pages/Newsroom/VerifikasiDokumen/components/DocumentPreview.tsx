import { useState } from "react";

type DocumentPreviewProps = Readonly<{
  isFinished: boolean;
  onFinish: () => void;
  onEdit: () => void;
  onDownload: (format: string) => void;
}>;

const clampZoom = (value: number) => Math.min(1.25, Math.max(0.75, value));

const DocumentPreview = ({
  isFinished,
  onFinish,
  onEdit,
  onDownload,
}: DocumentPreviewProps) => {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="verifikasi__right">
      <div
        className="verifikasi__doc-title-card"
        data-verifikasi-reveal
        style={{ "--verifikasi-delay": "200ms" } as React.CSSProperties}
      >
        <p className="verifikasi__doc-label">Judul Dokumen</p>
        <h2 className="verifikasi__doc-title">
          Sertifikat Kepatuhan Operasional Tahunan – Mahreen Grand Center
        </h2>
      </div>

      <div
        className="verifikasi__preview-card"
        data-verifikasi-reveal
        style={{ "--verifikasi-delay": "290ms" } as React.CSSProperties}
      >
        <div className="verifikasi__preview-topbar">
          <div className="verifikasi__preview-mode">
            <span className="verifikasi__preview-mode-icon" aria-hidden="true">◎</span>
            Document Preview Mode · {Math.round(zoom * 100)}%
          </div>
          <div className="verifikasi__preview-controls">
            <button
              type="button"
              className="verifikasi__preview-ctrl"
              onClick={() => setZoom((current) => clampZoom(current - 0.1))}
              aria-label="Perkecil pratinjau"
            >
              −
            </button>
            <button
              type="button"
              className="verifikasi__preview-ctrl"
              onClick={() => setZoom((current) => clampZoom(current + 0.1))}
              aria-label="Perbesar pratinjau"
            >
              +
            </button>
            <div className="verifikasi__preview-divider" />
            <button
              type="button"
              className="verifikasi__preview-ctrl"
              onClick={() => window.print()}
              aria-label="Cetak dokumen"
            >
              🖨
            </button>
            <button
              type="button"
              className="verifikasi__preview-ctrl"
              onClick={() => onDownload("PDF")}
              aria-label="Unduh dokumen PDF"
            >
              ⬇
            </button>
          </div>
        </div>

        <div className="verifikasi__preview-body">
          <div
            className="verifikasi__doc-preview"
            style={{ transform: `scale(${zoom})`, transition: "transform 220ms ease" }}
          >
            <div className="verifikasi__doc-preview-logo" aria-hidden="true">⊞</div>
            <p className="verifikasi__doc-preview-title">
              Certificate of Incorporation &amp; Authenticity
            </p>
            <div className="verifikasi__doc-preview-lines" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="verifikasi__doc-preview-line"
                  style={{
                    width: index % 3 === 0 ? "70%" : "100%",
                    opacity: 0.4 + index * 0.05,
                    "--line-index": index,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="verifikasi__footer"
        data-verifikasi-reveal
        style={{ "--verifikasi-delay": "380ms" } as React.CSSProperties}
      >
        <button type="button" className="verifikasi__edit-btn" onClick={onEdit}>
          Edit Document Details
        </button>
        <button
          type="button"
          className="verifikasi__finish-btn"
          onClick={onFinish}
          disabled={isFinished}
        >
          ✓ {isFinished ? "Review Selesai" : "Finish Review"}
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
