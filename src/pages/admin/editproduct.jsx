import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../../components/productform";

import {
    getProduct,
    updateProduct
} from "../../services/adminproductservices";

import {
    updateProduct as updateProductRedux
} from "../../redux/slices/adminproductslice";

const EditProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState(null);

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const products = await getProduct();

                const product = products.find(
                    (product) => product.id === id
                );

                if (!product) {
                    navigate("/admin/product");
                    return;
                }

                setFormData({
                    name: product.name || "",
                    brand: product.brand || "",
                    category: product.category || "",
                    type: product.type || "",
                    price: product.price || "",
                    originalPrice: product.originalPrice || "",
                    discount: product.discount || "",
                    rating: product.rating || "",
                    reviews: product.reviews || "",

                    image1: product.image?.[0] || "",
                    image2: product.image?.[1] || "",
                    image3: product.image?.[2] || "",
                    image4: product.image?.[3] || "",

                    description: product.description || "",

                    features: Array.isArray(product.features)
                        ? product.features.join(", ")
                        : product.features || "",

                    stock: product.stock || "",

                    featured: product.featured || false,
                    isNew: product.isNew || false
                });

            } catch (error) {

                console.log(error);

            }
        };

        fetchProduct();

    }, [id, navigate]);


    const handleSubmit = async (formData) => {

        try {

            const updatedProduct = {
                name: formData.name,
                brand: formData.brand,
                category: formData.category,
                type: formData.type,

                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                discount: Number(formData.discount),

                rating: Number(formData.rating),
                reviews: Number(formData.reviews),

                image: [
                    formData.image1,
                    formData.image2,
                    formData.image3,
                    formData.image4
                ],

                description: formData.description,

                features: formData.features
                    .split(",")
                    .map((feature) => feature.trim())
                    .filter(Boolean),

                stock: Number(formData.stock),

                featured: formData.featured,
                isNew: formData.isNew
            };

            const data = await updateProduct(
                id,
                updatedProduct
            );

            dispatch(updateProductRedux(data));

            navigate("/admin/product");

        } catch (error) {

            console.log(error);

        }
    };


    if (!formData) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-5xl mx-auto">

                    <p>Loading product...</p>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-2xl font-bold mb-6">
                    Edit Product
                </h1>

                <div className="bg-white rounded-lg shadow p-6">

                    <ProductForm
                        initialData={formData}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/admin/product")}
                        buttonText="Update Product"
                    />

                </div>

            </div>

        </div>
    );
};

export default EditProduct;