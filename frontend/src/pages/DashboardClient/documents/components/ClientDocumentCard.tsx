import {
  BookOpen,
  CircleDollarSign,
  Download,
  FileSignature,
  FileText,
  Palette,
  Sheet,
} from "lucide-react";
import type { CSSProperties } from "react";
import type {
  ClientDocumentKind,
  ClientDocumentRecord,
} from "../types";

const documentIcons = {
  pdf: FileText,
  figma: Palette,
  guide: BookOpen,
  sheet: Sheet,
  invoice: CircleDollarSign,
  legal: FileSignature,
} satisfies Record<ClientDocumentKind, typeof FileText>;

const formatDocumentDate = (value: string) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : value;
};

type ClientDocumentCardProps = Readonly<{
  document: ClientDocumentRecord;
  index: number;
  onDownload: (document: ClientDocumentRecord) => void;
}>;

const ClientDocumentCard = ({
  document,
  index,
  onDownload,
}: ClientDocumentCardProps) => {
  const Icon = documentIcons[document.kind];

  return (
    <article
      className="client-documents-card"
      style={{ "--client-document-index": index } as CSSProperties}
    >
      <span className="client-documents-card__icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="client-documents-card__copy">
        <h2>{document.title}</h2>
        <p>
          {document.project} • {document.sizeLabel} • {formatDocumentDate(document.updatedAt)}
        </p>
      </div>
      <button
        className="client-documents-card__download"
        type="button"
        aria-label={`Unduh ${document.title}`}
        onClick={() => onDownload(document)}
      >
        <Download aria-hidden="true" />
      </button>
    </article>
  );
};

export default ClientDocumentCard;
