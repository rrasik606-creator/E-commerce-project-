import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    getWishlist,
    addWishlist,
    deleteWishlist
} from "../services/wishlistService";


const useWishlist = (product) => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const user=useSelector((state)=>state.auth.user);
    const userId=user?.id;


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
                String(item.productId?._id) === String(product?._id)
        ) || false;


    // Add wishlist
    const addWishlistMutation = useMutation({
        mutationFn: (productId) =>addWishlist(productId),

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
        mutationFn: (productId) =>deleteWishlist(productId),

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

        if(addWishlistMutation.isPending||deleteWishlistMutation.isPending){
            return;
        }

        if(!product?._id){
            return;
        }


        // Remove from wishlist
        if (isWishlisted) {
            deleteWishlistMutation.mutate(product._id);
            return;
        }


        // Add to wishlist
        addWishlistMutation.mutate(product._id);
    };


    return {
        isWishlisted,
        handleWishlist,
        addWishlistMutation,
        deleteWishlistMutation
    };
};


export default useWishlist;