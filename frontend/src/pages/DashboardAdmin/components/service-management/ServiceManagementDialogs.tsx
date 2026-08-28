import { BriefcaseBusiness, UserRoundCheck, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type {
  NewServiceInput,
  ServiceLifecycleStatus,
  ServiceOperation,
  ServiceRequest,
} from "../../../../services/serviceManagement/serviceManagementRepository";

type DialogShellProps = {
  children: React.ReactNode;
  onClose: () => void;
  titleId: string;
};

const DialogShell = ({ children, onClose, titleId }: DialogShellProps) => (
  <div className="sm-admin__dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="sm-admin__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button className="sm-admin__dialog-close" type="button" aria-label="Close dialog" onClick={onClose}><X aria-hidden="true" /></button>
      {children}
    </section>
  </div>
);

type ServiceFormDialogProps = {
  onClose: () => void;
  onSubmit: (input: NewServiceInput) => void;
};

export const ServiceFormDialog = ({ onClose, onSubmit }: ServiceFormDialogProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<ServiceLifecycleStatus>("Active");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !category.trim()) return;
    onSubmit({ name, category, price: Number(price) || 0, status });
  };

  return (
    <DialogShell onClose={onClose} titleId="service-form-title">
      <header className="sm-admin__dialog-heading"><span><BriefcaseBusiness aria-hidden="true" /></span><div><small>Service Portfolio</small><h2 id="service-form-title">Tambah Service</h2><p>Simpan layanan baru pada database lokal admin.</p></div></header>
      <form className="sm-admin__dialog-form" onSubmit={submit}>
        <label><span>Service Name</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Strategic Branding" required /></label>
        <label><span>Category</span><input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Branding, Audit, Consulting" required /></label>
        <label><span>Base Price</span><input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" /></label>
        <label><span>Lifecycle Status</span><select value={status} onChange={(event) => setStatus(event.target.value as ServiceLifecycleStatus)}><option>Active</option><option>Draft</option><option>Archived</option></select></label>
        <div className="sm-admin__dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save Service</button></div>
      </form>
    </DialogShell>
  );
};

type AssignPmDialogProps = {
  bulk?: boolean;
  request?: ServiceRequest | null;
  onClose: () => void;
  onSubmit: (projectManager: string) => void;
};

export const AssignPmDialog = ({ bulk = false, request, onClose, onSubmit }: AssignPmDialogProps) => {
  const [projectManager, setProjectManager] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectManager.trim()) return;
    onSubmit(projectManager.trim());
  };

  return (
    <DialogShell onClose={onClose} titleId="assign-pm-title">
      <header className="sm-admin__dialog-heading"><span><UserRoundCheck aria-hidden="true" /></span><div><small>Project Assignment</small><h2 id="assign-pm-title">{bulk ? "Bulk Assign PM" : "Assign Project Manager"}</h2><p>{bulk ? "Tetapkan PM untuk seluruh permintaan yang belum memiliki penanggung jawab." : `Tetapkan PM untuk ${request?.clientName ?? "permintaan ini"}.`}</p></div></header>
      <form className="sm-admin__dialog-form" onSubmit={submit}>
        <label className="is-wide"><span>Project Manager Name</span><input autoFocus value={projectManager} onChange={(event) => setProjectManager(event.target.value)} placeholder="Masukkan nama Project Manager" required /></label>
        <div className="sm-admin__dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Assign PM</button></div>
      </form>
    </DialogShell>
  );
};

type OperationEditDialogProps = {
  operation: ServiceOperation;
  onClose: () => void;
  onSubmit: (patch: Pick<ServiceOperation, "lifecycleStatus" | "budget" | "progress">) => void;
};

export const OperationEditDialog = ({ operation, onClose, onSubmit }: OperationEditDialogProps) => {
  const [status, setStatus] = useState(operation.lifecycleStatus);
  const [budget, setBudget] = useState(String(operation.budget));
  const [progress, setProgress] = useState(String(operation.progress));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      lifecycleStatus: status.trim() || operation.lifecycleStatus,
      budget: Math.max(0, Number(budget) || 0),
      progress: Math.max(0, Math.min(100, Number(progress) || 0)),
    });
  };

  return (
    <DialogShell onClose={onClose} titleId="operation-edit-title">
      <header className="sm-admin__dialog-heading"><span><BriefcaseBusiness aria-hidden="true" /></span><div><small>{operation.id}</small><h2 id="operation-edit-title">Edit Active Operation</h2><p>{operation.title}</p></div></header>
      <form className="sm-admin__dialog-form" onSubmit={submit}>
        <label className="is-wide"><span>Lifecycle Status</span><input value={status} onChange={(event) => setStatus(event.target.value)} required /></label>
        <label><span>Budget Allocation</span><input type="number" min="0" value={budget} onChange={(event) => setBudget(event.target.value)} /></label>
        <label><span>Progress (%)</span><input type="number" min="0" max="100" value={progress} onChange={(event) => setProgress(event.target.value)} /></label>
        <div className="sm-admin__dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save Changes</button></div>
      </form>
    </DialogShell>
  );
};
