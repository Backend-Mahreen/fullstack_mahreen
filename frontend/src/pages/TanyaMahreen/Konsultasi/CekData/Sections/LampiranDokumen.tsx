import { File, FileImage, Paperclip } from "lucide-react";
import type { KonsultasiFileMeta } from "../../../../../services/konsultasiDraft";

interface LampiranDokumenProps {
  files: KonsultasiFileMeta[];
  actualFiles?: File[];
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const LampiranDokumen = ({ files, actualFiles = [] }: LampiranDokumenProps) => {
  const handleOpenFile = (meta: KonsultasiFileMeta) => {
    const matchingFile = actualFiles.find(
      (file) => file.name === meta.name && file.size === meta.size,
    );

    if (!matchingFile) return;

    const objectUrl = URL.createObjectURL(matchingFile);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = matchingFile.name;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  return (
    <section className="review-card review-card--section review-reveal" aria-labelledby="lampiran-title">
      <h2 className="review-section-title" id="lampiran-title">
        <Paperclip aria-hidden="true" />
        <span>Lampiran Dokumen Referensi</span>
      </h2>

      {files.length > 0 ? (
        <div className="review-attachment-list">
          {files.map((file) => {
            const isImage = file.type.startsWith("image/");
            const canDownload = actualFiles.some(
              (actualFile) => actualFile.name === file.name && actualFile.size === file.size,
            );
            const Icon = isImage ? FileImage : File;

            return (
              <button
                className="review-file-card"
                type="button"
                key={`${file.name}-${file.size}`}
                onClick={() => handleOpenFile(file)}
                disabled={!canDownload}
                title={canDownload ? `Unduh ${file.name}` : "Metadata file tersimpan. Pilih ulang file bila halaman dimuat ulang."}
              >
                <span className="review-file-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="review-file-copy">
                  <strong>{file.name}</strong>
                  <small>{formatFileSize(file.size)}</small>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="review-empty-copy review-empty-copy--attachment">
          Tidak ada lampiran referensi yang ditambahkan.
        </p>
      )}
    </section>
  );
};

export default LampiranDokumen;
