import { createSlice } from "@reduxjs/toolkit";

const initialState={
    products:[],
    brands:[],
    types:[],
    pagination:{
        currentPage:1,
        totalPages:0,
        totalProducts:0,
        limit:5
    }
};

const adminProductSlice=createSlice({
    name:"adminProduct",

    initialState,

    reducers:{

        //store product
        setProducts:(state,action)=>{
            state.products=action.payload.products||[];
            state.brands = action.payload.brands || [];
            state.types = action.payload.types || [];
            state.pagination=action.payload.pagination||initialState.pagination;
        },

        //add product
        addProduct:(state,action)=>{
            state.products.push(action.payload);
        },

        //update product
        updateProduct:(state,action)=>{
            const index=state.products.findIndex((product)=>product._id===action.payload._id);
            if(index!==-1){
                state.products[index]=action.payload;
            }
        },

        //soft delete
        softDeleteProduct:(state,action)=>{
            const product=state.products.find((product)=>product._id===action.payload);
            if(product){
                product.deleted=true;
            }
        },

        //restore softdeleted product
        restoreProduct:(state,action)=>{
            const product=state.products.find((product)=>product._id===action.payload);
            if(product){
                product.deleted=false;
            }
        },

        permanentDeleteProduct:(state,action)=>{
            state.products=state.products.filter((product)=>product._id!==action.payload);
        }
    }
});

export const{setProducts,addProduct,updateProduct,softDeleteProduct,restoreProduct,permanentDeleteProduct}=adminProductSlice.actions;
export default adminProductSlice.reducer;