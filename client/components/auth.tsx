import { useAuthStore } from "@/state/authStore";
import axios from "axios";

export default async function fetchWithAuth(
  url: string,

  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: any,
) {
  const { accessToken } = useAuthStore.getState();

  const isFormData = data instanceof FormData;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  };

  try {
    const response = await axios({
      url,
      method,
      headers,
      data: data,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || error.message);
  }
}
