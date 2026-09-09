import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/slices/authslice'

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
    if(data.password.trim().length<8||!/[A-Z]/.test(data.password) || !/[a-z]/.test(data.password) || !/[0-9]/.test(data.password) || !/[!@#$%^&*]/.test(data.password)){
      error.password="Password must be at least 8 characters with uppercase, lowercase, number, and special character...";
    }
  }

  const loginHandler=async(e)=>{
    e.preventDefault();

    if(data.username.trim()===""||data.password.trim()===""){
      alert("Please fill all...")
      return
    }
    if(error.username||error.password){
      alert("Enter valid details...");
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
      const session=await axios.post("http://localhost:3001/sessions",{userId:check.id});
      const loggedUser={
        id:check.id,
        name:check.name,
        username:check.username,
        email:check.email
      };
      dispatch(login({user:loggedUser,sessionId:session.data.id}))
      localStorage.setItem("user",JSON.stringify(loggedUser));
      localStorage.setItem("sessiionId",session.data.id);
      alert("login successfully!");
      navigate('/home');
    }
    else{
      alert("Invalid email or password...")
    }
    }
    catch(error){
      console.log(error)
      alert("Somthing went to wrong...");
    }
}  

  return (
    <div>
      <p>WELCOM BACK</p>
      <h1>login to your account</h1>
      <p>Sign  in to continue shoping your favoriete watches</p>
      <form onSubmit={loginHandler}>
        <input
        type="text" 
        placeholder='Username'
        onChange={handleChange}
        name="username"
        value={data.username}
        /> <br />
        <p>{error.username}</p>
        <input
        type="password"
        placeholder='Password'
        onChange={handleChange}
        name='password'
        value={data.password}
        /> <br />
        <p>{error.password}</p>
        <br />
        <button type='submit'>LOGIN</button>
        <p>Don't have an account?<Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}

export default Login