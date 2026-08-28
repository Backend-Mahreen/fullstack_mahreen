type AdminPageSkeletonProps = Readonly<{
  compact?: boolean;
}>;

const AdminPageSkeleton = ({ compact = false }: AdminPageSkeletonProps) => (
  <div className={`admin-page-skeleton${compact ? " is-compact" : ""}`} aria-label="Memuat halaman Admin" aria-busy="true">
    <div className="admin-page-skeleton__heading">
      <span />
      <span />
    </div>
    <div className="admin-page-skeleton__metrics">
      {Array.from({ length: 4 }, (_, index) => <span key={index} />)}
    </div>
    <div className="admin-page-skeleton__grid">
      <span />
      <span />
    </div>
    <div className="admin-page-skeleton__table">
      {Array.from({ length: compact ? 3 : 5 }, (_, index) => <span key={index} />)}
    </div>
  </div>
);

export default AdminPageSkeleton;
