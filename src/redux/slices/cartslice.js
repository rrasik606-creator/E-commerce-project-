// import { createSlice } from "@reduxjs/toolkit";

// const initialState={
//     cart:[],
//     cartCount:0
// };

// const cartSlice=createSlice({
//     name:"cart",
//     initialState,
//     reducers:{
//         setCart:(state,action)=>{
//             state.cart=action.payload;
//             state.cartCount=action.payload.reduce((total,item)=>total+item.quantity,0);
//         },

//         clearCart:(state)=>{
//             state.cart=[];
//             state.cartCount=0;
//         }
//     }
// });

// export const{setCart,clearCart}=cartSlice.actions;
// export default cartSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cartCount: 0,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;

      state.cartCount = action.payload.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;