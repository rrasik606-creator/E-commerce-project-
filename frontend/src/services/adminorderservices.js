import api from "./api";

export const getOrders=async(params)=>{
    const response=await api.get("/admin/orders",{params});
    return response.data;
};

export const updateOrder=async(id,status)=>{
    const response=await api.patch(`/admin/orders/${id}/status`,{status});
    return response.data;
};