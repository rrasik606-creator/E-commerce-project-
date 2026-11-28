import React, { useEffect, useState,useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import AdminSidbar from '../../components/adminsidebar'

import {
    setOrders,
    updateOrder as updateOrderRedux
} from '../../redux/slices/adminordersslice'

import {
    getOrders,
    updateOrder
} from '../../services/adminorderservices'

const AdminOrders = () => {

    const dispatch = useDispatch();

    const {orders,pagination} =useSelector((state)=>state.adminOrder);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const currentPage = Number(searchParams.get("page")) || 1;


    const statuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    const fetchOrders = useCallback(async () => {
        try {
            const data = await getOrders({
                search,
                status,
                page:currentPage,
                limit:pagination.limit
            });

            dispatch(setOrders(data));
        } catch (error) {
            console.log(error);
        }
    },[dispatch,search,status,currentPage,pagination.limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = async (id, status) => {
        try {
            const data = await updateOrder(id,status);

            dispatch(updateOrderRedux(data.order));

            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(data.order);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    // Search change
    const handleSearch = (e) => {
        setSearchParams({
            search: e.target.value,
            status: status,
            page: 1
        });
    };

    // Status filter
    const handleStatusFilter = (e) => {
        setSearchParams({
            search: search,
            status: e.target.value,
            page: 1
        });
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearchParams({
            page: 1
        });
    };

    return (
        <div className='flex min-h-screen bg-gray-100'>

            <AdminSidbar />

            <div className='flex-1 ml-64'>

                <main className='p-6'>

                    <div className='mb-6'>
                        <h1 className='text-2xl font-bold'>
                            Orders
                        </h1>
                    </div>

                    {/* Search and Filter */}

                    <div className='bg-white p-4 rounded-lg shadow mb-6'>

                        <div className='flex flex-col md:flex-row gap-4'>

                            <input
                                type='text'
                                placeholder='Search orders... '
                                value={search}
                                onChange={handleSearch}
                                className='w-full md:flex-1 border rounded-lg px-4 py-2'
                            />

                            <select
                                value={status}
                                onChange={handleStatusFilter}
                                className='border rounded-lg px-4 py-2'
                            >
                                <option value=''>
                                    All Status
                                </option>

                                {statuses.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleClearFilters}
                                className='px-5 py-2 border rounded-lg bg-black text-white'
                            >
                                Clear
                            </button>

                        </div>

                    </div>

                    {/* Orders Table */}

                    <div className='bg-white rounded-lg shadow overflow-x-auto'>

                        <table className='w-full'>

                            <thead>

                                <tr className='border-b text-left'>

                                    <th className='p-4'>
                                        Order
                                    </th>

                                    <th className='p-4'>
                                        User ID
                                    </th>

                                    <th className='p-4'>
                                        Customer
                                    </th>

                                    <th className='p-4'>
                                        Date
                                    </th>

                                    <th className='p-4'>
                                        Total
                                    </th>

                                    <th className='p-4'>
                                        Payment
                                    </th>

                                    <th className='p-4'>
                                        Status
                                    </th>

                                    <th className='p-4'>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {orders.map((order) => (

                                    <tr
                                        key={order._id}
                                        className='border-b'
                                    >

                                        <td className='p-4'>
                                            {order._id}
                                        </td>

                                        <td className='p-4'>
                                            {order.userId?._id||order.userId}
                                        </td>

                                        <td className='p-4'>
                                            {order.address.name}
                                        </td>

                                        <td className='p-4'>

                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                'en-GB',
                                                {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }
                                            )}

                                        </td>

                                        <td className='p-4'>
                                            ₹{order.total.toLocaleString()}
                                        </td>

                                        <td className='p-4'>
                                            {order.paymentMethod}
                                        </td>

                                        <td className='p-4'>

                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        order._id,
                                                        e.target.value
                                                    )
                                                }
                                                className='border rounded-lg px-3 py-2'
                                            >

                                                {statuses.map((status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>

                                                ))}

                                            </select>

                                        </td>

                                        <td className='p-4'>

                                            <button
                                                onClick={() =>
                                                    handleViewOrder(order)
                                                }
                                                className='text-blue-600'
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        {orders.length === 0 && (
                            <div className='p-8 text-center text-gray-500'>
                                No orders found
                            </div>
                        )}

                        {/* Pagination */}

                        {pagination.totalPages > 0 && (

                            <div className='flex justify-center items-center gap-2 p-4'>

                                <button
                                    onClick={() =>
                                        setSearchParams({
                                            search,
                                            status,
                                            page: currentPage - 1
                                        })
                                    }
                                    disabled={currentPage === 1}
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
                                                    status,
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
                                            status,
                                            page: currentPage + 1
                                        })
                                    }
                                    disabled={
                                        currentPage >= pagination.totalPages
                                    }
                                    className='px-4 py-2 border rounded-lg disabled:opacity-50'
                                >
                                    Next
                                </button>

                            </div>

                        )}

                    </div>

                </main>

            </div>


            {/* Order Details Modal */}

            {selectedOrder && (

                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>

                    <div className='bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto'>

                        {/* Modal Header */}

                        <div className='flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white'>

                            <div>

                                <h2 className='text-xl font-bold'>
                                    Order Details
                                </h2>

                                <p className='text-sm text-gray-500'>
                                    Order ID: {selectedOrder._id}
                                </p>

                            </div>

                            <button
                                onClick={handleCloseDetails}
                                className='text-2xl text-gray-500 hover:text-black'
                            >
                                ×
                            </button>

                        </div>


                        {/* Customer Details */}

                        <div className='p-6'>

                            <h3 className='font-semibold text-lg mb-4'>
                                Customer Details
                            </h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                                <div>

                                    <p className='text-sm text-gray-500'>
                                        User ID
                                    </p>

                                    <p className='font-medium'>
                                        {selectedOrder.userId?._id||selectedOrder.userId}
                                    </p>

                                </div>

                                <div>

                                    <p className='text-sm text-gray-500'>
                                        Customer Name
                                    </p>

                                    <p className='font-medium'>
                                        {selectedOrder.address.name}
                                    </p>

                                </div>

                                <div>

                                    <p className='text-sm text-gray-500'>
                                        Phone
                                    </p>

                                    <p className='font-medium'>
                                        {selectedOrder.address.phone}
                                    </p>

                                </div>

                                <div>

                                    <p className='text-sm text-gray-500'>
                                        Payment
                                    </p>

                                    <p className='font-medium'>
                                        {selectedOrder.paymentMethod}
                                    </p>

                                </div>

                            </div>

                            <div className='mt-4'>

                                <p className='text-sm text-gray-500'>
                                    Address
                                </p>

                                <p className='font-medium'>

                                    {selectedOrder.address.address}
                                    {', '}
                                    {selectedOrder.address.city}
                                    {', '}
                                    {selectedOrder.address.state}
                                    {' - '}
                                    {selectedOrder.address.pincode}

                                </p>

                            </div>

                        </div>


                        {/* Ordered Products */}

                        <div className='px-6 pb-6'>

                            <h3 className='font-semibold text-lg mb-4'>
                                Ordered Products
                            </h3>

                            <div className='space-y-3'>

                                {selectedOrder.items.map((item) => (

                                    <div
                                        key={item.productId}
                                        className='flex items-center gap-4 border rounded-lg p-4'
                                    >

                                        <img
                                            src={Array.isArray(item.image)?item.image[0]:item.image}
                                            alt={item.name}
                                            className='w-16 h-16 object-contain'
                                        />

                                        <div className='flex-1'>

                                            <p className='font-medium'>
                                                {item.name}
                                            </p>

                                            <p className='text-sm text-gray-500'>
                                                Product ID: {item.productId}
                                            </p>

                                            <p className='text-sm text-gray-500'>
                                                Quantity: {item.quantity}
                                            </p>

                                        </div>

                                        <p className='font-semibold'>
                                            ₹{item.price.toLocaleString()}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* Order Summary */}

                        <div className='px-6 py-5 border-t bg-gray-50'>

                            <div className='flex justify-between mb-2'>

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹{selectedOrder.subtotal.toLocaleString()}
                                </span>

                            </div>

                            <div className='flex justify-between mb-2'>

                                <span>
                                    Payment
                                </span>

                                <span>
                                    {selectedOrder.paymentMethod}
                                </span>

                            </div>

                            <div className='flex justify-between text-lg font-bold'>

                                <span>
                                    Total
                                </span>

                                <span>
                                    ₹{selectedOrder.total.toLocaleString()}
                                </span>

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className='flex justify-end px-6 py-4 border-t'>

                            <button
                                onClick={handleCloseDetails}
                                className='px-5 py-2 bg-black text-white rounded-lg'
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}

export default AdminOrders