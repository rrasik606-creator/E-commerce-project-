import axios from "axios";

const API_URL="http://localhost:3001/users";

export const getUsers =async()=>{
    const response=await axios.get(API_URL);
    return response.data;
}

export const blockUser=async(id)=>{
    const response=await axios.patch(`${API_URL}/${id}`,{blocked:true});
    return response.data
}

export const unblockUser=async(id)=>{
    const response=await axios.patch(`${API_URL}/${id}`,{blocked:false});
    return response.data
}