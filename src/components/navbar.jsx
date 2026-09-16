import React, { useEffect, useState } from "react";
import {
  Search,
  Mic,
  User,
  Heart,
  ShoppingBag,
  Package,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authslice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getcart } from "../services/cartService";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user");

  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);

  // Search state
  const [search, setSearch] = useState("");

  // Get cart from server
  const { data: cart } = useQuery({
    queryKey: ["cart", userId],
    queryFn: getcart,
    enabled: !!userId,
  });

  // Calculate cart count
  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  // Get user details
  useEffect(() => {
    const getUser = async () => {
      if (!userId) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/users/${userId}`
        );

        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [userId]);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(searchValue)}`
    );
  };

  // Clear search
  const handleClearSearch = () => {
    setSearch("");
    navigate("/products");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    setUser(null);
    setShowAccount(false);
    navigate("/");
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white">

      {/* TOP NAVBAR */}
      <div className="flex h-[80px] items-center px-6 md:px-10 lg:px-[5%]">

        {/* LOGO */}
        <div className="flex w-[190px] shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 text-sm font-bold text-white">
            V
          </div>

          <span className="text-[22px] font-semibold tracking-[4px]">
            VELORA
          </span>
        </div>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="mx-5 hidden h-[43px] flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 md:flex lg:mx-8"
        >
          <Search className="mr-3 h-[19px] w-[19px] text-gray-500" />

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-2 text-gray-400 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* RIGHT ICONS */}
        <nav className="ml-auto flex w-[320px] shrink-0 items-center justify-between text-xs text-gray-600">

          {/* ACCOUNT */}
          <div className="relative">

            <button
              onClick={() => setShowAccount(!showAccount)}
              className="flex flex-col items-center gap-1 hover:text-gray-900"
            >
              <User className="h-5 w-5" />
              <span>Account</span>
            </button>

            {showAccount && (
              <div className="absolute right-0 top-10 z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">

                {user ? (
                  <>
                    {/* USER DETAILS */}
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">

                      {/* FIRST LETTER */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>

                      {/* NAME + EMAIL */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="mt-3 w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* NOT LOGGED IN */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-900">
                        Welcome to VELORA
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Login to access your account
                      </p>
                    </div>

                    {/* LOGIN */}
                    <Link
                      to="/login"
                      onClick={() => setShowAccount(false)}
                      className="block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Login
                    </Link>

                    {/* CREATE ACCOUNT */}
                    <Link
                      to="/register"
                      onClick={() => setShowAccount(false)}
                      className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Create Account
                    </Link>
                  </>
                )}

              </div>
            )}

          </div>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="flex flex-col items-center gap-1 hover:text-gray-900"
          >
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center gap-1 hover:text-gray-900"
          >
            <ShoppingBag className="h-5 w-5" />

            {/* CART COUNT */}
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}

            <span>Cart</span>
          </Link>

          {/* ORDERS */}
          <Link
            to="/orders"
            className="flex flex-col items-center gap-1 hover:text-gray-900"
          >
            <Package className="h-5 w-5" />
            <span>Orders</span>
          </Link>

          {/* LOGIN BUTTON */}
          {!userId && (
            <Link
              to="/login"
              className="flex flex-col items-center gap-1 hover:text-gray-900"
            >
              <span className="rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white">
                Login
              </span>
            </Link>
          )}

        </nav>
      </div>

      {/* WEBSITE NAVIGATION */}
      <div className="hidden h-[50px] items-center justify-center border-t border-gray-100 md:flex">
        <nav className="flex items-center gap-10 text-sm text-gray-600">

          <Link
            to="/"
            className="hover:text-gray-900"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-gray-900"
          >
            Collections
          </Link>

          <Link
            to="/about"
            className="hover:text-gray-900"
          >
            About Us
          </Link>

        </nav>
      </div>

      {/* MOBILE SEARCH */}
      <form
        onSubmit={handleSearch}
        className="flex px-6 pb-4 md:hidden"
      >
        <div className="flex h-[42px] w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-4">

          <Search className="mr-3 h-[18px] w-[18px] text-gray-500" />

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-2 text-gray-400 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

        </div>
      </form>

    </header>
  );
};

export default Navbar;