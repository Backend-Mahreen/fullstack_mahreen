import { useState, useEffect, useRef } from "react";
import produk1 from "../../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_1.png";
import produk2 from "../../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_2.png";
import produk3 from "../../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_3.webp";

type FilterTab = "all" | "apparel" | "accessories";

type ProductCard = {
  id: string;
  image: string;
  badge: "NEW ARRIVAL" | "LIMITED" | "BEST SELLER";
  name: string;
  price: string;
  category: string;
  subCategory: string;
  filter: "apparel" | "accessories";
};

const filterTabs: { label: string; value: FilterTab }[] = [
  { label: "ALL", value: "all" },
  { label: "APPAREL", value: "apparel" },
  { label: "ACCESSORIES", value: "accessories" },
];

const products: ProductCard[] = [
  {
    id: "aurum-essential-tee",
    image: produk1,
    badge: "NEW ARRIVAL",
    name: "Aurum Essential Tee",
    price: "Rp 449.000",
    category: "APPAREL",
    subCategory: "SIGNATURE",
    filter: "apparel",
  },
  {
    id: "signature-oversized-hoodie",
    image: produk2,
    badge: "LIMITED",
    name: "Signature Oversized Hoodie",
    price: "Rp 1.299.000",
    category: "APPAREL",
    subCategory: "WINTER EDITION",
    filter: "apparel",
  },
  {
    id: "studio-lifestyle-set",
    image: produk3,
    badge: "BEST SELLER",
    name: "Studio Lifestyle Set",
    price: "Rp 899.000",
    category: "ACCESSORIES",
    subCategory: "LIFESTYLE",
    filter: "accessories",
  },
];

const badgeColor: Record<ProductCard["badge"], string> = {
  "NEW ARRIVAL": "#3a6b47",
  "LIMITED": "#7a6a2a",
  "BEST SELLER": "#7a3a1a",
};

const featuredPiecesStyles = `

  .featured-pieces {
    width: 100%;
    background: #050505;
    color: #ffffff;
    padding: 72px clamp(16px, 4vw, 32px) 80px;
    overflow: hidden;
  }

  .featured-pieces *,
  .featured-pieces *::before,
  .featured-pieces *::after {
    box-sizing: border-box;
  }

  .featured-pieces__inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  @keyframes fadeUpFeatured {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .featured-pieces__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    opacity: 0;
  }

  .featured-pieces.is-visible .featured-pieces__header {
    animation: fadeUpFeatured 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .featured-pieces__title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 6px;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .featured-pieces__subtitle {
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    margin: 0;
  }

  .featured-pieces__tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .featured-pieces__tab {
    appearance: none;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.45);
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.2px;
    padding: 6px 14px;
    cursor: pointer;
    transition: color 0.2s ease;
    border-bottom: 1px solid transparent;
  }

  .featured-pieces__tab:hover { color: rgba(255,255,255,0.8); }

  .featured-pieces__tab.is-active {
    color: #d6a35c;
    border-bottom-color: #d6a35c;
  }

  .featured-pieces__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .featured-pieces__card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    opacity: 0;
  }

  .featured-pieces.is-visible .featured-pieces__card {
    animation: fadeUpFeatured 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .featured-pieces__image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #141414;
  }

  .featured-pieces__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 650ms cubic-bezier(0.2, 0.65, 0.3, 1);
  }

  .featured-pieces__card:hover .featured-pieces__image {
    transform: scale(1.04);
  }

  .featured-pieces__badge {
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 4px 8px;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #ffffff;
    border-radius: 2px;
  }

  .featured-pieces__info {
    padding: 16px 4px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .featured-pieces__meta {
    font-family: "DM Mono", monospace;
    font-size: 14px;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    margin: 0;
  }

  .featured-pieces__name {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(16px, 1.6vw, 20px);
    font-weight: 500;
    color: #ffffff;
    margin: 0;
    line-height: 1.2;
  }

  .featured-pieces__price {
    font-family: "DM Mono", monospace;
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    margin: 2px 0 0;
  }

  .featured-pieces__cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.2px;
    color: #d6a35c;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(214, 163, 92, 0.3);
    padding-bottom: 2px;
    width: fit-content;
    transition: gap 0.2s ease, border-color 0.2s ease;
  }

  .featured-pieces__card:hover .featured-pieces__cta {
    gap: 10px;
    border-color: #d6a35c;
  }

  @media (max-width: 900px) {
    .featured-pieces__grid { grid-template-columns: repeat(2, 1fr); }
    .featured-pieces__header { flex-direction: column; align-items: flex-start; gap: 20px; }
  }

  @media (max-width: 480px) {
    .featured-pieces__grid { grid-template-columns: 1fr; }
    .featured-pieces__title { font-size: 26px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .featured-pieces__card,
    .featured-pieces__header {
      animation: none !important;
      opacity: 1 !important;
    }
    .featured-pieces__image { transition: none; }
  }
`;

const FeaturedPieces = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = products.filter(
    (p) => activeTab === "all" || p.filter === activeTab
  );

  return (
    <section
      className={`featured-pieces ${isVisible ? "is-visible" : ""}`}
      id="featured-pieces"
      ref={sectionRef}
    >
      <style data-component="featured-pieces">{featuredPiecesStyles}</style>

      <div className="featured-pieces__inner">
        <header className="featured-pieces__header">
          <div>
            <h2 className="featured-pieces__title">Featured Pieces</h2>
            <p className="featured-pieces__subtitle">
              Curated selection from the Signature series.
            </p>
          </div>

          <ul className="featured-pieces__tabs">
            {filterTabs.map((tab) => (
              <li key={tab.value}>
                <button
                  type="button"
                  className={`featured-pieces__tab${activeTab === tab.value ? " is-active" : ""}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </header>

        <div className="featured-pieces__grid">
          {filtered.map((product, index) => (
            <a
              key={product.id}
              className="featured-pieces__card"
              // PERBAIKAN: Menggunakan /product/ agar sesuai dengan AppRoutes.tsx
              href={`/mahreen-studio/product/${product.id}`}
              style={{ animationDelay: `${0.1 + index * 0.12}s` } as React.CSSProperties}
            >
              <div className="featured-pieces__image-wrapper">
                <img width="800" height="1000" decoding="async"
                  src={product.image}
                  alt={product.name}
                  className="featured-pieces__image"
                  loading="lazy"
                />
                <span
                  className="featured-pieces__badge"
                  style={{ backgroundColor: badgeColor[product.badge] }}
                >
                  {product.badge}
                </span>
              </div>

              <div className="featured-pieces__info">
                <p className="featured-pieces__meta">
                  {product.category} / {product.subCategory}
                </p>
                <h3 className="featured-pieces__name">{product.name}</h3>
                <p className="featured-pieces__price">{product.price}</p>
                <span className="featured-pieces__cta">
                  LIHAT DETAIL →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPieces;