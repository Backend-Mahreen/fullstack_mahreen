import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatStudioPrice,
  type StudioProductCategory,
} from "../data/studioCatalog";
import { apiClient } from "../../../api/apiClient";
import { fetchStudioCategories, normalizeStudioCategory, type StudioCategory } from "../../../utils/studioCategory";
import { API_ENDPOINTS } from "../../../api/endpoints";

type ProdukTab = "all" | string;

type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: string;
  collection_name: string;
};

type DisplayProduct = {
  slug: string;
  title: string;
  price: number;
  stock: number;
  category: StudioProductCategory;
  image: string;
};

const fallbackProducts: DisplayProduct[] = [
  { slug: "signature-noir-hoodie", title: "Signature Minimalist Hoodie", price: 2450000, stock: 24, category: "Apparel", image: "" },
  { slug: "signature-tee-new", title: "Mahreen Signature Tee", price: 249000, stock: 70, category: "Apparel", image: "" },
  { slug: "elevated-essentials-new", title: "Mahreen Elevated Essentials", price: 629000, stock: 70, category: "Apparel", image: "" },
  { slug: "studio-lifestyle-set", title: "Studio Lifestyle Set", price: 899000, stock: 28, category: "Accessories", image: "" },
];

const mapApiProduct = (p: ApiProduct): DisplayProduct => ({
  slug: p.slug || `product-${p.id}`,
  title: p.title,
  price: p.price,
  stock: p.stock,
  category: normalizeStudioCategory(p.category || ""),
  image: p.image || "",
});

const produkStyles = `
  .studio-produk {
    width: 100%;
    background: #050505;
    color: #ffffff;
    padding: 54px clamp(16px, 4vw, 32px) 88px;
    font-family: "Inter", sans-serif;
    overflow: hidden;
  }

  .studio-produk * { box-sizing: border-box; }

  .studio-produk__inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  @keyframes fadeUpInProduk {
    from { opacity: 0; transform: translateY(34px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .studio-produk__eyebrow {
    margin: 0 0 10px;
    color: #d8b56e;
    font-family: "DM Mono", "Courier New", monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.7px;
    text-transform: uppercase;
  }

  .studio-produk__heading {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", serif;
    font-size: clamp(30px, 4.5vw, 52px);
    font-weight: 500;
    line-height: 1.05;
  }

  .studio-produk__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;
    margin-bottom: 28px;
    opacity: 0;
  }

  .studio-produk.is-visible .studio-produk__header {
    animation: fadeUpInProduk 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .studio-produk__tabs {
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
    transform: translateY(13px);
  }

  .studio-produk__tab {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0 0 12px;
    transition: color 0.3s ease, border-color 0.3s ease;
    border-bottom: 2px solid transparent;
  }

  .studio-produk__tab:hover { color: rgba(255, 255, 255, 0.86); }
  .studio-produk__tab.is-active { color: #e6c989; border-bottom-color: #e6c989; }

  .studio-produk__count {
    color: rgba(255, 255, 255, 0.5);
    font-family: "DM Mono", monospace;
    font-size: 14px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .studio-produk__count span { color: #ffffff; }

  .studio-produk__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .studio-produk__card {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    aspect-ratio: 7 / 10;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #262626 0%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.07);
    transition:
      transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 300ms ease,
      box-shadow 420ms ease;
    opacity: 0;
    isolation: isolate;
  }

  .studio-produk__card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.86) 100%);
    pointer-events: none;
  }

  .studio-produk__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1), filter 420ms ease;
  }

  .studio-produk__card:hover {
    transform: translateY(-8px);
    border-color: rgba(230, 201, 137, 0.35);
    box-shadow: 0 28px 60px rgba(0, 0, 0, 0.48);
  }

  .studio-produk__card:hover .studio-produk__image {
    transform: scale(1.055);
    filter: saturate(1.06) contrast(1.03);
  }

  .studio-produk.is-visible .studio-produk__card {
    animation: fadeUpInProduk 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .studio-produk__copy {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 22px 18px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .studio-produk__stock {
    display: flex;
    align-items: center;
    gap: 7px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .studio-produk__stock-dot {
    width: 6px;
    height: 6px;
    background-color: #e6c989;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(230, 201, 137, 0.65);
  }

  .studio-produk__title {
    margin: 0;
    color: #ffffff;
    font-family: "Playfair Display", serif;
    font-size: clamp(17px, 1.5vw, 20px);
    font-weight: 500;
    line-height: 1.2;
  }

  .studio-produk__price {
    margin: 2px 0 0;
    color: rgba(255, 255, 255, 0.78);
    font-family: "DM Mono", monospace;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  @media (max-width: 1024px) {
    .studio-produk__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 768px) {
    .studio-produk__header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .studio-produk__tabs {
      transform: translateY(0);
      width: 100%;
      overflow-x: auto;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .studio-produk__count { align-self: flex-end; }
  }

  @media (max-width: 520px) {
    .studio-produk__grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .studio-produk__header,
    .studio-produk__card { opacity: 1 !important; animation: none !important; transform: none !important; }
    .studio-produk__image { transition: none !important; }
  }
`;

const Produk = () => {
  const [products, setProducts] = useState<DisplayProduct[]>(fallbackProducts);
  const [categories, setCategories] = useState<StudioCategory[]>([]);
  const [activeTab, setActiveTab] = useState<ProdukTab>("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    apiClient<{ data: ApiProduct[] }>(API_ENDPOINTS.studioPublic.products)
      .then((res) => {
        if (!active) return;
        const apiProducts = (res.data || []).map(mapApiProduct);
        if (apiProducts.length > 0) setProducts(apiProducts);
      })
      .catch(() => undefined);
    fetchStudioCategories().then((cats) => {
      if (active) setCategories(cats);
    });
    return () => { active = false; };
  }, []);

  const produkTabs = useMemo(() => {
    const tabs: { label: string; value: ProdukTab }[] = [
      { label: "Semua Produk", value: "all" },
    ];
    for (const cat of categories) {
      tabs.push({ label: cat.name, value: cat.slug });
    }
    if (tabs.length === 1) {
      tabs.push({ label: "Apparel", value: "Apparel" });
      tabs.push({ label: "Accessories", value: "Accessories" });
    }
    return tabs;
  }, [categories]);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(sectionElement);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(sectionElement);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = useMemo(
    () => {
      if (activeTab === "all") return products;
      const matchingCat = categories.find((c) => c.slug === activeTab);
      if (!matchingCat) return products;
      return products.filter((product) =>
        product.category.toLowerCase() === matchingCat.name.toLowerCase() ||
        product.category.toLowerCase() === matchingCat.slug.toLowerCase()
      );
    },
    [activeTab, products, categories],
  );

  return (
    <section
      className={`studio-produk ${isVisible ? "is-visible" : ""}`}
      id="produk-unggulan"
      ref={sectionRef}
      aria-labelledby="studio-products-title"
    >
      <style data-component="studio-produk">{produkStyles}</style>

      <div className="studio-produk__inner">
        <header className="studio-produk__header">
          <div>
            <p className="studio-produk__eyebrow">Local Catalog</p>
            <h2 id="studio-products-title" className="studio-produk__heading">Shop the Collection</h2>
          </div>

          <ul className="studio-produk__tabs">
            {produkTabs.map((tab) => (
              <li key={tab.value}>
                <button
                  className={`studio-produk__tab${activeTab === tab.value ? " is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="studio-produk__count">
            <span>{filteredProducts.length}</span> PRODUCTS
          </div>
        </header>

        <div className="studio-produk__grid">
          {filteredProducts.map((product, index) => (
            <a
              key={product.slug}
              className="studio-produk__card"
              href={`/mahreen-studio/product/${product.slug}`}
              aria-label={`Lihat detail ${product.title}`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {product.image ? (
                <img width="800" height="1000"
                  className="studio-produk__image"
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="studio-produk__image" style={{ background: "linear-gradient(180deg, #262626 0%, #0a0a0a 100%)" }} />
              )}
              <div className="studio-produk__copy">
                <div className="studio-produk__stock">
                  <span className="studio-produk__stock-dot" />
                  {product.stock} PCS TERSEDIA
                </div>
                <h3 className="studio-produk__title">{product.title}</h3>
                <p className="studio-produk__price">{formatStudioPrice(product.price)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Produk;
