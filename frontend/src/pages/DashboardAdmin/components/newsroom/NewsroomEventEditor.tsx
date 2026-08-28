import { ArrowLeft, CalendarDays, ImagePlus, Link, LoaderCircle, Save, Send, X } from "lucide-react";
import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import { resolveMediaUrl, uploadImageFile } from "../../../../api/media";
import MediaUrlInput from "../../../../components/admin/MediaUrlInput";
import type { AdminEventPayload, AdminEventRecord, EventAccessType, EventStatus } from "../../../../services/newsroom/eventsAdminService";
import ArticleEditorSection from "./editor/ArticleEditorSection";
import type { ArticleMediaItem } from "./editor/articleEditorTypes";

export type EventEditorSubmission = Readonly<{
  payload: AdminEventPayload;
  status: EventStatus;
}>;

type NewsroomEventEditorProps = Readonly<{
  initialValue?: AdminEventRecord;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onBack: () => void;
  onLocalAction: (message: string) => void;
  onSubmit: (submission: EventEditorSubmission) => void;
}>;

type EventEditorData = {
  title: string;
  category: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description: string;
  image: ArticleMediaItem | null;
  accessType: EventAccessType;
  quota: string;
  price: string;
  isFeatured: boolean;
  status: EventStatus;
};

const createInitialEventData = (): EventEditorData => ({
  title: "",
  category: "",
  eventDate: new Date().toISOString().slice(0, 10),
  eventTime: "09:00",
  location: "",
  description: "",
  image: null,
  accessType: "FREE",
  quota: "",
  price: "",
  isFeatured: false,
  status: "draft",
});

const mapEventToEditorData = (event: AdminEventRecord): EventEditorData => ({
  title: event.title,
  category: event.category || "",
  eventDate: event.event_date || "",
  eventTime: event.event_time || "",
  location: event.location || "",
  description: event.description || "",
  image: event.image ? { name: event.title, preview: event.image } : null,
  accessType: event.access_type || "FREE",
  quota: event.quota != null ? String(event.quota) : "",
  price: event.price != null ? String(event.price) : "",
  isFeatured: Boolean(event.is_featured),
  status: event.status || "draft",
});

const eventEditorStyles = `
  .admin-event-editor {
    --article-border: rgba(224, 189, 91, 0.2);
    --article-border-soft: rgba(255, 255, 255, 0.075);
    --article-panel: #151514;
    --article-input: #0a0a09;
    --article-yellow: #efc73f;
    --article-muted: #8d887d;
    position: relative;
    width: 100%;
    padding-bottom: 12px;
  }

  .admin-event-editor__header {
    display: flex;
    min-height: 78px;
    margin-bottom: 26px;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .admin-event-editor__header > div {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .admin-event-editor__header > div:first-child > button {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 7px;
    color: #dad5cb;
    background: rgba(255, 255, 255, 0.015);
    cursor: pointer;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
  }

  .admin-event-editor__header > div:first-child > button:hover {
    color: var(--article-yellow);
    border-color: rgba(239, 199, 63, 0.38);
    background: rgba(239, 199, 63, 0.055);
    transform: translateX(-3px);
  }

  .admin-event-editor__header h1 {
    margin: 0;
    color: #f1eee7;
    font-size: clamp(27px, 2.4vw, 38px);
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.035em;
  }

  .admin-event-editor__header p {
    margin: 6px 0 0;
    color: var(--article-muted);
    font-size: 14px;
  }

  .admin-event-editor__header > div:last-child { gap: 12px; }

  .admin-event-editor__header > div:last-child button {
    position: relative;
    display: inline-flex;
    min-height: 43px;
    padding: 10px 18px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(239, 199, 63, 0.28);
    border-radius: 3px;
    color: #d8d3c9;
    background: #10100f;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.06em;
    transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .admin-event-editor__header > div:last-child button:last-child {
    min-width: 148px;
    border-color: #f0c846;
    color: #151208;
    background: linear-gradient(135deg, #f7d559, #eab932);
    box-shadow: 0 11px 30px rgba(225, 178, 42, 0.13);
  }

  .admin-event-editor__header > div:last-child button:hover {
    color: #f2cf59;
    border-color: rgba(239, 199, 63, 0.48);
    background: rgba(239, 199, 63, 0.055);
    transform: translateY(-2px);
  }

  .admin-event-editor__header > div:last-child button:last-child:hover {
    color: #151208;
    background: linear-gradient(135deg, #ffe57d, #f0c13d);
    box-shadow: 0 15px 36px rgba(225, 178, 42, 0.23);
  }

  .admin-event-editor button:disabled {
    opacity: 0.56;
    cursor: wait;
    transform: none !important;
  }

  .admin-event-submit-spinner {
    animation: admin-event-submit-spin 780ms linear infinite;
  }

  @keyframes admin-event-submit-spin {
    to { transform: rotate(360deg); }
  }

  .admin-event-validation {
    margin: -5px 0 20px;
    padding: 12px 16px;
    border: 1px solid rgba(222, 110, 93, 0.35);
    border-radius: 5px;
    color: #e6aaa0;
    background: rgba(177, 69, 53, 0.08);
    font-size: 14px;
  }

  .admin-event-editor__layout {
    display: grid;
    grid-template-columns: minmax(0, 2.08fr) minmax(320px, 0.92fr);
    align-items: start;
    gap: 24px;
  }

  .admin-event-editor__main,
  .admin-event-editor__aside {
    display: grid;
    min-width: 0;
    gap: 22px;
  }

  .admin-event-enter {
    opacity: 0;
    animation: admin-event-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--event-delay, 0ms);
  }

  @keyframes admin-event-enter {
    from { opacity: 0; transform: translateY(18px) scale(0.992); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .admin-event-toggle {
    display: flex;
    min-height: 47px;
    padding: 0 13px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid rgba(226, 191, 95, 0.2);
    border-radius: 2px;
    color: #e9e5dd;
    background: var(--article-input);
    cursor: pointer;
    font-size: 14px;
    transition: border-color 180ms ease, background-color 180ms ease;
  }

  .admin-event-toggle:hover { border-color: rgba(239, 199, 63, 0.42); }

  .admin-event-toggle > span:first-child {
    color: #aaa398;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .admin-event-toggle__track {
    position: relative;
    width: 42px;
    height: 23px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    transition: background-color 180ms ease;
  }

  .admin-event-toggle__track::after {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    content: "";
    background: #9b958b;
    transition: transform 180ms ease, background-color 180ms ease;
  }

  .admin-event-toggle.is-on .admin-event-toggle__track {
    background: rgba(239, 199, 63, 0.4);
  }

  .admin-event-toggle.is-on .admin-event-toggle__track::after {
    background: #f0c846;
    transform: translateX(19px);
  }

  .admin-event-media-upload {
    position: relative;
    display: flex;
    height: 168px;
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

  .admin-event-media-upload:hover {
    color: #f1d367;
    border-color: rgba(239, 199, 63, 0.68);
    background: rgba(239, 199, 63, 0.035);
    box-shadow: 0 0 24px rgba(239, 199, 63, 0.04) inset;
    transform: translateY(-2px);
  }

  .admin-event-media-upload > svg { color: var(--article-yellow); }
  .admin-event-media-upload > strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    font-weight: 500;
  }
  .admin-event-media-upload > small { color: #817c73; font-size: 14px; }
  .admin-event-media-upload > input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }
  .admin-event-media-upload.has-image { padding: 0; border-style: solid; }
  .admin-event-media-upload.has-image > img { width: 100%; height: 100%; object-fit: cover; }

  .admin-url-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid rgba(240, 200, 70, 0.25);
    border-radius: 4px;
    background: transparent;
    color: #b7a45f;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 160ms ease, color 160ms ease;
    margin-top: 6px;
  }
  .admin-url-toggle:hover { background: rgba(240, 200, 70, 0.08); color: #e4c345; }

  .admin-event-media-upload > button {
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

  .admin-event-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  @media (max-width: 1180px) {
    .admin-event-editor__layout {
      grid-template-columns: minmax(0, 1.72fr) minmax(290px, 0.82fr);
      gap: 18px;
    }
  }

  @media (max-width: 880px) {
    .admin-event-editor__layout { grid-template-columns: 1fr; }
  }

  @media (max-width: 700px) {
    .admin-event-editor__header {
      margin-bottom: 20px;
      align-items: stretch;
      flex-direction: column;
    }
    .admin-event-editor__header > div:last-child { width: 100%; }
    .admin-event-editor__header > div:last-child button { flex: 1; }
  }

  @media (max-width: 560px) {
    .admin-event-form-grid { grid-template-columns: 1fr; }
    .admin-event-editor__header > div:first-child { align-items: flex-start; }
    .admin-event-editor__header h1 { font-size: 25px; }
    .admin-event-editor__header > div:last-child {
      align-items: stretch;
      flex-direction: column;
    }
    .admin-event-editor__header > div:last-child button { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .admin-event-editor *,
    .admin-event-editor *::before,
    .admin-event-editor *::after {
      animation-duration: 1ms !important;
      animation-delay: 0ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
    }
  }
`;

const optimizeImageDataUrl = (dataUrl: string, maxDimension: number): Promise<string> =>
  new Promise((resolve) => {
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
 * preview yang disimpan adalah fileUrl backend ("/uploads/..."), BUKAN base64.
 */
const readEventImage = (file: File): Promise<ArticleMediaItem | null> =>
  new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      void optimizeImageDataUrl(String(reader.result), 1_600)
        .then((optimizedDataUrl) => {
          const optimizedFile = dataUrlToFile(optimizedDataUrl, file.name);
          return uploadImageFile(optimizedFile)
            .then((response) => {
              resolve({ name: file.name, preview: response.fileUrl });
            })
            .catch(() => resolve(null));
        })
        .catch(() => resolve(null));
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

const NewsroomEventEditor = ({
  initialValue,
  isSubmitting = false,
  mode = "create",
  onBack,
  onLocalAction,
  onSubmit,
}: NewsroomEventEditorProps) => {
  const [event, setEvent] = useState<EventEditorData>(() =>
    initialValue ? mapEventToEditorData(initialValue) : createInitialEventData(),
  );
  const [validationError, setValidationError] = useState("");
  const [coverUrlMode, setCoverUrlMode] = useState(false);

  const updateEvent = useCallback((update: Partial<EventEditorData>) => {
    setEvent((current) => ({ ...current, ...update }));
    setValidationError("");
  }, []);

  const submitEvent = (status: EventStatus) => {
    if (!event.title.trim()) {
      setValidationError("Judul event wajib diisi sebelum disimpan atau dipublikasikan.");
      onLocalAction("Newsroom: lengkapi judul event terlebih dahulu.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!event.eventDate.trim()) {
      setValidationError("Tanggal event wajib diisi sebelum disimpan atau dipublikasikan.");
      onLocalAction("Newsroom: lengkapi tanggal event terlebih dahulu.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload: AdminEventPayload = {
      title: event.title.trim(),
      category: event.category.trim(),
      description: event.description.trim(),
      eventDate: event.eventDate,
      eventTime: event.eventTime.trim(),
      location: event.location.trim(),
      accessType: event.accessType,
      quota: event.quota.trim() ? Number(event.quota) : 0,
      price: event.price.trim() ? Number(event.price) : 0,
      isFeatured: event.isFeatured,
      status,
      image: event.image?.preview ?? "",
    };
    onSubmit({ payload, status });
  };

  const saveStatus: EventStatus = mode === "edit" ? event.status : "draft";
  const publishLabel = mode === "edit" && event.status === "published"
    ? "Update Published"
    : "Publish Event";

  return (
    <section className="admin-event-editor">
      <style data-component="admin-newsroom-event-editor">{eventEditorStyles}</style>
      <header className="admin-event-editor__header admin-event-enter">
        <div>
          <button type="button" aria-label="Kembali ke kelola event" onClick={onBack}><ArrowLeft size={20} /></button>
          <div>
            <h1>{mode === "edit" ? "Edit Event" : "Create New Event"}</h1>
            <p>{mode === "edit" ? "Update the event and synchronize it with the public Event page." : "Craft a new event for the Mahreen Indonesia ecosystem."}</p>
          </div>
        </div>
        <div>
          <button type="button" disabled={isSubmitting} onClick={() => submitEvent(saveStatus)}><Save size={15} /> {mode === "edit" ? "Save Changes" : "Save as Draft"}</button>
          <button type="button" disabled={isSubmitting} onClick={() => submitEvent("published")}>
            {isSubmitting ? <LoaderCircle className="admin-event-submit-spinner" size={15} /> : <Send size={15} />}
            {isSubmitting ? "Saving..." : publishLabel}
          </button>
        </div>
      </header>

      {validationError ? <div className="admin-event-validation admin-event-enter" role="alert">{validationError}</div> : null}

      <div className="admin-event-editor__layout">
        <div className="admin-event-editor__main">
          <ArticleEditorSection className="admin-event-enter" delay={40} title="Event Details">
            <div className="admin-article-stack">
              <label className="admin-article-field">
                <span>Judul Event *</span>
                <input
                  type="text"
                  placeholder="Contoh: Workshop Public Speaking 2026"
                  value={event.title}
                  onChange={(e) => updateEvent({ title: e.target.value })}
                />
              </label>

              <div className="admin-event-form-grid">
                <label className="admin-article-field">
                  <span>Kategori</span>
                  <input
                    type="text"
                    placeholder="Contoh: Workshop, Seminar, Kompetisi"
                    value={event.category}
                    onChange={(e) => updateEvent({ category: e.target.value })}
                  />
                </label>
                <label className="admin-article-field">
                  <span>Lokasi</span>
                  <input
                    type="text"
                    placeholder="Contoh: Online via Zoom, Jakarta"
                    value={event.location}
                    onChange={(e) => updateEvent({ location: e.target.value })}
                  />
                </label>
              </div>

              <div className="admin-event-form-grid">
                <label className="admin-article-field">
                  <span>Tanggal Event *</span>
                  <span className="admin-article-input-icon">
                    <input
                      type="date"
                      value={event.eventDate}
                      onChange={(e) => updateEvent({ eventDate: e.target.value })}
                    />
                    <CalendarDays size={15} />
                  </span>
                </label>
                <label className="admin-article-field">
                  <span>Waktu</span>
                  <span className="admin-article-input-icon">
                    <input
                      type="time"
                      value={event.eventTime}
                      onChange={(e) => updateEvent({ eventTime: e.target.value })}
                    />
                    <CalendarDays size={15} />
                  </span>
                </label>
              </div>

              <label className="admin-article-field">
                <span>Deskripsi</span>
                <textarea
                  rows={6}
                  placeholder="Deskripsi singkat event untuk halaman publik..."
                  value={event.description}
                  onChange={(e) => updateEvent({ description: e.target.value })}
                />
                <small>Pintasan baris baru didukung; HTML tidak diizinkan.</small>
              </label>
            </div>
          </ArticleEditorSection>

          <ArticleEditorSection className="admin-event-enter" delay={120} title="Cover Image">
            <div className="admin-article-stack">
              <span className="admin-article-mini-label">Cover Event</span>
              {coverUrlMode ? (
                <MediaUrlInput
                  onApply={(fileUrl) => {
                    updateEvent({ image: { name: "from-url", preview: fileUrl } });
                    setCoverUrlMode(false);
                  }}
                  onCancel={() => setCoverUrlMode(false)}
                />
              ) : (
                <label className={`admin-event-media-upload${event.image ? " has-image" : ""}`}>
                  {event.image ? (
                    <img width="1200" height="800" src={resolveMediaUrl(event.image.preview)} alt="Preview cover event" />
                  ) : (
                    <>
                      <ImagePlus size={24} />
                      <strong>Upload Cover</strong>
                      <small>Rasio 16:9, maks 5MB</small>
                    </>
                  )}
                  {event.image ? (
                    <button type="button" aria-label="Hapus cover event" onClick={(e) => { e.preventDefault(); updateEvent({ image: null }); }}>
                      <X size={14} />
                    </button>
                  ) : null}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    aria-label="Unggah cover event"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        void readEventImage(file).then((item) => {
                          if (item) {
                            updateEvent({ image: item });
                          } else {
                            onLocalAction("Newsroom: gambar gagal diunggah. Pastikan file di bawah 5MB.");
                          }
                        });
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
              {!event.image && !coverUrlMode ? (
                <button type="button" className="admin-url-toggle" onClick={() => setCoverUrlMode(true)}>
                  <Link size={13} /> Gunakan URL gambar
                </button>
              ) : null}
            </div>
          </ArticleEditorSection>
        </div>

        <aside className="admin-event-editor__aside">
          <ArticleEditorSection className="admin-event-enter" delay={200} title="Publication">
            <div className="admin-article-stack">
              <label className="admin-article-field">
                <span>Status</span>
                <select value={event.status} onChange={(e) => updateEvent({ status: e.target.value as EventStatus })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="admin-article-field">
                <span>Jenis Akses</span>
                <select value={event.accessType} onChange={(e) => updateEvent({ accessType: e.target.value as EventAccessType })}>
                  <option value="FREE">FREE</option>
                  <option value="PAID">PAID</option>
                </select>
              </label>
              <label className="admin-article-field">
                <span>Kuota</span>
                <input
                  type="number"
                  min={0}
                  placeholder="0 = tanpa batas"
                  value={event.quota}
                  onChange={(e) => updateEvent({ quota: e.target.value })}
                />
              </label>
              {event.accessType === "PAID" ? (
                <label className="admin-article-field">
                  <span>Harga (Rp)</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={event.price}
                    onChange={(e) => updateEvent({ price: e.target.value })}
                  />
                </label>
              ) : null}
              <button
                className={`admin-event-toggle${event.isFeatured ? " is-on" : ""}`}
                type="button"
                role="switch"
                aria-checked={event.isFeatured}
                onClick={() => updateEvent({ isFeatured: !event.isFeatured })}
              >
                <span>Featured</span>
                <span className="admin-event-toggle__track" aria-hidden="true" />
              </button>
            </div>
          </ArticleEditorSection>
        </aside>
      </div>
    </section>
  );
};

export default NewsroomEventEditor;
