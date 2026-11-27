import api from "./api";

export const getOrders=async()=>{
    const response=await api.get("/admin/orders");
    return response.data;
};

export const updateOrder=async(id,status)=>{
    const response=await api.patch(`/admin/orders/${id}/status`,{status});
    return response.data;
};