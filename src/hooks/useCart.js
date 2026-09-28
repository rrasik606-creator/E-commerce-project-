import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";

import {
  getcart,
  updateCart,
  deleteCart,
  addCart,
} from "../services/cartService";

import { setCart } from "../redux/slices/cartslice";

const API_URL = "http://localhost:3001/products";

const useCart = () => {

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user");


  const getProduct = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };


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


  // Get products
  const {
    data: products = [],
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });


  // Cart id
  const cartId = userCart?.id;


  // Add to cart
  const addToCartMutation = useMutation({

    mutationFn: (cartItem) =>
      addCart(cartItem),

    onSuccess: (updatedCart) => {

      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );

      toast.success("Product added to cart!");

    },

  });


  // Add product to cart
  const handleAddToCart = (product, quantity) => {

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

    addToCartMutation.mutate(cartItem);

  };


  // Update Redux with latest cart
  useEffect(() => {

    if (userId) {
      dispatch(setCart(userCart?.items || []));
    } else {
      dispatch(setCart([]));
    }

  }, [userCart, userId, dispatch]);


  // Cart items
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


  // Confirm before removing item
  const handleDelete = async (item) => {

    const confirmDelete = await Swal.fire({

      title: "Remove item?",

      text: `Remove "${item.name}" from your cart?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes,Remove",

      cancelButtonText: "Cancel"

    });


    if (!confirmDelete.isConfirmed) {
      return;
    }


    deleteMutation.mutate(item.productId);

  };


  // Subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  // Total
  const total = subtotal;


  return {
    userId,
    userCart,
    products,
    cart,
    isLoading,
    isError,
    navigate,
    addToCartMutation,
    handleAddToCart,
    updateMutation,
    deleteMutation,
    handleDelete,
    subtotal,
    total
  };
};


export default useCart;