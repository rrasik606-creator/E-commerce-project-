import { createSlice } from "@reduxjs/toolkit";

const initialState={
    users:[],
    pagination:{
        currentPage:1,
        totalPages:0,
        totalUsers:0,
        limit:5
    }
};

const adminUserSlice=createSlice({
    name:"adminUser",
    initialState,
    reducers:{

        setUsers:(state,action)=>{
            state.users=action.payload.users;
            state.pagination=action.payload.pagination
        },
        blockUser:(state,action)=>{
            const user=state.users.find((user)=>user._id===action.payload);
            if(user){
                user.blocked=true;
            }
        },
        unblockUser:(state,action)=>{
            const user=state.users.find((user)=>user._id===action.payload);
            if(user){
                user.blocked=false
            }
        }
    }
});

export const {setUsers,blockUser,unblockUser}=adminUserSlice.actions;
export default adminUserSlice.reducer;