import axios from "../auth/AxiosConfig.jsx";

export const getAllOrders = async () => {
  const response = await axios.get("/api/orders");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`/api/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post("/api/orders", orderData);
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await axios.put(`/api/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`/api/orders/${id}`);
  return response.data;
};