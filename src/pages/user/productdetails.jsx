import React, { useState } from "react";

import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
} from "lucide-react";

import toast from "react-hot-toast";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { addCart } from "../../services/cartService";

import {
  getWishlist,
  addWishlist,
  deleteWishlist,
} from "../../services/wishlistService";


const API_URL =
  "http://localhost:3001/products";


const Productdetails = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const userId =
    localStorage.getItem("user");


  const { id } = useParams();


  const [quantity, setQuantity] =
    useState(1);


  const [selectimage, setSelectedImage] =
    useState(0);


  // Get product
  const getProduct = async () => {

    const response = await axios.get(
      `${API_URL}/${id}`
    );

    return response.data;
  };


  // Add to cart
  const addToCartMutation = useMutation({

    mutationFn: (cartItem) =>
      addCart(cartItem),

    onSuccess: (updatedCart) => {

      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );

      // navigate("/cart");
      toast.success("Product added to cart!");
    },
  });


  // Get wishlist
  const {
    data: userWishlist = null,
  } = useQuery({

    queryKey: ["wishlist", userId],

    queryFn: getWishlist,

    enabled: !!userId,
  });


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


  // Check product is already in wishlist
  const isWishlisted =
    userWishlist?.items?.some(
      (item) =>
        String(item.productId) ===
        String(product?.id)
    ) || false;


  // Add wishlist
  const addWishlistMutation = useMutation({

    mutationFn: (wishlistItem) =>
      addWishlist(wishlistItem),

    onSuccess: (updatedWishlist) => {

      queryClient.setQueryData(
        ["wishlist", userId],
        updatedWishlist
      );
      toast.success("Product added to wishlist!");
    },
  });


  // Delete wishlist
  const deleteWishlistMutation = useMutation({

    mutationFn: ({
      wishlistId,
      productId,
    }) =>
      deleteWishlist(
        wishlistId,
        productId
      ),

    onSuccess: (updatedWishlist) => {

      queryClient.setQueryData(
        ["wishlist", userId],
        updatedWishlist
      );
      toast.success("Product removed from wishlist!");
    },
  });


  // Wishlist click
  const handleWishlist = () => {

    if (!userId) {

      navigate("/login");

      return;
    }


    // Already in wishlist
    // Remove product
    if (isWishlisted) {

      deleteWishlistMutation.mutate({

        wishlistId:
          userWishlist.id,

        productId:
          product.id,
      });

      return;
    }


    // Not in wishlist
    // Add product
    addWishlistMutation.mutate({

      userId: userId,

      productId: product.id,

      name: product.name,

      brand: product.brand,

      price: product.price,

      image: product.image,
    });
  };


  // Add product to cart
  const handleAddToCart = () => {

    if (!userId) {

      navigate("/login");

      return;
    }


    const cartItem = {

      userId: userId,

      productId: product.id,

      name: product.name,

      price: product.price,

      image: product.image,

      quantity: quantity,
      
    };


    addToCartMutation.mutate(
      cartItem
    );
  };


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
            product.stock>0?(
              <p className="text-green-600 font-medium mt-3">
                In Stock
              </p>
            ):(
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

            <span>
              Quantity
            </span>


            <div className="flex items-center border rounded-lg">

              <button
                onClick={() => {

                  if (quantity > 1) {

                    setQuantity(
                      quantity - 1
                    );

                  }

                }}
                disabled={product.stock<=0||quantity<=1}

                className="p-3 hover:bg-gray-100 disabled:opacity-40"
              >

                <Minus size={18} />

              </button>


              <span className="px-4">

                {quantity}

              </span>


              <button
                onClick={() =>{
                  if(quantity<Number(product.stock)){
                  setQuantity(
                    quantity + 1
                  )
                }
                }
                }
                disabled={quantity>=Number(product.stock)||product.stock<=0}

                className="p-3 hover:bg-gray-100 disabled:opacity-40"
              >

                <Plus size={18} />

              </button>

            </div>

          </div>


          {/* Add to cart */}

          <button
            onClick={handleAddToCart}

            disabled={
              addToCartMutation.isPending||Number(product.stock)<=0
            }

            className="w-full mt-8 flex items-center justify-center gap-3 bg-black text-white py-4 rounded-lg"
          >

            <ShoppingCart size={20} />

            {addToCartMutation.isPending
              ? "Adding..."
              : product.stock<=0
              ?"Out of Stock"
              :"Add to Cart"}

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