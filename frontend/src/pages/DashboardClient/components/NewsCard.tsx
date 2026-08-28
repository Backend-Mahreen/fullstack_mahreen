import type { NewsItem } from "../types";

type NewsCardProps = {
  item: NewsItem;
};

const clientNewsCardStyles = `
  .client-dashboard__news-grid .client-dashboard__news-card {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 360px;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    color: inherit;
    text-decoration: none;
    transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
  }
  .client-dashboard__news-grid .client-dashboard__news-card:hover,
  .client-dashboard__news-grid .client-dashboard__news-card:focus-visible {
    border-color: rgba(223, 189, 112, 0.48);
    box-shadow: 0 22px 48px -28px rgba(223, 189, 112, 0.46);
    transform: translateY(-4px);
  }
  .client-dashboard__news-grid .client-dashboard__news-card > img {
    display: block;
    width: 100%;
    height: 166px;
    min-height: 166px;
    aspect-ratio: auto;
    object-fit: cover;
    filter: saturate(0.84) contrast(1.07) brightness(0.84);
  }
  .client-dashboard__news-grid .client-dashboard__news-card > div {
    display: flex;
    min-width: 0;
    min-height: 194px;
    padding: 21px 22px 24px;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
  }
  .client-dashboard__news-grid .client-dashboard__news-card h3 {
    display: -webkit-box;
    margin-top: 11px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.9);
    font-size: clamp(17px, 1.35vw, 21px);
    line-height: 1.3;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .client-dashboard__news-grid .client-dashboard__news-card p {
    display: -webkit-box;
    margin-top: 12px;
    overflow: hidden;
    color: #989898;
    font-size: 14px;
    line-height: 1.58;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .client-dashboard__news-card.is-new {
    position: relative;
    border-color: rgba(223, 189, 112, 0.48);
    animation: client-news-sync-in 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .client-dashboard__news-card .client-dashboard__news-card-badge {
    position: absolute;
    z-index: 2;
    top: 12px;
    right: 12px;
    padding: 5px 9px;
    border-radius: 999px;
    border: 1px solid rgba(255, 239, 190, 0.72);
    color: #120d05;
    background: linear-gradient(135deg, #f5dc91, #d9ae4d);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.34);
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  @keyframes client-news-sync-in {
    from { opacity: 0; transform: translateY(14px) scale(0.985); }
    to { opacity: 1; transform: none; }
  }
  @media (max-width: 580px) {
    .client-dashboard__news-grid .client-dashboard__news-card {
      min-height: 0;
    }
    .client-dashboard__news-grid .client-dashboard__news-card > img {
      height: auto;
      min-height: 0;
      aspect-ratio: 1.55 / 1;
    }
    .client-dashboard__news-grid .client-dashboard__news-card > div {
      min-height: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .client-dashboard__news-grid .client-dashboard__news-card { animation: none; transition: none; }
  }
`;

export const NewsCardStyles = () => (
  <style data-component="client-newsroom-card">{clientNewsCardStyles}</style>
);

const NewsCard = ({ item }: NewsCardProps) => (
  <a className={`dashboard-card client-dashboard__news-card${item.isNew ? " is-new" : ""}`} href={item.href} aria-label={`Baca berita ${item.title}`}>
    {item.isNew ? <span className="client-dashboard__news-card-badge">Baru dari Newsroom</span> : null}
    <img width="1200" height="800" decoding="async" loading="lazy" src={item.image} alt={item.imageAlt} />
    <div>
      <span>{item.category}</span>
      <h3>{item.title}</h3>
      <p>{item.excerpt}</p>
    </div>
  </a>
);

export default NewsCard;
