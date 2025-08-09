import axios from "axios";
import RefreshToken from "./RefreshToken.jsx";
import secureLocalStorage from "react-secure-storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
});

// Request interceptor to attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = secureLocalStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await RefreshToken();

        // Update access token in originalRequest
        originalRequest.headers["Authorization"] = `Bearer ${secureLocalStorage.getItem("accessToken")}`;

        // Retry the request that previously failed
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error
        console.error("Error refreshing token:", refreshError);
        throw refreshError;
      }
    } else if (!error.response) {
      // Handle network or other unknown errors
      console.error("Network or unknown error:", error);
    }
    throw error;
  }
);

export default api;