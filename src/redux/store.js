import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authslice';
import cartReducer from './slices/cartslice'
import wishlistReducer from './slices/wishlistslice';

const store=configureStore({
    reducer:{
        auth:authReducer,
        cart:cartReducer,
        wishlist:wishlistReducer,
    }
});
export default store;