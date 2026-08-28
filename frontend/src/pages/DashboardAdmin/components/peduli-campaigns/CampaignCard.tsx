import { ArrowUpRight, MapPin } from "lucide-react";
import {
  formatCampaignCurrency,
  type CampaignRecord,
} from "../../../../services/campaign/campaignRepository";

type CampaignCardProps = {
  campaign: CampaignRecord;
  index: number;
  onOpen: (campaign: CampaignRecord) => void;
};

const CampaignCard = ({ campaign, index, onOpen }: CampaignCardProps) => (
  <article
    className="pcm-campaign-card pcm-reveal"
    style={{ "--pcm-delay": `${380 + index * 70}ms` } as React.CSSProperties}
  >
    <button
      className="pcm-campaign-card__image"
      onClick={() => onOpen(campaign)}
      type="button"
    >
      {campaign.thumbnail ? (
        <img decoding="async" loading="lazy" src={campaign.thumbnail} alt="" />
      ) : (
        <span className="pcm-campaign-card__placeholder" aria-hidden="true" />
      )}
      <span className="pcm-campaign-card__category">{campaign.category}</span>
      {campaign.category === "Emergency" ? (
        <span className="pcm-campaign-card__urgent">Urgent</span>
      ) : null}
      {campaign.status !== "Published" ? (
        <span className="pcm-campaign-card__draft">{campaign.status}</span>
      ) : null}
    </button>

    <div className="pcm-campaign-card__body">
      <div className="pcm-campaign-card__location">
        <MapPin aria-hidden="true" /> {campaign.location || "Lokasi belum diatur"}
      </div>
      <h2>{campaign.title}</h2>
      <p>{campaign.story || "Cerita campaign belum ditambahkan."}</p>

      <div className="pcm-campaign-card__amount">
        <span>{formatCampaignCurrency(campaign.collectedAmount)} collected</span>
        <strong>{campaign.progress}%</strong>
      </div>
      <div className="pcm-progress" aria-label={`Progress ${campaign.progress}%`}>
        <i style={{ width: `${campaign.progress}%` }} />
      </div>
      <div className="pcm-campaign-card__target">
        <span>Target: {formatCampaignCurrency(campaign.targetAmount)}</span>
        <span>{campaign.daysLeft} days left</span>
      </div>

      <footer>
        <span className="pcm-pic-avatar">{campaign.pic.trim().charAt(0) || "M"}</span>
        <span>
          <small>PIC</small>
          <strong>{campaign.pic || "Belum ditetapkan"}</strong>
        </span>
        <button onClick={() => onOpen(campaign)} type="button">
          Details <ArrowUpRight aria-hidden="true" />
        </button>
      </footer>
    </div>
  </article>
);

export default CampaignCard;
