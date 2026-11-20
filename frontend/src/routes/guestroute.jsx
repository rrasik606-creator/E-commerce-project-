import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
    const {user,isLoading}=useSelector((state)=>state.auth);

    if(isLoading){
        return <div>Checking authentication...</div>
    }
    
    if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    if (user?.role === "user") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestRoute;