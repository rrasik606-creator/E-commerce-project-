import axios from "axios";

const API_URL="http://localhost:3001/orders";

export const getOrder=async()=>{
    const userId=localStorage.getItem("user");

    const response=await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
}

export const updateOrder=async(id,order)=>{
    const response=await axios.patch(`${API_URL}/${id}`,order);
    return response.data;
}