import { CheckCircle2, X } from "lucide-react";
type VerificationToastProps = Readonly<{ message: string; onClose: () => void }>;
const VerificationToast = ({ message, onClose }: VerificationToastProps) => (
  <div className="mvc-toast" role="status"><CheckCircle2 size={17} aria-hidden="true" /><span>{message}</span><button type="button" onClick={onClose} aria-label="Tutup pemberitahuan"><X size={14} /></button></div>
);
export default VerificationToast;
