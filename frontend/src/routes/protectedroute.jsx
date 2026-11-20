import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const {user,isLoading}=useSelector((state)=>state.auth);
    
    if(isLoading){
        return <div>Checking authentication...</div>
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "user") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;