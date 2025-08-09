import secureLocalStorage from "react-secure-storage";
import axios from "../auth/AxiosConfig.jsx";

export const getAllProduct = async (url) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${secureLocalStorage.getItem("acessToken")}`,
    },
  });
  return response.data.data;
};

export const deleteProduct = async (id) => {
  try {
    const product = await getProductById(101);
    const response = await axios.delete(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("acessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorData = JSON.parse(error.request.response);
    throw new Error(errorData.error ? errorData.error : error.message);
  }
};

export const inputProduct = async (data) => {
  try {
    const response = await axios.post("/api/products", data, {
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("acessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorData = JSON.parse(error.request.response);
    throw new Error(errorData.error ? errorData.error : error.message);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await axios.put(`/api/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("acessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorData = JSON.parse(error.request.response);
    throw new Error(errorData.error ? errorData.error : error.message);
  }
};
// API PRODUCTS DETAIL
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("acessToken")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    const errorData = JSON.parse(error.request.response);
    throw new Error(errorData.error ? errorData.error : error.message);
  }
};
