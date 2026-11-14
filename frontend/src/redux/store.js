import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authslice';
import cartReducer from './slices/cartslice'
import wishlistReducer from './slices/wishlistslice';
import adminProductReducer from './slices/adminproductslice';
import adminUserReducer from './slices/adminuserslice';
import adminOrderReducer from './slices/adminordersslice';

const store=configureStore({
    reducer:{

        auth:authReducer,

        cart:cartReducer,

        wishlist:wishlistReducer,

        adminProduct:adminProductReducer,

        adminUser:adminUserReducer,

        adminOrder:adminOrderReducer,

    }
});
export default store;