import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import AdminSidbar from '../../components/adminsidebar'
import AdminHeader from '../../components/adminheader'

import {
    setProducts,
    restoreProduct as restoreProductRedux,
    permanentDeleteProduct as permanentDeleteProductRedux
} from '../../redux/slices/adminproductslice'

import {
    getProduct,
    restoreProduct,
    permanentDeleteProduct
} from '../../services/adminproductservices'


const DeletedProduct = () => {

    const dispatch = useDispatch();

    const products = useSelector(
        (state) => state.adminProduct.products
    );

    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const productsPerPage = 5;

    const deletedProducts = products.filter(
        (product) => product.deleted
    );

    const totalPages = Math.ceil(
        deletedProducts.length / productsPerPage
    );

    const startIndex = (currentPage - 1) * productsPerPage;

    const currentProducts = deletedProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );


    const fetchProduct = async () => {

        try {

            const data = await getProduct();

            dispatch(setProducts(data));

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        fetchProduct();

    }, []);


    const handleRestore = async (id) => {

        try {

            await restoreProduct(id);

            dispatch(restoreProductRedux(id));

        } catch (error) {

            console.log(error);

        }

    };


    const handlePermanentDelete = async (id) => {

        const confirmpermanentdelete = window.confirm(
            "Are you sure you want to permanently delete this product?"
        );

        if (!confirmpermanentdelete) {
            return;
        }

        try {

            await permanentDeleteProduct(id);

            dispatch(permanentDeleteProductRedux(id));

        } catch (error) {

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
                                    currentProducts.map((product) => (

                                        <tr
                                            key={product.id}
                                            className='border-b'
                                        >

                                            <td className='p-4'>

                                                <img
                                                    src={product.image[0]}
                                                    alt={product.name}
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
                                                        handleRestore(product.id)
                                                    }
                                                    className='text-green-600 mr-3'
                                                >
                                                    Restore
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handlePermanentDelete(product.id)
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
                            currentProducts.length===0&&(
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
                                    page: currentPage - 1
                                })
                            }
                            disabled={currentPage === 1}
                            className='px-4 py-2 border rounded-lg disabled:opacity-50'
                        >
                            Previous
                        </button>


                        {Array.from(
                            { length: totalPages },
                            (_, index) => (

                                <button
                                    key={index}
                                    onClick={() =>
                                        setSearchParams({
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
                                    page: currentPage + 1
                                })
                            }
                            disabled={
                                currentPage === totalPages ||
                                totalPages === 0
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