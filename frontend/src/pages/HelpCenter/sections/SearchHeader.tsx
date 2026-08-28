import { useState, type FormEvent } from "react";

const popularArticles = [
  {
    title: "Masa Depan Transformasi Digital: Visi Mahreen 2025",
    href: "/newsroom/berita/masa-depan-transformasi-digital",
  },
  {
    title: "Membangun Pengalaman Brand yang Relevan",
    href: "/newsroom/berita/membangun-pengalaman-brand-yang-relevan",
  },
  {
    title: "AI for Business: Dari Ide menuju Implementasi",
    href: "/newsroom/berita/ai-for-business-dari-ide-ke-implementasi",
  },
] as const;

const searchTargets = [
  {
    id: "help-services",
    keywords: ["akun", "daftar", "internship", "layanan", "csr", "studio", "peduli", "newsroom"],
    label: "Layanan Utama",
  },
  {
    id: "help-articles",
    keywords: ["status", "artikel", "login", "booking", "konsultasi", "verifikasi"],
    label: "Artikel dan Status",
  },
  {
    id: "help-categories",
    keywords: ["video", "panduan", "payment", "pembayaran", "technical", "teknis", "getting started"],
    label: "Kategori dan Video Panduan",
  },
  {
    id: "help-downloads",
    keywords: ["download", "company profile", "guidebook", "template", "faq", "revisi", "invoice"],
    label: "FAQ dan Download Center",
  },
  {
    id: "help-contact",
    keywords: ["error", "masalah", "lapor", "support", "whatsapp", "email", "bantuan"],
    label: "Hubungi dan Laporkan Masalah",
  },
] as const;

const findTarget = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  return (
    searchTargets.find((target) =>
      target.keywords.some(
        (keyword) => normalized.includes(keyword) || keyword.includes(normalized),
      ),
    ) ?? searchTargets[1]
  );
};

const SearchHeader = () => {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const runSearch = (value: string) => {
    const target = findTarget(value);

    if (!target) {
      setMessage("Masukkan kata kunci untuk mencari panduan.");
      return;
    }

    document.getElementById(target.id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMessage(`Hasil yang paling relevan: ${target.label}.`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(query);
  };

  return (
    <section className="hc-hero" aria-labelledby="help-center-title">
      <h1 className="text-gold" id="help-center-title">Mahreen Help Center</h1>
      <p className="text-muted">Temukan jawaban, panduan, dokumentasi, serta bantuan resmi Mahreen Indonesia dalam satu tempat.</p>

      <form className="hc-search-box" role="search" onSubmit={handleSubmit}>
        <svg className="hc-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          placeholder="Apa yang ingin Anda cari?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Cari bantuan"
        />
      </form>

      <div className="hc-popular-tags" aria-label="Artikel populer Newsroom">
        Populer:
        {popularArticles.map((article, index) => (
          <span className="hc-popular-item" key={article.href}>
            {index > 0 ? <i aria-hidden="true">•</i> : null}
            <a href={article.href}>{article.title}</a>
          </span>
        ))}
      </div>
      <p className="hc-search-result" role="status" aria-live="polite">{message}</p>
    </section>
  );
};

export default SearchHeader;
