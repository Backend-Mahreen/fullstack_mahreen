export type ClientDocumentKind =
  | "pdf"
  | "figma"
  | "guide"
  | "sheet"
  | "invoice"
  | "legal";

export type ClientDocumentRecord = {
  id: string;
  title: string;
  project: string;
  sizeLabel: string;
  updatedAt: string;
  kind: ClientDocumentKind;
};
