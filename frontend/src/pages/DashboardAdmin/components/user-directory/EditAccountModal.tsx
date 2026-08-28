import { useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import type { DirectoryRoleOption, DirectoryUser, DirectoryUserStatus } from "./types";

type EditAccountModalProps = Readonly<{
  user: DirectoryUser;
  roles: ReadonlyArray<DirectoryRoleOption>;
  onClose: () => void;
  onSubmit: (id: string, fields: { fullName?: string; email?: string; role?: string; status?: string }) => Promise<{ ok: boolean; message?: string }>;
}>;

const STATUS_OPTIONS: readonly DirectoryUserStatus[] = ["Active", "Pending", "Suspended"];

const EditAccountModal = ({ user, roles, onClose, onSubmit }: EditAccountModalProps) => {
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState<DirectoryUserStatus>(user.status);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedRole = roles.find((item) => item.slug === role);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await onSubmit(user.id, {
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      status,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message || "Gagal memperbarui akun.");
      return;
    }
    onClose();
  };

  const hasChanges =
    fullName.trim() !== user.name ||
    email.trim().toLowerCase() !== user.email.toLowerCase() ||
    role !== user.role ||
    status !== user.status;

  return (
    <div className="user-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="user-modal" role="dialog" aria-modal="true" aria-labelledby="edit-account-title">
        <header>
          <div><span>Edit akun</span><h2 id="edit-account-title">Edit Account</h2><p>Perbarui data akun {user.name}</p></div>
          <button type="button" aria-label="Tutup dialog" onClick={onClose}><X size={20} /></button>
        </header>
        <form onSubmit={handleSubmit}>
          <label><span>Full name</span><input required value={fullName} onChange={(event) => { setFullName(event.target.value); setError(""); }} placeholder="Nama lengkap" /></label>
          <label><span>Email address</span><input required type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="email@mahreen.id" /></label>
          <label>
            <span>Role</span>
            <select value={role} onChange={(event) => { setRole(event.target.value); setError(""); }}>
              {roles.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name}{option.permissionCount > 0 ? ` (${option.permissionCount} izin)` : ""}
                </option>
              ))}
            </select>
          </label>
          {selectedRole && selectedRole.permissionCount > 0 ? (
            <p className="user-modal__role-hint">
              Role ini memberikan <strong>{selectedRole.permissionCount}</strong> izin akses ke modul sistem.
            </p>
          ) : null}
          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => { setStatus(event.target.value as DirectoryUserStatus); setError(""); }}>
              {STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          {error ? <p className="user-modal__error" role="alert">{error}</p> : null}
          <footer>
            <button type="button" onClick={onClose}>Cancel</button>
            <button className="is-primary" type="submit" disabled={submitting || !hasChanges}>
              <Check size={16} /> {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default EditAccountModal;
