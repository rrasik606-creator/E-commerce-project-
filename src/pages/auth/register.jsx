import React from 'react';
import { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';

const API_URL="http://localhost:3001/users";

const Register = () => {
    // const [error,setError]=useState({name:"",username:"",email:"",password:"",confirmpassword:""});
    const[data,setData]=useState({name:"",username:"",email:"",password:"",confirmpassword:""});

    const navigate=useNavigate();
    
    const handleChange=(e)=>{
      setData({
        ...data,
        [e.target.name]:e.target.value
      });
    };


      const error={
        name:"",
        username:"",
        email:"",
        password:"",
        confirmpassword:""
      };

      const userdata={
        name:data.name,
        username:data.username,
        email:data.email,
        password:data.password
      };

     if(data.name.trim()!==""){
         if(data.name.trim().length<=2){
           error.name="Enter valid information...";
         }
     }

     if(data.username.trim()!==""){
        if(data.username.trim().length<=2||data.username.trim().length>20){
         error.username="Username must be between 3 and 20 characters...";
        }
     }

     if(data.email.trim()!==""){
        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(data.email)){
           error.email="Enter valid email...";
        }
     }

     if(data.password.trim()!==""){
        if(data.password.trim().length<8||!/[A-Z]/.test(data.password) || !/[a-z]/.test(data.password) || !/[0-9]/.test(data.password) || !/[!@#$%^&*]/.test(data.password)){
           error.password="Password must be at least 8 characters with uppercase, lowercase, number, and special character...";
        }
     }

     if(data.confirmpassword.trim()!==""){
        if(data.password.trim()!==data.confirmpassword.trim()){
           error.confirmpassword="Password do not match...";
        }
     }

    const registerHandler=async(e)=>{

      e.preventDefault();

      if(data.name.trim()===""||data.username.trim()===""||data.email.trim()===""||data.password.trim()===""||data.confirmpassword.trim()===""){
        alert("Please fill all...")
        return
      }

      if(error.name||error.username||error.email||error.password||error.confirmpassword){
        alert("Enter valid datails...")
        return
      }

      try{
          await axios.post(API_URL,userdata)
          navigate("/login")
      }
      catch{
          alert("sorry, an error occured...")
      }
    }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* REGISTER CARD */}
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
              Create Account
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-gray-900">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Join Velora and start your journey to timeless elegance.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={registerHandler}>

            {/* NAME */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                name="name"
                value={data.name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                  error.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-900"
                }`}
              />

              {error.name && (
                <p className="mt-2 text-xs text-red-500">
                  {error.name}
                </p>
              )}
            </div>

            {/* USERNAME */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                value={data.username}
                onChange={handleChange}
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

            {/* EMAIL */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                name="email"
                value={data.email}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                  error.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-900"
                }`}
              />

              {error.email && (
                <p className="mt-2 text-xs text-red-500">
                  {error.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={data.password}
                onChange={handleChange}
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

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                name="confirmpassword"
                value={data.confirmpassword}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                  error.confirmpassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-900"
                }`}
              />

              {error.confirmpassword && (
                <p className="mt-2 text-xs text-red-500">
                  {error.confirmpassword}
                </p>
              )}
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              CREATE ACCOUNT
            </button>

            {/* LOGIN */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 hover:underline"
              >
                Login
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

export default Register;

