import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

import { useDispatch, useSelector } from "react-redux";

import {
  getWishlist,
  deleteWishlist,
} from "../../services/wishlistService";

import { setWishlist } from "../../redux/slices/wishlistslice";

import { Link, useNavigate } from "react-router-dom";

import useCart from "../../hooks/useCart";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user=useSelector((state)=>state.auth.user);
  const userId=user?.id

  const [addingProductId, setAddingProductId] = useState(null);

  const {
    handleAddToCart: addToCart,
    addToCartMutation,
  } = useCart();

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


  // Store wishlist in Redux
  useEffect(() => {
    dispatch(setWishlist(userWishlist?.items || []));
  }, [userWishlist, dispatch]);

  // Wishlist items — read from Redux so the UI reflects the store
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: (productId) =>deleteWishlist(productId),

    onSuccess: (updatedWishlist) => {
      dispatch(setWishlist(updatedWishlist.items));

      queryClient.setQueryData(
        ["wishlist", userId],
        updatedWishlist
      );

      toast.error("Product removed from wishlist!")
    },

    onError:()=>{
      toast.error("Failed to remove product")
    },
  });

  const handleDelete = (e, productId) => {
    e.stopPropagation();

    deleteMutation.mutate(productId);
  };

  // Add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!product || product.stock<= 0) {
      toast.error("This product is out of stock");
      return;
    }

    setAddingProductId(product._id);

    addToCart(product, 1);
  };

  useEffect(()=>{
    if(!addToCartMutation.isPending&&addingProductId){
      setAddingProductId(null)
    }
  },[addToCartMutation.isPending,addingProductId]);


  if (!userId) {
    return (
      <div className="p-10 text-center">
        Please login to view your wishlist.
        <button
          onClick={() => navigate("/login")}
          className="block mx-auto mt-4 bg-black text-white px-6 py-3 rounded-lg"
        >
          Login
        </button>
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
              to="/products"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (

          /* PRODUCTS */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {wishlist.filter((item) => item.productId).map((item)=>{

              const product=item.productId;
              return(
              <div
                key={item._id}
                onClick={() =>
                  navigate(`/products/${product._id}`)
                }
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
              >

                {/* IMAGE */}

                <div className="relative">

                  <img
                    src={product.image?.[0]||product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />

                  {/* DELETE */}

                  <button
                    onClick={(e) =>handleDelete(e,product._id)}
                    disabled={deleteMutation.isPending}
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
                    {product.brand}
                  </p>

                  <h2 className="font-semibold mt-1">
                    {product.name}
                  </h2>

                  <p className="font-bold text-lg mt-3">
                    ₹{product.price}
                  </p>

                  {/* ADD TO CART */}

                  <button
                    onClick={(e) =>handleAddToCart(e, product)}
                    disabled={addingProductId === product._id ||product.stock<=0}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg"
                  >
                    <ShoppingBag size={18} />

                    {addingProductId === product._id
                      ? "Adding..."
                      : product.stock<=0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>

                </div>

              </div>
              );

            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Wishlist;