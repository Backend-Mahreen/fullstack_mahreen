import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Cloud,
  Download,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import {
  webinarAdminService,
  type AdminWebinarRecord,
  type AdminWebinarPayload,
  type AdminWebinarStats,
  type WebinarStatus,
} from "../../../../services/newsroom/webinarAdminService";
import { newsroomService } from "../../../../services/newsroom/newsroomService";
import NewsroomMetricCard from "./NewsroomMetricCard";

type NewsroomWebinarsAdminProps = Readonly<{
  onLocalAction: (message: string) => void;
  onViewChange: (view: "articles" | "tags" | "events" | "webinars") => void;
  query: string;
}>;

type WebinarTab = "all" | "published" | "draft";

const webinarAdminStyles = `
  .admin-webinars-panel {
    display: flex;
    min-height: 72px;
    padding: 19px 22px;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border-bottom: 1px solid rgba(240, 200, 70, 0.16);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.018), transparent);
  }
  .admin-webinars-panel h2 { margin: 0; color: #ece9e3; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
  .admin-webinars-panel > div { display: flex; align-items: center; gap: 12px; }
  .admin-webinars-list { display: grid; padding: 21px 22px 10px; gap: 13px; }
  .admin-webinar-row {
    display: grid;
    min-height: 82px;
    padding: 12px 11px;
    grid-template-columns: 56px minmax(0, 1fr) auto auto auto 30px;
    align-items: center;
    gap: 15px;
    border: 1px solid rgba(240, 200, 70, 0.16);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.008);
    transition: border-color 180ms ease, background-color 180ms ease;
  }
  .admin-webinar-row:hover { border-color: rgba(240, 200, 70, 0.32); background: rgba(240, 200, 70, 0.025); }
  .admin-webinar-thumb {
    display: grid; width: 56px; height: 56px; place-items: center;
    border: 1px solid rgba(240, 200, 70, 0.2); border-radius: 6px;
    color: #c9a35a; background: rgba(240, 200, 70, 0.06);
    overflow: hidden;
  }
  .admin-webinar-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .admin-webinar-main { min-width: 0; }
  .admin-webinar-main h3 { margin: 0 0 4px; color: #ece9e3; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .admin-webinar-main p { margin: 0; color: #817d75; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .admin-webinar-price { color: #e5c477; font-size: 13px; font-weight: 700; white-space: nowrap; }
  .admin-webinar-free { color: #7fd6a1; font-size: 11px; font-weight: 700; }
  .admin-webinar-badge { display: inline-flex; padding: 4px 9px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
  .admin-webinar-badge.is-published { color: #7fd6a1; background: rgba(127, 214, 161, 0.1); }
  .admin-webinar-badge.is-draft { color: #e5c477; background: rgba(229, 196, 119, 0.1); }
  .admin-webinar-registered { color: #817d75; font-size: 11px; white-space: nowrap; }
  .admin-webinars-empty { padding: 30px 18px; color: #817d75; font-size: 12px; text-align: center; }
  .admin-webinars-toolbar { display: flex; padding: 18px 22px 4px; gap: 10px; align-items: center; }
  .admin-webinars-toolbar button {
    min-height: 30px; padding: 0 12px; border: 1px solid rgba(240, 200, 70, 0.2);
    border-radius: 5px; color: #9a948a; background: transparent; cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .admin-webinars-toolbar button.is-active { color: #17140b; background: linear-gradient(135deg, #f5d35b, #e9ba37); border-color: transparent; }
  .admin-webinar-actions { position: relative; }
  .admin-webinar-actions > button {
    display: grid; width: 30px; height: 30px; padding: 0; place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 5px; color: #9a948a; background: transparent; cursor: pointer;
  }
  .admin-webinar-menu {
    position: absolute; right: 0; top: calc(100% + 4px); z-index: 40; min-width: 150px;
    padding: 6px; border: 1px solid rgba(240, 200, 70, 0.2); border-radius: 6px;
    background: #17140f; box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);
  }
  .admin-webinar-menu button {
    display: flex; width: 100%; min-height: 34px; padding: 0 10px; align-items: center; gap: 8px;
    border: 0; border-radius: 4px; color: #d9d5cc; background: transparent; cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; text-align: left;
  }
  .admin-webinar-menu button:hover { background: rgba(240, 200, 70, 0.08); color: #e7d594; }
  .admin-webinar-menu button.is-danger { color: #e08d6c; }
  .admin-webinar-menu button.is-danger:hover { background: rgba(224, 141, 108, 0.1); }

  .admin-webinar-dialog { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 22px; }
  .admin-webinar-dialog__backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); }
  .admin-webinar-dialog__panel {
    position: relative; width: min(100%, 620px); max-height: 90vh; overflow: auto;
    padding: 28px; border: 1px solid rgba(240, 200, 70, 0.24); border-radius: 14px;
    background: #121110; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  }
  .admin-webinar-dialog__heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .admin-webinar-dialog__heading h2 { margin: 0; color: #ece9e3; font-size: 18px; }
  .admin-webinar-dialog__close { display: grid; width: 34px; height: 34px; padding: 0; place-items: center; border: 1px solid rgba(255,255,255,.12); border-radius: 50%; color: #d9d5cc; background: transparent; cursor: pointer; }
  .admin-webinar-form { display: grid; gap: 14px; }
  .admin-webinar-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .admin-webinar-form__field { display: grid; gap: 6px; }
  .admin-webinar-form__field label { color: #9a948a; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
  .admin-webinar-form__field input, .admin-webinar-form__field textarea, .admin-webinar-form__field select {
    width: 100%; min-height: 40px; padding: 0 12px; border: 1px solid rgba(255,255,255,.1); border-radius: 6px;
    color: #e6e0d8; background: #0d0d0c; font: inherit; font-size: 13px; outline: none;
  }
  .admin-webinar-form__field textarea { min-height: 88px; padding: 10px 12px; resize: vertical; }
  .admin-webinar-form__field input:focus, .admin-webinar-form__field textarea:focus, .admin-webinar-form__field select:focus { border-color: rgba(240, 200, 70, 0.5); }
  .admin-webinar-form__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
  .admin-webinar-form__cancel { min-height: 40px; padding: 0 16px; border: 1px solid rgba(255,255,255,.14); border-radius: 6px; color: #9a948a; background: transparent; cursor: pointer; font-size: 12px; font-weight: 700; }
  .admin-webinar-form__save {
    min-height: 40px; padding: 0 20px; border: 1px solid #e5c477; border-radius: 6px;
    color: #17140b; background: linear-gradient(135deg, #f5d35b, #e9ba37); cursor: pointer;
    font-size: 12px; font-weight: 800;
  }
  .admin-webinar-form__save:disabled { opacity: 0.55; cursor: not-allowed; }
  @media (max-width: 720px) {
    .admin-webinar-row { grid-template-columns: 48px minmax(0, 1fr) auto 30px; }
    .admin-webinar-price, .admin-webinar-registered { display: none; }
    .admin-webinar-form__row { grid-template-columns: 1fr; }
  }
`;

type WebinarFormState = {
  title: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  isFree: boolean;
  scheduleDate: string;
  scheduleTime: string;
  image: string;
  topics: string;
  benefits: string;
  status: WebinarStatus;
  quota: string;
};

const toFormState = (webinar: AdminWebinarRecord): WebinarFormState => ({
  title: webinar.title,
  category: webinar.category || "",
  description: webinar.description || "",
  duration: webinar.duration || "",
  price: String(webinar.price ?? 0),
  isFree: webinar.is_free === 1,
  scheduleDate: webinar.schedule_date || "",
  scheduleTime: webinar.schedule_time || "",
  image: webinar.image || "",
  topics: (webinar.topics ?? []).join(", "),
  benefits: (webinar.benefits ?? []).join(", "),
  status: webinar.status || "draft",
  quota: String(webinar.quota ?? 0),
});

const createEmptyForm = (): WebinarFormState => ({
  title: "",
  category: "",
  description: "",
  duration: "",
  price: "0",
  isFree: true,
  scheduleDate: "",
  scheduleTime: "",
  image: "",
  topics: "",
  benefits: "",
  status: "draft",
  quota: "0",
});

const splitCsv = (value: string) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

const NewsroomWebinarsAdmin = ({
  onLocalAction,
  onViewChange,
  query,
}: NewsroomWebinarsAdminProps) => {
  const [activeTab, setActiveTab] = useState<WebinarTab>("all");
  const [webinars, setWebinars] = useState<AdminWebinarRecord[]>([]);
  const [stats, setStats] = useState<AdminWebinarStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminWebinarRecord | null>(null);
  const [form, setForm] = useState<WebinarFormState>(createEmptyForm());
  const [deleteTarget, setDeleteTarget] = useState<AdminWebinarRecord | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadWebinars = useCallback(async (showLoading = false) => {
    try {
      const [listResult, statsResult] = await Promise.all([
        webinarAdminService.list({ limit: 100 }),
        webinarAdminService.stats(),
      ]);
      setWebinars(listResult.items);
      setStats(statsResult);
    } catch {
      onLocalAction("Newsroom: gagal memuat data webinar. Periksa koneksi server.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [onLocalAction]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async
    void loadWebinars(true);
  }, [loadWebinars]);

  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-webinar-menu]")) return;
      setActiveMenuId(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMenuId(null);
    };
    document.addEventListener("pointerdown", closeMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return webinars.filter((webinar) => {
      const matchesTab = activeTab === "all" || webinar.status === activeTab;
      const matchesQuery =
        !normalized ||
        [webinar.title, webinar.category, webinar.slug, webinar.status]
          .some((value) => String(value ?? "").toLowerCase().includes(normalized));
      return matchesTab && matchesQuery;
    });
  }, [activeTab, webinars, query]);

  const refreshAfterMutation = useCallback(() => {
    void loadWebinars(false);
    void newsroomService.hydrateAdmin().catch(() => undefined);
  }, [loadWebinars]);

  const setField = <K extends keyof WebinarFormState>(key: K, value: WebinarFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(createEmptyForm());
    setEditorOpen(true);
  };

  const openEdit = (webinar: AdminWebinarRecord) => {
    setEditing(webinar);
    setForm(toFormState(webinar));
    setEditorOpen(true);
  };

  const save = async () => {
    if (isSaving) return;
    if (!form.title.trim()) {
      onLocalAction("Newsroom: judul webinar wajib diisi.");
      return;
    }

    setIsSaving(true);
    const payload: AdminWebinarPayload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      duration: form.duration.trim(),
      price: Number(form.price) || 0,
      isFree: form.isFree,
      scheduleDate: form.scheduleDate,
      scheduleTime: form.scheduleTime,
      image: form.image.trim(),
      topics: splitCsv(form.topics),
      benefits: splitCsv(form.benefits),
      status: form.status,
      quota: Number(form.quota) || 0,
    };

    try {
      if (editing) {
        await webinarAdminService.update(editing.id, payload);
        onLocalAction(`Newsroom: webinar "${payload.title}" berhasil diperbarui.`);
      } else {
        await webinarAdminService.create(payload);
        onLocalAction(`Newsroom: webinar "${payload.title}" berhasil dibuat.`);
      }
      setEditorOpen(false);
      setEditing(null);
      refreshAfterMutation();
    } catch (error) {
      const message = (error as { message?: string })?.message;
      onLocalAction(message ? `Newsroom: gagal menyimpan webinar. ${message}` : "Newsroom: webinar belum dapat disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (webinar: AdminWebinarRecord) => {
    const next: WebinarStatus = webinar.status === "published" ? "draft" : "published";
    try {
      await webinarAdminService.updateStatus(webinar.id, next);
      onLocalAction(`Newsroom: status webinar "${webinar.title}" diubah ke ${next}.`);
      setActiveMenuId(null);
      refreshAfterMutation();
    } catch {
      onLocalAction("Newsroom: gagal mengubah status webinar.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await webinarAdminService.remove(deleteTarget.id);
      onLocalAction(`Newsroom: webinar "${deleteTarget.title}" berhasil dihapus.`);
      setDeleteTarget(null);
      refreshAfterMutation();
    } catch {
      onLocalAction("Newsroom: webinar belum dapat dihapus. Pastikan tidak menjadi acuan sertifikat.");
    } finally {
      setIsDeleting(false);
    }
  };

  const exportReport = () => {
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      ["ID", "Title", "Category", "Price", "Status", "Registered"],
      ...webinars.map((w) => [w.id, w.title, w.category, String(w.price), w.status, String(w.registered_count ?? 0)]),
    ];
    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mahreen-webinars-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    onLocalAction("Laporan webinar berhasil diekspor.");
  };

  const totalRegistered = (stats?.totalRegistered ?? 0);

  return (
    <>
      <style data-component="admin-webinars">{webinarAdminStyles}</style>

      <div className="admin-newsroom-switcher" role="tablist" aria-label="Pilih konten newsroom">
        <button type="button" role="tab" aria-selected={false} onClick={() => onViewChange("articles")}>Articles</button>
        <button type="button" role="tab" aria-selected={false} onClick={() => onViewChange("tags")}>Tags</button>
        <button type="button" role="tab" aria-selected={false} onClick={() => onViewChange("events")}>Events</button>
        <button type="button" role="tab" aria-selected className="is-active">Webinars</button>
      </div>

      <div className="admin-newsroom-heading admin-animate">
        <div>
          <h1>Webinar Management</h1>
          <p>Kelola webinar, jadwal, harga, mentor, dan status publikasi.</p>
          <span className="admin-newsroom-sync-badge"><span /> <Cloud size={12} /> {newsroomService.getDataSourceMode()} sync</span>
        </div>
        <div>
          <button className="admin-newsroom-export" type="button" onClick={exportReport}><Download size={15} /> Export Report</button>
          <button className="admin-newsroom-create" type="button" onClick={openCreate}><Plus size={16} /> Create Webinar</button>
        </div>
      </div>

      <section className="admin-newsroom-metrics" aria-label="Webinar metrics">
        <NewsroomMetricCard context={`${stats?.published ?? 0} published`} icon={<Video size={19} />} label="Total Webinars" value={(stats?.total ?? 0).toLocaleString("id-ID")} />
        <NewsroomMetricCard context={`${stats?.freeCount ?? 0} gratis`} icon={<Eye size={19} />} label="Registered" value={totalRegistered.toLocaleString("id-ID")} />
      </section>

      <div className="admin-events-panel">
        <h2>Semua Webinar</h2>
        <div>
          <button className="admin-newsroom-create" type="button" onClick={openCreate}><Plus size={15} /> Tambah</button>
        </div>
      </div>

      <div className="admin-webinars-toolbar">
        {(["all", "published", "draft"] as const).map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? "is-active" : ""} onClick={() => setActiveTab(tab)}>
            {tab === "all" ? "Semua" : tab === "published" ? "Published" : "Draft"}
          </button>
        ))}
      </div>

      {isLoading ? null : filtered.length === 0 ? (
        <div className="admin-webinars-empty">Belum ada webinar. Klik "Create Webinar" untuk menambah.</div>
      ) : (
        <div className="admin-webinars-list">
          {filtered.map((webinar) => (
            <div className="admin-webinar-row" key={webinar.id}>
              <div className="admin-webinar-thumb">
                {webinar.image ? <img src={webinar.image} alt="" loading="lazy" /> : <Video size={20} />}
              </div>
              <div className="admin-webinar-main">
                <h3>{webinar.title}</h3>
                <p>{webinar.schedule_date ? `${webinar.schedule_date}${webinar.schedule_time ? ` · ${webinar.schedule_time}` : ""}` : webinar.category || "Belum dijadwalkan"}</p>
              </div>
              <span className={webinar.is_free === 1 ? "admin-webinar-free" : "admin-webinar-price"}>
                {webinar.is_free === 1 ? "GRATIS" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(webinar.price)}
              </span>
              <span className={`admin-webinar-badge is-${webinar.status}`}>{webinar.status}</span>
              <span className="admin-webinar-registered">{webinar.registered_count ?? 0} terdaftar</span>
              <div className="admin-webinar-actions" data-webinar-menu>
                <button type="button" aria-label="Aksi webinar" onClick={() => setActiveMenuId(activeMenuId === webinar.id ? null : webinar.id)}><MoreVertical size={15} /></button>
                {activeMenuId === webinar.id ? (
                  <div className="admin-webinar-menu">
                    <button type="button" onClick={() => { setActiveMenuId(null); openEdit(webinar); }}><Pencil size={13} /> Edit</button>
                    <button type="button" onClick={() => void toggleStatus(webinar)}><CalendarDays size={13} /> {webinar.status === "published" ? "Set Draft" : "Publish"}</button>
                    <button type="button" className="is-danger" onClick={() => { setActiveMenuId(null); setDeleteTarget(webinar); }}><Trash2 size={13} /> Hapus</button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {editorOpen ? (
        <div className="admin-webinar-dialog" role="dialog" aria-modal="true">
          <button type="button" className="admin-webinar-dialog__backdrop" aria-label="Tutup" onClick={() => setEditorOpen(false)} />
          <div className="admin-webinar-dialog__panel">
            <div className="admin-webinar-dialog__heading">
              <h2>{editing ? "Edit Webinar" : "Buat Webinar"}</h2>
              <button type="button" className="admin-webinar-dialog__close" aria-label="Tutup" onClick={() => setEditorOpen(false)}>×</button>
            </div>
            <div className="admin-webinar-form">
              <div className="admin-webinar-form__field">
                <label>Judul *</label>
                <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} />
              </div>
              <div className="admin-webinar-form__row">
                <div className="admin-webinar-form__field">
                  <label>Kategori</label>
                  <input type="text" value={form.category} onChange={(e) => setField("category", e.target.value)} />
                </div>
                <div className="admin-webinar-form__field">
                  <label>Durasi</label>
                  <input type="text" value={form.duration} placeholder="2 jam" onChange={(e) => setField("duration", e.target.value)} />
                </div>
              </div>
              <div className="admin-webinar-form__field">
                <label>Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} />
              </div>
              <div className="admin-webinar-form__row">
                <div className="admin-webinar-form__field">
                  <label>Harga (0 = gratis)</label>
                  <input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
                </div>
                <div className="admin-webinar-form__field">
                  <label>Gratis</label>
                  <select value={form.isFree ? "yes" : "no"} onChange={(e) => setField("isFree", e.target.value === "yes")}>
                    <option value="yes">Ya</option>
                    <option value="no">Tidak</option>
                  </select>
                </div>
              </div>
              <div className="admin-webinar-form__row">
                <div className="admin-webinar-form__field">
                  <label>Tanggal</label>
                  <input type="date" value={form.scheduleDate} onChange={(e) => setField("scheduleDate", e.target.value)} />
                </div>
                <div className="admin-webinar-form__field">
                  <label>Waktu</label>
                  <input type="text" value={form.scheduleTime} placeholder="14:00-16:00" onChange={(e) => setField("scheduleTime", e.target.value)} />
                </div>
              </div>
              <div className="admin-webinar-form__field">
                <label>URL Gambar</label>
                <input type="text" value={form.image} placeholder="/uploads/..." onChange={(e) => setField("image", e.target.value)} />
              </div>
              <div className="admin-webinar-form__row">
                <div className="admin-webinar-form__field">
                  <label>Topik (koma)</label>
                  <input type="text" value={form.topics} placeholder="AI, Machine Learning" onChange={(e) => setField("topics", e.target.value)} />
                </div>
                <div className="admin-webinar-form__field">
                  <label>Benefit (koma)</label>
                  <input type="text" value={form.benefits} placeholder="Sertifikat, Materi PDF" onChange={(e) => setField("benefits", e.target.value)} />
                </div>
              </div>
              <div className="admin-webinar-form__row">
                <div className="admin-webinar-form__field">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setField("status", e.target.value as WebinarStatus)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="admin-webinar-form__field">
                  <label>Kuota</label>
                  <input type="number" value={form.quota} onChange={(e) => setField("quota", e.target.value)} />
                </div>
              </div>
              <div className="admin-webinar-form__actions">
                <button type="button" className="admin-webinar-form__cancel" onClick={() => setEditorOpen(false)}>Batal</button>
                <button type="button" className="admin-webinar-form__save" onClick={() => void save()} disabled={isSaving}>
                  {isSaving ? "Menyimpan..." : editing ? "Simpan" : "Buat"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="admin-webinar-dialog" role="dialog" aria-modal="true">
          <button type="button" className="admin-webinar-dialog__backdrop" aria-label="Tutup" onClick={() => setDeleteTarget(null)} />
          <div className="admin-webinar-dialog__panel">
            <div className="admin-webinar-dialog__heading"><h2>Hapus Webinar</h2></div>
            <p style={{ color: "#9a948a", fontSize: 13, lineHeight: 1.6 }}>
              Yakin ingin menghapus <strong style={{ color: "#e6e0d8" }}>{deleteTarget.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="admin-webinar-form__actions">
              <button type="button" className="admin-webinar-form__cancel" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button type="button" className="admin-webinar-form__save" onClick={() => void confirmDelete()} disabled={isDeleting}>
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default NewsroomWebinarsAdmin;
