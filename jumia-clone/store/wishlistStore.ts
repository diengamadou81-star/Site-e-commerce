import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (!state.items.find((i) => i.id === product.id)) {
            return { items: [...state.items, product] };
          }
          return state;
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      isWishlisted: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      toggle: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: "jumia-wishlist" }
  )
);
