import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import type { DirectoryDivision, DirectoryRoleOption, DirectoryUserStatus, NewDirectoryUser } from "./types";

type CreateUserModalProps = Readonly<{
  onClose: () => void;
  onSubmit: (user: NewDirectoryUser) => Promise<{ ok: boolean; message?: string }>;
  roles: ReadonlyArray<DirectoryRoleOption>;
}>;

const CreateUserModal = ({ onClose, onSubmit, roles }: CreateUserModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [division, setDivision] = useState<DirectoryDivision>("Consultancy");
  const [role, setRole] = useState(() => {
    const client = roles.find((item) => item.slug === "client");
    return client?.slug ?? roles[0]?.slug ?? "client";
  });
  const [status, setStatus] = useState<DirectoryUserStatus>("Active");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedRole = roles.find((item) => item.slug === role);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await onSubmit({ name, email, password, division, role, status });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message || "Account could not be created.");
      return;
    }
    onClose();
  };

  return (
    <div className="user-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="user-modal" role="dialog" aria-modal="true" aria-labelledby="create-user-title">
        <header><div><span>New account</span><h2 id="create-user-title">Create Account</h2><p>Account is created via the Mahreen administration API.</p></div><button type="button" aria-label="Close create account dialog" onClick={onClose}><X size={20} /></button></header>
        <form onSubmit={handleSubmit}>
          <label><span>Full name</span><input autoFocus required value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="e.g. Aulia Rahman" /></label>
          <label><span>Email address</span><input required type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="name@mahreen.id" /></label>
          <label><span>Kata sandi awal</span><input required minLength={8} type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Minimal 8 karakter" /></label>
          <div className="user-modal__grid">
            <label><span>Division</span><select value={division} onChange={(event) => setDivision(event.target.value as DirectoryDivision)}><option>Consultancy</option><option>Studio</option><option>Volunteer</option><option>CSR</option><option>Internship</option></select></label>
            <label>
              <span>Role</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                {roles.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}{item.permissionCount !== undefined ? ` (${item.permissionCount} izin)` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {selectedRole && typeof selectedRole.permissionCount === "number" ? (
            <p className="user-modal__role-hint">
              Role ini memiliki <strong>{selectedRole.permissionCount}</strong> permission yang aktif di sistem.
            </p>
          ) : null}
          <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as DirectoryUserStatus)}><option>Active</option><option>Pending</option><option>Suspended</option></select></label>
          {error ? <p className="user-modal__error" role="alert">{error}</p> : null}
          <footer><button type="button" onClick={onClose}>Cancel</button><button className="is-primary" type="submit" disabled={submitting}>{submitting ? "Membuat..." : <><Plus size={16} /> Create Account</>}</button></footer>
        </form>
      </section>
    </div>
  );
};

export default CreateUserModal;
