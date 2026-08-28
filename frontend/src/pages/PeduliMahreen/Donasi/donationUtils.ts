import type { DonationDraft, DonationPaymentMethodId } from "./donationTypes";

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDonationDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export const getPaymentMethodLabel = (method: DonationPaymentMethodId | null) => {
  switch (method) {
    case "qris":
      return "QRIS";
    case "shopeepay":
      return "ShopeePay";
    case "bca-va":
      return "BCA Virtual Account";
    case "mandiri-va":
      return "Mandiri Virtual Account";
    default:
      return "Belum dipilih";
  }
};

const escapePdfText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

export const downloadDonationCertificatePdf = (draft: DonationDraft) => {
  const donorName = draft.donor.anonymous
    ? "Donatur Anonim"
    : draft.donor.fullName || "Sahabat Peduli Mahreen";

  const lines = [
    "E-CERTIFICATE - BUKTI KEBAIKAN",
    "",
    `Nama Donatur: ${donorName}`,
    `Tanggal: ${formatDonationDate(draft.updatedAt)}`,
    `ID Transaksi: ${draft.transactionId}`,
    `Nominal: ${formatRupiah(draft.amount)}`,
    `Metode: ${getPaymentMethodLabel(draft.paymentMethod)}`,
    "Status: Berhasil",
    "",
    "Terima kasih telah menjadi bagian dari Kelas Inspirasi:",
    "Menyemai Mimpi bersama Peduli Mahreen.",
  ];

  const streamLines = lines.map((line, index) => {
    const fontSize = index === 0 ? 18 : 11;
    const y = index === 0 ? 770 : 730 - (index - 1) * 24;
    return `BT /F1 ${fontSize} Tf 58 ${y} Td (${escapePdfText(line)}) Tj ET`;
  });

  const stream = streamLines.join("\n");
  const encoder = new TextEncoder();
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += object;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Bukti-Kebaikan-${draft.transactionId.replace(/[^a-z0-9]/gi, "-")}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
