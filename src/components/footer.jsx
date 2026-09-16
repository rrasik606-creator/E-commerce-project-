import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">

      {/* MAIN FOOTER */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-10">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 text-sm font-bold text-white">
              V
            </div>

            <span className="text-[22px] font-semibold tracking-[4px]">
              VELORA
            </span>
          </div>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
            Timeless watches designed to complement your style,
            every moment and every occasion.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">
              Home
            </Link>

            <Link to="/products" className="hover:text-gray-900">
              Collections
            </Link>

            <Link to="/about" className="hover:text-gray-900">
              About Us
            </Link>

            {/* <Link to="/contact" className="hover:text-gray-900">
              Contact
            </Link> */}
          </div>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Customer Service
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500">
            <Link to="/orders" className="hover:text-gray-900">
              My Orders
            </Link>

            <Link to="/wishlist" className="hover:text-gray-900">
              Wishlist
            </Link>

            <Link to="/cart" className="hover:text-gray-900">
              Shopping Cart
            </Link>

            {/* <Link to="/contact" className="hover:text-gray-900">
              Help & Support
            </Link> */}
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Contact Us
          </h3>

          <div className="mt-5 space-y-3 text-sm text-gray-500">
            <p>
              Email: support@velora.com
            </p>

            <p>
              Phone: +91 98765 43210
            </p>

            <p>
              Monday - Saturday
              <br />
              9:00 AM - 6:00 PM
            </p>

            {/* INSTAGRAM */}
            <div className="flex gap-5 pt-2">
              <a
                href="#"
                className="hover:text-gray-900"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-gray-500 md:flex-row lg:px-10">

          <p>
            © {new Date().getFullYear()} VELORA. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link to="#" className="hover:text-gray-900">
              Privacy Policy
            </Link>

            <Link to="#" className="hover:text-gray-900">
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;

