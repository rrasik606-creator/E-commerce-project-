import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/slices/authslice'
import toast from 'react-hot-toast'

const API_URL="http://localhost:3001/users";

const Login = () => {
  const[data,setData]=useState({username:"",password:""})
  // const[error,setError]=useState({})

  const navigate=useNavigate();
  const dispatch=useDispatch();
  
  const handleChange=(e)=>{
    setData({
      ...data,
      [e.target.name]:e.target.value
    });
  }

  const error={
    password:"",
    username:""
  };

  if(data.username.trim()!==""){
    if(data.username.trim().length<=2||data.username.trim().length>20){
      error.username="Username must be between 3 and 20 characters..."
    }
  }

  if(data.password.trim()!==""){
    if(data.password.trim().length<8){
      error.password="Password must be at least 8 characters...";
    }
  }

  const loginHandler=async(e)=>{
    e.preventDefault();

    if(data.username.trim()===""||data.password.trim()===""){
      toast.error("Please fill all...")
      return
    }

    if(error.username||error.password){
      toast.error("Enter valid details...");
      return
    }

    try{
      const res=await axios.get(API_URL);

      const check=res.data.find(
        (user)=>
          user.username===data.username &&
          user.password===data.password
      );

      console.log(check);

      if(check){
        const loggedUser={
          id:check.id,
          name:check.name,
          username:check.username,
          email:check.email
        };

        dispatch(login({user:loggedUser}))
        localStorage.setItem("user",check.id);

        toast.success("login successful!");
        navigate('/');
      }
      else{
        toast.error("Invalid username or password...")
      }
    }
    catch(error){
      console.log(error)
      toast.error("Something went wrong...");
    }
  }  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* LOGIN CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-10">

          {/* LOGO */}
          <div className="flex justify-center mb-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-lg font-bold text-white">
              V
            </div>
          </div>

          {/* HEADING */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-[3px] text-gray-500 uppercase">
              Welcome Back
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-gray-900">
              Login to your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sign in to continue shopping your favorite watches
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={loginHandler}>

            {/* USERNAME */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                onChange={handleChange}
                name="username"
                value={data.username}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                  error.username
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-900"
                }`}
              />

              {error.username && (
                <p className="mt-2 text-xs text-red-500">
                  {error.username}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                name="password"
                value={data.password}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                  error.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-900"
                }`}
              />

              {error.password && (
                <p className="mt-2 text-xs leading-5 text-red-500">
                  {error.password}
                </p>
              )}
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              LOGIN
            </button>

            {/* REGISTER */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-gray-900 hover:underline"
              >
                Register
              </Link>
            </p>

          </form>
        </div>

        {/* FOOTER TEXT */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} VELORA. All rights reserved.
        </p>

      </div>
    </div>
  )
}

export default Login

