import type { FormEvent } from "react";

type TrackingSearchCardProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  message?: string;
};

const TrackingSearchCard = ({ value, onChange, onSubmit, message }: TrackingSearchCardProps) => (
  <div className="search-card">
    <form className="search-form" onSubmit={onSubmit}>
      <div className="search-input-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Masukkan nomor resi atau ID pesanan"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={message ? "tracking-search-message" : undefined}
        />
      </div>
      <button type="submit" className="btn-lacak">
        <span>Lacak Sekarang</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
    {message ? <p className="tracking-search-message" id="tracking-search-message" role="status">{message}</p> : null}
  </div>
);

export default TrackingSearchCard;
