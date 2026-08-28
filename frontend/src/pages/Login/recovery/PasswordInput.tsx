import { Eye, EyeOff, LockKeyhole, RotateCcwKey } from "lucide-react";

type PasswordInputProps = Readonly<{
  id: string; label: string; value: string; onChange: (value: string) => void;
  visible: boolean; onToggleVisibility: () => void; confirmation?: boolean; autoComplete?: string;
}>;

const PasswordInput = ({ id, label, value, onChange, visible, onToggleVisibility, confirmation = false, autoComplete = "new-password" }: PasswordInputProps) => (
  <label className="recovery-field recovery-field--compact" htmlFor={id}>
    <span className="recovery-label">{label}</span>
    <span className="recovery-input-shell">
      <span className="recovery-input-icon" aria-hidden="true">{confirmation ? <RotateCcwKey size={18} /> : <LockKeyhole size={18} />}</span>
      <input id={id} className="recovery-input" type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder="••••••••••" autoComplete={autoComplete} minLength={8} required />
      <button className="recovery-password-toggle" type="button" onClick={onToggleVisibility} aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </span>
  </label>
);
export default PasswordInput;
