import React, { useEffect, useState } from "react";

const ProductForm = ({
    initialData,
    onSubmit,
    onCancel,
    buttonText = "Add Product"
}) => {

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    // Used for Edit Product
    // when initialData changes after API data is loaded
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validateForm = () => {

        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!formData.brand.trim()) {
            newErrors.brand = "Brand is required";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (!formData.type) {
            newErrors.type = "Type is required";
        }

        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (Number(formData.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (!formData.originalPrice) {
            newErrors.originalPrice = "Original price is required";
        } else if (Number(formData.originalPrice) <= 0) {
            newErrors.originalPrice =
                "Original price must be greater than 0";
        }

        if (!formData.discount) {
            newErrors.discount = "Discount is required";
        } else if (
            Number(formData.discount) < 0 ||
            Number(formData.discount) > 100
        ) {
            newErrors.discount =
                "Discount must be between 0 and 100";
        }

        if (!formData.rating) {
            newErrors.rating = "Rating is required";
        } else if (
            Number(formData.rating) < 0 ||
            Number(formData.rating) > 5
        ) {
            newErrors.rating =
                "Rating must be between 0 and 5";
        }

        if (!formData.reviews) {
            newErrors.reviews = "Reviews is required";
        } else if (Number(formData.reviews) < 0) {
            newErrors.reviews =
                "Reviews cannot be negative";
        }

        if (!formData.image1.trim()) {
            newErrors.image1 = "Image 1 is required";
        }

        if (!formData.image2.trim()) {
            newErrors.image2 = "Image 2 is required";
        }

        if (!formData.image3.trim()) {
            newErrors.image3 = "Image 3 is required";
        }

        if (!formData.image4.trim()) {
            newErrors.image4 = "Image 4 is required";
        }

        if (!formData.description.trim()) {
            newErrors.description =
                "Description is required";
        }

        if (!formData.features.trim()) {
            newErrors.features =
                "Features are required";
        }

        if (!formData.stock) {
            newErrors.stock = "Stock is required";
        } else if (Number(formData.stock) < 0) {
            newErrors.stock =
                "Stock cannot be negative";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Product Name */}

            <div>

                <label className="block mb-2 font-medium">
                    Product Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full border rounded-lg p-3"
                />

                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.name}
                    </p>
                )}

            </div>


            {/* Brand */}

            <div>

                <label className="block mb-2 font-medium">
                    Brand
                </label>

                <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand"
                    className="w-full border rounded-lg p-3"
                />

                {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.brand}
                    </p>
                )}

            </div>


            {/* Category and Type */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    >

                        <option value="">
                            Select Category
                        </option>

                        <option value="men">
                            Men
                        </option>

                        <option value="women">
                            Women
                        </option>

                    </select>

                    {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.category}
                        </p>
                    )}

                </div>


                <div>

                    <label className="block mb-2 font-medium">
                        Type
                    </label>

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    >

                        <option value="">
                            Select Type
                        </option>

                        <option value="casual">
                            Casual
                        </option>

                        <option value="sports">
                            Sports
                        </option>

                    </select>

                    {errors.type && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.type}
                        </p>
                    )}

                </div>

            </div>


            {/* Price */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>

                    <label className="block mb-2 font-medium">
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.price}
                        </p>
                    )}

                </div>


                <div>

                    <label className="block mb-2 font-medium">
                        Original Price
                    </label>

                    <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        placeholder="Enter original price"
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.originalPrice && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.originalPrice}
                        </p>
                    )}

                </div>


                <div>

                    <label className="block mb-2 font-medium">
                        Discount
                    </label>

                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="Discount %"
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.discount && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.discount}
                        </p>
                    )}

                </div>

            </div>


            {/* Rating and Reviews */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                    <label className="block mb-2 font-medium">
                        Rating
                    </label>

                    <input
                        type="number"
                        step="0.1"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder="0 - 5"
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.rating}
                        </p>
                    )}

                </div>


                <div>

                    <label className="block mb-2 font-medium">
                        Reviews
                    </label>

                    <input
                        type="number"
                        name="reviews"
                        value={formData.reviews}
                        onChange={handleChange}
                        placeholder="Number of reviews"
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.reviews && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.reviews}
                        </p>
                    )}

                </div>

            </div>


            {/* Product Images */}

            <div>

                <label className="block mb-2 font-medium">
                    Product Images
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                        <label className="block mb-2 text-sm">
                            Image 1
                        </label>

                        <input
                            type="text"
                            name="image1"
                            value={formData.image1}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="w-full border rounded-lg p-3"
                        />

                        {errors.image1 && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image1}
                            </p>
                        )}

                    </div>


                    <div>

                        <label className="block mb-2 text-sm">
                            Image 2
                        </label>

                        <input
                            type="text"
                            name="image2"
                            value={formData.image2}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="w-full border rounded-lg p-3"
                        />

                        {errors.image2 && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image2}
                            </p>
                        )}

                    </div>


                    <div>

                        <label className="block mb-2 text-sm">
                            Image 3
                        </label>

                        <input
                            type="text"
                            name="image3"
                            value={formData.image3}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="w-full border rounded-lg p-3"
                        />

                        {errors.image3 && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image3}
                            </p>
                        )}

                    </div>


                    <div>

                        <label className="block mb-2 text-sm">
                            Image 4
                        </label>

                        <input
                            type="text"
                            name="image4"
                            value={formData.image4}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="w-full border rounded-lg p-3"
                        />

                        {errors.image4 && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image4}
                            </p>
                        )}

                    </div>

                </div>

            </div>


            {/* Description */}

            <div>

                <label className="block mb-2 font-medium">
                    Description
                </label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows="4"
                    className="w-full border rounded-lg p-3 resize-none"
                />

                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                    </p>
                )}

            </div>


            {/* Features */}

            <div>

                <label className="block mb-2 font-medium">
                    Features
                </label>

                <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    placeholder="Enter features separated by comma"
                    rows="4"
                    className="w-full border rounded-lg p-3 resize-none"
                />

                {errors.features && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.features}
                    </p>
                )}

            </div>


            {/* Stock */}

            <div>

                <label className="block mb-2 font-medium">
                    Stock
                </label>

                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock"
                    className="w-full border rounded-lg p-3"
                />

                {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.stock}
                    </p>
                )}

            </div>


            {/* Checkboxes */}

            <div className="flex gap-8">

                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                    />

                    Featured

                </label>


                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                    />

                    New Product

                </label>

            </div>


            {/* Buttons */}

            <div className="flex gap-4">

                <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg"
                >
                    {buttonText}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="border px-6 py-3 rounded-lg"
                >
                    Cancel
                </button>

            </div>

        </form>
    );
};

export default ProductForm;