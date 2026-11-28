import { createSlice } from "@reduxjs/toolkit";

const initialState={
    orders:[],
    pagination:{
        currentPage:1,
        totalPages:0,
        totalOrders:0,
        limit:5
    }
};

const adminOrderSlice=createSlice({
    name:"adminOrder",
    initialState,
    reducers:{
        setOrders:(state,action)=>{
            state.orders=action.payload.orders;
            state.pagination=action.payload.pagination;
        },

        updateOrder:(state,action)=>{
            const index=state.orders.findIndex(
                (order)=>order._id===action.payload._id
                );

            if(index!==-1){
                state.orders[index]=action.payload;
            }    
        },
    },
});

export const{setOrders,updateOrder}=adminOrderSlice.actions
export default adminOrderSlice.reducer;