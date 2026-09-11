import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import Home from '../pages/user/home'
import Products from '../pages/user/products'
import productdetails from '../pages/user/productdetails'

const Approute = () => {
  return (
    <div>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/login' Component={Login}/>
        <Route path='/register' Component={Register}/>
        <Route path='/products' Component={Products}/>
        <Route path='/products/:id' Component={productdetails}/>
      </Routes>
    </div>
  )
}

export default Approute
