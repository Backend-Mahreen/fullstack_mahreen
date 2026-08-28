import { useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import type { DirectoryRoleOption, DirectoryUser, DirectoryUserStatus } from "./types";

type UserActionModalProps = Readonly<{
  mode: "status" | "role" | "delete";
  user: DirectoryUser;
  roles: ReadonlyArray<DirectoryRoleOption>;
  onClose: () => void;
  onConfirm: (value?: string) => Promise<{ ok: boolean; message?: string }>;
}>;

const STATUS_OPTIONS: readonly DirectoryUserStatus[] = ["Active", "Pending", "Suspended"];

const UserActionModal = ({ mode, user, roles, onClose, onConfirm }: UserActionModalProps) => {
  const [status, setStatus] = useState<DirectoryUserStatus>(user.status);
  const [role, setRole] = useState(user.role);
  const [forceDelete, setForceDelete] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const titles: Record<UserActionModalProps["mode"], string> = {
    status: "Ubah Status",
    role: "Ubah Peran",
    delete: "Hapus Pengguna",
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = mode === "delete"
      ? await onConfirm(forceDelete ? "force" : undefined)
      : await onConfirm(mode === "status" ? status : role);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message || "Operasi gagal.");
      return;
    }
    onClose();
  };

  return (
    <div className="user-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="user-modal" role="dialog" aria-modal="true" aria-labelledby="user-action-title">
        <header>
          <div><span>User directory</span><h2 id="user-action-title">{titles[mode]}</h2><p>{user.name} · {user.email}</p></div>
          <button type="button" aria-label="Tutup dialog" onClick={onClose}><X size={20} /></button>
        </header>
        <form onSubmit={handleSubmit}>
          {mode === "status" ? (
            <label><span>Status</span>
              <select value={status} onChange={(event) => { setStatus(event.target.value as DirectoryUserStatus); setError(""); }}>
                {STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          ) : null}
          {mode === "role" ? (
            <label><span>Peran</span>
              <select value={role} onChange={(event) => { setRole(event.target.value); setError(""); }}>
                {roles.map((option) => <option key={option.slug} value={option.slug}>{option.name}{option.permissionCount !== undefined ? ` (${option.permissionCount} izin)` : ""}</option>)}
              </select>
            </label>
          ) : null}
          {mode === "delete" ? (
            <label className="user-modal__danger">
              <input type="checkbox" checked={forceDelete} onChange={(event) => setForceDelete(event.target.checked)} />
              <span>Paksa hapus (lepaskan data terkait transaksi, donasi, sertifikat, dll)</span>
            </label>
          ) : null}
          {error ? <p className="user-modal__error" role="alert">{error}</p> : null}
          <footer>
            <button type="button" onClick={onClose}>Cancel</button>
            <button className={mode === "delete" ? "is-danger" : "is-primary"} type="submit" disabled={submitting}>
              <Check size={16} /> {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default UserActionModal;
