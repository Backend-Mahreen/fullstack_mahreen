export type ServiceFormData = {
  name: string;
  category: string;
  active: boolean;
  price: string;
  description: string;
  features: string[];
  thumbnail: string;
  gallery: string[];
  seoTitle: string;
  metaDescription: string;
};

export const createEmptyServiceForm = (): ServiceFormData => ({
  name: "",
  category: "Branding",
  active: true,
  price: "",
  description: "",
  features: ["", ""],
  thumbnail: "",
  gallery: [],
  seoTitle: "",
  metaDescription: "",
});
