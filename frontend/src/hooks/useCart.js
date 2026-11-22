import { useEffect,useState } from "react";
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
  addCart,
} from "../services/cartService";

import { setCart } from "../redux/slices/cartslice";

const useCart = () => {

  const[updateingProductId,setUpdatingProductId]=useState(null);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user=useSelector((state)=>state.auth.user);
  const userId=user?.id


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


  // Add to cart
  const addToCartMutation = useMutation({

    mutationFn: (cartItem) =>addCart(cartItem),

    onSuccess: (updatedCart) => {

      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );

      toast.success("Product added to cart!");

    },

  });


  // Handle adding product
  const handleAddToCart = (product, quantity=1) => {

    if (!userId) {
      navigate("/login");
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity,
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
      updateCart(productId, quantity),

    onMutate:({productId})=>{
      setUpdatingProductId(productId);
    },

    onSettled:()=>{
      setUpdatingProductId(null)
    },

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
      deleteCart(productId),

    onSuccess: (updatedCart) => {

      dispatch(setCart(updatedCart.items));

      queryClient.setQueryData(
        ["cart", userId],
        updatedCart
      );

      toast.success("Item removed from cart");

    },

  });


  //Delete handler
  const handleDelete = async (item) => {
    const product=item.productId;

    const confirmDelete = await Swal.fire({
      title: "Remove item?",
      text: `Remove "${product.name}" from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes,Remove",
      cancelButtonText: "Cancel"
    });


    if (!confirmDelete.isConfirmed) {
      return;
    }


    deleteMutation.mutate(product._id);

  };


  // Subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.productId.price * item.quantity,
    0
  );


  // Total
  const total = subtotal;


  return {
    userId,
    userCart,
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
    total,
    updateingProductId
  };
};


export default useCart;