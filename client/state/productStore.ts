import { create } from "zustand";
import fetchWithAuth from "@/components/auth";

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

interface ProductState {
  products: Product[];
  singleProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
  fetchSingleProduct: (id: number) => void;
  addProduct: (data: FormData) => void;
  updateProduct: (id: number, data: FormData, callback?: () => void) => void;
  deleteProduct: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/products";

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  singleProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetchWithAuth(BASE_URL, "GET");
      const normalizedProducts = response.data.map((product: Product) => ({
        ...product,
        image: Array.isArray(product.image)
          ? product.image
          : JSON.parse(product.image),
      }));
      set({ products: normalizedProducts, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "An error occurred while fetching products.",
        loading: false,
      });
    }
  },

  fetchSingleProduct: async (id: number) => {
    set({ loading: true });
    try {
      const response = await fetchWithAuth(`${BASE_URL}/${id}`, "GET");
      const normalizedProduct = {
        ...response.data,
        image: Array.isArray(response.data.image)
          ? response.data.image
          : JSON.parse(response.data.image),
      };
      set({ singleProduct: normalizedProduct, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "An error occurred while fetching the product.",
        loading: false,
      });
    }
  },

  addProduct: async (data: FormData) => {
    set({ loading: true });
    try {
      const response = await fetchWithAuth(BASE_URL, "POST", data);
      set((state) => ({
        products: [...state.products, response.data],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "An error occurred while adding the product.",
        loading: false,
      });
    }
  },

  updateProduct: async (id: number, data: FormData, callback?: () => void) => {
    set({ loading: true });
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/edit/${id}`,
        "PATCH",
        data,
      );
      const updatedProduct = {
        ...response.data,
        image: Array.isArray(response.data.image)
          ? response.data.image
          : JSON.parse(response.data.image),
      };
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product,
        ),
        singleProduct:
          state.singleProduct?.id === id ? updatedProduct : state.singleProduct,
        loading: false,
      }));
      if (callback) callback();

      get().fetchSingleProduct(id);
    } catch (error: any) {
      set({
        error: error.message || "An error occurred while updating the product.",
        loading: false,
      });
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true });
    try {
      await fetchWithAuth(`${BASE_URL}/delete/${id}`, "DELETE");
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "An error occurred while deleting the product.",
        loading: false,
      });
    }
  },
}));
