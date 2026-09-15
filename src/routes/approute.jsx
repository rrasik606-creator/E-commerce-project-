import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import Home from '../pages/user/home'
import Products from '../pages/user/products'
import Productdetails from '../pages/user/productdetails'
import Cart from '../pages/user/cart'

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
      </Routes>
    </div>
  )
}

export default Approute
