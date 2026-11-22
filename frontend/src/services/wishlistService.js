import api from "./api.js";

export const getWishlist = async () => {
  const response=await api.get("/wishlist");
  return response.data.wishlist;
};

export const addWishlist = async (productId) => {
  const response=await api.post("/wishlist",{productId})
  return response.data.wishlist
};

export const deleteWishlist = async (productId) => {
  const response=await api.delete(`/wishlist/${productId}`);
  return response.data.wishlist
};