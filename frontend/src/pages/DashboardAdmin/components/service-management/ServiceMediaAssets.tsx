import { ImagePlus, Link, LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import MediaUrlInput from "../../../../components/admin/MediaUrlInput";
import { optimizeServiceImage } from "./serviceImageUtils";

type ServiceMediaAssetsProps = {
  thumbnail: string;
  gallery: string[];
  onThumbnailChange: (value: string) => void;
  onGalleryChange: (value: string[]) => void;
  onNotify: (message: string) => void;
};

const ServiceMediaAssets = ({
  thumbnail,
  gallery,
  onThumbnailChange,
  onGalleryChange,
  onNotify,
}: ServiceMediaAssetsProps) => {
  const [uploading, setUploading] = useState<"thumbnail" | "gallery" | null>(null);
  const [thumbUrlMode, setThumbUrlMode] = useState(false);
  const [galleryUrlMode, setGalleryUrlMode] = useState(false);

  const uploadThumbnail = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading("thumbnail");
    try {
      onThumbnailChange(await optimizeServiceImage(file, "thumbnail"));
      onNotify("Thumbnail berhasil dioptimalkan dan ditambahkan.");
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Thumbnail gagal diproses.");
    } finally {
      setUploading(null);
    }
  };

  const uploadGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const remaining = Math.max(0, 4 - gallery.length);
    const files = Array.from(event.target.files ?? []).slice(0, remaining);
    event.target.value = "";
    if (!files.length) {
      if (remaining === 0) onNotify("Galeri sudah mencapai maksimal 4 gambar.");
      return;
    }
    setUploading("gallery");
    const results = await Promise.allSettled(
      files.map((file) => optimizeServiceImage(file, "gallery")),
    );
    const uploaded = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    onGalleryChange([...gallery, ...uploaded].slice(0, 4));
    const failed = results.length - uploaded.length;
    onNotify(
      failed
        ? `${uploaded.length} gambar ditambahkan, ${failed} gambar gagal diproses.`
        : `${uploaded.length} gambar galeri berhasil ditambahkan.`,
    );
    setUploading(null);
  };

  return (
    <section className="ans-card ans-media ans-reveal" style={{ "--ans-delay": "140ms" } as React.CSSProperties}>
      <style>{`
        .ans-url-toggle {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border: 1px solid rgba(240, 200, 70, 0.25);
          border-radius: 4px;
          background: transparent;
          color: #b7a45f;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 6px;
          transition: background 160ms ease;
        }
        .ans-url-toggle:hover { background: rgba(240, 200, 70, 0.08); color: #e4c345; }
      `}</style>
      <header className="ans-card__heading"><span><ImagePlus aria-hidden="true" /></span><h2>Media &amp;<br />Assets</h2></header>

      <span className="ans-media__label">Thumbnail Service</span>
      {thumbUrlMode ? (
        <MediaUrlInput
          onApply={(fileUrl) => {
            onThumbnailChange(fileUrl);
            setThumbUrlMode(false);
            onNotify("Thumbnail berhasil diambil dari URL.");
          }}
          onCancel={() => setThumbUrlMode(false)}
        />
      ) : thumbnail ? (
        <div className="ans-thumbnail is-filled"><img src={thumbnail} alt="Service thumbnail preview" /><button type="button" aria-label="Hapus thumbnail" onClick={() => onThumbnailChange("")}><Trash2 aria-hidden="true" /></button></div>
      ) : (
        <label className="ans-thumbnail" htmlFor="ans-thumbnail-upload">
          {uploading === "thumbnail" ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <Upload aria-hidden="true" />}
          <strong>{uploading === "thumbnail" ? "Optimizing image..." : "Click to upload thumbnail"}</strong>
          <small>Recommended: 1200×800px</small>
        </label>
      )}
      {!thumbnail && !thumbUrlMode ? (
        <button type="button" className="ans-url-toggle" onClick={() => setThumbUrlMode(true)}>
          <Link size={12} /> Gunakan URL gambar
        </button>
      ) : null}
      <input className="ans-file-input" id="ans-thumbnail-upload" type="file" accept="image/*" onChange={uploadThumbnail} />

      <span className="ans-media__label is-gallery">Gallery Portfolio</span>
      <input className="ans-file-input" id="ans-gallery-upload" type="file" accept="image/*" multiple onChange={uploadGallery} />
      <div className="ans-gallery">
        {Array.from({ length: 4 }, (_, index) => {
          const image = gallery[index];
          return image ? (
            <div className="ans-gallery__item is-filled" key={`gallery-${index}`}><img src={image} alt={`Gallery preview ${index + 1}`} /><button type="button" aria-label={`Hapus gambar galeri ${index + 1}`} onClick={() => onGalleryChange(gallery.filter((_, itemIndex) => itemIndex !== index))}><Trash2 aria-hidden="true" /></button></div>
          ) : (
            <label className="ans-gallery__item" htmlFor="ans-gallery-upload" key={`gallery-${index}`}>{uploading === "gallery" && index === gallery.length ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <Plus aria-hidden="true" />}</label>
          );
        })}
      </div>
      <p className="ans-media__hint">Pilih beberapa gambar sekaligus. Maksimal 4 gambar, masing-masing 8 MB.</p>
      {gallery.length < 4 ? (
        galleryUrlMode ? (
          <MediaUrlInput
            onApply={(fileUrl) => {
              onGalleryChange([...gallery, fileUrl].slice(0, 4));
              setGalleryUrlMode(false);
              onNotify("Gambar gallery berhasil ditambahkan dari URL.");
            }}
            onCancel={() => setGalleryUrlMode(false)}
            label="URL Gambar Gallery"
          />
        ) : (
          <button type="button" className="ans-url-toggle" onClick={() => setGalleryUrlMode(true)}>
            <Link size={12} /> Tambah dari URL gambar
          </button>
        )
      ) : null}
    </section>
  );
};

export default ServiceMediaAssets;
