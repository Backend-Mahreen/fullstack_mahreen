import { Download } from "lucide-react";

type PrivacyDataCardProps = Readonly<{
  profileVisible: boolean;
  onProfileVisibilityChange: (visible: boolean) => void;
  onExport: () => void;
}>;

const PrivacyDataCard = ({
  profileVisible,
  onProfileVisibilityChange,
  onExport,
}: PrivacyDataCardProps) => (
  <section className="client-security-side-card">
    <h2 className="client-security-privacy__heading">Privasi & Data</h2>
    <div className="client-security-privacy__row">
      <span>
        <strong>Visibilitas Profil</strong>
        <small>Tampilkan profil Anda ke publik</small>
      </span>
      <label className="client-security-toggle">
        <input
          type="checkbox"
          checked={profileVisible}
          onChange={(event) => onProfileVisibilityChange(event.target.checked)}
        />
        <span aria-hidden="true" />
        <b className="client-account-visually-hidden">Visibilitas profil</b>
      </label>
    </div>
    <div className="client-security-privacy__divider" />
    <div className="client-security-export">
      <h3>Ekspor Data</h3>
      <button type="button" onClick={onExport}>
        <Download aria-hidden="true" />Unduh Data Saya
      </button>
      <p>Proses ini mungkin memakan waktu hingga 24 jam.</p>
    </div>
  </section>
);

export default PrivacyDataCard;
