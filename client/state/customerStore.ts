import { create } from "zustand";
import axios from "axios";

interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  image: UploadImages[];
  verificationCode?: string;
  government_id?: UploadImages[];
  roleId: number;
  password: string;
}

interface CustomerState {
  customers: Customer[];
  singleCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  fetchCustomers: () => void;
  fetchSingleCustomer: (id: number) => void;
  addCustomer: (data: FormData) => void;
  updateCustomer: (id: number, data: FormData) => void;
  deleteCustomer: (id: number) => void;
}

const BASE_URL = "http://localhost:4000/api/v1/customers";

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  singleCustomer: null,
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Customer[] }>(
        BASE_URL,
      );
      const normalizedCustomers = response.data.data.map((customer) => ({
        ...customer,
        image: Array.isArray(customer.image)
          ? customer.image
          : JSON.parse(customer.image),
        government_id: customer.government_id
          ? Array.isArray(customer.government_id)
            ? customer.government_id
            : JSON.parse(customer.government_id)
          : [],
      }));
      set({ customers: normalizedCustomers, loading: false });
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

  fetchSingleCustomer: async (id: number) => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Customer }>(
        `${BASE_URL}/${id}`,
      );
      const normalizedCustomer = {
        ...response.data.data,
        image: Array.isArray(response.data.data.image)
          ? response.data.data.image
          : JSON.parse(response.data.data.image),
        government_id: response.data.data.government_id
          ? Array.isArray(response.data.data.government_id)
            ? response.data.data.government_id
            : JSON.parse(response.data.data.government_id)
          : [],
      };
      set({ singleCustomer: normalizedCustomer, loading: false });
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

  addCustomer: async (data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.post<Customer>(BASE_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        customers: [...state.customers, response.data],
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

  updateCustomer: async (id: number, data: FormData) => {
    set({ loading: true });
    try {
      const response = await axios.patch<Customer>(
        `${BASE_URL}/edit/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? response.data : customer,
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

  deleteCustomer: async (id: number) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
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
