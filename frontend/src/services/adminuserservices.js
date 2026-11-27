import api from "./api.js";

export const getUsers =async(params)=>{
    const response=await api.get("/admin/users",{params});
    return response.data;
}

export const blockUser=async(id)=>{
    const response=await api.patch(`/admin/users/${id}/block`);
    return response.data;
}

export const unblockUser=async(id)=>{
    const response=await api.patch(`/admin/users/${id}/unblock`);
    return response.data
}