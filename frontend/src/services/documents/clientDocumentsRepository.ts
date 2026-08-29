import { clientDocumentsRepository } from "./apiClientDocumentsRepository";

export const createLocalDocumentBlob = (document: { kind: string; title: string; project: string; updatedAt: string }) => {
  const lines = [
    "MAHREEN DOCUMENT",
    "",
    `Nama: ${document.title}`,
    `Proyek: ${document.project}`,
    `Diperbarui: ${document.updatedAt}`,
  ];

  const toPdfText = (value: string) =>
    value.normalize("NFKD").replace(/[^\x20-\x7E]/g, "?");

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

export const createLocalDocumentDownload = (document: { title: string; kind: string; project: string; updatedAt: string }) => {
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

export { clientDocumentsRepository };
