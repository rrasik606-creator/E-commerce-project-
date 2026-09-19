import {createSlice} from '@reduxjs/toolkit';

const initialState={
    user:null,
    isLoggedIn:false,
    sessionId:null
};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.user=action.payload.user;
            state.sessionId=action.payload.sessionId
            state.isLoggedIn=true;
        },
        logout:(state,action)=>{
            state.user=null;
            state.sessionId=null
            state.isLoggedIn=false;
        },
        setUser:(state,action)=>{
            state.user=action.payload;
            state.isLoggedIn=true;
        }
    }
});

export const {login,logout,setUser}=authSlice.actions;
export default authSlice.reducer;