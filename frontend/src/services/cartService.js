import api from "./api";

export const getcart = async () => {
  const response=await api.get("/cart");
  return response.data.cart;
};

export const addCart = async (cartItem) => {
  const response=await api.post("/cart",{productId:cartItem.productId,quantity:cartItem.quantity||1});
  return response.data.cart;
};

export const updateCart = async (productId,quantity) => {
  const response=await api.patch(`/cart/${productId}`,{quantity});
  return response.data.cart;
};

export const deleteCart = async (productId) => {
    console.log("Service product ID:", productId);

  const response=await api.delete(`/cart/${productId}`);
  return response.data.cart
};