import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRout = ({ children }) => {
    const {user,isLoading}=useSelector((state)=>state.auth);
    if(isLoading){
        return <div>Checkin authentication...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectedRout;