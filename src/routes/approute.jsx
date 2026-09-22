import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

import Home from "../pages/user/home";
import Products from "../pages/user/products";
import Productdetails from "../pages/user/productdetails";
import Cart from "../pages/user/cart";
import Wishlist from "../pages/user/wishlist";
import Checkout from "../pages/user/checkout";
import Orders from "../pages/user/orders";
import About from "../pages/user/about";

import ProtectedRoute from "./protectedroute";
import GuestRoute from "./guestroute";
import UserProtectedRoute from "./userprotectedroute";
import AdminProtectedRout from "./adminprotectedrout";

import Dashboard from "../pages/admin/dashboard";
import AdminOrders from "../pages/admin/orders";
import AdminProducts from "../pages/admin/product";
import AdminUsers from "../pages/admin/users";
import AddProduct from "../pages/admin/addproduct";
import EditProduct from "../pages/admin/editproduct";

const Approute = () => {

    return (
        <div>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    }
                />


                {/* USER ROUTES */}

                <Route
                    path="/"
                    element={
                        <UserProtectedRoute>
                            <Home />
                        </UserProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <UserProtectedRoute>
                            <Products />
                        </UserProtectedRoute>
                    }
                />

                <Route
                    path="/products/:id"
                    element={
                        <UserProtectedRoute>
                            <Productdetails />
                        </UserProtectedRoute>
                    }
                />

                <Route
                    path="/about"
                    element={
                        <UserProtectedRoute>
                            <About />
                        </UserProtectedRoute>
                    }
                />


                {/* USER PROTECTED ROUTES */}

                <Route
                    path="/cart"
                    element={
                        <UserProtectedRoute>
                            <Cart />
                        </UserProtectedRoute>
                    }
                />

                <Route
                    path="/wishlist"
                    element={
                        <UserProtectedRoute>
                            <Wishlist />
                        </UserProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <UserProtectedRoute>
                            <Checkout />
                        </UserProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <UserProtectedRoute>
                            <Orders />
                        </UserProtectedRoute>
                    }
                />


                {/* ADMIN ROUTES */}

                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRout>
                            <Dashboard />
                        </AdminProtectedRout>
                    }
                />

                <Route
                    path="/admin/product"
                    element={
                        <AdminProtectedRout>
                            <AdminProducts />
                        </AdminProtectedRout>
                    }
                />

                <Route
                    path="/admin/product/add"
                    element={
                        <AdminProtectedRout>
                            <AddProduct />
                        </AdminProtectedRout>
                    }
                />

                <Route
                path="/admin/product/edit/:id"
                element={
                  <AdminProtectedRout>
                    <EditProduct/>
                  </AdminProtectedRout>        
                }
                />

                <Route
                    path="/admin/user"
                    element={
                        <AdminProtectedRout>
                            <AdminUsers />
                        </AdminProtectedRout>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <AdminProtectedRout>
                            <AdminOrders />
                        </AdminProtectedRout>
                    }
                />

            </Routes>

        </div>
    );
};

export default Approute;