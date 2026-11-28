
import api from "./api";

export const getProduct = async (params) => {
    const response = await api.get("/admin/products", { params });
    return response.data;
};

export const getDeletedProducts = async (params) => {
    const response = await api.get("/admin/products/deleted", { params });
    return response.data;
};

export const addProduct = async (product) => {
    const response = await api.post("/admin/products", product);
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await api.patch(`/admin/products/${id}`, product);
    return response.data;
};

export const softDeleteProduct = async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
};

export const restoreProduct = async (id) => {
    const response = await api.patch(`/admin/products/${id}/restore`);
    return response.data;
};

export const permanentDeleteProduct = async (id) => {
    const response = await api.delete(`/admin/products/${id}/permanent`);
    return response.data;
};
