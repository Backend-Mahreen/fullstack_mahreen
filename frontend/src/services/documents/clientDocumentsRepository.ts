import type { ClientDocumentRecord } from "../../pages/DashboardClient/documents/types";
import { createStoredZip, encodeUtf8 } from "../../utils/createStoredZip";
import {
  readJson,
  subscribeToPlatformData,
  writeJson,
} from "../storage/browserStorage";

const DOCUMENT_STORAGE_PREFIX = "mahreen:client-documents:v1";

const seedDocuments: ClientDocumentRecord[] = [
  {
    id: "brief-kartika-digital",
    title: "Brief_Kartika_Digital.pdf",
    project: "Redesign Website",
    sizeLabel: "2.4 MB",
    updatedAt: "2026-06-01T09:00:00.000Z",
    kind: "pdf",
  },
  {
    id: "wireframe-v2-final",
    title: "Wireframe_v2_Final.fig",
    project: "Redesign Website",
    sizeLabel: "8.1 MB",
    updatedAt: "2026-06-15T10:30:00.000Z",
    kind: "figma",
  },
  {
    id: "brand-guidelines-v1",
    title: "Brand_Guidelines_v1.pdf",
    project: "Brand Identity",
    sizeLabel: "14.2 MB",
    updatedAt: "2026-05-28T08:15:00.000Z",
    kind: "guide",
  },
  {
    id: "content-plan-juli",
    title: "Content_Plan_Juli.xlsx",
    project: "Social Media",
    sizeLabel: "1.1 MB",
    updatedAt: "2026-07-01T07:45:00.000Z",
    kind: "sheet",
  },
  {
    id: "invoice-2026-001",
    title: "Invoice_INV-2026-001.pdf",
    project: "Billing",
    sizeLabel: "0.3 MB",
    updatedAt: "2026-06-01T11:00:00.000Z",
    kind: "invoice",
  },
  {
    id: "mou-kartika-mahreen",
    title: "MOU_Kartika_Mahreen.pdf",
    project: "Legal",
    sizeLabel: "1.8 MB",
    updatedAt: "2026-04-30T09:30:00.000Z",
    kind: "legal",
  },
];

const getStorageKey = (accountId: string) => {
  const safeAccountId = accountId.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${DOCUMENT_STORAGE_PREFIX}:${safeAccountId || "anonymous"}`;
};

const isClientDocument = (value: unknown): value is ClientDocumentRecord => {
  if (!value || typeof value !== "object") return false;
  const document = value as Partial<ClientDocumentRecord>;
  return (
    typeof document.id === "string" &&
    typeof document.title === "string" &&
    typeof document.project === "string" &&
    typeof document.sizeLabel === "string" &&
    typeof document.updatedAt === "string" &&
    typeof document.kind === "string"
  );
};

const cloneDocuments = (documents: ClientDocumentRecord[]) =>
  documents.map((document) => ({ ...document }));

const readDocuments = (accountId: string) => {
  const key = getStorageKey(accountId);
  const stored = readJson<unknown[]>("local", key, []).filter(isClientDocument);
  if (stored.length) return stored;

  const seeded = cloneDocuments(seedDocuments);
  writeJson("local", key, seeded);
  return seeded;
};

export const clientDocumentsRepository = {
  getSnapshot(accountId: string) {
    return cloneDocuments(readDocuments(accountId)).sort(
      (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
    );
  },

  reset(accountId: string) {
    const documents = cloneDocuments(seedDocuments);
    writeJson("local", getStorageKey(accountId), documents);
    return documents;
  },

  subscribe(listener: () => void) {
    return subscribeToPlatformData(listener);
  },
};

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const toPdfText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "?")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");

const toBlobPart = (bytes: Uint8Array) => {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
};

const createPdfBlob = (document: ClientDocumentRecord) => {
  const lines = [
    "MAHREEN LOCAL DOCUMENT PREVIEW",
    "",
    `Nama: ${document.title}`,
    `Proyek: ${document.project}`,
    `Ukuran tercatat: ${document.sizeLabel}`,
    `Diperbarui: ${document.updatedAt}`,
    "",
    "File sumber asli belum tersedia pada mode demo lokal.",
  ];
  const commands = lines
    .map((line, index) =>
      index === 0
        ? `(${toPdfText(line)}) Tj`
        : `0 -20 Td (${toPdfText(line)}) Tj`,
    )
    .join("\n");
  const stream = `BT\n/F1 12 Tf\n72 760 Td\n${commands}\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const crossReferenceOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${crossReferenceOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const createSpreadsheetBlob = (document: ClientDocumentRecord) => {
  const rows = [
    ["Field", "Value"],
    ["Nama Dokumen", document.title],
    ["Proyek", document.project],
    ["Ukuran Tercatat", document.sizeLabel],
    ["Diperbarui", document.updatedAt],
    ["Status", "Preview lokal - file sumber asli belum tersedia"],
  ];
  const sheetRows = rows
    .map(
      (row, rowIndex) =>
        `<row r="${rowIndex + 1}">${row
          .map(
            (cell, columnIndex) =>
              `<c r="${columnIndex === 0 ? "A" : "B"}${rowIndex + 1}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></c>`,
          )
          .join("")}</row>`,
    )
    .join("");

  const archive = createStoredZip({
    "[Content_Types].xml": encodeUtf8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    ),
    "_rels/.rels": encodeUtf8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    ),
    "xl/workbook.xml": encodeUtf8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Dokumen" sheetId="1" r:id="rId1"/></sheets></workbook>',
    ),
    "xl/_rels/workbook.xml.rels": encodeUtf8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    ),
    "xl/worksheets/sheet1.xml": encodeUtf8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`,
    ),
  });

  return new Blob([toBlobPart(archive)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

const createFigmaPreviewBlob = (document: ClientDocumentRecord) => {
  const archive = createStoredZip({
    "meta.json": encodeUtf8(
      JSON.stringify(
        {
          name: document.title,
          project: document.project,
          updatedAt: document.updatedAt,
          localPreview: true,
        },
        null,
        2,
      ),
    ),
    "README.txt": encodeUtf8(
      "Mahreen local preview package. File Figma sumber asli belum tersedia pada mode demo lokal.",
    ),
  });

  return new Blob([toBlobPart(archive)], { type: "application/octet-stream" });
};

const createFallbackBlob = (document: ClientDocumentRecord) =>
  new Blob(
    [
      [
        "MAHREEN LOCAL DOCUMENT PREVIEW",
        `Nama: ${document.title}`,
        `Proyek: ${document.project}`,
        `Diperbarui: ${document.updatedAt}`,
      ].join("\n"),
    ],
    { type: "application/octet-stream" },
  );

export const createLocalDocumentBlob = (document: ClientDocumentRecord) =>
  document.kind === "sheet"
    ? createSpreadsheetBlob(document)
    : document.kind === "figma"
      ? createFigmaPreviewBlob(document)
      : ["pdf", "guide", "invoice", "legal"].includes(document.kind)
        ? createPdfBlob(document)
        : createFallbackBlob(document);

export const createLocalDocumentDownload = (document: ClientDocumentRecord) => {
  const blob = createLocalDocumentBlob(document);
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = document.title;
  anchor.hidden = true;
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};
