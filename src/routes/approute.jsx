import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import Home from '../pages/user/home'

const Approute = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' Component={Login}/>
        <Route path='/register' Component={Register}/>
        <Route path='/home' Component={Home}/>
      </Routes>
    </div>
  )
}

export default Approute
