import React from "react";
import {
  Search,
  Mic,
  User,
  Heart,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authslice";
import { useDispatch } from "react-redux";

const Navbar = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const userId=localStorage.getItem("user");

  const handleLogout=()=>{
    localStorage.removeItem("user");
    dispatch(logout())
    navigate("/")
  }

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
        <div className="mx-5 hidden h-[43px] flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 md:flex lg:mx-8">
          <Search className="mr-3 h-[19px] w-[19px] text-gray-500" />

          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>


        {/* RIGHT ICONS */}
        <nav className="ml-auto flex w-[320px] shrink-0 items-center justify-between text-xs text-gray-600">

          <Link
            to="/account"
            className="flex w-[60px] flex-col items-center gap-1 hover:text-gray-900"
          >
            <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
            <span>Account</span>
          </Link>

          <Link
            to="/wishlist"
            className="flex w-[60px] flex-col items-center gap-1 hover:text-gray-900"
          >
            <Heart className="h-[22px] w-[22px]" strokeWidth={1.5} />
            <span>Wishlist</span>
          </Link>

          <Link
            to="/cart"
            className="flex w-[60px] flex-col items-center gap-1 hover:text-gray-900"
          >
            <ShoppingBag
              className="h-[22px] w-[22px]"
              strokeWidth={1.5}
            />
            <span>Cart</span>
          </Link>

          <Link
            to="/orders"
            className="flex w-[80px] flex-col items-center gap-1 hover:text-gray-900"
          >
            <Package
              className="h-[22px] w-[22px]"
              strokeWidth={1.5}
            />
            <span className="whitespace-nowrap">
              Order
            </span>
          </Link>


          {/* Sign Up/Login */}
          {    
          userId?(
            <button onClick={handleLogout} className="rounded-md bg-gray-900 px-3 py-2 font-medium text-white transition hover:bg-gray-700">
              Logout
              </button>
          )      
          :
           (<Link to="/register" className="rounded-md bg-gray-900 px-3 py-2 font-medium text-white transition active:bg-gray-700">
             Sign Up/Login
           </Link>)
          }

        </nav>
      </div>


      {/* WEBSITE NAVIGATION */}
      <div className="border-t border-gray-100">

        <nav className="flex h-[52px] items-center justify-center gap-10 text-sm font-medium text-gray-700">

          <Link
            to="/"
            className="transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="transition hover:text-black"
          >
            Collections
          </Link>

          <Link
            to="/about"
            className="transition hover:text-black"
          >
            About Us
          </Link>

          {/* <Link
            to="/contact"
            className="transition hover:text-black"
          >
            Contact
          </Link> */}

        </nav>

      </div>


      {/* SEARCH */}
      <div className="mx-6 mb-4 flex h-[43px] items-center rounded-lg border border-gray-200 bg-gray-50 px-4 md:hidden">

        <Search className="mr-3 h-5 w-5 text-gray-500" />

        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />

      </div>

    </header>
  );
};

export default Navbar;