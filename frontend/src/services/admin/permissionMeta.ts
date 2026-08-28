export type PermissionMeta = {
  key: string;
  label: string;
  description: string;
};

export type PermissionGroupMeta = {
  key: string;
  label: string;
  icon: string;
  permissions: PermissionMeta[];
};

const perm = (key: string, label: string, description: string): PermissionMeta => ({
  key,
  label,
  description,
});

export const ALL_PERMISSION_META: ReadonlyArray<PermissionMeta> = [
  // Users
  perm("users.create", "Buat Pengguna", "Membuat akun pengguna baru"),
  perm("users.read", "Lihat Pengguna", "Melihat daftar dan detail pengguna"),
  perm("users.update", "Ubah Pengguna", "Memperbarui data pengguna"),
  perm("users.delete", "Hapus Pengguna", "Menghapus akun pengguna"),
  perm("users.manage_status", "Kelola Status", "Mengaktifkan/menonaktifkan akun"),
  perm("users.manage_role", "Kelola Peran", "Mengatur role dan permission (superadmin)"),

  // Newsroom: Articles
  perm("articles.create", "Buat Artikel", "Menulis artikel berita"),
  perm("articles.read", "Lihat Artikel", "Melihat artikel"),
  perm("articles.update", "Ubah Artikel", "Mengedit artikel"),
  perm("articles.delete", "Hapus Artikel", "Menghapus artikel"),
  perm("articles.manage_status", "Kelola Status Artikel", "Publikasi, jadwal, dan review artikel"),

  // Newsroom: Topics
  perm("topics.manage", "Kelola Topik", "Mengelola topik dan tag berita"),

  // Newsroom: Webinars
  perm("webinars.manage", "Kelola Webinar", "Mengelola webinar dan pendaftar"),

  // Newsroom: Events
  perm("events.manage", "Kelola Event", "Mengelola event dan registrasi"),

  // Tanya Mahreen: Consultations
  perm("consultations.manage", "Kelola Konsultasi", "Mengelola permintaan konsultasi"),
  perm("orders.manage", "Kelola Pesanan", "Mengelola pesanan layanan"),
  perm("transactions.manage", "Kelola Transaksi", "Mengelola transaksi dan pembayaran"),
  perm("packages.manage", "Kelola Paket", "Mengelola paket layanan"),

  // Peduli Mahreen: Campaigns
  perm("campaigns.create", "Buat Kampanye", "Membuat kampanye sosial"),
  perm("campaigns.read", "Lihat Kampanye", "Melihat kampanye"),
  perm("campaigns.update", "Ubah Kampanye", "Mengedit kampanye"),
  perm("campaigns.delete", "Hapus Kampanye", "Menghapus kampanye"),
  perm("campaigns.disburse", "Pencairan Dana", "Mencairkan dana kampanye"),
  perm("donations.manage", "Kelola Donasi", "Mengelola donasi dan donatur"),

  // CSR
  perm("csr_programs.manage", "Kelola Program CSR", "Mengelola program CSR"),
  perm("csr_pillars.manage", "Kelola Pilar CSR", "Mengelola pilar program CSR"),
  perm("csr_applications.manage", "Kelola Pendaftaran CSR", "Mengelola pendaftaran volunteer/mitra"),

  // Studio
  perm("products.manage", "Kelola Produk", "Mengelola produk Mahreen Studio"),
  perm("portfolios.manage", "Kelola Portfolio", "Mengelola karya dan portfolio"),
  perm("collections.manage", "Kelola Koleksi", "Mengelola koleksi produk"),
  perm("specializations.manage", "Kelola Spesialisasi", "Mengelola spesialisasi layanan"),

  // Internship
  perm("batches.manage", "Kelola Batch", "Mengelola batch magang"),
  perm("intern_applications.manage", "Kelola Pendaftar", "Mengelola pendaftar magang"),

  // Verification
  perm("certificates.manage", "Kelola Sertifikat", "Mengelola sertifikat"),
  perm("certificates.issue", "Terbitkan Sertifikat", "Menerbitkan sertifikat baru"),
  perm("certificates.revoke", "Cabut Sertifikat", "Mencabut sertifikat yang terbit"),
  perm("verification_logs.read", "Lihat Log Verifikasi", "Melihat riwayat verifikasi"),

  // Analytics & Overview
  perm("view_analytics", "Lihat Analitik", "Mengakses laporan analitik"),
  perm("view_overview", "Lihat Overview", "Mengakses dashboard utama"),
  perm("view_audit_logs", "Lihat Audit Log", "Melihat log aktivitas admin"),

  // System Reports
  perm("system_reports.read", "Laporan Sistem", "Mengakses laporan sistem (superadmin)"),
];

export const PERMISSION_META_MAP: Readonly<Record<string, PermissionMeta>> = Object.fromEntries(
  ALL_PERMISSION_META.map((item) => [item.key, item]),
);

export const PERMISSION_GROUPS: ReadonlyArray<PermissionGroupMeta> = [
  { key: "users", label: "Pengguna & Akses", icon: "user", permissions: [] },
  { key: "articles", label: "Newsroom · Artikel", icon: "article", permissions: [] },
  { key: "topics", label: "Newsroom · Topik", icon: "tag", permissions: [] },
  { key: "webinars", label: "Newsroom · Webinar", icon: "video", permissions: [] },
  { key: "events", label: "Newsroom · Event", icon: "calendar", permissions: [] },
  { key: "consultations", label: "Tanya Mahreen · Konsultasi", icon: "message", permissions: [] },
  { key: "orders", label: "Tanya Mahreen · Pesanan", icon: "order", permissions: [] },
  { key: "transactions", label: "Tanya Mahreen · Transaksi", icon: "receipt", permissions: [] },
  { key: "packages", label: "Tanya Mahreen · Paket", icon: "package", permissions: [] },
  { key: "campaigns", label: "Peduli Mahreen · Kampanye", icon: "campaign", permissions: [] },
  { key: "donations", label: "Peduli Mahreen · Donasi", icon: "donation", permissions: [] },
  { key: "csr", label: "Mahreen CSR", icon: "csr", permissions: [] },
  { key: "products", label: "Mahreen Studio · Produk", icon: "product", permissions: [] },
  { key: "portfolios", label: "Studio · Portfolio", icon: "portfolio", permissions: [] },
  { key: "collections", label: "Studio · Koleksi", icon: "collection", permissions: [] },
  { key: "specializations", label: "Studio · Spesialisasi", icon: "specialization", permissions: [] },
  { key: "batches", label: "Internship · Batch", icon: "batch", permissions: [] },
  { key: "intern", label: "Internship · Pendaftar", icon: "intern", permissions: [] },
  { key: "certificates", label: "Verifikasi · Sertifikat", icon: "certificate", permissions: [] },
  { key: "verification", label: "Verifikasi · Log", icon: "verify", permissions: [] },
  { key: "view", label: "Analitik & Overview", icon: "analytics", permissions: [] },
  { key: "system", label: "Sistem", icon: "system", permissions: [] },
];

const GROUP_ORDER: ReadonlyArray<string> = PERMISSION_GROUPS.map((group) => group.key);

const normalizeArea = (key: string): string => {
  const area = key.split(".")[0];
  if (area === "csr_programs" || area === "csr_pillars" || area === "csr_applications") return "csr";
  if (area === "verification_logs") return "verification";
  if (area === "intern_applications") return "intern";
  if (area === "system_reports") return "system";
  if (area === "view_analytics" || area === "view_overview" || area === "view_audit_logs") return "view";
  return area;
};

/**
 * Mengelompokkan daftar permission menjadi grup yang diurutkan sesuai
 * struktur modul platform, dengan label dan ikon Indonesia.
 */
export const buildPermissionGroups = (
  permissions: ReadonlyArray<string>,
): ReadonlyArray<PermissionGroupMeta> => {
  const groups = new Map<string, PermissionMeta[]>();
  for (const key of permissions) {
    const area = normalizeArea(key);
    if (!groups.has(area)) groups.set(area, []);
    groups.get(area)!.push(PERMISSION_META_MAP[key] ?? perm(key, key, ""));
  }

  const ordered = new Set([...GROUP_ORDER, ...groups.keys()]);
  const result: PermissionGroupMeta[] = [];
  for (const area of ordered) {
    const items = groups.get(area);
    if (!items) continue;
    const meta = PERMISSION_GROUPS.find((group) => group.key === area);
    result.push({
      key: area,
      label: meta?.label ?? area,
      icon: meta?.icon ?? "key",
      permissions: items,
    });
  }
  return result;
};
