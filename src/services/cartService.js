// import axios from "axios";

// const API_URL="http://localhost:3001/cart";

// // getusercart
// export const getcart=async()=>{
//     const userId=localStorage.getItem("user");

//     const response=await axios.get(`${API_URL}?userId=${userId}`)
//     return response.data;
// }

// //addproducttocart
// export const addCart=async(cartItem)=>{
//     const response=await axios.get(`${API_URL}?userId=${cartItem.userId}&productId=${cartItem.productId}`)
//     const existingItem=response.data[0];

//     if(existingItem){
//         const updated=await axios.patch(`${API_URL}/${existingItem.id}`,{quantity:existingItem.quantity+1})
//         return updated.data
//     }

//     const newItem=await axios.post(API_URL,{...cartItem,quantity:1})
//     return newItem.data
// }

// //updatequantity
// export const updateCart=async(id,quantity)=>{
//     const response=await axios.patch(`${API_URL}/${id}`,{quantity:quantity})
//     return response.data
// }

// //deletecartitem
// export const deleteCart=async(id)=>{
//     const response=await axios.delete(`${API_URL}/${id}`)
//     return response.data
// }




import axios from "axios";

const API_URL = "http://localhost:3001/cart";

// Get user's cart
export const getcart = async () => {
  const userId = localStorage.getItem("user");

  const response = await axios.get(
    `${API_URL}?userId=${userId}`
  );

  if (response.data.length > 0) {
    return response.data[0];
  }

  return null;
};


// Add product to cart
export const addCart = async (cartItem) => {
  const response = await axios.get(
    `${API_URL}?userId=${cartItem.userId}`
  );

  // User already has a cart
  if (response.data.length > 0) {
    const userCart = response.data[0];

    // Check whether product already exists
    const existingItem = userCart.items.find(
      (item) => item.productId === cartItem.productId
    );

    let updatedItems;

    // Product already exists
    if (existingItem) {
      updatedItems = userCart.items.map((item) =>
        item.productId === cartItem.productId
          ? {
              ...item,
              quantity: item.quantity + cartItem.quantity,
            }
          : item
      );
    }

    // Product does not exist
    else {
      updatedItems = [
        ...userCart.items,
        {
          productId: cartItem.productId,
          name: cartItem.name,
          price: cartItem.price,
          image: cartItem.image,
          quantity: cartItem.quantity,
        },
      ];
    }

    // Update database
    const updated = await axios.patch(
      `${API_URL}/${userCart.id}`,
      {
        items: updatedItems,
      }
    );

    return updated.data;
  }

  // User doesn't have a cart
  const newCart = await axios.post(API_URL, {
    userId: cartItem.userId,

    items: [
      {
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        image: cartItem.image,
        quantity: cartItem.quantity,
      },
    ],
  });

  return newCart.data;
};


// Update quantity
export const updateCart = async (
  cartId,
  productId,
  quantity
) => {
  // Get current cart
  const response = await axios.get(
    `${API_URL}/${cartId}`
  );

  const userCart = response.data;

  // Update only the selected product
  const updatedItems = userCart.items.map((item) =>
    item.productId === productId
      ? {
          ...item,
          quantity: quantity,
        }
      : item
  );

  // Save updated items to database
  const updated = await axios.patch(
    `${API_URL}/${cartId}`,
    {
      items: updatedItems,
    }
  );

  return updated.data;
};


// Delete cart item
export const deleteCart = async (
  cartId,
  productId
) => {
  // Get current cart
  const response = await axios.get(
    `${API_URL}/${cartId}`
  );

  const userCart = response.data;

  // Remove selected product
  const updatedItems = userCart.items.filter(
    (item) => item.productId !== productId
  );

  // Save updated items
  const updated = await axios.patch(
    `${API_URL}/${cartId}`,
    {
      items: updatedItems,
    }
  );

  return updated.data;
};