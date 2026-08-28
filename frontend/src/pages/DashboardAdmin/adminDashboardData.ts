import type {
  AdminModuleKey,
  AdminModuleMeta,
  AdminQuickAction,
} from "./types";

export const adminModules: readonly AdminModuleMeta[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    eyebrow: "Command Center",
    description: "Ringkasan performa, aktivitas, dan kesehatan seluruh ekosistem Mahreen.",
  },
  {
    key: "transactions",
    label: "Transactions",
    eyebrow: "Finance Operations",
    description: "Kelola invoice, pembayaran, dan transaksi layanan dalam satu tempat.",
  },
  {
    key: "users",
    label: "Users",
    eyebrow: "Account Management",
    description: "Pantau akun client, perusahaan, komunitas, dan hak akses pengguna.",
  },
  {
    key: "newsroom",
    label: "Newsroom",
    eyebrow: "Editorial Intelligence",
    description: "Pantau artikel, event, topik, author, dan kecepatan publikasi Newsroom.",
  },
  {
    key: "tanya-mahreen",
    label: "Tanya Mahreen",
    eyebrow: "Service Management",
    description: "Kelola layanan konsultasi, lead, paket, dan progres pekerjaan client.",
  },
  {
    key: "peduli-mahreen",
    label: "Peduli Mahreen",
    eyebrow: "Social Impact",
    description: "Pantau donasi, penerima manfaat, serta distribusi program sosial.",
  },
  {
    key: "mahreen-csr",
    label: "Mahreen CSR",
    eyebrow: "Partnership Program",
    description: "Kelola proposal, mitra perusahaan, dan program kolaborasi CSR.",
  },
  {
    key: "mahreen-studio",
    label: "Mahreen Studio",
    eyebrow: "Lifestyle Brand",
    description: "Kelola katalog, koleksi, pesanan, stok, dan performa produk Mahreen Studio.",
  },
  {
    key: "internship",
    label: "Mahreen Indonesia Internship",
    eyebrow: "Talent Program",
    description: "Pantau pendaftar, peserta aktif, batch, dan jadwal program internship.",
  },
  {
    key: "verification",
    label: "Verification",
    eyebrow: "Document Security",
    description: "Validasi sertifikat dan dokumen digital dengan kode verifikasi atau QR.",
  },
  {
    key: "analytics",
    label: "Analytics",
    eyebrow: "Business Intelligence",
    description: "Analisis pertumbuhan, konversi, distribusi pendapatan, dan dampak program.",
  },
  {
    key: "portfolio",
    label: "Tambah Portfolio",
    eyebrow: "Portfolio Management",
    description: "Tambahkan karya, dampak, teknologi, dan media showcase ke portfolio Mahreen.",
  },
  {
    key: "settings",
    label: "Settings",
    eyebrow: "System Configuration",
    description: "Atur role, notifikasi, kebijakan akses, dan konfigurasi platform.",
  },
  {
    key: "reports",
    label: "Reports",
    eyebrow: "System Reports",
    description: "Laporan gabungan audit log, aktivitas sistem, dan event analitik (superadmin).",
  },
  {
    key: "clients",
    label: "Clients",
    eyebrow: "Client Directory",
    description: "Pantau klien, total pesanan, pengeluaran, donasi, dan sertifikat.",
  },
  {
    key: "engagement",
    label: "Inbox",
    eyebrow: "Contact & Support",
    description: "Kelola pesan kontak dan tiket bantuan dari pengunjung.",
  },
];

export const adminSidebarModuleKeys: readonly AdminModuleKey[] = [
  "dashboard",
  "newsroom",
  "users",
  "tanya-mahreen",
  "peduli-mahreen",
  "mahreen-csr",
  "mahreen-studio",
  "internship",
  "verification",
  "analytics",
  "clients",
  "engagement",
  "reports",
  "settings",
];

export const quickActions: readonly AdminQuickAction[] = [
  { label: "Tambah Artikel", module: "newsroom", icon: "article" },
  { label: "Tambah Pengguna", module: "users", icon: "user" },
  { label: "Tambah Produk", module: "tanya-mahreen", icon: "product" },
  { label: "Tambah Portfolio", module: "portfolio", icon: "portfolio" },
  { label: "Tambah Proyek", module: "tanya-mahreen", icon: "project" },
  { label: "Cetak Sertifikat", module: "verification", icon: "certificate" },
  { label: "Generate QR", module: "verification", icon: "qr" },
];
