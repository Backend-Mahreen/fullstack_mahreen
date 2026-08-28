import {
  Cloud,
  Download,
  FileText,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  tagsAdminService,
  type TagRecord,
} from "../../../../services/newsroom/tagsAdminService";
import { newsroomService } from "../../../../services/newsroom/newsroomService";
import NewsroomMetricCard from "./NewsroomMetricCard";

type NewsroomTagsAdminProps = Readonly<{
  onLocalAction: (message: string) => void;
  onViewChange: (view: "articles" | "tags" | "events") => void;
  query: string;
}>;

const tagsAdminStyles = `
  .admin-newsroom-switcher {
    display: inline-flex;
    margin-bottom: 22px;
    padding: 4px;
    gap: 3px;
    border: 1px solid rgba(239, 199, 63, 0.18);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.018);
  }
  .admin-newsroom-switcher button {
    min-height: 36px;
    padding: 7px 16px;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #8f8a80;
    background: transparent;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }
  .admin-newsroom-switcher button:hover { color: #e7d594; }
  .admin-newsroom-switcher button.is-active {
    border-color: rgba(239, 199, 63, 0.4);
    color: #17140b;
    background: linear-gradient(135deg, #f5d35b, #e9ba37);
    box-shadow: 0 6px 16px rgba(226, 179, 47, 0.18);
  }

  .admin-tags-table {
    width: 100%;
    border-collapse: collapse;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .admin-tags-table th {
    padding: 10px 14px;
    text-align: left;
    color: #8f8a80;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(240, 200, 70, 0.12);
  }
  .admin-tags-table td {
    padding: 12px 14px;
    color: #d8d2c9;
    font-size: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    vertical-align: middle;
  }
  .admin-tags-table tr:hover td {
    background: rgba(240, 200, 70, 0.025);
  }
  .admin-tags-table .tag-title {
    color: #e8e5df;
    font-weight: 600;
  }
  .admin-tags-table .tag-desc {
    color: #8f8a80;
    font-size: 11px;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .admin-tags-count {
    display: inline-flex;
    min-height: 22px;
    padding: 3px 8px;
    align-items: center;
    border: 1px solid rgba(240, 200, 70, 0.18);
    border-radius: 999px;
    color: #c5b865;
    font-size: 10px;
    font-weight: 700;
    background: rgba(240, 200, 70, 0.06);
  }
  .admin-tags-actions {
    position: relative;
    display: flex;
    justify-content: flex-end;
  }
  .admin-tags-actions > button {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border: 0;
    border-radius: 3px;
    color: #a29c90;
    background: transparent;
    cursor: pointer;
    transition: color 160ms ease, background-color 160ms ease;
  }
  .admin-tags-actions > button:hover {
    color: #f0c846;
    background: rgba(240, 200, 70, 0.08);
  }
  .admin-tags-menu {
    position: absolute;
    z-index: 30;
    top: calc(100% + 4px);
    right: 0;
    display: grid;
    width: 150px;
    padding: 5px;
    gap: 2px;
    border: 1px solid rgba(239, 199, 63, 0.22);
    border-radius: 6px;
    background: rgba(15, 15, 14, 0.98);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5);
  }
  .admin-tags-menu button {
    display: flex;
    min-height: 34px;
    padding: 7px 10px;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 3px;
    color: #d6d1c8;
    background: transparent;
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    text-align: left;
    transition: color 140ms ease, background-color 140ms ease;
  }
  .admin-tags-menu button:hover {
    color: #f3d166;
    background: rgba(239, 199, 63, 0.08);
  }
  .admin-tags-menu button:last-child { color: #e89a8f; }
  .admin-tags-menu button:last-child:hover {
    color: #ffb0a4;
    background: rgba(211, 76, 57, 0.1);
  }

  .admin-tags-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }
  .admin-tags-dialog {
    width: min(100%, 480px);
    max-height: 80vh;
    overflow: auto;
    background: #151514;
    border: 1px solid rgba(240, 200, 70, 0.2);
    border-radius: 10px;
    padding: 24px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .admin-tags-dialog h3 {
    margin: 0 0 18px;
    color: #ece9e3;
    font-size: 16px;
    font-weight: 600;
  }
  .admin-tags-dialog label {
    display: grid;
    gap: 5px;
    margin-bottom: 14px;
  }
  .admin-tags-dialog label > span {
    color: #c5c0b7;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .admin-tags-dialog input,
  .admin-tags-dialog textarea {
    padding: 9px 11px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 5px;
    background: #0a0a09;
    color: #f4efe8;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 160ms ease;
  }
  .admin-tags-dialog input:focus,
  .admin-tags-dialog textarea:focus {
    border-color: rgba(240, 200, 70, 0.45);
  }
  .admin-tags-dialog textarea { resize: vertical; min-height: 60px; }
  .admin-tags-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 6px;
  }
  .admin-tags-dialog-actions button {
    padding: 8px 16px;
    border-radius: 5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 160ms ease;
  }
  .admin-tags-dialog-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
  .admin-tags-btn-cancel {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: #a29c90;
  }
  .admin-tags-btn-save {
    border: 1px solid rgba(240, 200, 70, 0.35);
    background: linear-gradient(135deg, #f5d35b, #e9ba37);
    color: #17140b;
  }
  .admin-tags-btn-delete {
    border: 1px solid rgba(211, 76, 57, 0.4);
    background: rgba(211, 76, 57, 0.1);
    color: #e89a8f;
    margin-right: auto;
  }

  .admin-newsroom-empty {
    padding: 32px 24px;
    text-align: center;
    color: #8f8a80;
    font-size: 13px;
  }
`;

const NewsroomTagsAdmin = ({
  onLocalAction,
  onViewChange,
  query,
}: NewsroomTagsAdminProps) => {
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete" | null>(null);
  const [editingTag, setEditingTag] = useState<TagRecord | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadTags = useCallback(
    async (showLoading = false) => {
      try {
        const result = await tagsAdminService.list({ limit: 100 });
        setTags(result.items);
      } catch {
        onLocalAction("Newsroom: gagal memuat data tags.");
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [onLocalAction],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async
    void loadTags(true);
  }, [loadTags]);

  useEffect(() => {
    const close = (e: PointerEvent) => {
      const t = e.target as Element;
      if (t.closest("[data-tag-menu]")) return;
      setActiveMenuId(null);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveMenuId(null); };
    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", esc);
    };
  }, []);

  const filteredTags = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((tag) =>
      !q ||
      tag.title.toLowerCase().includes(q) ||
      tag.description.toLowerCase().includes(q)
    );
  }, [tags, query]);

  const totalArticles = tags.reduce((s, t) => s + (t.article_count || 0), 0);
  const totalWebinars = tags.reduce((s, t) => s + (t.webinar_count || 0), 0);

  const openCreate = () => {
    setEditingTag(null);
    setFormTitle("");
    setFormDescription("");
    setDialogMode("create");
    setActiveMenuId(null);
  };

  const openEdit = (tag: TagRecord) => {
    setEditingTag(tag);
    setFormTitle(tag.title);
    setFormDescription(tag.description || "");
    setDialogMode("edit");
    setActiveMenuId(null);
  };

  const openDelete = (tag: TagRecord) => {
    setEditingTag(tag);
    setDialogMode("delete");
    setActiveMenuId(null);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setEditingTag(null);
  };

  const saveTag = async () => {
    if (!formTitle.trim()) {
      onLocalAction("Newsroom: judul tag wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      if (dialogMode === "create") {
        await tagsAdminService.create({ title: formTitle.trim(), description: formDescription.trim() });
        onLocalAction("Newsroom: tag baru berhasil dibuat.");
      } else if (dialogMode === "edit" && editingTag) {
        await tagsAdminService.update(editingTag.id, { title: formTitle.trim(), description: formDescription.trim() });
        onLocalAction(`Newsroom: tag "${editingTag.title}" berhasil diperbarui.`);
      }
      closeDialog();
      void loadTags();
      void newsroomService.hydrateAdmin().catch(() => undefined);
    } catch {
      onLocalAction("Newsroom: gagal menyimpan tag. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTag = async () => {
    if (!editingTag) return;
    setIsSaving(true);
    try {
      await tagsAdminService.remove(editingTag.id);
      onLocalAction(`Newsroom: tag "${editingTag.title}" berhasil dihapus.`);
      closeDialog();
      void loadTags();
      void newsroomService.hydrateAdmin().catch(() => undefined);
    } catch {
      onLocalAction("Newsroom: gagal menghapus tag. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const exportCsv = () => {
    const escape = (v: string) => `"${v.replaceAll('"', '""')}"`;
    const rows = [
      ["ID", "Title", "Description", "Articles", "Webinars"],
      ...tags.map((t) => [t.id, t.title, t.description || "", String(t.article_count), String(t.webinar_count)]),
    ];
    const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mahreen-tags-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    onLocalAction("Laporan tags berhasil diekspor.");
  };

  return (
    <section className="admin-newsroom-view">
      <style data-component="admin-newsroom-tags">{tagsAdminStyles}</style>

      <div className="admin-newsroom-switcher" role="tablist" aria-label="Pilih konten newsroom">
        <button type="button" role="tab" aria-selected={false} onClick={() => onViewChange("articles")}>Articles</button>
        <button className="is-active" type="button" role="tab" aria-selected={true}>Tags</button>
        <button type="button" role="tab" aria-selected={false} onClick={() => onViewChange("events")}>Events</button>
      </div>

      <header className="admin-newsroom-heading admin-animate">
        <div>
          <h1>Tags Intelligence</h1>
          <p>Manage topics, categories, and content taxonomy.</p>
          <span className="admin-newsroom-sync-badge">
            <span /> <Cloud size={12} /> api sync
          </span>
        </div>
        <div>
          <button className="admin-newsroom-export" type="button" onClick={exportCsv}><Download size={15} /> Export Report</button>
          <button className="admin-newsroom-create" type="button" onClick={openCreate}><Plus size={16} /> Create Tag</button>
        </div>
      </header>

      <section className="admin-newsroom-metrics" aria-label="Tag metrics">
        <NewsroomMetricCard
          context={`${totalArticles} total articles`}
          icon={<FileText size={19} />}
          label="Total Tags"
          value={String(tags.length)}
        />
        <NewsroomMetricCard
          context={`${totalWebinars} total webinars`}
          icon={<FileText size={19} />}
          label="Total Articles"
          value={String(totalArticles)}
        />
        <NewsroomMetricCard
          context="across all tags"
          icon={<FileText size={19} />}
          label="Total Webinars"
          value={String(totalWebinars)}
        />
      </section>

      <article className="admin-newsroom-panel admin-animate">
        <header className="admin-events-panel">
          <h2>Tag Directory</h2>
        </header>

        {isLoading ? (
          <div className="admin-newsroom-empty">Memuat data tags...</div>
        ) : filteredTags.length === 0 ? (
          <div className="admin-newsroom-empty">Tidak ada tag yang ditemukan.</div>
        ) : (
          <div style={{ padding: "12px 22px" }}>
            <table className="admin-tags-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Articles</th>
                  <th>Webinars</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="tag-title">{tag.title}</td>
                    <td className="tag-desc" title={tag.description || ""}>{tag.description || "—"}</td>
                    <td><span className="admin-tags-count">{tag.article_count}</span></td>
                    <td><span className="admin-tags-count">{tag.webinar_count}</span></td>
                    <td>
                      <div className="admin-tags-actions" data-tag-menu>
                        <button
                          type="button"
                          aria-label={`Aksi untuk ${tag.title}`}
                          aria-haspopup="menu"
                          aria-expanded={activeMenuId === tag.id}
                          onClick={() => setActiveMenuId((c) => c === tag.id ? null : tag.id)}
                        >
                          <MoreVertical size={15} />
                        </button>
                        {activeMenuId === tag.id ? (
                          <div className="admin-tags-menu" role="menu">
                            <button type="button" role="menuitem" onClick={() => openEdit(tag)}>
                              <Pencil size={13} /> Edit tag
                            </button>
                            <button type="button" role="menuitem" onClick={() => openDelete(tag)}>
                              <Trash2 size={13} /> Delete tag
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      {dialogMode === "delete" && editingTag ? (
        <div className="admin-tags-dialog-overlay" onClick={closeDialog}>
          <div className="admin-tags-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus Tag</h3>
            <p style={{ color: "#a29c90", fontSize: 13, marginTop: 0 }}>
              Yakin ingin menghapus tag <strong style={{ color: "#e8e5df" }}>"{editingTag.title}"</strong>?
              {editingTag.article_count > 0 && (
                <span style={{ color: "#e89a8f", display: "block", marginTop: 6 }}>
                  Tag ini masih memiliki {editingTag.article_count} artikel terkait.
                </span>
              )}
            </p>
            <div className="admin-tags-dialog-actions">
              <button className="admin-tags-btn-cancel" type="button" onClick={closeDialog} disabled={isSaving}>Batal</button>
              <button className="admin-tags-btn-delete" type="button" onClick={() => void deleteTag()} disabled={isSaving}>
                {isSaving ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {(dialogMode === "create" || dialogMode === "edit") ? (
        <div className="admin-tags-dialog-overlay" onClick={closeDialog}>
          <div className="admin-tags-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{dialogMode === "create" ? "Buat Tag Baru" : "Edit Tag"}</h3>
            <label>
              <span>Judul *</span>
              <input
                type="text"
                placeholder="e.g. Corporate Excellence"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                autoFocus
              />
            </label>
            <label>
              <span>Deskripsi</span>
              <textarea
                placeholder="Deskripsi singkat tag..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </label>
            <div className="admin-tags-dialog-actions">
              <button className="admin-tags-btn-cancel" type="button" onClick={closeDialog} disabled={isSaving}>Batal</button>
              <button className="admin-tags-btn-save" type="button" onClick={() => void saveTag()} disabled={isSaving}>
                {isSaving ? "Menyimpan..." : dialogMode === "create" ? "Buat Tag" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default NewsroomTagsAdmin;
