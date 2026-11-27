import jwt from "jsonwebtoken";

import User from "../models/User.js";
import messages from "../utils/messages.js";

const authMiddleware =async(req,res,next)=>{
    let decoded;

    try{
        const token = req.cookies.accessToken;

        if(!token){
            return res.status(401).json({success:false,message:messages.ACCESS_TOKEN_REQUIRED});
        }


        decoded =jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        if(!decoded.userId){
            return res.status(401).json({
                success:false,
                message:messages.INVALID_ACCESS_TOKEN
            });
        }
    }
    catch{
        return res.status(401).json({success:false,message:messages.INVALID_ACCESS_TOKEN});
    }

    try{
        const user = await User.findById(decoded.userId).select("role blocked");

        if(!user||user.blocked){
            return res.status(401).json({
                success:false,
                message:messages.USER_NOT_FOUND_OR_BLOCKED
            });
        }

        req.user={
            ...decoded,
            userId:user._id.toString(),
            role:user.role
        };

        next();
    }
    catch(error){
        console.log("ERROR FOM MIDDLE WARE:",error);
        next(error)
    }
}

export default authMiddleware