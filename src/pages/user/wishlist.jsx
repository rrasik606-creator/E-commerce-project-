import React, { useEffect } from "react";

import {
  Heart,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useDispatch } from "react-redux";

import {
  getWishlist,
  deleteWishlist,
} from "../../services/wishlistService";

import { setWishlist } from "../../redux/slices/wishlistslice";

import { Link, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const userId = localStorage.getItem("user");

  // Get wishlist
  const {
    data: userWishlist = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: getWishlist,
    enabled: !!userId,
  });

  const wishlist = userWishlist?.items || [];

  const wishlistId = userWishlist?.id;

  // Store wishlist in Redux
  useEffect(() => {
    dispatch(setWishlist(wishlist));
  }, [wishlist, dispatch]);

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: (productId) =>
      deleteWishlist(
        wishlistId,
        productId
      ),

    onSuccess: (updatedWishlist) => {
      dispatch(
        setWishlist(updatedWishlist.items)
      );

      queryClient.setQueryData(
        ["wishlist", userId],
        updatedWishlist
      );
    },
  });

  const handleDelete = (e, productId) => {
    e.stopPropagation();

    deleteMutation.mutate(productId);
  };

  // Add to cart
  const addCartMutation = useMutation({
    mutationFn: async (item) => {
      const response = await import("../../services/cartService");

      return response.addCart({
        userId: userId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });
    },

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );
    },
  });

  const handleAddToCart = (e, item) => {
    e.stopPropagation();

    addCartMutation.mutate(item);
  };

  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <Heart
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-semibold mt-4">
            Please login
          </h2>

          <p className="text-gray-500 mt-2">
            Login to view your wishlist
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

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        Loading wishlist...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center">
        Failed to load wishlist
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              My Wishlist
            </h1>

            <p className="text-gray-500 mt-1">
              {wishlist.length} items
            </p>
          </div>

          <Heart
            size={30}
            className="text-red-500"
            fill="currentColor"
          />

        </div>

        {/* EMPTY */}

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">

            <Heart
              size={60}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-xl font-semibold mt-5">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Start adding products you love.
            </p>

            <Link
              to="/collections"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (

          /* PRODUCTS */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {wishlist.map((item) => (

              <div
                key={item.productId}
                onClick={() =>
                  navigate(`/products/${item.productId}`)
                }
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
              >

                {/* IMAGE */}

                <div className="relative">

                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />

                  {/* DELETE */}

                  <button
                    onClick={(e) =>
                      handleDelete(
                        e,
                        item.productId
                      )
                    }
                    disabled={
                      deleteMutation.isPending
                    }
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                  >
                    <Trash2
                      size={18}
                      className="text-red-500"
                    />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="p-4">

                  <p className="text-sm text-gray-500">
                    {item.brand}
                  </p>

                  <h2 className="font-semibold mt-1">
                    {item.name}
                  </h2>

                  <p className="font-bold text-lg mt-3">
                    ₹{item.price}
                  </p>

                  {/* ADD TO CART */}

                  <button
                    onClick={(e) =>
                      handleAddToCart(e, item)
                    }
                    disabled={
                      addCartMutation.isPending
                    }
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Wishlist;

