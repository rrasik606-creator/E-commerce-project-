import React from "react";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default UserProtectedRoute;