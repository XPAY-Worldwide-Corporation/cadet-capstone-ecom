import { create } from "zustand";
import fetchWithAuth from "@/components/auth"; // Ensure fetchWithAuth is correctly imported or written

interface Transaction {
  id: number;
  customerId: number;
  productIds: number[];
  payment: string;
  status: string;
  productTotal: number;
  createdAt: string;
  updatedAt: string;
  customer: any;
  products: any[];
}

interface TransactionState {
  transactions: Transaction[];
  singleTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: () => void;
  fetchTransactionById: (id: number) => void;
  addTransactionCash: (data: {
    customerId: number;
    productIds: number[];
    payment: string;
    productTotal: number;
  }) => void;
  addTransactionMaya: (data: {
    customerId: number;
    productIds: number[];
    payment: string;
    productTotal: number;
  }) => void;
  updateTransactionStatus: (id: number, status: string) => void;
  deleteTransaction: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/transactions";

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  singleTransaction: null,
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWithAuth(BASE_URL, "GET");
      set({ transactions: data.data, loading: false });
    } catch (error: any) {
      set({ error: error?.message || "An error occurred", loading: false });
    }
  },

  fetchTransactionById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWithAuth(`${BASE_URL}/${id}`, "GET");
      set({ singleTransaction: data.data, loading: false });
    } catch (error: any) {
      set({ error: error?.message || "An error occurred", loading: false });
    }
  },

  addTransactionCash: async (data: {
    customerId: number;
    productIds: number[];
    payment: string;
    productTotal: number;
  }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        BASE_URL,
        "POST",
        JSON.stringify(data),
      );
      set((state) => ({
        transactions: [...state.transactions, response.data.transaction],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error?.message || "An error occurred", loading: false });
    }
  },

  addTransactionMaya: async (data: {
    customerId: number;
    productIds: number[];
    payment: string;
    productTotal: number;
  }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        BASE_URL,
        "POST",
        JSON.stringify(data),
      );

      window.open(response.data.checkoutUrl, "_blank");
      set((state) => ({
        transactions: [...state.transactions, response.data.transaction],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error?.message || "An error occurred", loading: false });
    }
  },

  updateTransactionStatus: async (id: number, status: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/edit/${id}`,
        "PATCH",
        JSON.stringify({ status }),
      );
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? response.data.transaction : transaction,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error?.message || "An error occurred", loading: false });
    }
  },

  deleteTransaction: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await fetchWithAuth(`${BASE_URL}/delete/${id}`, "DELETE");
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== id,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error?.message || "An error occurred", loading: false });
    }
  },
}));
