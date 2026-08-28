import { LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import PasswordField from "./PasswordField";

type ChangePasswordFormProps = Readonly<{
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
  onCancel: () => void;
}>;

const ChangePasswordForm = ({ onSave, onCancel }: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visibleField, setVisibleField] = useState<"current" | "new" | "confirmation" | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (newPassword.length < 10) {
      setMessage("Kata sandi baru minimal 10 karakter.");
      return;
    }
    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setMessage("Gunakan huruf besar, huruf kecil, angka, dan simbol.");
      return;
    }
    if (newPassword !== confirmation) {
      setMessage("Konfirmasi kata sandi baru belum sama.");
      return;
    }

    setSaving(true);
    try {
      await onSave(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setSuccess(true);
      setMessage("Kata sandi berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kata sandi belum dapat diperbarui.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (field: "current" | "new" | "confirmation") =>
    setVisibleField((current) => current === field ? null : field);

  return (
    <form className="password-change-card password-change-form" onSubmit={submit}>
      <PasswordField
        id="security-current-password"
        label="Kata Sandi Saat Ini"
        value={currentPassword}
        visible={visibleField === "current"}
        autoComplete="current-password"
        onChange={setCurrentPassword}
        onToggleVisibility={() => toggle("current")}
      />

      <div className="password-change-form__divider" />

      <PasswordField
        id="security-new-password"
        label="Kata Sandi Baru"
        value={newPassword}
        visible={visibleField === "new"}
        autoComplete="new-password"
        onChange={setNewPassword}
        onToggleVisibility={() => toggle("new")}
      />
      <PasswordField
        id="security-confirm-password"
        label="Konfirmasi Kata Sandi Baru"
        value={confirmation}
        visible={visibleField === "confirmation"}
        autoComplete="new-password"
        onChange={setConfirmation}
        onToggleVisibility={() => toggle("confirmation")}
      />

      {message ? (
        <p className={`password-change-form__message${success ? " is-success" : ""}`} role="status">
          {message}
        </p>
      ) : null}

      <div className="password-change-form__divider is-action-divider" />
      <div className="password-change-actions">
        <button className="password-change-actions__save" type="submit" disabled={saving}>
          <LockKeyhole aria-hidden="true" />
          {saving ? "Menyimpan..." : "Simpan Kata Sandi"}
        </button>
        <button className="password-change-actions__cancel" type="button" onClick={onCancel}>
          Batal
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
