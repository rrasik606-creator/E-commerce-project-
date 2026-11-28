import api from "./api";

export const getDashboardStats = async (period) => {
    const response = await api.get("/admin/dashboard", {
        params: { period }
    });

    return response.data;
};
