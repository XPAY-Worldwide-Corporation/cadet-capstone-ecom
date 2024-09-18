import { create } from "zustand";
import axios from "axios";

interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

interface Merchant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  image: UploadImages[];
  roleId: number;
  password: string;
}

interface MerchantState {
  merchants: Merchant[];
  singleMerchant: Merchant | null;
  loading: boolean;
  error: string | null;
  fetchMerchants: () => void;
  fetchSingleMerchant: (id: number) => void;
  addMerchant: (data: FormData) => void;
  updateMerchant: (id: number, data: FormData) => void;
  deleteMerchant: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/merchants";

export const useMerchantStore = create<MerchantState>((set) => ({
  merchants: [],
  singleMerchant: null,
  loading: false,
  error: null,

  fetchMerchants: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Merchant[] }>(
        BASE_URL,
      );
      const normalizedMerchants = response.data.data.map((merchant) => ({
        ...merchant,
        image: Array.isArray(merchant.image)
          ? merchant.image
          : JSON.parse(merchant.image),
      }));
      set({ merchants: normalizedMerchants, loading: false });
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },

  fetchSingleMerchant: async (id: number) => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Merchant }>(
        `${BASE_URL}/${id}`,
      );
      const normalizedMerchant = {
        ...response.data.data,
        image: Array.isArray(response.data.data.image)
          ? response.data.data.image
          : JSON.parse(response.data.data.image),
      };
      set({ singleMerchant: normalizedMerchant, loading: false });
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },

  addMerchant: async (data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.post<Merchant>(BASE_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        merchants: [...state.merchants, response.data],
        loading: false,
      }));
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },

  updateMerchant: async (id: number, data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.patch<Merchant>(
        `${BASE_URL}/edit/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      set((state) => ({
        merchants: state.merchants.map((merchant) =>
          merchant.id === id ? response.data : merchant,
        ),
        loading: false,
      }));
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },

  deleteMerchant: async (id: number) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        merchants: state.merchants.filter((merchant) => merchant.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const errorDetails = error.response
        ? `${error.response.data.message || "Unknown error occurred"}`
        : error.message || "An error occurred while logging in.";

      set({
        error: errorDetails,
        loading: false,
      });
    }
  },
}));
