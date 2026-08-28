import { useEffect, useMemo, useState } from "react";
import {
  adminOperationsRepository,
  type PortfolioRecord,
} from "../../../services/admin/adminOperationsRepository";

type FilterKey =
  | "semua"
  | "mahreen-studio"
  | "tanya-mahreen"
  | "peduli-mahreen"
  | "mahreen-csr"
  | "magang-mahreen";

type PortfolioItem = {
  title: string;
  category: Exclude<FilterKey, "semua">;
  badge: string;
  service: string;
  description: string;
  year: string;
  image: string;
  imageAlt: string;
};

const filters: { label: string; value: FilterKey }[] = [
  { label: "Semua Karya", value: "semua" },
  { label: "Mahreen Studio", value: "mahreen-studio" },
  { label: "Tanya Mahreen", value: "tanya-mahreen" },
  { label: "Peduli Mahreen", value: "peduli-mahreen" },
  { label: "Mahreen CSR", value: "mahreen-csr" },
  { label: "Magang Mahreen", value: "magang-mahreen" },
];

const portfolioItems: PortfolioItem[] = [
  {
    title: "Urban Odyssey Apparel",
    category: "mahreen-studio",
    badge: "Mahreen Studio",
    service: "Apparel & Branding",
    description:
      "Koleksi busana streetwear modern eksklusif yang memadukan estetika visual urban dengan tren milenial.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Koleksi pakaian dengan warna netral pada gantungan baju",
  },
  {
    title: "Rebranding Kopi Selasar",
    category: "mahreen-studio",
    badge: "Mahreen Studio",
    service: "Branding & Identity",
    description:
      "Penyusunan identitas visual baru yang hangat dan kekinian untuk kedai kopi lokal populer.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Interior kedai kopi dengan papan nama cafe",
  },
  {
    title: "E-Commerce Griya Batik",
    category: "tanya-mahreen",
    badge: "Tanya Mahreen",
    service: "Web Development",
    description:
      "Pengembangan website belanja batik premium berbasis Next.js dengan sistem manajemen produk canggih.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Laptop menampilkan dashboard analitik bisnis digital",
  },
  {
    title: "SehatKu App UI/UX",
    category: "tanya-mahreen",
    badge: "Tanya Mahreen",
    service: "UI/UX Design",
    description:
      "Rancangan desain antarmuka aplikasi kesehatan ramah lansia yang fokus pada kemudahan akses navigasi.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Stetoskop dan laptop sebagai ilustrasi aplikasi kesehatan digital",
  },
  {
    title: "Sobat Tani Launch Campaign",
    category: "magang-mahreen",
    badge: "Magang Mahreen",
    service: "Digital Marketing",
    description:
      "Strategi pemasaran digital terpadu untuk mengenalkan platform agritech kepada petani muda di Jawa Barat.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Tim muda bekerja sama dalam kegiatan lapangan dan kampanye digital",
  },
  {
    title: "Pojok Literasi Cigugur",
    category: "peduli-mahreen",
    badge: "Peduli Mahreen",
    service: "Social Impact",
    description:
      "Pembangunan perpustakaan komunitas yang terintegrasi dengan akses internet dan laboratorium komputer dasar gratis.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Lorong perpustakaan dengan deretan rak buku",
  },
  {
    title: "Eco-Hub CSR Program",
    category: "mahreen-csr",
    badge: "Mahreen CSR",
    service: "Sustainability",
    description:
      "Inisiatif ekonomi sirkular yang mendaur ulang sisa kemasan produksi pabrik menjadi produk bernilai guna.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Tempat sampah warna-warni sebagai ilustrasi program ekonomi sirkular",
  },
  {
    title: "Inkubator Wirausaha Muda",
    category: "peduli-mahreen",
    badge: "Peduli Mahreen",
    service: "Education & Funding",
    description:
      "Program akselerasi keterampilan kepemimpinan dan manajemen keuangan pemuda yang disertai bantuan modal.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Diskusi kelompok dalam kegiatan pelatihan dan inkubasi bisnis",
  },
  {
    title: "Mahreen CRM Portal",
    category: "magang-mahreen",
    badge: "Magang Mahreen",
    service: "Software Development",
    description:
      "Platform manajemen hubungan pelanggan khusus untuk mempermudah monitoring status proyek.",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Tim pengembang bekerja dengan laptop dan monitor di ruang kerja",
  },
  {
    title: "Mahreen Media App",
    category: "magang-mahreen",
    badge: "Magang Mahreen",
    service: "Mobile Application",
    description:
      "Prototipe aplikasi pemutar podcast dan artikel edukasi internal bernuansa elegan.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Layar ponsel dengan ikon aplikasi sebagai ilustrasi mobile application",
  },
];

const mapPortfolioCategory = (portfolio: PortfolioRecord): PortfolioItem["category"] => {
  const value = `${portfolio.category} ${portfolio.technologies.join(" ")}`.toLowerCase();
  if (value.includes("csr")) return "mahreen-csr";
  if (value.includes("social") || value.includes("education") || value.includes("health")) return "peduli-mahreen";
  if (value.includes("studio") || value.includes("brand")) return "mahreen-studio";
  if (value.includes("intern")) return "magang-mahreen";
  return "tanya-mahreen";
};

const mapStoredPortfolio = (portfolio: PortfolioRecord): PortfolioItem => {
  const category = mapPortfolioCategory(portfolio);
  const badgeByCategory: Record<PortfolioItem["category"], string> = {
    "mahreen-studio": "Mahreen Studio",
    "tanya-mahreen": "Tanya Mahreen",
    "peduli-mahreen": "Peduli Mahreen",
    "mahreen-csr": "Mahreen CSR",
    "magang-mahreen": "Magang Mahreen",
  };
  return {
    title: portfolio.projectName,
    category,
    badge: badgeByCategory[category],
    service: portfolio.category,
    description: portfolio.description,
    year: portfolio.projectDate?.slice(0, 4) || new Date(portfolio.createdAt).getFullYear().toString(),
    image: portfolio.heroImage || portfolioItems[0].image,
    imageAlt: `Showcase ${portfolio.projectName}`,
  };
};

const karyaStyles = `
  .karya-section {
    width: 100%;
    background: #111111;
    color: #ffffff;
    padding: 34px 24px 96px;
    border-top: 1px solid rgba(255, 255, 255, 0.075);
  }

  .karya-section,
  .karya-section *,
  .karya-section *::before,
  .karya-section *::after {
    box-sizing: border-box;
  }

  @keyframes karyaSectionEnter {
    from {
      opacity: 0;
      transform: translate3d(0, 16px, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .karya-section__inner {
    width: 100%;
    max-width: 1168px;
    margin: 0 auto;
    animation: karyaSectionEnter 560ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
  }

  .karya-section__title {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .karya-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0 0 58px;
    padding: 0;
    list-style: none;
  }

  .karya-filter__button {
    position: relative;
    appearance: none;
    min-width: 0;
    min-height: 42px;
    padding: 0 20px;
    border: 1px solid rgba(213, 182, 135, 0.22);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.018) !important;
    color: rgba(255, 255, 255, 0.72) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025) !important;
    cursor: pointer;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 750;
    letter-spacing: 0.95px;
    line-height: 1;
    text-transform: uppercase;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .karya-filter__button:hover,
  .karya-filter__button:focus-visible {
    border-color: rgba(229, 201, 145, 0.62) !important;
    background: rgba(213, 182, 135, 0.075) !important;
    color: #ebcf98 !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24), 0 0 20px rgba(213, 182, 135, 0.08) !important;
    outline: none;
    transform: translateY(-1px);
  }

  .karya-filter__button.is-active {
    border-color: #d5b687 !important;
    background: linear-gradient(135deg, #e0c18b, #caa667) !important;
    color: #11100d !important;
    box-shadow: 0 10px 28px rgba(213, 182, 135, 0.2) !important;
  }

  .karya-filter__button.is-active:hover,
  .karya-filter__button.is-active:focus-visible {
    color: #111111;
  }

  .karya-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
  }

  .karya-card {
    position: relative;
    min-height: 506px;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-radius: 18px;
    background: #141414;
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.25);
    isolation: isolate;
    transition: border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease;
  }

  .karya-card:hover {
    border-color: rgba(213, 182, 135, 0.24);
    box-shadow: 0 32px 88px rgba(0, 0, 0, 0.34), 0 0 30px rgba(213, 182, 135, 0.04);
    transform: translateY(-4px);
  }

  .karya-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
    z-index: 4;
  }

  .karya-card__media {
    position: relative;
    height: 266px;
    overflow: hidden;
    background: #1b1b1b;
  }

  .karya-card__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    filter: saturate(0.78) brightness(0.68) contrast(1.04);
    transform: scale(1.012);
    transition: transform 420ms ease, filter 420ms ease;
  }

  .karya-card:hover .karya-card__image {
    transform: scale(1.065);
    filter: saturate(0.84) brightness(0.74) contrast(1.05);
  }

  .karya-card__media::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.20) 54%, rgba(17, 17, 17, 0.78) 100%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.28) 0%, transparent 48%, rgba(0, 0, 0, 0.18) 100%);
    pointer-events: none;
  }

  .karya-card__badge,
  .karya-card__year {
    position: absolute;
    z-index: 2;
    border-radius: 999px;
    background: rgba(10, 10, 10, 0.78);
    color: #d5b687;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.85px;
    line-height: 1;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
  }

  .karya-card__badge {
    top: 18px;
    left: 18px;
    padding: 7px 10px 6px;
  }

  .karya-card__year {
    right: 18px;
    bottom: 18px;
    padding: 7px 9px 6px;
    color: #ffffff;
    letter-spacing: 0.35px;
  }

  .karya-card__body {
    position: relative;
    display: flex;
    min-height: 240px;
    padding: 31px 30px 28px;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
  }

  .karya-card__service {
    margin: 0 0 11px;
    color: rgba(255, 255, 255, 0.38);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.55px;
    line-height: 1.45;
    text-transform: uppercase;
  }

  .karya-card__title {
    max-width: 292px;
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 23px;
    font-weight: 500;
    line-height: 1.13;
    letter-spacing: -0.026em;
  }

  .karya-card__description {
    max-width: 285px;
    min-height: 61px;
    margin: 17px 0 26px;
    color: rgba(255, 255, 255, 0.56);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.78;
  }

  .karya-card__link {
    position: relative;
    width: auto;
    min-height: 42px;
    margin-top: auto;
    padding: 0 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px solid rgba(213, 182, 135, 0.48) !important;
    border-radius: 999px;
    background: rgba(213, 182, 135, 0.055) !important;
    color: #e5c487 !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
    cursor: pointer;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1.05px;
    line-height: 1;
    text-decoration: none;
    text-transform: uppercase;
    transition: background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, color 180ms ease, transform 180ms ease;
  }

  .karya-card__link span {
    display: grid;
    width: 22px;
    height: 22px;
    place-items: center;
    border-radius: 50%;
    background: rgba(213, 182, 135, 0.13);
    font-size: 14px;
    transition: transform 180ms ease, background-color 180ms ease;
  }

  .karya-card__link:hover,
  .karya-card__link:focus-visible {
    border-color: rgba(233, 204, 149, 0.76) !important;
    background: rgba(213, 182, 135, 0.11) !important;
    color: #f0d79f !important;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28), 0 0 20px rgba(213, 182, 135, 0.1) !important;
    outline: none;
    transform: translateY(-2px);
  }

  .karya-card__link:hover span,
  .karya-card__link:focus-visible span {
    background: rgba(213, 182, 135, 0.22);
    transform: translateX(3px);
  }

  .karya-empty {
    grid-column: 1 / -1;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.02);
    color: rgba(255, 255, 255, 0.58);
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    text-align: center;
  }



  .karya-modal {
    position: fixed;
    z-index: 2000;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(10px);
  }

  .karya-modal__dialog {
    position: relative;
    display: grid;
    width: min(100%, 980px);
    max-height: min(86vh, 760px);
    grid-template-columns: minmax(300px, .95fr) minmax(0, 1.05fr);
    overflow: auto;
    border: 1px solid rgba(213, 182, 135, .28);
    border-radius: 22px;
    background: #0d0d0d;
    box-shadow: 0 30px 100px rgba(0,0,0,.55);
  }

  .karya-modal__image {
    width: 100%;
    height: 100%;
    min-height: 500px;
    object-fit: cover;
  }

  .karya-modal__content {
    display: flex;
    padding: clamp(30px, 5vw, 56px);
    flex-direction: column;
    justify-content: center;
  }

  .karya-modal__meta {
    display: flex;
    margin-bottom: 24px;
    justify-content: space-between;
    color: #d5b687;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .karya-modal__content h3 {
    margin: 8px 0 18px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.08;
  }

  .karya-modal__content > p:last-of-type {
    color: rgba(255,255,255,.66);
    font-size: 14px;
    line-height: 1.8;
  }

  .karya-modal__close {
    position: absolute;
    z-index: 2;
    top: 14px;
    right: 14px;
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 50%;
    background: rgba(0,0,0,.65);
    color: #fff;
    cursor: pointer;
    font-size: 24px;
  }

  .karya-modal__actions {
    display: flex;
    margin-top: 28px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .karya-modal__actions a,
  .karya-modal__actions button {
    min-height: 44px;
    padding: 0 20px;
    border: 1px solid rgba(213, 182, 135, 0.4) !important;
    border-radius: 999px;
    background: transparent !important;
    color: #f5efe7 !important;
    box-shadow: none !important;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-decoration: none;
    transition: border-color 180ms ease, background-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .karya-modal__actions a {
    border-color: #d5b687 !important;
    background: linear-gradient(135deg, #dfc08a, #caa667) !important;
    color: #11100d !important;
    font-weight: 800;
  }

  .karya-modal__actions a:hover,
  .karya-modal__actions a:focus-visible,
  .karya-modal__actions button:hover,
  .karya-modal__actions button:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(213, 182, 135, 0.14) !important;
    outline: none;
  }

  .karya-modal__actions button:hover,
  .karya-modal__actions button:focus-visible {
    border-color: rgba(229, 201, 145, 0.7) !important;
    background: rgba(213, 182, 135, 0.08) !important;
    color: #edcf98 !important;
  }

  @media (max-width: 760px) {
    .karya-modal { padding: 14px; }
    .karya-modal__dialog { grid-template-columns: 1fr; }
    .karya-modal__image { min-height: 240px; height: 260px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .karya-section__inner {
      animation: none;
    }
  }

  @media (max-width: 1080px) {
    .karya-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    .karya-section {
      padding: 26px 20px 72px;
    }

    .karya-filter {
      justify-content: flex-start;
      gap: 12px;
      margin-bottom: 36px;
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 4px;
      scrollbar-width: none;
    }

    .karya-filter::-webkit-scrollbar {
      display: none;
    }

    .karya-filter__button {
      min-width: max-content;
      height: 34px;
      padding: 0 18px;
    }

    .karya-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .karya-card {
      min-height: auto;
    }

    .karya-card__media {
      height: 244px;
    }
  }

  @media (max-width: 420px) {
    .karya-section {
      padding-left: 16px;
      padding-right: 16px;
    }

    .karya-card__media {
      height: 218px;
    }

    .karya-card__body {
      padding: 26px 22px 24px;
    }

    .karya-card__title {
      font-size: 21px;
    }
  }
`;

const Karya = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("semua");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [storedPortfolios, setStoredPortfolios] = useState(() =>
    adminOperationsRepository.getPortfolios(),
  );

  useEffect(() => adminOperationsRepository.subscribe(() => {
    setStoredPortfolios(adminOperationsRepository.getPortfolios());
  }), []);

  const visibleItems = useMemo(
    () => [
      ...storedPortfolios
        .filter((portfolio) => portfolio.status === "Published" && portfolio.visibility === "Public")
        .map(mapStoredPortfolio),
      ...portfolioItems,
    ],
    [storedPortfolios],
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === "semua") {
      return visibleItems;
    }

    return visibleItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, visibleItems]);

  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedItem(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  return (
    <section className="karya-section" aria-labelledby="karya-title">
      <style data-component="karya-section">{karyaStyles}</style>

      <div className="karya-section__inner">
        <h2 className="karya-section__title" id="karya-title">
          Daftar Karya Mahreen Indonesia
        </h2>

        <ul className="karya-filter" aria-label="Filter kategori portofolio">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <li key={filter.value}>
                <button
                  type="button"
                  className={`karya-filter__button${isActive ? " is-active" : ""}`}
                  aria-pressed={isActive}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="karya-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <article className="karya-card" key={item.title}>
                <div className="karya-card__media">
                  <img width="1200" height="800"
                    className="karya-card__image"
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="karya-card__badge">{item.badge}</span>
                  <span className="karya-card__year">{item.year}</span>
                </div>

                <div className="karya-card__body">
                  <p className="karya-card__service">{item.service}</p>
                  <h3 className="karya-card__title">{item.title}</h3>
                  <p className="karya-card__description">{item.description}</p>

                  <button className="karya-card__link" type="button" onClick={() => setSelectedItem(item)}>
                    Lihat Detail <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="karya-empty">
              Belum ada karya yang ditampilkan pada kategori ini.
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="karya-modal" role="presentation" onMouseDown={() => setSelectedItem(null)}>
          <article
            className="karya-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="karya-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="karya-modal__close" type="button" aria-label="Tutup detail portofolio" onClick={() => setSelectedItem(null)}>×</button>
            <img width="1200" height="800" decoding="async" loading="lazy" className="karya-modal__image" src={selectedItem.image} alt={selectedItem.imageAlt} />
            <div className="karya-modal__content">
              <div className="karya-modal__meta">
                <span>{selectedItem.badge}</span>
                <span>{selectedItem.year}</span>
              </div>
              <p className="karya-card__service">{selectedItem.service}</p>
              <h3 id="karya-modal-title">{selectedItem.title}</h3>
              <p>{selectedItem.description}</p>
              <div className="karya-modal__actions">
                <a href={`/contact?pillar=${selectedItem.category === "mahreen-csr" ? "csr" : selectedItem.category === "peduli-mahreen" ? "peduli" : "business"}`}>Diskusikan Proyek Serupa</a>
                <button type="button" onClick={() => setSelectedItem(null)}>Tutup</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
};

export default Karya;
