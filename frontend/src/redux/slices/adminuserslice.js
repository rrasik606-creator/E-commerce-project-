import { createSlice } from "@reduxjs/toolkit";

const initialState={
    users:[],
};

const adminUserSlice=createSlice({
    name:"adminUser",
    initialState,
    reducers:{

        setUsers:(state,action)=>{
            state.users=action.payload
        },
        blockUser:(state,action)=>{
            const user=state.users.find((user)=>user.id===action.payload);
            if(user){
                user.blocked=true;
            }
        },
        unblockUser:(state,action)=>{
            const user=state.users.find((user)=>user.id===action.payload);
            if(user){
                user.blocked=false
            }
        }
    }
});

export const {setUsers,blockUser,unblockUser}=adminUserSlice.actions;
export default adminUserSlice.reducer;