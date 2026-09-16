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

const Approute = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:id' element={<Productdetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/orders' element={<Orders/>} />
      </Routes>
    </div>
  )
}

export default Approute