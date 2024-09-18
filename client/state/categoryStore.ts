import { create } from "zustand";
import fetchWithAuth from "@/components/auth";

interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  singleCategory: Category | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => void;
  fetchSingleCategory: (id: number) => void;
  addCategory: (data: { name: string } | FormData) => void;
  updateCategory: (id: number, data: { name: string } | FormData) => void;
  deleteCategory: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/categories";

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  singleCategory: null,
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await fetchWithAuth(BASE_URL, "GET");
      set({ categories: data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSingleCategory: async (id: number) => {
    set({ loading: true });
    try {
      const data = await fetchWithAuth(`${BASE_URL}/${id}`, "GET");
      set({ singleCategory: data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addCategory: async (data: { name: string } | FormData) => {
    set({ loading: true });

    try {
      const isFormData = data instanceof FormData;
      const response = await fetchWithAuth(
        BASE_URL,
        "POST",
        isFormData ? data : JSON.stringify(data),
      );

      set((state) => ({
        categories: [...state.categories, response.data],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateCategory: async (id: number, data: { name: string } | FormData) => {
    set({ loading: true });

    try {
      const isFormData = data instanceof FormData;
      const response = await fetchWithAuth(
        `${BASE_URL}/edit/${id}`,
        "PATCH",
        isFormData ? data : JSON.stringify(data),
      );

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? response.data : category,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteCategory: async (id: number) => {
    set({ loading: true });
    try {
      await fetchWithAuth(`${BASE_URL}/delete/${id}`, "DELETE");
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
