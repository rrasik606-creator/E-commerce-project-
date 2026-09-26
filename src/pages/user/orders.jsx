import React from "react";
import axios from "axios";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { getOrder,updateOrder } from "../../services/order";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Swal from "sweetalert2";

const Orders = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("user");

  const queryclient=useQueryClient();

  const cancelOrderMutation = useMutation({
    mutationFn: async (order) => {

      // Restore product stock
      for (const item of order.items) {

        const response = await axios.get(
          `http://localhost:3001/products/${item.productId}`
        );

        const product = response.data;

        await axios.patch(
          `http://localhost:3001/products/${item.productId}`,
          {
            stock:
              Number(product.stock) + Number(item.quantity),
          }
        );
      }

      // Update order status
      return updateOrder(order.id, {
        status: "Cancelled",
      });
    },

    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["orders", userId],
      });
    },
  });

  const handleCancelOrder=async(order)=>{
    const confirmCancel= await Swal.fire({
      title:"Cancel order?",
      text:`Are you sure you want to cancel order "${order.id}"?`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Yes,Cancel",
      cancelButtonText:"Keep Order"
    })
    if(!confirmCancel.isConfirmed){
      return
    }
    cancelOrderMutation.mutate(order);
  };

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: getOrder,
    enabled: !!userId,
  });

  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag size={50} className="mb-4 text-gray-400" />

        <h2 className="text-xl font-semibold mb-2">
          Please login to view your orders
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          Login
        </button>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Failed to load orders
        </p>
      </div>
    );
  }

  // No orders
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag size={50} className="mb-4 text-gray-400" />

        <h2 className="text-xl font-semibold mb-2">
          No orders yet
        </h2>

        <p className="text-gray-500 mb-5">
          You haven't placed any orders yet.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-8">
          My Orders
        </h1>

        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >

              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-4">

                <div>
                  <p className="font-semibold">
                    Order ID: {order.id}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Order Date:{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </p>
                </div>

                <div className="text-left md:text-right">

                  <p className="text-sm text-gray-500">
                    Payment: {order.paymentMethod}
                  </p>

                  <p className="text-sm font-medium mt-1">
                    Status: {order.status}
                  </p>

                </div>

              </div>

              {/* Items */}
              <div className="py-5 space-y-4">

                {order.items?.map((item) => (

                  <div
                    key={item.productId}
                    className="flex items-center gap-4"
                  >

                    {/* Product Image */}
                    <img
                      src={
                        Array.isArray(item.image)
                          ? item.image[0]
                          : item.image
                      }
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-md border"
                    />

                    {/* Product Details */}
                    <div className="flex-1">

                      <h3 className="font-medium">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-sm text-gray-500">
                        Price: ₹
                        {Number(item.price).toLocaleString("en-IN")}
                      </p>

                    </div>

                    {/* Item Total */}
                    <p className="font-medium">
                      ₹
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                ))}

              </div>

              {/* Address */}
              {order.address && (
                <div className="border-t pt-4">

                  <h3 className="font-semibold mb-2">
                    Delivery Address
                  </h3>

                  <p className="text-sm text-gray-600">
                    {order.address.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {order.address.phone}
                  </p>

                  <p className="text-sm text-gray-600">
                    {order.address.address}
                  </p>

                  <p className="text-sm text-gray-600">
                    {order.address.city},{" "}
                    {order.address.state} -{" "}
                    {order.address.pincode}
                  </p>

                </div>
              )}

              {/* Order Total */}
              <div className="border-t mt-5 pt-4 flex justify-between items-center">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-semibold">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </span>

              </div>

              {/* Cancel order */}
              {
                order.status!=="Delivered"&&order.status!=="Cancelled"&&(
                  <div className="flex justify-end mt-5">
                    <button 
                    onClick={()=>handleCancelOrder(order)}
                    disabled={cancelOrderMutation.isPending}
                    className="px-5 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {
                        cancelOrderMutation.isPending
                        ? "Cancelling..."
                        : "Cancel order"
                      }
                    </button>
                  </div>
                )
              }

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Orders;
