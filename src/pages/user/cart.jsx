import React, { useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  ShoppingCart,
} from "lucide-react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
  getcart,
  updateCart,
  deleteCart,
} from "../../services/cartService";

import { setCart } from "../../redux/slices/cartslice";
import axios from "axios";

const API_URL="http://localhost:3001/products";

const Cart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user");

const getProduct=async()=>{
  const response=await axios.get(API_URL)
  return response.data
}
  // Get user's cart
  const {
    data: userCart = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: getcart,
    enabled: !!userId,
  });

  //get product
  const {
    data: products = [],
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });


  // Cart id
  const cartId = userCart?.id;


  // Update Redux with the latest cart from the server
  useEffect(() => {
    if (userId) {
      dispatch(setCart(userCart?.items || []));
    } else {
      dispatch(setCart([]));
    }
  }, [userCart, userId, dispatch]);


  // Cart items — read from Redux so the UI reflects the store
  const cart = useSelector((state) => state.cart.cart);


  // Update quantity
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCart(cartId, productId, quantity),

    onSuccess: (updatedCart) => {
      dispatch(setCart(updatedCart.items));

      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );
    },
  });


  // Delete item
  const deleteMutation = useMutation({
    mutationFn: (productId) =>
      deleteCart(cartId, productId),

    onSuccess: (updatedCart) => {
      dispatch(setCart(updatedCart.items));

      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );

      toast.success("Item removed from cart");
    },
  });


  // Confirm before removing an item
  const handleDelete = async(item) => {
    const confirmDelete = await Swal.fire({
      title:"Remove item?",
      text:`Remove "${item.name}" from your cart?`,
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Yes,Remove",
      cancelButtonText:"Cancel"
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    deleteMutation.mutate(item.productId);
  };


  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading your cart...
        </p>
      </div>
    );
  }


  // Error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Failed to load cart.
        </p>
      </div>
    );
  }


  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">

        <h2 className="text-2xl font-semibold mb-3">
          Please login
        </h2>

        <p className="text-gray-500 mb-6">
          Login to view your shopping cart.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-8 py-3 rounded-lg"
        >
          Login
        </button>

      </div>
    );
  }


  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">

        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <span className="text-3xl"><ShoppingCart/></span>
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-8 py-3 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>
    );
  }


  // Subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  // Total
  const total = subtotal ;


  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-5"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Shopping Cart
          </h1>

          <p className="text-gray-500 mt-2">
            {cart.reduce(
              (total, item) =>
                total + item.quantity,
              0
            )}{" "}
            items in your cart
          </p>

        </div>

      </div>


      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">


          {/* LEFT - CART ITEMS */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl border">

              {/* Cart header */}
              <div className="px-6 py-5 border-b">

                <h2 className="text-lg font-semibold">
                  Cart Items
                </h2>

              </div>


              {/* Items */}
              <div>

                {cart.map((item) =>{
                  const product=products.find((product)=>
                  product.id===item.productId)
                
                return (

                  <div
                    key={item.productId}
                    className="p-6 border-b last:border-b-0"
                  >

                    <div className="flex gap-5">


                      {/* Image */}
                      <div className="w-28 h-28 md:w-36 md:h-36 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center">

                        <img
                          src={
                            item.image?.[0] ||
                            item.image
                          }
                          alt={item.name}
                          className="w-full h-full object-contain p-3"
                        />

                      </div>


                      {/* Details */}
                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-4">

                          <div>

                            <h3 className="text-lg font-medium">
                              {item.name}
                            </h3>

                          </div>


                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(item)
                            }
                            disabled={
                              deleteMutation.isPending
                            }
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={20} />
                          </button>

                        </div>


                        {/* Price */}
                        <p className="text-lg font-semibold mt-3">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>


                        {/* Bottom */}
                        <div className="flex items-center justify-between mt-5">


                          {/* Quantity */}
                          <div className="flex items-center border rounded-lg">

                            <button
                              onClick={() => {

                                if (item.quantity > 1) {

                                  updateMutation.mutate({
                                    productId:
                                      item.productId,

                                    quantity:
                                      item.quantity - 1,
                                  });

                                }

                              }}

                              disabled={
                                updateMutation.isPending ||
                                item.quantity <= 1
                              }

                              className="p-2.5 hover:bg-gray-100 disabled:opacity-40"
                            >
                              <Minus size={16} />
                            </button>


                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>


                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  productId:
                                    item.productId,

                                  quantity:
                                    item.quantity + 1,
                                })
                              }

                              disabled={
                                updateMutation.isPending||
                                item.quantity>=(product?.stock||0)
                              }

                              className="p-2.5 hover:bg-gray-100 disabled:opacity-40"
                            >
                              <Plus size={16} />
                            </button>

                          </div>


                          {/* Item total */}
                          <p className="font-semibold">
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                );
                })}

              </div>

            </div>


            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-4 mt-5">

              <div className="bg-white border rounded-xl p-5 flex gap-4">

                <div className="bg-gray-100 rounded-full p-3 h-fit">
                  <Truck size={20} />
                </div>

                <div>
                  <h3 className="font-medium">
                    Free Shipping
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Free delivery
                  </p>
                </div>

              </div>


              <div className="bg-white border rounded-xl p-5 flex gap-4">

                <div className="bg-gray-100 rounded-full p-3 h-fit">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-medium">
                    Secure Checkout
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your payment information is secure
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT - ORDER SUMMARY */}
          <div>

            <div className="bg-white border rounded-2xl p-6 sticky top-6">

              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>


              {/* Subtotal */}
              <div className="flex justify-between text-gray-600 mb-4">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>

              </div>


              <div className="border-t pt-5">

                <div className="flex justify-between items-center">

                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-semibold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>


              {/* Checkout */}
              <button
                onClick={() =>
                  navigate("/checkout")
                }
                className="w-full bg-black text-white py-4 rounded-xl mt-6 font-medium hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>


              {/* Continue shopping */}
              <button
                onClick={() =>
                  navigate("/products")
                }
                className="w-full border border-gray-300 py-4 rounded-xl mt-3 font-medium hover:bg-gray-50 transition"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;