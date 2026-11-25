import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Session from "../models/Session.js";
import { generateAccessToken,generateRefreshToken,hashRefreshToken } from "../utils/generateTokens.js";
import messages from "../utils/messages.js";

const refreshCookieOptions={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    maxAge:7*24*60*60*1000,
    path:"/auth"
}

const accessCookieOptions={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    maxAge:15*60*1000,
    path:"/"
}

export const register=async(req,res)=>{
    try{
        const {name,username,email,password}=req.body;

        if(!name||!username||!email||!password){
            return res.status(400).json({success:false,message:messages.ALL_FIELDS_REQUIRED});
        }

        const existingUser=await User.findOne({email:email.toLowerCase().trim()});

        if(existingUser){
            return res.status(409).json({success:false,message:messages.EMAIL_ALREADY_EXISTS});
        }

        const user = await User.create({
            name:name.trim(),
            username:username.trim(),
            email:email.toLowerCase().trim(),
            password:password
        });


        return res.status(201).json({
            success:true,
            message:messages.REGISTRATION_SUCCESSFUL,
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
        if(error.code===11000){
            return res.status(409).json({success:false,message:messages.EMAIL_ALREADY_EXISTS})
        }
        return res.status(500).json({success:false,message:messages.INTERNAL_SERVER_ERROR,error:error.message});
    }
};


export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({success:false,message:messages.EMAIL_PASSWORD_REQUIRED});
        }

        const user = await User.findOne({email:email.toLowerCase().trim()});

        if(!user){
           return res.status(401).json({success:false,message:messages.INVALID_CREDENTIALS});
        }

        if(user.blocked){
            return res.status(403).json({success:false,message:messages.ACCOUNT_BLOCKED});
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({success:false,message:messages.INVALID_CREDENTIALS});
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
            "accessToken",
            accessToken,
            accessCookieOptions
        )

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOptions
        )

        return res.status(200).json({
            success:true,
            message:messages.LOGIN_SUCCESSFUL,
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
        return res.status(500).json({success:false,message:messages.INTERNAL_SERVER_ERROR,error:error.message});
    }
};



export const refresh=async(req,res)=>{
    try{
        const token =req.cookies?.refreshToken;

        if(!token){
            return res.status(401).json({success:false,message:messages.REFRESH_TOKEN_REQUIRED});
        }

        let decoded;

        try{
         decoded=jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );
        }
        catch(error){
            return res.status(401).json({success:false,message:messages.INVALID_REFRESH_TOKEN});
        }


        const user =await User.findById(decoded.userId);

        if(!user||user.blocked){
            return res.status(401).json({success:false,message:messages.USER_NOT_FOUND_OR_BLOCKED});
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
            return res.status(401).json({success:false,message:messages.REFRESH_TOKEN_EXPIRED_OR_USED});
        }

        const newAccessToken=generateAccessToken(user);


        res.cookie(
            "accessToken",
            newAccessToken,
            accessCookieOptions
        )

        res.cookie(
            "refreshToken",
            newRefreshToken,
            refreshCookieOptions
        )

        return res.status(200).json({
            success:true,
            message:messages.TOKEN_REFRESHED,
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
        return res.status(500).json({success:false,message:messages.INTERNAL_SERVER_ERROR,error:error.message});
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
            "accessToken",
            {...accessCookieOptions,maxAge:undefined}
        )

        res.clearCookie(
            "refreshToken",
            {...refreshCookieOptions,maxAge:undefined}
        );

        return res.status(200).json({success:true,message:messages.LOGOUT_SUCCESSFUL});
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:messages.INTERNAL_SERVER_ERROR,
            error:error.message
        });
    }
};

export const profile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.userId).select("-password");

        if(!user||user.blocked){
            return res.status(401).json({
                success:false,
                message:messages.USER_NOT_FOUND_OR_BLOCKED
            });
        }

        return res.status(200).json({
            success:true,
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
        return res.status(500).json({
            success:false,
            message:messages.INTERNAL_SERVER_ERROR
        });
    }
};