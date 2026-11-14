import React, { useState } from "react";

import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
} from "lucide-react";

import axios from "axios";

import {
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import useWishlist from "../../hooks/useWishlist";
import useCart from "../../hooks/useCart";

const Productdetails = () => {

  const { id } = useParams();

  const [quantity, setQuantity] =
    useState(1);

  const [selectimage, setSelectedImage] =
    useState(0);

  // Get product
  const getProduct = async () => {

    const response = await axios.get(
      `http://localhost:3001/products/${id}`
    );

    return response.data;
  };

  // Product query
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({

    queryKey: ["product", id],

    queryFn: getProduct,

    enabled: !!id,
  });

  const {
    isWishlisted,
    handleWishlist,
    addWishlistMutation,
    deleteWishlistMutation,
  } = useWishlist(product);

  const {
    addToCartMutation,
    handleAddToCart,
  } = useCart();

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading product...
      </div>
    );
  }

  // Error
  if (isError || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Failed to load product
      </div>
    );
  }

  // Product images
  const images = Array.isArray(product.image)
    ? product.image
    : [product.image];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">

        {/* Images */}
        <div>
          <div className="border rounded-xl p-8">
            <img
              src={images[selectimage]}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {images.map(
              (image, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  className="border rounded-lg p-2"
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="w-20 h-20 object-contain"
                  />
                </button>
              )
            )}
          </div>
        </div>

        {/* Product information */}
        <div>
          <div className="flex justify-between">

            <h1 className="text-3xl font-semibold">
              {product.name}
            </h1>

            {/* Wishlist */}
            <button
              className="bg-white p-3 rounded-full shadow-sm hover:bg-gray-100 transition"
              onClick={handleWishlist}
              disabled={
                addWishlistMutation.isPending ||
                deleteWishlistMutation.isPending
              }
            >
              <Heart
                size={22}
                className={
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }
              />
            </button>

          </div>

          <p className="text-gray-500 mt-2">
            {product.brand}
          </p>

          {
            product.stock > 0 ? (
              <p className="text-green-600 font-medium mt-3">
                In Stock
              </p>
            ) : (
              <p className="text-red-600 font-medium mt-3">
                Out of Stock
              </p>
            )
          }

          {/* price */}
          <div className="flex items-center gap-4 mt-5">

            <p className="text-2xl font-semibold">
              ₹{product.price.toLocaleString()}
            </p>

            <p className="text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </p>

            <p className="text-green-600 font-medium">
              {product.discount}% OFF
            </p>

          </div>

          <p className="text-gray-600 mt-5">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-8">

            <span>Quantity</span>

            <div className="flex items-center border rounded-lg">

              <button
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(
                      quantity - 1
                    );
                  }
                }}
                disabled={
                  product.stock <= 0 ||
                  quantity <= 1
                }
                className="p-3 hover:bg-gray-100 disabled:opacity-40"
              >
                <Minus size={18} />
              </button>

              <span className="px-4">
                {quantity}
              </span>

              <button
                onClick={() => {
                  if (
                    quantity <
                    Number(product.stock)
                  ) {
                    setQuantity(
                      quantity + 1
                    );
                  }
                }}
                disabled={
                  quantity >=
                    Number(product.stock) ||
                  product.stock <= 0
                }
                className="p-3 hover:bg-gray-100 disabled:opacity-40"
              >
                <Plus size={18} />
              </button>

            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={() =>
              handleAddToCart(
                product,
                quantity
              )
            }
            disabled={
              addToCartMutation.isPending ||
              Number(product.stock) <= 0
            }
            className="w-full mt-8 flex items-center justify-center gap-3 bg-black text-white py-4 rounded-lg"
          >
            <ShoppingCart size={20} />

            {addToCartMutation.isPending
              ? "Adding..."
              : product.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {/* Delivery */}
          <div className="flex items-center gap-3 mt-8">
            <Truck size={22} />

            <span>
              Fast delivery available
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Productdetails;