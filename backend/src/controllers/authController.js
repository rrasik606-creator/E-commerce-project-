import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Session from "../models/Session.js";
import { generateAccessToken,generateRefreshToken,hashRefreshToken } from "../utils/generateTokens.js";

const refreshCookieOptions={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    maxAge:7*24*60*60*1000,
    path:"/auth"
}

export const register=async(req,res)=>{
    try{
        const {name,username,email,password}=req.body;

        if(!name||!username||!email||!password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const existingUser=await User.findOne({$or:[{email:email.toLowerCase().trim()},{username:username.trim()}]});

        if(existingUser){
            return res.status(409).json({success:false,message:"Email or username already exists"});
        }

        const user = await User.create({
            name,username,email,password
        });


        return res.status(201).json({
            success:true,
            message:"Registration successful",
            user:{
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        return res.status(500).json({success:false,message:"Internal server error",error:error.message});
    }
};


export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({success:false,message:"Email and password are required"});
        }

        const user = await User.findOne({email:email.toLowerCase().trim()});

        if(!user){
           return res.status(401).json({success:false,message:"Invalid email or password"});
        }

        if(user.blocked){
            return res.status(403).json({success:false,message:"Your account has been blocked"});
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({success:false,message:"Invalid email or password"});
        }

        const accessToken=generateAccessToken(user);
        const refreshToken=generateRefreshToken(user);

        const refreshTokenHash=hashRefreshToken(refreshToken);

        await Session.create({
            userId:user._id,
            refreshTokenHash,
            expiresAt:new Date(Date.now()+7*24*60*60*1000)
        });

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOptions
        )

        return res.status(200).json({
            success:true,
            message:"Login successful",
            accessToken,
            user:{
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        return res.status(500).json({success:false,message:"Internal server error",error:error.message});
    }
};



export const refresh=async(req,res)=>{
    try{
        const token =req.cookies?.refreshToken;

        if(!token){
            return res.status(401).json({success:false,message:"Refresh token is required"});
        }

        let decoded;

        try{
         decoded=jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );
        }
        catch(error){
            return res.status(401).json({success:false,message:"Invalid or expired refresh token"});
        }


        const user =await User.findById(decoded.userId);

        if(!user||user.blocked){
            return res.status(401).json({success:false,message:"User not found or account blocked"});
        }

        const newRefreshToken=generateRefreshToken(user);

        const oldRefreshTokenHash = hashRefreshToken(token);
        const newRefreshTokenHash=hashRefreshToken(newRefreshToken)

        const session=await Session.findOneAndUpdate(
            {
                userId:user._id,
                refreshTokenHash:oldRefreshTokenHash,
                expiresAt:{$gt:new Date()}
            },
            {
                $set:{
                    refreshTokenHash:newRefreshTokenHash,
                    expiresAt:new Date(Date.now()+7*24*60*60*1000)
                }
            },
            {new:true}
        );

        if(!session){
            return res.status(401).json({success:false,message:"Refresh token has already been used or expired"});
        }

        const newAccessToken=generateAccessToken(user);


        res.cookie(
            "refreshToken",
            newRefreshToken,
            refreshCookieOptions
        )

        return res.status(200).json({
            success:true,
            message:"Token refreshed successfully",
            accessToken:newAccessToken,
            user:{
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        return res.status(500).json({success:false,message:"Internal server error",error:error.message});
    }
};


export const logout=async(req,res)=>{
    try{
        const token=req.cookies?.refreshToken;
        
        if(token){
            const refreshTokenHash=hashRefreshToken(token);

            await Session.findOneAndDelete({refreshTokenHash})
        }

        res.clearCookie(
            "refreshToken",
            {...refreshCookieOptions,maxAge:undefined}
        );

        return res.status(200).json({success:true,message:"Logout successful"});
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
};