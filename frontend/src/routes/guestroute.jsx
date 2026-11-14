import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
    const userId = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    if (userId && userRole === "admin") {
        return <Navigate to="/admin" replace />;
    }

    if (userId && userRole === "user") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestRoute;