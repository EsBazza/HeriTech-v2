// HeriTech — Product Store
// Marketplace state: products, cart, orders.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Order } from "@/lib/types";
import { PRODUCTS } from "@/lib/mock-data";

interface ProductState {
  products: Product[];
  orders: Order[];
  cart: string[]; // product IDs
  addProduct: (product: Product) => void;
  buyProduct: (productId: string, buyerId: string) => Order;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      orders: [],
      cart: [],

      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),

      buyProduct: (productId: string, buyerId: string): Order => {
        const order: Order = {
          id: `ORD-${Date.now()}`,
          productId,
          buyerId,
          purchasedAt: new Date().toISOString(),
          walletPassId: `HT-${Math.floor(Math.random() * 900) + 100}-AX`,
        };
        set((state) => ({
          orders: [order, ...state.orders],
          // Decrement stock
          products: state.products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p,
          ),
        }));
        return order;
      },

      addToCart: (productId) =>
        set((state) => ({
          cart: state.cart.includes(productId)
            ? state.cart
            : [...state.cart, productId],
        })),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((id) => id !== productId),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "heritech-products" },
  ),
);
