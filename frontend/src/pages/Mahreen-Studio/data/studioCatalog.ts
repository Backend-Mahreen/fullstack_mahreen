import {
  adminEcosystemRepository,
  type StudioProductRecord,
} from "../../../services/admin/adminEcosystemRepository";
import { normalizeStudioCategory } from "../../../utils/studioCategory";

export type StudioProductCategory = string;

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

const slugifyProduct = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "local-product";

const mapAdminProduct = (product: StudioProductRecord): StudioProduct => {
  const category = normalizeStudioCategory(product.category);
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
    variants: neutralVariants(product.image || ""),
  };
};

export const getStudioProductCatalog = (): StudioProduct[] =>
  adminEcosystemRepository
    .getStudioSnapshot()
    .products.filter((product) => product.visibility === "Public")
    .map(mapAdminProduct);

export const getStudioLocalCatalog = (): StudioProduct[] =>
  getStudioProductCatalog();

export const getStudioProductBySlug = (slug: string | null | undefined) =>
  slug ? getStudioProductCatalog().find((product) => product.slug === slug) ?? null : null;

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
