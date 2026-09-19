import React from "react";
import { Navigate,Outlet } from "react-router-dom";

const AdminProtectedRout=({children})=>{
    const userId=localStorage.getItem("user");
    const userRoll=localStorage.getItem("userRole");

    if(!userId||userRoll!=="admin"){
        return <Navigate to='/login' replace/>;
    }

    return children
}

export default AdminProtectedRout;