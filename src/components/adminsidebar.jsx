import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart, 
    User,
    LogOut
} from 'lucide-react';

import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authslice';
import toast from 'react-hot-toast';

const AdminSidbar = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {

        const confirmLogout = window.confirm("Are you sure you want to logout?");

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("user");
        localStorage.removeItem("userRole");

        dispatch(logout());

        toast.success("Logout successful");

        navigate("/login");
    };

    return (
        <div className='fixed left-0 top-0 w-64 min-h-screen bg-gray-900 text-white p-5 flex flex-col'>

            <h1 className='text-2xl font-bold mb-8'>
                VELORA
            </h1>

            <nav className='space-y-2'>

                <Link 
                    to="/admin" 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                        location.pathname === "/admin"
                            ? "bg-white text-black"
                            : "hover:bg-gray-800"
                    }`}
                >
                    <LayoutDashboard size={20}/>
                    Dashboard        
                </Link>

                <Link 
                    to="/admin/product" 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                        location.pathname === "/admin/product"
                            ? "bg-white text-black"
                            : "hover:bg-gray-800"
                    }`}
                >
                    <Package size={20}/>
                    Product        
                </Link>

                <Link 
                    to="/admin/user" 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                        location.pathname === "/admin/user"
                            ? "bg-white text-black"
                            : "hover:bg-gray-800"
                    }`}
                >
                    <User size={20}/>
                    User        
                </Link>

                <Link 
                    to="/admin/orders" 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                        location.pathname === "/admin/orders"
                            ? "bg-white text-black"
                            : "hover:bg-gray-800"
                    }`}
                >
                    <ShoppingCart size={20}/>
                    Orders        
                </Link>

            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className='flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 mt-auto w-full text-left'
            >
                <LogOut size={20}/>
                Logout
            </button>

        </div>
    )
}

export default AdminSidbar