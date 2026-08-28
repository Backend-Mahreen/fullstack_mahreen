import { useCallback, useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  CheckCircle2,
  Circle,
  CircleDot,
  KeyRound,
  Layers3,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  adminRolesRepository,
  type RoleRecord,
} from "../../../../services/admin/adminRolesRepository";
import { buildPermissionGroups } from "../../../../services/admin/permissionMeta";

type RolePermissionAdminProps = Readonly<{
  onToast: (message: string) => void;
}>;

type RoleEditor = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  permissions: Set<string>;
};

const emptyEditor: RoleEditor = {
  name: "",
  slug: "",
  description: "",
  permissions: new Set<string>(),
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

const RolePermissionAdmin = ({ onToast }: RolePermissionAdminProps) => {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [stats, setStats] = useState<{ totalRoles: number; systemRoles: number; customRoles: number } | null>(null);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<RoleEditor | null>(null);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const applySnapshot = (snapshot: Awaited<ReturnType<typeof adminRolesRepository.getSnapshot>>) => {
    setRoles(snapshot.roles);
    setStats(snapshot.stats ? { totalRoles: snapshot.stats.totalRoles, systemRoles: snapshot.stats.systemRoles, customRoles: snapshot.stats.customRoles } : null);
    setAllPermissions(snapshot.allPermissions);
    setLoading(false);
  };

  const reload = useCallback(() => adminRolesRepository.getSnapshot().then(applySnapshot), []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const permissionGroups = useMemo(() => buildPermissionGroups(allPermissions), [allPermissions]);

  const openCreate = () => {
    setError("");
    setPermissionSearch("");
    setEditor({ ...emptyEditor });
  };

  const openEdit = async (role: RoleRecord) => {
    setError("");
    setPermissionSearch("");
    const detail = role.permissions ? role : await adminRolesRepository.getRole(role.id);
    setEditor({
      id: role.id,
      name: detail?.name ?? role.name,
      slug: detail?.slug ?? role.slug,
      description: detail?.description ?? role.description,
      permissions: new Set<string>(detail?.permissions ?? []),
    });
  };

  const togglePermission = (permission: string) => {
    setEditor((current) => {
      if (!current) return current;
      const next = new Set(current.permissions);
      if (next.has(permission)) next.delete(permission);
      else next.add(permission);
      return { ...current, permissions: next };
    });
  };

  const toggleGroup = (groupKey: string) => {
    setEditor((current) => {
      if (!current) return current;
      const group = permissionGroups.find((item) => item.key === groupKey);
      if (!group) return current;
      const groupKeys = group.permissions.map((p) => p.key);
      const allSelected = groupKeys.every((key) => current.permissions.has(key));
      const next = new Set(current.permissions);
      for (const key of groupKeys) {
        if (allSelected) next.delete(key);
        else next.add(key);
      }
      return { ...current, permissions: next };
    });
  };

  const selectAllVisible = () => {
    setEditor((current) => {
      if (!current) return current;
      const visible = visibleGroups
        .flatMap((group) => group.permissions.map((p) => p.key));
      const next = new Set(current.permissions);
      for (const key of visible) next.add(key);
      return { ...current, permissions: next };
    });
  };

  const clearVisible = () => {
    setEditor((current) => {
      if (!current) return current;
      const visible = new Set(visibleGroups.flatMap((group) => group.permissions.map((p) => p.key)));
      const next = new Set(current.permissions);
      for (const key of visible) next.delete(key);
      return { ...current, permissions: next };
    });
  };

  const selectedCount = editor?.permissions.size ?? 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    if (!editor.name.trim()) {
      setError("Nama role wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: editor.name.trim(),
        slug: editor.slug.trim() || slugify(editor.name),
        description: editor.description.trim(),
        permissions: [...editor.permissions],
      };
      if (editor.id) {
        await adminRolesRepository.updateRole(editor.id, payload);
        onToast(`Role ${payload.name} berhasil diperbarui.`);
      } else {
        await adminRolesRepository.createRole(payload);
        onToast(`Role ${payload.name} berhasil dibuat.`);
      }
      setEditor(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan role.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: RoleRecord) => {
    if (role.isSystem) {
      onToast("Role sistem tidak dapat dihapus.");
      return;
    }
    const confirmed = window.confirm(
      `Hapus role "${role.name}"? Role yang masih digunakan oleh pengguna tidak dapat dihapus.`,
    );
    if (!confirmed) return;
    try {
      await adminRolesRepository.deleteRole(role.id);
      onToast(`Role ${role.name} dihapus.`);
      await reload();
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Gagal menghapus role.");
    }
  };

  const filteredGroups = useMemo(() => {
    const q = permissionSearch.trim().toLowerCase();
    if (!q) return permissionGroups;
    return permissionGroups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter((p) =>
          p.key.toLowerCase().includes(q) ||
          p.label.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [permissionGroups, permissionSearch]);

  const visibleGroups = editor ? filteredGroups : [];

  return (
    <section className="admin-feature-page admin-feature-enter admin-roles-page" aria-labelledby="admin-roles-title">
      <header className="admin-feature-heading">
        <div>
          <span className="admin-feature-eyebrow">ACCESS GOVERNANCE</span>
          <h1 id="admin-roles-title">Role &amp; <em>Permission</em></h1>
          <p>Atur role, permission, dan kebijakan akses pengguna di seluruh ekosistem Mahreen.</p>
        </div>
        <div className="admin-feature-heading__controls">
          <span className="admin-feature-live"><i /> Synced</span>
          <button className="admin-feature-gold-button" type="button" onClick={openCreate}><Plus size={16} /> Role Baru</button>
        </div>
      </header>

      <div className="admin-feature-metrics admin-roles-metrics">
        <article className="admin-feature-metric" style={{ "--feature-delay": "40ms" } as CSSProperties}><div className="admin-feature-metric__top"><ShieldCheck size={18} /><span>Total roles</span></div><span>System access</span><strong>{loading ? "…" : (stats?.totalRoles ?? roles.length)}</strong><small>Role terdaftar</small></article>
        <article className="admin-feature-metric" style={{ "--feature-delay": "100ms" } as CSSProperties}><div className="admin-feature-metric__top"><Layers3 size={18} /><span>System roles</span></div><span>Built-in</span><strong>{loading ? "…" : (stats?.systemRoles ?? 0)}</strong><small>Tidak dapat dihapus</small></article>
        <article className="admin-feature-metric" style={{ "--feature-delay": "160ms" } as CSSProperties}><div className="admin-feature-metric__top"><Pencil size={18} /><span>Custom roles</span></div><span>Kustom</span><strong>{loading ? "…" : (stats?.customRoles ?? 0)}</strong><small>Dapat diubah</small></article>
        <article className="admin-feature-metric" style={{ "--feature-delay": "220ms" } as CSSProperties}><div className="admin-feature-metric__top"><KeyRound size={18} /><span>Permissions</span></div><span>Granular keys</span><strong>{allPermissions.length}</strong><small>Daftar izin sistem</small></article>
      </div>

      <div className="admin-roles-table-panel">
        <header className="admin-feature-panel__heading"><h2>Role Registry</h2><span className="admin-roles-table-hint">{roles.length} role</span></header>
        <div className="admin-feature-table-scroll">
          <table className="admin-feature-table">
            <thead><tr><th>Role</th><th>Slug</th><th>Description</th><th>Permissions</th><th>Type</th><th aria-label="Aksi" /></tr></thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td><div className="admin-feature-person"><span>{role.name.slice(0, 1).toUpperCase()}</span><strong>{role.name}</strong></div></td>
                  <td><code>{role.slug}</code></td>
                  <td>{role.description || "—"}</td>
                  <td><span className="admin-roles-count">{role.permissionCount} izin</span></td>
                  <td>{role.isSystem ? <span className="admin-roles-system">System</span> : <span className="admin-roles-custom">Custom</span>}</td>
                  <td>
                    <div className="admin-roles-actions">
                      <button type="button" title="Edit role" onClick={() => void openEdit(role)}><Pencil size={14} /></button>
                      <button type="button" className="is-danger" title="Hapus role" disabled={role.isSystem} onClick={() => void handleDelete(role)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!roles.length && !loading ? (
                <tr><td colSpan={6}><div className="admin-empty-state">Belum ada role. Gunakan tombol “Role Baru” untuk membuat role kustom.</div></td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editor ? (
        <div className="user-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}>
          <section className="user-modal admin-roles-modal" role="dialog" aria-modal="true" aria-labelledby="role-editor-title">
            <header>
              <div>
                <span>Role &amp; Permission</span>
                <h2 id="role-editor-title">{editor.id ? "Edit Role" : "Role Baru"}</h2>
                <p>Kelola nama, slug, dan daftar permission role.</p>
              </div>
              <button type="button" aria-label="Tutup editor role" onClick={() => setEditor(null)}><X size={20} /></button>
            </header>
            <form onSubmit={handleSubmit}>
              <div className="admin-roles-editor-grid">
                <label><span>Nama role *</span><input autoFocus required value={editor.name} onChange={(event) => { setError(""); setEditor({ ...editor, name: event.target.value, slug: editor.id ? editor.slug : slugify(event.target.value) }); }} placeholder="e.g. Editor Newsroom" /></label>
                <label><span>Slug</span><input value={editor.slug} onChange={(event) => setEditor({ ...editor, slug: slugify(event.target.value) })} placeholder="auto-generated" /></label>
              </div>
              <label><span>Deskripsi</span><textarea rows={2} value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} placeholder="Ringkasan akses role ini" /></label>

              <div className="admin-roles-perm-header">
                <label className="admin-roles-perm-search">
                  <Search size={14} aria-hidden="true" />
                  <input
                    type="search"
                    value={permissionSearch}
                    onChange={(event) => setPermissionSearch(event.target.value)}
                    placeholder="Cari permission..."
                    aria-label="Cari permission"
                  />
                </label>
                <div className="admin-roles-perm-actions">
                  <span className="admin-roles-perm-count">
                    <CheckCircle2 size={14} /> {selectedCount} dari {allPermissions.length} permission dipilih
                  </span>
                  <button type="button" onClick={selectAllVisible}>Pilih semua tampil</button>
                  <button type="button" onClick={clearVisible}>Bersihkan tampil</button>
                </div>
              </div>

              <div className="admin-roles-permissions">
                {visibleGroups.map((group) => {
                  const selectedInGroup = group.permissions.filter((p) => editor.permissions.has(p.key)).length;
                  const allSelected = selectedInGroup === group.permissions.length;
                  const partial = selectedInGroup > 0 && !allSelected;
                  return (
                    <details key={group.key} open={group.permissions.length <= 8 || selectedInGroup > 0}>
                      <summary>
                        <span className="admin-roles-perm-group-title">
                          <i className={allSelected ? "is-all" : partial ? "is-partial" : ""}>
                            {allSelected ? <CheckCircle2 size={14} /> : partial ? <CircleDot size={14} /> : <Circle size={14} />}
                          </i>
                          <strong>{group.label}</strong>
                          <small>{selectedInGroup}/{group.permissions.length}</small>
                        </span>
                        <button
                          type="button"
                          className="admin-roles-perm-toggle"
                          onClick={(event) => { event.preventDefault(); toggleGroup(group.key); }}
                        >
                          {allSelected ? "Batalkan semua" : "Pilih semua"}
                        </button>
                      </summary>
                      <div className="admin-roles-permissions__grid">
                        {group.permissions.map((permission) => {
                          const selected = editor.permissions.has(permission.key);
                          return (
                            <label key={permission.key} className={selected ? "is-selected" : ""} title={permission.description}>
                              <input type="checkbox" checked={selected} onChange={() => togglePermission(permission.key)} />
                              <span className="admin-roles-perm-check">
                                {selected ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                              </span>
                              <span className="admin-roles-perm-text">
                                <b>{permission.label}</b>
                                <small>{permission.key}</small>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
                {visibleGroups.length === 0 ? <p className="admin-roles-empty-perms">Tidak ada permission yang cocok dengan pencarian.</p> : null}
                {allPermissions.length === 0 ? <p className="admin-roles-empty-perms">Daftar permission belum termuat.</p> : null}
              </div>

              {error ? <p className="user-modal__error" role="alert">{error}</p> : null}
              <footer>
                <button type="button" onClick={() => setEditor(null)}>Cancel</button>
                <button className="is-primary" type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Role"}</button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
};

export default RolePermissionAdmin;
