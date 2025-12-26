import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    namePl: string;
    image?: string;
    pricePer100g: number;
  };
  weight: number; // in grams
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem['product'], weight: number) => void;
  removeItem: (itemId: string) => void;
  updateItemWeight: (itemId: string, weight: number) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, weight) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.productId === product.id && item.weight === weight
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${weight}-${Date.now()}`,
            productId: product.id,
            product,
            weight,
            quantity: 1,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateItemWeight: (itemId, weight) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, weight } : item
          ),
        });
      },

      updateItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = (item.product.pricePer100g / 100) * item.weight * item.quantity;
          return total + price;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'pan-zelek-cart',
    }
  )
);
