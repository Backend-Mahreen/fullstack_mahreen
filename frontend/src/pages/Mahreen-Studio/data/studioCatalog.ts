import hoodieCoklat from "../../../assets/Mahreen-Studio/GambarProduk/hoodie_coklat.webp";
import hoodieHitam from "../../../assets/Mahreen-Studio/GambarProduk/hoodie_hitam.webp";
import hoodiePutih from "../../../assets/Mahreen-Studio/GambarProduk/hoodie_putih.webp";
import lifestyleEssentials from "../../../assets/Mahreen-Studio/Collection/lifestyle-essentials.png";
import latestProduct1 from "../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_1.png";
import latestProduct2 from "../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_2.png";
import latestProduct3 from "../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_3.webp";
import {
  adminEcosystemRepository,
  type StudioProductRecord,
} from "../../../services/admin/adminEcosystemRepository";

export type StudioProductCategory = "apparel" | "accessories" | "merchandise";

export type StudioProductVariant = {
  id: string;
  label: string;
  hex: string;
  image: string;
};

export type StudioProduct = {
  slug: string;
  sku: string;
  title: string;
  collection: string;
  category: StudioProductCategory;
  price: number;
  stock: number;
  description: string;
  sizes: readonly string[];
  variants: readonly StudioProductVariant[];
};

const neutralVariants = (image: string): readonly StudioProductVariant[] => [
  { id: "studio-edition", label: "Studio Edition", hex: "#2a2927", image },
];

export const studioProductCatalog: readonly StudioProduct[] = [
  {
    slug: "signature-noir-hoodie",
    sku: "MS-SNH-001",
    title: "Signature Minimalist Hoodie",
    collection: "Essentials Collection",
    category: "apparel",
    price: 2450000,
    stock: 24,
    description: "Heavyweight hoodie dengan siluet terstruktur dan detail minimal khas Mahreen Studio.",
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "hitam", label: "Charcoal Noir", hex: "#171717", image: hoodieHitam },
      { id: "putih", label: "Off-White Ivory", hex: "#f2efe9", image: hoodiePutih },
      { id: "coklat", label: "Earth Umber", hex: "#665247", image: hoodieCoklat },
    ],
  },
  {
    slug: "signature-tee-new",
    sku: "MS-ST-002",
    title: "Mahreen Signature Tee",
    collection: "Signature Collection",
    category: "apparel",
    price: 249000,
    stock: 70,
    description: "Kaos esensial berpotongan modern untuk pemakaian harian yang rapi dan nyaman.",
    sizes: ["S", "M", "L", "XL"],
    variants: neutralVariants(latestProduct1),
  },
  {
    slug: "refined-modisty-new",
    sku: "MS-RM-003",
    title: "Mahreen Refined Modisty",
    collection: "Refined Collection",
    category: "apparel",
    price: 449000,
    stock: 70,
    description: "Koleksi modest kontemporer dengan proporsi bersih dan material yang ringan.",
    sizes: ["S", "M", "L", "XL"],
    variants: neutralVariants(latestProduct3),
  },
  {
    slug: "elevated-essentials-new",
    sku: "MS-EE-004",
    title: "Mahreen Elevated Essentials",
    collection: "Essentials Collection",
    category: "apparel",
    price: 629000,
    stock: 70,
    description: "Essential premium dengan konstruksi detail untuk tampilan kasual yang lebih terkurasi.",
    sizes: ["S", "M", "L", "XL"],
    variants: neutralVariants(latestProduct2),
  },
  {
    slug: "everyday-motion-new",
    sku: "MS-EM-005",
    title: "Mahreen Everyday Motion",
    collection: "Motion Collection",
    category: "apparel",
    price: 389000,
    stock: 70,
    description: "Daily wear fleksibel yang dirancang untuk mobilitas dan ritme kerja kreatif.",
    sizes: ["S", "M", "L", "XL"],
    variants: neutralVariants(lifestyleEssentials),
  },
  {
    slug: "aurum-essential-tee",
    sku: "MS-AET-006",
    title: "Aurum Essential Tee",
    collection: "Signature Series",
    category: "apparel",
    price: 449000,
    stock: 36,
    description: "Signature tee dengan finishing hangat dan karakter visual yang understated.",
    sizes: ["S", "M", "L", "XL"],
    variants: neutralVariants(latestProduct1),
  },
  {
    slug: "signature-oversized-hoodie",
    sku: "MS-SOH-007",
    title: "Signature Oversized Hoodie",
    collection: "Winter Edition",
    category: "apparel",
    price: 1299000,
    stock: 18,
    description: "Oversized hoodie edisi terbatas dengan volume modern dan tekstur premium.",
    sizes: ["S", "M", "L", "XL"],
    variants: neutralVariants(latestProduct2),
  },
  {
    slug: "studio-lifestyle-set",
    sku: "MS-SLS-008",
    title: "Studio Lifestyle Set",
    collection: "Lifestyle Collection",
    category: "accessories",
    price: 899000,
    stock: 28,
    description: "Set lifestyle terkurasi untuk melengkapi ruang dan aktivitas kreatif sehari-hari.",
    sizes: ["One Size"],
    variants: neutralVariants(latestProduct3),
  },
];

const studioLocalCatalogSlugs = [
  "signature-noir-hoodie",
  "signature-tee-new",
  "elevated-essentials-new",
  "studio-lifestyle-set",
] as const;

export const studioLocalCatalog: readonly StudioProduct[] = studioLocalCatalogSlugs
  .map((slug) => studioProductCatalog.find((product) => product.slug === slug))
  .filter((product): product is StudioProduct => Boolean(product));

const catalogBySlug = new Map(studioProductCatalog.map((product) => [product.slug, product]));

const slugifyProduct = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "local-product";

const mapAdminProduct = (product: StudioProductRecord): StudioProduct => {
  const normalizedCategory = product.category.toLowerCase();
  const category: StudioProductCategory = normalizedCategory.includes("apparel") || normalizedCategory.includes("fashion")
    ? "apparel"
    : normalizedCategory.includes("access")
      ? "accessories"
      : "merchandise";
  return {
    slug: `local-${slugifyProduct(product.name)}-${product.id.toLowerCase().slice(-6)}`,
    sku: product.sku,
    title: product.name,
    collection: product.collection,
    category,
    price: product.discountPrice ?? product.price,
    stock: product.stock,
    description: product.description,
    sizes: ["One Size"],
    variants: neutralVariants(product.image || latestProduct1),
  };
};

export const getStudioProductCatalog = (): StudioProduct[] => [
  ...adminEcosystemRepository
    .getStudioSnapshot()
    .products.filter((product) => product.visibility === "Public")
    .map(mapAdminProduct),
  ...studioProductCatalog,
];

export const getStudioLocalCatalog = (): StudioProduct[] => {
  const starterSlugs = new Set(studioLocalCatalogSlugs);
  return getStudioProductCatalog().filter(
    (product) => product.slug.startsWith("local-") || starterSlugs.has(product.slug as typeof studioLocalCatalogSlugs[number]),
  );
};

export const getStudioProductBySlug = (slug: string | null | undefined) =>
  slug
    ? catalogBySlug.get(slug) ?? getStudioProductCatalog().find((product) => product.slug === slug) ?? null
    : null;

export const getStudioProductVariant = (
  product: StudioProduct,
  variantId: string | null | undefined,
) => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];

export const getStudioProductImage = (
  slug: string,
  variantId?: string | null,
) => {
  const product = getStudioProductBySlug(slug);
  return product ? getStudioProductVariant(product, variantId).image : "";
};

export const formatStudioPrice = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
