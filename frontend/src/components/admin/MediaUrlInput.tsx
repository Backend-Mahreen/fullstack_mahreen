import { Link, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { uploadImageFromUrl } from "../../api/media";

type MediaUrlInputProps = Readonly<{
  onApply: (fileUrl: string) => void;
  onCancel: () => void;
  label?: string;
}>;

const styles = `
  .media-url-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    border: 1px dashed rgba(240, 200, 70, 0.35);
    border-radius: 6px;
    background: rgba(240, 200, 70, 0.04);
  }
  .media-url-input__label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #c5c0b7;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .media-url-input__label svg { color: #b7a45f; }
  .media-url-input__row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .media-url-input__field {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    background: #0a0a09;
    color: #f4efe8;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    outline: none;
    transition: border-color 160ms ease;
  }
  .media-url-input__field:focus { border-color: rgba(240, 200, 70, 0.5); }
  .media-url-input__field::placeholder { color: #5c584f; }
  .media-url-input__btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 8px 14px;
    border: 1px solid rgba(240, 200, 70, 0.35);
    border-radius: 4px;
    background: rgba(240, 200, 70, 0.1);
    color: #e4c345;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: background 160ms ease;
  }
  .media-url-input__btn:hover { background: rgba(240, 200, 70, 0.18); }
  .media-url-input__btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .media-url-input__btn--cancel {
    border-color: rgba(255, 255, 255, 0.1);
    background: transparent;
    color: #a29c90;
  }
  .media-url-input__btn--cancel:hover { color: #d8d2c9; background: rgba(255, 255, 255, 0.05); }
  .media-url-input__error {
    color: #ef9a8e;
    font-size: 11px;
  }
`;

const MediaUrlInput = ({ onApply, onCancel, label }: MediaUrlInputProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("URL tidak boleh kosong.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("URL harus diawali http:// atau https://");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await uploadImageFromUrl(trimmed);
      onApply(result.fileUrl);
    } catch (err) {
      const message = (err as { message?: string })?.message || "Gagal mengunduh gambar.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isLoading) {
      event.preventDefault();
      void handleApply();
    }
    if (event.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="media-url-input">
      <style>{styles}</style>
      <span className="media-url-input__label">
        <Link size={13} /> {label || "URL Gambar"}
      </span>
      <div className="media-url-input__row">
        <input
          className="media-url-input__field"
          type="url"
          placeholder="https://example.com/gambar.jpg"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isLoading}
        />
        <button
          className="media-url-input__btn"
          type="button"
          onClick={() => void handleApply()}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? "Loading..." : "Apply"}
        </button>
        <button
          className="media-url-input__btn media-url-input__btn--cancel"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X size={13} />
        </button>
      </div>
      {error ? <span className="media-url-input__error">{error}</span> : null}
    </div>
  );
};

export default MediaUrlInput;
