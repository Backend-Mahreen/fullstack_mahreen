import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";
import { useEffect } from "react";

type NewsroomEventDeleteDialogProps = Readonly<{
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}>;

const newsroomEventDeleteDialogStyles = `
  .admin-event-delete-backdrop {
    position: fixed;
    z-index: 500;
    inset: 0;
    display: grid;
    padding: 24px;
    place-items: center;
    background: rgba(0, 0, 0, 0.76);
    backdrop-filter: blur(12px);
    animation: admin-event-delete-backdrop-in 180ms ease both;
  }
  .admin-event-delete-dialog {
    position: relative;
    width: min(100%, 470px);
    padding: 30px;
    overflow: hidden;
    border: 1px solid rgba(239, 199, 63, 0.26);
    border-radius: 12px;
    color: #ece7df;
    background:
      radial-gradient(circle at 100% 0%, rgba(218, 82, 61, 0.1), transparent 38%),
      #141413;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
    animation: admin-event-delete-dialog-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .admin-event-delete-dialog__close {
    position: absolute;
    top: 14px;
    right: 14px;
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    color: #9b958b;
    background: rgba(255, 255, 255, 0.02);
    cursor: pointer;
  }
  .admin-event-delete-dialog__icon {
    display: grid;
    width: 50px;
    height: 50px;
    margin-bottom: 20px;
    place-items: center;
    border: 1px solid rgba(225, 91, 71, 0.26);
    border-radius: 12px;
    color: #ef9a8e;
    background: rgba(211, 76, 57, 0.09);
  }
  .admin-event-delete-dialog h2 {
    margin: 0;
    font-size: 23px;
    letter-spacing: -0.025em;
  }
  .admin-event-delete-dialog p {
    margin: 12px 0 0;
    color: #999288;
    font-size: 14px;
    line-height: 1.7;
  }
  .admin-event-delete-dialog p strong { color: #e7d8ad; }
  .admin-event-delete-dialog__actions {
    display: grid;
    margin-top: 26px;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .admin-event-delete-dialog__actions button {
    display: inline-flex;
    min-height: 45px;
    padding: 10px 16px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #d9d4cb;
    background: rgba(255, 255, 255, 0.025);
    cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 14px;
    transition: border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
  }
  .admin-event-delete-dialog__actions button:last-child {
    border-color: rgba(225, 91, 71, 0.48);
    color: #fff0ed;
    background: linear-gradient(135deg, #a53628, #d65342);
  }
  .admin-event-delete-dialog__actions button:hover { transform: translateY(-2px); }
  .admin-event-delete-dialog__actions button:disabled { opacity: 0.55; cursor: wait; transform: none; }
  .admin-event-delete-spinner { animation: admin-event-delete-spin 700ms linear infinite; }
  @keyframes admin-event-delete-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes admin-event-delete-dialog-in {
    from { opacity: 0; transform: translateY(18px) scale(0.96); }
    to { opacity: 1; transform: none; }
  }
  @keyframes admin-event-delete-spin { to { transform: rotate(360deg); } }
  @media (max-width: 520px) {
    .admin-event-delete-dialog { padding: 25px 21px; }
    .admin-event-delete-dialog__actions { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .admin-event-delete-backdrop,
    .admin-event-delete-dialog { animation: none; }
  }
`;

const NewsroomEventDeleteDialog = ({
  isDeleting,
  onCancel,
  onConfirm,
  title,
}: NewsroomEventDeleteDialogProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDeleting, onCancel]);

  return (
    <div
      className="admin-event-delete-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onCancel();
      }}
    >
      <style data-component="admin-event-delete-dialog">{newsroomEventDeleteDialogStyles}</style>
      <section className="admin-event-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-event-title">
        <button className="admin-event-delete-dialog__close" type="button" disabled={isDeleting} aria-label="Tutup konfirmasi" onClick={onCancel}>
          <X size={16} />
        </button>
        <span className="admin-event-delete-dialog__icon"><AlertTriangle size={24} /></span>
        <h2 id="delete-event-title">Delete this event?</h2>
        <p>
          Event <strong>“{title}”</strong> akan dihapus permanen dari admin dan
          halaman Event publik. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="admin-event-delete-dialog__actions">
          <button type="button" disabled={isDeleting} onClick={onCancel}>Cancel</button>
          <button type="button" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? <LoaderCircle className="admin-event-delete-spinner" size={15} /> : <Trash2 size={15} />}
            {isDeleting ? "Deleting..." : "Delete Event"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewsroomEventDeleteDialog;
