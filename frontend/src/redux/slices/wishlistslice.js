import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  wishlistCount: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;

      state.wishlistCount =
        action.payload.length;
    },

    clearWishlist: (state) => {
      state.wishlist = [];
      state.wishlistCount = 0;
    },
  },
});

export const {
  setWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;