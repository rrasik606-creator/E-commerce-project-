import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken=(user)=>{
    return jwt.sign(
        {
            userId:user._id,
            role:user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES||"15m"
        }
    );
};

export const generateRefreshToken=(user)=>{
    return jwt.sign(
        {
            userId:user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES||"7d"
        }
    );
};

export const hashRefreshToken=(token)=>{
    return crypto
           .createHash("sha256")
           .update(token)
           .digest("hex")
};