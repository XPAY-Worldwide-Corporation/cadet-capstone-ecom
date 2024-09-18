import { create } from "zustand";
import axios from "axios";

interface Role {
  id: number;
  roleName: string;
}

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  fetchRoles: () => void;
}

const BASE_URL = "http://localhost:4000/api/v1/roles";

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<{ status: boolean; data: Role[] }>(
        BASE_URL,
      );
      set({ roles: response.data.data, loading: false });
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
