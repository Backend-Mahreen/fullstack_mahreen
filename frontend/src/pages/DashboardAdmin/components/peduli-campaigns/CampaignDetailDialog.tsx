import { CalendarDays, Edit3, MapPin, Trash2, UsersRound, X } from "lucide-react";
import {
  formatCampaignCurrency,
  type CampaignRecord,
} from "../../../../services/campaign/campaignRepository";

type CampaignDetailDialogProps = {
  campaign: CampaignRecord;
  onClose: () => void;
  onDelete: (campaign: CampaignRecord) => void;
  onEdit: (campaign: CampaignRecord) => void;
};

const CampaignDetailDialog = ({
  campaign,
  onClose,
  onDelete,
  onEdit,
}: CampaignDetailDialogProps) => (
  <div className="pcm-dialog-backdrop" role="presentation" onMouseDown={onClose}>
    <section
      aria-labelledby="pcm-dialog-title"
      aria-modal="true"
      className="pcm-dialog"
      onMouseDown={(event) => event.stopPropagation()}
      role="dialog"
    >
      <button className="pcm-dialog__close" aria-label="Tutup detail" onClick={onClose} type="button">
        <X aria-hidden="true" />
      </button>
      <div className="pcm-dialog__cover">
        {campaign.thumbnail ? <img src={campaign.thumbnail} alt="" /> : null}
        <span>{campaign.category}</span>
      </div>
      <div className="pcm-dialog__content">
        <small>{campaign.id}</small>
        <h2 id="pcm-dialog-title">{campaign.title}</h2>
        <p>{campaign.story || "Cerita campaign belum tersedia."}</p>
        <div className="pcm-dialog__facts">
          <span><MapPin aria-hidden="true" />{campaign.location || "Belum diatur"}</span>
          <span><CalendarDays aria-hidden="true" />{campaign.daysLeft} hari tersisa</span>
          <span><UsersRound aria-hidden="true" />{campaign.donorCount} donatur</span>
        </div>
        <div className="pcm-dialog__funding">
          <span>
            <small>Terkumpul</small>
            <strong>{formatCampaignCurrency(campaign.collectedAmount)}</strong>
          </span>
          <span>
            <small>Target</small>
            <strong>{formatCampaignCurrency(campaign.targetAmount)}</strong>
          </span>
          <b>{campaign.progress}%</b>
        </div>
        <div className="pcm-progress"><i style={{ width: `${campaign.progress}%` }} /></div>
        <div className="pcm-dialog__actions">
          <button onClick={() => onDelete(campaign)} type="button">
            <Trash2 aria-hidden="true" /> Delete
          </button>
          <button onClick={() => onEdit(campaign)} type="button">
            <Edit3 aria-hidden="true" /> Edit Campaign
          </button>
        </div>
      </div>
    </section>
  </div>
);

export default CampaignDetailDialog;
