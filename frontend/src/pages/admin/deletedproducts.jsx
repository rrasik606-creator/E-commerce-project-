import React, { useEffect,useCallback } from 'react'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import AdminSidbar from '../../components/adminsidebar.jsx'

import {setProducts} from '../../redux/slices/adminproductslice.js'

import {
    getDeletedProducts,
    restoreProduct,
    permanentDeleteProduct
} from '../../services/adminproductservices.js'


const DeletedProduct = () => {

    const dispatch = useDispatch();


    const products = useSelector(
        (state) => state.adminProduct.products
    );

    const brands = useSelector(
        (state) => state.adminProduct.brands
    );

    const types = useSelector(
    (state) => state.adminProduct.types
    );

    const pagination = useSelector(
        (state) => state.adminProduct.pagination
    );

    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const brandFilter = searchParams.get("brand") || "";
    const typeFilter = searchParams.get("type") || "";

    const currentPage = Number(searchParams.get("page")) || 1;

    const fetchDeletedProducts = useCallback(async () => {
        try {
            const data = await getDeletedProducts({
                page: currentPage,
                limit: 5,
                search,
                brand: brandFilter,
                type: typeFilter
            });

            dispatch(setProducts(data));

            return data;
        }
        catch (error) {
            console.log(error);
        }
    }, [dispatch, currentPage, search, brandFilter, typeFilter]);

    useEffect(() => {
        fetchDeletedProducts();
    }, [fetchDeletedProducts]);




    const handleRestore = async (id) => {
        try {
            await restoreProduct(id);

            const data = await fetchDeletedProducts();

            if (data && data.products.length === 0 && currentPage > 1) {
                setSearchParams({
                    search,
                    brand: brandFilter,
                    type: typeFilter,
                    page: Math.max(1, data.pagination.totalPages)
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handlePermanentDelete = async (id) => {
        const confirmpermanentdelete = await Swal.fire({
            title: "Are you sure?",
            text: "This product will be permanently deleted and cannot be restored.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel"
        });

        if (!confirmpermanentdelete.isConfirmed) {
            return;
        }

        try {
            await permanentDeleteProduct(id);

            const data = await fetchDeletedProducts();

            if (data && data.products.length === 0 && currentPage > 1) {
                setSearchParams({
                    search,
                    brand: brandFilter,
                    type: typeFilter,
                    page: Math.max(1, data.pagination.totalPages)
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    };



    return (
        <div className='flex min-h-screen bg-gray-100'>

            <AdminSidbar />

            <div className='flex-1 ml-64'>

                <main className='p-6'>

                    <div className='mb-6'>

                        <h1 className='text-2xl font-bold'>
                            Deleted Products
                        </h1>

                    </div>


                    <div className='bg-white p-4 rounded-lg shadow mb-6'>

                        <div className='flex flex-wrap gap-4'>

                                {/* Search */}
                                <input
                                    type="text"
                                    placeholder="Search product..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearchParams({
                                            search: e.target.value,
                                            brand: brandFilter,
                                            type: typeFilter,
                                            page: 1
                                        })
                                    }
                                    className='border rounded-lg px-4 py-2'
                                />

                                {/* Brand */}
                                <select
                                    value={brandFilter}
                                    onChange={(e) =>
                                        setSearchParams({
                                            search: search,
                                            brand: e.target.value,
                                            type: typeFilter,
                                            page: 1
                                        })
                                    }
                                    className='border rounded-lg px-4 py-2'
                                >

                                    <option value="">
                                        All Brands
                                    </option>

                                    {brands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}

                                </select>


                                {/* Type */}
                                <select
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setSearchParams({
                                            search: search,
                                            brand: brandFilter,
                                            type: e.target.value,
                                            page: 1
                                        })
                                    }
                                    className='border rounded-lg px-4 py-2'
                                >

                                    <option value="">
                                        All Types
                                    </option>

                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}

                                </select>


                                {/* Clear */}
                                <button
                                    onClick={() =>
                                        setSearchParams({
                                            page: 1
                                        })
                                    }
                                    className='px-4 py-2 bg-black text-white rounded-lg'
                                >
                                    Clear
                                </button>

                            </div>

                        </div>


                    <div className='bg-white rounded-lg shadow overflow-x-auto'>

                        <table className='w-full'>

                            <thead>

                                <tr className='border-b text-left'>

                                    <th className='p-4'>Image</th>

                                    <th className='p-4'>Name</th>

                                    <th className='p-4'>Brand</th>

                                    <th className='p-4'>Type</th>

                                    <th className='p-4'>Price</th>

                                    <th className='p-4'>Stock</th>

                                    <th className='p-4'>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {
                                    products.map((product) => (

                                        <tr
                                            key={product._id}
                                            className='border-b'
                                        >

                                            <td className='p-4'>

                                                <img
                                                    src={product.image[0] || "/placeholder.png"}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className='w-16 h-16 object-contain'
                                                />

                                            </td>


                                            <td className='p-4'>
                                                {product.name}
                                            </td>


                                            <td className='p-4'>
                                                {product.brand}
                                            </td>


                                            <td className='p-4'>
                                                {product.type}
                                            </td>


                                            <td className='p-4'>
                                                {product.price}
                                            </td>


                                            <td className='p-4'>
                                                {product.stock}
                                            </td>


                                            <td className='p-4'>

                                                <button
                                                    onClick={() =>
                                                        handleRestore(product._id)
                                                    }
                                                    className='text-green-600 mr-3'
                                                >
                                                    Restore
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handlePermanentDelete(product._id)
                                                    }
                                                    className='text-red-600'
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                        {
                            products.length===0&&(
                                <div className='p-8 text-center text-gray-500'>
                                    No deleted products found
                                </div>
                            )
                        }

                    </div>


                    <div className='flex justify-center items-center gap-2 p-4'>

                        <button
                            onClick={() =>
                                setSearchParams({
                                    search,
                                    brand: brandFilter,
                                    type: typeFilter,
                                    page: currentPage - 1
                                })
                            }
                            disabled={currentPage <= 1}
                            className='px-4 py-2 border rounded-lg disabled:opacity-50'
                        >
                            Previous
                        </button>


                        {Array.from(
                            { length: pagination.totalPages },
                            (_, index) => (

                                <button
                                    key={index}
                                    onClick={() =>
                                        setSearchParams({
                                            search,
                                            brand: brandFilter,
                                            type: typeFilter,
                                            page: index + 1
                                        })
                                    }
                                    className={`px-4 py-2 rounded-lg ${
                                        currentPage === index + 1
                                            ? 'bg-black text-white'
                                            : 'border'
                                    }`}
                                >
                                    {index + 1}
                                </button>

                            )
                        )}


                        <button
                            onClick={() =>
                                setSearchParams({
                                    search,
                                    brand: brandFilter,
                                    type: typeFilter,
                                    page: currentPage + 1
                                })
                            }
                            disabled={
                                currentPage >= pagination.totalPages ||
                                pagination.totalPages === 0
                            }
                            className='px-4 py-2 border rounded-lg disabled:opacity-50'
                        >
                            Next
                        </button>

                    </div>

                </main>

            </div>

        </div>
    )
}

export default DeletedProduct