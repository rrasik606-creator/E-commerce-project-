import React from "react";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {

    const userId = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default UserProtectedRoute;