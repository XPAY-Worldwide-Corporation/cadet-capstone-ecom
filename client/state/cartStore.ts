import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

interface Product {
  id: number;
  product_name: string;
  isNew: boolean;
  price: number;
  image: UploadImages[];
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  merchantId: number;
  merchant: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

interface CartState {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const customStorage: PersistOptions<CartState, CartState>["storage"] = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,

      addToCart: (product: Product) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.product.id === product.id,
          );

          if (existingItem) {
            return state;
          } else {
            return {
              cartItems: [
                ...state.cartItems,
                {
                  product,
                  quantity: 1,
                  totalPrice: product.price,
                },
              ],
              totalQuantity: state.totalQuantity + 1,
              totalPrice: state.totalPrice + product.price,
            };
          }
        });
      },

      removeFromCart: (productId: number) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.product.id === productId,
          );

          if (existingItem) {
            let newState;
            if (existingItem.quantity > 1) {
              newState = {
                cartItems: state.cartItems.map((item) =>
                  item.product.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity - 1,
                        totalPrice: (item.quantity - 1) * item.product.price,
                      }
                    : item,
                ),
                totalQuantity: state.totalQuantity - 1,
                totalPrice: state.totalPrice - existingItem.product.price,
              };
            } else {
              newState = {
                cartItems: state.cartItems.filter(
                  (item) => item.product.id !== productId,
                ),
                totalQuantity: state.totalQuantity - 1,
                totalPrice: state.totalPrice - existingItem.product.price,
              };
            }
            return newState;
          }
          return state;
        });
      },

      clearCart: () => {
        set({
          cartItems: [],
          totalQuantity: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
      storage: customStorage,
    },
  ),
);
