import { create } from "zustand";
import { Api } from "../services/api-client";
import { getCartDetails } from "../lib";
import { CartStateItem } from "../lib/get-cart-details";
import { CreateCartItemValues } from "../services/dto/cart.dto";


export interface CartState {
    loading: boolean;
    error: boolean;
    totalAmount: number;
    items: CartStateItem[];

    /*отримання товарів з корзини */
    fetchCartItems: () => Promise<void>;
    /*запит на оновлення кілкості товарів */
    updateItemQuantity: (id: number, quantity: number) => Promise<void>;
    /*запит на додавання товару в корзину */
    addCartItem: (values: any) => Promise<void>;
    /*запит на видалення товару з корзини */
    removeCartItem: (id: number) => Promise<void>;
  }
  export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    error: false,
    loading: true,
    totalAmount: 0,

    fetchCartItems: async () => {
        try {
          set({ loading: true, error: false });
          const data = await Api.cart.gethCart();
          set(getCartDetails(data));
        } catch (error) {
          console.error(error);
          set({ error: true });
        } finally {
          set({ loading: false });
        }
      },

      removeCartItem: async (id: number) => {
        try {
          set((state) => ({
            loading: true,
            error: false,
            items: state.items.map((item) => (item.id === id ? { ...item, disabled: true } : item)),
          }));
          const data = await Api.cart.removeCartItem(id);
          set(getCartDetails(data));
        } catch (error) {
          console.error(error);
          set({ error: true });
        } finally {
          set((state) => ({
            loading: false,
            items: state.items.map((item) => ({ ...item, disabled: false })),
          }));
        }
      },

      updateItemQuantity: async (id:number, quantity:number) => {
        try {
          set({ loading: true, error: false });
          const data = await Api.cart.updateItemQuantity(id, quantity);
          set(getCartDetails(data));
        } catch (error) {
          console.error(error);
          set({ error: true });
        } finally {
          set({ loading: false });
        }
      },
      addCartItem: async (values:CreateCartItemValues) => {
        try {
          set({ loading: true, error: false });
          const data = await Api.cart.addCartItem(values);
          set(getCartDetails(data));
        } catch (error) {
          console.error(error);
          set({ error: true });
        } finally {
          set({ loading: false });
        }
      },
  }));