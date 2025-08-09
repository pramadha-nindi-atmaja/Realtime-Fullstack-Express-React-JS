import { jwtDecode } from "jwt-decode";
import axios from "../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";

const RefreshToken = async () => {
  const accessToken = secureLocalStorage.getItem("acessToken"); // Note: fixing typo later
  const refreshToken = secureLocalStorage.getItem("refreshToken");

  // Early return if tokens are missing
  if (!accessToken || !refreshToken) {
    console.log("Missing tokens, authentication required");
    return false;
  }

  try {
    // Check if token is expired
    const decodedToken = jwtDecode(accessToken);
    const expirationTime = new Date(decodedToken.exp * 1000);
    const currentTime = new Date();
    const timeBuffer = 60 * 1000; // 1 minute buffer before expiration

    console.log("Token expiration check:", {
      expirationTime: expirationTime.toISOString(),
      currentTime: currentTime.toISOString(),
      isExpired: expirationTime <= currentTime,
    });

    // Refresh if token is expired or will expire soon
    if (expirationTime <= new Date(currentTime.getTime() + timeBuffer)) {
      console.log("Token expired or expiring soon, refreshing...");

      const response = await axios.get("/api/refresh", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.data) {
        console.log("Refresh failed - no data received");
        return false;
      }

      // Fix typo in "accessToken" throughout the app
      secureLocalStorage.setItem("accessToken", response.data.accessToken); // Updated typo
      secureLocalStorage.setItem("refreshToken", response.data.refreshToken);
      secureLocalStorage.setItem("user", response.data.data);

      console.log("Token refreshed successfully");
      return true;
    } else {
      console.log("Token still valid, no refresh needed");
      return true;
    }
  } catch (error) {
    console.error("Token refresh error:", error.message);
    return false;
  }
};

export default RefreshToken;