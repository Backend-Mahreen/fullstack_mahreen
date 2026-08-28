import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileUp, UploadCloud, X } from "lucide-react";

interface UploadReferensiProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadReferensi = ({ files, onChange }: UploadReferensiProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (incomingFiles: File[]) => {
    const validFiles = incomingFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    const hasOversizedFile = validFiles.length !== incomingFiles.length;

    setError(hasOversizedFile ? "Sebagian file melebihi batas ukuran 10MB." : "");

    const uniqueFiles = [...files];
    validFiles.forEach((file) => {
      const exists = uniqueFiles.some(
        (item) => item.name === file.name && item.size === file.size,
      );
      if (!exists) uniqueFiles.push(file);
    });
    onChange(uniqueFiles);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <section className="consult-card consult-form-reveal" aria-labelledby="upload-title">
      <h2 className="consult-section-title" id="upload-title">
        <FileUp aria-hidden="true" />
        <span>6. Upload Referensi</span>
      </h2>

      <input
        ref={inputRef}
        className="consult-file-input"
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
        onChange={handleInputChange}
      />

      <button
        className={`consult-upload-zone${isDragging ? " is-dragging" : ""}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className="consult-upload-zone__icon" aria-hidden="true">
          <UploadCloud />
        </span>
        <span className="consult-upload-zone__title">
          Klik untuk unggah atau seret file ke sini
        </span>
        <span className="consult-upload-zone__meta">
          Logo, Profile, Moodboard, dsb. (Maks. 10MB per file)
        </span>
      </button>

      {error && <p className="consult-file-error" role="alert">{error}</p>}

      {files.length > 0 && (
        <div className="consult-file-list-wrap" aria-label="File referensi terpilih">
          <p className="consult-file-list-label">File Terpilih:</p>
          <div className="consult-file-list">
            {files.map((file) => (
              <span className="consult-file-chip" key={`${file.name}-${file.size}`}>
                <span className="consult-file-chip__text">
                  <span className="consult-file-chip__name">{file.name}</span>
                  <span className="consult-file-chip__size">({formatFileSize(file.size)})</span>
                </span>
                <button
                  type="button"
                  aria-label={`Hapus ${file.name}`}
                  onClick={() => onChange(files.filter((item) => item !== file))}
                >
                  <X aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadReferensi;
