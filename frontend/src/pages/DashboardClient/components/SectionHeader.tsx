type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
  className?: string;
};


const SectionHeader = ({
  title,
  actionLabel,
  actionHref,
  children,
  className = "",
}: SectionHeaderProps) => (
  <>
<div className={`client-dashboard__section-heading ${className}`.trim()}>
      <h2>{title}</h2>
      {actionLabel && actionHref ? <a href={actionHref}>{actionLabel}</a> : children}
    </div>
  </>
);

export default SectionHeader;
