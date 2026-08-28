type PurchaseEmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

const PurchaseEmptyState = ({
  eyebrow = "Mahreen Studio",
  title,
  description,
  actionLabel,
  onAction,
}: PurchaseEmptyStateProps) => (
  <main className="purchase-empty" aria-labelledby="purchase-empty-title">
    <span className="purchase-empty__orb" aria-hidden="true" />
    <section className="purchase-empty__card">
      <p className="purchase-empty__eyebrow">{eyebrow}</p>
      <h1 className="purchase-empty__title" id="purchase-empty-title">{title}</h1>
      <p className="purchase-empty__description">{description}</p>
      <button className="purchase-empty__action" type="button" onClick={onAction}>
        <span>{actionLabel}</span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  </main>
);

export default PurchaseEmptyState;
