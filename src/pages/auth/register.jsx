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
          await axios.post("http://localhost:3001/role",)
          navigate("/login")
      }
      catch{
          alert("sorry, an error occured...")
      }
    }

  return (
    <div>
      <p>CREATE ACCOUNT</p>
      <h1>Create your account</h1>
      <p>Join Velora and start your journy to timeless elegance.</p>
      <form onSubmit={registerHandler}>
        <input
        type="text"
        placeholder='Full Name'
        name='name'
        value={data.name}
        onChange={handleChange}
        /> <br />
        <p>{error.name}</p>
        <input
        type="text"
        placeholder='Username'
        name='username'
        value={data.username}
        onChange={handleChange}
        />  <br />
        <p>{error.username}</p>
        <input 
        type="email"
        placeholder='Email Address'
        name='email'
        value={data.email}
        onChange={handleChange}
        /> <br />
        <p>{error.email}</p>
        <input
        type="password"
        placeholder='Password'
        name='password'
        value={data.password}
        onChange={handleChange}
        /> <br />
        <p>{error.password}</p>
        <input
        type="password"
        placeholder='Confirm Password'
        name='confirmpassword'
        value={data.confirmpassword}
        onChange={handleChange}
        /> <br />
        <p>{error.confirmpassword}</p>
        <br />
        <button type="submit">CREATE ACCOUNT</button>
        <p>Already have an account?<Link to="/login">Login</Link></p>
        
      </form>
    </div>
  )
}

export default Register;

