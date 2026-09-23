import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authslice';
import cartReducer from './slices/cartslice'
import wishlistReducer from './slices/wishlistslice';
import adminProductReducer from './slices/adminproductslice';
import adminUserReducer from './slices/adminuserslice';

const store=configureStore({
    reducer:{

        auth:authReducer,

        cart:cartReducer,

        wishlist:wishlistReducer,

        adminProduct:adminProductReducer,

        adminUser:adminUserReducer,

    }
});
export default store;