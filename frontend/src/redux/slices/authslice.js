import {createSlice} from '@reduxjs/toolkit';

const initialState={
    user:null,
    isLoggedIn:false,
    isLoading:true
};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.user=action.payload.user;
            state.isLoggedIn=true;
        },
        logout:(state)=>{
            state.user=null;
            state.isLoggedIn=false;
        },
        setUser:(state,action)=>{
            state.user=action.payload;
            state.isLoggedIn=true;
        },
        setAuthLoading:(state,action)=>{
            state.isLoading=action.payload;
        }
    }
});

export const {login,logout,setUser,setAuthLoading}=authSlice.actions;
export default authSlice.reducer;