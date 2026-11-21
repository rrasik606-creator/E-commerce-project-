import api from "./api.js";

export const getAllProducts=async(params={})=>{
    const response = await api.get("/products",{params});
    return response.data.products;
}

export const getSingleProduct=async(id)=>{
    const response=await api.get(`/products/${id}`);
    return response.data.product;
}