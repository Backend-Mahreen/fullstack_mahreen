const ClientDocumentsSkeleton = () => (
  <div className="client-documents-skeleton" aria-label="Memuat dokumen" role="status">
    {[0, 1, 2, 3, 4, 5].map((item) => (
      <span key={item} aria-hidden="true" />
    ))}
  </div>
);

export default ClientDocumentsSkeleton;
