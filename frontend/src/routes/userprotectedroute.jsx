import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProtectedRoute = ({ children }) => {
    const {user,isLoading}=useSelector((state)=>state.auth);
    
    if(isLoading){
        return <div>Checking authentication...</div>
    }
    if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default UserProtectedRoute;