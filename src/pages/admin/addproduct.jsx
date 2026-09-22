import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ProductForm from "../../components/productform";

import { addProduct } from "../../services/adminproductservices";
import {
    addProduct as addProductRedux
} from "../../redux/slices/adminproductslice";

const AddProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialData = {
        name: "",
        brand: "",
        category: "",
        type: "",
        price: "",
        originalPrice: "",
        discount: "",
        rating: "",
        reviews: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        description: "",
        features: "",
        stock: "",
        featured: false,
        isNew: false
    };

    const handleSubmit = async (formData) => {

        try {

            const newProduct = {
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
                isNew: formData.isNew,
                deleted: false
            };

            const data = await addProduct(newProduct);

            dispatch(addProductRedux(data));

            navigate("/admin/product");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-2xl font-bold mb-6">
                    Add Product
                </h1>

                <div className="bg-white rounded-lg shadow p-6">

                    <ProductForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        onCancel={()=>navigate("/admin/product")}
                        buttonText="Add Product"
                    />

                </div>

            </div>

        </div>
    );
};

export default AddProduct;