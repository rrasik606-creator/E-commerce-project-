
import api from "./api.js";

// Place a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get all orders of logged-in user
export const getMyOrders = async () => {
  const response = await api.get("/orders");
  return response.data.orders;
};

// Get single order
export const getSingleOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.order;
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/cancel`);
  return response.data;
};
