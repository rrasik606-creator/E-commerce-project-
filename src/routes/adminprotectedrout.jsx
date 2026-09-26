import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRout = ({ children }) => {
    const userId = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectedRout;