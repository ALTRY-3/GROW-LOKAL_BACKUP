import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Item Interface
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artistName: string;
  maxStock: number;
}

// Cart Store Interface
interface CartStore {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateTotals: () => void;
  mergeCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      itemCount: 0,
      isLoading: false,
      error: null,

      // Calculate subtotal and item count
      calculateTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const itemCount = items.reduce((total, item) => total + item.quantity, 0);
        set({ subtotal, itemCount });
      },

      // Fetch cart from API
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/cart');
          const data = await response.json();

          if (data.success) {
            set({
              items: data.data.items || [],
              subtotal: data.data.subtotal || 0,
              isLoading: false,
            });
            get().calculateTotals();
          } else {
            throw new Error(data.message || 'Failed to fetch cart');
          }
        } catch (error: any) {
          console.error('Error fetching cart:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Add item to cart
      addItem: async (productId: string, quantity: number = 1) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
          });

          const data = await response.json();

          if (data.success) {
            set({
              items: data.data.items || [],
              subtotal: data.data.subtotal || 0,
              isLoading: false,
            });
            get().calculateTotals();
            
            // Success notification could be added here
            return Promise.resolve();
          } else {
            throw new Error(data.message || 'Failed to add item to cart');
          }
        } catch (error: any) {
          console.error('Error adding to cart:', error);
          set({ error: error.message, isLoading: false });
          return Promise.reject(error);
        }
      },

      // Update item quantity
      updateQuantity: async (productId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
          });

          const data = await response.json();

          if (data.success) {
            set({
              items: data.data.items || [],
              subtotal: data.data.subtotal || 0,
              isLoading: false,
            });
            get().calculateTotals();
          } else {
            throw new Error(data.message || 'Failed to update cart');
          }
        } catch (error: any) {
          console.error('Error updating cart:', error);
          set({ error: error.message, isLoading: false });
          // Revert to previous state by refetching
          get().fetchCart();
        }
      },

      // Remove item from cart
      removeItem: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
          });

          const data = await response.json();

          if (data.success) {
            set({
              items: data.data.items || [],
              subtotal: data.data.subtotal || 0,
              isLoading: false,
            });
            get().calculateTotals();
          } else {
            throw new Error(data.message || 'Failed to remove item');
          }
        } catch (error: any) {
          console.error('Error removing item:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE',
          });

          const data = await response.json();

          if (data.success) {
            set({
              items: [],
              subtotal: 0,
              itemCount: 0,
              isLoading: false,
            });
          } else {
            throw new Error(data.message || 'Failed to clear cart');
          }
        } catch (error: any) {
          console.error('Error clearing cart:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Merge guest cart with user cart after login
      mergeCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/cart/merge', {
            method: 'POST',
          });

          const data = await response.json();

          if (data.success) {
            set({
              items: data.data.items || [],
              subtotal: data.data.subtotal || 0,
              isLoading: false,
            });
            get().calculateTotals();
          } else {
            // If merge fails, just fetch the user's cart
            await get().fetchCart();
          }
        } catch (error: any) {
          console.error('Error merging cart:', error);
          // Fallback to fetching cart
          await get().fetchCart();
        }
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({
        // Only persist items and subtotal
        items: state.items,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
      }),
    }
  )
);
