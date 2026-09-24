import axios from "axios";

const API_URL="http://localhost:3001/orders";

export const getOrders=async()=>{
    const response=await axios.get(API_URL);
    return response.data;
};

export const updateOrder=async(id,order)=>{
    const response=await axios.patch(
        `${API_URL}/${id}`,order
    );
    return response.data;
};