import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";
import axios from "axios";

import { getcart } from "../../services/cartService";

const API_URL = "http://localhost:3001";

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("user");

  // Address
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("");

  // Get cart
  const {
    data: userCart = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: getcart,
    enabled: !!userId,
  });

  const cart = userCart?.items || [];

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Total
  const total = subtotal;

  // Handle input
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // Place order
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const order = {
        userId: userId,
        items: cart,
        address: address,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        total: total,
        status: "Placed",
        orderDate: new Date().toISOString(),
      };

      const response = await axios.post(
        `${API_URL}/orders`,
        order
      );

      return response.data;
    },

    onSuccess: async () => {
      // Clear cart items
      if (userCart?.id) {
        await axios.patch(
          `${API_URL}/cart/${userCart.id}`,
          {
            items: [],
          }
        );
      }

      // Update cart cache
      queryClient.setQueryData(
        ["cart", userId],
        {
          ...userCart,
          items: [],
        }
      );

      // Go to success page
      navigate("/orders");
    },
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      return;
    }

    if (cart.length === 0) {
      return;
    }

    placeOrderMutation.mutate();
  };

  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <ShoppingBag
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-semibold mt-4">
            Please login
          </h2>

          <p className="text-gray-500 mt-2">
            Login to continue checkout
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            Login
          </button>

        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading checkout...
        </p>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Failed to load checkout
        </p>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <ShoppingBag
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-semibold mt-4">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add some products before checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-1">
            Complete your order
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT */}

            <div className="lg:col-span-2 space-y-6">

              {/* ADDRESS */}

              <div className="bg-white rounded-xl p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <MapPin size={22} />

                  <h2 className="text-xl font-semibold">
                    Delivery Address
                  </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />

                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={address.address}
                    onChange={handleChange}
                    rows="3"
                    className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />

                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={address.pincode}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />

                </div>

              </div>

              {/* PAYMENT */}

              <div className="bg-white rounded-xl p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <CreditCard size={22} />

                  <h2 className="text-xl font-semibold">
                    Payment Method
                  </h2>

                </div>

                <div className="space-y-3">

                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer">

                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      required
                    />

                    <div>
                      <p className="font-medium">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay when your order arrives
                      </p>
                    </div>

                  </label>

                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer">

                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      required
                    />

                    <div>
                      <p className="font-medium">
                        UPI
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay using UPI
                      </p>
                    </div>

                  </label>

                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer">

                    <input
                      type="radio"
                      name="payment"
                      value="Card"
                      checked={paymentMethod === "Card"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      required
                    />

                    <div>
                      <p className="font-medium">
                        Card
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay using debit or credit card
                      </p>
                    </div>

                  </label>

                </div>

              </div>

              {/* ORDER ITEMS */}

              <div className="bg-white rounded-xl p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <ShoppingBag size={22} />

                  <h2 className="text-xl font-semibold">
                    Order Items
                  </h2>

                </div>

                <div className="space-y-4">

                  {cart.map((item) => (

                    <div
                      key={item.productId}
                      className="flex items-center gap-4 border-b border-gray-100 pb-4"
                    >

                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-20 h-20 object-contain bg-gray-100 rounded-lg"
                      />

                      <div className="flex-1">

                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₹{item.price.toLocaleString()}
                        </p>

                      </div>

                      <p className="font-semibold">
                        ₹{(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT - SUMMARY */}

            <div>

              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">

                <h2 className="text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between text-gray-600">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal.toLocaleString()}
                    </span>

                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-bold">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹{total.toLocaleString()}
                    </span>

                  </div>

                  <button
                    type="submit"
                    disabled={
                      placeOrderMutation.isPending
                    }
                    className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {placeOrderMutation.isPending
                      ? "Placing Order..."
                      : "Place Order"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="w-full border border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back to Cart
                  </button>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Checkout;

