import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./site-origin.mjs";

const siteUrl = getSiteUrl();
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const outputDirectory = join(__dirname, "..", "dist", "seo");

const routes = [
  ["/tentang", "Tentang Kami | Mahreen Indonesia", "Pelajari sejarah, visi, misi, pendiri, dan legalitas Mahreen Indonesia sebagai platform ekosistem kreatif, digital, dan sosial."],
  ["/portofolio", "Portofolio Proyek Kreatif dan Digital | Mahreen Indonesia", "Jelajahi portofolio proyek pilihan Mahreen Indonesia dalam branding, teknologi digital, desain, pengembangan bisnis, dan kolaborasi."],
  ["/newsroom", "Newsroom | Mahreen Indonesia", "Baca berita, artikel, insight, webinar, dan agenda terbaru dari ekosistem Mahreen Indonesia."],
  ["/newsroom/berita", "Berita dan Insight | Mahreen Indonesia", "Temukan berita dan insight terbaru tentang transformasi digital, kreativitas, bisnis, dan dampak sosial Mahreen Indonesia."],
  ["/newsroom/events", "Event dan Agenda | Mahreen Indonesia", "Temukan event, webinar, dan agenda pembelajaran terbaru dari Mahreen Indonesia."],
  ["/newsroom/tags", "Topik Newsroom | Mahreen Indonesia", "Telusuri artikel Mahreen Indonesia berdasarkan topik dan kategori pilihan."],
  ["/mahreen-studio", "Mahreen Studio | Lifestyle and Creative Brand", "Temukan koleksi, produk, dan pengalaman kreatif premium dari Mahreen Studio."],
  ["/mahreen-studio/latest-collection", "Koleksi Terbaru | Mahreen Studio", "Lihat koleksi terbaru dan produk pilihan dari Mahreen Studio."],
  ["/tanya-mahreen", "Tanya Mahreen | Solusi Bisnis dan Konsultasi", "Dapatkan solusi konsultasi bisnis, branding, website, pemasaran digital, dan pengembangan kreatif bersama Tanya Mahreen."],
  ["/mahreen-csr", "Mahreen CSR | Partnership and Social Impact", "Bangun program CSR, kemitraan, dan dampak sosial berkelanjutan bersama Mahreen CSR."],
  ["/mahreen-csr/program-objective", "Program Objective Mahreen CSR | Mahreen Indonesia", "Pelajari sasaran program, pilar dampak, proses kolaborasi, dan hasil yang dituju dalam inisiatif Mahreen CSR."],
  ["/internship", "Mahreen Internship | Program Magang dan Proyek Nyata", "Pelajari program magang Mahreen Indonesia, jalur pembelajaran, proyek nyata, mentor, dan proses pendaftarannya."],
  ["/peduli-mahreen", "Peduli Mahreen | Social Movement", "Kenali program sosial, relawan, donasi, dan gerakan kolaboratif Peduli Mahreen."],
  ["/contact", "Hubungi Kami | Mahreen Indonesia", "Hubungi Mahreen Indonesia untuk konsultasi, kolaborasi, kemitraan, layanan, dan dukungan platform."],
  ["/help-center", "Help Center | Mahreen Indonesia", "Temukan panduan, pertanyaan umum, bantuan teknis, dan kanal dukungan resmi Mahreen Indonesia."],
  ["/kebijakan-privasi", "Kebijakan Privasi | Mahreen Indonesia", "Baca kebijakan Mahreen Indonesia mengenai pengumpulan, penggunaan, keamanan, dan hak pengguna atas data pribadi."],
  ["/syarat-ketentuan", "Syarat dan Ketentuan | Mahreen Indonesia", "Baca syarat dan ketentuan penggunaan layanan serta platform digital Mahreen Indonesia."],
];

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceMeta = (html, selector, content) => {
  const expression = new RegExp(
    `<meta\\s+${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+content="[^"]*"\\s*\\/?>`,
    "i",
  );
  return html.replace(expression, `<meta ${selector} content="${escapeHtml(content)}" />`);
};

const createSnapshot = (template, route, title, description) => {
  const canonicalUrl = `${siteUrl}${route}`;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: "id-ID",
    isPartOf: {
      "@type": "WebSite",
      name: "Mahreen Indonesia",
      url: siteUrl,
    },
  }).replaceAll("<", "\\u003c");

  let html = template.replace(
    /\s*<link\s+data-home-preload="hero"[\s\S]*?\/>/gi,
    "",
  );
  html = html.replace(
    /\s*<script\s+type="application\/ld\+json"\s+data-route-seo>[\s\S]*?<\/script>/gi,
    "",
  );
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name="description"', description);
  html = replaceMeta(html, 'property="og:title"', title);
  html = replaceMeta(html, 'property="og:description"', description);
  html = replaceMeta(html, 'property="og:url"', canonicalUrl);
  html = replaceMeta(html, 'name="twitter:title"', title);
  html = replaceMeta(html, 'name="twitter:description"', description);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );
  html = html.replace(
    "</head>",
    `    <script type="application/ld+json" data-route-seo>${structuredData}</script>\n  </head>`,
  );
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></main></noscript>`,
  );
  return html;
};

await mkdir(outputDirectory, { recursive: true });
const template = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

for (const [route, title, description] of routes) {
  const filename = `${route.slice(1).replaceAll("/", "--")}.html`;
  const snapshot = createSnapshot(template, route, title, description);
  await writeFile(join(outputDirectory, filename), snapshot, "utf8");
}

console.log(`Generated ${routes.length} route-specific SEO documents.`);
