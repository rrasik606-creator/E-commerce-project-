import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Productgrid from '../../components/productgrid';

const API_URL = "http://localhost:3001/products";

const Products = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const type = searchParams.get("type") || "";
    const brand = searchParams.get("brand") || "";
    const search = searchParams.get("search") || "";

    const getProduct = async () => {
        const response = await axios.get(API_URL);
        return response.data;
    };

    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: getProduct
    });

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500 text-lg'>
                    Loading products...
                </p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-red-500 text-lg'>
                    Failed to load products
                </p>
            </div>
        )
    }

    // get brands
    const brands = [
        ...new Set(
            products
                .map((product) => product.brand)
                .filter(Boolean)
        )
    ];

    // filter products
    const filteredProducts = products.filter((product) => {

        const typeMatch = type
            ? product.type === type
            : true;

        const brandMatch = brand
            ? product.brand === brand
            : true;

        const searchMatch = search
            ? product.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              product.brand
                .toLowerCase()
                .includes(search.toLowerCase())
            : true;

        return typeMatch && brandMatch && searchMatch;
    });


    // Type change
    const handleCategoryChange = (e) => {

        const value = e.target.value;

        if (value) {
            searchParams.set("type", value);
        } else {
            searchParams.delete("type");
        }

        setSearchParams(searchParams);
    };


    // Brand change
    const handleBrandChange = (e) => {

        const value = e.target.value;

        if (value) {
            searchParams.set("brand", value);
        } else {
            searchParams.delete("brand");
        }

        setSearchParams(searchParams);
    };


    return (
        <div className='min-h-screen bg-white'>

            {/* PAGE HEADER */}
            <div className='px-6 md:px-10 lg:px-16 pt-10'>

                {/* <h1 className='text-4xl md:text-5xl font-semibold text-gray-900'>
                    {search
                        ? `Search results for "${search}"`
                        : type === "sports"
                        ? "Sports Watches"
                        : type === "casual"
                        ? "Casual Watches"
                        : "Watches"}
                </h1> */}

                <p className='text-gray-500 mt-3 max-w-xl'>
                    Discover timeless watches designed for every style and occasion.
                </p>

            </div>


            {/* FILTERS */}
            <div className='px-6 md:px-10 lg:px-16 mt-8 flex flex-wrap gap-4'>

                {/* CATEGORY */}
                <select
                    value={type}
                    onChange={handleCategoryChange}
                    className='border border-gray-300 rounded-md px-4 py-2 text-sm outline-none'
                >

                    <option value=''>
                        All Categories
                    </option>

                    <option value='sports'>
                        Sports
                    </option>

                    <option value='casual'>
                        Casual
                    </option>

                </select>


                {/* BRAND */}
                <select
                    value={brand}
                    onChange={handleBrandChange}
                    className='border border-gray-300 rounded-md px-4 py-2 text-sm outline-none'
                >

                    <option value=''>
                        All Brands
                    </option>

                    {brands.map((brandName) => (
                        <option
                            key={brandName}
                            value={brandName}
                        >
                            {brandName}
                        </option>
                    ))}

                </select>

            </div>


            {/* PRODUCTS */}
            <Productgrid products={filteredProducts} />

        </div>
    )
}

export default Products;