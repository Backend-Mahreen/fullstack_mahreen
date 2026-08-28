import { BadgeCheck, FileSearch, FileText, Keyboard, QrCode, ScanLine, ShieldCheck } from "lucide-react";

export const verificationStats = [
  { value: "1000+", label: "Verified Documents" },
  { value: "500+", label: "Certificates Issued" },
  { value: "200+", label: "Active Projects" },
  { value: "100%", label: "Digital Integrity" },
] as const;

export const verificationSteps = [
  { title: "Dapatkan Dokumen", description: "Siapkan dokumen fisik atau digital Mahreen.", icon: FileText },
  { title: "Cari Nomor/QR", description: "Temukan kode unik di bagian bawah dokumen.", icon: FileSearch },
  { title: "Input Data", description: "Ketik nomor dokumen atau arahkan kamera ke QR.", icon: Keyboard },
  { title: "Processing", description: "Sistem mencocokkan data dengan database terenkripsi.", icon: ScanLine },
  { title: "Validasi Hasil", description: "Periksa detail dokumen yang muncul di layar.", icon: BadgeCheck },
  { title: "Selesai", description: "Unduh sertifikat verifikasi jika diperlukan.", icon: ShieldCheck },
] as const;

export const verificationFaqs = [
  { question: "Apakah data verifikasi ini bersifat publik?", answer: "Hanya metadata yang diperlukan untuk memastikan keaslian dokumen yang ditampilkan. Informasi sensitif dan berkas internal tetap dilindungi." },
  { question: "Bagaimana jika nomor dokumen tidak ditemukan?", answer: "Pastikan nomor ditulis lengkap tanpa mengubah tanda garis miring. Bila tetap tidak ditemukan, hubungi tim Mahreen untuk pemeriksaan manual." },
  { question: "Apakah QR Code memiliki masa kadaluarsa?", answer: "QR resmi mengikuti masa berlaku dokumen. Sistem akan menampilkan status kedaluwarsa bila masa validitas dokumen telah berakhir." },
] as const;

export const sampleDocument = {
  id: "044/WBR/FND/MRN/VII/2026",
  date: "14 July 2026, 14:32 WIB",
  type: "Weekly Business Report (WBR)",
  department: "Finance & Global Operations",
  title: "Q2 Fiscal Year 2026 Strategic Expansion Report",
  authorized: "Mahreen Indonesia Executive Board",
  system: "Sistem MVC v4.2",
  signature: "Validated by CloudHSM",
} as const;


export const verificationMetadata = [
  { key: "Document ID", value: sampleDocument.id, gold: true },
  { key: "Document Type", value: sampleDocument.type, gold: false },
  { key: "Issued By", value: sampleDocument.department, gold: false },
  { key: "Authorized PIC", value: sampleDocument.authorized, gold: false },
  { key: "Verification System", value: sampleDocument.system, gold: true },
] as const;

export const qrPattern = Array.from({ length: 225 }, (_, index) => {
  const row = Math.floor(index / 15);
  const column = index % 15;
  const finder = (row < 5 && column < 5) || (row < 5 && column > 9) || (row > 9 && column < 5);
  return finder || ((row * 7 + column * 11 + row * column) % 5 < 2);
});

export const scannerDemoValue = sampleDocument.id;
export const verificationHeroIcon = QrCode;
