import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import { 
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart, 
    User
} from 'lucide-react';

const AdminSidbar = () => {

    const location =useLocation();

  return (
    <div className='w-64 min-h-screen bg-gray-900 text-white p-5'>

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
      
    </div>
  )
}

export default AdminSidbar
