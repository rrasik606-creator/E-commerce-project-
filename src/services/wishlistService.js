import axios from "axios";

const API_URL = "http://localhost:3001/wishlist";

// Get wishlist
export const getWishlist = async () => {
  const userId = localStorage.getItem("user");

  const response = await axios.get(
    `${API_URL}?userId=${userId}`
  );

  if (response.data.length > 0) {
    return response.data[0];
  }

  return null;
};

// Add product to wishlist
export const addWishlist = async (wishlistItem) => {
  const response = await axios.get(
    `${API_URL}?userId=${wishlistItem.userId}`
  );

  // Wishlist already exists
  if (response.data.length > 0) {
    const userWishlist = response.data[0];

    // Check product already exists
    const existingItem = userWishlist.items.find(
      (item) =>
        String(item.productId) ===
        String(wishlistItem.productId)
    );

    // check duplicate
    if (existingItem) {
      return userWishlist;
    }

    const updatedItems = [
      ...userWishlist.items,
      {
        productId: String(wishlistItem.productId),
        name: wishlistItem.name,
        brand: wishlistItem.brand,
        price: wishlistItem.price,
        image: wishlistItem.image,
      },
    ];

    const updated = await axios.patch(
      `${API_URL}/${userWishlist.id}`,
      {
        items: updatedItems,
      }
    );

    return updated.data;
  }

  // Create new wishlist
  const newWishlist = await axios.post(API_URL, {
    userId: wishlistItem.userId,
    items: [
      {
        productId: String(wishlistItem.productId),
        name: wishlistItem.name,
        brand: wishlistItem.brand,
        price: wishlistItem.price,
        image: wishlistItem.image,
      },
    ],
  });

  return newWishlist.data;
};

// Delete product from wishlist
export const deleteWishlist = async (
  wishlistId,
  productId
) => {
  const response = await axios.get(
    `${API_URL}/${wishlistId}`
  );

  const userWishlist = response.data;

  const updatedItems = userWishlist.items.filter(
    (item) =>
      String(item.productId) !==
      String(productId)
  );

  const updated = await axios.patch(
    `${API_URL}/${wishlistId}`,
    {
      items: updatedItems,
    }
  );

  return updated.data;
};