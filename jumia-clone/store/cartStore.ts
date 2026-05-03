import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedStorage?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, options?: Partial<CartItem>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  promoCode: string;
  promoDiscount: number;
  applyPromoCode: (code: string) => boolean;
}

const PROMO_CODES: Record<string, number> = {
  "JUMIA20": 20,
  "BIENVENUE": 15,
  "DAKAR10": 10,
  "AFRICA25": 25,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      promoDiscount: 0,

      addItem: (product, quantity = 1, options = {}) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity, ...options }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: "", promoDiscount: 0 }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        const subtotal = get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const discount = get().promoDiscount;
        return subtotal - (subtotal * discount) / 100;
      },

      applyPromoCode: (code: string) => {
        const discount = PROMO_CODES[code.toUpperCase()];
        if (discount) {
          set({ promoCode: code.toUpperCase(), promoDiscount: discount });
          return true;
        }
        return false;
      },
    }),
    { name: "jumia-cart" }
  )
);
