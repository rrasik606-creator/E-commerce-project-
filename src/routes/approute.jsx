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

const Approute = () => {
  return (
    <div>
      <Routes>

        <Route path='/' element={<Home/>}/>

        <Route path='/login' element={<Login/>}/>

        <Route path='/register' element={<Register/>}/>

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

      </Routes>
    </div>
  )
}

export default Approute