import axios from "axios";

const API_URL="http://localhost:3001/products";

// get product
export const getProduct=async()=>{
    const response=await axios.get(API_URL);
    return response.data;
};

//add product
export const addProduct=async(product)=>{
    const response=await axios.post(API_URL,product);
    return response.data;
};

//update product
export const updateProduct=async(id,product)=>{
    const response=await axios.patch(`${API_URL}/${id}`,product);
    return response.data;
};

//soft delete product
export const softDeleteProduct=async(id)=>{
    const response=await axios.patch(`${API_URL}/${id}`,{deleted:true});
    return response.data;
};

//restore product
export const restoreProduct=async(id)=>{
    const response=await axios.patch(`${API_URL}/${id}`,{deleted:false});
    return response.data;
};

//permenent delete product
export const permanentDeleteProduct=async(id)=>{
    const response=await axios.delete(`${API_URL}/${id}`);
    return response.data;
};