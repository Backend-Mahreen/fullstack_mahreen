import { Download, Eye, RefreshCw, ShieldCheck } from "lucide-react";

type RecoveryCodeCardProps = Readonly<{
  recoveryCode: string;
  revealed: boolean;
  onReveal: () => void;
  onRegenerate: () => void;
}>;

const RecoveryCodeCard = ({
  recoveryCode,
  revealed,
  onReveal,
  onRegenerate,
}: RecoveryCodeCardProps) => (
  <section className="twofa-card twofa-recovery twofa-reveal" style={{ "--twofa-delay": "230ms" } as React.CSSProperties}>
    <div className="twofa-section-title"><ShieldCheck aria-hidden="true" /><span>Kode Pemulihan Darurat</span></div>
    <p>Gunakan kode ini jika Anda kehilangan akses ke perangkat utama Anda. Simpan di tempat yang aman dan terenkripsi.</p>
    <button className="twofa-recovery__code" type="button" onClick={onReveal}>
      <Eye aria-hidden="true" />
      <span>{revealed ? recoveryCode : "Klik untuk Melihat Kode"}</span>
    </button>
    <div className="twofa-recovery__actions">
      <button type="button" onClick={() => window.print()}><Download aria-hidden="true" /> Unduh PDF</button>
      <button type="button" onClick={onRegenerate}><RefreshCw aria-hidden="true" /> Buat Ulang</button>
    </div>
  </section>
);

export default RecoveryCodeCard;

