const RouteSkeleton = () => {
  return (
    <div
      className="route-skeleton"
      role="status"
      aria-live="polite"
      aria-label="Menyiapkan halaman"
    >
      <div className="route-skeleton__navbar" aria-hidden="true">
        <span className="route-skeleton__logo route-skeleton__shimmer" />
        <div className="route-skeleton__nav-links">
          <span className="route-skeleton__nav-link route-skeleton__shimmer" />
          <span className="route-skeleton__nav-link route-skeleton__shimmer" />
          <span className="route-skeleton__nav-link route-skeleton__shimmer" />
          <span className="route-skeleton__nav-link route-skeleton__shimmer" />
        </div>
        <span className="route-skeleton__account route-skeleton__shimmer" />
      </div>

      <div className="route-skeleton__body" aria-hidden="true">
        <section className="route-skeleton__hero">
          <span className="route-skeleton__eyebrow route-skeleton__shimmer" />
          <span className="route-skeleton__title route-skeleton__shimmer" />
          <span className="route-skeleton__subtitle route-skeleton__shimmer" />
          <div className="route-skeleton__actions">
            <span className="route-skeleton__button route-skeleton__shimmer" />
            <span className="route-skeleton__button route-skeleton__shimmer" />
          </div>
        </section>

        <section className="route-skeleton__content">
          <span className="route-skeleton__section-title route-skeleton__shimmer" />
          <div className="route-skeleton__cards">
            <span className="route-skeleton__card route-skeleton__shimmer" />
            <span className="route-skeleton__card route-skeleton__shimmer" />
            <span className="route-skeleton__card route-skeleton__shimmer" />
          </div>
        </section>
      </div>

      <span className="sr-only">Menyiapkan halaman</span>
    </div>
  );
};

export default RouteSkeleton;
