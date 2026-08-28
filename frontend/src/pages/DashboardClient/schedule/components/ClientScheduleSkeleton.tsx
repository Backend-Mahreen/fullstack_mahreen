const ClientScheduleSkeleton = () => (
  <div className="client-schedule-skeleton" aria-label="Memuat jadwal">
    {[0, 1, 2].map((item) => (
      <span key={item} />
    ))}
  </div>
);

export default ClientScheduleSkeleton;
