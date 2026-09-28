import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getWishlist,
    addWishlist,
    deleteWishlist
} from "../services/wishlistService";


const useWishlist = (product) => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const userId = localStorage.getItem("user");


    // Get user's wishlist
    const { data: userWishlist = null } = useQuery({
        queryKey: ["wishlist", userId],
        queryFn: getWishlist,
        enabled: !!userId
    });


    // Check whether product is already in wishlist
    const isWishlisted =
        userWishlist?.items?.some(
            (item) =>
                String(item.productId) === String(product?.id)
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
        }
    });


    // Delete wishlist
    const deleteWishlistMutation = useMutation({
        mutationFn: ({ wishlistId, productId }) =>
            deleteWishlist(wishlistId, productId),

        onSuccess: (updatedWishlist) => {
            queryClient.setQueryData(
                ["wishlist", userId],
                updatedWishlist
            );

            toast.success("Product removed from wishlist!");
        }
    });


    // Wishlist button
    const handleWishlist = (e) => {

        e.stopPropagation();
        e.preventDefault();


        if (!userId) {
            navigate("/login");
            return;
        }


        // Remove from wishlist
        if (isWishlisted) {

            deleteWishlistMutation.mutate({
                wishlistId: userWishlist.id,
                productId: product.id
            });

            return;
        }


        // Add to wishlist
        addWishlistMutation.mutate({
            userId: userId,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image
        });
    };


    return {
        isWishlisted,
        handleWishlist,
        addWishlistMutation,
        deleteWishlistMutation
    };
};


export default useWishlist;