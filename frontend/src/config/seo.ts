import { env } from "./env";

export type SeoMetadata = Readonly<{
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  image?: string;
  ogType?: "website" | "article" | "product";
  structuredData?: Record<string, unknown>;
}>;

const brandName = "Mahreen Indonesia";
const defaultDescription =
  "Mahreen Indonesia adalah platform ekosistem kreatif, digital, sosial, pembelajaran, portofolio, dan kemitraan untuk individu, bisnis, serta komunitas.";
const privateNoIndex = "noindex, nofollow, noarchive";
const draftNoIndex = "noindex, follow, noarchive";

const exactMetadata: Readonly<Record<string, SeoMetadata>> = {
  "/": {
    title: `${brandName} | Ekosistem Kreatif, Digital, Bisnis, dan Sosial`,
    description: defaultDescription,
  },
  "/tentang": {
    title: `Tentang Kami | ${brandName}`,
    description:
      "Pelajari sejarah, visi, misi, pendiri, dan legalitas Mahreen Indonesia sebagai platform ekosistem kreatif, digital, dan sosial.",
  },
  "/portofolio": {
    title: `Portofolio Proyek Kreatif dan Digital | ${brandName}`,
    description:
      "Jelajahi portofolio proyek pilihan Mahreen Indonesia dalam branding, teknologi digital, desain, pengembangan bisnis, dan kolaborasi.",
  },
  "/newsroom": {
    title: `Newsroom | ${brandName}`,
    description:
      "Baca berita, artikel, insight, webinar, dan agenda terbaru dari ekosistem Mahreen Indonesia.",
  },
  "/newsroom/berita": {
    title: `Berita dan Insight | ${brandName}`,
    description:
      "Temukan berita dan insight terbaru tentang transformasi digital, kreativitas, bisnis, dan dampak sosial Mahreen Indonesia.",
  },
  "/newsroom/events": {
    title: `Event dan Agenda | ${brandName}`,
    description: "Temukan event, webinar, dan agenda pembelajaran terbaru dari Mahreen Indonesia.",
  },
  "/newsroom/tags": {
    title: `Topik Newsroom | ${brandName}`,
    description: "Telusuri artikel Mahreen Indonesia berdasarkan topik dan kategori pilihan.",
  },
  "/newsroom/verifikasi-dokumen": {
    title: `Verifikasi Dokumen | ${brandName}`,
    description:
      "Tinjau status, metadata, QR, dan pratinjau dokumen resmi melalui Mahreen Verification Center.",
  },
  "/mahreen-studio": {
    title: `Mahreen Studio | Lifestyle and Creative Brand`,
    description:
      "Temukan koleksi, produk, dan pengalaman kreatif premium dari Mahreen Studio.",
  },
  "/mahreen-studio/latest-collection": {
    title: `Koleksi Terbaru | Mahreen Studio`,
    description: "Lihat koleksi terbaru dan produk pilihan dari Mahreen Studio.",
  },
  "/tanya-mahreen": {
    title: `Tanya Mahreen | Solusi Bisnis dan Konsultasi`,
    description:
      "Dapatkan solusi konsultasi bisnis, branding, website, pemasaran digital, dan pengembangan kreatif bersama Tanya Mahreen.",
  },
  "/tanya-mahreen/konsultasi": {
    title: `Konsultasi Gratis | Tanya Mahreen`,
    description: "Sampaikan kebutuhan bisnis dan proyek Anda kepada tim Tanya Mahreen.",
    robots: privateNoIndex,
  },
  "/tanya-mahreen/konsultasi/cek-data": {
    title: `Periksa Data Konsultasi | Tanya Mahreen`,
    description: "Periksa kembali ringkasan kebutuhan konsultasi sebelum dikirim.",
    robots: privateNoIndex,
  },
  "/tanya-mahreen/konsultasi/selesai": {
    title: `Permintaan Konsultasi Dikirim | Tanya Mahreen`,
    description: "Konfirmasi pengiriman permintaan konsultasi Tanya Mahreen.",
    robots: privateNoIndex,
  },
  "/tanya-mahreen/konsultasi/hubungi-pm": {
    title: `Hubungi Project Manager | Tanya Mahreen`,
    description: "Hubungi project manager setelah permintaan konsultasi dikirim.",
    robots: privateNoIndex,
  },
  "/akun/edit": {
    title: `Edit Profil | ${brandName}`,
    description: "Perbarui informasi profil dan foto akun Mahreen Indonesia.",
    robots: privateNoIndex,
  },
  "/client-portal": {
    title: `Client Portal | ${brandName}`,
    description: "Pantau proyek, invoice, jadwal, dan aktivitas akun Mahreen Indonesia.",
    robots: privateNoIndex,
  },
  "/mahreen-csr": {
    title: `Mahreen CSR | Partnership and Social Impact`,
    description:
      "Bangun program CSR, kemitraan, dan dampak sosial berkelanjutan bersama Mahreen CSR.",
  },
  "/mahreen-csr/program-objective": {
    title: `Program Objective Mahreen CSR | ${brandName}`,
    description:
      "Pelajari sasaran program, pilar dampak, proses kolaborasi, dan hasil yang dituju dalam inisiatif Mahreen CSR.",
  },
  "/internship": {
    title: `Mahreen Internship | Program Magang dan Proyek Nyata`,
    description:
      "Pelajari program magang Mahreen Indonesia, jalur pembelajaran, proyek nyata, mentor, dan proses pendaftarannya.",
  },
  "/peduli-mahreen": {
    title: `Peduli Mahreen | Social Movement`,
    description:
      "Kenali program sosial, relawan, donasi, dan gerakan kolaboratif Peduli Mahreen.",
  },
  "/help-center": {
    title: `Help Center | ${brandName}`,
    description:
      "Temukan panduan, pertanyaan umum, bantuan teknis, dan kanal dukungan resmi Mahreen Indonesia.",
  },
  "/contact": {
    title: `Hubungi Kami | ${brandName}`,
    description:
      "Hubungi Mahreen Indonesia untuk konsultasi, kolaborasi, kemitraan, layanan, dan dukungan platform.",
  },
  "/kebijakan-privasi": {
    title: `Kebijakan Privasi | ${brandName}`,
    description:
      "Baca kebijakan Mahreen Indonesia mengenai pengumpulan, penggunaan, keamanan, dan hak pengguna atas data pribadi.",
  },
  "/syarat-ketentuan": {
    title: `Syarat dan Ketentuan | ${brandName}`,
    description:
      "Baca syarat dan ketentuan penggunaan layanan serta platform digital Mahreen Indonesia.",
  },
};

const prefixMetadata: readonly [string, SeoMetadata][] = [
  [
    "/tanya-mahreen/paket/",
    {
      title: `Paket Layanan | Tanya Mahreen`,
      description: "Pilih dan konfigurasi paket layanan bisnis, website, branding, konten, atau pemasaran digital bersama Tanya Mahreen.",
    },
  ],
  [
    "/newsroom/berita/",
    {
      title: `Artikel Newsroom | ${brandName}`,
      description: "Baca artikel dan insight pilihan dari Newsroom Mahreen Indonesia.",
      ogType: "article",
    },
  ],
  [
    "/newsroom/webinar/",
    {
      title: `Webinar | ${brandName}`,
      description: "Lihat informasi dan agenda webinar Mahreen Indonesia.",
    },
  ],
  [
    "/newsroom/events/",
    {
      title: `Detail Event | ${brandName}`,
      description: "Lihat detail, deskripsi lengkap, dan informasi pendaftaran event Mahreen Indonesia.",
    },
  ],
  [
    "/mahreen-studio/product/",
    {
      title: `Produk Mahreen Studio | ${brandName}`,
      description: "Lihat detail produk, pilihan varian, dan informasi koleksi Mahreen Studio.",
      ogType: "product",
    },
  ],
  [
    "/portofolio/",
    {
      title: `Studi Kasus Portofolio | ${brandName}`,
      description: "Pelajari proses dan hasil proyek pilihan Mahreen Indonesia.",
    },
  ],
];

const draftContentPrefixes = [
  "/newsroom/berita/",
  "/newsroom/webinar/",
  "/newsroom/events/",
  "/mahreen-studio/product/",
  "/portofolio/",
] as const;

const privatePrefixes = [
  "/akun",
  "/client-portal",
  "/admin",
  "/internship/dashboard",
  "/internship/login",
  "/login",
  "/daftar",
  "/lupa-sandi",
  "/lupa-password",
  "/forgot-password",
  "/atur-ulang",
  "/reset-password",
  "/peduli-mahreen/donasi",
  "/tanya-mahreen/pembayaran",
  "/tanya-mahreen/konsultasi",
  "/mahreen-studio/order-summary",
  "/mahreen-studio/checkout",
  "/mahreen-studio/payment",
  "/mahreen-studio/review",
  "/mahreen-studio/lacak-pesanan",
  "/mahreen-studio/tracking",
  "/mahreen-csr/pendaftaran",
  "/internship/form",
] as const;

const aliases: Readonly<Record<string, string>> = {
  "/kontak": "/contact",
  "/hubungi-kami": "/contact",
  "/pusat-bantuan": "/help-center",
  "/portfolio": "/portofolio",
  "/about": "/tentang",
  "/register": "/daftar",
  "/akun": "/client-portal",
  "/dashboard": "/client-portal",
  "/program-objective": "/mahreen-csr/program-objective",
  "/tanya-mahreen/paket": "/tanya-mahreen/paket/website",
  "/mahreen-studio/checkout": "/mahreen-studio/order-summary",
  "/mahreen-studio/checkout/payment": "/mahreen-studio/payment",
  "/mahreen-studio/checkout/review": "/mahreen-studio/review",
  "/mahreen-studio/tracking": "/mahreen-studio/lacak-pesanan",
  "/services": "/tanya-mahreen",
  "/learn": "/newsroom",
  "/newsroom/event": "/newsroom/events",
  "/newsroom/topics": "/newsroom/tags",
  "/newsroom/verifikasi": "/newsroom/verifikasi-dokumen",
};

export const getSeoMetadata = (path: string): SeoMetadata => {
  const canonicalPath = aliases[path] ?? path;
  const unavailablePage =
    (!env.enableDocumentVerification &&
      canonicalPath === "/newsroom/verifikasi-dokumen") ||
    (!env.enableTransactionUi &&
      (canonicalPath.startsWith("/tanya-mahreen/pembayaran") ||
        canonicalPath.startsWith("/peduli-mahreen/donasi") ||
        /^\/newsroom\/webinar\/[^/]+\/(?:pembayaran|sukses)(?:\/|$)/.test(canonicalPath)));
  const privatePage = privatePrefixes.some(
    (prefix) => canonicalPath === prefix || canonicalPath.startsWith(`${prefix}/`),
  ) || /^\/newsroom\/webinar\/[^/]+\/(?:daftar|pembayaran|sukses)(?:\/|$)/.test(canonicalPath) ||
    unavailablePage;
  const draftContentPage =
    !env.enableDynamicContentIndexing &&
    draftContentPrefixes.some((prefix) => canonicalPath.startsWith(prefix));
  const exactMatch = exactMetadata[canonicalPath];

  if (exactMatch) {
    return {
      ...exactMatch,
      canonicalPath,
      robots: privatePage
        ? privateNoIndex
        : draftContentPage
          ? draftNoIndex
          : exactMatch.robots,
    };
  }

  const prefixMatch = prefixMetadata.find(([prefix]) => canonicalPath.startsWith(prefix));

  if (prefixMatch) {
    return {
      ...prefixMatch[1],
      canonicalPath,
      robots: privatePage
        ? privateNoIndex
        : draftContentPage
          ? draftNoIndex
          : prefixMatch[1].robots,
    };
  }

  return {
    title: privatePage ? `Akun dan Transaksi | ${brandName}` : `Halaman Tidak Ditemukan | ${brandName}`,
    description: privatePage
      ? "Halaman akun, formulir, atau transaksi Mahreen Indonesia."
      : "Alamat halaman tidak ditemukan atau belum tersedia pada platform Mahreen Indonesia.",
    canonicalPath,
    robots: privateNoIndex,
  };
};
