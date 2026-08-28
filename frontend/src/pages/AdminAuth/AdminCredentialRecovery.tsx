import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CircleCheck,
  ContactRound,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import {
  adminCredentialRecoveryService,
  type AdminRecoverySelection,
} from "../../services/auth/adminCredentialRecoveryService";
import { navigateToHashRoute } from "../../utils/hashNavigation";
import AdminAuthShell from "./AdminAuthShell";

const recoveryOptions: ReadonlyArray<{
  value: AdminRecoverySelection;
  label: string;
  icon: typeof ContactRound;
}> = [
  { value: "administrator-id", label: "Administrator ID", icon: ContactRound },
  { value: "security-key", label: "Security Key", icon: KeyRound },
  { value: "both", label: "Both", icon: ShieldCheck },
];

const AdminCredentialRecovery = () => {
  const [selection, setSelection] = useState<AdminRecoverySelection>("administrator-id");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setRequestId("");
    setSubmitting(true);

    try {
      const request = await adminCredentialRecoveryService.requestRecovery(selection, email);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 420));
      setRequestId(request.id);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Identity verification belum dapat diproses.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthShell variant="recovery">
      <div className="admin-recovery-form-wrap">
        <div className="admin-recovery-heading admin-auth-reveal" style={{ "--admin-auth-delay": "80ms" } as React.CSSProperties}>
          <h1>Identity Verification</h1>
          <p>Select the credentials you wish to recover.</p>
        </div>

        <form className="admin-recovery-form" onSubmit={handleSubmit}>
          <fieldset className="admin-recovery-options admin-auth-reveal" style={{ "--admin-auth-delay": "150ms" } as React.CSSProperties}>
            <legend>Recovery Selection</legend>
            {recoveryOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  className={selection === option.value ? "is-active" : ""}
                  type="button"
                  key={option.value}
                  aria-pressed={selection === option.value}
                  onClick={() => { setSelection(option.value); setError(""); setRequestId(""); }}
                >
                  <Icon size={14} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </fieldset>

          <label className="admin-recovery-email admin-auth-reveal" style={{ "--admin-auth-delay": "220ms" } as React.CSSProperties}>
            <span>Registered Corporate Email</span>
            <span className="admin-secure-input">
              <AtSign size={15} />
              <input
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(""); setRequestId(""); }}
                placeholder="admin@mahreenindonesia.com"
                autoComplete="email"
                required
              />
            </span>
            <small>Must be your assigned corporate email address.</small>
          </label>

          {error ? <p className="admin-secure-feedback is-error" role="alert">{error}</p> : null}
          {requestId ? (
            <p className="admin-secure-feedback is-success" role="status">
              <CircleCheck size={14} /> Verification recorded: {requestId}
            </p>
          ) : null}

          <button className="admin-recovery-submit admin-auth-reveal" style={{ "--admin-auth-delay": "290ms" } as React.CSSProperties} type="submit" disabled={submitting}>
            <span>{submitting ? "Verifying Identity" : "Verify Identity"}</span>
            {submitting ? <LoaderCircle className="is-spinning" size={16} /> : <ArrowRight size={16} />}
          </button>
        </form>

        <div className="admin-recovery-links admin-auth-reveal" style={{ "--admin-auth-delay": "360ms" } as React.CSSProperties}>
          <button type="button" onClick={() => navigateToHashRoute("/admin/login")}><ArrowLeft size={13} /> Back to Secure Login</button>
          <a href="mailto:info@mahreenindonesia.com"><ContactRound size={12} /> Contact System Admin</a>
        </div>
      </div>
    </AdminAuthShell>
  );
};

export default AdminCredentialRecovery;
