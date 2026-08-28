import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = Readonly<{
  id: string;
  label: string;
  value: string;
  visible: boolean;
  autoComplete: "current-password" | "new-password";
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}>;

const PasswordField = ({
  id,
  label,
  value,
  visible,
  autoComplete,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) => (
  <label className="password-change-field" htmlFor={id}>
    <span>{label}</span>
    <span className="password-change-field__input">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        placeholder="••••••••••••"
        required
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        aria-label={visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
      >
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </button>
    </span>
  </label>
);

export default PasswordField;
