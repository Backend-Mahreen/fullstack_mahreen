export type TierId = "professional" | "business" | "enterprise";

export type PackageServiceKey =
  | "website"
  | "branding"
  | "social-media"
  | "digital-marketing"
  | "advertising"
  | "content-production"
  | "consultation";

export type PackageTier = {
  id: TierId;
  tier: string;
  name: string;
  price: number;
  priceNote?: string;
  features: string[];
  recommended?: boolean;
};

export type ComparisonValue = string | boolean;

export type PackageComparisonRow = {
  label: string;
  professional: ComparisonValue;
  business: ComparisonValue;
  enterprise: ComparisonValue;
};

export type PackageAddOn = {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  priceValue: number;
};

export type PackageServiceConfig = {
  key: PackageServiceKey;
  label: string;
  route: string;
  eyebrow: string;
  title: string;
  description: string;
  tiers: PackageTier[];
  comparisonTitle?: string;
  comparisonRows: PackageComparisonRow[];
  addOns: PackageAddOn[];
  taxNote?: string;
};
