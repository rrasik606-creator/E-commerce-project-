import React from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getWishlist,
    addWishlist,
    deleteWishlist
} from '../services/wishlistService'

const Productcrd = ({product}) => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const userId = localStorage.getItem("user")

    // Get user's wishlist
    const { data: userWishlist = null } = useQuery({
        queryKey: ["wishlist", userId],
        queryFn: getWishlist,
        enabled: !!userId
    })

    // Check whether this product is already in wishlist
    const isWishlisted =
        userWishlist?.items?.some(
            (item) =>
                String(item.productId) === String(product.id)
        ) || false


    // Add wishlist
    const addWishlistMutation = useMutation({
        mutationFn: (wishlistItem) =>
            addWishlist(wishlistItem),

        onSuccess: (updatedWishlist) => {
            queryClient.setQueryData(
                ["wishlist", userId],
                updatedWishlist
            )
        }
    })


    // Delete wishlist
    const deleteWishlistMutation = useMutation({
        mutationFn: ({ wishlistId, productId }) =>
            deleteWishlist(wishlistId, productId),

        onSuccess: (updatedWishlist) => {
            queryClient.setQueryData(
                ["wishlist", userId],
                updatedWishlist
            )
        }
    })


    // Wishlist button
    const handleWishlist = (e) => {

        e.stopPropagation()
        e.preventDefault()

        if (!userId) {
            navigate("/login")
            return
        }

        // If already wishlisted → remove
        if (isWishlisted) {

            deleteWishlistMutation.mutate({
                wishlistId: userWishlist.id,
                productId: product.id
            })

            return
        }

        // If not wishlisted → add
        addWishlistMutation.mutate({
            userId: userId,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image
        })
    }


    return (
        <div
            onClick={() => navigate(`/products/${product.id}`)}
            className='w-full bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition duration-300'
        >

            {/* img section */}
            <div className='relative m-4 h-[350px] rounded-2xl bg-gray-100 overflow-hidden'>

                {/* isNew badge */}
                {/* {product.isNew && (
                    <span className='absolute top-5 left-5 z-10 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        New
                    </span>
                )} */}

                {/* wishlist button */}
                <button
                    className='absolute top-5 right-5 z-10 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition'
                    onClick={handleWishlist}
                    disabled={
                        addWishlistMutation.isPending ||
                        deleteWishlistMutation.isPending
                    }
                >
                    <Heart
                        size={22}
                        strokeWidth={1.8}
                        className={
                            isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                        }
                    />
                </button>

                {/* product image */}
                <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-contain p-8 hover:scale-105 transition duration-500'
                />

            </div>

            {/* product information */}
            <div className='px-6 pb-6'>

                {/* brand */}
                <p className='text-sm font-semibold tracking-[0.25em] text-gray-500 uppercase'>
                    {product.brand}
                </p>

                {/* product name */}
                <h2 className='text-xl font-semibold text-gray-900 mt-2'>
                    {product.name}
                </h2>

                {/* product price */}
                <div className='flex items-center flex-wrap gap-3 mt-4'>

                    {/* discount price */}
                    <span className='text-2xl font-bold text-gray-900'>
                        ₹{product.price.toLocaleString()}
                    </span>

                    {/* actual price */}
                    <span className='text-base text-gray-400 line-through'>
                        {product.originalPrice.toLocaleString()}
                    </span>

                    {/* discount */}
                    <span className='text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full'>
                        {product.discount}% OFF
                    </span>

                </div>

            </div>

        </div>
    )
}

export default Productcrd
