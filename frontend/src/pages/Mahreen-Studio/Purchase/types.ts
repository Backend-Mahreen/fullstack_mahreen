export type StudioCartItem = {
  productSlug: string;
  productSku: string;
  productTitle: string;
  productImage: string;
  color: string;
  colorLabel: string;
  size: string;
  quantity: number;
  price: number;
};

export type StudioShippingDetails = {
  fullName: string;
  whatsapp: string;
  email: string;
  street: string;
  province: string;
  city: string;
  subdistrict: string;
  postal: string;
};

export type StudioCheckoutDraft = {
  item: StudioCartItem;
  items: StudioCartItem[];
  shipping: StudioShippingDetails;
  updatedAt: string;
};

export type StudioOrderStatus = "confirmed" | "processed" | "shipped" | "delivered";

export type StudioOrder = StudioCheckoutDraft & {
  orderNumber: string;
  trackingNumber: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  adminFee: number;
  discount: number;
  grandTotal: number;
  status: StudioOrderStatus;
  createdAt: string;
  estimatedArrival: string;
};
