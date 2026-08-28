import { ImagePlus, Link, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import MediaUrlInput from "../../../../components/admin/MediaUrlInput";
import { optimizeCampaignImage } from "./campaignImageUtils";
import type { CampaignFormData } from "./campaignFormTypes";

type CampaignMediaAssetsProps = {
  form: CampaignFormData;
  onChange: (patch: Partial<CampaignFormData>) => void;
  onNotify: (message: string) => void;
};

const CampaignMediaAssets = ({
  form,
  onChange,
  onNotify,
}: CampaignMediaAssetsProps) => {
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [thumbUrlMode, setThumbUrlMode] = useState(false);
  const [galleryUrlMode, setGalleryUrlMode] = useState(false);

  const handleThumbnail = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const thumbnail = await optimizeCampaignImage(file, "thumbnail");
      onChange({ thumbnail });
      onNotify("Thumbnail campaign berhasil dioptimalkan.");
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "Thumbnail gagal diproses.");
    } finally {
      setBusy(false);
    }
  };

  const handleGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    const remaining = Math.max(0, 4 - form.gallery.length);
    if (!remaining) {
      onNotify("Gallery sudah mencapai batas empat gambar.");
      return;
    }
    setBusy(true);
    const results = await Promise.allSettled(
      files.slice(0, remaining).map((file) => optimizeCampaignImage(file, "gallery")),
    );
    const uploaded = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    onChange({ gallery: [...form.gallery, ...uploaded].slice(0, 4) });
    const failed = results.length - uploaded.length;
    onNotify(
      failed
        ? `${uploaded.length} gambar tersimpan, ${failed} gambar gagal diproses.`
        : `${uploaded.length} gambar gallery berhasil ditambahkan.`,
    );
    setBusy(false);
  };

  return (
    <section className="acw-card acw-reveal" style={{ "--acw-delay": "310ms" } as React.CSSProperties}>
      <style>{`
        .acw-url-toggle {
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
        .acw-url-toggle:hover { background: rgba(240, 200, 70, 0.08); color: #e4c345; }
      `}</style>
      <header className="acw-card__heading">
        <span><ImagePlus aria-hidden="true" /></span>
        <h2>Media &amp; Dokumentasi</h2>
      </header>
      <p className="acw-media__label">Thumbnail Utama (1200×800px)</p>
      {thumbUrlMode ? (
        <MediaUrlInput
          onApply={(fileUrl) => {
            onChange({ thumbnail: fileUrl });
            setThumbUrlMode(false);
            onNotify("Thumbnail berhasil diambil dari URL.");
          }}
          onCancel={() => setThumbUrlMode(false)}
        />
      ) : (
        <>
          <button
            className={`acw-thumbnail${form.thumbnail ? " has-image" : ""}`}
            disabled={busy}
            onClick={() => thumbnailInput.current?.click()}
            type="button"
          >
            {form.thumbnail ? (
              <img src={form.thumbnail} alt="Preview thumbnail campaign" />
            ) : (
              <>
                <UploadCloud aria-hidden="true" />
                <strong>{busy ? "Memproses gambar..." : "Klik atau seret gambar ke sini"}</strong>
                <small>Format JPG, PNG, WEBP (Max 8MB)</small>
              </>
            )}
          </button>
          <input
            accept="image/*"
            hidden
            onChange={handleThumbnail}
            ref={thumbnailInput}
            type="file"
          />
        </>
      )}
      {!form.thumbnail && !thumbUrlMode ? (
        <button type="button" className="acw-url-toggle" onClick={() => setThumbUrlMode(true)}>
          <Link size={12} /> Gunakan URL gambar
        </button>
      ) : null}

      <p className="acw-media__label acw-media__label--gallery">Gallery Grid (Dokumentasi Lapangan)</p>
      <div className="acw-gallery">
        <button
          aria-label="Tambah gambar gallery"
          className="acw-gallery__add"
          disabled={busy || form.gallery.length >= 4}
          onClick={() => galleryInput.current?.click()}
          type="button"
        >
          <ImagePlus aria-hidden="true" />
          <span>{form.gallery.length}/4</span>
        </button>
        {Array.from({ length: 4 }).map((_, index) => {
          const image = form.gallery[index];
          if (!image) return <span className="acw-gallery__empty" key={index}>Slot {index + 1}</span>;
          return (
            <span className="acw-gallery__item" key={`${image.slice(-20)}-${index}`}>
              <img src={image} alt={`Dokumentasi ${index + 1}`} />
              <button
                aria-label={`Hapus gambar ${index + 1}`}
                onClick={() => onChange({ gallery: form.gallery.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                <Trash2 aria-hidden="true" />
              </button>
            </span>
          );
        })}
      </div>
      <input
        accept="image/*"
        hidden
        multiple
        onChange={handleGallery}
        ref={galleryInput}
        type="file"
      />
      {form.gallery.length < 4 ? (
        galleryUrlMode ? (
          <MediaUrlInput
            onApply={async (fileUrl) => {
              onChange({ gallery: [...form.gallery, fileUrl].slice(0, 4) });
              setGalleryUrlMode(false);
              onNotify("Gambar gallery berhasil ditambahkan dari URL.");
            }}
            onCancel={() => setGalleryUrlMode(false)}
            label="URL Gambar Gallery"
          />
        ) : (
          <button type="button" className="acw-url-toggle" onClick={() => setGalleryUrlMode(true)}>
            <Link size={12} /> Tambah dari URL gambar
          </button>
        )
      ) : null}
    </section>
  );
};

export default CampaignMediaAssets;
