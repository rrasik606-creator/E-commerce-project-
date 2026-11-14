import { createSlice } from "@reduxjs/toolkit";

const initialState={
    orders:[],
};

const adminOrderSlice=createSlice({
    name:"adminOrder",
    initialState,
    reducers:{
        setOrders:(state,action)=>{
            state.orders=action.payload;
        },

        updateOrder:(state,action)=>{
            const index=state.orders.findIndex(
                (oreder)=>oreder.id===action.payload.id
                );

            if(index!==-1){
                state.orders[index]=action.payload;
            }    
        },
    },
});

export const{setOrders,updateOrder}=adminOrderSlice.actions
export default adminOrderSlice.reducer;