import type { ReactNode } from "react";
import {
  getHashHref,
  handleHashRouteClick,
} from "../../utils/hashNavigation";

type LegalSectionLinkProps = {
  pagePath: "/kebijakan-privasi" | "/syarat-ketentuan";
  sectionId: string;
  children: ReactNode;
  className?: string;
};

const getCurrentSection = () => {
  if (typeof window === "undefined") return null;

  return new URLSearchParams(window.location.search).get("section");
};

const LegalSectionLink = ({
  pagePath,
  sectionId,
  children,
  className = "",
}: LegalSectionLinkProps) => {
  const routeTarget = `${pagePath}?section=${encodeURIComponent(sectionId)}`;
  const isActive = getCurrentSection() === sectionId;
  const linkClassName = [className, isActive ? "active" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      className={linkClassName || undefined}
      href={getHashHref(routeTarget)}
      aria-current={isActive ? "location" : undefined}
      onClick={(event) => handleHashRouteClick(event, routeTarget)}
    >
      {children}
    </a>
  );
};

export default LegalSectionLink;
