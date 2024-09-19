import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import axios from "axios";

interface Role {
  id: number;
  roleName: string;
}

interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: UploadImages[];
  address: string;
  verificationCode?: string;
  governmentId?: UploadImages[];
  roleId: number;
  role: Role;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

interface LoginResponse {
  status: boolean;
  data: User;
  meta: {
    accessToken: string;
  };
}

const BASE_URL = "http://localhost:4000/api/v1/auth";

const customStorage: PersistOptions<AuthState, AuthState>["storage"] = {
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      loading: false,
      error: null,

      loginUser: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post<LoginResponse>(
            `${BASE_URL}/login`,
            {
              email,
              password,
            },
          );

          const user = response.data.data;
          const accessToken = response.data.meta.accessToken;

          set({
            user,
            accessToken,
            isLoggedIn: true,
            loading: false,
            error: null,
          });
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

      logoutUser: async () => {
        set({ loading: true, error: null });
        try {
          await axios.post(`${BASE_URL}/logout`);

          set({
            user: null,
            accessToken: null,
            isLoggedIn: false,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          const errorDetails = error.response
            ? `${error.response.data.message || "Unknown error occurred"}`
            : error.message || "An error occurred while logging out.";

          set({
            error: errorDetails,
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: customStorage,
    },
  ),
);
