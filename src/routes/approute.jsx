import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import Home from '../pages/user/home'
import Products from '../pages/user/products'
import Productdetails from '../pages/user/productdetails'
import Cart from '../pages/user/cart'
import Wishlist from '../pages/user/wishlist'
import Checkout from '../pages/user/checkout'
import Orders from '../pages/user/orders'
import About from '../pages/user/about'
import ProtectedRoute from './protectedroute'
import GuestRoute from './guestroute'
import AdminProtectedRout from './adminprotectedrout'
import Dashboard from '../pages/admin/dashboard'
import AdminOrders from '../pages/admin/orders'
import AdminProducts from '../pages/admin/product'
import AdminUsers from '../pages/admin/users'

const Approute = () => {
  return (
    <div>
      <Routes>

        <Route path='/' element={<Home/>}/>

        <Route
          path='/login'
          element={
            <GuestRoute>
              <Login/>
            </GuestRoute>
          }
        />

        <Route
          path='/register'
          element={
            <GuestRoute>
              <Register/>
            </GuestRoute>
          }
        />

        <Route path='/products' element={<Products/>}/>

        <Route path='/products/:id' element={<Productdetails/>}/>

        {/* PROTECTED ROUTES */}

        <Route
          path='/cart'
          element={
            <ProtectedRoute>
              <Cart/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/wishlist'
          element={
            <ProtectedRoute>
              <Wishlist/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/checkout'
          element={
            <ProtectedRoute>
              <Checkout/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders/>
            </ProtectedRoute>
          }
        />

        <Route path='/about' element={<About/>}/>

        {/* admin protect route */}
        <Route
         path='/admin'
         element={
          <AdminProtectedRout>
            <Dashboard/>
          </AdminProtectedRout>
         }
        />

        <Route 
         path='/admin/product'
         element={
          <AdminProtectedRout>
            <AdminProducts/>
          </AdminProtectedRout>
         }
        />

        <Route
          path='/admin/user'
          element={
            <AdminProtectedRout>
              <AdminUsers/>
            </AdminProtectedRout>
          }
        />

        <Route
         path='/admin/orders'
         element={
          <AdminProtectedRout>
          <AdminOrders/>
          </AdminProtectedRout>
         }
        />

      </Routes>
    </div>
  )
}

export default Approute