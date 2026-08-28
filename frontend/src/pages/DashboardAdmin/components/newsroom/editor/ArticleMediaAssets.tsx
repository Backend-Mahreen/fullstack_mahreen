import { ImagePlus, Link, Plus, Upload, X } from "lucide-react";
import { useState, type ChangeEvent, type ReactNode } from "react";
import { resolveMediaUrl, uploadImageFile } from "../../../../../api/media";
import MediaUrlInput from "../../../../../components/admin/MediaUrlInput";
import ArticleEditorSection from "./ArticleEditorSection";
import type {
  ArticleEditorData,
  ArticleEditorUpdate,
  ArticleMediaItem,
} from "./articleEditorTypes";

const optimizeImageDataUrl = (
  dataUrl: string,
  maxDimension: number,
): Promise<string> => new Promise((resolve) => {
  const image = new Image();
  image.onload = () => {
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      resolve(dataUrl);
      return;
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    resolve(canvas.toDataURL("image/webp", 0.8));
  };
  image.onerror = () => resolve(dataUrl);
  image.src = dataUrl;
});

const dataUrlToFile = (dataUrl: string, fileName: string): File => {
  const [meta, base64 = ""] = dataUrl.split(",");
  const mimeMatch = /data:([^;]+)/.exec(meta);
  const mime = mimeMatch?.[1] || "image/webp";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const ext = mime.split("/")[1] || "webp";
  const safeName = fileName.replace(/\.[^.]+$/, "") || "image";
  return new File([bytes], `${safeName}.${ext}`, { type: mime });
};

/**
 * Baca gambar, optimalkan di browser, lalu unggah ke backend.
 * `preview` yang disimpan adalah fileUrl backend ("/uploads/..."), BUKAN base64,
 * agar payload artikel ringan dan gambar tersimpan permanen di server.
 */
const readImage = (
  file: File,
  maxDimension = 1_600,
): Promise<ArticleMediaItem | null> => new Promise((resolve) => {
  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
    resolve(null);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    void optimizeImageDataUrl(String(reader.result), maxDimension)
      .then((optimizedDataUrl) => {
        const optimizedFile = dataUrlToFile(optimizedDataUrl, file.name);
        return uploadImageFile(optimizedFile)
          .then((response) => {
            resolve({ name: file.name, preview: response.fileUrl });
          })
          .catch(() => {
            // Jangan menyimpan base64 ke artikel: payload akan ditolak server
            // (413 PayloadTooLarge). Gagalkan agar user tahu upload bermasalah.
            resolve(null);
          });
      })
      .catch(() => resolve(null));
  };
  reader.onerror = () => resolve(null);
  reader.readAsDataURL(file);
});

type MediaUploadBoxProps = Readonly<{
  acceptLabel: string;
  children: ReactNode;
  item: ArticleMediaItem | null;
  maxDimension?: number;
  onChange: (item: ArticleMediaItem | null) => void;
}>;

const MediaUploadBox = ({ acceptLabel, children, item, maxDimension, onChange }: MediaUploadBoxProps) => {
  const [urlMode, setUrlMode] = useState(false);

  return (
    <div>
      {urlMode ? (
        <MediaUrlInput
          onApply={(fileUrl) => {
            onChange({ name: "from-url", preview: fileUrl });
            setUrlMode(false);
          }}
          onCancel={() => setUrlMode(false)}
        />
      ) : (
        <label className={`admin-article-media-upload${item ? " has-image" : ""}`}>
          {item ? <img width="1200" height="800" src={resolveMediaUrl(item.preview)} alt="Uploaded preview" /> : children}
          {item ? (
            <button type="button" aria-label="Remove uploaded image" onClick={(event) => { event.preventDefault(); onChange(null); }}>
              <X size={14} />
            </button>
          ) : null}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-label={acceptLabel}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              if (file) {
                void readImage(file, maxDimension).then((nextItem) => {
                  if (nextItem) onChange(nextItem);
                });
              }
              event.target.value = "";
            }}
          />
        </label>
      )}
      {!item && !urlMode ? (
        <button type="button" className="admin-article-url-toggle" onClick={() => setUrlMode(true)}>
          <Link size={12} /> Gunakan URL gambar
        </button>
      ) : null}
    </div>
  );
};

type ArticleMediaAssetsProps = Readonly<{
  onChange: (update: ArticleEditorUpdate) => void;
  value: ArticleEditorData;
}>;

const articleMediaAssetsStyles = `
  .admin-article-media__primary {
    display: grid;
    margin: 5px auto 26px;
    max-width: 670px;
    grid-template-columns: minmax(280px, 1fr) minmax(190px, 0.62fr);
    align-items: start;
    gap: 38px;
  }
  .admin-article-media__primary > div { display: grid; gap: 10px; }
  .admin-article-media-upload {
    position: relative;
    display: flex;
    height: 156px;
    padding: 17px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    border: 1px dashed rgba(239, 199, 63, 0.38);
    border-radius: 5px;
    color: #dad5cb;
    background: rgba(5, 5, 5, 0.24);
    cursor: pointer;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }
  .admin-article-media__primary > div:last-child .admin-article-media-upload { height: 205px; }
  .admin-article-media-upload:hover {
    color: #f1d367;
    border-color: rgba(239, 199, 63, 0.68);
    background: rgba(239, 199, 63, 0.035);
    box-shadow: 0 0 24px rgba(239, 199, 63, 0.04) inset;
    transform: translateY(-2px);
  }
  .admin-article-media-upload > svg { color: var(--article-yellow); }
  .admin-article-media-upload > strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 500;
  }
  .admin-article-media-upload > small { color: #817c73; font-size: 14px; }
  .admin-article-media-upload > input,
  .admin-article-gallery__slot > input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }
  .admin-article-media-upload.has-image { padding: 0; border-style: solid; }
  .admin-article-media-upload.has-image > img,
  .admin-article-gallery__slot.has-image > img { width: 100%; height: 100%; object-fit: cover; }

  .admin-article-url-toggle {
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
  .admin-article-url-toggle:hover { background: rgba(240, 200, 70, 0.08); color: #e4c345; }

  .admin-article-media-upload > button,
  .admin-article-gallery__slot > button {
    position: absolute;
    z-index: 2;
    top: 8px;
    right: 8px;
    display: grid;
    width: 27px;
    height: 27px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    color: #f4eee4;
    background: rgba(0, 0, 0, 0.74);
    cursor: pointer;
  }
  .admin-article-gallery { display: grid; gap: 11px; }
  .admin-article-gallery__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .admin-article-gallery__heading small {
    color: #777269;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    letter-spacing: 0.05em;
  }
  .admin-article-gallery > div {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }
  .admin-article-gallery__slot {
    position: relative;
    display: grid;
    min-height: 126px;
    overflow: hidden;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-radius: 3px;
    color: #89847a;
    background: #343432;
    cursor: pointer;
    transition: color 180ms ease, border-color 180ms ease, filter 180ms ease, transform 180ms ease;
  }
  .admin-article-gallery__slot:first-child {
    border-color: rgba(239, 199, 63, 0.35);
    border-style: dashed;
    background: #0a0a09;
  }
  .admin-article-gallery__slot:hover {
    color: var(--article-yellow);
    border-color: rgba(239, 199, 63, 0.5);
    filter: brightness(1.08);
    transform: translateY(-2px);
  }
  .admin-article-gallery__slot > span {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    text-transform: uppercase;
  }

  @media (max-width: 700px) {
    .admin-article-media__primary {
      max-width: none;
      grid-template-columns: minmax(0, 1.25fr) minmax(150px, 0.75fr);
      gap: 16px;
    }
  }

  @media (max-width: 520px) {
    .admin-article-media__primary { grid-template-columns: 1fr; }
    .admin-article-gallery > div { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .admin-article-media__primary > div:last-child .admin-article-media-upload { height: 156px; }
    .admin-article-gallery__slot { min-height: 112px; }
  }
`;

const ArticleMediaAssets = ({ onChange, value }: ArticleMediaAssetsProps) => {
  const maximumGalleryImages = 12;
  const updateGallery = (index: number, item: ArticleMediaItem | null) => {
    const gallery = [...value.gallery];
    gallery[index] = item;
    onChange({ gallery });
  };

  const uploadGalleryImages = async (files: readonly File[], startIndex: number) => {
    const availableCount = maximumGalleryImages - value.gallery.filter(Boolean).length;
    const nextItems = (
      await Promise.all(
        files.slice(0, availableCount).map((file) => readImage(file, 960)),
      )
    ).filter((item): item is ArticleMediaItem => item !== null);
    if (nextItems.length === 0) return;

    const gallery = [...value.gallery];
    let cursor = startIndex;
    nextItems.forEach((item) => {
      let targetIndex = gallery.findIndex(
        (galleryItem, index) => index >= cursor && galleryItem === null,
      );
      if (targetIndex < 0) {
        targetIndex = gallery.findIndex((galleryItem) => galleryItem === null);
      }
      if (targetIndex < 0 && gallery.length < maximumGalleryImages) {
        targetIndex = gallery.length;
        gallery.push(null);
      }
      if (targetIndex < 0) return;
      gallery[targetIndex] = item;
      cursor = targetIndex + 1;
    });

    while (gallery.length < 4) gallery.push(null);
    if (gallery.every(Boolean) && gallery.length < maximumGalleryImages) gallery.push(null);
    onChange({ gallery });
  };

  const galleryImageCount = value.gallery.filter(Boolean).length;

  return (
    <ArticleEditorSection className="admin-article-media" delay={260} title="Media Assets">
      <style data-component="admin-article-media-assets">{articleMediaAssetsStyles}</style>
      <div className="admin-article-section__body">
        <div className="admin-article-media__primary">
          <div>
            <span className="admin-article-mini-label">Featured Image</span>
            <MediaUploadBox acceptLabel="Upload featured image" item={value.featuredImage} onChange={(featuredImage) => onChange({ featuredImage })}>
              <Upload size={25} />
              <strong>Upload Main Header</strong>
              <small>1920×1080 (Max 5MB)</small>
            </MediaUploadBox>
          </div>
          <div>
            <span className="admin-article-mini-label">Thumbnail (Square)</span>
            <MediaUploadBox acceptLabel="Upload square thumbnail" item={value.thumbnail} maxDimension={800} onChange={(thumbnail) => onChange({ thumbnail })}>
              <ImagePlus size={24} />
              <strong>Grid Preview</strong>
            </MediaUploadBox>
          </div>
        </div>

        <div className="admin-article-gallery">
          <div className="admin-article-gallery__heading">
            <span className="admin-article-mini-label">Image Gallery</span>
            <small>{galleryImageCount}/{maximumGalleryImages} images · select multiple files</small>
          </div>
          <div>
            {value.gallery.map((item, index) => (
              <label className={`admin-article-gallery__slot${item ? " has-image" : ""}`} key={`gallery-slot-${index + 1}`}>
                {item ? <img width="1200" height="800" src={resolveMediaUrl(item.preview)} alt={`Gallery preview ${index + 1}`} /> : index === 0 ? <Plus size={21} /> : <span>Slot {index + 1}</span>}
                {item ? (
                  <button type="button" aria-label={`Remove gallery image ${index + 1}`} onClick={(event) => { event.preventDefault(); updateGallery(index, null); }}>
                    <X size={13} />
                  </button>
                ) : null}
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  aria-label={`Upload gallery image ${index + 1}`}
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (files.length > 0) void uploadGalleryImages(files, index);
                    event.target.value = "";
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </ArticleEditorSection>
  );
};

export default ArticleMediaAssets;
