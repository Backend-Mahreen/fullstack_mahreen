import {
  getStudioProductBySlug,
  getStudioProductVariant,
} from "../data/studioCatalog";
import type {
  StudioCartItem,
  StudioCheckoutDraft,
  StudioOrder,
  StudioShippingDetails,
} from "./types";
import { emitPlatformDataChange } from "../../../services/storage/browserStorage";
import { getFlowStorage } from "../../../services/storage/dataSourceStorage";

const CART_KEY = "mahreen-studio-cart";
const ACTIVE_ITEM_KEY = "mahreen-studio-active-item";
const ACTIVE_ITEMS_KEY = "mahreen-studio-active-items";
const CHECKOUT_KEY = "mahreen-studio-checkout";
const ORDER_KEY = "mahreen-studio-last-order";
const ORDER_SESSION_KEY = "mahreen:studio-order-session:v1";
export const STUDIO_ORDER_HISTORY_KEY = "mahreen:studio-order-history:v1";
const CART_CHANGE_EVENT = "mahreen:studio-cart-change";

const safeParse = <T,>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const getStorage = () => getFlowStorage();

const normalizeCartItem = (
  item: Partial<StudioCartItem> | null | undefined,
): StudioCartItem | null => {
  const product = getStudioProductBySlug(item?.productSlug);
  if (!product) return null;

  const variant = getStudioProductVariant(product, item?.color);
  const requestedSize = item?.size;
  const size = requestedSize && product.sizes.includes(requestedSize)
    ? requestedSize
    : product.sizes[0];

  return {
    productSlug: product.slug,
    productSku: product.sku,
    productTitle: product.title,
    productImage: variant.image,
    color: variant.id,
    colorLabel: variant.label,
    size,
    quantity: Math.max(1, Math.min(10, Number(item?.quantity) || 1)),
    price: product.price,
  };
};

const normalizeCartItems = (
  items: Array<Partial<StudioCartItem>> | null | undefined,
) =>
  (Array.isArray(items) ? items : [])
    .map(normalizeCartItem)
    .filter((item): item is StudioCartItem => item !== null);

const emitCartChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT));
    emitPlatformDataChange();
  }
};

const isSameCartItem = (
  left: Pick<StudioCartItem, "productSlug" | "color" | "size">,
  right: Pick<StudioCartItem, "productSlug" | "color" | "size">,
) =>
  left.productSlug === right.productSlug &&
  left.color === right.color &&
  left.size === right.size;

export const readStudioCart = (): StudioCartItem[] => {
  const storage = getStorage();
  if (!storage) return [];

  const parsed = safeParse<Partial<StudioCartItem>[]>(storage.getItem(CART_KEY));
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map(normalizeCartItem)
    .filter((item): item is StudioCartItem => item !== null);
};

export const getActiveStudioCartItem = (): StudioCartItem | null => {
  const storage = getStorage();
  if (!storage) return null;

  const activeItem = normalizeCartItem(
    safeParse<Partial<StudioCartItem>>(storage.getItem(ACTIVE_ITEM_KEY)),
  );

  if (activeItem) return activeItem;

  const cart = readStudioCart();
  return cart.at(-1) ?? null;
};

export const getActiveStudioCartItems = (): StudioCartItem[] => {
  const storage = getStorage();
  if (!storage) return [];

  const selected = normalizeCartItems(
    safeParse<Array<Partial<StudioCartItem>>>(storage.getItem(ACTIVE_ITEMS_KEY)),
  );
  if (selected.length) return selected;

  const active = getActiveStudioCartItem();
  return active ? [active] : [];
};

// Alias dipertahankan agar integrasi lama tidak rusak.
export const getLatestStudioCartItem = getActiveStudioCartItem;

export const addStudioCartItem = (item: StudioCartItem) => {
  const storage = getStorage();
  const normalized = normalizeCartItem(item);
  if (!storage || !normalized) return null;

  const cart = readStudioCart();
  const matchingIndex = cart.findIndex(
    (entry) =>
      entry.productSlug === normalized.productSlug &&
      entry.color === normalized.color &&
      entry.size === normalized.size,
  );

  if (matchingIndex >= 0) {
    cart[matchingIndex] = {
      ...normalized,
      quantity: Math.min(10, cart[matchingIndex].quantity + normalized.quantity),
    };
  } else {
    cart.push(normalized);
  }

  const activeItem = matchingIndex >= 0 ? cart[matchingIndex] : normalized;
  storage.setItem(CART_KEY, JSON.stringify(cart));
  storage.setItem(ACTIVE_ITEM_KEY, JSON.stringify(activeItem));
  storage.removeItem(ACTIVE_ITEMS_KEY);
  storage.removeItem(CHECKOUT_KEY);
  emitCartChange();
  return activeItem;
};

export const updateStudioCartItemQuantity = (
  item: Pick<StudioCartItem, "productSlug" | "color" | "size">,
  quantity: number,
) => {
  const storage = getStorage();
  if (!storage) return [];

  const cart = readStudioCart();
  const nextQuantity = Math.max(1, Math.min(10, Math.round(quantity) || 1));
  const nextCart = cart.map((entry) =>
    isSameCartItem(entry, item)
      ? { ...entry, quantity: nextQuantity }
      : entry,
  );
  const activeItem = nextCart.find((entry) => isSameCartItem(entry, item));

  storage.setItem(CART_KEY, JSON.stringify(nextCart));
  if (activeItem) storage.setItem(ACTIVE_ITEM_KEY, JSON.stringify(activeItem));
  storage.removeItem(ACTIVE_ITEMS_KEY);
  storage.removeItem(CHECKOUT_KEY);
  emitCartChange();
  return nextCart;
};

export const removeStudioCartItem = (
  item: Pick<StudioCartItem, "productSlug" | "color" | "size">,
) => {
  const storage = getStorage();
  if (!storage) return [];

  const nextCart = readStudioCart().filter((entry) => !isSameCartItem(entry, item));
  const activeItem = normalizeCartItem(
    safeParse<Partial<StudioCartItem>>(storage.getItem(ACTIVE_ITEM_KEY)),
  );

  storage.setItem(CART_KEY, JSON.stringify(nextCart));
  if (activeItem && isSameCartItem(activeItem, item)) {
    const nextActive = nextCart.at(-1);
    if (nextActive) storage.setItem(ACTIVE_ITEM_KEY, JSON.stringify(nextActive));
    else storage.removeItem(ACTIVE_ITEM_KEY);
  }
  storage.removeItem(ACTIVE_ITEMS_KEY);
  storage.removeItem(CHECKOUT_KEY);
  emitCartChange();
  return nextCart;
};

export const clearStudioCart = () => {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(CART_KEY);
  storage.removeItem(ACTIVE_ITEM_KEY);
  storage.removeItem(ACTIVE_ITEMS_KEY);
  storage.removeItem(CHECKOUT_KEY);
  emitCartChange();
};

export const selectStudioBuyNowItem = (item: StudioCartItem) => {
  const storage = getStorage();
  const normalized = normalizeCartItem(item);
  if (!storage || !normalized) return null;

  const cart = readStudioCart();
  const withoutCurrentVariant = cart.filter(
    (entry) =>
      !(
        entry.productSlug === normalized.productSlug &&
        entry.color === normalized.color &&
        entry.size === normalized.size
      ),
  );

  withoutCurrentVariant.push(normalized);
  storage.setItem(CART_KEY, JSON.stringify(withoutCurrentVariant));
  storage.setItem(ACTIVE_ITEM_KEY, JSON.stringify(normalized));
  storage.setItem(ACTIVE_ITEMS_KEY, JSON.stringify([normalized]));
  storage.removeItem(CHECKOUT_KEY);
  emitCartChange();
  return normalized;
};

export const selectStudioCartItemsForCheckout = (items: StudioCartItem[]) => {
  const storage = getStorage();
  const normalizedItems = normalizeCartItems(items);
  if (!storage || !normalizedItems.length) return [];

  storage.setItem(ACTIVE_ITEMS_KEY, JSON.stringify(normalizedItems));
  storage.setItem(ACTIVE_ITEM_KEY, JSON.stringify(normalizedItems[0]));
  storage.removeItem(CHECKOUT_KEY);
  emitCartChange();
  return normalizedItems;
};

export const calculateStudioTotals = (item: StudioCartItem, discount = 0) => {
  return calculateStudioItemsTotals([item], discount);
};

export const calculateStudioItemsTotals = (
  items: StudioCartItem[],
  discount = 0,
) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.11);
  const shippingFee = 0;
  const adminFee = 2500;
  const grandTotal = Math.max(0, subtotal + tax + shippingFee + adminFee - discount);

  return { subtotal, tax, shippingFee, adminFee, discount, grandTotal };
};

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const saveStudioCheckout = (
  items: StudioCartItem | StudioCartItem[],
  shipping: StudioShippingDetails,
) => {
  const storage = getStorage();
  const normalizedItems = normalizeCartItems(
    Array.isArray(items) ? items : [items],
  );
  if (!storage || !normalizedItems.length) return null;

  const checkout: StudioCheckoutDraft = {
    item: normalizedItems[0],
    items: normalizedItems,
    shipping,
    updatedAt: new Date().toISOString(),
  };

  storage.setItem(ACTIVE_ITEM_KEY, JSON.stringify(normalizedItems[0]));
  storage.setItem(ACTIVE_ITEMS_KEY, JSON.stringify(normalizedItems));
  storage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
  emitPlatformDataChange();
  return checkout;
};

export const readStudioCheckout = (): StudioCheckoutDraft | null => {
  const storage = getStorage();
  if (!storage) return null;

  const checkout = safeParse<Partial<StudioCheckoutDraft>>(storage.getItem(CHECKOUT_KEY));
  const items = normalizeCartItems(
    checkout?.items?.length ? checkout.items : checkout?.item ? [checkout.item] : [],
  );
  if (!checkout?.shipping || !items.length) return null;

  return {
    item: items[0],
    items,
    shipping: checkout.shipping,
    updatedAt: checkout.updatedAt || new Date(0).toISOString(),
  };
};

const createReference = (prefix: string) => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${datePart}-${randomPart}`;
};

export const createStudioOrder = (
  paymentMethod: string,
  discount = 0,
): StudioOrder | null => {
  const storage = getStorage();
  const checkout = readStudioCheckout();
  if (!storage || !checkout) return null;

  const totals = calculateStudioItemsTotals(checkout.items, discount);
  const createdAt = new Date();
  const estimatedArrival = new Date(createdAt);
  estimatedArrival.setDate(estimatedArrival.getDate() + 4);

  const order: StudioOrder = {
    ...checkout,
    ...totals,
    orderNumber: createReference("MS"),
    trackingNumber: createReference("MH"),
    paymentMethod,
    status: "confirmed",
    createdAt: createdAt.toISOString(),
    estimatedArrival: estimatedArrival.toISOString(),
  };

  storage.setItem(ORDER_KEY, JSON.stringify(order));
  const history = readStudioOrders();
  storage.setItem(
    STUDIO_ORDER_HISTORY_KEY,
    JSON.stringify([
      order,
      ...history.filter((item) => item.orderNumber !== order.orderNumber),
    ]),
  );
  emitPlatformDataChange();
  return order;
};

export const storeStudioOrderSnapshot = (order: StudioOrder) => {
  if (typeof window === "undefined") return order;
  try {
    window.sessionStorage.setItem(ORDER_SESSION_KEY, JSON.stringify(order));
  } catch {
    // Order tetap dikembalikan walau browser memblokir sessionStorage.
  }
  return order;
};

const normalizeStudioOrder = (
  record: Partial<StudioOrder> | null | undefined,
): StudioOrder | null => {
  const items = normalizeCartItems(
    record?.items?.length ? record.items : record?.item ? [record.item] : [],
  );

  return record?.shipping &&
    items.length > 0 &&
    typeof record.orderNumber === "string" &&
    typeof record.createdAt === "string"
    ? ({ ...record, item: items[0], items } as StudioOrder)
    : null;
};

export const readStudioOrders = (): StudioOrder[] => {
  const storage = getStorage();
  if (!storage) return [];

  const parsed = safeParse<Partial<StudioOrder>[]>(
    storage.getItem(STUDIO_ORDER_HISTORY_KEY),
  );
  const legacyOrder = safeParse<Partial<StudioOrder>>(storage.getItem(ORDER_KEY));
  const records = Array.isArray(parsed)
    ? parsed
    : legacyOrder
      ? [legacyOrder]
      : [];

  return records
    .map(normalizeStudioOrder)
    .filter((record): record is StudioOrder => record !== null)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
};

export const readStudioOrder = (): StudioOrder | null => {
  if (typeof window === "undefined") return null;
  const sessionOrder = (() => {
    try {
      return normalizeStudioOrder(
        safeParse<Partial<StudioOrder>>(
          window.sessionStorage.getItem(ORDER_SESSION_KEY),
        ),
      );
    } catch {
      return null;
    }
  })();
  if (sessionOrder) return sessionOrder;

  const storage = getStorage();
  if (!storage) return null;

  const latestHistoryOrder = readStudioOrders()[0];
  if (latestHistoryOrder) return latestHistoryOrder;

  return normalizeStudioOrder(
    safeParse<Partial<StudioOrder>>(storage.getItem(ORDER_KEY)),
  );
};

export const getStudioCartCount = () =>
  readStudioCart().reduce((total, item) => total + item.quantity, 0);

export const subscribeToStudioCart = (listener: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(CART_CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};

/**
 * Halaman membeli produk hanya menggunakan fungsi pada modul ini.
 * Saat backend tersedia, implementasi localStorage di modul ini dapat diganti
 * dengan request API tanpa mengubah komponen halaman checkout.
 */
