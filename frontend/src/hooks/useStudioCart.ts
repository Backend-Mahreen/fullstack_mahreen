import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearStudioCart,
  readStudioCart,
  removeStudioCartItem,
  selectStudioCartItemsForCheckout,
  subscribeToStudioCart,
  updateStudioCartItemQuantity,
} from "../pages/Mahreen-Studio/Purchase/storage";
import type { StudioCartItem } from "../pages/Mahreen-Studio/Purchase/types";

export const useStudioCart = () => {
  const [items, setItems] = useState<StudioCartItem[]>(() => readStudioCart());
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => setItems(readStudioCart()), []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      refresh();
      setIsHydrated(true);
    });
    const unsubscribe = subscribeToStudioCart(refresh);

    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, [refresh]);

  const updateQuantity = useCallback((item: StudioCartItem, quantity: number) => {
    setItems(updateStudioCartItemQuantity(item, quantity));
  }, []);

  const removeItem = useCallback((item: StudioCartItem) => {
    setItems(removeStudioCartItem(item));
  }, []);

  const clear = useCallback(() => {
    clearStudioCart();
    setItems([]);
  }, []);

  const selectForCheckout = useCallback((selectedItems: StudioCartItem[]) => {
    selectStudioCartItemsForCheckout(selectedItems);
  }, []);

  const summary = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return { itemCount, subtotal, total: subtotal };
  }, [items]);

  return {
    items,
    isHydrated,
    summary,
    updateQuantity,
    removeItem,
    clear,
    selectForCheckout,
  };
};
